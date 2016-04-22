/**
 *  woo-promise - WooCommerce api wrapper
 *  File: index.js
 *  We need to define "use strict", so we're doing it here.
 */
"use strict";

/**
 * Continue with the main functionality.
 */

const WooCommerceApi = require('woocommerce-api');
const EventEmitter = require('events').EventEmitter;
const sprintf = require('sprintf-js').sprintf;
const vsprintf = require('sprintf-js').vsprintf;
const endpoints = require('./endpoints');

class WooError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

class WooPromise extends EventEmitter {
  constructor(options) {
    super();

    //set the woocommerce-api config
    this.wooapiconfig = {
      url: options.url,
      consumerKey : options.consumerKey,
      consumerSecret : options.consumerSecret,
      version: options.version || 'v3',
      verifySsl : typeof options.verifySsl == 'boolean' ? options.verifySsl : true,
      encoding: options.encoding || 'utf-8',
      queryStringAuth: typeof options.queryStringAuth == 'boolean' ? options.queryStringAuth : false,
      port: options.port || undefined
    }

    //remove these options from our config
    delete options.url;
    delete options.consumerKey;
    delete options.consumerSecret;
    delete options.version;
    delete options.verifySsl;
    delete options.encoding;
    delete options.queryStringAuth;
    delete options.port;

    this.config = {
      flatten : typeof options.flatten == 'boolean' ? options.flatten : true
    }
    this.api = {};

    this.apiVerbs = {
      'GET'    : { name: 'get%s',  method: this._getAbstract.bind(this) },
      'POST'   : { name: 'post%s', method: this._postAbstract.bind(this) },
      'PUT'    : { name: 'put%s',  method: this._putAbstract.bind(this) },
      'DELETE' : { name: 'del%s',  method: this._deleteAbstract.bind(this) }
    }

    //the paths
    this.urls = endpoints;
  }

  _buildUrl(url, urlArgs, args, arrayArgs) {
    if (urlArgs.length > 1) {
      let sprintfArgs = [];
      //validate the args and push in the right order to sprintf
      for (let k = 1; k < urlArgs.length; k++) {
        let key = urlArgs[k];
        if(!args[key] && typeof arrayArgs[k-1] != 'object' ) {
          args[key] = arrayArgs[k-1];
        }
        if(!args[key]) {
          return Promise.reject('Unspecified parameter: '+key);
        }
        sprintfArgs.push(args[key]);
      }
      url = vsprintf(url, sprintfArgs);
    }
    return url;
  }

  _getAbstract(urlArgs, url){
    return function() {
      let arrayArgs = Array.prototype.slice.call(arguments);
      let args = typeof arguments[0] == 'object' ? arguments[0] : {};
      let parsedUrl = this._buildUrl(url, urlArgs, args, arrayArgs);
      return this.get(parsedUrl);
    }.bind(this);
  }

  _postAbstract(urlArgs, url){
    return function() {
      let arrayArgs = Array.prototype.slice.call(arguments);
      //assume the last argument is the data
      let data = arrayArgs.pop();
      let args = typeof arrayArgs[0] == 'object' ? arguments[0] : {};
      let parsedUrl = this._buildUrl(url, urlArgs, args, arrayArgs);
      return this.post(parsedUrl, data);
    }.bind(this);
  }

  _putAbstract(urlArgs, url){
    return function() {
      let arrayArgs = Array.prototype.slice.call(arguments);
      //assume the last argument is the data
      let data = arrayArgs.pop();
      let args = typeof arrayArgs[0] == 'object' ? arguments[0] : {};
      let parsedUrl = this._buildUrl(url, urlArgs, args, arrayArgs);
      return this.put(parsedUrl, data);
    }.bind(this);
  }

  _deleteAbstract(){
    return function() {
      let arrayArgs = Array.prototype.slice.call(arguments);
      let args = typeof arguments[0] == 'object' ? arguments[0] : {};
      let parsedUrl = this._buildUrl(url, urlArgs, args, arrayArgs);
      return this.delete(parsedUrl);
    }.bind(this);
  }



  init() {
    try{
      this.api = new WooCommerceApi(this.wooapiconfig);
    } catch(e) {
      return Promise.reject(e);
    }
    return this.get(this.urls.info)
      .then(data => {
        if(this.config.flatten == false) {
          data = data.store;
        }
        this._wooRoutes = data.routes;
        this._buildMethods(this.urls, this);
        return this
      })
  }

  _buildMethods(urls, baseObj, containerCode) {
    for (let code of Object.keys(urls)) {
      if(code == 'index') continue;

      let url = urls[code];
      if (typeof url != 'string') {
        let childObj = this._buildMethods(url, {});
        baseObj[code] =  childObj;
        if(url.index) {
          url = url.index
        }
      }

      //BUild a regex of the URL
      let pattern = sprintf(url, '<([a-z_]+)>', '<([a-z_]+)>', '<([a-z_]+)>', '<([a-z_]+)>');
      let regex = new RegExp('^' + pattern + '$', 'i');
      let urlInfo = false;
      for( let wooPath of Object.keys(this._wooRoutes)) {
        let match = wooPath.match(regex);
        if(!match) continue;
        urlInfo = {
          match: match,
          wooInfo: this._wooRoutes[wooPath]
        }
      }

      //no route match with the woo incoming
      if(!urlInfo) continue;
      let functionName = code == 'info' ? '' : this._formatName(code);
      for(let method of urlInfo.wooInfo.supports) {
        if(this.apiVerbs[method]) {
          let apiMethod = this.apiVerbs[method];
          let fnctName = code == 'count' ? code : sprintf(apiMethod.name, functionName);
          baseObj[fnctName] = apiMethod.method(urlInfo.match, url);
        }
      }
    }

    return baseObj;
  }

  _formatName(name) {
    return name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
  }

  get(path) {
    return new Promise((resolve, reject) => {
      path = path.replace(/^\/|\/$/g, '');
      this.api.get(path, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        this._parseResponse(body, resolve, reject);
      });
    })
  }

  post(path, data) {
    return new Promise((resolve, reject) => {
      path = path.replace(/^\/|\/$/g, '');
      this.api.post(path, data, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        this._parseResponse(body, resolve, reject);
      });
    })
  }

  put(path, data) {
    return new Promise((resolve, reject) => {
      path = path.replace(/^\/|\/$/g, '');
      this.api.put(path, data, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        this._parseResponse(body, resolve, reject);
      });
    })
  }

  delete(path) {
    return new Promise((resolve, reject) => {
      path = path.replace(/^\/|\/$/g, '');
      this.api.delete(path, (err, res, data) => {
        if (err) {
          return reject(err);
        }
        this._parseResponse(body, resolve, reject);
      });
    })
  }

  _parseResponse(body, resolve, reject) {
    if (typeof body == 'string') {
      try {
        body = JSON.parse(body);
        if(body.errors) {
          throw new WooError(body.errors[0].message, body.errors[0].code);
        }
        if(this.config.flatten && Object.keys(body).length == 1) {
          body = body[Object.keys(body)[0]];
        }
      } catch(e) {
        return reject(e);
      }
    }
    return resolve(body);
  }
}

module.exports = WooPromise;

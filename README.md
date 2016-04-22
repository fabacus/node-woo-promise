# WooPromise - Promisified WooCommerce API Wrapper

This is a node.js promisification wrapper for [WooCommerce API](https://github.com/woothemes/wc-api-node/). Easily interact with the WooCommerce REST API, without worrying about the URLs to use or URL formatting.

[![dependency status](https://david-dm.org/fabacus/node-woo-promise.svg)](https://david-dm.org/fabacus/node-woo-promise)
[![npm version](https://img.shields.io/npm/v/woo-promise.svg)](https://www.npmjs.com/package/woo-promise)

## Installation
```
npm install --save woo-promise
```

## Getting Started
Generate API credentials (Consumer Key & Consumer Secret) following this instructions <http://docs.woothemes.com/document/woocommerce-rest-api/>.

Get familiar with the endpoints for WooCommerce - so you know what to work with in <http://woothemes.github.io/woocommerce-rest-api-docs/>.

Once the object is instantiated, you need to call `init()`. This will dynamically build the functions for woocommerce, categorising them by group.

There is also the same `get()`, `post()`, `put()`, and `delete()` from the base library - only promisified to remove the callback options ([info](https://github.com/woothemes/wc-api-node/))

## Setup
```js
var WooPromise = require('woo-promise');

var woopromise = new WooPromise({
  url: 'http://example.com',
  consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
});

woopromise.init()
  .then(client => {
    //do things.
  })
  .catch(err => {
    //error handling
  })
```

### Options
The options mirror the ones on [WooCommerce API](https://github.com/woothemes/wc-api-node/), with a little extra gravy.

|       Option      |   Type   | Required |                                             Description                                             |
|-------------------|----------|----------|-----------------------------------------------------------------------------------------------------|
| `flatten`         | `Bool`   | no       | If the library should automatically flatten subelements of the response. Defaults to `true`.        |

The `flatten` option removes the top level node from the WooCommerce JSON response. This is something i like to do because I feel like it's just redundant.

# API
All methods return a `Promise` either resolving to the output from the API call, or rejecting with an error.

## Basic Methods
### client.get(endpoint)
The `endpoint` argument is required.

Performs a `GET` against the specified endpoint on the WooCommerce instance.
### client.post(endpoint, data)
The `endpoint` and `data` arguments are required.

Performs a `POST` against the specified endpoint on the WooCommerce instance, with a body of the data.
### client.put(endpoint, data)
The `endpoint` and `data` arguments are required.

Performs a `PUT` against the specified endpoint on the WooCommerce instance, with a body of the data.
### client.delete(endpoint)
The `endpoint` argument is required.

Performs a `DELETE` against the specified endpoint on the WooCommerce instance.

## Magic Methods
This is where the gravy arrives.

### Global
  - `client.getInfo()`

    Returns the base API information for the WooCommerce site. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-index-list)

### Coupons
  - `client.getCoupons()`

    Returns the list of coupons in the system. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-list-of-coupons)
  - `client.postCoupons(data)`

    Create coupons. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#create-a-coupon)
  - `client.coupons.get(id)`

    View coupon information for `id`. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-a-coupon)
  - `client.coupons.put(id, data)`

    Updated coupon `id` with information `data`. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#update-a-coupon)
  - `client.coupons.del(id)`

    Delete coupon `id`. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#delete-a-coupon)
  - `client.coupons.count()`

    Count the number of coupons. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-coupons-count)
  - `client.coupons.postBulk()`

    Create/Update Multiple Coupons. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#create-update-multiple-coupons)

# TODO
 - Finish writing the documentation :)

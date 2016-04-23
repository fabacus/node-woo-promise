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
  - `client.coupons.get()`

    Returns the list of coupons in the system. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-list-of-coupons)
  - `client.coupons.post(data)`

    Create coupons. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#create-a-coupon)
  - `client.coupons.get(id)`

    View coupon information for `id`. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-a-coupon)
  - `client.coupons.put(id, data)`

    Updated coupon `id` with information `data`. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#update-a-coupon)
  - `client.coupons.del(id)`

    Delete coupon `id`. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#delete-a-coupon)
  - `client.coupons.count()`

    Count the number of coupons. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-coupons-count)
  - `client.coupons.bulk.post(data)`

    Create/Update Multiple Coupons. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#create-update-multiple-coupons)

### Customers
  - `client.customers.get()`

    List all customers. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-list-of-customers)
  - `client.customers.post(data)`

    Create a customer. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#create-a-customer)
  - `client.customers.get(id)`
  - `client.customers.email.get(email)`

    Get specific customer information. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-a-customer)
  - `client.customers.put(id, data)`

    Update a customer. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#update-a-customer)
  - `client.customers.bulk.post(data)`

    Create/Update multiple customers. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#create-update-multiple-customers)
  - `client.customers.del(id)`

    Delete a customer. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#delete-a-customer)
  - `client.customers.orders.get(id)`

    List orders for a customer. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-customer-orders)
  - `client.customers.downloads.get(id)`

    List downloads for a customer. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-customer-downloads)
  - `client.customers.count()`

    Count the number of customers. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-customers-count)

### Orders
  - `client.orders.post(data)`

    Create order. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#create-an-order)
  - `client.orders.get(id)`

    View an order. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-an-order)
  - `client.orders.get()`

    Get list of orders. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-list-of-orders)
  - `client.orders.put(id, data)`

    Update an order. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#update-an-order)
  - `client.orders.bulk.post(data)`

    Create/Update multiple orders. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#create-update-multiple-orders)
  - `client.orders.del(id)`

    Delete an order. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#delete-an-order)
  - `client.orders.count()`

    The order count. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-orders-count)
  - `client.orders.statuses.get()`

    Get all order statuses. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-list-of-order-statuses)

### Order Notes
  - `client.orders.notes.post(order_id, data)`

  Create a note on order `id`. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#create-a-note-for-an-order)
  - `client.orders.notes.get(order_id, note_id)`

  View order note. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-an-order-note)
  - `client.orders.notes.get(order_id)`

  View all notes on an order. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-list-of-notes-from-an-order)
  - `client.orders.notes.put(order_id, note_id, data)`

  Update a note. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#update-an-order-note)
  - `client.orders.notes.del(order_id, note_id)`

  Delete a note. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#delete-an-order-note)

### Order Refunds
  - `client.orders.refunds.post(order_id)`

  Create a refund for an order. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#create-a-refund-for-an-order)
  - `client.orders.refunds.get(order_id, refund_id)`

  View a refund for a given order. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-an-order-refund)
  - `client.orders.refunds.get(order_id)`

  View all refunds on an order. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#view-list-of-refunds-from-an-order)
  - `client.orders.refunds.put(order_id, refund_id, data)`

  Update a given refund. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#update-an-order-refund)
  - `client.orders.refunds.del(order_id, refund_id)`

  Delete a refund. [WooCommerce Docs](http://woothemes.github.io/woocommerce-rest-api-docs/#delete-an-order-refund)

### Products

### Product Attributes

### Product Attribute Terms

### Product Categories

### Product Shipping Classes

### Product Tags

### Reports

### Taxes

### Tax Classes

### Webhooks

# TODO
 - Finish writing the documentation :)

const noop = function(val){}; // do nothing.

function fetchJSON(url, cb=noop, method='get', data={}) {
  let settings = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (method === 'post' || method === 'put') {
    settings.body = JSON.stringify(data);
  }
  fetch(url, settings)
  .then(res => res.json())
  .then(res => cb(res))
  .catch(err => {
    console.log(`[fetchJSON] url=${url} err=`, err);
    cb({ status: false, message: 'Unexpected Error' });
  })
}

async function fetchJSONSync(url, method='get', data={}) {
  let settings = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (method === 'post' || method === 'put') {
    settings.body = JSON.stringify(data);
  }
  let result;
  try {
    result = fetch(url, settings).then(res => res.json());
  } catch (err) {
    console.log('[fetchJSONSync] err=', err);
    result = [];
  }
  return result;
}

export default class API {
  // action: login, signup, logout
  static updateUser(action, email='', password='', type='customer', cb=noop) {
    const url = `/api/user/${action}`;
    fetchJSON(url, cb, 'post', { email, password, type});
  }

  static getCurUser(cb) {
    fetchJSON('/api/user/fetch', cb);
  }

  // ITEMS
  static addItem(body, cb=noop) {
    fetchJSON('/api/item', cb, 'post', body);
  }

  static updateItem(itemId, body, cb=noop) {
    fetchJSON(`/api/item/${itemId}`, cb, 'put', body);
  }

  // Get list of items by artist (for artist)
  static getItems(cb) {
    fetchJSON('/api/item', cb);
  }

  // Get/Search list of items (for customer)
  static searchItems(term, category, price, location, cb) {
    let queryParams = [];
    if (term) {
      queryParams.push(`searchTerm=${term}`);
    }
    if (category) {
      queryParams.push(`category=${category}`);
    }
    if (price) {
      queryParams.push(`priceLevel=${price}`);
    }
    if (location) {
      queryParams.push(`longitude=${location.coordinates[0]}`);
      queryParams.push(`latitude=${location.coordinates[1]}`);
    }
    fetchJSON(`/api/item?${queryParams.join('&')}`, cb);
  }

  // Get (single) item by itemId
  static getItem(itemId, cb) {
    fetchJSON(`/api/item/${itemId}`, cb);
  }

  static deleteItem(itemId, cb=noop) {
    fetchJSON(`/api/item/${itemId}`, cb, 'delete');
  }

  // ORDERS
  static getOrders(cb) {
    fetchJSON('/api/order', cb);
  }

  static async createOrders(orders, cb) {
    const result = await Promise.all(orders.map(order => fetchJSONSync('/api/order', 'post', order)));
    let errors = '';
    result.forEach(res => {
      if (!res.status) {
        errors += `${res.message}\n`;
      }
    });
    if (errors.length > 0) {
      cb({ status: false, message: errors.trim() });
    } else {
      cb({ status: true, message: 'Order Submitted!' });
    }
  }

  static updateOrder(orderId, cb) {
    fetchJSON(`/api/order/${orderId}`, cb, 'put');
  }

  // PROFILES
  static getProfile(cb) {
    fetchJSON('/api/info', cb);
  }

  static getArtistProfile(artistId, cb) {
    fetchJSON(`/api/info/${artistId}`, cb);
  }

  static updateProfile(body, cb) {
    fetchJSON('/api/info', cb, 'put', body);
  }

  static getCustomerInfo(customerId, cb) {
    fetchJSON(`/api/info/${customerId}`, cb);
  }
}

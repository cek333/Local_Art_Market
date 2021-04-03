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

  static getItems(cb) {
    fetchJSON('/api/item', cb);
  }

  static deleteItem(id, cb=noop) {
    fetchJSON('/api/item', cb, 'delete');
  }

  // ORDERS
  static getOrders(cb) {
    fetchJSON('/api/order', cb);
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
}

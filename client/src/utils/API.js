const noop = function(val){}; // do nothing.

export default class API {
  // action: login, signup, logout
  static updateUser(action, email='', password='', type='artist', cb=noop) {
    let settings = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, type })
    }
    fetch(`/api/user/${action}`, settings)
    .then(res => res.json())
    .then(res => cb(res))
    .catch(err => {
      console.log('[updateUser] err=', err);
      cb({ status: false, message: 'Unexpected error (in updateUser).' });
    })
  }

  static getCurUser(cb) {
    fetch('/api/user/fetch')
    .then(res => res.json())
    .then(res => cb(res))
    .catch(err => {
      console.log('[getCurUser] err=', err);
      cb({ status: false, id: '', type: '' });
    });
  }

  static addItem(body, cb=noop) {
    let settings = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body })
    }
    fetch(`/api/item`, settings)
    .then(res => res.json())
    .then(res => cb(res))
    .catch(err => {
      console.log('[addItem] err=', err);
      cb({ status: false, message: 'Unexpected error (in saveImage).'});
    });
  }

  static getItems(cb) {
    fetch('/api/item')
    .then(res => res.json())
    .then(res => cb(res))
    .catch(err => {
      console.log('[getItems] err=', err);
      cb([]);
    });
  }

  static deleteItem(id, cb=noop) {
    fetch(`/api/item/${id}`, { method: 'delete' })
    .then(res => res.json())
    .then(res => cb(res))
    .catch(err => {
      console.log('[deleteItem] err=', err);
      cb({ status: false, message: 'Unexpected error (in deleteItem).'});
    });
  }

  static getOrders(cb) {
    fetch('/api/order')
    .then(res => res.json())
    .then(res => cb(res))
    .catch(err => {
      console.log('[getOrders] err=', err);
      cb([]);
    });
  }
}
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import cloneDeep from 'lodash';
import HeaderDefault from './components/HeaderDefault';
import HeaderInternal from './components/HeaderInternal';
import Login from './pages/Login';
import Browse from './pages/Browse';
import ProfileEdit from './pages/ProfileEdit';
import ProfileView from './pages/ProfileView';
import ProfileBio from './pages/ProfileBio';
import ModifyItem from './pages/ModifyItem';
import Cart from './pages/Cart';
import API from './utils/API';
import './App.css';

function App() {
  const [ user, setUser ] = useState({ id: '', type: 'none', name: '', location: null });
  const [ cart, setCart ] = useState({ num_of_items: 0, total: 0 });
    // { artistId: { itemId: count }, num_of_items: x, total: x }
  const [ cartItems, setCartItems ] = useState({});
    // { itemId: { ...item properties } }

  function updateCart(item, action='add') {
    let { num_of_items, total } = cart;
    let itemCnt;
    switch (action) {
      case('add'):
        // Check if enough of item exists to be added to cart
        if (cart[item.artistId] && cart[item.artistId][item._id]) {
          // Item already purchased
          itemCnt = cart[item.artistId][item._id].count + 1;
        } else {
          itemCnt = 1;
        }
        const maxCnt = item.quantity === 'unlimited' ? Math.MAX_SAFE_INTEGER : item.quantity;
        if (itemCnt > maxCnt) {
          return { status: false, message: 'Out-of-stock' };
        }
        // Item exists in sufficient quantity. Add to cart.
        num_of_items++;
        total += item.price;
        break;
      case('sub'):
        // Shouldn't have to check if item exists (since we only call 'sub' for items already in cart)
        //   However do some checks (just in case) to avoid crashing program
        if (cart[item.artistId] && cart[item.artistId][item._id]) {
          itemCnt = cart[item.artistId][item._id].count - 1;
          num_of_items--;
          total -= item.price;
        }
        break;
      case('del'):
        // Shouldn't have to check if item exists (since we only call 'del' for items already in cart)
        //   However do some checks (just in case) to avoid crashing program
        if (cart[item.artistId] && cart[item.artistId][item._id]) {
          itemCnt = cart[item.artistId][item._id].count;
          num_of_items -= itemCnt;
          total -= (item.price * itemCnt);
          // Force to zero
          itemCnt = 0;
        }
        break;
      default:
        console.log('Error updating cart');
        return { status: false, message: 'Error updating cart' };
    }
    // const newCart = cloneDeep(cart); // lodash deep copy
    // Read cart from sessionStorage; JSON.parse also creates a deep copy of cart
    let newCart;
    if (sessionStorage.getItem('lam-cart')) {
      newCart = JSON.parse(sessionStorage.getItem('lam-cart'));
    } else {
      newCart = { ...cart }; // shallow copy of 'num_of_items', 'total'
    }
    let items;
    if (sessionStorage.getItem('lam-items')) {
      items = JSON.parse(sessionStorage.getItem('lam-items'));
    } else {
      items = {};
    }
    if (itemCnt > 0) {
      if (newCart[item.artistId]) {
        if (newCart[item.artistId][item._id]) {
          newCart[item.artistId][item._id].count = itemCnt;
        } else {
          newCart[item.artistId][item._id] = { count: itemCnt };
        }
      } else {
        newCart[item.artistId] = { [item._id]: { count: itemCnt } };
      }
      if (!items[item._id]) {
        items[item._id] = item; // keep track of unique items
      }
    } else {
      // Delete key/value pairs
      // Shouldn't have to check if item exists (since we only call 'sub/del' for items already in cart)
      //   However do some checks (just in case) to avoid crashing program
      if (newCart[item.artistId] && newCart[item.artistId][item._id]) {
        delete newCart[item.artistId][item._id];
      }
      if (items[item._id]) {
        delete items[item._id];
      }
    }
    newCart.num_of_items = num_of_items;
    newCart.total = total;
    // write updated cart to sessionStorage
    sessionStorage.setItem('lam-cart', JSON.stringify(newCart));
    sessionStorage.setItem('lam-items', JSON.stringify(items));
    console.log('newCart=', newCart);
    console.log('items=', items);
    setCart(newCart);
    setCartItems(items);
    return { status: true };
  }

  useEffect(function() {
    // Get user from server
    API.getCurUser((res) => {
      const { id, type, name, location } = res;
      setUser({ id, type, name, location });
    });
    // Check if cart data is saved in session storage
    if (sessionStorage.getItem('lam-cart')) {
      const cart = JSON.parse(sessionStorage.getItem('lam-cart'));
      const items = JSON.parse(sessionStorage.getItem('lam-items'));
      setCart(cart);
      setCartItems(items);
    }
  }, []);

  function updateUser() {
    API.getCurUser((res) => {
      const { id, type, name, location } = res;
      setUser({ id, type, name, location });
    });
  }

  let header;
  if (user.id === '') {
    header = <HeaderDefault />;
  } else {
    header = <HeaderInternal user={user} updateUser={updateUser} cartCnt={cart.num_of_items} />;
  }

  console.log('App:', user);
  return (
    <Router>
      {header}
      <Switch>
        <Route path='/browse'><Browse user={user} handlePurchase={updateCart} /></Route>
        <Route path='/loginCustomer'><Login type="customer" updateUser={updateUser} /></Route>
        <Route path='/loginArtist'><Login type="artist" updateUser={updateUser} /></Route>
        <Route path='/profileView'><ProfileView user={user} /></Route>
        <Route path='/profileEdit'><ProfileEdit user={user} updateUser={updateUser} /></Route>
        <Route path='/artist/:artistId'><ProfileBio /></Route>
        <Route path='/inventory/:itemId?'><ModifyItem /></Route>
        <Route path='/cart'><Cart cart={cart} items={cartItems} updateCart={updateCart} /></Route>
        <Redirect to='/browse' />
      </Switch>
    </Router>
  );
}

export default App;

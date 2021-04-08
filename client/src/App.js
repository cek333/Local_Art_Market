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
import API from './utils/API';
import './App.css';

function App() {
  const [ user, setUser ] = useState({ id: '', type: 'none', name: '', location: null });
  const [ cart, updateCart ] = useState({ num_of_items: 0, total: 0 });
    // { artistId: { itemId: count }, num_of_items: x, total: x }
  const [ cartItems, updateCartItems ] = useState({});
    // { itemId: { ...item properties } }

  function addToCart(item) {
    // Check if enough of item exists to be added to cart
    let itemCnt;
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
    let { num_of_items, total } = cart;
    num_of_items++;
    total += item.price;
    const newCart = cloneDeep(cart);
    if (newCart[item.artistId]) {
      if (newCart[item.artistId][item._id]) {
        newCart[item.artistId][item._id].count = itemCnt;
      } else {
        newCart[item.artistId][item._id] = { count: itemCnt };
      }
    } else {
      newCart[item.artistId] = { [item._id]: { count: itemCnt } };
    }
    newCart.num_of_items = num_of_items;
    newCart.total = total;

    console.log('newCart=', newCart);
    updateCart(newCart);
    return { status: true };
  }

  useEffect(function() {
    API.getCurUser((res) => {
      const { id, type, name, location } = res;
      setUser({ id, type, name, location });
    });
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
    header = <HeaderInternal user={user} updateUser={updateUser} />;
  }

  console.log('App:', user);
  return (
    <Router>
      {header}
      <Switch>
        <Route path='/browse'><Browse user={user} handlePurchase={addToCart} /></Route>
        <Route path='/loginCustomer'><Login type="customer" updateUser={updateUser} /></Route>
        <Route path='/loginArtist'><Login type="artist" updateUser={updateUser} /></Route>
        <Route path='/profileView'><ProfileView user={user} /></Route>
        <Route path='/profileEdit'><ProfileEdit user={user} updateUser={updateUser} /></Route>
        <Route path='/artist/:artistId'><ProfileBio /></Route>
        <Route path='/inventory/:itemId?'><ModifyItem /></Route>
        <Redirect to='/browse' />
      </Switch>
    </Router>
  );
}

export default App;

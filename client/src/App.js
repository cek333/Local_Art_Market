import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import HeaderDefault from './components/HeaderDefault';
import HeaderInternal from './components/HeaderInternal';
import Login from './pages/Login';
import Browse from './pages/Browse';
import ProfileEdit from './pages/ProfileEdit';
import ProfileView from './pages/ProfileView';
import AddItem from './pages/AddItem';
import API from './utils/API';
import './App.css';

function App() {
  const [ user, setUser ] = useState({ id: '', type: 'customer', name: '', location: null });

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
        <Route path='/browse'><Browse user={user} /></Route>
        <Route path='/loginCustomer'><Login type="customer" updateUser={updateUser} /></Route>
        <Route path='/loginArtist'><Login type="artist" updateUser={updateUser} /></Route>
        <Route path='/profileView'><ProfileView user={user} /></Route>
        <Route path='/profileEdit'><ProfileEdit user={user} updateUser={updateUser} /></Route>
        <Route path='/inventory'><AddItem user={user} /></Route>
        <Redirect to='/browse' />
      </Switch>
    </Router>
  );
}

export default App;

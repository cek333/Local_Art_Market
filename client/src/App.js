import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import HeaderDefault from './components/HeaderDefault';
import HeaderInternal from './components/HeaderInternal';
import Login from './pages/Login';
import Browse from './pages/Browse';
import Profile from './pages/Profile';
import AddItem from './pages/AddItem';
import API from './utils/API';
import './App.css';

function App() {
  const [ user, setUser ] = useState({ id: '', type: '' });

  useEffect(function() {
    API.getCurUser((res) => setUser({ ...res }));
  }, []);

  function updateUser(id='', type='') {
    setUser({ id, type });
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
        <Route path='/profile'><Profile user={user} /></Route>
        <Route path='/inventory'><AddItem user={user} /></Route>
        <Redirect to='/browse' />
      </Switch>
    </Router>
  );
}

export default App;

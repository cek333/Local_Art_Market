import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../utils/API';

function Login(props) {
  const emailInput = useRef(null);
  const pswdInput = useRef(null);
  const [ errorMsg, setErrorMsg ] = useState('');
  const history = useHistory();
  const { type: propsType, updateUser: propsUpdateUser } = props;

  function clearMessages() {
    setErrorMsg('');
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    clearMessages();
    const email = emailInput.current.value;
    const password = pswdInput.current.value;
    if (!email || !password) {
      setErrorMsg('Please enter both an email and password!');
      return;
    }
    const action = evt.target.value;
    if (action==='login' || action==='signup') {
      // console.log(`login using email=${email} pswd=${password}`);
      API.updateUser(action, email, password, propsType, (res) => {
        // console.log('[handleSubmit (login)] res=', res);
        if (res.status) {
          propsUpdateUser(res.id, res.type);
          history.push('/');
        } else {
          setErrorMsg(res.message);
        }
      });
    }
  }

  return (
    <form className='inputForm' onSubmit={handleSubmit}>
      <h3><span className="type">{propsType}</span> Login</h3>
      <label htmlFor='email'>Email</label>
      <input type='text' ref={emailInput} name='email' id='email'
            placeholder='email' required onChange={clearMessages} />
      <label htmlFor='password'>Password</label>
      <input type='password' ref={pswdInput} name='password' id='password'
            placeholder='password' required onChange={clearMessages} />
      <div className='sameRow'>
        <button type='submit' onClick={handleSubmit} value='login'>Login In</button>
        <button type='submit' onClick={handleSubmit} value='signup'>Sign Up</button>
      </div>
      <p className='errorMsg'>{errorMsg}</p>
    </form>
  );
}

export default Login;
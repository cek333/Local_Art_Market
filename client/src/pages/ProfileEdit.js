import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Address from '../components/Address';
import API from '../utils/API';

function ProfileEdit(props) {
  const { type: propsType } = props.user;
  const [ profile, setProfile ] = useState({ name:'', bio:'', address: {location: null} });
  const [ errorMsg, setErrorMsg ] = useState('');
  const history = useHistory();

  useEffect(function() {
    API.getProfile((res) => {
      if (res.status) {
        // Ignore the bio field for customers
        const { name, address, bio = '' } = res;
        setProfile({ name, address, bio });
      } else {
        setErrorMsg(res.message);
      }
    });
  }, []);

  function clearMessages() {
    setErrorMsg('');
  }

  function handleChange(evt) {
    clearMessages();
    const { name, value } = evt.target;
    setProfile({ ...profile, [name]: value });
  }

  function handleSubmit(evt) {
    clearMessages();
    evt.preventDefault();
    const form = evt.target;
    console.log('ProfileEdit form=', form);
    // https://stackoverflow.com/questions/23139876/getting-all-form-values-by-javascript
    let reqBody = { address: { } };
    Object.keys(form.elements).forEach(key => {
        let element = form.elements[key];
        if (element.type !== 'submit' && element.type !== 'fieldset') {
          if (element.name !== 'name' && element.name !== 'bio') {
            reqBody.address[element.name] = element.value;
          } else {
            reqBody[element.name] = element.value;
          }
        }
    });
    console.log('ProfileEdit formData=', reqBody);
    API.updateProfile(reqBody, (res) => {
      if (res.status) {
        history.goBack();
      } else {
        setErrorMsg(res.message);
      }
    });
  }

  return (
    <div className='box box_center'>
      <h3>Profile</h3>
      <form className='box' onSubmit={handleSubmit}>
        {propsType === 'artist'
          ? <label htmlFor='name'>Business Name or Artist Moniker</label>
          : <label htmlFor='name'>Full Name</label>
        }
        <input type='text' id='name' name='name' placeholder='Name'
          value={profile.name} onChange={handleChange} required />
        {propsType === 'artist' &&
          <>
            <label htmlFor='bio'>Artist Bio</label>
            <textarea id='bio' name='bio' placeholder='Artist Bio'
              value={profile.bio} onChange={handleChange} required />
          </>
        }
        <Address address={profile.address} />
        <div>
          <button type='submit'>Update</button>
        </div>
      </form>
      <div>
        <p className='errorMsg'>{errorMsg}</p>
        <button type='button' onClick={() => history.goBack()}>Back</button>
      </div>
    </div>
  );
}

export default ProfileEdit;

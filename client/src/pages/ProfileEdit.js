import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Address from '../components/Address';
import Picture from '../components/Picture';
import API from '../utils/API';

function ProfileEdit(props) {
  const { type: propsType } = props.user;
  const { updateUser: propsUpdateUser } = props;
  const [ profile, setProfile ] = useState({ name:'', bio:'', picture:'https://via.placeholder.com/200', address: {
      address_1:'', address_2:'', city:'', province:'', postalcode:'',
      country:'', phone_number:'', location:null }});
  const [ errorMsg, setErrorMsg ] = useState('');
  const history = useHistory();

  useEffect(function() {
    API.getProfile((res) => {
      if (res.status) {
        // Ignore the bio field for customers
        const { name, bio = '', picture = 'https://via.placeholder.com/200',
          address: {
            address_1 = '',
            address_2 = '',
            city = '',
            province = '',
            postalcode = '',
            country ='',
            phone_number = '',
            location = null
          } } = res;
        setProfile({ name, bio, picture, address: {
          address_1, address_2, city, province, postalcode,
          country, phone_number, location
        } });
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

  function handleAddressChange(evt) {
    clearMessages();
    const { name, value } = evt.target;
    const updatedAddress = { ...profile.address };
    updatedAddress[name] = value;
    setProfile({ ...profile, address: updatedAddress })
  }

  function handlePictureChange(src) {
    setProfile({ ...profile, picture: src });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    clearMessages();
    API.updateProfile(profile, (res) => {
      if (res.status) {
        propsUpdateUser();
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
            <Picture picUrl={profile.picture} onChange={handlePictureChange} />
          </>
        }
        <Address address={profile.address} onChange={handleAddressChange} />
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

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../utils/API';

function ProfileView(props) {
  const { type: propsType } = props.user;
  const [ profile, setProfile ] = useState({ name:'', bio:'', picture:'https://via.placeholder.com/200',
                                             address: {location: null} });
  const [ errorMsg, setErrorMsg ] = useState('');
  const history = useHistory();

  useEffect(function() {
    API.getProfile((res) => {
      if (res.status) {
        // Ignore the bio, picture field for customers
        const { name, address, bio = '', picture = 'https://via.placeholder.com/200' } = res;
        setProfile({ name, address, bio, picture });
      } else {
        setErrorMsg(res.message);
      }
    });
  }, []);

  return (
    <div className='box box_center'>
      <h3>Profile</h3>
      <p><span className='heading'>Name</span>: {profile.name}</p>
      {propsType === 'artist' &&
        <>
          <img src={profile.picture} alt='' />
          <p><span className='heading'>Bio</span>: {profile.bio}</p>
        </>
      }
      <p><span className='heading'>Address</span>:<br />
      {profile.address.location === null
        ? <>None specified.</>
        : <>Address 1: {profile.address.address_1}<br />
               Address 2: {profile.address.address_2}<br />
               City: {profile.address.city}<br />
               Province: {profile.address.province}<br />
               Postal Code: {profile.address.postalcode}<br />
               Country: {profile.address.country}<br />
               Phone number: {profile.address.phone_number}<br />
          </>
      }
      </p>
      <p className='errorMsg'>{errorMsg}</p>
      <div className='sameRow'>
        <button type='button' onClick={() => history.goBack()}>Back</button>
        <button type='button' onClick={() => history.push('/profileEdit')}>Edit</button>
      </div>
    </div>
  );
}

export default ProfileView;
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import API from '../utils/API';

function ProfileBio() {
  const { artistId } = useParams();
  const [ profile, setProfile ] = useState({});
  const [ errorMsg, setErrorMsg ] = useState('');
  const history = useHistory();

  useEffect(function() {
    API.getArtistProfile(artistId, (res) => {
      if (res.status) {
        const { name, bio } = res;
        setProfile({ name, bio });
      } else {
        setErrorMsg(res.message);
      }
    });
  }, [artistId]);

  return (
    <div className='box box_center'>
      <h3>Artist Bio</h3>
      <img src='https://via.placeholder.com/200' alt='' />
      <p><span className='heading'>Name</span>: {profile.name}</p>
      <p><span className='heading'>Bio</span>: {profile.bio}</p>
      <p className='errorMsg'>{errorMsg}</p>
      <div>
        <button type='button' onClick={() => history.goBack()}>Back</button>
      </div>
    </div>
  );
}

export default ProfileBio;
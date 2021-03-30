import React, { useState, useEffect } from 'react';

function Address(props) {
  const {
    address_1 = '',
    address_2 = '',
    city = '',
    province = 'ON',
    postalcode = '',
    country ='Canada',
    phone_number = ''
  } = props.address;
  const [ address, setAddress ] = useState({ address_1, address_2, city, province,
                                             postalcode, country, phone_number });

  useEffect(function() {
    setAddress({ ...props.address });
  }, [props]);

  function handleChange(evt) {
    // console.log(evt.target);
    const { name, value } = evt.target;
    // console.log(`name=${name} value=${value}`);
    setAddress({ ...address, [name]: value });
  }

  console.log('Address=', props.address);
  return (
    <fieldset>
      <legend>Address:</legend>
      <div className='box'>
        <label htmlFor='address_1'>Address 1</label>
        <input type='text' id='address_1' name='address_1' placeholder='Address 1'
          value={address.address_1} onChange={handleChange} required />
        <label htmlFor='address_2'>Address 2</label>
        <input type='text' id='address_2' name='address_2' placeholder='Address 2'
          value={address.address_2} onChange={handleChange} />
      </div>
      <label htmlFor='city'>City</label>
      <input type='text' id='city' name='city' placeholder='City' 
        value={address.city} onChange={handleChange} required /><br />
      <label htmlFor='province'>Province</label>
      <input type='text' id='province' name='province'
        value={address.province} onChange={handleChange} required /><br />
      <label htmlFor='postalcode'>Postal Code</label>
      <input type='text' id='postalcode' name='postalcode' placeholder='Postal Code' 
        value={address.postalcode} onChange={handleChange} required /><br />
      <label htmlFor='country'>Country</label>
      <input type='text' id='country' name='country' 
        value={address.country} onChange={handleChange} required /><br />
      <label htmlFor='phone_number'>Phone Number</label>
      <input type='text' id='phone_number' name='phone_number' placeholder='Phone number' 
        value={address.phone_number} onChange={handleChange} required /><br />
    </fieldset>
  );
}

export default Address;
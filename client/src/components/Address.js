function Address(props) {
  const { address: propsAddress, onChange: propsHandleChange } = props;

  return (
    <fieldset>
      <legend>Address:</legend>
      <div className='box'>
        <label htmlFor='address_1'>Address 1</label>
        <input type='text' id='address_1' name='address_1' placeholder='Address 1'
          value={propsAddress.address_1} onChange={propsHandleChange} required />
        <label htmlFor='address_2'>Address 2</label>
        <input type='text' id='address_2' name='address_2' placeholder='Address 2'
          value={propsAddress.address_2} onChange={propsHandleChange} />
      </div>
      <label htmlFor='city'>City</label>
      <input type='text' id='city' name='city' placeholder='City' 
        value={propsAddress.city} onChange={propsHandleChange} required /><br />
      <label htmlFor='province'>Province</label>
      <input type='text' id='province' name='province'
        value={propsAddress.province} onChange={propsHandleChange} required /><br />
      <label htmlFor='postalcode'>Postal Code</label>
      <input type='text' id='postalcode' name='postalcode' placeholder='Postal Code' 
        value={propsAddress.postalcode} onChange={propsHandleChange} required /><br />
      <label htmlFor='country'>Country</label>
      <input type='text' id='country' name='country' 
        value={propsAddress.country} onChange={propsHandleChange} required /><br />
      <label htmlFor='phone_number'>Phone Number</label>
      <input type='text' id='phone_number' name='phone_number' placeholder='Phone number' 
        value={propsAddress.phone_number} onChange={propsHandleChange} required /><br />
    </fieldset>
  );
}

export default Address;
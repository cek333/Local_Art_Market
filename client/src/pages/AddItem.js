import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../utils/API';

function AddItem(props) {
  const [ errorMsg, setErrorMsg ] = useState('');
  const [ successMsg, setSuccessMsg ] = useState('');
  const history = useHistory();
  // const { type: propsType, updateUser: propsUpdateUser } = props;

  function clearMessages() {
    setErrorMsg('');
    setSuccessMsg('');
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    clearMessages();
    const form = evt.target;
    // https://stackoverflow.com/questions/23139876/getting-all-form-values-by-javascript
    let reqBody = {};
    Object.keys(form.elements).forEach(key => {
        let element = form.elements[key];
        if (element.type !== 'submit') {
          if (element.type === 'select-multiple') {
            const selAsArray = [];
            for (let idx=0; idx < element.selectedOptions.length; idx++) {
              selAsArray.push(element.selectedOptions[idx].value);
            }
            reqBody[element.name] = selAsArray;
          } else {
            reqBody[element.name] = element.value;
          }
        }
    });
    console.log('AddItem:', reqBody);
    API.addItem(reqBody, (res) => {
      if (res.status) {
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message);
      }
    });
  }

  return (
    <form className='inputForm' onSubmit={handleSubmit}>
      <label htmlFor='name'>Name</label>
      <input type='text' name='name' id='name'
            placeholder='name' required />
      <label htmlFor='quantity'>Quantity</label>
      <input type='number' name='quantity' id='quantity'
            placeholder='1' required min='0' />
      <label htmlFor='price'>Price</label>
      <input type='number' name='price' id='price'
            placeholder='25.00' required min='0' />
      <label htmlFor='description'>Description</label>
      <textarea name='description' id='description'
            placeholder='Description' required />
      <label htmlFor="categories">Category</label>
      <select id="categories" name="categories" multiple required>
        <option value="portrait">portrait</option>
        <option value="abstract">abstract</option>
        <option value="photography">photography</option>
        <option value="sculpture">sculpture</option>
        <option value="painting">painting</option>
      </select> 
      <button type='submit'>Add Item</button>
      <p className='successMsg'>{successMsg}</p>
      <p className='errorMsg'>{errorMsg}</p>
    </form>
  );
}

export default AddItem;
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Radio from '../components/Radio';
import API from '../utils/API';

function AddItem(props) {
  const CATEGORIES = ['prints', 'drawing & illustration', 'painting', 'photography', 'sculpture',
    'dolls & miniatures', 'textiles', 'mixed media & collage', 'cermaics', 'glass art', 'other'];
  const [ errorMsg, setErrorMsg ] = useState('');
  const [ successMsg, setSuccessMsg ] = useState('');
  const [ itemProperties, setItemProperties ] = useState({
    name: '', quantity: 1, price: '25.00', picture: 'https://via.placeholder.com/200',
    description: '', category: 'other'
  });
  const history = useHistory();
  // const { type: propsType, updateUser: propsUpdateUser } = props;

  function clearMessages() {
    setErrorMsg('');
    setSuccessMsg('');
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setItemProperties({ ...itemProperties, [name]: value });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    clearMessages();
    console.log('AddItem handleSubmit:', itemProperties);
    const reqBody = {...itemProperties};
    // Convert quantity/amt from string to numbers
    if (reqBody.quantity !== 'unlimited') {
      reqBody.quantity = Number(reqBody.quantity);
    }
    reqBody.price = Number(reqBody.price);
    API.addItem(reqBody, (res) => {
      if (res.status) {
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message);
      }
    });
  }

  return (
    <div className='box box_center'>
      <form className='box' onSubmit={handleSubmit}>
        <label htmlFor='name'>Item Name</label>
        <input type='text' name='name' id='name' value={itemProperties.name}
              placeholder='name' onChange={handleChange} required />
        <label htmlFor='quantity'>Quantity (enter number OR 'unlimited')</label>
        <input type='text' name='quantity' id='quantity' value={itemProperties.quantity}
              onChange={handleChange} required />
        <label htmlFor='price'>Price</label>
        <input type='text' name='price' id='price' value={itemProperties.price}
              onChange={handleChange} required />
        <label htmlFor='description'>Description</label>
        <textarea name='description' id='description' value={itemProperties.description}
              placeholder='Description' onChange={handleChange} required />
        <fieldset>
          <legend>Categories</legend>
          {CATEGORIES.map(category => {
            return (
              <React.Fragment key={category}>
                <Radio id={category} name='category' value={category}
                  onChange={handleChange} selected={itemProperties.category} required />
                <label htmlFor={category}> {category}</label><br />
              </React.Fragment>
            );
          })}
        </fieldset>
        <button type='submit'>Add Item</button>
        <p className='successMsg'>{successMsg}</p>
        <p className='errorMsg'>{errorMsg}</p>
      </form>
      <div>
        <button type='button' onClick={() => history.goBack()}>Back</button>
      </div>
    </div>
  );
}

export default AddItem;
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Picture from '../components/Picture';
import API from '../utils/API';
import constants from '../utils/constants_client';

function ModifyItem(props) {

  const [ errorMsg, setErrorMsg ] = useState('');
  const [ successMsg, setSuccessMsg ] = useState('');
  const [ itemProperties, setItemProperties ] = useState({
    name: '', quantity: 1, price: '25.00', picture: 'https://via.placeholder.com/200',
    description: '', category: 'other'
  });
  const [ action, setAction ] = useState('Add');
  const history = useHistory();
  const { itemId } = useParams();

  useEffect(function() {
    if (itemId) {
      setAction('Update');
      API.getItem(itemId, (res) => {
        if (res.status) {
          let { name='', quantity=1, price='25.00', picture='https://via.placeholder.com/200',
            description='', category='other' } = res;
          // Convert price to string
          if (typeof price === 'number') {
            price = price.toFixed(2).toString();
          }
          setItemProperties({ name, quantity, price, picture, description, category });
        } else {
          setErrorMsg(res.message);
        }
      });
    }
  }, [itemId]);

  function clearMessages() {
    setErrorMsg('');
    setSuccessMsg('');
  }

  function handleChange(evt) {
    clearMessages();
    const { name, value } = evt.target;
    setItemProperties({ ...itemProperties, [name]: value });
  }

  function handlePictureChange(src) {
    setItemProperties({ ...itemProperties, picture: src });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    clearMessages();
    const reqBody = {...itemProperties};
    // Convert quantity/amt from string to numbers
    if (reqBody.quantity.toString().toLowerCase() !== 'unlimited') {
      reqBody.quantity = Number(reqBody.quantity);
    }
    reqBody.price = Number(reqBody.price);
    if (action === 'Add') {
      API.addItem(reqBody, (res) => {
        if (res.status) {
          setSuccessMsg(res.message);
        } else {
          setErrorMsg(res.message);
        }
      });
    } else {
      API.updateItem(itemId, reqBody, (res) => {
        if (res.status) {
          setSuccessMsg(res.message);
        } else {
          setErrorMsg(res.message);
        }
      });
    }
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
        <Picture picUrl={itemProperties.picture} onChange={handlePictureChange} />
        <fieldset>
          <legend>Categories</legend>
          {constants.CATEGORIES.map(category => {
            return (
              <React.Fragment key={category}>
                <input type='radio' id={category} name='category' value={category}
                  onChange={handleChange} checked={category===itemProperties.category} required />
                <label htmlFor={category}> {category}</label><br />
              </React.Fragment>
            );
          })}
        </fieldset>
        <button type='submit'>{action} Item</button>
        <p className='successMsg'>{successMsg}</p>
        <p className='errorMsg'>{errorMsg}</p>
      </form>
      <div>
        <button type='button' onClick={() => history.goBack()}>Back</button>
      </div>
    </div>
  );
}

export default ModifyItem;
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import API from '../utils/API';
import deleteIcon from '../assets/delete_icon.svg';

function Cart(props) {
  const { cart: propsCart, items: propsItems, updateCart: propsUpdateCart } = props;
  const [ profile, setProfile ] = useState({ name:'', bio:'', address: {location: null} });
  const [ errorMsg, setErrorMsg ] = useState('');
  const [ successMsg, setSuccessMsg ] = useState('');
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

  function submitOrder() {
    const orders = [];
    Object.keys(propsCart).forEach(artistId => {
      let artistTotal = 0;
      let aName;
      const artistItems = [];
      Object.keys(propsCart[artistId]).forEach(itemId => {
        const { name, price, artistName } = propsItems[itemId];
        const { count } = propsCart[artistId][itemId];
        const subTotal = count * price;
        aName = artistName;
        artistTotal += subTotal;
        artistItems.push({ itemId, name, price, quantity: count, total: subTotal });
      });
      // Create order for each artist
      const order = { items: artistItems, total: artistTotal, artistId, artistName: aName };
      orders.push(order);
    });
    API.createOrders(orders, (res) => {
      if (res.status) {
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message);
      }
    });
  }

  const itemList = [];
  Object.keys(propsCart).forEach(artistId => {
    Object.keys(propsCart[artistId]).forEach(itemId => {
      const { name, price, picture, artistName } = propsItems[itemId];
      const { count } = propsCart[artistId][itemId];
      const subTotal = count * price;
      const itemRow =
        <tr key={`${artistId}${itemId}`}>
          <td>{artistName}</td>
          <td><img class='cart' src={picture} alt='' /></td>
          <td>{name}</td>
          <td>${price.toFixed(2)}</td>
          <td>
            <span class='cart'>{count}</span>
            <div class='cart-buttons'>
              <button type="button" class='cart'
                onClick={() => propsUpdateCart(propsItems[itemId])}>+</button>
              <button type="button" class='cart'
                onClick={() => propsUpdateCart(propsItems[itemId], 'sub')}>-</button>
              <button type="button" class='cart'
                onClick={() => propsUpdateCart(propsItems[itemId], 'del')}>
                  <img src={deleteIcon} alt='delete' />
              </button>
            </div>
          </td>
          <td>${subTotal.toFixed(2)}</td>
        </tr>;
      itemList.push(itemRow);
    });
  });

  let customerInfo = 
    <div className='box'>
      <p>
        <span className='heading'>Deliver To:</span><br />
        {profile.name}<br />
        {profile.address.address_1}<br />
        {profile.address.address_2 && <>{profile.address.address_2}<br /></>}
        {profile.address.city}<br />
        {profile.address.province}, {profile.address.postalcode}<br />
        {profile.address.country}<br />
        {profile.address.phone_number}<br />
      </p>
    </div>;

  return (
    <>
      <h3>Checkout</h3>
      {propsCart.num_of_items <= 0
        ? <>
            <p>There are no items in your cart.</p>
            <div>
                <button type='button' onClick={() => history.goBack()}>Back</button>
            </div>
          </>
        : <>
            {customerInfo}
            <table>
              <tbody>
                {itemList}
                <tr>
                  <td>Total</td>
                  <td></td><td></td><td></td><td></td>
                  <td>${propsCart.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <p className='successMsg'>{successMsg}</p>
            <p className='errorMsg'>{errorMsg}</p>
            <div className='sameRow'>
              <button type='button' onClick={() => history.goBack()}>Back</button>
              <button type='button'>Complete Purchase</button>
            </div>
          </>
      }
    </>
  );
}

export default Cart;
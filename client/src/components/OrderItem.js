import React, { useState } from 'react';
import API from '../utils/API';

function OrderItem(props) {
  const { type: propsType } = props.user;
  const [ customerInfo, setCustomerInfo ] = useState({ name: '', phone_number: '' });
  const [errorMsg, setErrorMsg] = useState('');

  function getCustomerInfo(customerId) {
    API.getCustomerInfo(customerId, (res) => {
      if (res.status) {
        const { name, phone_number } = res;
        setCustomerInfo({ name, phone_number });
      } else {
        setCustomerInfo({ phone_number: 'Not found' });
      }
    });
  }

  function handleOrderComplete(orderId) {
    API.updateOrder(orderId, (res) => {
      if (res.status) {
        props.updateOrderList();
      } else {
        setErrorMsg(res.message);
      }
    });
  }

  let buttons;
  if (propsType === 'artist') {
    buttons = 
      <>
        {props.order.status === 'Pending' &&
          <button type='button' className='list-item-button'
            onClick={() => handleOrderComplete(props.order._id)}>Complete Order</button>
        }
        {/* {customerInfo.phone_number === '' &&
          <button type='button' className='list-item-button'
            onClick={() => getCustomerInfo(props.order.customerId)}>Get Customer Info</button>
        } */}
      </>;
  } else {
    buttons = <></>;
  }

  return (
    <div className="list-item">
      {buttons}
      <p className='heading'>Artist: {props.order.artistName}</p>
      <table className='order'>
        <thead>
          <th>Item</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </thead>
        <tbody>
          {props.order.items.map(item =>
            <tr key={item.itemId}>
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.quantity}</td>
              <td>${item.total.toFixed(2)}</td>
            </tr>
          )}
          <tr>
            <td class='empty'></td>
            <td class='empty'></td>
            <td class='empty'></td>
            <td>${props.order.total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <p>
        Date Ordered: {new Date(props.order.dateOrdered).toLocaleString()}<br />
        {props.order.status === 'Pending'
          ? <span>Status: Pending</span>
          : <span>Date Fulfilled: {new Date(props.order.dateFulfilled).toLocaleString()}</span>
        }
        {customerInfo.phone_number &&
          <><br /><span>Cusomter Info: {customerInfo.name}, {customerInfo.phone_number}</span></>
        }
        {errorMsg &&
          <><br /><span class='errorMsg'>{errorMsg}</span></>
        }
      </p>
    </div>
  );
}

export default OrderItem;
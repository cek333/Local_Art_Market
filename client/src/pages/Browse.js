import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ListItem from '../components/ListItem';
import API from '../utils/API';

function Browse(props) {
  const [ itemList, setItemList ] = useState([]);
  const [ orderList, setOrderList ] = useState([]);
  const { user: propsUser } = props;

  useEffect(function() {
    API.getItems((res) => setItemList(res));
    // API.getOrders((res) => setOrderList(res));
  }, [])

  let addItemLink;
  if (propsUser.type === 'artist') {
    if (propsUser.location === null) {
      addItemLink = <p className='errorMsg'>'Add Item' disabled. Please complete your profile first.</p>;
    } else {
      addItemLink = <NavLink to='/inventory'>Add Item</NavLink>;
    }
  } else {
    addItemLink = <></>;
  }

  return (
    <div>
      {propsUser.id !== '' &&
      <>
        <h3>Orders</h3>
        <div>
          {orderList.length === 0 ? <p>You don't have any current orders.</p> :
            orderList.map(order =>
              <div key={order._id}>
                <p>Customer: {order.customerEmail}, Item: {order.items[0].name}, 
                  Quantity: {order.items[0].quantity} Total: {order.total}</p>
              </div>)
          }
        </div>
      </>}
      <h3>Items For Sale</h3>
      {addItemLink}
      <div>
        {itemList.length === 0
          ? <p>There are no art pieces for sale.</p>
          : itemList.map(item => <ListItem key={item._id} type={propsUser.type} item={item} />)
        }
      </div>
    </div>
  )
}

export default Browse;
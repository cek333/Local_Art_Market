import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import API from '../utils/API';

function Browse(props) {
  const [ itemList, setItemList ] = useState([]);
  const [ orderList, setOrderList ] = useState([]);
  const { user: propsUser } = props;

  useEffect(function() {
    API.getItems((res) => setItemList(res));
    // API.getOrders((res) => setOrderList(res));
  }, [])

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
      {propsUser.type === 'artist' && <NavLink to='/inventory'>Add Item</NavLink>}
      <div>
        {itemList.length === 0 ? <p>There are no art pieces for sale.</p> :
          itemList.map(item =>
            <div key={item._id}>
              <p>{item.name}, {item.description}</p>
            </div>)
        }
      </div>
    </div>
  )
}

export default Browse;
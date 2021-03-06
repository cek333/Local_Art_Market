import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ListItem from '../components/ListItem';
import OrderItem from '../components/OrderItem';
import Search from '../components/Search';
import API from '../utils/API';

function Browse(props) {
  const [ itemList, setItemList ] = useState([]);
  const [ orderList, setOrderList ] = useState([]);
  const [ itemsByPrice, setItemsByPriceList ] = useState([]);
  const [ itemsByCategory, setItemsByCategoryList ] = useState([]);
  const { user: propsUser, handlePurchase: propsHandlePurchase } = props;

  useEffect(function() {
    updateItemList();
    updateOrderList();
  }, [propsUser])

  function updateOrderList() {
    API.getOrders((res) => setOrderList(res));
  }

  function updateItemList(searchTerm='', searchCategory='', searchPrice='', searchLocation='') {
    if (propsUser.type === 'artist') {
      API.getItems((res) => setItemList(res.items));
    } else {
      API.searchItems(searchTerm, searchCategory, searchPrice, searchLocation, (res) => {
        setItemsByPriceList(res.prices);
        setItemsByCategoryList(res.categories);
        setItemList(res.items);
      });
    }
  }

  function handleDelete(evt) {
    API.deleteItem(evt.target.value, function() {
      updateItemList();
    });
  }

  let addItemLink;
  if (propsUser.type === 'artist') {
    if (propsUser.location === null) {
      addItemLink = <p className='errorMsg'>'Add Item' disabled. Please complete your profile first.</p>;
    } else {
      addItemLink = <NavLink to='/inventory'>Add Item</NavLink>;
    }
  } else if (propsUser.type === 'customer') {
    if (propsUser.location === null) {
      addItemLink = <p className='errorMsg'>Please complete your profile to enable purchasing items and the 'search by distance' feature.</p>;
    } else {
      addItemLink = <></>;
    }
  } else {
    addItemLink = <></>;
  }

  let searchBox;
  if (propsUser.type === 'artist') {
    searchBox = <></>;
  } else {
    searchBox = <Search user={propsUser} itemsByCategory={itemsByCategory} itemsByPrice={itemsByPrice}
      updateItemList={updateItemList} />;
  }

  return (
    <div>
      {propsUser.id !== '' &&
      <>
        <h3>Orders</h3>
        <div>
          {orderList.length === 0 ? <p>You don't have any current orders.</p> :
            orderList.map(order =>
              <OrderItem key={order._id} user={propsUser} order={order}
                updateOrderList={updateOrderList} />)
          }
        </div>
      </>}
      <h3>Items For Sale</h3>
      {addItemLink}
      <div className={propsUser.type ==='artist' ? 'no-wrap' : 'wrap'}>
        {searchBox}
        <div>
          {itemList.length === 0
            ? <p>There are no art pieces for sale.</p>
            : itemList.map(item => <ListItem key={item._id} user={propsUser} item={item}
                handleDelete={handleDelete} handlePurchase={propsHandlePurchase} />)
          }
        </div>
      </div>
    </div>
  )
}

export default Browse;
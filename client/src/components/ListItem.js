import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

function ListItem(props) {
  const history = useHistory();
  const [errorMsg, setErrorMsg] = useState('');

  function handleAddToCart(item) {
    const result = props.handlePurchase(item);
    if (!result.status) {
      setErrorMsg(result.message);
    }
  }

  let buttons;
  if (props.type === 'artist') {
    buttons =
      <>
        <button type='button' className='list-item-button'
          onClick={() => history.push(`/inventory/${props.item._id}`)}>Edit</button>
        <button type='button' className='list-item-button' value={props.item._id}
          onClick={props.handleDelete}>Delete</button>
      </>;
  } else if (props.type === 'customer') {
    buttons =
      <>
        <button type='button' className='list-item-button'
          onClick={()=>handleAddToCart(props.item)}>Add to Cart</button>
        <span className='list-item-button errorMsg'>{errorMsg}</span>
      </>
  } else {
    buttons = <></>;
  }

  return (
    <div className="list-item">
      {buttons}
      <p className='heading'>{props.item.name}</p>
      <div className="sideBySide">
        <img src={props.item.picture} alt='' />
        <p>
          <span className='heading'>Quantity: </span>{props.item.quantity}<br />
          <span className='heading'>Price: </span>${props.item.price.toFixed(2)}<br />
          <span className='heading'>Description: </span>{props.item.description}<br />
          <span className='heading'>Artist: </span>
            <NavLink to={`/artist/${props.item.artistId}`}>{props.item.artistName}</NavLink><br />
        </p>
      </div>
    </div>
  );
}

export default ListItem;
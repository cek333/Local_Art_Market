import { NavLink, useHistory } from 'react-router-dom';

function ListItem(props) {
  const history = useHistory();

  let buttons;
  if (props.type === 'artist') {
    buttons = 
      <>
        {/* <button type='button' className='list-item-button'
          onClick={() => history.push(`/inventory/${props.item._id}`)}>Edit</button> */}
        <button type='button' className='list-item-button'>Edit</button>
        <button type='button' className='list-item-button'>Delete</button>
      </>;
  } else if (props.type === 'customer') {
    buttons = <button type='button' className='list-item-button'>Add to Cart</button>;
  } else {
    buttons = <></>;
  }
  const artistLink = `/artist/${props.item.artistId}`;

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
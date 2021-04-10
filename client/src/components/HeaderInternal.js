import { NavLink, useHistory } from 'react-router-dom';
import API from '../utils/API';
import './Header.css';

function Header(props) {
  const { user: propsUser, updateUser: propsUpdateUser, cartCnt: propsCartCnt } = props;
  const history = useHistory();

  function handleLogout() {
    API.updateUser('logout', null, null, null, (res) => {
      // console.log('[useEffect (logout)] res=', res);
      if (res.status) {
        propsUpdateUser();
      } else {
        // Not expecting to fall into this branch!
        console.log('HeaderInternal:handleLogout: Error logging out!');
      }
      history.push('/');
    });
  }

  let cartLink;
  if (propsUser.type === 'customer') {
    if (propsCartCnt > 0) {
      cartLink = <NavLink to='/cart' activeClassName='active'>Cart ({propsCartCnt})</NavLink>;
    } else {
      cartLink = <NavLink to='/cart' activeClassName='active'>Cart</NavLink>;
    }
  } else {
    cartLink = <></>;
  }

  return (
    <header>
      <div className='title'>Local Art Market</div>
      <nav>
        <NavLink to='/browse' activeClassName='active'>Browse</NavLink>
        <NavLink to='/profileView' activeClassName='active'>Profile</NavLink>
        {cartLink}
        <span className='logout' onClick={handleLogout}>Logout</span>
      </nav>
    </header>
  );
}

export default Header;
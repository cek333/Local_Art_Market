import { NavLink, useHistory } from 'react-router-dom';
import API from '../utils/API';
import './Header.css';

function Header(props) {
  const { user: propsUser, updateUser: propsUpdateUser } = props;
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

  return (
    <header>
      <div className='title'>Local Art Market</div>
      <nav>
        <NavLink to='/browse' activeClassName='active'>Browse</NavLink>
        <NavLink to='/profileView' activeClassName='active'>Profile</NavLink>
        <span className='logout' onClick={handleLogout}>Logout</span>
      </nav>
    </header>
  );
}

export default Header;
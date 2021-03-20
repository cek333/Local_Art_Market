import { NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header>
      <div className='title'>Local Art Market</div>
      <nav>
        <NavLink to='/browse' activeClassName='active'>Browse</NavLink>
        <NavLink to='/loginCustomer' activeClassName='active'>Customer Login</NavLink>
        <NavLink to='/loginArtist' activeClassName='active'>Artist Login</NavLink>
      </nav>
    </header>
  );
}

export default Header;
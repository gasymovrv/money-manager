import React from 'react';
import './header.css';
import { User } from '../../interfaces/user.interface';

interface HeaderProps {
  user: User,
}

const Header: React.FC<HeaderProps> = (props) => (
  <header>
    <div>
      <h1>Money Manager</h1>
    </div>
    <div className="account">
      <div>
        <p>Name: {props.user.name}</p>
        <p>Email: {props.user.email}</p>
        <form method="GET" action="logout">
          <button type="submit">Logout</button>
        </form>
      </div>
      <div>
        <img src={props.user.picture} alt="not found"/>
      </div>
    </div>
  </header>
);

export default Header;

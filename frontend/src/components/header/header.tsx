import React from 'react';
import { useContext } from 'react';
import './header.css';
import { AuthContext } from '../../interfaces/auth-context.interface';

const Header: React.FC = () => {
    const {user} = useContext(AuthContext);

    return (
      <header>
        <div>
          <h1>Money Manager</h1>
        </div>
        <div className="account">
          <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <form method="GET" action="logout">
              <button type="submit">Logout</button>
            </form>
          </div>
          <div>
            <img src={user.picture} alt="not found"/>
          </div>
        </div>
      </header>
    )
}

export default Header;

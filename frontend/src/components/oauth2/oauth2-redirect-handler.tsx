import React, { useContext, useEffect } from 'react';
import { ACCESS_TOKEN } from '../../constants';
import { Redirect, useLocation } from 'react-router-dom'
import { AuthContext } from '../../interfaces/auth-context.interface';

const Oauth2RedirectHandler: React.FC = () => {
  const {refreshUser} = useContext(AuthContext);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN, token);
      refreshUser(); // it causes getting user by the token
    }
  }, [refreshUser, token]);

  if (token) {
    return (
      <Redirect to={{
        pathname: '/',
        state: {from: location}
      }}/>
    )
  }

  return (
    <Redirect to={{
      pathname: '/login',
      state: {from: location}
    }}/>
  )
}

export default Oauth2RedirectHandler;
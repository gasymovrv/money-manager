import { defaultUser, User } from './user.interface';
import React from 'react';

export interface IContext {
  user: User,
  isAuthenticated: boolean,

  refreshUser(): void
}

export const AuthContext = React.createContext<IContext>({
  user: defaultUser,
  isAuthenticated: false,
  refreshUser: () => {
  }
});
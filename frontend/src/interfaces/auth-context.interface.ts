import { defaultUser, User } from './user.interface';
import React from 'react';

export interface IContext {
  user: User,

  refreshUser(): void
}

export const AuthContext = React.createContext<IContext>({
  user: defaultUser,
  refreshUser: () => {}
});
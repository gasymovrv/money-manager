import { defaultUser, User } from './user.interface';
import React from 'react';

export interface IContext {
  user: User,

  updateUser(): void
}

export const AuthContext = React.createContext<IContext>({
  user: defaultUser,
  updateUser: () => {}
});
import * as React from 'react';
import { AuthContext } from '../context';

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('You must call useAuth from within the AuthContextProvider');
  }
  return context;
}

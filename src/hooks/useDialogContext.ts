import * as React from 'react';
import { DialogContext } from '../context';

export function useDialogContext() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('You can only call useDialogContext from with the DialogContextProvider');
  }
  return context;
}

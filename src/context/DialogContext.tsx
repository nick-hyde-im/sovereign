import * as React from 'react';

const noop = () => void 0;

interface DialogConfig {
  message: string | React.ReactNode | null;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

interface DialogContextValue {
  open: boolean;
  dialogConfig: DialogConfig;
  ref: React.RefObject<HTMLDialogElement> | null;
  showDialog: (config: DialogConfig) => void | typeof noop;
}
const defaultDialogConfig = {
  message: null,
  onConfirm: noop,
  onCancel: noop,
};

export const DialogContext = React.createContext<DialogContextValue>({
  open: false,
  ref: null,
  showDialog: noop,
  dialogConfig: defaultDialogConfig,
});

export function DialogContextProvider({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const [open, setOpen] = React.useState(false);
  const [dialogConfig, setDialogConfig] = React.useState<DialogConfig>(defaultDialogConfig);

  const showDialog = ({ message, onCancel, onConfirm, showCancelButton = true }: DialogConfig) => {
    setDialogConfig({
      message,
      onConfirm: () => {
        setOpen(false);
        onConfirm?.();
      },
      onCancel: () => {
        setOpen(false);
        onCancel?.();
      },
      showCancelButton,
    });
    setOpen(true);
  };

  return (
    <DialogContext.Provider value={{ open, ref, dialogConfig, showDialog }}>
      {children}
    </DialogContext.Provider>
  );
}

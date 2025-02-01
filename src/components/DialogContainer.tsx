import * as React from 'react';
import { useDialogContext } from '../hooks';
import { Button } from './Button';

export function DialogContainer() {
  const { ref, open, dialogConfig } = useDialogContext();

  React.useEffect(() => {
    if (open) {
      ref?.current?.showModal();
    } else {
      ref?.current?.close();
    }
  }, [open, ref]);

  return (
    <dialog
      ref={ref}
      className="rounded shadow-sm dark:bg-slate-900 border dark:border-white dark:text-white p-8"
    >
      <p className="mb-8 text-lg">{dialogConfig.message}</p>
      <div className="flex justify-end gap-4">
        {dialogConfig.showCancelButton && (
          <Button onClick={dialogConfig.onCancel} autoFocus padding="sm" status="error">
            Cancel
          </Button>
        )}
        <Button onClick={dialogConfig.onConfirm} padding="sm">
          OK
        </Button>
      </div>
    </dialog>
  );
}

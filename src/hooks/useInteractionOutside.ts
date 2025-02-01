import * as React from 'react';
import { useDialogContext } from './useDialogContext';

export function useInteractionOutside(
  elementRef: React.RefObject<HTMLElement>,
  callback: () => void,
) {
  const { ref: dialogRef } = useDialogContext();

  const interactionOutsideHandler = React.useCallback(
    (event: MouseEvent | KeyboardEvent) => {
      const eventTarget = event.target as Node;
      if (elementRef.current?.contains(eventTarget) || dialogRef?.current?.contains(eventTarget)) {
        return;
      }
      callback();
    },
    [callback, dialogRef, elementRef],
  );

  React.useEffect(() => {
    document.addEventListener('mousedown', interactionOutsideHandler);
    document.addEventListener('keydown', interactionOutsideHandler);

    return () => {
      document.removeEventListener('mousedown', interactionOutsideHandler);
      document.removeEventListener('keydown', interactionOutsideHandler);
    };
  }, [callback, interactionOutsideHandler, elementRef]);
}

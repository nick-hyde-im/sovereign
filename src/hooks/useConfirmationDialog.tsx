import { useDialogContext } from '../hooks';

export function useConfirmationDialog() {
  const { showDialog } = useDialogContext();
  return { showDialog };
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSprint } from '../../models';

export function useDeleteSprint() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteSprint,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  return mutation.mutate;
}

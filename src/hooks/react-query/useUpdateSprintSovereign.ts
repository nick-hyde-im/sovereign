import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSprintSovereign } from '../../models';

export function useUpdateSprintSovereign() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateSprintSovereign,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  return mutation.mutate;
}

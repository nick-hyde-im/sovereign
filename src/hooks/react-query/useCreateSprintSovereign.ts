import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSprintSovereign } from '../../models';

export function useCreateSprintSovereign(
  setTargetSprint: React.Dispatch<React.SetStateAction<number | undefined>>,
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createSprintSovereign,
    onSuccess: () => {
      setTargetSprint((prev) => prev && prev + 1);
      queryClient.invalidateQueries();
    },
  });

  return mutation.mutate;
}

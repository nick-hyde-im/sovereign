import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { getLastSprint, updateSprintDates } from '../../models';

export function useTargetSprintDates() {
  const queryClient = useQueryClient();

  const { data, status } = useQuery({
    queryKey: ['sprintDates'],
    queryFn: async () => {
      const lastSprint = await getLastSprint();

      if (!lastSprint) {
        return { start: new Date(), end: new Date() };
      }

      return {
        start: new Date(lastSprint.start_date),
        end: new Date(lastSprint.end_date),
        id: lastSprint.id,
      };
    },
  });

  const mutation = useMutation({
    mutationFn: updateSprintDates,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  return {
    targetSprintDates: data,
    targetSprintDatesQueryStatus: status,
    updateSprintDates: mutation.mutate,
  };
}

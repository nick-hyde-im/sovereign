import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCandidates } from '../../models';
import type { Candidate } from '../../../types/models';

export function useCandidates(targetSprintDates: { start: Date; end: Date } | undefined) {
  const [exclusionList, setExclusionList] = React.useState<Array<Candidate['id']>>([]);

  const { data: candidates, status: candidatesQueryStatus } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => {
      if (!targetSprintDates) {
        return [];
      }
      return getCandidates(targetSprintDates);
    },
    onSuccess: (data) => setExclusionList(data.filter((c) => c.has_holiday).map((c) => c.id)),
    enabled: !!targetSprintDates,
  });

  function handleUpdateExclusionList(id: number) {
    setExclusionList((previous) => {
      return previous.includes(id)
        ? previous.filter((excludedId) => excludedId !== id)
        : [...previous, id];
    });
  }

  return { candidates, candidatesQueryStatus, exclusionList, handleUpdateExclusionList };
}

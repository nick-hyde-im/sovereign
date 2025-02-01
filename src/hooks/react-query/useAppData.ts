import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllSprints, getCandidates } from '../../models';
import type { Candidate } from '../../../types/models';
import { useCreateSprintSovereign } from './useCreateSprintSovereign';
import { getTargetSprintEndDate, getTargetSprintStartDate } from '../../utils';

export function useAppData() {
  const [targetSprint, setTargetSprint] = React.useState<number>();
  const [targetSprintDates, setTargetSprintDates] = React.useState<{
    start: Date;
    end: Date;
  }>();
  const [exclusionList, setExclusionList] = React.useState<Array<Candidate['id']>>([]);

  const { data: sprints, status: sprintsQueryStatus } = useQuery({
    queryKey: ['sprints'],
    queryFn: getAllSprints,
    onSuccess: (data) => {
      const lastEntry = data[data.length - 1];
      const { sprint_ref, start_date, end_date } = lastEntry;

      const targetSprint = Number(sprint_ref?.split('.')[1]);
      setTargetSprint(targetSprint);

      const start = start_date ? new Date(start_date) : getTargetSprintStartDate(targetSprint);
      const end = end_date ? new Date(end_date) : getTargetSprintEndDate(start);
      setTargetSprintDates({ start, end });
    },
  });

  const {
    data: candidates,
    status: candidatesQueryStatus,
    refetch,
  } = useQuery({
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

  const createSprintSovereign = useCreateSprintSovereign(setTargetSprint);

  React.useEffect(() => {
    if (!targetSprint) {
      return;
    }

    // Manually update the candidates when the target sprint changes
    // to ensure that the correct teamup data comes through. Simply
    // invalidating queries results in a race condition where a stale
    // value for target sprint is used to get the teamup calendar dates
    refetch();
  }, [refetch, targetSprint]);

  const potentialSuccessors =
    targetSprint && candidates && sprints
      ? candidates
          .filter((candidate) => candidate.is_leaver === false)
          // Exclude the current sprint sovereign
          .filter((candidate) => {
            const currentSprint = sprints[sprints.length - 1];
            return candidate.id !== currentSprint?.sovereign_id;
          })
          // Only show those who have not yet held the crown in the current round
          .filter((candidate, _, filteredArray) => {
            console.log({ filteredArray });
            return (
              candidate.times_crowned ===
              Math.min(...filteredArray.map(({ times_crowned }) => times_crowned))
            );
          })
          .map((candidate) => ({ ...candidate, isExcluded: exclusionList.includes(candidate.id) }))
      : [];

  function handleUpdateExclusionList(id: number) {
    setExclusionList((previous) => {
      return previous.includes(id)
        ? previous.filter((excludedId) => excludedId !== id)
        : [...previous, id];
    });
  }

  return {
    candidates,
    candidatesQueryStatus,
    createSprintSovereign,
    elapsedSprints: sprints?.length,
    exclusionList,
    handleUpdateExclusionList,
    potentialSuccessors,
    sprints,
    sprintsQueryStatus,
    targetSprint,
    targetSprintDates,
  };
}

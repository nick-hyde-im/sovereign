import * as React from 'react';
import { HistoryItem } from './HistoryItem';
import type { Candidate, Sprint } from '../../types/models';
import { getCurrentSprintNumber } from '../utils';

interface SprintHistoryProps {
  candidates: Array<Candidate> | undefined;
  sprints: Array<Sprint> | undefined;
  numberOfElapsedSprints: number | undefined;
}

export function SprintHistory({ candidates, sprints, numberOfElapsedSprints }: SprintHistoryProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isLoading = !candidates || !sprints;
  const resolvedNumberOfElapsedSprints = numberOfElapsedSprints ?? getCurrentSprintNumber();

  const chronologicalSprints = React.useMemo(
    () => (isLoading || !sprints ? [] : sprints.sort((a, b) => a.id - b.id).slice(0, -1)),
    [isLoading, sprints],
  );

  return (
    <section>
      <h2 className="text-4xl font-serif mb-4 text-center">Sprint History</h2>
      <div
        ref={ref}
        className="flex flex-col items-center max-h-44 overflow-y-scroll custom-scrollbar"
      >
        {isLoading
          ? [...Array(resolvedNumberOfElapsedSprints).keys()].map((key) => (
              <div key={key} className="flex items-center animate-pulse h-8 flex-shrink-0">
                <div className="h-4 w-16 bg-slate-600 rounded-sm mr-4" />
                <div className="h-4 w-16 bg-slate-600 rounded-sm" />
              </div>
            ))
          : chronologicalSprints.map((sprint, index) => (
              <HistoryItem
                key={sprint.id}
                candidates={candidates}
                sprint={sprint}
                isLastHistoryItem={index === chronologicalSprints.length - 1}
              />
            ))}
      </div>
    </section>
  );
}

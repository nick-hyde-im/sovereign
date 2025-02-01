import * as React from 'react';
import { useConfirmationDialog, useInteractionOutside, useUpdateSprintSovereign } from '../hooks';

import type { Sprint, Candidate } from '../../types/models';
import { useAuth } from '../hooks';

interface HistoryItemProps {
  candidates: Array<Candidate>;
  isLastHistoryItem: boolean;
  sprint: Sprint;
}

export function HistoryItem({ candidates, sprint, isLastHistoryItem }: HistoryItemProps) {
  const { user } = useAuth();

  const lastCandidateRef = React.useRef<HTMLDivElement>(null);
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  const updateSprintSovereign = useUpdateSprintSovereign();
  const { showDialog } = useConfirmationDialog();

  const handleStartEditing = () => setIsEditing(true);
  const handleStopEditing = () => setIsEditing(false);

  const sovereign = candidates.find((candidate) => candidate.id === sprint.sovereign_id);

  useInteractionOutside(selectRef, handleStopEditing);

  React.useEffect(() => {
    if (isEditing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [isEditing]);

  React.useEffect(() => {
    if (!lastCandidateRef.current || !isLastHistoryItem) {
      return;
    }

    lastCandidateRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [isLastHistoryItem]);

  const handleEdit: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const { id: newSovereignId, name } = JSON.parse(event.currentTarget.value);
    showDialog({
      message: `Are you sure you want to change the sovereign for sprint ${sprint.sprint_number} to ${name}?`,
      onConfirm: () => {
        updateSprintSovereign({ sprintId: sprint.id, newValue: newSovereignId });
        handleStopEditing();
      },
    });
  };

  return (
    <div ref={isLastHistoryItem ? lastCandidateRef : null} className="flex items-baseline">
      <span className="basis-20 mr-4 p-1">{sprint.sprint_ref}:</span>
      {isEditing ? (
        <>
          <select
            ref={selectRef}
            className="bg-transparent mr-4 p-1"
            onChange={handleEdit}
            value={JSON.stringify({ id: sovereign?.id, name: sovereign?.name })}
          >
            {candidates.map(({ id, name }) => (
              <option key={id} value={JSON.stringify({ id, name })}>
                {name}
              </option>
            ))}
          </select>
          <button onClick={handleStopEditing} title="Stop editing">
            🚫
          </button>
        </>
      ) : (
        <>
          <span className="w-16">{sovereign?.name || 'No data'}</span>
          {user && !sprint.is_locked ? (
            <div className="flex-shrink-0 ml-4">
              <button
                className="text-sm -scale-[1] -rotate-90 mr-3"
                onClick={handleStartEditing}
                title="Edit"
              >
                ✏️
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

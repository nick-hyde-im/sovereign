import * as React from 'react';
import { getFormattedSprintDates } from '../utils';
import { useInteractionOutside } from '../hooks';
import { useTargetSprintDates } from '../hooks/react-query/useTargetSprintDates';

function EditableSprintDates() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  const { targetSprintDates, updateSprintDates } = useTargetSprintDates();

  useInteractionOutside(ref, () => setIsEditing(false));

  const [startDate, endDate] = getFormattedSprintDates(
    targetSprintDates?.start,
    targetSprintDates?.end,
    { format: isEditing ? 'input' : 'human' },
  );

  function handleDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    updateSprintDates({
      sprintId: targetSprintDates?.id,
      targetSprintDates: {
        ...targetSprintDates,
        [name]: new Date(value),
      },
    });
  }

  if (isEditing) {
    return (
      <div ref={ref} className="mt-2 text-slate-800">
        <input
          type="date"
          name="start"
          className="mr-2 text-inherit rounded-sm"
          value={startDate}
          onChange={handleDateChange}
        />
        <input
          type="date"
          name="end"
          className="text-inherit rounded-sm"
          value={endDate}
          onChange={handleDateChange}
        />
      </div>
    );
  }

  return (
    <p onClick={() => setIsEditing(true)}>
      ({startDate} - {endDate})
    </p>
  );
}

type SprintNumberDisplayProps = {
  targetSprint: number | undefined;
};

export function SprintNumberDisplay({ targetSprint }: SprintNumberDisplayProps) {
  return (
    <div className="mb-12 text-center">
      <h1 className="text-2xl">
        You are choosing for Sprint{' '}
        {targetSprint ? (
          <span className="inline-block translate-y-[0.025rem]">{targetSprint}</span>
        ) : (
          <span className="inline-block h-6 translate-y-1 w-4 bg-slate-600 rounded-sm animate-pulse" />
        )}
      </h1>
      {targetSprint ? <EditableSprintDates /> : <>&nbsp;</>}
    </div>
  );
}

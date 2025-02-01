import type { UseQueryResult } from '@tanstack/react-query';
import clsx from 'clsx';
import type { Candidate } from '../../types/models';
import { getNumberOfPotentialSuccessors } from '../utils';
import { Tooltip } from './Tooltip';
import { useConfirmationDialog } from '../hooks';

type PotentialSuccessor = Candidate & { isExcluded: boolean };

interface PotentialSuccessorsProps {
  exclusionList: Array<Candidate['id']>;
  handleExcludeToggle: React.MouseEventHandler<HTMLInputElement>;
  potentialSuccessors: Array<PotentialSuccessor>;
  status: UseQueryResult['status'];
  targetSprint: number | undefined;
}

export function PotentialSuccessors({
  exclusionList,
  handleExcludeToggle,
  potentialSuccessors,
  status,
  targetSprint,
}: PotentialSuccessorsProps) {
  const { showDialog } = useConfirmationDialog();
  const isLoading = status === 'loading';

  const numberOfPotentialSuccessors = getNumberOfPotentialSuccessors(targetSprint);

  const handleInfoClick = () => {
    showDialog({
      message: (
        <div className="text-center font-sans flex flex-col gap-2">
          <p>Choose from the available candidates who have not yet held the crown.</p>
          <p>
            <span className="text-orange-500">Orange</span> means the candidate has holiday booked.
            Hover over their name to check TeamUp.
          </p>
          <p>You can reselect them if the holiday clash doesn't matter.</p>
        </div>
      ),
      showCancelButton: false,
    });
  };

  return (
    <section className="mb-8 max-w-xl">
      <h2 className="text-4xl font-serif mb-4 text-center">
        Potential Successors{' '}
        <span
          className="inline-block relative text-2xl -translate-y-[1px] cursor-pointer"
          onClick={handleInfoClick}
        >
          ℹ️
        </span>
      </h2>
      <div className="text-lg mx-auto flex flex-wrap flex-col gap-x-12 content-center max-h-44">
        {isLoading
          ? [...Array(numberOfPotentialSuccessors).keys()].map((key) => (
              <div key={key} className="flex items-center h-7 w-24 gap-4 animate-pulse">
                <div className="h-4 flex-grow bg-slate-600 rounded-sm" />
                <div className="h-4 w-4 bg-slate-600 rounded-sm" />
              </div>
            ))
          : potentialSuccessors.map((candidate) => (
              <div key={candidate.id} className="flex items-center">
                <Tooltip
                  classes={clsx('basis-20 mr-4', candidate.has_holiday && 'cursor-help')}
                  message={
                    <a
                      href="https://teamup.com/ks7psy4y47i1n378qx"
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-500 underline"
                    >
                      {candidate.name} has holiday booked in sprint {targetSprint}.
                    </a>
                  }
                  show={candidate.has_holiday}
                >
                  <label
                    htmlFor={`${candidate.id}-exclude`}
                    className={clsx(
                      candidate.isExcluded && 'line-through',
                      candidate.has_holiday && 'cursor-help text-orange-500',
                    )}
                  >
                    {candidate.name}
                  </label>
                </Tooltip>
                <input
                  id={`${candidate.id}-exclude`}
                  type="checkbox"
                  value={candidate.id}
                  checked={!exclusionList.includes(candidate.id)}
                  onClick={handleExcludeToggle}
                />
              </div>
            ))}
      </div>
    </section>
  );
}

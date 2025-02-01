import * as React from 'react';
import {
  Button,
  Header,
  PotentialSuccessors,
  SprintHistory,
  SprintNumberDisplay,
} from '../components';
import { useAppData, useConfirmationDialog } from '../hooks';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  const { showDialog } = useConfirmationDialog();
  const {
    candidates,
    candidatesQueryStatus,
    createSprintSovereign,
    elapsedSprints,
    exclusionList,
    handleUpdateExclusionList,
    potentialSuccessors,
    sprints,
    targetSprint,
    targetSprintDates,
  } = useAppData();

  const handleExcludeToggle: React.MouseEventHandler<HTMLInputElement> = (event) => {
    const id = Number(event.currentTarget.value);
    handleUpdateExclusionList(id);
  };

  const handleCoronationClick = async () => {
    const viableCandidates = potentialSuccessors.filter((candidate) => !candidate.isExcluded);
    if (!viableCandidates.length) {
      showDialog({ message: 'You must select at least one successor!', showCancelButton: false });
      return;
    }

    const randomIndex = Math.ceil(Math.random() * viableCandidates.length - 1);
    const newSovereign = viableCandidates[randomIndex];

    showDialog({
      message: `The next sovereign will be ${newSovereign.name}! Do you accept?`,
      onConfirm: () => {
        if (!targetSprint) {
          return;
        }

        showDialog({
          message: (
            <div className="text-center">
              <p className="mb-2">🎉 The next sovereign has been crowned! 🎉</p>
              <p className="text-xxl">All hail {newSovereign.name}!</p>
            </div>
          ),
          onConfirm: () => {
            if (!targetSprintDates) {
              throw new Error('No target sprint dates found!');
            }

            createSprintSovereign({
              targetSprint,
              targetSprintDates,
              sovereignId: newSovereign.id,
            });
          },
          showCancelButton: false,
        });
      },
    });
  };
  console.log({ candidates, elapsedSprints, sprints });
  return (
    <main className="container mx-auto flex flex-col items-center">
      <Header />
      <SprintNumberDisplay targetSprint={targetSprint} />
      <PotentialSuccessors
        potentialSuccessors={potentialSuccessors}
        exclusionList={exclusionList}
        handleExcludeToggle={handleExcludeToggle}
        status={candidatesQueryStatus}
        targetSprint={targetSprint}
      />
      <Button className="mb-12" onClick={handleCoronationClick}>
        Pass the crown
      </Button>
      <SprintHistory
        candidates={candidates}
        sprints={sprints}
        numberOfElapsedSprints={elapsedSprints}
      />
    </main>
  );
}

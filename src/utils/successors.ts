import { getNextSprintNumber } from './sprints';

const NUMBER_OF_TEAM_MEMBERS = 11;
const LOADING_CONSTANT = NUMBER_OF_TEAM_MEMBERS + 1;

const getSuccessorCount = (sprint: number) => {
  return LOADING_CONSTANT - (sprint <= LOADING_CONSTANT ? sprint - 1 : sprint % LOADING_CONSTANT);
};

export function getNumberOfPotentialSuccessors(targetSprint: number | undefined) {
  return getSuccessorCount(targetSprint ?? getNextSprintNumber());
}

const MS_IN_A_DAY = 24 * 60 * 60 * 1000;
const DAYS_IN_A_WEEK = 7;

export function getCurrentSprintNumber() {
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);

  const msElapsed = today.valueOf() - firstDayOfYear.valueOf();
  const daysElapsed = Math.floor(msElapsed / MS_IN_A_DAY);
  const weeksElapsed = Math.ceil(daysElapsed / DAYS_IN_A_WEEK);

  const weekNumber = firstDayOfYear.getDay() === 1 ? weeksElapsed : weeksElapsed + 1;
  const sprintNumber = Math.floor((weekNumber - 1) / 2);

  return sprintNumber;
}

export function getNextSprintNumber() {
  return getCurrentSprintNumber() + 1;
}

export function getTargetSprintStartDate(targetSprint: number, year?: number) {
  // Start with the first day of the year
  const startDate = new Date(Date.UTC(year || new Date().getFullYear(), 0, 1));
  // Calculate the day of the week
  const dayOfWeek = startDate.getUTCDay(); // Sunday is 0, Saturday is 6
  // Multiply the target sprint by the number of days in a sprint
  const daysToAdd = (targetSprint - 1) * 14 + (dayOfWeek <= 1 ? 1 - dayOfWeek : 8 - dayOfWeek) + 7;
  startDate.setUTCDate(startDate.getUTCDate() + daysToAdd);
  startDate.setUTCHours(0, 0, 0, 0); // Set time to midnight
  const daysToMonday = startDate.getUTCDay() === 0 ? 6 : startDate.getUTCDay() - 1;
  startDate.setUTCDate(startDate.getUTCDate() - daysToMonday);
  return startDate;
}

export function getSprintStartDateFromPreviousSprintEndDate(previousSprintEndDate: Date) {
  const startDate = previousSprintEndDate;
  startDate.setUTCDate(startDate.getUTCDate() + 3);
  return startDate;
}

export function getTargetSprintEndDate(targetSprintStartDate: Date): Date {
  const endDate = new Date(targetSprintStartDate.getTime());
  endDate.setUTCDate(endDate.getUTCDate() + 11);
  return endDate;
}

function formatDateForHumans(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  });
}

function formatDateForTeamUp(date: Date): string {
  const year = date.getUTCFullYear().toString().padStart(4, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}

function formatDateForSupabase(date: Date): string {
  return date.toISOString();
}

function inputDateFormatter(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getFormattedSprintDates(
  startDate: Date | undefined,
  endDate: Date | undefined,
  { format }: { format: 'human' | 'teamup' | 'supabase' | 'input' },
) {
  if (!startDate || !endDate) {
    return [];
  }

  const formatter = {
    human: formatDateForHumans,
    input: inputDateFormatter,
    supabase: formatDateForSupabase,
    teamup: formatDateForTeamUp,
  }[format];

  return [startDate, endDate].map(formatter);
}

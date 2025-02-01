import { getFormattedSprintDates, supabase } from '../utils';
import type { Candidate } from '../../types/models';

async function getTeamMemberHolidaysForSprint(
  targetSprintDates: { start: Date; end: Date } | undefined,
) {
  const [startDate, endDate] = getFormattedSprintDates(
    targetSprintDates?.start,
    targetSprintDates?.end,
    { format: 'teamup' },
  );

  const teamUpUrl = new URL('https://api.teamup.com/ks7psy4y47i1n378qx/events');
  teamUpUrl.searchParams.set('startDate', startDate);
  teamUpUrl.searchParams.set('endDate', endDate);

  const href = `${teamUpUrl.href}&subcalendarId[]=10380129`;

  const res = await fetch(href, {
    headers: { 'Teamup-Token': import.meta.env.VITE_TEAMUP_API_KEY },
  });

  const { events } = (await res.json()) as { events: Array<{ title: string; who: string }> };

  return events.filter((event) => {
    return (
      event.title.includes('AL') ||
      event.title.includes('A/L') ||
      event.title.toLowerCase().includes('annual') ||
      event.title.toLowerCase().includes('leave')
    );
  });
}

export async function getCandidates(targetSprintDates: { start: Date; end: Date } | undefined) {
  const { data, error } = await supabase
    .from('team_member')
    .select('*, sprint(*)')
    .order('name', { ascending: true });

  if (error || !data) {
    return [];
  }

  const holidays = await getTeamMemberHolidaysForSprint(targetSprintDates);

  const candidates: Array<Candidate> = data.map((candidate) => {
    const hasHolidayInSprint = holidays.some((holiday) => {
      const regex = new RegExp(`\\b${candidate.name}\\b`, 'i');

      return regex.test(holiday.who) || regex.test(holiday.title);
    });

    return {
      ...candidate,
      has_holiday: hasHolidayInSprint,
    };
  });

  return candidates;
}

import {
  getFormattedSprintDates,
  getTargetSprintEndDate,
  getSprintStartDateFromPreviousSprintEndDate,
  supabase,
} from '../utils';
import type { Sprint, Candidate } from '../../types/models';

export async function getAllSprints() {
  const { data, error } = await supabase
    .from('sprint')
    .select('*')
    .eq('team', 4)
    .order('id');

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getLastSprint() {
  const { data, error } = await supabase
    .from('sprint')
    .select('*')
    .order('id', { ascending: false })
    .limit(1);

  if (error || !data) {
    return null;
  }

  return data[0];
}

interface CreateSprintSovereignArgs {
  targetSprint: number;
  targetSprintDates: { start: Date; end: Date };
  sovereignId: Candidate['id'];
}

export async function createSprintSovereign({
  targetSprint,
  targetSprintDates,
  sovereignId,
}: CreateSprintSovereignArgs) {
  const targetYear =
    new Date().getFullYear() < targetSprintDates.end.getFullYear()
      ? new Date().getFullYear() + 1
      : new Date().getFullYear();
  const sprintRef = `${targetYear}.${targetSprint}`;

  const [startDate, endDate] = getFormattedSprintDates(
    targetSprintDates.start,
    targetSprintDates.end,
    {
      format: 'supabase',
    },
  );

  const upsertSprintSovereign = supabase.from('sprint').upsert(
    {
      sprint_number: targetSprint,
      sovereign_id: sovereignId,
      sprint_ref: sprintRef,
      start_date: startDate,
      end_date: endDate,
    },
    { ignoreDuplicates: false, onConflict: 'sprint_ref' },
  );

  const nextSprintStartDate = getSprintStartDateFromPreviousSprintEndDate(targetSprintDates.end);
  const nextSprintEndDate = getTargetSprintEndDate(nextSprintStartDate);

  const [nextStartDate, nextEndDate] = getFormattedSprintDates(
    nextSprintStartDate,
    nextSprintEndDate,
    {
      format: 'supabase',
    },
  );

  const insertNextSprint = supabase.from('sprint').insert({
    sprint_number: targetSprint + 1,
    sprint_ref: `${targetYear}.${targetSprint + 1}`,
    start_date: nextStartDate,
    end_date: nextEndDate,
  });

  await Promise.all([upsertSprintSovereign, insertNextSprint]);
}

interface UpdateSprintSovereignArgs {
  sprintId: Sprint['id'];
  newValue: Candidate['id'] | null;
}

export async function updateSprintSovereign({ sprintId, newValue }: UpdateSprintSovereignArgs) {
  await supabase.from('sprint').update({ sovereign_id: newValue }).eq('id', sprintId);
}

export async function deleteSprint(sprintId: Sprint['id']) {
  await supabase.from('sprint').delete().eq('id', sprintId);
}

export async function updateSprintDates({
  sprintId,
  targetSprintDates,
}: {
  sprintId: Sprint['id'] | undefined;
  targetSprintDates: Partial<{ start: Date; end: Date }> | undefined;
}) {
  if (!sprintId) {
    return;
  }

  const [startDate, endDate] = getFormattedSprintDates(
    targetSprintDates?.start,
    targetSprintDates?.end,
    { format: 'supabase' },
  );

  await supabase
    .from('sprint')
    .update({ start_date: startDate, end_date: endDate })
    .eq('id', sprintId);
}

import type { Database } from './database';

export type Sprint = Database['public']['Tables']['sprint']['Row'];

export type TeamMember = Database['public']['Tables']['team_member']['Row'];
export type Candidate = TeamMember & { has_holiday: boolean };

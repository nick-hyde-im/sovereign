create table
  public.profile (
    id uuid not null,
    created_at timestamp with time zone null default now(),
    is_admin boolean null default false,
    constraint profile_pkey primary key (id)
  ) tablespace pg_default;

create table
  public.team_member (
    id bigint generated by default as identity not null,
    created_at timestamp with time zone null default now(),
    name text not null,
    is_leaver boolean not null default false,
    constraint team_member_pkey primary key (id)
  ) tablespace pg_default;

create table
  public.sprint (
    id bigint generated by default as identity not null,
    created_at timestamp with time zone null default now(),
    sprint_number bigint not null,
    sovereign_id bigint null,
    is_locked boolean not null default false,
    constraint sprint_pkey primary key (id),
    constraint sprint_sprint_number_key unique (sprint_number),
    constraint sprint_sovereign_id_fkey foreign key (sovereign_id) references team_member (id)
  ) tablespace pg_default;

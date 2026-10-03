-- supabase/migrations/20261003_agent_s1.sql
-- Agent slice S1: turns, events, proposals and nudges. Additive only.
-- Writes happen through the service-role server client; students may read their own rows.

create table if not exists cc_agent_turns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  operation_key text not null check (char_length(operation_key) between 8 and 128),
  input_hash text not null,
  status text not null default 'running' check (status in ('running','completed','failed')),
  result jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, operation_key)
);

create table if not exists cc_agent_events (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  turn_id uuid references cc_agent_turns(id) on delete cascade,
  seq int not null default 0,
  type text not null check (type in ('turn.accepted','tool.completed','action.preview','action.committed','action.declined','action.undone','nudge.created','turn.completed','turn.failed')),
  label text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (turn_id, seq)
);
create index if not exists idx_cc_agent_events_user on cc_agent_events(user_id, created_at desc);

create table if not exists cc_agent_proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  student_id uuid not null references cc_student_profiles(id) on delete cascade,
  turn_id uuid references cc_agent_turns(id) on delete set null,
  nudge_id uuid,
  kind text not null check (kind in ('task','calendar_hold','add_schools')),
  payload jsonb not null,
  payload_hash text not null,
  operation_key text not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending','committed','declined','expired','undone')),
  receipt jsonb,
  expires_at timestamptz not null,
  committed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, operation_key)
);
create index if not exists idx_cc_agent_proposals_user on cc_agent_proposals(user_id, status);

create table if not exists cc_agent_nudges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  student_id uuid not null references cc_student_profiles(id) on delete cascade,
  trigger text not null check (trigger in ('plan_conflict','essay_stall','inactivity')),
  entity_key text not null,
  period_key text not null,
  reason jsonb not null,
  status text not null default 'open' check (status in ('open','snoozed','dismissed','done')),
  snoozed_until date,
  created_at timestamptz not null default now(),
  unique (student_id, trigger, entity_key, period_key)
);

alter table cc_agent_turns enable row level security;
alter table cc_agent_events enable row level security;
alter table cc_agent_proposals enable row level security;
alter table cc_agent_nudges enable row level security;
create policy cc_agent_turns_read_own on cc_agent_turns for select using (user_id = auth.uid());
create policy cc_agent_events_read_own on cc_agent_events for select using (user_id = auth.uid());
create policy cc_agent_proposals_read_own on cc_agent_proposals for select using (user_id = auth.uid());
create policy cc_agent_nudges_read_own on cc_agent_nudges for select using (user_id = auth.uid());

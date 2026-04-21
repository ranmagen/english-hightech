-- TechSpace Initial Schema

-- Users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  class text not null,
  role text not null default 'student', -- 'student' | 'admin'
  created_at timestamp with time zone default now()
);

-- Scenarios (seeded from JSON, editable via admin)
create table if not exists public.scenarios (
  id text primary key,         -- 'B-01', 'I-02', etc.
  title text not null,
  level text not null,         -- 'beginner' | 'intermediate' | 'advanced'
  agents text[] not null,
  goal text not null,
  context_doc text,
  hint text,
  success_criteria jsonb not null default '{}',
  branches jsonb not null default '[]',
  is_published boolean not null default false,
  unlock_requires text[] not null default '{}',
  opening_message text,
  opening_agent text,
  writing_mode text default 'chat'
);

-- Conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  scenario_id text references public.scenarios(id),
  messages jsonb not null default '[]',
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  goal_achieved boolean
);

-- Scores
create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  scenario_id text,
  clarity integer check (clarity between 1 and 4),
  tone text check (tone in ('inappropriate', 'acceptable', 'professional', 'excellent')),
  vocabulary_count integer not null default 0,
  tech_comprehension integer check (tech_comprehension between 1 and 5),
  stakeholder_awareness integer check (stakeholder_awareness between 1 and 5),
  presentation_quality integer,
  team_collaboration integer check (team_collaboration between 1 and 5),
  scenario_completion boolean not null default false,
  complexity_bonus integer not null default 0,
  feedback_text text,
  teacher_note text,
  created_at timestamp with time zone default now()
);

-- Glossary
create table if not exists public.glossary (
  id uuid primary key default gen_random_uuid(),
  term text unique not null,
  definition_he text not null,
  category text not null default 'general'
);

-- Indexes
create index if not exists idx_conversations_user_id on public.conversations(user_id);
create index if not exists idx_conversations_scenario_id on public.conversations(scenario_id);
create index if not exists idx_scores_user_id on public.scores(user_id);
create index if not exists idx_scores_scenario_id on public.scores(scenario_id);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.conversations enable row level security;
alter table public.scores enable row level security;
alter table public.scenarios enable row level security;
alter table public.glossary enable row level security;

-- Basic policies (open read for now, restrict writes to authenticated)
create policy "Public scenarios read" on public.scenarios for select using (is_published = true);
create policy "Public glossary read" on public.glossary for select using (true);

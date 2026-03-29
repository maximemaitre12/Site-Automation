
-- Farmasoft tables

CREATE TABLE public.farmasoft_jobs (
  id bigint generated always as identity primary key,
  title text not null,
  location text,
  salary_min integer default 0,
  salary_max integer default 0,
  salary_currency text default 'UAH',
  experience_years integer default 0,
  skills text default '[]',
  description text default '',
  requirements text default '',
  is_active integer default 1,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TABLE public.farmasoft_candidates (
  id bigint generated always as identity primary key,
  job_id bigint references public.farmasoft_jobs(id) on delete set null,
  initials text default '',
  role text default '',
  location text default '',
  experience_years integer default 0,
  experience_text text default '',
  salary_expectation integer default 0,
  source_platform text default '',
  profile_url text default '',
  tags text default '[]',
  profile_data text,
  status text default 'new',
  source_type text default 'scraped',
  stage text default 'new',
  qualification_score integer,
  qualification_notes text,
  cv_filename text,
  cv_text text,
  rejection_reason text,
  decision text default 'pending',
  viewed_at timestamptz,
  contacted_at timestamptz,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now()
);

CREATE TABLE public.farmasoft_interviews (
  id bigint generated always as identity primary key,
  candidate_id bigint references public.farmasoft_candidates(id) on delete cascade not null,
  job_id bigint references public.farmasoft_jobs(id) on delete set null,
  scheduled_at timestamptz not null,
  type text default 'phone',
  interviewer text default '',
  notes text default '',
  decision text default 'pending',
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TABLE public.farmasoft_messages (
  id bigint generated always as identity primary key,
  job_id bigint references public.farmasoft_jobs(id) on delete set null,
  name text default '',
  subject text default '',
  body text default '',
  language text default 'uk',
  ai_generated integer default 0,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TABLE public.farmasoft_events (
  id bigint generated always as identity primary key,
  type text not null,
  job_id bigint,
  candidate_id bigint,
  metadata text default '{}',
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now()
);

CREATE TABLE public.farmasoft_settings (
  key text primary key,
  value text default '',
  user_id uuid references auth.users(id) on delete cascade not null
);

-- RLS
ALTER TABLE public.farmasoft_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmasoft_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmasoft_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmasoft_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmasoft_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmasoft_settings ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own data
CREATE POLICY "Users manage own jobs" ON public.farmasoft_jobs FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own candidates" ON public.farmasoft_candidates FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own interviews" ON public.farmasoft_interviews FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own messages" ON public.farmasoft_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own events" ON public.farmasoft_events FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own settings" ON public.farmasoft_settings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

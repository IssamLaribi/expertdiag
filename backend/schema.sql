create table if not exists public.intake_requests (
    submission_id uuid primary key,
    kind text not null check (kind in ('quote', 'contact')),
    request_hash text not null,
    reference text not null unique,
    payload jsonb not null,
    created_at timestamptz not null default now()
);

alter table public.intake_requests enable row level security;
revoke all on table public.intake_requests from anon, authenticated;
grant select, insert on table public.intake_requests to service_role;

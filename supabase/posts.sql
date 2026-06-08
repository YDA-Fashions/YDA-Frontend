-- YDA Blog: posts table + RLS
-- Run once in Supabase SQL Editor

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text default '',
  content text default '',
  cover_image text default '',
  author text default 'YDA Studio',
  category text default 'Heritage',
  published boolean default false,
  created_at timestamptz default now()
);

create index if not exists posts_slug_idx on public.posts (slug);
create index if not exists posts_published_created_idx on public.posts (published, created_at desc);

alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
drop policy if exists "Authenticated can read all posts" on public.posts;
drop policy if exists "Admins can manage posts" on public.posts;

create policy "Public can read published posts"
  on public.posts for select
  using (published = true);

create policy "Authenticated can read all posts"
  on public.posts for select
  to authenticated
  using (true);

create policy "Admins can manage posts"
  on public.posts for all
  to authenticated
  using (
    auth.jwt() ->> 'email' ilike '%@ydafashions.com'
    or auth.jwt() ->> 'email' in (
      'support@ydafashions.com',
      'ydafashions@gmail.com',
      'harshitnaiwal@zohomail.in'
    )
  )
  with check (
    auth.jwt() ->> 'email' ilike '%@ydafashions.com'
    or auth.jwt() ->> 'email' in (
      'support@ydafashions.com',
      'ydafashions@gmail.com',
      'harshitnaiwal@zohomail.in'
    )
  );

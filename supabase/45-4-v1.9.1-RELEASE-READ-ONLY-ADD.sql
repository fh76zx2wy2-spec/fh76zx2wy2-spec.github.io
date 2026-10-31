-- 45/4 v1.9.1: تسجيل قراءة الميزات لكل مستخدم ولكل إصدار.
-- إضافة آمنة: لا يمس هذا الملف الفريق ولا زيارات النادي ولا الاشتراكات أو التنبيهات.
-- نفّذه بعد نسخة v1.9.0 إن لم تكن نفّذتها بعد.

create table if not exists public.app_release_seen (
  user_id uuid not null references auth.users(id) on delete cascade,
  release_version text not null check (char_length(release_version) between 1 and 32),
  seen_at timestamptz not null default now(),
  primary key (user_id, release_version)
);

alter table public.app_release_seen enable row level security;
revoke all on table public.app_release_seen from public, anon, authenticated;
grant select, insert on table public.app_release_seen to authenticated;

drop policy if exists "45-4 member sees own release notes" on public.app_release_seen;
create policy "45-4 member sees own release notes"
on public.app_release_seen for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "45-4 member acknowledges own release notes" on public.app_release_seen;
create policy "45-4 member acknowledges own release notes"
on public.app_release_seen for insert to authenticated
with check (user_id = (select auth.uid()));

select '45/4 release v1.9.1 installed (no existing data changed)' as result;

-- ============================================================================
-- 45/4 — سجل الحضور والمقارنة بين زياد وعبدالسلام
-- لا يحذف هذا الملف أي زيارة أو جلسة سابقة.
-- يوسّع get_buddy_stats ويضيف get_buddy_attendance لعرض السجل المشترك فقط.
-- الوزن والقياسات والبيانات الصحية الخاصة لا تُشارك.
-- ============================================================================

insert into public.allowed_emails (email)
values ('z062496@gmail.com'), ('amk157662@gmail.com')
on conflict (email) do nothing;

drop function if exists public.get_buddy_stats();

create or replace function public.get_buddy_stats()
returns table (
  user_id uuid,
  display_name text,
  email text,
  weekly_sessions integer,
  weekly_visits integer,
  weekly_visit_seconds bigint,
  monthly_visits integer,
  monthly_visit_seconds bigint,
  all_visits integer,
  all_visit_seconds bigint,
  first_arrived_at timestamptz,
  last_arrived_at timestamptz,
  last_left_at timestamptz,
  last_visit_seconds bigint,
  in_gym boolean,
  active_arrived_at timestamptz,
  streak_4of4 integer
)
language plpgsql
stable
security definer
set search_path = public, auth
as $$
declare
  caller_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  e text;
  uid uuid;
  wk_start date;
  month_start date;
  w date;
  cnt integer;
  streak integer;
  lv_arrived timestamptz;
  lv_left timestamptz;
  lv_seconds bigint;
begin
  if caller_email not in ('z062496@gmail.com', 'amk157662@gmail.com') then
    raise exception 'buddy_not_allowed';
  end if;
  if not exists (select 1 from public.allowed_emails a where a.email = caller_email) then
    raise exception 'buddy_not_allowed';
  end if;

  wk_start := (now() at time zone 'Asia/Riyadh')::date
              - extract(dow from (now() at time zone 'Asia/Riyadh')::date)::integer;
  month_start := date_trunc('month', (now() at time zone 'Asia/Riyadh'))::date;

  foreach e in array array['z062496@gmail.com','amk157662@gmail.com']
  loop
    select u.id into uid from auth.users u where lower(u.email) = e limit 1;
    if uid is null then continue; end if;

    select least(4, count(distinct v.date))::integer
      into cnt
      from public.gym_visits v
     where v.user_id = uid
       and v.date between wk_start and wk_start + 6;
    weekly_sessions := coalesce(cnt, 0);

    select count(*)::integer,
           coalesce(sum(greatest(0, extract(epoch from (coalesce(v.left_at, now()) - v.arrived_at))))::bigint, 0)
      into weekly_visits, weekly_visit_seconds
      from public.gym_visits v
     where v.user_id = uid
       and v.date between wk_start and wk_start + 6;

    select count(*)::integer,
           coalesce(sum(greatest(0, extract(epoch from (coalesce(v.left_at, now()) - v.arrived_at))))::bigint, 0)
      into monthly_visits, monthly_visit_seconds
      from public.gym_visits v
     where v.user_id = uid
       and v.date >= month_start
       and v.date < (month_start + interval '1 month')::date;

    select count(*)::integer,
           coalesce(sum(greatest(0, extract(epoch from (coalesce(v.left_at, now()) - v.arrived_at))))::bigint, 0),
           min(v.arrived_at)
      into all_visits, all_visit_seconds, first_arrived_at
      from public.gym_visits v
     where v.user_id = uid;

    lv_arrived := null; lv_left := null; lv_seconds := 0;
    select v.arrived_at, v.left_at,
           greatest(0, extract(epoch from (coalesce(v.left_at, now()) - v.arrived_at))::bigint)
      into lv_arrived, lv_left, lv_seconds
      from public.gym_visits v
     where v.user_id = uid
     order by v.arrived_at desc
     limit 1;

    last_arrived_at := lv_arrived;
    last_left_at := lv_left;
    last_visit_seconds := coalesce(lv_seconds, 0);
    in_gym := lv_arrived is not null and lv_left is null;
    active_arrived_at := case when in_gym then lv_arrived else null end;

    streak := 0;
    w := wk_start;
    if weekly_sessions < 4 then w := w - 7; end if;
    for i in 1..260 loop
      select least(4, count(distinct v.date))::integer
        into cnt
        from public.gym_visits v
       where v.user_id = uid
         and v.date between w and w + 6;
      exit when coalesce(cnt, 0) < 4;
      streak := streak + 1;
      w := w - 7;
    end loop;

    user_id := uid;
    email := e;
    display_name := case e
      when 'z062496@gmail.com' then 'زياد'
      when 'amk157662@gmail.com' then 'عبدالسلام'
      else 'رفيق التمرين'
    end;
    streak_4of4 := streak;
    return next;
  end loop;
end;
$$;

revoke all on function public.get_buddy_stats() from public, anon;
grant execute on function public.get_buddy_stats() to authenticated;

-- أيام الحضور المشتركة ضمن مدة يطلبها الموقع (بحد أقصى سنتين لكل طلب).
drop function if exists public.get_buddy_attendance(date, date);
create or replace function public.get_buddy_attendance(p_from date, p_to date)
returns table (
  user_id uuid,
  display_name text,
  email text,
  visit_date date,
  visit_count integer,
  visit_seconds bigint
)
language plpgsql
stable
security definer
set search_path = public, auth
as $$
declare
  caller_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  safe_from date;
  safe_to date;
begin
  if caller_email not in ('z062496@gmail.com', 'amk157662@gmail.com') then
    raise exception 'buddy_not_allowed';
  end if;
  if not exists (select 1 from public.allowed_emails a where a.email = caller_email) then
    raise exception 'buddy_not_allowed';
  end if;

  safe_to := least(coalesce(p_to, (now() at time zone 'Asia/Riyadh')::date), (now() at time zone 'Asia/Riyadh')::date + 1);
  safe_from := greatest(coalesce(p_from, safe_to - 90), safe_to - 730);

  return query
  select u.id,
         case lower(u.email)
           when 'z062496@gmail.com' then 'زياد'
           when 'amk157662@gmail.com' then 'عبدالسلام'
           else 'رفيق التمرين'
         end::text,
         lower(u.email)::text,
         v.date,
         count(*)::integer,
         coalesce(sum(greatest(0, extract(epoch from (coalesce(v.left_at, now()) - v.arrived_at))))::bigint, 0)
    from public.gym_visits v
    join auth.users u on u.id = v.user_id
   where lower(u.email) in ('z062496@gmail.com','amk157662@gmail.com')
     and v.date between safe_from and safe_to
   group by u.id, u.email, v.date
   order by v.date desc, lower(u.email);
end;
$$;

revoke all on function public.get_buddy_attendance(date, date) from public, anon;
grant execute on function public.get_buddy_attendance(date, date) to authenticated;

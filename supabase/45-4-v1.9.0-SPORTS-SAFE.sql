-- 45/4 v1.9.0 — رياضات أخرى وتحديث 4/4 (تحديث إضافي غير هدّام)
-- لا يغيّر push_subscriptions أو auth.users أو gym_visits أو أسرار/جدولة الإشعارات.
-- شغّل مرة واحدة بعد التأكد من وجود تحديث الخصوصية 16 أكتوبر 2026.
BEGIN;

CREATE TABLE IF NOT EXISTS public.sport_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Riyadh')::date,
  sport_key text NOT NULL CHECK (sport_key IN ('walking','cycling','swimming','running','football','padel','basketball','hiking','jump_rope','home_workout','rowing','other')),
  sport_label text,
  target_distance_km numeric(7,2) CHECK (target_distance_km IS NULL OR (target_distance_km > 0 AND target_distance_km <= 500)),
  distance_km numeric(7,2) CHECK (distance_km IS NULL OR (distance_km > 0 AND distance_km <= 500)),
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  duration_seconds integer NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sport_other_label CHECK (sport_key <> 'other' OR (sport_label IS NOT NULL AND length(btrim(sport_label)) BETWEEN 1 AND 45))
);
CREATE INDEX IF NOT EXISTS sport_activities_user_date_idx ON public.sport_activities(user_id,date DESC);
CREATE UNIQUE INDEX IF NOT EXISTS sport_activities_one_open_idx ON public.sport_activities(user_id) WHERE ended_at IS NULL;

-- قواعد التاريخ والمدة مشتقة من السيرفر، ولا يمكن للعميل انتحال مدة رياضية.
CREATE OR REPLACE FUNCTION public.guard_45_4_sport_activity()
RETURNS trigger LANGUAGE plpgsql SET search_path=public,pg_temp AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.started_at := now();
    NEW.date := (now() AT TIME ZONE 'Asia/Riyadh')::date;
    NEW.ended_at := NULL;
    NEW.duration_seconds := 0;
  ELSE
    IF OLD.ended_at IS NOT NULL THEN RAISE EXCEPTION 'completed_activity_is_immutable'; END IF;
    IF NEW.user_id <> OLD.user_id OR NEW.sport_key <> OLD.sport_key OR NEW.started_at <> OLD.started_at OR NEW.date <> OLD.date THEN
      RAISE EXCEPTION 'cannot_change_activity_identity';
    END IF;
    IF NEW.ended_at IS NOT NULL THEN
      NEW.ended_at := now();
      NEW.duration_seconds := greatest(0,floor(extract(epoch from (NEW.ended_at - OLD.started_at)))::integer);
    ELSE
      NEW.duration_seconds := 0;
    END IF;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS sport_activity_guard_tg ON public.sport_activities;
CREATE TRIGGER sport_activity_guard_tg BEFORE INSERT OR UPDATE ON public.sport_activities
FOR EACH ROW EXECUTE FUNCTION public.guard_45_4_sport_activity();

ALTER TABLE public.sport_activities ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sport_activities FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sport_activities TO authenticated;
DROP POLICY IF EXISTS "45/4 sport read own" ON public.sport_activities;
DROP POLICY IF EXISTS "45/4 sport insert own" ON public.sport_activities;
DROP POLICY IF EXISTS "45/4 sport update own" ON public.sport_activities;
DROP POLICY IF EXISTS "45/4 sport delete own" ON public.sport_activities;
-- الخصوصية: لا يقرأ أي عضو مباشرةً أنشطة عضو آخر؛ المدير يرى مجاميع الفريق عبر RPC المقيّد.
CREATE POLICY "45/4 sport read own" ON public.sport_activities FOR SELECT TO authenticated
 USING (user_id=(select auth.uid()) AND public.is_active_45_4_member());
CREATE POLICY "45/4 sport insert own" ON public.sport_activities FOR INSERT TO authenticated
 WITH CHECK (user_id=(select auth.uid()) AND public.is_active_45_4_member());
CREATE POLICY "45/4 sport update own" ON public.sport_activities FOR UPDATE TO authenticated
 USING (user_id=(select auth.uid()) AND public.is_active_45_4_member())
 WITH CHECK (user_id=(select auth.uid()) AND public.is_active_45_4_member());
CREATE POLICY "45/4 sport delete own" ON public.sport_activities FOR DELETE TO authenticated
 USING (user_id=(select auth.uid()) AND public.is_active_45_4_member() AND ended_at IS NULL);


-- أرقام الفريق: نفس صلاحيات الخصوصية السابقة، لكن يوم النادي أو رياضة أخرى = يوم 4/4.
create or replace function public.get_buddy_stats()
returns table (
  user_id text,
  member_id uuid,
  display_name text,
  email text,
  avatar_path text,
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
set search_path=public,auth
as $$
declare
  caller_email text := lower(coalesce(auth.jwt() ->> 'email',''));
  m record;
  uid uuid;
  wk_start date;
  month_start date;
  w date;
  cnt integer;
  streak integer;
  lv_arrived timestamptz;
  lv_left timestamptz;
  lv_seconds bigint;
  tracking_start date := date '2026-09-24';
begin
  if not exists(select 1 from public.team_members tm where tm.email=caller_email and tm.is_active)
     or not exists(select 1 from public.allowed_emails a where a.email=caller_email) then
    raise exception 'buddy_not_allowed';
  end if;

  wk_start := (now() at time zone 'Asia/Riyadh')::date
              - extract(dow from (now() at time zone 'Asia/Riyadh')::date)::integer;
  month_start := date_trunc('month',(now() at time zone 'Asia/Riyadh'))::date;

  for m in
    select tm.*
    from public.team_members tm
    where tm.is_active
      and (public.is_45_4_admin() or tm.email in (caller_email,'z062496@gmail.com'))
    order by tm.display_order,tm.created_at
  loop
    select u.id into uid from auth.users u where lower(u.email)=m.email limit 1;

    user_id := case when uid is null then 'pending:'||m.email else uid::text end;
    member_id := m.id;
    display_name := m.display_name;
    email := m.email;
    avatar_path := m.avatar_path;

    if uid is null then
      weekly_sessions:=0; weekly_visits:=0; weekly_visit_seconds:=0;
      monthly_visits:=0; monthly_visit_seconds:=0; all_visits:=0; all_visit_seconds:=0;
      first_arrived_at:=null; last_arrived_at:=null; last_left_at:=null; last_visit_seconds:=0;
      in_gym:=false; active_arrived_at:=null; streak_4of4:=0;
      return next;
      continue;
    end if;

    SELECT least(4,count(distinct activity_date))::integer INTO cnt FROM (
      SELECT v.date AS activity_date FROM public.gym_visits v WHERE v.user_id=uid AND v.date BETWEEN wk_start AND wk_start+6
      UNION ALL
      SELECT a.date FROM public.sport_activities a WHERE a.user_id=uid AND a.ended_at IS NOT NULL AND a.date BETWEEN wk_start AND wk_start+6
    ) combined_days;
    weekly_sessions:=coalesce(cnt,0);

    SELECT count(*)::integer,coalesce(sum(seconds),0)::bigint INTO weekly_visits,weekly_visit_seconds FROM (
      SELECT greatest(0,extract(epoch from(coalesce(v.left_at,now())-v.arrived_at)))::bigint AS seconds
      FROM public.gym_visits v WHERE v.user_id=uid AND v.date BETWEEN wk_start AND wk_start+6
      UNION ALL
      SELECT a.duration_seconds::bigint FROM public.sport_activities a
      WHERE a.user_id=uid AND a.ended_at IS NOT NULL AND a.date BETWEEN wk_start AND wk_start+6
    ) combined_activities;

    SELECT count(*)::integer,coalesce(sum(seconds),0)::bigint INTO monthly_visits,monthly_visit_seconds FROM (
      SELECT greatest(0,extract(epoch from(coalesce(v.left_at,now())-v.arrived_at)))::bigint AS seconds
      FROM public.gym_visits v WHERE v.user_id=uid AND v.date>=greatest(month_start,tracking_start) AND v.date<(month_start+interval '1 month')::date
      UNION ALL
      SELECT a.duration_seconds::bigint FROM public.sport_activities a
      WHERE a.user_id=uid AND a.ended_at IS NOT NULL AND a.date>=greatest(month_start,tracking_start) AND a.date<(month_start+interval '1 month')::date
    ) combined_activities;

    SELECT count(*)::integer,coalesce(sum(seconds),0)::bigint,min(started) INTO all_visits,all_visit_seconds,first_arrived_at FROM (
      SELECT greatest(0,extract(epoch from(coalesce(v.left_at,now())-v.arrived_at)))::bigint AS seconds,v.arrived_at AS started
      FROM public.gym_visits v WHERE v.user_id=uid AND v.date>=tracking_start
      UNION ALL
      SELECT a.duration_seconds::bigint,a.started_at FROM public.sport_activities a
      WHERE a.user_id=uid AND a.ended_at IS NOT NULL AND a.date>=tracking_start
    ) combined_activities;

    lv_arrived:=null; lv_left:=null; lv_seconds:=0;
    select v.arrived_at,v.left_at,greatest(0,extract(epoch from(coalesce(v.left_at,now())-v.arrived_at))::bigint)
      into lv_arrived,lv_left,lv_seconds
      from public.gym_visits v where v.user_id=uid and v.date>=tracking_start
     order by v.arrived_at desc limit 1;
    last_arrived_at:=lv_arrived; last_left_at:=lv_left; last_visit_seconds:=coalesce(lv_seconds,0);
    in_gym:=lv_arrived is not null and lv_left is null;
    active_arrived_at:=case when in_gym then lv_arrived else null end;

    streak:=0; w:=wk_start;
    if weekly_sessions<4 then w:=w-7; end if;
    for i in 1..260 loop
      exit when (w+6)<tracking_start;
      SELECT least(4,count(distinct activity_date))::integer INTO cnt FROM (
        SELECT v.date AS activity_date FROM public.gym_visits v WHERE v.user_id=uid AND v.date BETWEEN greatest(w,tracking_start) AND w+6
        UNION ALL
        SELECT a.date FROM public.sport_activities a WHERE a.user_id=uid AND a.ended_at IS NOT NULL AND a.date BETWEEN greatest(w,tracking_start) AND w+6
      ) combined_days;
      exit when coalesce(cnt,0)<4;
      streak:=streak+1; w:=w-7;
    end loop;
    streak_4of4:=streak;
    return next;
  end loop;
end;
$$;
revoke all on function public.get_buddy_stats() from public,anon;
grant execute on function public.get_buddy_stats() to authenticated;


-- تقويم الفريق: لا يرى عبدالسلام ضيدان، ولا يرى ضيدان عبدالسلام.
create or replace function public.get_buddy_attendance(p_from date,p_to date)
returns table(user_id uuid,display_name text,email text,visit_date date,visit_count integer,visit_seconds bigint)
language plpgsql stable security definer set search_path=public,auth
as $$
declare caller_email text:=lower(coalesce(auth.jwt()->>'email','')); safe_from date; safe_to date; tracking_start date:=date '2026-09-24';
begin
  if not exists(select 1 from public.team_members tm where tm.email=caller_email and tm.is_active) then raise exception 'buddy_not_allowed'; end if;
  safe_to:=least(coalesce(p_to,(now() at time zone 'Asia/Riyadh')::date),(now() at time zone 'Asia/Riyadh')::date+1);
  safe_from:=greatest(coalesce(p_from,safe_to-90),safe_to-730,tracking_start);
  return query
  SELECT u.id,tm.display_name,tm.email,a.date,count(*)::integer,coalesce(sum(a.seconds),0)::bigint
  FROM (
    SELECT v.user_id,v.date,greatest(0,extract(epoch from(coalesce(v.left_at,now())-v.arrived_at)))::bigint AS seconds
      FROM public.gym_visits v WHERE v.date BETWEEN safe_from AND safe_to
    UNION ALL
    SELECT s.user_id,s.date,s.duration_seconds::bigint FROM public.sport_activities s
      WHERE s.date BETWEEN safe_from AND safe_to AND s.ended_at IS NOT NULL
  ) a
  JOIN auth.users u ON u.id=a.user_id
  JOIN public.team_members tm ON tm.email=lower(u.email) AND tm.is_active
  WHERE public.is_45_4_admin() OR tm.email IN (caller_email,'z062496@gmail.com')
  GROUP BY u.id,tm.display_name,tm.email,a.date,tm.display_order
  ORDER BY a.date DESC,tm.display_order,tm.email;
end;
$$;
revoke all on function public.get_buddy_attendance(date,date) from public,anon;
grant execute on function public.get_buddy_attendance(date,date) to authenticated;


COMMIT;

-- تحقق قراءة فقط بعد التنفيذ:
SELECT to_regclass('public.sport_activities') AS sport_table_created;

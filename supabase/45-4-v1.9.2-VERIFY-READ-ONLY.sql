-- 45/4 v1.9.2 — فحص قراءة فقط؛ لا يحذف ولا يُعدل شيئًا.
-- نفّذ في SQL Editor لتعرف هل جدول الرياضات موجود.
select
  to_regclass('public.sport_activities') as sports_table,
  to_regclass('public.push_subscriptions') as push_table,
  to_regclass('public.team_members') as members_table;

-- إن ظهر NULL أمام sports_table فشغّل:
-- supabase/45-4-v1.9.0-SPORTS-SAFE.sql
-- لا تُشغّل أي سكربت حذف بيانات، ولا تعدّل VAPID أو Cron أو اشتراكات الإشعارات.
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname='public' and tablename='sport_activities'
order by policyname;

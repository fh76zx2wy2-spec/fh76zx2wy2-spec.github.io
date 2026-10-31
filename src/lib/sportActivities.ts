/**
 * أنشطة خارج النادي. مستقلّة عن gym_visits وعن اشتراكات Web Push.
 * لا يقرأ العميل إلا أنشطة حسابه عبر RLS؛ رؤية المنافسة تتم عبر RPC الآمن.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './auth';
import { supabase } from './supabase';

export const SPORT_OPTIONS = [
  { key: 'walking', title: 'المشي', emoji: '🚶', distance: true },
  { key: 'cycling', title: 'الدراجة', emoji: '🚴', distance: true },
  { key: 'swimming', title: 'السباحة', emoji: '🏊', distance: true },
  { key: 'running', title: 'الجري', emoji: '🏃', distance: true },
  { key: 'football', title: 'كرة القدم', emoji: '⚽', distance: false },
  { key: 'padel', title: 'البادل', emoji: '🎾', distance: false },
  { key: 'basketball', title: 'كرة السلة', emoji: '🏀', distance: false },
  { key: 'hiking', title: 'المشي الجبلي', emoji: '🥾', distance: true },
  { key: 'jump_rope', title: 'نط الحبل', emoji: '🪢', distance: false },
  { key: 'home_workout', title: 'تمارين منزلية', emoji: '🏠', distance: false },
  { key: 'rowing', title: 'التجديف', emoji: '🚣', distance: true },
  { key: 'other', title: 'رياضة أخرى', emoji: '💪', distance: false },
] as const;

export type SportKey = (typeof SPORT_OPTIONS)[number]['key'];
export type SportActivity = {
  id: string;
  user_id: string;
  date: string;
  sport_key: SportKey;
  sport_label: string | null;
  distance_km: number | null;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
};

export function sportLabel(record: Pick<SportActivity, 'sport_key' | 'sport_label'>): string {
  return record.sport_key === 'other'
    ? (record.sport_label || 'رياضة أخرى')
    : (SPORT_OPTIONS.find((s) => s.key === record.sport_key)?.title ?? 'رياضة');
}

async function sendSportPush(action: 'sport-started' | 'sport-finished', activityId: string): Promise<void> {
  if (!supabase) return;
  // لا يغيّر الاشتراك، ولا يستدعي enablePush أو يطلب إعادة الأذونات.
  try {
    const { error } = await supabase.functions.invoke('push-45-4', { body: { action, activityId } });
    if (error) console.warn('Sport push not delivered:', error.message);
  } catch (e) {
    // فشل مؤقت في الإشعارات لا يلغي النشاط المحفوظ في قاعدة البيانات.
    console.warn('Sport push not delivered:', e);
  }
}

function checkDistance(raw: string): number | null {
  if (!raw.trim()) return null;
  const n = Number(raw.replace(',', '.'));
  if (!Number.isFinite(n) || n <= 0 || n > 500) throw new Error('أدخل مسافة صحيحة بين 0 و500 كم، أو اتركها فارغة.');
  return Math.round(n * 100) / 100;
}

export function useSportActivities() {
  const { user } = useAuth();
  const [records, setRecords] = useState<SportActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase || !user?.id) { setRecords([]); setLoading(false); return; }
    const { data, error: dbError } = await supabase.from('sport_activities')
      .select('id,user_id,date,sport_key,sport_label,distance_km,started_at,ended_at,duration_seconds')
      .eq('user_id', user.id).order('started_at', { ascending: false }).limit(300);
    if (dbError) {
      // فشل القراءة قد يعني أن جدول الرياضات لم يُنشأ بعد، أو أن صلاحية الحساب تحتاج إصلاحًا.
      const missingTable = dbError.code === '42P01' || dbError.code === 'PGRST205' || /sport_activities.*(not found|does not exist)/i.test(dbError.message);
      setError(missingTable
        ? 'لم تُفعَّل الرياضات الخارجية في Supabase بعد. نفّذ ملف SQL الخاص بالرياضات، ثم اضغط «إعادة التحقق».'
        : `تعذر تحميل الرياضات من قاعدة البيانات (${dbError.message}). راجع إعدادات SQL والصلاحيات ثم أعد التحقق.`);
      setLoading(false);
      return;
    }
    setRecords((data ?? []) as SportActivity[]);
    setError(null);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    void refresh();
    const t = window.setInterval(() => { void refresh(); }, 60_000);
    const onFocus = () => { void refresh(); };
    window.addEventListener('focus', onFocus);
    return () => { window.clearInterval(t); window.removeEventListener('focus', onFocus); };
  }, [refresh]);

  const active = useMemo(() => records.find((r) => r.ended_at === null) ?? null, [records]);

  const start = useCallback(async (sportKey: SportKey, label: string) => {
    if (!supabase || !user?.id) throw new Error('سجّل الدخول أولًا.');
    if (active) throw new Error('يوجد نشاط جارٍ. أنهه قبل بدء نشاط آخر.');
    const option = SPORT_OPTIONS.find((o) => o.key === sportKey);
    if (!option) throw new Error('اختر نوع الرياضة.');
    const sportLabelValue = sportKey === 'other' ? label.trim().slice(0, 45) : null;
    if (sportKey === 'other' && !sportLabelValue) throw new Error('اكتب اسم الرياضة.');
    setBusy(true);
    try {
      const { data, error: dbError } = await supabase.from('sport_activities').insert({
        user_id: user.id, sport_key: sportKey, sport_label: sportLabelValue,
      }).select('id').single();
      if (dbError || !data) throw new Error(dbError?.code === '42P01' || dbError?.code === 'PGRST205' ? 'لم يُجهَّز جدول الرياضات في Supabase بعد. نفّذ SQL ثم حاول مجددًا.' : (dbError?.message || 'تعذر بدء الرياضة.'));
      await refresh();
      await sendSportPush('sport-started', data.id);
    } finally { setBusy(false); }
  }, [user?.id, active, refresh]);

  const finish = useCallback(async (activity: SportActivity, distanceRaw: string) => {
    if (!supabase || !user?.id || activity.user_id !== user.id) throw new Error('لا يمكنك تعديل نشاط عضو آخر.');
    const distance = checkDistance(distanceRaw);
    setBusy(true);
    try {
      const { data, error: dbError } = await supabase.from('sport_activities')
        .update({ ended_at: new Date().toISOString(), distance_km: distance })
        .eq('id', activity.id).eq('user_id', user.id).is('ended_at', null)
        .select('id').single();
      if (dbError || !data) throw new Error(dbError?.message || 'تعذر إنهاء الرياضة.');
      await refresh();
      await sendSportPush('sport-finished', data.id);
    } finally { setBusy(false); }
  }, [user?.id, refresh]);

  const cancel = useCallback(async (activity: SportActivity) => {
    if (!supabase || !user?.id || activity.user_id !== user.id || activity.ended_at) throw new Error('لا يمكن إلغاء هذا النشاط.');
    setBusy(true);
    try {
      const { error: dbError } = await supabase.from('sport_activities')
        .delete().eq('id', activity.id).eq('user_id', user.id).is('ended_at', null);
      if (dbError) throw new Error(dbError.message);
      await refresh();
    } finally { setBusy(false); }
  }, [user?.id, refresh]);

  return { records, active, loading, busy, error, refresh, start, finish, cancel };
}

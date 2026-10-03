import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth';

export type BuddyReactionKind = 'kfu' | 'fire' | 'beatme' | 'yourturn' | 'beast4';

export interface BuddyStat {
  user_id: string;
  display_name: string;
  email: string;
  weekly_sessions: number;
  weekly_visits: number;
  weekly_visit_seconds: number;
  monthly_visits: number;
  monthly_visit_seconds: number;
  all_visits: number;
  all_visit_seconds: number;
  first_arrived_at: string | null;
  last_arrived_at: string | null;
  last_left_at: string | null;
  last_visit_seconds: number;
  in_gym: boolean;
  active_arrived_at: string | null;
  streak_4of4: number;
}

export interface BuddyReaction {
  id: string;
  sender_name: string;
  kind: BuddyReactionKind;
  created_at: string;
}

export const BUDDY_REACTION_LABEL: Record<BuddyReactionKind, string> = {
  kfu: '👏 كفو',
  fire: '🔥 شد حيلك',
  beatme: '😅 سبقتني',
  yourturn: '👉 اليوم عليك',
  beast4: '🔥 4/4 يا وحش',
};


export interface BuddyAttendanceDay {
  user_id: string;
  display_name: string;
  email: string;
  visit_date: string;
  visit_count: number;
  visit_seconds: number;
}

export async function fetchBuddyAttendance(from: string, to: string): Promise<BuddyAttendanceDay[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.rpc('get_buddy_attendance', { p_from: from, p_to: to });
  if (error) throw error;
  return ((data ?? []) as BuddyAttendanceDay[]).map((x) => ({
    ...x,
    visit_count: Number(x.visit_count ?? 0),
    visit_seconds: Number(x.visit_seconds ?? 0),
  }));
}

export function useBuddy() {
  const { user } = useAuth();
  const [stats, setStats] = useState<BuddyStat[]>([]);
  const [reactions, setReactions] = useState<BuddyReaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState<BuddyReactionKind | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase || !user) {
      setLoading(false);
      return;
    }
    try {
      const [s, r] = await Promise.all([
        supabase.rpc('get_buddy_stats'),
        supabase.rpc('get_buddy_reactions'),
      ]);
      if (s.error) throw s.error;
      if (r.error) throw r.error;
      setStats(((s.data ?? []) as BuddyStat[]).map((x) => ({
        ...x,
        weekly_sessions: Number(x.weekly_sessions ?? 0),
        weekly_visits: Number(x.weekly_visits ?? 0),
        weekly_visit_seconds: Number(x.weekly_visit_seconds ?? 0),
        monthly_visits: Number(x.monthly_visits ?? 0),
        monthly_visit_seconds: Number(x.monthly_visit_seconds ?? 0),
        all_visits: Number(x.all_visits ?? 0),
        all_visit_seconds: Number(x.all_visit_seconds ?? 0),
        first_arrived_at: x.first_arrived_at ?? null,
        last_visit_seconds: Number(x.last_visit_seconds ?? 0),
        streak_4of4: Number(x.streak_4of4 ?? 0),
        in_gym: Boolean(x.in_gym),
      })));
      setReactions((r.data ?? []) as BuddyReaction[]);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 30_000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const sendReaction = useCallback(async (kind: BuddyReactionKind): Promise<string> => {
    if (!supabase) throw new Error('الخدمة غير مهيأة');
    setSending(kind);
    try {
      const { data, error: sendError } = await supabase.rpc('send_buddy_reaction', { p_kind: kind });
      if (sendError) throw sendError;
      await refresh();
      return String(data ?? 'رفيقك');
    } finally {
      setSending(null);
    }
  }, [refresh]);

  const me = useMemo(
    () => stats.find((s) => s.email.toLowerCase() === user?.email.toLowerCase()) ?? null,
    [stats, user],
  );
  const buddy = useMemo(
    () => stats.find((s) => s.email.toLowerCase() !== user?.email.toLowerCase()) ?? null,
    [stats, user],
  );

  return { me, buddy, stats, reactions, latestReaction: reactions[0] ?? null, loading, error, sending, refresh, sendReaction };
}

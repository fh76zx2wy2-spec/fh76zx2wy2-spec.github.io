import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DAY_BY_ID, EXTRA_BY_ID, WEEKLY_GOAL } from '../data/program';
import { useDerived } from '../lib/derived';
import { addDaysISO, formatGreg, formatHijri, hijriOf, HIJRI_MONTHS, weekStartOf, weekdayName } from '../lib/dates';
import { DIFFICULTY_LABEL, durationLabel, minutesLabel, timeLabel } from '../lib/format';
import type { GymVisit, Session } from '../lib/types';
import { PageHeader, Sheet, useToast } from '../components/ui';
import { Icon } from '../components/Icon';
import { fetchBuddyAttendance, useBuddy, type BuddyAttendanceDay, type BuddyStat } from '../lib/buddy';
import { deleteGymVisit, updateGymVisit } from '../lib/store';
import { syncNow } from '../lib/sync';

type Filter = 'all' | 'base' | 'extra';
type Period = 'week' | 'month' | 'all';

export function sessionLabel(s: Session): string {
  if (s.session_type === 'extra') return EXTRA_BY_ID[s.extra_kind ?? '']?.title ?? 'جلسة إضافية';
  return s.workout_day ? `اليوم ${s.workout_day} — ${DAY_BY_ID[s.workout_day].title}` : 'جلسة';
}

function localInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function statForPeriod(s: BuddyStat, p: Period): { visits: number; seconds: number } {
  if (p === 'week') return { visits: s.weekly_visits ?? 0, seconds: s.weekly_visit_seconds ?? 0 };
  if (p === 'month') return { visits: s.monthly_visits ?? 0, seconds: s.monthly_visit_seconds ?? 0 };
  return { visits: s.all_visits ?? 0, seconds: s.all_visit_seconds ?? 0 };
}

function periodLabel(p: Period) {
  return p === 'week' ? 'هذا الأسبوع' : p === 'month' ? 'هذا الشهر' : 'منذ البداية';
}

function VisitEditor({ visit, onClose }: { visit: GymVisit | null; onClose: () => void }) {
  const { toast } = useToast();
  const [arrived, setArrived] = useState('');
  const [left, setLeft] = useState('');
  useEffect(() => {
    setArrived(localInput(visit?.arrived_at ?? null));
    setLeft(localInput(visit?.left_at ?? null));
  }, [visit]);
  if (!visit) return null;
  const save = () => {
    if (!arrived) return toast('حدد وقت الوصول');
    const a = new Date(arrived);
    const l = left ? new Date(left) : null;
    if (!Number.isFinite(a.getTime()) || (l && (!Number.isFinite(l.getTime()) || l < a))) return toast('تحقق من وقت الوصول والمغادرة');
    const updated = updateGymVisit(visit.id, { arrived_at: a.toISOString(), left_at: l ? l.toISOString() : null });
    if (!updated) return toast('تعذر تعديل الزيارة');
    void syncNow();
    toast('تم تعديل الزيارة وحفظها');
    onClose();
  };
  return (
    <div className="stack">
      <label className="label">وقت الوصول<input className="input" type="datetime-local" value={arrived} onChange={(e) => setArrived(e.target.value)} /></label>
      <label className="label">وقت المغادرة <span className="muted">(اتركه فارغًا إذا كنت داخل النادي)</span><input className="input" type="datetime-local" value={left} onChange={(e) => setLeft(e.target.value)} /></label>
      <button className="btn btn-primary btn-block" onClick={save}>حفظ التعديل</button>
    </div>
  );
}

export default function History() {
  const d = useDerived();
  const nav = useNavigate();
  const buddy = useBuddy();
  const { toast } = useToast();
  const [filter, setFilter] = useState<Filter>('all');
  const [period, setPeriod] = useState<Period>('week');
  const [attendance, setAttendance] = useState<BuddyAttendanceDay[]>([]);
  const [attendanceError, setAttendanceError] = useState(false);
  const [editVisit, setEditVisit] = useState<GymVisit | null>(null);

  const historyFrom = addDaysISO(weekStartOf(d.today, 0), -7 * 11);
  useEffect(() => {
    let alive = true;
    fetchBuddyAttendance(historyFrom, d.today)
      .then((rows) => { if (alive) { setAttendance(rows); setAttendanceError(false); } })
      .catch(() => { if (alive) setAttendanceError(true); });
    return () => { alive = false; };
  }, [historyFrom, d.today]);

  const list = useMemo(
    () => d.sessions.filter((s) => (filter === 'all' ? true : filter === 'extra' ? s.session_type === 'extra' : s.session_type !== 'extra')),
    [d.sessions, filter],
  );
  const groups = useMemo(() => {
    const g: { key: string; title: string; items: Session[] }[] = [];
    for (const s of list) {
      const h = hijriOf(s.date);
      const key = `${h.y}-${h.m}`;
      let cur = g[g.length - 1];
      if (!cur || cur.key !== key) {
        cur = { key, title: `${HIJRI_MONTHS[h.m - 1]} ${h.y} هـ`, items: [] };
        g.push(cur);
      }
      cur.items.push(s);
    }
    return g;
  }, [list]);

  const weeks = useMemo(() => Array.from({ length: 12 }, (_, i) => addDaysISO(weekStartOf(d.today, 0), -i * 7)), [d.today]);
  const weekRows = (start: string, email: string) => attendance.filter((r) => r.email.toLowerCase() === email.toLowerCase() && r.visit_date >= start && r.visit_date <= addDaysISO(start, 6));
  const ownVisits = [...(d.db?.visits ?? [])].sort((a, b) => b.arrived_at.localeCompare(a.arrived_at));

  const removeVisit = (v: GymVisit) => {
    if (!window.confirm('حذف هذه الزيارة؟ سيُحذف تسجيل الوصول والمغادرة فقط، ولا تُحذف جلسة التمرين.')) return;
    deleteGymVisit(v.id);
    void syncNow();
    toast('تم حذف الزيارة');
  };

  return (
    <div className="page stack">
      <PageHeader title="السجل" onBack={() => nav('/')} sub="الحضور والجلسات السابقة" />

      <section className="card history-compare-card">
        <div className="row-between">
          <div><div className="eyebrow">أنا ورفيق التمرين</div><div className="card-title">كم رحنا للنادي؟</div></div>
          <Link to="/calendar" className="btn btn-sm btn-soft"><Icon name="calendar" size={16} /> التقويم</Link>
        </div>
        <div className="seg" role="group" aria-label="الفترة" style={{ marginTop: 12 }}>
          {(['week','month','all'] as Period[]).map((p) => <button key={p} className={period === p ? 'on' : ''} onClick={() => setPeriod(p)}>{periodLabel(p)}</button>)}
        </div>
        {buddy.loading ? <div className="muted" style={{ marginTop: 14 }}>جاري تحميل الحضور…</div> : buddy.me && buddy.buddy ? (
          <div className="buddy-period-grid">
            {[buddy.me, buddy.buddy].map((b) => {
              const st = statForPeriod(b, period);
              return <div className="buddy-period-person" key={b.user_id}><span>{b.user_id === buddy.me?.user_id ? 'أنت' : b.display_name}</span><b className="num">{st.visits}</b><small>زيارة · {durationLabel(st.seconds)}</small></div>;
            })}
          </div>
        ) : <div className="muted" style={{ marginTop: 14 }}>شغّل تحديث Supabase الجديد لإظهار المقارنة الممتدة.</div>}
      </section>

      <section className="card">
        <div className="row-between" style={{ marginBottom: 10 }}><div><div className="eyebrow">آخر 12 أسبوعًا</div><div className="card-title">سجل الأسابيع</div></div><span className="tag">الأحد ← السبت</span></div>
        {attendanceError ? <div className="note-box hot">السجل المشترك يحتاج تشغيل ملف SQL الجديد مرة واحدة.</div> : (
          <div className="week-history-list">
            {weeks.map((w, idx) => {
              const meEmail = buddy.me?.email ?? '';
              const mateEmail = buddy.buddy?.email ?? '';
              const meRows = meEmail ? weekRows(w, meEmail) : [];
              const mateRows = mateEmail ? weekRows(w, mateEmail) : [];
              const meVisits = meRows.reduce((n, r) => n + r.visit_count, 0);
              const mateVisits = mateRows.reduce((n, r) => n + r.visit_count, 0);
              const meDays = meRows.length;
              const mateDays = mateRows.length;
              return (
                <div className={`week-history-row ${idx === 0 ? 'current' : ''}`} key={w}>
                  <div className="week-history-date"><b>{idx === 0 ? 'هذا الأسبوع' : `${formatGreg(w, { year: false })} – ${formatGreg(addDaysISO(w, 6), { year: false })}`}</b><small>{meDays >= WEEKLY_GOAL || mateDays >= WEEKLY_GOAL ? '🏆' : ''}</small></div>
                  <div className="week-history-score"><span>أنت</span><b className="num">{meVisits}</b><small>{Math.min(4, meDays)}/4 أيام</small></div>
                  <div className="week-history-score"><span>{buddy.buddy?.display_name ?? 'عبدالسلام'}</span><b className="num">{mateVisits}</b><small>{Math.min(4, mateDays)}/4 أيام</small></div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="card pad-0">
        <div className="history-section-head"><div><div className="eyebrow">حضورك</div><div className="card-title">زيارات النادي</div></div><span className="tag">{ownVisits.length} زيارة</span></div>
        {ownVisits.length === 0 ? <div className="muted" style={{ padding: '18px' }}>لا توجد زيارات مسجلة بعد.</div> : ownVisits.slice(0, 30).map((v) => (
          <div className="list-row" key={v.id}>
            <span className="ic cold"><Icon name="clock" /></span>
            <div className="grow"><div className="t">{weekdayName(v.date)} · {formatGreg(v.date, { year: false })}</div><div className="s">وصلت {timeLabel(v.arrived_at)} {v.left_at ? `· غادرت ${timeLabel(v.left_at)}` : '· داخل النادي الآن'}</div><div className="s">{v.left_at ? durationLabel(v.duration_seconds) : 'زيارة مفتوحة'}</div></div>
            <button className="icon-btn" aria-label="تعديل" onClick={() => setEditVisit(v)}><Icon name="edit" size={17} /></button>
            <button className="icon-btn" aria-label="حذف" onClick={() => removeVisit(v)}><Icon name="trash" size={17} /></button>
          </div>
        ))}
      </section>

      <section className="stack">
        <div className="row-between"><div><div className="eyebrow">التمارين</div><div className="card-title">الجلسات المحفوظة</div></div><span className="tag">{d.sessions.length}</span></div>
        <div className="seg" role="group" aria-label="تصفية">
          {([['all','الكل'],['base','الأساسية'],['extra','الإضافية']] as [Filter,string][]).map(([id,label]) => <button key={id} className={filter === id ? 'on' : ''} onClick={() => setFilter(id)}>{label}</button>)}
        </div>
        {list.length === 0 ? <div className="card center muted">لا جلسات محفوظة ضمن هذا التصنيف.</div> : groups.map((g) => (
          <section key={g.key}>
            <div className="eyebrow" style={{ margin: '4px 4px 8px' }}>{g.title}</div>
            <div className="card pad-0">{g.items.map((s) => (
              <Link key={s.id} to={`/history/${s.id}`} className="list-row">
                <span className={`ic ${s.session_type === 'extra' ? '' : 'cold'}`}><Icon name={s.session_type === 'extra' ? 'leaf' : 'check'} /></span>
                <div className="grow"><div className="t">{sessionLabel(s)}</div><div className="s">{weekdayName(s.date)} {formatHijri(s.date, { year: false })} · {formatGreg(s.date, { year: false })} م</div><div className="s">{minutesLabel(s.duration_seconds)}{s.session_type === 'short' && ` · مختصرة ${s.short_minutes} د`}{s.difficulty && ` · ${DIFFICULTY_LABEL[s.difficulty]}`}{s.early_finish && ' · إنهاء مبكر'}</div></div>
                <Icon name="chevL" className="chev" />
              </Link>
            ))}</div>
          </section>
        ))}
      </section>

      <Sheet open={!!editVisit} onClose={() => setEditVisit(null)} title="تعديل الزيارة">
        <VisitEditor visit={editVisit} onClose={() => setEditVisit(null)} />
      </Sheet>
    </div>
  );
}

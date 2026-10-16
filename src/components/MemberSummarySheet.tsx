import { useEffect, useState } from 'react';
import { Sheet } from './ui';
import { Icon } from './Icon';
import { fetchMemberVisits, type BuddyStat, type MemberVisit } from '../lib/buddy';
import { durationLabel, timeLabel } from '../lib/format';
import { formatGreg, formatHijri } from '../lib/dates';

export function MemberSummarySheet({ member, open, onClose, isMe = false }: { member: BuddyStat | null; open: boolean; onClose: () => void; isMe?: boolean }) {
  const [visits, setVisits] = useState<MemberVisit[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let alive = true;
    if (!open || !member || member.user_id.startsWith('pending:')) { setVisits([]); return; }
    setLoading(true);
    void fetchMemberVisits(member.user_id, 10).then((rows) => { if (alive) setVisits(rows); }).catch(() => { if (alive) setVisits([]); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [open, member?.user_id]);
  if (!member) return null;
  const pending = member.user_id.startsWith('pending:');
  return (
    <Sheet open={open} onClose={onClose} title={`${isMe ? 'ملخصك' : 'ملخص'} · ${member.display_name}`}>
      <div className="member-summary-hero">
        <div><div className="eyebrow">هذا الأسبوع</div><div className="member-summary-score num">{member.weekly_sessions}/4</div></div>
        <div className={`member-summary-state ${member.in_gym ? 'live' : ''}`}><span />{member.in_gym ? 'في النادي الآن' : pending ? 'لم يسجل الدخول بعد' : 'خارج النادي'}</div>
      </div>
      <div className="member-summary-grid">
        <div><b className="num">{member.weekly_visits}</b><span>زيارات الأسبوع</span></div>
        <div><b>{durationLabel(member.weekly_visit_seconds)}</b><span>وقت الأسبوع</span></div>
        <div><b className="num">{member.monthly_visits}</b><span>زيارات الشهر</span></div>
        <div><b>{durationLabel(member.monthly_visit_seconds)}</b><span>وقت الشهر</span></div>
        <div><b className="num">{member.all_visits}</b><span>منذ البداية</span></div>
        <div><b className="num">{member.streak_4of4}</b><span>سلسلة 4/4</span></div>
      </div>
      {member.in_gym && member.active_arrived_at && <div className="note-box cold">وصل اليوم الساعة <b>{timeLabel(member.active_arrived_at)}</b> 🔥</div>}
      <div className="card-title" style={{ marginTop: 16, marginBottom: 8 }}>آخر الزيارات</div>
      {pending ? <div className="muted center">سيظهر سجله بعد أول تسجيل دخول وزيارة.</div> : loading ? <div className="muted">جاري تحميل الزيارات…</div> : visits.length === 0 ? <div className="muted center">لا توجد زيارات مسجلة بعد.</div> : (
        <div className="member-visit-list">
          {visits.map((v) => <div className="member-visit-row" key={v.id}>
            <span className="ic-round"><Icon name="calendar" size={17} /></span>
            <div className="grow"><b>{formatHijri(v.date, { year: false })}</b><small>{formatGreg(v.date)} · {timeLabel(v.arrived_at)}{v.left_at ? ` ← ${timeLabel(v.left_at)}` : ' · مستمرة'}</small></div>
            <b>{durationLabel(v.duration_seconds)}</b>
          </div>)}
        </div>
      )}
      <p className="muted center" style={{ fontSize: 12.5, marginTop: 12 }}>الملخص يعرض الحضور فقط. الوزن والقياسات تبقى خاصة بكل حساب.</p>
    </Sheet>
  );
}

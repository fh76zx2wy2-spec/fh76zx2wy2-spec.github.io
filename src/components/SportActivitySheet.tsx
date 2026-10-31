import { useEffect, useState } from 'react';
import { Sheet, useToast } from './ui';
import { SPORT_OPTIONS, sportLabel, type SportKey, type SportActivity, type useSportActivities } from '../lib/sportActivities';

interface Props {
  open: boolean;
  onClose: () => void;
  sports: ReturnType<typeof useSportActivities>;
  gymActive: boolean;
  afterFinish: () => void;
}

const major = SPORT_OPTIONS.slice(0, 4);
const other = SPORT_OPTIONS.slice(4);

export function SportActivitySheet({ open, onClose, sports, gymActive, afterFinish }: Props) {
  const { toast } = useToast();
  const [kind, setKind] = useState<SportKey>('walking');
  const [label, setLabel] = useState('');
  const [target, setTarget] = useState('');
  const [actual, setActual] = useState('');
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!open || !sports.active) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [open, sports.active]);
  useEffect(() => { if (sports.active) setActual(''); }, [sports.active?.id]);
  const selected = SPORT_OPTIONS.find((o) => o.key === kind)!;
  const elapsed = sports.active ? Math.max(0, Math.floor((now - Date.parse(sports.active.started_at)) / 1000)) : 0;
  const clock = `${Math.floor(elapsed / 3600).toString().padStart(2, '0')}:${Math.floor(elapsed / 60 % 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`;
  const run = async (fn: () => Promise<void>, message: string) => {
    try { await fn(); toast(message); afterFinish(); onClose(); }
    catch (e) { toast(e instanceof Error ? e.message : 'تعذر حفظ النشاط'); }
  };

  return (
    <Sheet open={open} onClose={onClose} title={sports.active ? 'نشاطك الرياضي الجاري' : 'اختر رياضتك'}>
      <div className="stack sport-sheet">
        {sports.error && <p className="note-box hot">{sports.error}</p>}
        {sports.active ? (
          <>
            <div className="sport-active-head"><span>💪 {sportLabel(sports.active)}</span><b className="num">{clock}</b><small>يمكنك إغلاق الموقع؛ الوقت محفوظ منذ بدء النشاط.</small></div>
            <label className="label">كم قطعت من كيلومترات؟ (اختياري)
              <input className="input" type="number" inputMode="decimal" min="0" max="500" step="0.01" placeholder="مثلاً 5 كم" value={actual} onChange={(e) => setActual(e.target.value)} />
            </label>
            <button className="btn btn-primary btn-block" disabled={sports.busy} onClick={() => void run(() => sports.finish(sports.active!, actual), 'أحسنت! انتهى النشاط وسُجّل في إنجازك الأسبوعي.')}>✅ أنهيت الرياضة</button>
            <button className="btn btn-ghost btn-block" disabled={sports.busy} onClick={() => {
              if (window.confirm('إلغاء النشاط الجاري دون احتسابه؟')) void run(() => sports.cancel(sports.active!), 'تم إلغاء النشاط دون احتسابه.');
            }}>إلغاء النشاط بالخطأ</button>
          </>
        ) : (
          <>
            <p className="muted">الرياضة خارج النادي تحتسب يومًا واحدًا من هدف 4/4 بعد إكمالها، مهما كانت مدتها.</p>
            <div className="sport-choice-grid">
              {major.map((s) => <button type="button" key={s.key} className={`sport-choice ${kind === s.key ? 'selected' : ''}`} onClick={() => setKind(s.key)}><span>{s.emoji}</span><b>{s.title}</b></button>)}
            </div>
            <label className="label">رياضات أخرى (اختياري)
              <select className="input" value={major.some((o) => o.key === kind) ? '' : kind} onChange={(e) => { if (e.target.value) setKind(e.target.value as SportKey); }}>
                <option value="">اختر من القائمة</option>
                {other.map((s) => <option value={s.key} key={s.key}>{s.title}</option>)}
              </select>
            </label>
            {kind === 'other' && <label className="label">اسم الرياضة
              <input className="input" maxLength={45} placeholder="مثلاً الملاكمة" value={label} onChange={(e) => setLabel(e.target.value)} />
            </label>}
            {selected.distance && <label className="label">مسافة مستهدفة بالكيلومترات (اختياري)
              <input className="input" type="number" min="0" max="500" step="0.01" inputMode="decimal" placeholder="مثلاً 3 أو 5 كم" value={target} onChange={(e) => setTarget(e.target.value)} />
            </label>}
            {gymActive && <p className="note-box hot">أنت مسجل حاليًا داخل النادي. سجّل المغادرة أولًا قبل بدء رياضة أخرى.</p>}
            <button className="btn btn-primary btn-block" disabled={sports.busy || gymActive || !!sports.error} onClick={() => void run(() => sports.start(kind, label, target), `بدأت ${selected.title}، الله يقويك!`)}>▶️ بدأت الرياضة</button>
          </>
        )}
      </div>
    </Sheet>
  );
}

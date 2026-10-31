import { useEffect, useState } from 'react';
import { Sheet, useToast } from './ui';
import { SPORT_OPTIONS, sportLabel, type SportKey, type useSportActivities } from '../lib/sportActivities';

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
  const [actual, setActual] = useState('');
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!open || !sports.active) return;
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [open, sports.active?.id]);

  useEffect(() => {
    setActual('');
    setConfirmFinish(false);
  }, [sports.active?.id]);

  const selected = SPORT_OPTIONS.find((o) => o.key === kind)!;
  const activeSport = sports.active ? SPORT_OPTIONS.find((o) => o.key === sports.active?.sport_key) : undefined;
  const elapsed = sports.active ? Math.max(0, Math.floor((now - Date.parse(sports.active.started_at)) / 1000)) : 0;
  const clock = `${Math.floor(elapsed / 3600).toString().padStart(2, '0')}:${Math.floor(elapsed / 60 % 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`;

  const run = async (fn: () => Promise<void>, message: string, completed = false) => {
    try {
      await fn();
      toast(message);
      if (completed) afterFinish();
      onClose();
    } catch (e) {
      toast(e instanceof Error ? e.message : 'تعذر حفظ النشاط');
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title={sports.active ? 'نشاطك الرياضي الجاري' : 'اختر رياضتك'}>
      <div className="stack sport-sheet">
        {sports.error && (
          <div className="note-box hot sport-setup-error" role="alert">
            <p>{sports.error}</p>
            <button type="button" className="btn btn-ghost" disabled={sports.loading || sports.busy}
              onClick={() => void sports.refresh()}>🔄 إعادة التحقق من اتصال الرياضات</button>
          </div>
        )}
        {sports.active ? (
          <>
            <div className="sport-active-head">
              <span>💪 {sportLabel(sports.active)}</span>
              <b className="num" dir="ltr">{clock}</b>
              <small>يمكنك إغلاق الموقع؛ وقت البداية محفوظ حتى ترجع.</small>
            </div>
            {!confirmFinish ? (
              <>
                <p className="muted">عند الانتهاء نعرض مدة الرياضة، وتقدر تدخل المسافة الفعلية إن رغبت.</p>
                <button type="button" className="btn btn-primary btn-block" disabled={sports.busy}
                  onClick={() => { setNow(Date.now()); setConfirmFinish(true); }}>✅ أنهيت الرياضة</button>
                <button type="button" className="btn btn-ghost btn-block" disabled={sports.busy} onClick={() => {
                  if (window.confirm('إلغاء النشاط الجاري دون احتسابه؟')) void run(() => sports.cancel(sports.active!), 'تم إلغاء النشاط دون احتسابه.');
                }}>إلغاء النشاط بالخطأ</button>
              </>
            ) : (
              <div className="sport-finish-confirm">
                <h3>👏 كفو! خلّنا نسجّل إنجازك</h3>
                <p>الرياضة: <strong>{sportLabel(sports.active)}</strong></p>
                <p>المدة حتى الآن: <strong dir="ltr" className="num">{clock}</strong></p>
                {activeSport?.distance && (
                  <label className="label">كم كيلومتر قطعت فعلًا؟ <span className="muted">(اختياري)</span>
                    <input className="input" type="number" inputMode="decimal" min="0" max="500" step="0.01"
                      placeholder="مثلاً 5 أو 10 كم" value={actual} onChange={(e) => setActual(e.target.value)} />
                    <small className="muted">تُذكر المسافة في إشعار الإنجاز لأعضاء فريقك المسموح لهم بمتابعتك.</small>
                  </label>
                )}
                <button type="button" className="btn btn-primary btn-block" disabled={sports.busy}
                  onClick={() => void run(() => sports.finish(sports.active!, activeSport?.distance ? actual : ''), 'أحسنت! سُجّل النشاط في إنجازك الأسبوعي.', true)}>
                  {sports.busy ? 'جارٍ حفظ الإنجاز…' : '✅ تأكيد إنهاء الرياضة وإرسال الإنجاز'}
                </button>
                <button type="button" className="btn btn-ghost btn-block" disabled={sports.busy}
                  onClick={() => setConfirmFinish(false)}>رجوع إلى المؤقت</button>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="muted">الرياضة خارج النادي تحتسب يومًا واحدًا من هدف 4/4 بعد إكمالها، مهما كانت مدتها.</p>
            <div className="sport-choice-grid">
              {major.map((s) => <button type="button" key={s.key} className={`sport-choice ${kind === s.key ? 'selected' : ''}`}
                onClick={() => setKind(s.key)}><span>{s.emoji}</span><b>{s.title}</b></button>)}
            </div>
            <label className="label">رياضات أخرى (اختياري)
              <select className="input" value={major.some((o) => o.key === kind) ? '' : kind}
                onChange={(e) => { if (e.target.value) setKind(e.target.value as SportKey); }}>
                <option value="">اختر من القائمة</option>
                {other.map((s) => <option value={s.key} key={s.key}>{s.title}</option>)}
              </select>
            </label>
            {kind === 'other' && <label className="label">اسم الرياضة
              <input className="input" maxLength={45} placeholder="مثلاً الملاكمة" value={label} onChange={(e) => setLabel(e.target.value)} />
            </label>}
            {gymActive && <p className="note-box hot">أنت مسجل حاليًا داخل النادي. سجّل المغادرة أولًا قبل بدء رياضة أخرى.</p>}
            <p className="sport-distance-after-note">📏 المسافة ليست مطلوبة الآن؛ تُسجّل بعد الضغط على «أنهيت الرياضة».</p>
            <button type="button" className="btn btn-primary btn-block" disabled={sports.busy || gymActive}
              onClick={() => void run(() => sports.start(kind, label), `بدأت ${selected.title}، الله يقويك!`)}>
              {sports.busy ? 'جارٍ بدء النشاط…' : '▶️ بدأت الرياضة'}
            </button>
          </>
        )}
      </div>
    </Sheet>
  );
}

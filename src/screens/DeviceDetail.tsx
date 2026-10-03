import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ALTERNATIVES, MACHINES, type MachineId } from '../data/machines';
import { DAY_BY_ID, cardioStationsForDay, machineUsage } from '../data/program';
import { PageHeader, Sheet } from '../components/ui';
import { Icon } from '../components/Icon';
import { Illustration } from '../components/Illustration';
import { setsRepsLabel } from '../lib/plan';

export default function DeviceDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const m = MACHINES[id as MachineId];
  const [guideOpen, setGuideOpen] = useState(false);
  if (!m) return <Navigate to="/devices" replace />;
  const usage = machineUsage(m.id);
  const alts = ALTERNATIVES[m.id] ?? [];
  return (
    <div className="page stack">
      <PageHeader title={m.ar} sub={m.en} onBack={() => (window.history.length > 1 ? nav(-1) : nav('/devices'))} />
      <div className="card pad-0">
        <Illustration id={m.illustration} className="mill" label={m.ar} />
        <div className="mcard-body">
          <div className="eyebrow">العضلات المستهدفة</div>
          <p style={{ fontWeight: 500 }}>{m.muscles}</p>
        </div>
      </div>

      <section className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>طريقة الاستخدام</div>
        <ol className="steps">
          {m.steps.map((s, i) => (
            <li key={i}><span className="n num">{i + 1}</span><span>{s}</span></li>
          ))}
        </ol>
        {m.warn && (
          <div className="note-box hot" style={{ marginTop: 12 }}>
            <b>تنبيه:</b> {m.warn}
          </div>
        )}
        {m.guideYoutubeId && (
          <button type="button" className="btn btn-ghost btn-block exercise-guide-btn" onClick={() => setGuideOpen(true)} style={{ marginTop: 12 }}>
            <Icon name="play" /> شاهد شرح التمرين داخل 45/4
          </button>
        )}
      </section>

      <section className="card">
        <div className="card-title" style={{ marginBottom: 10 }}>أين يظهر في برنامجك؟</div>
        {usage.length === 0 ? (
          <p className="muted">ليس مرتبطًا بيوم محدد؛ يُستخدم كجلسة إضافية.</p>
        ) : (
          <div className="stack" style={{ gap: 0 }}>
            {usage.map((dayId) => {
              const day = DAY_BY_ID[dayId];
              const ex = day.exercises.find((e) => e.machineId === m.id);
              return (
                <div key={dayId} className="swap-row">
                  <b>اليوم {dayId} — {day.focus}</b>
                  <span className="muted">
                    {cardioStationsForDay(dayId).includes(m.id) ? `كارديو · ${day.cardio.note}` : ex ? `${setsRepsLabel(ex)} · راحة ${ex.rest} ث` : ''}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {alts.length > 0 && (
        <section className="card">
          <div className="card-title" style={{ marginBottom: 10 }}>إن لم تستطع استخدامه</div>
          {alts.map((a) => (
            <Link key={a.id} to={`/devices/${a.id}`} className="list-row" style={{ padding: '10px 0' }}>
              <Illustration id={MACHINES[a.id].illustration} className="sm pick-ill" />
              <div className="grow"><div className="t">{MACHINES[a.id].ar}</div><div className="s">{a.note}</div></div>
            </Link>
          ))}
        </section>
      )}

      {m.guideYoutubeId && (
        <Sheet open={guideOpen} onClose={() => setGuideOpen(false)} title={m.guideTitle ?? `طريقة أداء ${m.ar}`}>
          <div className="exercise-guide-frame">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${m.guideYoutubeId}?playsinline=1&rel=0${m.guideYoutubeStartSeconds ? `&start=${m.guideYoutubeStartSeconds}` : ''}`}
              title={m.guideTitle ?? `طريقة أداء ${m.ar}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 10 }}>روابط الشرح المختارة للتمارين الموجودة في جدولك يقدمها مدرب رجل، وتفتح داخل 45/4.</p>
        </Sheet>
      )}
    </div>
  );
}

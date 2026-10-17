import { useEffect, useState } from 'react';
import type { Machine } from '../data/machines';
import { Illustration } from './Illustration';
import { Icon } from './Icon';
import { Sheet } from './ui';

/** The two destinations must refer to the same specific clip when available.
 * YouTube search results cannot be embedded as a working video, so do not fake one.
 */
const searchUrl = (m: Machine) => `https://www.youtube.com/results?search_query=${encodeURIComponent(m.guideYoutubeQuery ?? `${m.en} exercise technique tutorial`)}`;

export function ExerciseVideoGuide({ machine, onClose }: { machine: Machine | null; onClose: () => void }) {
  const [playHere, setPlayHere] = useState(false);
  useEffect(() => { setPlayHere(false); }, [machine?.id]);

  const videoId = machine?.guideYoutubeId;
  const external = machine ? (videoId ? `https://www.youtube.com/watch?v=${videoId}${machine.guideYoutubeStartSeconds ? `&t=${machine.guideYoutubeStartSeconds}s` : ''}` : searchUrl(machine)) : '#';

  return (
    <Sheet open={Boolean(machine)} onClose={onClose} title={machine ? `شرح ${machine.ar}` : 'شرح التمرين'}>
      {machine && (
        <div className="stack" style={{ gap: 14 }}>
          <div className="row" style={{ gap: 12, alignItems: 'center' }}>
            <Illustration id={machine.illustration} className="sm pick-ill" label={machine.ar} />
            <div className="grow">
              <b>{machine.en}</b>
              <div className="muted" style={{ fontSize: 13 }}>{machine.muscles}</div>
            </div>
          </div>

          {/* Show both viewing choices instead of forcing a YouTube search. */}
          <div className="stack" style={{ gap: 9 }}>
            <button
              className="btn btn-primary btn-block"
              type="button"
              onClick={() => setPlayHere((x) => !x)}
              aria-expanded={playHere}
            >
              <Icon name="play" /> {videoId ? (playHere ? 'إخفاء الفيديو داخل الموقع' : '▶ مشاهدة الفيديو داخل الموقع') : (playHere ? 'إخفاء الرسم التوضيحي' : 'عرض الشرح المصور داخل الموقع')}
            </button>
            <a className="btn btn-soft btn-block" href={external} target="_blank" rel="noopener noreferrer">
              <Icon name="play" /> {videoId ? '▶ مشاهدة نفس الفيديو على يوتيوب' : 'يوتيوب — مقاطع خاصة بهذا التمرين'}
            </a>
          </div>

          {videoId ? (
            playHere && (
              <div className="exercise-guide-frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0${machine.guideYoutubeStartSeconds ? `&start=${machine.guideYoutubeStartSeconds}` : ''}`}
                  title={`شرح فيديو ${machine.ar}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )
          ) : (
            <>
              {playHere && (
                <div className="card center" style={{ padding: '14px 10px' }}>
                  <Illustration id={machine.illustration} className="mill" label={`الرسم التوضيحي: ${machine.ar}`} />
                  <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>رسم توضيحي لوضعية التمرين — اقرأ الخطوات بالأسفل</div>
                </div>
              )}
              <div className="note-box cold" style={{ lineHeight: 1.8 }}>
                <b>هذا البديل له شرح مصور لكن ليس له فيديو داخلي مباشر بعد.</b>
                <div className="muted">
                  حتى لا يظهر فيديو تمرين آخر بالخطأ، زر يوتيوب يفتح النتائج باسم هذا البديل تحديدًا.
                </div>
              </div>
            </>
          )}

          <div className="card-title" style={{ marginTop: 2 }}>طريقة الأداء</div>
          <ol className="steps">
            {machine.steps.map((step, i) => (
              <li key={`${machine.id}-${i}`}><span className="n num">{i + 1}</span><span>{step}</span></li>
            ))}
          </ol>
          {machine.warn && <div className="note-box hot"><b>مهم:</b> {machine.warn}</div>}
        </div>
      )}
    </Sheet>
  );
}

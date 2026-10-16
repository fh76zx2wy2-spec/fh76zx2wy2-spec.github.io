import type { Machine } from '../data/machines';
import { Illustration } from './Illustration';
import { Icon } from './Icon';
import { Sheet } from './ui';

const searchUrl = (m: Machine) => `https://www.youtube.com/results?search_query=${encodeURIComponent(m.guideYoutubeQuery ?? `${m.en} tutorial male trainer proper form`)}`;

/** لا نستخدم YouTube listType=search القديمة (غير مدعومة) ولا نكرر فيديو جهاز آخر. */
export function ExerciseVideoGuide({ machine, onClose }: { machine: Machine | null; onClose: () => void }) {
  return (
    <Sheet open={Boolean(machine)} onClose={onClose} title={machine ? `شرح ${machine.ar}` : 'شرح التمرين'}>
      {machine && <div className="stack" style={{ gap: 14 }}>
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <Illustration id={machine.illustration} className="sm pick-ill" label={machine.ar} />
          <div className="grow">
            <b>{machine.en}</b>
            <div className="muted" style={{ fontSize: 13 }}>{machine.muscles}</div>
          </div>
        </div>
        {machine.guideYoutubeId ? (
          <div className="exercise-guide-frame">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${machine.guideYoutubeId}?playsinline=1&rel=0${machine.guideYoutubeStartSeconds ? `&start=${machine.guideYoutubeStartSeconds}` : ''}`}
              title={`مقطع تعليمي عن ${machine.ar}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <div className="note-box cold" style={{ lineHeight: 1.8 }}>
            <b>شرح دقيق لهذا البديل</b>
            <div className="muted">ما بنعرض لك مقطع الجهاز الأصلي على أنه شرح لهذا البديل. تقدر تقرأ الخطوات هنا، أو تفتح نتائج يوتيوب الخاصة باسمه الصحيح.</div>
          </div>
        )}
        <div className="card-title" style={{ marginTop: 2 }}>طريقة الأداء</div>
        <ol className="steps">
          {machine.steps.map((step, i) => (
            <li key={`${machine.id}-${i}`}><span className="n num">{i + 1}</span><span>{step}</span></li>
          ))}
        </ol>
        {machine.warn && <div className="note-box hot"><b>مهم:</b> {machine.warn}</div>}
        <a href={machine.guideYoutubeId ? `https://www.youtube.com/watch?v=${machine.guideYoutubeId}` : searchUrl(machine)}
           target="_blank" rel="noopener noreferrer" className="btn btn-soft btn-block">
          <Icon name="play" /> {machine.guideYoutubeId ? 'فتح نفس المقطع على يوتيوب' : 'ابحث في يوتيوب عن هذا البديل بالاسم'}
        </a>
      </div>}
    </Sheet>
  );
}

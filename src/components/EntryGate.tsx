import { useEffect, useMemo, useState } from 'react';
import { ACTIVE_PROGRAM } from '../data/program';
import { todayISO } from '../lib/dates';
import { motivationForDate } from '../lib/profile';
import { useAuth } from '../lib/auth';
import { useMyTeamProfile } from '../lib/teamProfile';
import { RELEASE_INFO, hasSeenRelease, markReleaseSeen } from '../lib/releaseNotes';
import { Logo } from './ui';

export function EntryGate({ onEnter }: { onEnter: () => void }) {
  const { user } = useAuth();
  const profile = useMyTeamProfile();
  const photo = profile.avatar_url;
  const quote = useMemo(() => motivationForDate(todayISO()), []);
  const name = profile.display_name || ACTIVE_PROGRAM.defaultName;
  const [showNotes, setShowNotes] = useState(false);

  // مرة واحدة لكل حساب ولكل إصدار. لا تُربط حالة القراءة بحسابات الفريق الأخرى.
  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    setShowNotes(false);
    void hasSeenRelease(user.id, RELEASE_INFO.version).then((seen) => {
      if (active && !seen) setShowNotes(true);
    }).catch(() => {
      if (active) setShowNotes(true); // يتوفر حفظ محلي في حال انقطاع قاعدة البيانات.
    });
    return () => { active = false; };
  }, [user?.id]);

  useEffect(() => {
    if (!showNotes) return;
    // منع تمرير الخلفية أثناء ظهور ملخص التحديث.
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = old; };
  }, [showNotes]);

  const dismissNotes = () => {
    setShowNotes(false);
    if (user?.id) void markReleaseSeen(user.id, RELEASE_INFO.version).catch(() => {
      // سيبقى الحفظ المحلي مفعلًا حتى إن تعذّر الحفظ السحابي مؤقتًا.
    });
  };

  return (
    <main className={`entry-gate ${ACTIVE_PROGRAM.key}`}>
      <span className="entry-orb a" aria-hidden="true" />
      <span className="entry-orb b" aria-hidden="true" />
      <div className="entry-card">
        <Logo size={56} />
        <div className="entry-photo-wrap">
          {photo ? <img className="entry-photo" src={photo} alt={`صورة الكوتش ${name}`} /> : <div className="entry-photo entry-placeholder">{name.slice(0, 1)}</div>}
        </div>
        <div className="entry-coach">الكوتش <span>/</span> {name}</div>
        <blockquote>«{quote}»</blockquote>
        <button type="button" className="btn btn-primary btn-lg entry-button" onClick={onEnter}>دخول</button>
        <small>4 أيام · 45 دقيقة هدف تقريبي</small>
        {/* تظل العبارة ظاهرة دائمًا، بعكس نافذة تفاصيل الإصدار. */}
        <div className="entry-release" aria-label={`تم تحديث التطبيق، الإصدار ${RELEASE_INFO.version}`}>
          <span className="entry-release-dot" aria-hidden="true" /> <strong>تم تحديث التطبيق 🥰</strong> <span className="entry-release-version">v{RELEASE_INFO.version}</span>
        </div>
      </div>
      {showNotes && (
        <div className="release-modal-backdrop" role="presentation">
          <section className="release-modal" role="dialog" aria-modal="true" aria-labelledby="release-modal-title" dir="rtl">
            <div className="release-modal-icon" aria-hidden="true">🎉</div>
            <div className="release-modal-overline">تحديث 45/4 · الإصدار {RELEASE_INFO.version}</div>
            <h1 id="release-modal-title">وش الجديد في التطبيق؟</h1>
            <p className="release-modal-intro">جهزنا لك إضافات تساعدك تستمر في الرياضة وتتابع إنجازك بسهولة.</p>
            <ul className="release-modal-list">
              {RELEASE_INFO.features.map((feature) => (
                <li key={feature.title}>
                  <span className="release-feature-emoji" aria-hidden="true">{feature.emoji}</span>
                  <span><strong>{feature.title}</strong><small>{feature.description}</small></span>
                </li>
              ))}
            </ul>
            <button type="button" className="btn btn-primary release-modal-cta" onClick={dismissNotes} autoFocus>
              حلو، خلّنا نبدأ! 💪
            </button>
            <p className="release-modal-once">هذا الملخص يظهر مرة واحدة لكل عضو عند كل إصدار جديد.</p>
          </section>
        </div>
      )}
    </main>
  );
}

import { useMemo } from 'react';
import { ACTIVE_PROGRAM } from '../data/program';
import { todayISO } from '../lib/dates';
import { motivationForDate } from '../lib/profile';
import { useMyTeamProfile } from '../lib/teamProfile';
import { Logo } from './ui';

export function EntryGate({ onEnter }: { onEnter: () => void }) {
  const profile = useMyTeamProfile();
  const photo = profile.avatar_url;
  const quote = useMemo(() => motivationForDate(todayISO()), []);
  const name = profile.display_name || ACTIVE_PROGRAM.defaultName;
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
        <small>4 أيام · 45 دقيقة</small>
      </div>
    </main>
  );
}

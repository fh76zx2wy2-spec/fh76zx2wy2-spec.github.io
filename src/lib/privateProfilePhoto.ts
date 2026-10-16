import { useEffect, useState } from 'react';
import { ACTIVE_PROGRAM } from '../data/program';
import { supabase } from './supabase';
import { useAuth } from './auth';

const BUCKET = 'coach-profiles';
function profilePath() {
  return ACTIVE_PROGRAM.key === 'abdulsalam' ? 'abdulsalam/profile.png' : 'ziyad/profile.png';
}

export function usePrivateProfilePhoto(): string | null {
  const { user } = useAuth();
  const [url, setUrl] = useState<string | null>(() => ACTIVE_PROGRAM.key === 'dhaidan' ? '/coaches/dhaidan.jpg' : null);

  useEffect(() => {
    let alive = true;
    if (ACTIVE_PROGRAM.key === 'dhaidan') {
      setUrl('/coaches/dhaidan.jpg');
      return () => { alive = false; };
    }
    setUrl(null);
    if (!supabase || !user) return () => { alive = false; };

    (async () => {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(profilePath(), 60 * 60);
      if (!alive) return;
      if (error || !data?.signedUrl) {
        setUrl(null);
        return;
      }
      setUrl(data.signedUrl);
    })();

    return () => { alive = false; };
  }, [user?.id]);

  return url;
}

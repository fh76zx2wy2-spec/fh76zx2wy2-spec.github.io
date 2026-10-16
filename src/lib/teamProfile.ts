import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth';

export interface TeamProfile {
  member_id: string;
  email: string;
  display_name: string;
  avatar_path: string | null;
  program_template: string;
  is_admin: boolean;
}

export interface TeamProfileView extends TeamProfile {
  avatar_url: string | null;
  loading: boolean;
}

export function fallbackAvatarUrl(email: string): string | null {
  return email.toLowerCase() === 'aboomar335@gmail.com' ? '/coaches/dhaidan.jpg' : null;
}

export async function signedAvatarUrl(avatarPath: string | null, email = ''): Promise<string | null> {
  if (!avatarPath) return fallbackAvatarUrl(email);
  if (avatarPath.startsWith('/')) return avatarPath;
  if (!supabase) return fallbackAvatarUrl(email);
  const { data, error } = await supabase.storage.from('coach-profiles').createSignedUrl(avatarPath, 60 * 60);
  if (error || !data?.signedUrl) return fallbackAvatarUrl(email);
  return data.signedUrl;
}

export function useMyTeamProfile(): TeamProfileView {
  const { user } = useAuth();
  const fallbackName = user?.email?.split('@')[0] || 'عضو';
  const [profile, setProfile] = useState<TeamProfileView>({
    member_id: '',
    email: user?.email ?? '',
    display_name: fallbackName,
    avatar_path: null,
    avatar_url: fallbackAvatarUrl(user?.email ?? ''),
    program_template: 'ziyad',
    is_admin: false,
    loading: true,
  });

  useEffect(() => {
    let alive = true;
    if (!user || !supabase) {
      setProfile((p) => ({ ...p, loading: false }));
      return () => { alive = false; };
    }
    setProfile((p) => ({ ...p, email: user.email, display_name: p.display_name || fallbackName, loading: true }));
    (async () => {
      const { data, error } = await supabase.rpc('get_my_team_profile');
      if (!alive) return;
      if (error || !Array.isArray(data) || !data[0]) {
        setProfile({
          member_id: '', email: user.email, display_name: fallbackName, avatar_path: null,
          avatar_url: fallbackAvatarUrl(user.email), program_template: 'ziyad', is_admin: false, loading: false,
        });
        return;
      }
      const row = data[0] as TeamProfile;
      const avatar_url = await signedAvatarUrl(row.avatar_path ?? null, row.email ?? user.email);
      if (!alive) return;
      setProfile({ ...row, avatar_url, loading: false });
    })();
    return () => { alive = false; };
  }, [user?.id, user?.email]);

  return profile;
}

export async function imageFileToJpeg(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) throw new Error('اختر صورة من الاستديو');
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('تعذر قراءة الصورة. جرّب صورة JPG أو PNG.'));
      el.src = objectUrl;
    });
    const maxSide = 900;
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
    const width = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
    const height = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('تعذر تجهيز الصورة');
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.86));
    if (!blob) throw new Error('تعذر تحويل الصورة');
    return blob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

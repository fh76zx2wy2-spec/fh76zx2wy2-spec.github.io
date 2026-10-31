import { supabase } from './supabase';

// غيّر رقم الإصدار والعناصر عند كل تحديث ملحوظ، ليُعرض وصفه مرة واحدة لكل عضو.
export const RELEASE_INFO = {
  version: '1.9.1',
  features: [
    { emoji: '🚶', title: 'رياضة أخرى غير النادي', description: 'سجّل المشي أو الدراجة أو السباحة أو الجري، ومعها خيارات رياضية إضافية.' },
    { emoji: '🏆', title: 'كل نشاط يُحسب ضمن 4/4', description: 'النادي والرياضات الخارجية تُحسب كأيام نشاط دون تكرار اليوم نفسه.' },
    { emoji: '🔔', title: 'إشعارات أذكى وألطف', description: 'رسائل تشجيعية تراعي إنجازك، مع تذكير غياب لا يتكرر أكثر من مرة أسبوعيًا.' },
    { emoji: '🔒', title: 'خصوصيتك محفوظة', description: 'كل عضو يشاهد نشاطه ونشاط المدير فقط، والمدير يستطيع متابعة الجميع.' },
    { emoji: '✨', title: 'ملخص واضح لكل تحديث', description: 'تعرف الميزات الجديدة عند أول فتح فقط، وتبقى علامة «تم تحديث التطبيق» ظاهرة.' },
  ],
} as const;

function cacheKey(userId: string, version: string) {
  return `45-4.release-seen.${userId}.${version}`;
}

function cached(userId: string, version: string) {
  try { return window.localStorage.getItem(cacheKey(userId, version)) === '1'; }
  catch { return false; }
}
function saveLocal(userId: string, version: string) {
  try { window.localStorage.setItem(cacheKey(userId, version), '1'); }
  catch { /* التخزين قد يكون محظورًا في وضع المتصفح الخاص */ }
}

export async function hasSeenRelease(userId: string, version: string): Promise<boolean> {
  if (cached(userId, version)) return true;
  if (!supabase) return false;
  try {
    // عند عدم وصول الجدول الجديد يبقى الملخص يعمل على الجهاز نفسه.
    const { data, error } = await supabase
      .from('app_release_seen')
      .select('release_version')
      .eq('user_id', userId)
      .eq('release_version', version)
      .maybeSingle();
    if (error) return false;
    if (data) saveLocal(userId, version);
    return !!data;
  } catch { return false; }
}

export async function markReleaseSeen(userId: string, version: string): Promise<void> {
  // التسجيل المحلي أولًا، حتى لو انقطع الإنترنت بعد إغلاق النافذة.
  saveLocal(userId, version);
  if (!supabase) return;
  try {
    const { error } = await supabase.from('app_release_seen')
      .insert({ user_id: userId, release_version: version });
    // 23505 = سبق الإقرار به على جهاز آخر.
    if (error && error.code !== '23505') console.warn('Release note acknowledgement not synced');
  } catch {
    // لا يفسد التحديث أو الإشعارات لو تعذّر حفظ إقرار القراءة.
  }
}

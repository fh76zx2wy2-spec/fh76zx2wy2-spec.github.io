import { supabase } from './supabase';

// غيّر رقم الإصدار والعناصر عند كل تحديث ملحوظ، ليُعرض وصفه مرة واحدة لكل عضو.
export const RELEASE_INFO = {
  version: '1.9.2',
  features: [
    { emoji: '🚶', title: 'بداية أسهل للرياضة', description: 'ابدأ المشي أو الدراجة أو السباحة أو الجري مباشرة دون إدخال مسافة مستهدفة.' },
    { emoji: '📏', title: 'المسافة بعد الإنجاز', description: 'عند انتهاء الرياضة، شاهد المدة وأضف المسافة الفعلية اختياريًا قبل إرسال إشعار الإنجاز.' },
    { emoji: '🔔', title: 'إشعارات إنجاز أوضح', description: 'يظهر نوع الرياضة والمدة والمسافة الفعلية إن أضفتها؛ وتُحسب ضمن 4/4.' },
    { emoji: '✨', title: 'بدء الرياضة بدون تعقيد', description: 'يمكن إعادة التحقق من اتصال الرياضات بعد تفعيلها في قاعدة البيانات.' },
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

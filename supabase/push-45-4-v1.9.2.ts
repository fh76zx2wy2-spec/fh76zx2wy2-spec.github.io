import { createClient } from 'npm:@supabase/supabase-js@2.116.0';
import { sendPushNotification } from 'npm:@mmmike/web-push@1.3.0/send';

const ADMIN_EMAIL = 'z062496@gmail.com';
const PUBLIC_VAPID = Deno.env.get('VAPID_PUBLIC_KEY') ?? '';
const PRIVATE_VAPID = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? `mailto:${ADMIN_EMAIL}`;
const CRON_SECRET = Deno.env.get('CRON_SECRET') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? (() => {
  try { return JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}').default ?? ''; } catch { return ''; }
})();

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } });

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

type TeamMember = { id: string; email: string; display_name: string; is_active: boolean };
type RegisteredMember = TeamMember & { user_id: string };

async function activeMembers(): Promise<TeamMember[]> {
  const { data, error } = await admin.from('team_members').select('id,email,display_name,is_active').eq('is_active', true).order('display_order');
  if (error) throw error;
  return (data ?? []) as TeamMember[];
}

async function registeredActiveMembers(): Promise<RegisteredMember[]> {
  const members = await activeMembers();
  const byEmail = new Map(members.map((m) => [m.email.toLowerCase(), m]));
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  return data.users.flatMap((u) => {
    const email = u.email?.toLowerCase();
    if (!email) return [];
    const m = byEmail.get(email);
    if (!m) return [];
    return [{ ...m, user_id: u.id }];
  });
}

async function caller(req: Request): Promise<RegisteredMember | null> {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user?.email) return null;
  const email = data.user.email.toLowerCase();
  const { data: m, error: memberError } = await admin.from('team_members')
    .select('id,email,display_name,is_active')
    .eq('email', email).eq('is_active', true).maybeSingle();
  if (memberError || !m) return null;
  return { ...(m as TeamMember), user_id: data.user.id };
}

async function teammatesOf(user: RegisteredMember): Promise<RegisteredMember[]> {
  const members = await registeredActiveMembers();
  // الخصوصية: زياد يرى/يتفاعل مع الجميع، وكل عضو آخر يرى/يتفاعل مع زياد فقط.
  if (user.email.toLowerCase() === ADMIN_EMAIL) {
    return members.filter((m) => m.user_id !== user.user_id);
  }
  return members.filter((m) => m.email.toLowerCase() === ADMIN_EMAIL);
}

type PushPayload = { title: string; body: string; tag?: string; url?: string };

async function sendToUser(userId: string, payload: PushPayload) {
  const { data: subs, error } = await admin.from('push_subscriptions').select('id,endpoint,p256dh,auth').eq('user_id', userId);
  if (error) throw error;
  let delivered = 0;
  for (const sub of subs ?? []) {
    try {
      const ok = await sendPushNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
        { publicKey: PUBLIC_VAPID, privateKey: PRIVATE_VAPID, subject: VAPID_SUBJECT },
        { ttl: 60 * 60 * 6, urgency: 'normal' },
      );
      if (ok) delivered++;
      // لا تحذف اشتراك جهاز بسبب فشل مؤقت أو استجابة غير حاسمة.
      // يحذف فقط عند كود نهائي 404/410 الذي يعني انتهاء صلاحية نقطة الإرسال.
      else console.warn('push not confirmed; retaining subscription');
    } catch (e) {
      const status = Number((e as any)?.statusCode ?? (e as any)?.status ?? 0);
      if (status === 404 || status === 410) await admin.from('push_subscriptions').delete().eq('id', sub.id);
      else console.error('push failed', status, e);
    }
  }
  return delivered;
}

async function alreadySent(userId: string, kind: string, refKey: string) {
  const { data } = await admin.from('push_notification_log').select('id').eq('user_id', userId).eq('kind', kind).eq('ref_key', refKey).maybeSingle();
  return !!data;
}

async function markSent(userId: string, kind: string, refKey: string) {
  await admin.from('push_notification_log').upsert({ user_id: userId, kind, ref_key: refKey }, { onConflict: 'user_id,kind,ref_key' });
}

async function sendOnce(userId: string, kind: string, refKey: string, payload: PushPayload) {
  if (await alreadySent(userId, kind, refKey)) return 0;
  const delivered = await sendToUser(userId, payload);
  if (delivered > 0) await markSent(userId, kind, refKey);
  return delivered;
}

function durationArabic(seconds: number) {
  const mins = Math.max(0, Math.round(seconds / 60));
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h} س و${m} د` : `${h} س`;
  }
  return `${mins} دقيقة`;
}

// كل حساب يرى فقط نفسه وزياد، وذلك يُطبّق على المرسل إليهم من السيرفر لا من الواجهة.
function riyadhDate(now = new Date()): { date: string; hour: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const v = (t: string) => parts.find(p => p.type === t)?.value ?? '';
  return { date: `${v('year')}-${v('month')}-${v('day')}`, hour: Number(v('hour')) };
}
function dateMove(date: string, delta: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}
function startOfWeekSun(date: string): string {
  const d = new Date(`${date}T12:00:00Z`);
  return dateMove(date, -d.getUTCDay());
}
function stableIndex(input: string, len: number): number {
  let n = 0;
  for (const ch of input) n = (n * 31 + ch.charCodeAt(0)) >>> 0;
  return n % len;
}
async function activityDays(userId: string, from: string, to: string): Promise<Set<string>> {
  const [gym, sports] = await Promise.all([
    admin.from('gym_visits').select('date').eq('user_id',userId).gte('date',from).lte('date',to),
    admin.from('sport_activities').select('date,ended_at').eq('user_id',userId).gte('date',from).lte('date',to),
  ]);
  if (gym.error || sports.error) throw gym.error ?? sports.error;
  return new Set([
    ...(gym.data ?? []).map(v => String(v.date)),
    ...(sports.data ?? []).map(a => String(a.date)), // بدأ نشاطًا اليوم؛ لا نُعاتبه بأنه غائب.
  ]);
}
async function userExercisedToday(userId: string, date: string): Promise<boolean> {
  const days = await activityDays(userId, date, date);
  return days.has(date);
}

async function sweep() {
  const users = await registeredActiveMembers();
  const now = new Date();
  const { date: today, hour } = riyadhDate(now);
  let delivered = 0;
  for (const u of users) {
    const { data: active, error: gymError } = await admin.from('gym_visits')
      .select('id,arrived_at').eq('user_id',u.user_id).is('left_at',null)
      .order('arrived_at',{ascending:false}).limit(1).maybeSingle();
    if (gymError) throw gymError;
    if (active?.arrived_at) {
      const minutes = Math.floor((now.getTime() - Date.parse(active.arrived_at)) / 60000);
      if (minutes >= 45) delivered += await sendOnce(u.user_id,'visit-45',active.id,{
        title:'45/4 · وصلت 45 دقيقة ✅', body:`يا ${u.display_name}، أكملت 45 دقيقة في النادي. كفو عليك 🔥`,tag:`visit-45-${active.id}`,url:'/',
      });
      if (minutes >= 60) delivered += await sendOnce(u.user_id,'visit-60',active.id,{
        title:'45/4 · جلست ساعة 🔥',body:`يا ${u.display_name}، مرّت ساعة منذ وصولك. إذا خرجت من النادي سجّل مغادرتك.`,tag:`visit-60-${active.id}`,url:'/',
      });
    }
    // نذكّر مرة في الأسبوع بغياب يومين كاملين متتاليين، وليس في يوم مارس فيه الرياضة.
    // الإرسال في الساعة 16 بتوقيت الرياض. لا تُحذف اشتراكات Push أو تُعاد تهيئتها.
    if (hour !== 16 || active) continue;
    const weekStart = startOfWeekSun(today);
    const twoDaysAgo = dateMove(today,-2);
    const yesterday = dateMove(today,-1);
    const weekDays = await activityDays(u.user_id,weekStart,dateMove(weekStart,6));
    const { data: completedSports, error: completedError } = await admin.from('sport_activities')
      .select('date').eq('user_id',u.user_id).gte('date',weekStart).lte('date',dateMove(weekStart,6)).not('ended_at','is',null);
    if (completedError) throw completedError;
    // الإنجاز لا يُحسب حتى تنتهي الرياضة الخارجية، بينما الوصول للنادي يُحتسب مباشرة.
    const { data: gymWeek, error: gymWeekError } = await admin.from('gym_visits')
      .select('date').eq('user_id',u.user_id).gte('date',weekStart).lte('date',dateMove(weekStart,6));
    if (gymWeekError) throw gymWeekError;
    const completedDays = new Set([...(gymWeek??[]).map(x=>String(x.date)),...(completedSports??[]).map(x=>String(x.date))]);
    if (completedDays.size >= 4 || weekDays.has(today)) continue;
    const days = await activityDays(u.user_id,twoDaysAgo,yesterday);
    if (days.has(twoDaysAgo) || days.has(yesterday)) continue;
    const options = [
      `وينك يا ${u.display_name}؟ صار لك يومين ما لعبت أي رياضة 😄 النادي يحتريك!`,
      `يا ${u.display_name}، لك يومين غايب عن الحركة! اعتبر النادي موعد غرامي ولا تتأخر 😂💙`,
      `${u.display_name} وينك مختفي؟ يومين بدون رياضة! باقي وقت تكمّل 4/4 🔥`,
      `النادي والرياضة ينتظرونك يا ${u.display_name} 👀 يومين راحة تكفي، وش رايك تتحرك اليوم؟`,
    ];
    delivered += await sendOnce(u.user_id,'sport-away-weekly',`${u.user_id}:${weekStart}`,{
      title:'45/4 · وينك؟ 👀',body:options[stableIndex(`${u.user_id}:${weekStart}`,options.length)],
      tag:`away-${weekStart}`,url:'/',
    });
  }
  return { delivered, members: users.length };
}

const REACTIONS: Record<string, string> = { kfu: '👏 كفو', fire: '🔥 شد حيلك', beatme: '😅 سبقتني', yourturn: '👉 اليوم عليك', beast4: '🔥 4/4 يا وحش' };

export default {
  async fetch(req: Request) {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
    if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
    if (!PUBLIC_VAPID || !PRIVATE_VAPID || !SERVICE_ROLE) return json({ error: 'push_not_configured' }, 500);
    const body = await req.json().catch(() => ({}));

    if (body?.action === 'sweep') {
      if (!CRON_SECRET || req.headers.get('x-cron-secret') !== CRON_SECRET) return json({ error: 'unauthorized' }, 401);
      try { return json(await sweep()); } catch (e) { console.error(e); return json({ error: String(e) }, 500); }
    }

    const user = await caller(req);
    if (!user) return json({ error: 'unauthorized' }, 401);

    if (body?.action === 'test') {
      const delivered = await sendToUser(user.user_id, { title: '45/4 🔔', body: `يا ${user.display_name}، هذا إشعار تجريبي حقيقي من 45/4 🔥`, tag: `test-${Date.now()}`, url: '/' });
      return json({ ok: true, delivered });
    }

    const teammates = await teammatesOf(user);
    const sender = user.display_name;

    if (body?.action === 'buddy-arrived') {
      const visitId = String(body.visitId ?? '');
      const { data: visit } = await admin.from('gym_visits').select('id').eq('id', visitId).eq('user_id', user.user_id).maybeSingle();
      if (!visit) return json({ error: 'visit_not_found' }, 404);
      let delivered = 0;
      for (const mate of teammates) {
        const hasMoved = await userExercisedToday(mate.user_id, riyadhDate().date);
        const { data: mateInGym } = await admin.from('gym_visits').select('id').eq('user_id',mate.user_id).is('left_at',null).limit(1).maybeSingle();
        // من تمرّن اليوم لا تصله عبارة «وينك؟» إطلاقًا، ولو خرج قبل وصول المرسل.
        const messages = mateInGym
          ? [`${sender} وصل النادي معك الآن 🔥 التحدي بدأ يا ${mate.display_name}!`]
          : hasMoved
            ? [`${sender} وصل النادي الآن 💪 وأنت خلّصت نشاطك اليوم، كفو عليكما!`,`${sender} دخل النادي 🏋️‍♂️ يوم رياضي ممتاز لكما 👏`]
            : [`${sender} وصل النادي الآن 🔥 وينك يا ${mate.display_name}؟`,`${sender} في النادي 🏋️‍♂️ يلا يا ${mate.display_name} شد حيلك!`,`النادي فيه ${sender} الآن 💪 يا ${mate.display_name} وينك؟`];
        delivered += await sendOnce(mate.user_id,'buddy-arrived',visitId,{
          title:`45/4 · ${sender} وصل النادي 🔥`,body:messages[stableIndex(`${visitId}:${mate.user_id}`,messages.length)],tag:`buddy-arrived-${visitId}`,url:'/',
        });
      }
      return json({ ok: true, delivered });
    }

    if (body?.action === 'buddy-left') {
      const visitId = String(body.visitId ?? '');
      const { data: visit } = await admin.from('gym_visits').select('id,duration_seconds').eq('id', visitId).eq('user_id', user.user_id).maybeSingle();
      if (!visit) return json({ error: 'visit_not_found' }, 404);
      const seconds = Math.max(0, Number(visit.duration_seconds ?? body.durationSeconds ?? 0));
      let buddyDelivered = 0;
      for (const mate of teammates) {
        buddyDelivered += await sendOnce(mate.user_id, 'buddy-left', visitId, { title: '45/4 · انتهت الزيارة 👏', body: `${sender} أنهى زيارته للنادي اليوم · ${durationArabic(seconds)} 👏`, tag: `buddy-left-${visitId}`, url: '/' });
      }
      const finishMessages = [
        `خلصت تمرينك اليوم · ${durationArabic(seconds)} 👏 كفو يا ${sender}، خطوة جديدة نحو 4/4 🔥`,
        `تمرين اليوم خلص ✅ ${durationArabic(seconds)} في النادي. أحسنت يا ${sender}، الاستمرارية هي المكسب 💪🔥`,
        `أنجزتها يا ${sender} 👏🔥 ${durationArabic(seconds)} محسوبة لك اليوم. استمر على نفس النسق 💙`,
        `كفو يا ${sender} 🏋️‍♂️✅ خلصت زيارة اليوم بعد ${durationArabic(seconds)}. يوم قوي وانتهى 🔥`,
      ];
      let hash = 0; for (const ch of visitId) hash = (hash * 33 + ch.charCodeAt(0)) >>> 0;
      const selfDelivered = await sendOnce(user.user_id, 'self-finish', visitId, { title: `45/4 · كفو يا ${sender} 👏🔥`, body: finishMessages[hash % finishMessages.length], tag: `self-finish-${visitId}`, url: '/' });
      return json({ ok: true, delivered: buddyDelivered + selfDelivered, buddyDelivered, selfDelivered });
    }

    // أنشطة خارج النادي: لا يُسمح بالإشعار إلا إذا كانت ملكًا للمرسل وثابتة في قاعدة البيانات.
    if (body?.action === 'sport-started' || body?.action === 'sport-finished') {
      const id = String(body.activityId ?? '');
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json({error:'bad_activity'},400);
      const { data: a, error: ae } = await admin.from('sport_activities')
        .select('id,user_id,sport_key,sport_label,started_at,ended_at,duration_seconds,distance_km')
        .eq('id',id).eq('user_id',user.user_id).maybeSingle();
      if (ae || !a) return json({error:'activity_not_found'},404);
      const finished = body.action === 'sport-finished';
      if (finished && !a.ended_at) return json({error:'activity_not_finished'},400);
      if (!finished && a.ended_at) return json({error:'activity_already_finished'},400);
      const labels: Record<string,string> = {
        walking:'المشي',cycling:'الدراجة',swimming:'السباحة',running:'الجري',football:'كرة القدم',
        padel:'البادل',basketball:'كرة السلة',hiking:'المشي الجبلي',jump_rope:'نط الحبل',
        home_workout:'التمارين المنزلية',rowing:'التجديف',other:'رياضة أخرى',
      };
      const label = a.sport_key === 'other' ? String(a.sport_label || 'رياضة أخرى').slice(0,45) : labels[a.sport_key] || 'رياضة';
      const km = a.distance_km == null ? null : `${Number(a.distance_km)} كم`;
      const howLong = durationArabic(Number(a.duration_seconds || 0));
      // صياغات عربية مفهومة، والعدد يُقرأ من المسافة الفعلية المُدخلة عند النهاية فقط.
      const kmPhrases: Record<string, string> = {
        walking: `${sender} مشى ${km} خلال ${howLong}`,
        cycling: `${sender} قطع بالدراجة ${km} خلال ${howLong}`,
        swimming: `${sender} سبح ${km} خلال ${howLong}`,
        running: `${sender} ركض ${km} خلال ${howLong}`,
        hiking: `${sender} مشى ${km} في المشي الجبلي خلال ${howLong}`,
        rowing: `${sender} جدّف ${km} خلال ${howLong}`,
      };
      const message = finished
        ? `${km && kmPhrases[a.sport_key] ? kmPhrases[a.sport_key] : `${sender} أنهى ${label} خلال ${howLong}`} 👏 كفو!`
        : `${sender} بدأ ${label} الآن 💪 الله يقويه!`;
      let delivered = 0;
      for (const mate of teammates) {
        delivered += await sendOnce(mate.user_id,body.action,id,{
          title:finished?`45/4 · ${sender} أنهى رياضته 👏`:`45/4 · ${sender} بدأ رياضة 💪`,
          body:message,tag:`${body.action}-${id}`,url:'/',
        });
      }
      if (finished) {
        delivered += await sendOnce(user.user_id,'sport-self-finish',id,{
          title:'45/4 · كفو عليك 👏',body:`${km ? `قطعت ${km} في ${label} خلال ${howLong}` : `أنهيت ${label} خلال ${howLong}`}. محسوبة ضمن أيامك الرياضية!`,
          tag:`sport-self-finish-${id}`,url:'/',
        });
      }
      return json({ok:true,delivered});
    }

    if (body?.action === 'buddy-4of4') {
      const weekStart = String(body.weekStart ?? '');
      const weekEnd = new Date(`${weekStart}T12:00:00Z`);
      if (Number.isNaN(weekEnd.getTime())) return json({ error: 'bad_week' }, 400);
      weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
      const end = weekEnd.toISOString().slice(0, 10);
      const { data: visits, error: vg } = await admin.from('gym_visits').select('date').eq('user_id',user.user_id).gte('date',weekStart).lte('date',end);
      const { data: sports, error: sg } = await admin.from('sport_activities').select('date').eq('user_id',user.user_id).gte('date',weekStart).lte('date',end).not('ended_at','is',null);
      if (vg || sg) throw vg ?? sg;
      const days = new Set([...(visits ?? []).map(v=>String(v.date)),...(sports ?? []).map(v=>String(v.date))]).size;
      if (days < 4) return json({ error: 'not_4of4' }, 400);
      let delivered = 0;
      for (const mate of teammates) delivered += await sendOnce(mate.user_id, 'buddy-4of4', `${user.user_id}:${weekStart}`, { title: '45/4 · أسبوع كامل 🏆', body: `${sender} أكمل 4/4 هذا الأسبوع 🏆`, tag: `buddy-4of4-${user.user_id}-${weekStart}`, url: '/' });
      return json({ ok: true, delivered });
    }

    if (body?.action === 'buddy-reaction') {
      const kind = String(body.kind ?? '');
      const label = REACTIONS[kind];
      if (!label) return json({ error: 'invalid_reaction' }, 400);
      let delivered = 0;
      for (const mate of teammates) delivered += await sendToUser(mate.user_id, { title: `45/4 · ${sender} يشجّعك`, body: `${sender}: ${label}`, tag: `reaction-${Date.now()}-${mate.user_id}`, url: '/' });
      return json({ ok: true, delivered });
    }

    return json({ error: 'unknown_action' }, 400);
  },
};

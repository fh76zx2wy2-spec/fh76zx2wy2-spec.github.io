/**
 * 45/4 — برنامج موحّد لزياد وعبدالسلام.
 * السبت Upper A · الأحد Lower A · الثلاثاء Upper B · الأربعاء Lower B.
 * الجلسة الأساسية: 7 دقائق إحماء + 22 حديد + 11 كارديو + 5 إطالة = 45 دقيقة.
 */
import type { MachineId } from './machines';

export type DayId = 1 | 2 | 3 | 4;
export type PhaseId = 'adapt' | 'build' | 'firm';

export interface SessionStructure {
  warmup: number;
  cardio: number;
  iron: number;
  stretch: number;
  total: number;
}

export let SESSION_STRUCTURE: SessionStructure = { warmup: 7, cardio: 11, iron: 22, stretch: 5, total: 45 };

export interface ActiveProgramMeta {
  key: 'ziyad' | 'abdulsalam';
  defaultName: string;
  email: string;
  weightsFirst: boolean;
  cardioEmbeddedWarmup: boolean;
}

export let ACTIVE_PROGRAM: ActiveProgramMeta = {
  key: 'ziyad',
  defaultName: 'زياد',
  email: 'z062496@gmail.com',
  weightsFirst: true,
  cardioEmbeddedWarmup: false,
};

export const WEEKLY_GOAL = 4;
export const PROGRAM_WEEKS = 12;
/** 0=الأحد، 6=السبت: السبت · الأحد · الثلاثاء · الأربعاء */
export const SUGGESTED_WEEKDAYS = [6, 0, 2, 3];

export interface CardioSpec {
  machineId: MachineId;
  mode: 'steady' | 'intervals';
  note: string;
}

export interface DayExercise {
  machineId: MachineId;
  sets: number;
  reps: string;
  rest: number;
  phaseScaled: boolean;
  timed?: boolean;
}

export interface DayDef {
  id: DayId;
  title: string;
  focus: string;
  subtitle: string;
  kind: 'straight' | 'circuit';
  cardio: CardioSpec;
  exercises: DayExercise[];
  ironSummary: string;
  ironHint?: string;
  circuit?: { roundsMin: number; roundsMax: number; restBetweenRounds: number };
  stretchHint: string;
  warmupHint?: string;
}

const UPPER_WARMUP = '0–4 د مشي سريع على مضمار النادي · 4–6 د: 30ث هرولة + 30ث مشي × مرتين · 6–7 د دوائر بالذراعين وتحريك الكتفين.';
const LOWER_WARMUP = '0–4 د مشي سريع على مضمار النادي · 4–6 د: 30ث هرولة + 30ث مشي × مرتين · 6–7 د Leg Swings خفيفة.';
const UPPER_STRETCH = '5 دقائق: صدر 30ث لكل جهة · Cross-body للكتف 30ث لكل جهة · ترايسبس 20–30ث لكل جهة · Child’s Pose 30ث، ثم كرر الصدر والكتف في الوقت المتبقي.';
const LOWER_STRETCH = '5 دقائق: Quad 30ث لكل رجل · Calf 30ث لكل رجل · Figure 4 مدة 30ث لكل جهة · Forward Fold نحو 30ث، ثم كرر بلطف في الوقت المتبقي.';

export let DAYS: DayDef[] = [
  {
    id: 1,
    title: 'الجزء العلوي (أ)',
    focus: 'الجزء العلوي (أ) · صدر · ظهر · أكتاف · ذراعان',
    subtitle: 'السبت · 45 دقيقة',
    kind: 'straight',
    cardio: { machineId: 'elliptical', mode: 'steady', note: '11 دقيقة: 6 أوبتيكال + 5 دراجة Upright.' },
    ironSummary: '22 دقيقة · 5 تمارين',
    ironHint: 'في آخر تمرينين: اعمل Biceps Curl ثم Triceps Pushdown بالتبادل لتوفير الوقت. الراحة عمومًا 45–60 ثانية.',
    exercises: [
      { machineId: 'chest-press', sets: 3, reps: '10–12', rest: 60, phaseScaled: false },
      { machineId: 'lat-pulldown', sets: 3, reps: '10–12', rest: 60, phaseScaled: false },
      { machineId: 'shoulder-press', sets: 2, reps: '10–12', rest: 60, phaseScaled: false },
      { machineId: 'biceps-curl', sets: 2, reps: '8–10', rest: 45, phaseScaled: false },
      { machineId: 'triceps-pushdown', sets: 2, reps: '8–10', rest: 45, phaseScaled: false },
    ],
    warmupHint: UPPER_WARMUP,
    stretchHint: UPPER_STRETCH,
  },
  {
    id: 2,
    title: 'الجزء السفلي (أ)',
    focus: 'الجزء السفلي (أ) · أرجل · مؤخرة · جذع',
    subtitle: 'الأحد · 45 دقيقة',
    kind: 'straight',
    cardio: { machineId: 'elliptical', mode: 'steady', note: '11 دقيقة: 6 أوبتيكال + 5 تجديف.' },
    ironSummary: '22 دقيقة · 5 تمارين',
    exercises: [
      { machineId: 'leg-press', sets: 3, reps: '10–12', rest: 60, phaseScaled: false },
      { machineId: 'leg-curl', sets: 3, reps: '8–10', rest: 60, phaseScaled: false },
      { machineId: 'walking-lunge', sets: 2, reps: '8 لكل رجل', rest: 45, phaseScaled: false },
      { machineId: 'calf-raise', sets: 2, reps: '12–15', rest: 45, phaseScaled: false },
      { machineId: 'plank', sets: 2, reps: '30–45 ثانية', rest: 45, phaseScaled: false, timed: true },
    ],
    warmupHint: LOWER_WARMUP,
    stretchHint: LOWER_STRETCH,
  },
  {
    id: 3,
    title: 'الجزء العلوي (ب)',
    focus: 'الجزء العلوي (ب) · صدر · ظهر · كتف خلفي · ذراعان',
    subtitle: 'الثلاثاء · 45 دقيقة',
    kind: 'straight',
    cardio: { machineId: 'elliptical', mode: 'steady', note: '11 دقيقة: 7 أوبتيكال + 4 Stair Climber.' },
    ironSummary: '22 دقيقة · 5 تمارين',
    exercises: [
      { machineId: 'incline-dumbbell-press', sets: 3, reps: '10–12', rest: 60, phaseScaled: false },
      { machineId: 'seated-row', sets: 3, reps: '10–12', rest: 60, phaseScaled: false },
      { machineId: 'face-pull', sets: 2, reps: '10–12', rest: 45, phaseScaled: false },
      { machineId: 'hammer-curl', sets: 2, reps: '8–10', rest: 45, phaseScaled: false },
      { machineId: 'triceps-pushdown', sets: 2, reps: '8–10', rest: 45, phaseScaled: false },
    ],
    warmupHint: UPPER_WARMUP,
    stretchHint: UPPER_STRETCH,
  },
  {
    id: 4,
    title: 'الجزء السفلي (ب)',
    focus: 'الجزء السفلي (ب) · أرجل · مؤخرة · جذع',
    subtitle: 'الأربعاء · 45 دقيقة',
    kind: 'straight',
    cardio: { machineId: 'elliptical', mode: 'steady', note: '11 دقيقة: 6 أوبتيكال + 5 دراجة Recumbent (والعادية بديل عند عدم توفرها).' },
    ironSummary: '22 دقيقة · 5 تمارين',
    exercises: [
      { machineId: 'leg-press', sets: 3, reps: '10–12', rest: 60, phaseScaled: false },
      { machineId: 'hip-thrust', sets: 3, reps: '10–12', rest: 60, phaseScaled: false },
      { machineId: 'bulgarian-split-squat', sets: 2, reps: '8 لكل رجل', rest: 60, phaseScaled: false },
      { machineId: 'seated-calf-raise', sets: 2, reps: '12–15', rest: 45, phaseScaled: false },
      { machineId: 'side-plank', sets: 2, reps: '30 ثانية لكل جهة', rest: 45, phaseScaled: false, timed: true },
    ],
    warmupHint: LOWER_WARMUP,
    stretchHint: LOWER_STRETCH,
  },
];

export let DAY_BY_ID: Record<DayId, DayDef> = Object.fromEntries(DAYS.map((d) => [d.id, d])) as Record<DayId, DayDef>;

export const CIRCUIT_NOTE = 'نفّذ التمارين بالترتيب وبجودة حركة ثابتة، وخذ الراحة المحددة قبل الانتقال.';
export const BUSY_NOTE = 'أكمل سيتات الجهاز ثم انتقل للتالي. إن كان الجهاز مشغولًا بدّل الترتيب.';

export interface PhaseDef {
  id: PhaseId;
  name: string;
  badge: string;
  from: number;
  to: number;
  iron: string;
  cardio: string;
  sets: number;
  reps: string;
  short: string;
  preserveTableReps?: boolean;
}

export let PHASES: PhaseDef[] = [
  { id: 'adapt', name: 'التأقلم', badge: 'تأقلم', from: 1, to: 2, iron: 'التزم بعدد السيتات والتكرارات في الجدول واختر وزنًا خفيفًا جدًا لتثبيت الحركة.', cardio: 'التزم بالـ11 دقيقة المحددة لكل يوم بإيقاع مريح.', sets: 2, reps: '10–12', short: 'خفيف · ثبّت الحركة', preserveTableReps: true },
  { id: 'build', name: 'البناء', badge: 'بناء', from: 3, to: 6, iron: 'نفس الجدول. زد الوزن بأصغر درجة عندما تنهي أعلى نطاق التكرارات بتكنيك نظيف.', cardio: 'نفس توزيع الأجهزة والزمن المحدد لكل يوم.', sets: 3, reps: '10–12', short: 'نفس الجدول · تقدّم تدريجي', preserveTableReps: true },
  { id: 'firm', name: 'التثبيت والشدّ', badge: 'تثبيت وشدّ', from: 7, to: 12, iron: 'حافظ على نفس السيتات والتكرارات وارفع الوزن تدريجيًا فقط مع بقاء الحركة سليمة.', cardio: 'حافظ على الزمن، ويمكن رفع المقاومة قليلًا دون تحويل الجلسة إلى مجهود أقصى.', sets: 3, reps: '10–12', short: 'ثبّت الجودة · زد تدريجيًا', preserveTableReps: true },
];

export function phaseForWeek(week: number): PhaseDef {
  return PHASES.find((p) => week >= p.from && week <= p.to) ?? PHASES[PHASES.length - 1];
}

export let WEIGHT_RULE = 'إذا أنهيت أعلى رقم في نطاق التكرارات لكل السيتات بسهولة وبوضعية سليمة، ارفع الوزن بأصغر درجة متاحة في الجلسة التالية.';
export let WEIGHT_HINT = 'إذا أنهيت جميع التكرارات بسهولة وبوضعية سليمة، يمكنك زيادة الوزن بأصغر درجة متاحة.';
export let CARDIO_INTENSITY = 'اجعل الجهد متوسطًا ومريحًا: تستطيع الكلام بجمل قصيرة، وخفّف المقاومة إذا بدأت التقنية تتدهور.';
export let INTERVAL_NOTE = 'الكارديو موزّع بين الأوبتيكال وجهاز ثانٍ مختلف حسب اليوم؛ لا يوجد سير كهربائي ضمن البرنامج.';

export interface CardioSegment {
  kind: 'warmup' | 'steady' | 'fast' | 'calm';
  seconds: number;
  label: string;
  hint: string;
  station?: MachineId;
  stationLabel?: string;
}

function scaleSegments(base: CardioSegment[], minutes: number): CardioSegment[] {
  const target = Math.max(60, Math.round(minutes * 60));
  const original = base.reduce((s, x) => s + x.seconds, 0);
  if (target === original) return base.map((x) => ({ ...x }));
  let used = 0;
  return base.map((x, i) => {
    const seconds = i === base.length - 1 ? Math.max(15, target - used) : Math.max(15, Math.round((x.seconds / original) * target));
    used += seconds;
    return { ...x, seconds };
  });
}

const CARDIO_BY_DAY: Record<DayId, CardioSegment[]> = {
  1: [
    { kind: 'warmup', seconds: 60, label: 'أوبتيكال — هادئ', hint: 'دقيقة هادئة لالتقاط الإيقاع.', station: 'elliptical', stationLabel: 'الأوبتيكال' },
    { kind: 'steady', seconds: 240, label: 'أوبتيكال — متوسط', hint: '4 دقائق جهد متوسط بحركة انسيابية.', station: 'elliptical', stationLabel: 'الأوبتيكال' },
    { kind: 'calm', seconds: 60, label: 'أوبتيكال — تخفيف', hint: 'دقيقة هادئة قبل الانتقال.', station: 'elliptical', stationLabel: 'الأوبتيكال' },
    { kind: 'warmup', seconds: 60, label: 'دراجة — هادئ', hint: 'دقيقة هادئة.', station: 'bike', stationLabel: 'الدراجة Upright' },
    { kind: 'steady', seconds: 180, label: 'دراجة — متوسط', hint: '3 دقائق متوسطة.', station: 'bike', stationLabel: 'الدراجة Upright' },
    { kind: 'calm', seconds: 60, label: 'دراجة — تخفيف', hint: 'دقيقة تخفيف.', station: 'bike', stationLabel: 'الدراجة Upright' },
  ],
  2: [
    { kind: 'warmup', seconds: 60, label: 'أوبتيكال — هادئ', hint: 'دقيقة هادئة.', station: 'elliptical', stationLabel: 'الأوبتيكال' },
    { kind: 'steady', seconds: 240, label: 'أوبتيكال — متوسط', hint: '4 دقائق جهد متوسط.', station: 'elliptical', stationLabel: 'الأوبتيكال' },
    { kind: 'calm', seconds: 60, label: 'أوبتيكال — تخفيف', hint: 'دقيقة هادئة قبل الانتقال.', station: 'elliptical', stationLabel: 'الأوبتيكال' },
    { kind: 'warmup', seconds: 60, label: 'تجديف — هادئ', hint: 'الدفع يبدأ بالرجلين مع ظهر متزن.', station: 'rower', stationLabel: 'جهاز التجديف' },
    { kind: 'steady', seconds: 180, label: 'تجديف — متوسط', hint: '3 دقائق متوسطة: أرجل ثم جذع ثم ذراعان.', station: 'rower', stationLabel: 'جهاز التجديف' },
    { kind: 'calm', seconds: 60, label: 'تجديف — هادئ', hint: 'دقيقة هادئة مع المحافظة على التقنية.', station: 'rower', stationLabel: 'جهاز التجديف' },
  ],
  3: [
    { kind: 'warmup', seconds: 60, label: 'أوبتيكال — هادئ', hint: 'دقيقة هادئة.', station: 'elliptical', stationLabel: 'الأوبتيكال' },
    { kind: 'steady', seconds: 300, label: 'أوبتيكال — متوسط', hint: '5 دقائق جهد متوسط.', station: 'elliptical', stationLabel: 'الأوبتيكال' },
    { kind: 'calm', seconds: 60, label: 'أوبتيكال — تخفيف', hint: 'دقيقة هادئة قبل الانتقال.', station: 'elliptical', stationLabel: 'الأوبتيكال' },
    { kind: 'warmup', seconds: 60, label: 'درج — بطيء', hint: 'المقابض للتوازن فقط ولا تحمل وزنك عليها.', station: 'stair-climber', stationLabel: 'Stair Climber' },
    { kind: 'steady', seconds: 120, label: 'درج — متوسط', hint: 'دقيقتان متوسطتان وظهرك مستقيم.', station: 'stair-climber', stationLabel: 'Stair Climber' },
    { kind: 'calm', seconds: 60, label: 'درج — بطيء', hint: 'دقيقة بطيئة للتخفيف.', station: 'stair-climber', stationLabel: 'Stair Climber' },
  ],
  4: [
    { kind: 'warmup', seconds: 60, label: 'أوبتيكال — هادئ', hint: 'دقيقة هادئة.', station: 'elliptical', stationLabel: 'الأوبتيكال' },
    { kind: 'steady', seconds: 240, label: 'أوبتيكال — متوسط', hint: '4 دقائق جهد متوسط.', station: 'elliptical', stationLabel: 'الأوبتيكال' },
    { kind: 'calm', seconds: 60, label: 'أوبتيكال — تخفيف', hint: 'دقيقة هادئة قبل الانتقال.', station: 'elliptical', stationLabel: 'الأوبتيكال' },
    { kind: 'warmup', seconds: 60, label: 'دراجة جلوس — هادئ', hint: 'اضبط المقعد والظهر وابدأ بهدوء.', station: 'recumbent-bike', stationLabel: 'الدراجة Recumbent' },
    { kind: 'steady', seconds: 180, label: 'دراجة جلوس — متوسط', hint: '3 دقائق متوسطة. إذا لم تتوفر استخدم الدراجة العادية.', station: 'recumbent-bike', stationLabel: 'الدراجة Recumbent' },
    { kind: 'calm', seconds: 60, label: 'دراجة جلوس — تخفيف', hint: 'دقيقة تخفيف.', station: 'recumbent-bike', stationLabel: 'الدراجة Recumbent' },
  ],
};

export function cardioStationsForDay(dayId: DayId): MachineId[] {
  return [...new Set(CARDIO_BY_DAY[dayId].map((s) => s.station).filter(Boolean) as MachineId[])];
}

export function buildCardioSegments(_mode: 'steady' | 'intervals', minutes: number, _phase: PhaseId, dayId: DayId): CardioSegment[] {
  return scaleSegments(CARDIO_BY_DAY[dayId], minutes);
}

export function buildWarmupSegments(dayId: DayId, minutes = SESSION_STRUCTURE.warmup): CardioSegment[] {
  const upper = dayId === 1 || dayId === 3;
  const base: CardioSegment[] = [
    { kind: 'warmup', seconds: 240, label: 'مشي سريع على المضمار', hint: 'مشي سريع على مضمار النادي — لا يوجد سير كهربائي.' },
    { kind: 'fast', seconds: 30, label: 'هرولة خفيفة', hint: '30 ثانية هرولة خفيفة.' },
    { kind: 'calm', seconds: 30, label: 'مشي', hint: '30 ثانية مشي.' },
    { kind: 'fast', seconds: 30, label: 'هرولة خفيفة', hint: '30 ثانية هرولة خفيفة.' },
    { kind: 'calm', seconds: 30, label: 'مشي', hint: '30 ثانية مشي.' },
    { kind: 'steady', seconds: 60, label: upper ? 'تهيئة الجزء العلوي' : 'تهيئة الجزء السفلي', hint: upper ? 'دوائر بالذراعين وتحريك الكتفين.' : 'Leg Swings خفيفة لكل رجل.' },
  ];
  return scaleSegments(base, minutes);
}

export function buildStretchSegments(dayId: DayId, minutes = SESSION_STRUCTURE.stretch): CardioSegment[] {
  const upper = dayId === 1 || dayId === 3;
  const base: CardioSegment[] = upper
    ? [
        { kind: 'steady', seconds: 60, label: 'إطالة الصدر', hint: '30 ثانية لكل جهة: الذراع على قائم/جدار وافتح صدرك بعيدًا عنه تدريجيًا.' },
        { kind: 'steady', seconds: 60, label: 'Cross-body للكتف', hint: '30 ثانية لكل جهة: قرّب الذراع أمام الصدر بلطف.' },
        { kind: 'steady', seconds: 50, label: 'إطالة الترايسبس', hint: '20–30 ثانية لكل جهة: المرفق خلف الرأس واضغط بلطف.' },
        { kind: 'calm', seconds: 30, label: 'Child’s Pose', hint: 'ارجع بالورك للخلف ومد يديك أمامك.' },
        { kind: 'steady', seconds: 100, label: 'كرر الصدر والكتف', hint: 'استخدم الوقت المتبقي لتكرار إطالة الصدر والكتف بهدوء.' },
      ]
    : [
        { kind: 'steady', seconds: 60, label: 'Quad Stretch', hint: '30 ثانية لكل رجل: الكعب نحو المؤخرة مع دفع الحوض قليلًا للأمام.' },
        { kind: 'steady', seconds: 60, label: 'Calf Stretch', hint: '30 ثانية لكل رجل: الكعب الخلفي على الأرض ومل للأمام.' },
        { kind: 'steady', seconds: 60, label: 'Figure 4', hint: '30 ثانية لكل جهة: الكاحل فوق الركبة وقرب الرجلين نحو الصدر.' },
        { kind: 'calm', seconds: 30, label: 'Forward Fold', hint: 'انحنِ من الورك بصورة مريحة دون إجبار نفسك للوصول للأرض.' },
        { kind: 'steady', seconds: 90, label: 'كرر الإطالات', hint: 'كرر بلطف ما تحتاجه من Quad وCalf وFigure 4 في الوقت المتبقي.' },
      ];
  return scaleSegments(base, minutes);
}

export let FIRST_VISIT_NOTE = 'ابدأ بأوزان خفيفة جدًا في أول جلستين بعد الانقطاع، وثبّت الحركة قبل زيادة الوزن.';
export let SAFETY_NOTE = 'ابدأ بأوزان خفيفة، وتوقف عن التمرين عند الشعور بأعراض غير معتادة، واستشر مختصًا عند الحاجة.';
export const WARNINGS: string[] = [
  'ابدأ خفيفًا؛ الألم العضلي الخفيف بعد الجلسات الأولى طبيعي ويزول غالبًا خلال يومين.',
  'لا تحبس نَفَسك: زفير عند الدفع أو الشدّ، وشهيق عند الرجوع.',
  'اشرب ماء أثناء الجلسة وخذ راحة عند الحاجة.',
  'توقّف فورًا عند أي ألم حاد في المفصل أو دوخة أو ألم/ضيق في الصدر، واستشر الطبيب.',
];
export let GENERAL_DISCLAIMER = 'هذه خطة عامة للتوجيه وليست بديلًا عن الطبيب أو مدرّب النادي. راجع المدرّب لضبط الأجهزة وتأكد أن التقنية مريحة لك.';
export const CONTINUE_TIPS: string[] = [
  'ثبّت أيامك: السبت، الأحد، الثلاثاء، الأربعاء.',
  'الجلسة القصيرة أفضل من عدم الذهاب.',
  'تابع تقدمك أسبوعيًا بدل الحكم من يوم واحد.',
  'نم جيدًا واشرب ماءً كافيًا.',
];

export type ShortMinutes = 15 | 25 | 30 | 45;
export interface ShortPreset {
  minutes: ShortMinutes;
  warmup: number;
  cardio: number;
  iron: number;
  stretch: number;
  maxSets: number;
  label: string;
}
export let SHORT_PRESETS: ShortPreset[] = [
  { minutes: 15, warmup: 3, cardio: 4, iron: 6, stretch: 2, maxSets: 1, label: '15 دقيقة' },
  { minutes: 25, warmup: 4, cardio: 6, iron: 12, stretch: 3, maxSets: 2, label: '25 دقيقة' },
  { minutes: 30, warmup: 5, cardio: 7, iron: 14, stretch: 4, maxSets: 2, label: '30 دقيقة' },
];
export let SHORT_NOTE = 'الجلسة الأصلية 45 دقيقة. النسخة المختصرة تحافظ على ترتيب: إحماء → حديد → كارديو → إطالة.';

export interface ExtraKind {
  id: string;
  title: string;
  desc: string;
  machineIllustration: string;
  minutes: number[];
  defaultMinutes: number;
  note?: string;
}
export const EXTRA_KINDS: ExtraKind[] = [
  { id: 'swim', title: 'سباحة هادئة', desc: 'جسم كامل بدون ضغط على المفاصل', machineIllustration: 'pool', minutes: [15, 30], defaultMinutes: 30, note: 'ابدأ بـ 10–15 دقيقة إن كانت لياقتك قد نزلت.' },
  { id: 'light-cardio', title: 'كارديو خفيف', desc: 'إيقاع هادئ على الجهاز الذي تحبه', machineIllustration: 'elliptical', minutes: [15, 20, 30], defaultMinutes: 20 },
  { id: 'bike', title: 'دراجة', desc: 'إيقاع ثابت ومريح', machineIllustration: 'bike', minutes: [15, 20, 30], defaultMinutes: 20 },
  { id: 'elliptical', title: 'Elliptical', desc: 'حركة انسيابية لطيفة على الركب', machineIllustration: 'elliptical', minutes: [15, 20, 30], defaultMinutes: 20 },
  { id: 'stretch', title: 'إطالة', desc: 'شدّ لطيف لكل عضلات الجسم', machineIllustration: 'stretch', minutes: [10, 15, 20], defaultMinutes: 10 },
  { id: 'mobility', title: 'Mobility', desc: 'حركة مفاصل وتحريك خفيف', machineIllustration: 'mobility', minutes: [10, 15, 20], defaultMinutes: 10 },
  { id: 'recovery', title: 'استشفاء نشط', desc: 'مشي خفيف على المضمار أو حركة هادئة', machineIllustration: 'recovery', minutes: [15, 20, 30], defaultMinutes: 20 },
];
export const EXTRA_BY_ID: Record<string, ExtraKind> = Object.fromEntries(EXTRA_KINDS.map((e) => [e.id, e]));
export const READY_CHECKLIST = ['ماء', 'منشفة', 'سماعات'];
export const DAY_SHORT: Record<DayId, string> = { 1: 'اليوم 1', 2: 'اليوم 2', 3: 'اليوم 3', 4: 'اليوم 4' };

const SHARED_STRUCTURE: SessionStructure = { ...SESSION_STRUCTURE };
const SHARED_DAYS: DayDef[] = DAYS.map((d) => ({ ...d, cardio: { ...d.cardio }, exercises: d.exercises.map((e) => ({ ...e })) }));
const SHARED_PHASES: PhaseDef[] = PHASES.map((p) => ({ ...p }));
const SHARED_SHORT_PRESETS: ShortPreset[] = SHORT_PRESETS.map((p) => ({ ...p }));
const SHARED_SHORT_NOTE = SHORT_NOTE;
const SHARED_INTERVAL_NOTE = INTERVAL_NOTE;
const SHARED_WEIGHT_RULE = WEIGHT_RULE;

function mapDays(days: DayDef[]): Record<DayId, DayDef> {
  return Object.fromEntries(days.map((d) => [d.id, d])) as Record<DayId, DayDef>;
}

/** نفس البرنامج لكلا الحسابين؛ الاختلاف الوحيد هو الاسم/الحساب. */
export function setProgramForEmail(email: string | null | undefined) {
  const e = (email ?? '').trim().toLowerCase();
  const abdul = e === 'amk157662@gmail.com';
  ACTIVE_PROGRAM = {
    key: abdul ? 'abdulsalam' : 'ziyad',
    defaultName: abdul ? 'عبدالسلام' : 'زياد',
    email: abdul ? 'amk157662@gmail.com' : 'z062496@gmail.com',
    weightsFirst: true,
    cardioEmbeddedWarmup: false,
  };
  SESSION_STRUCTURE = { ...SHARED_STRUCTURE };
  DAYS = SHARED_DAYS.map((d) => ({ ...d, cardio: { ...d.cardio }, exercises: d.exercises.map((x) => ({ ...x })) }));
  DAY_BY_ID = mapDays(DAYS);
  PHASES = SHARED_PHASES.map((p) => ({ ...p }));
  SHORT_PRESETS = SHARED_SHORT_PRESETS.map((p) => ({ ...p }));
  SHORT_NOTE = SHARED_SHORT_NOTE;
  INTERVAL_NOTE = SHARED_INTERVAL_NOTE;
  WEIGHT_RULE = SHARED_WEIGHT_RULE;
}

/** أين يُستخدم الجهاز في البرنامج — يشمل جهاز الكارديو الثاني. */
export function machineUsage(id: MachineId): DayId[] {
  return DAYS.filter((d) => cardioStationsForDay(d.id).includes(id) || d.exercises.some((e) => e.machineId === id)).map((d) => d.id);
}

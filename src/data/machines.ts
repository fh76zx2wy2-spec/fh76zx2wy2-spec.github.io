/**
 * دليل الأجهزة — مستخرج حرفيًا من ملف «خطة النادي» (صفحات 5–7).
 * لتعديل جهاز أو إضافة جهاز: عدّل هذا الملف فقط، وستظهر التغييرات في
 * دليل الأجهزة وفي التمرين المباشر معًا.
 */
import type { IllustrationId } from './illustrations.generated';

export type MachineGroup = 'cardio' | 'strength' | 'core' | 'water';

export interface Machine {
  id: MachineId;
  ar: string;
  en: string;
  group: MachineGroup;
  /** فيديو شرح قصير من مدرب رجل — يُفتح داخل 45/4 */
  guideYoutubeId?: string;
  /** بديل داخلي: بحث يوتيوب مخصص للتمرين عندما نريد فيديوهات خاصة بكل بديل */
  guideYoutubeQuery?: string;
  guideYoutubeStartSeconds?: number;
  guideTitle?: string;
  /** العضلات المستهدفة */
  muscles: string;
  /** طريقة الاستخدام (خطوات مختصرة) */
  steps: string[];
  /** تنبيه مهم إن وُجد */
  warn?: string;
  illustration: IllustrationId | string;
  /** كلمات إضافية للبحث في دليل الأجهزة */
  keywords?: string[];
}

export type LegacyMachineId =
  | 'elliptical'
  | 'bike'
  | 'rower'
  | 'stair-climber'
  | 'recumbent-bike'
  | 'warmup-track'
  | 'pool'
  | 'chest-press'
  | 'lat-pulldown'
  | 'seated-row'
  | 'shoulder-press'
  | 'leg-press'
  | 'leg-extension'
  | 'leg-curl'
  | 'calf-raise'
  | 'pec-deck'
  | 'lateral-raise'
  | 'biceps-curl'
  | 'triceps-pushdown'
  | 'plank'
  | 'glute-bridge'
  | 'crunch'
  | 'incline-dumbbell-press'
  | 'walking-lunge'
  | 'face-pull'
  | 'hammer-curl'
  | 'hip-thrust'
  | 'bulgarian-split-squat'
  | 'seated-calf-raise'
  | 'side-plank';

/** مفاتيح الأجهزة قابلة للتوسع من مكتبة البدائل بدون تقييد الواجهة باتحاد ثابت. */
export type MachineId = string;

export const MACHINES: Record<string, Machine> = {
  elliptical: {
    id: 'elliptical',
    ar: 'الأوبتيكال (الإليبتيكال)',
    en: 'Elliptical / Cross Trainer',
    group: 'cardio',
    muscles: 'جسم كامل: الأرجل والذراعان والأكتاف — لطيف على الركب',
    steps: [
      'قف على الدواستين وأمسك المقبضين المتحركين.',
      'ادفع وشدّ بحركة انسيابية كأنك تمشي، وظهرك مستقيم.',
      'ابدأ بمقاومة خفيفة (3–5) وزدها تدريجيًا مع الأسابيع.',
    ],
    warn: 'لا تتّكئ بثقل جسمك على المقابض؛ أبقِ صدرك مرفوعًا.',
    illustration: 'elliptical',
    keywords: ['كارديو', 'اوبتيكال', 'اليبتيكال', 'cross', 'cardio'],
  },
  bike: {
    id: 'bike',
    ar: 'الدراجة الثابتة (السيكل)',
    en: 'Upright / Stationary Bike',
    group: 'cardio',
    muscles: 'الفخذان والمؤخرة والساقان',
    steps: [
      'اضبط الكرسي بحيث تكون ركبتك شبه مفرودة عند أسفل الدواسة.',
      'أمسك المقبضين وظهرك مستقيم وكتفاك مرتخيان.',
      'دُر بإيقاع ثابت 60–80 دورة/دقيقة.',
    ],
    warn: 'إن وجدت دراجة بمسند ظهر (Recumbent) فهي أريح للمبتدئ.',
    illustration: 'bike',
    keywords: ['كارديو', 'سيكل', 'دراجة', 'bike', 'cycle', 'cardio'],
  },
  pool: {
    id: 'pool',
    ar: 'المسبح',
    en: 'Swimming Pool',
    group: 'water',
    muscles: 'جسم كامل بدون ضغط على المفاصل',
    steps: [
      '30 دقيقة سباحة هادئة أو مشي في الماء.',
      'يمكن أن يحل محل جلسة كارديو، أو يكون يوم راحة نشطًا (اختياري).',
    ],
    warn: 'ابدأ بـ 10–15 دقيقة إن كانت لياقتك قد نزلت.',
    illustration: 'pool',
    keywords: ['سباحة', 'مسبح', 'swim', 'pool'],
  },
  'chest-press': {
    id: 'chest-press',
    ar: 'ضغط الصدر',
    en: 'Chest Press',
    group: 'strength',
    guideYoutubeId: 'xUm0BiZCWlQ',
    guideTitle: 'طريقة استعمال جهاز ضغط الصدر',
    muscles: 'الصدر، مقدمة الكتف، الترايسبس',
    steps: [
      'اضبط الكرسي لتكون المقابض بمستوى منتصف صدرك.',
      'ادفع للأمام حتى تكاد تفرد ذراعيك دون قفل المرفقين.',
      'ارجع ببطء (نحو ثانيتين).',
    ],
    warn: 'ظهرك ملتصق بالمسند وكتفاك للخلف.',
    illustration: 'chest-press',
    keywords: ['صدر', 'chest', 'press'],
  },
  'lat-pulldown': {
    id: 'lat-pulldown',
    ar: 'السحب الأمامي (لات)',
    en: 'Lat Pulldown',
    group: 'strength',
    guideYoutubeId: 'CAwf7n6Luuc',
    guideTitle: 'طريقة أداء السحب العلوي',
    muscles: 'الظهر (الأجنحة) والبايسبس',
    steps: [
      'اجلس وثبّت فخذيك تحت الوسادة.',
      'أمسك البار أوسع قليلًا من الكتفين.',
      'اسحبه إلى أعلى صدرك مع ضمّ لوحي الكتف، ثم ارجع ببطء.',
    ],
    warn: 'لا تسحب خلف الرقبة ولا تتأرجح بجسمك.',
    illustration: 'lat-pulldown',
    keywords: ['ظهر', 'back', 'lat', 'سحب'],
  },
  'seated-row': {
    id: 'seated-row',
    ar: 'السحب الأرضي (تجديف)',
    en: 'Seated Row',
    group: 'strength',
    guideYoutubeId: 'GZbfZ033f74',
    guideTitle: 'طريقة أداء التجديف الجالس',
    muscles: 'منتصف الظهر والبايسبس',
    steps: [
      'صدرك على الوسادة وقدماك على المسند.',
      'اسحب المقبضين نحو بطنك مع ضمّ لوحي الكتف.',
      'ارجع ببطء دون أن تنحني للأمام.',
    ],
    warn: 'أبعد كتفيك عن أذنيك.',
    illustration: 'seated-row',
    keywords: ['ظهر', 'back', 'row', 'سحب', 'تجديف'],
  },
  'shoulder-press': {
    id: 'shoulder-press',
    ar: 'ضغط الأكتاف',
    en: 'Shoulder Press',
    group: 'strength',
    guideYoutubeId: '3R14MnZbcpw',
    guideTitle: 'طريقة أداء ضغط الكتف',
    muscles: 'الأكتاف والترايسبس',
    steps: [
      'اضبط الكرسي لتكون المقابض بمستوى كتفيك.',
      'ادفع للأعلى حتى تفرد ذراعيك تقريبًا.',
      'انزل ببطء إلى مستوى الأذنين.',
    ],
    warn: 'وزن خفيف؛ الأكتاف حساسة. لا تقوّس أسفل ظهرك.',
    illustration: 'shoulder-press',
    keywords: ['كتف', 'اكتاف', 'shoulder', 'press'],
  },
  'leg-press': {
    id: 'leg-press',
    ar: 'ضغط الأرجل (ليج برس)',
    en: 'Leg Press',
    group: 'strength',
    guideYoutubeId: 'oujca3_Shgw',
    guideTitle: 'طريقة استعمال جهاز ضغط الأرجل',
    muscles: 'الفخذ الأمامي والخلفي والمؤخرة',
    steps: [
      'ظهرك وحوضك ملتصقان بالمسند وقدماك على المنصة بعرض الكتفين.',
      'ادفع المنصة حتى تكاد تفرد ركبتيك دون قفلهما.',
      'ارجع ببطء.',
    ],
    warn: 'ركبتاك باتجاه أصابع قدميك ولا يرتفع حوضك عن الكرسي.',
    illustration: 'leg-press',
    keywords: ['رجل', 'ارجل', 'فخذ', 'leg', 'press'],
  },
  'leg-extension': {
    id: 'leg-extension',
    ar: 'الرفرفة الأمامية للأرجل',
    en: 'Leg Extension',
    group: 'strength',
    guideYoutubeId: 'YyvSfVjQeL0',
    guideTitle: 'طريقة استعمال جهاز تمديد الأرجل',
    muscles: 'الفخذ الأمامي',
    steps: [
      'ضع الوسادة فوق كاحليك وظهرك على المسند.',
      'افرد الساقين للأمام واثبت لحظة.',
      'انزل ببطء.',
    ],
    warn: 'وزن خفيف إلى متوسط، بدون تأرجح.',
    illustration: 'leg-extension',
    keywords: ['رجل', 'ارجل', 'فخذ', 'leg', 'extension', 'رفرفة'],
  },
  'leg-curl': {
    id: 'leg-curl',
    ar: 'الأرجل الخلفية (ليج كيرل)',
    en: 'Seated Leg Curl',
    group: 'strength',
    guideYoutubeId: 'ELOCsoDSmrg',
    guideTitle: 'طريقة استعمال جهاز ثني الأرجل',
    muscles: 'الفخذ الخلفي',
    steps: [
      'ثبّت الوسادة العلوية فوق فخذيك.',
      'اسحب الرولر بكعبيك نحو الأسفل والخلف.',
      'ارجع ببطء دون ترك الوزن يسقط.',
    ],
    warn: 'أبقِ ظهرك ملتصقًا بالمسند.',
    illustration: 'leg-curl',
    keywords: ['رجل', 'ارجل', 'فخذ', 'خلفي', 'leg', 'curl'],
  },
  'calf-raise': {
    id: 'calf-raise',
    ar: 'رفع السمانة',
    en: 'Calf Raise',
    group: 'strength',
    guideYoutubeId: 'ORT4oJ_R8Qs',
    guideTitle: 'طريقة أداء رفع السمانة',
    muscles: 'عضلة السمانة (ربلة الساق)',
    steps: [
      'قف على حافة درجة أو استخدم منصة جهاز ضغط الأرجل، واجعل الكعبين حرّين للحركة.',
      'ارفع كعبيك لأعلى ما تستطيع واثبت لحظة.',
      'انزل ببطء حتى تشعر بتمدد خفيف في السمانة.',
    ],
    warn: 'أمسك دعامة للتوازن، وخفّف الوزن إذا اهتز جسمك.',
    illustration: 'calf-raise',
    keywords: ['سمانة', 'ربلة', 'calf', 'raise', 'ساق'],
  },
  'pec-deck': {
    id: 'pec-deck',
    ar: 'الفراشة (بك ديك)',
    en: 'Pec Deck / Chest Fly',
    group: 'strength',
    guideYoutubeId: 'aXDG2-Fy2Bg',
    guideTitle: 'طريقة استعمال جهاز الفراشة',
    muscles: 'الصدر ومقدمة الكتف',
    steps: [
      'ضع ساعديك على الوسادتين ومرفقاك بمستوى الكتفين.',
      'قرّب الذراعين أمام صدرك كأنك تحتضن شيئًا.',
      'افتح ببطء.',
    ],
    warn: 'لا تفتح الذراعين أبعد من خط الكتفين.',
    illustration: 'pec-deck',
    keywords: ['صدر', 'chest', 'fly', 'pec', 'deck', 'فراشة'],
  },
  'lateral-raise': {
    id: 'lateral-raise',
    ar: 'رفرفة جانبية بالدمبل',
    en: 'Dumbbell Lateral Raise',
    group: 'strength',
    guideYoutubeId: '3VcKaXpzqRo',
    guideTitle: 'طريقة أداء الرفع الجانبي',
    muscles: 'الجزء الجانبي من الكتف',
    steps: [
      'دمبل خفيف (2–5 كجم) في كل يد والمرفقان مثنيان قليلًا.',
      'ارفع الذراعين للجانبين حتى مستوى الكتفين.',
      'انزل ببطء.',
    ],
    warn: 'لا ترفع كتفيك نحو أذنيك ولا تتمايل بجسمك.',
    illustration: 'lateral-raise',
    keywords: ['كتف', 'اكتاف', 'دمبل', 'dumbbell', 'lateral', 'raise'],
  },
  'biceps-curl': {
    id: 'biceps-curl',
    ar: 'بايسبس بالدمبل',
    en: 'Dumbbell Biceps Curl',
    group: 'strength',
    guideYoutubeId: 'sAq_ocpRh_I',
    guideTitle: 'طريقة أداء تمرين البايسبس',
    muscles: 'الجزء الأمامي من الذراع',
    steps: [
      'قف والمرفقان ملتصقان بجانبك.',
      'ارفع الدمبل نحو كتفك.',
      'انزل ببطء ثانيتين.',
    ],
    warn: 'لا تأرجح ظهرك لرفع الوزن.',
    illustration: 'biceps-curl',
    keywords: ['ذراع', 'دمبل', 'بايسبس', 'biceps', 'curl', 'dumbbell'],
  },
  'triceps-pushdown': {
    id: 'triceps-pushdown',
    ar: 'ترايسبس بالكيبل',
    en: 'Cable Triceps Pushdown',
    group: 'strength',
    guideYoutubeId: '_w-HpW70nSQ',
    guideTitle: 'طريقة أداء دفع الترايسبس',
    muscles: 'الجزء الخلفي من الذراع',
    steps: [
      'قف أمام البكرة العلوية وأمسك البار والمرفقان بجنبك.',
      'ادفع لأسفل حتى تفرد ذراعيك.',
      'ارجع ببطء إلى مستوى الصدر.',
    ],
    warn: 'مرفقاك ثابتان لا يتحركان.',
    illustration: 'triceps-pushdown',
    keywords: ['ذراع', 'ترايسبس', 'كيبل', 'triceps', 'cable', 'pushdown'],
  },
  plank: {
    id: 'plank',
    ar: 'بلانك (البطن)',
    en: 'Plank',
    group: 'core',
    guideYoutubeId: 'fqzUlmyTpJk',
    guideTitle: 'طريقة أداء البلانك',
    muscles: 'البطن والظهر والكتفان',
    steps: [
      'استند على ساعديك ومرفقاك تحت كتفيك.',
      'جسمك خط مستقيم من الرأس إلى الكعبين.',
      'اثبت 20–30 ثانية وتنفّس طبيعيًا.',
    ],
    warn: 'صعب؟ نفّذه من الركبتين.',
    illustration: 'plank',
    keywords: ['بطن', 'abs', 'core', 'plank', 'بلانك'],
  },
  'glute-bridge': {
    id: 'glute-bridge',
    ar: 'جسر الحوض',
    en: 'Glute Bridge',
    group: 'core',
    guideYoutubeId: '8bbE64NuDTU',
    guideTitle: 'طريقة أداء Glute Bridge',
    muscles: 'المؤخرة والفخذ الخلفي',
    steps: [
      'استلقِ على ظهرك وركبتاك مثنيتان وقدماك على الأرض.',
      'ارفع الحوض حتى يصير جسمك خطًا من الكتف إلى الركبة.',
      'اثبت ثانيتين ثم انزل.',
    ],
    warn: 'اعصر عضلات المؤخرة في الأعلى.',
    illustration: 'glute-bridge',
    keywords: ['مؤخرة', 'حوض', 'glute', 'bridge', 'جسر'],
  },
  crunch: {
    id: 'crunch',
    ar: 'كرنش البطن',
    en: 'Crunch',
    group: 'core',
    guideYoutubeId: 'NIqgTCTd2MM',
    guideTitle: 'طريقة أداء الكرنش',
    muscles: 'عضلات البطن',
    steps: [
      'استلقِ وركبتاك مثنيتان ويداك بجانب أذنيك.',
      'ارفع كتفيك قليلًا عن الأرض بتقلّص البطن.',
      'انزل ببطء.',
    ],
    warn: 'الحركة صغيرة؛ لا تشدّ رقبتك بيديك.',
    illustration: 'crunch',
    keywords: ['بطن', 'abs', 'core', 'crunch', 'كرنش'],
  },
  rower: {
    id: 'rower', ar: 'جهاز التجديف', en: 'Rowing Machine', group: 'cardio',
    muscles: 'جسم كامل: الأرجل والجذع والظهر والذراعان',
    steps: ['ثبّت القدمين وابدأ والركبتان مثنيتان والذراعان ممدودتان.', 'ادفع أولًا بالرجلين مع ظهر متزن، ثم افتح الجذع قليلًا واسحب المقبض.', 'في الرجوع: مد الذراعين أولًا، ثم الجذع، ثم اثن الركبتين.'],
    warn: 'لا تبدأ السحبة بالذراعين ولا تدوّر أسفل ظهرك.', illustration: 'rower', keywords: ['تجديف','rower','rowing','كارديو'],
  },
  'stair-climber': {
    id: 'stair-climber', ar: 'جهاز الدرج', en: 'Stair Climber', group: 'cardio',
    muscles: 'الفخذان والمؤخرة والساقان',
    steps: ['اصعد بثبات وأبقِ صدرك مرفوعًا.', 'استخدم المقابض للتوازن فقط، لا لتحميل وزن جسمك.', 'اختر سرعة تسمح بخطوات منتظمة ومريحة.'],
    warn: 'خفّف السرعة إذا بدأت تتكئ على المقابض.', illustration: 'stair-climber', keywords: ['درج','stairs','stair','climber','كارديو'],
  },
  'recumbent-bike': {
    id: 'recumbent-bike', ar: 'دراجة الجلوس ذات الظهر', en: 'Recumbent Bike', group: 'cardio',
    muscles: 'الفخذان والمؤخرة والساقان مع دعم للظهر',
    steps: ['اضبط المقعد بحيث تبقى الركبة مثنية قليلًا عند أبعد نقطة للدواسة.', 'ألصق ظهرك بالمسند وأبقِ القدمين مثبتتين.', 'ابدأ بمقاومة خفيفة ثم حافظ على دوران متوسط ومريح.'],
    warn: 'إذا لم تتوفر في النادي استخدم الدراجة العادية بنفس المدة.', illustration: 'recumbent-bike', keywords: ['دراجة','جلوس','ظهر','recumbent','bike'],
  },
  'warmup-track': {
    id: 'warmup-track', ar: 'مضمار النادي', en: 'Indoor Track Warm-up', group: 'cardio',
    muscles: 'إحماء عام للجسم قبل الحديد',
    steps: ['4 دقائق مشي سريع على مضمار النادي.', 'دقيقتان: 30 ثانية هرولة خفيفة + 30 ثانية مشي، وتكرر مرتين.', 'الدقيقة الأخيرة حركة ديناميكية تناسب يوم العلوي أو السفلي.'],
    warn: 'لا يوجد سير كهربائي ضمن هذا البرنامج.', illustration: 'warmup-track', keywords: ['مضمار','مشي','هرولة','إحماء','warmup','track'],
  },
  'incline-dumbbell-press': {
    id: 'incline-dumbbell-press', ar: 'ضغط دمبل مائل', en: 'Incline Dumbbell Press', group: 'strength',
    guideYoutubeId: '8iPEnn-ltC8', guideTitle: 'شرح ضغط الدمبل المائل — مدرب رجل',
    muscles: 'أعلى الصدر، مقدمة الكتف، الترايسبس',
    steps: ['اضبط المقعد على ميل مريح واجعل الدمبلين بجانب أعلى الصدر.', 'ادفع للأعلى بتحكم دون اصطدام الدمبلين.', 'انزل ببطء إلى مستوى مريح ولا تقوّس أسفل ظهرك.'],
    warn: 'اختر وزنًا يسمح لك بإبقاء الظهر ثابتًا على المقعد.', illustration: 'incline-dumbbell-press', keywords: ['صدر','مائل','دمبل','incline','dumbbell','press'],
  },
  'walking-lunge': {
    id: 'walking-lunge', ar: 'لانجز مشي', en: 'Walking Lunge', group: 'strength',
    guideYoutubeId: 'COKYKgQ8KR0', guideTitle: 'شرح اللانجز — المدرب Max Tapper',
    muscles: 'الفخذ الأمامي والخلفي والمؤخرة والتوازن',
    steps: ['ابدأ بدون وزن في أول أسبوعين وخذ خطوة للأمام بمسافة مريحة.', 'انزل بثني الركبتين مع صدر مرفوع وتوازن ثابت.', 'ادفع بكامل القدم الأمامية وتقدم بالرجل الأخرى.'],
    warn: 'ابدأ بوزن الجسم فقط حتى تثبت الحركة والتوازن.', illustration: 'walking-lunge', keywords: ['لانجز','اندفاع','مشي','lunge','walking'],
  },
  'face-pull': {
    id: 'face-pull', ar: 'فيس بول بالحبل', en: 'Face Pull', group: 'strength',
    guideYoutubeId: 'rep-qVOkqgk', guideTitle: 'شرح Face Pull — Scott Herman',
    muscles: 'الكتف الخلفي وأعلى الظهر',
    steps: ['ضع الحبل تقريبًا عند مستوى الوجه.', 'اسحب نحو الوجه مع خروج المرفقين لأعلى وللخارج.', 'فرّق طرفي الحبل وارجع بتحكم.'],
    warn: 'استخدم وزنًا خفيفًا يمكنك التحكم به دون تأرجح.', illustration: 'face-pull', keywords: ['فيس','بول','حبل','كتف','face','pull'],
  },
  'hammer-curl': {
    id: 'hammer-curl', ar: 'هامر كيرل', en: 'Hammer Curl', group: 'strength',
    guideYoutubeId: '8XLxfXROrTo', guideTitle: 'شرح Hammer Curl — Scott Herman',
    muscles: 'البايسبس والعضلة العضدية والساعد',
    steps: ['أمسك الدمبلين والكفان مواجهتان لبعضهما.', 'ثبّت المرفقين بجانب الجسم وارفع الدمبلين بثني المرفق.', 'انزل ببطء دون تأرجح بالجذع.'],
    warn: 'إذا احتجت للتمايل فالوزن أثقل من اللازم.', illustration: 'hammer-curl', keywords: ['هامر','كيرل','بايسبس','hammer','curl'],
  },
  'hip-thrust': {
    id: 'hip-thrust', ar: 'هيب ثرست', en: 'Hip Thrust', group: 'strength',
    guideYoutubeId: 'SEdqd1n0cvg', guideTitle: 'شرح Hip Thrust — Scott Herman',
    muscles: 'المؤخرة والفخذ الخلفي',
    steps: ['ثبت أعلى ظهرك على المقعد أو استخدم الجهاز إن كان موجودًا.', 'ثبت القدمين وارفع الحوض بشد عضلات المؤخرة.', 'توقف في الأعلى دون المبالغة في تقويس أسفل الظهر ثم انزل بتحكم.'],
    warn: 'ابدأ بوزن الجسم أو وزن خفيف حتى تتقن الوضعية.', illustration: 'hip-thrust', keywords: ['مؤخرة','حوض','هيب','ثرست','hip','thrust'],
  },
  'bulgarian-split-squat': {
    id: 'bulgarian-split-squat', ar: 'بلغاريان سبليت سكوات', en: 'Bulgarian Split Squat', group: 'strength',
    guideYoutubeId: '2C-uNgKwPLE', guideTitle: 'شرح Bulgarian Split Squat — Scott Herman',
    muscles: 'الفخذ الأمامي والمؤخرة والتوازن',
    steps: ['ضع القدم الخلفية على بنش منخفض والأمامية أمامك بمسافة مريحة.', 'انزل بالجسم بتحكم مع بقاء القدم الأمامية ثابتة.', 'ادفع بالرجل الأمامية للعودة للأعلى.'],
    warn: 'ابدأ بوزن الجسم فقط، واستخدم دعامة للتوازن عند الحاجة.', illustration: 'bulgarian-split-squat', keywords: ['بلغاري','سكوات','split','squat','bulgarian'],
  },
  'seated-calf-raise': {
    id: 'seated-calf-raise', ar: 'رفع السمانة جالسًا', en: 'Seated Calf Raise', group: 'strength',
    guideYoutubeId: 'BKa5yq0Q0-c', guideYoutubeStartSeconds: 162, guideTitle: 'شرح Seated Calf Raise — Scott Herman (يبدأ عند 2:42)',
    muscles: 'السمانة، خصوصًا عضلة soleus',
    steps: ['اجلس وثبت القدمين بحيث تكون مقدمة القدم على المنصة والكعبان حران.', 'ارفع الكعبين للأعلى وتوقف لحظة.', 'انزل ببطء حتى تشعر بتمدد خفيف.'],
    warn: 'الحركة من الكاحل فقط؛ لا تنط بالوزن.', illustration: 'seated-calf-raise', keywords: ['سمانة','جالس','calf','seated','raise'],
  },
  'side-plank': {
    id: 'side-plank', ar: 'بلانك جانبي', en: 'Side Plank', group: 'core',
    guideYoutubeId: 'NXr4Fw8q60o', guideTitle: 'شرح Side Plank — مدرب رجل',
    muscles: 'الجذع الجانبي والكتف والورك',
    steps: ['استند على ساعد واحد واجعل المرفق تحت الكتف.', 'ارفع الحوض حتى يصبح الجسم خطًا مستقيمًا.', 'اثبت 30 ثانية ثم بدّل الجهة.'],
    warn: 'خفف التمرين بثني الركبة السفلية إذا كان صعبًا.', illustration: 'side-plank', keywords: ['بلانك','جانبي','side','plank','core'],
  },

};



/**
 * مكتبة 45/4 الموسّعة: بدائل منتقاة حسب نمط الحركة.
 * بعض الرسومات/الفيديوهات تُعاد لنفس عائلة الحركة حتى يبقى الموقع خفيفًا وواضحًا.
 */
const variant = (
  id: string,
  ar: string,
  en: string,
  muscles: string,
  illustration: IllustrationId | string,
  guideYoutubeId: string,
  guideTitle: string,
  steps: string[],
  warn: string,
  keywords: string[] = [],
): Machine => ({ id, ar, en, group: 'strength', muscles, illustration: id, guideYoutubeQuery: `${en} correct technique male coach tutorial`, guideTitle: `شرح ${ar} — تعليمات خاصة بالتمرين`, steps, warn, keywords });

Object.assign(MACHINES, {
  // الصدر — دفع أفقي
  'plate-loaded-chest-press': variant('plate-loaded-chest-press','ضغط صدر Plate Loaded','Plate Loaded Chest Press','الصدر، مقدمة الكتف، الترايسبس','chest-press','xUm0BiZCWlQ','شرح نمط ضغط الصدر — مدرب رجل',['اضبط المقعد لتكون المقابض بمستوى منتصف الصدر.','ثبّت لوحي الكتف للخلف وادفع المقابض للأمام.','ارجع ببطء حتى تمدد مريح دون رفع الكتفين.'],'ابدأ بأقراص قليلة لأن مقاومة الجهاز قد تختلف عن الأجهزة الأخرى.',['صدر','plate loaded']),
  'converging-chest-press': variant('converging-chest-press','ضغط صدر متقارب','Converging Chest Press','الصدر، مقدمة الكتف، الترايسبس','chest-press','xUm0BiZCWlQ','شرح نمط ضغط الصدر — مدرب رجل',['اضبط المقعد بحيث تبدأ اليدان بمحاذاة الصدر.','ادفع المسارين المتقاربين للأمام مع إبقاء الصدر مرفوعًا.','تحكم في الرجوع ولا تدع الوزن يرتطم.'],'لا تبالغ في تقريب الكتفين للأمام في نهاية الدفع.',['صدر','converging']),
  'smith-bench-press': variant('smith-bench-press','بنش برس على السميث','Smith Machine Bench Press','الصدر، الترايسبس، مقدمة الكتف','chest-press','xUm0BiZCWlQ','شرح حركة ضغط الصدر — مدرب رجل',['ضع البنش بحيث ينزل البار إلى منتصف الصدر.','اسحب الكتفين للخلف وثبّت القدمين.','انزل بتحكم ثم ادفع للأعلى دون قفل المرفقين.'],'تأكد من أقفال الأمان وابدأ بوزن محافظ.',['صدر','سميث','smith']),
  'dumbbell-bench-press': variant('dumbbell-bench-press','ضغط صدر دمبل مستوٍ','Flat Dumbbell Bench Press','الصدر، الترايسبس، مقدمة الكتف','incline-dumbbell-press','8iPEnn-ltC8','شرح ضغط الدمبل — مدرب رجل',['استلقِ على بنش مستوٍ والدمبلان بجانب الصدر.','ادفع للأعلى بمسار ثابت حتى تقارب الذراعان الاستقامة.','انزل ببطء إلى عمق مريح.'],'اختر وزنًا يمكنك التحكم به عند رفعه وإنزاله من البنش.',['صدر','دمبل','bench']),
  'cable-chest-press': variant('cable-chest-press','ضغط صدر بالكيبل','Cable Chest Press','الصدر، الترايسبس، مقدمة الكتف','chest-press','xUm0BiZCWlQ','شرح نمط ضغط الصدر — مدرب رجل',['ضع البكرتين خلفك بمستوى الصدر.','خذ وقفة ثابتة وادفع المقبضين للأمام.','ارجع ببطء مع بقاء الجذع ثابتًا.'],'لا تسمح للكيبل بسحب كتفيك للخلف بعنف.',['صدر','كيبل','cable']),
  'machine-chest-press-neutral': variant('machine-chest-press-neutral','ضغط صدر قبضة محايدة','Neutral-Grip Chest Press','الصدر والترايسبس مع راحة أكبر للكتف','chest-press','xUm0BiZCWlQ','شرح جهاز ضغط الصدر — مدرب رجل',['اختر القبضة المحايدة إن كانت متاحة.','أبقِ المرفقين أقرب للجسم قليلًا وادفع للأمام.','ارجع بتحكم حتى وضع البداية.'],'إذا شعرت بألم في الكتف خفف الوزن أو اختر جهازًا آخر.',['صدر','قبضة محايدة']),

  // أعلى الصدر — دفع مائل
  'incline-machine-press': variant('incline-machine-press','ضغط صدر مائل جهاز','Incline Chest Press Machine','أعلى الصدر، مقدمة الكتف، الترايسبس','incline-dumbbell-press','8iPEnn-ltC8','شرح الضغط المائل — مدرب رجل',['اضبط المقعد لتكون المقابض عند أعلى الصدر.','ادفع لأعلى وأمام بمسار الجهاز.','ارجع ببطء دون أن ترتفع كتفاك.'],'لا تجعل الميل عاليًا جدًا حتى لا يتحول التمرين إلى كتف.',['صدر','مائل','جهاز']),
  'incline-smith-press': variant('incline-smith-press','ضغط مائل على السميث','Incline Smith Press','أعلى الصدر والترايسبس','incline-dumbbell-press','8iPEnn-ltC8','شرح الضغط المائل — مدرب رجل',['اضبط البنش بزاوية خفيفة تحت السميث.','اجعل البار ينزل أعلى الصدر.','ادفع للأعلى مع ثبات القدمين والكتفين.'],'استخدم أقفال الأمان ولا تنزل البار لعمق مؤلم.',['صدر','مائل','smith']),
  'incline-plate-loaded-press': variant('incline-plate-loaded-press','ضغط مائل Plate Loaded','Incline Plate Loaded Press','أعلى الصدر، الترايسبس، مقدمة الكتف','incline-dumbbell-press','8iPEnn-ltC8','شرح الضغط المائل — مدرب رجل',['اضبط المقعد لتناسب المقابض أعلى صدرك.','ادفع الذراعين للأعلى والأمام دون ارتداد.','ارجع ببطء حتى تمدد مريح.'],'ابدأ بأوزان صغيرة لمعرفة مقاومة الجهاز.',['صدر','مائل','plate loaded']),
  'incline-cable-press': variant('incline-cable-press','ضغط مائل بالكيبل','Incline Cable Press','أعلى الصدر، الترايسبس','incline-dumbbell-press','8iPEnn-ltC8','شرح الضغط المائل — مدرب رجل',['اضبط البنش بين بكرتين منخفضتين.','ابدأ بالمقابض قرب أعلى الصدر وادفع قطريًا للأعلى.','حافظ على الجذع ثابتًا والرجوع بطيئًا.'],'استخدم وزنًا خفيفًا حتى تثبت مسار الكيبل.',['صدر','مائل','كيبل']),
  'low-incline-dumbbell-press': variant('low-incline-dumbbell-press','ضغط دمبل ميل خفيف','Low-Incline Dumbbell Press','أعلى ووسط الصدر، الترايسبس','incline-dumbbell-press','8iPEnn-ltC8','شرح ضغط الدمبل المائل — مدرب رجل',['اجعل ميل البنش خفيفًا.','ابدأ بالدمبلين بجانب أعلى الصدر.','ادفع للأعلى ثم انزل ببطء.'],'لا تقوّس أسفل الظهر بحثًا عن تكرار إضافي.',['صدر','مائل','دمبل']),

  // السحب الرأسي للظهر
  'neutral-grip-pulldown': variant('neutral-grip-pulldown','سحب لات قبضة محايدة','Neutral-Grip Lat Pulldown','الأجنحة والبايسبس','lat-pulldown','CAwf7n6Luuc','شرح السحب العلوي — مدرب رجل',['ثبت الفخذين تحت الوسادة وأمسك المقابض المتوازية.','اسحب نحو أعلى الصدر مع إنزال الكتفين.','ارجع ببطء حتى تمد الذراعين.'],'لا تحوّل الحركة إلى سحب بالجذع للخلف.',['ظهر','لات','محايد']),
  'close-grip-pulldown': variant('close-grip-pulldown','سحب لات قبضة ضيقة','Close-Grip Lat Pulldown','الأجنحة والبايسبس','lat-pulldown','CAwf7n6Luuc','شرح السحب العلوي — مدرب رجل',['استخدم مقبضًا ضيقًا أو V-bar.','اسحب المقبض إلى أعلى الصدر مع صدر مرفوع.','مد الذراعين ببطء في الرجوع.'],'لا ترفع الكتفين نحو الأذنين.',['ظهر','لات','ضيقة']),
  'single-arm-pulldown': variant('single-arm-pulldown','سحب لات يد واحدة','Single-Arm Lat Pulldown','الأجنحة والبايسبس','lat-pulldown','CAwf7n6Luuc','شرح نمط السحب العلوي — مدرب رجل',['استخدم مقبضًا منفردًا من البكرة العليا.','اسحب المرفق إلى أسفل وجانب الجذع.','ارجع حتى تمدد مريح ثم بدّل الجهة.'],'لا تلف الجذع أثناء السحب.',['ظهر','لات','يد واحدة']),
  'assisted-pullup': variant('assisted-pullup','عقلة بمساعدة','Assisted Pull-Up','الأجنحة، أعلى الظهر، البايسبس','lat-pulldown','CAwf7n6Luuc','شرح نمط السحب الرأسي — مدرب رجل',['اختر مقدار مساعدة مناسبًا وثبت الركبتين/القدمين على منصة الجهاز.','ابدأ والكتفان منخفضان ثم اسحب صدرك نحو المقابض.','انزل ببطء حتى تمدد الذراعين.'],'كلما زاد رقم المساعدة صار التمرين أسهل في أغلب الأجهزة.',['ظهر','عقلة','assisted']),
  'plate-loaded-high-row': variant('plate-loaded-high-row','High Row Plate Loaded','Plate Loaded High Row','الأجنحة وأعلى الظهر والبايسبس','lat-pulldown','CAwf7n6Luuc','شرح نمط السحب للظهر — مدرب رجل',['اضبط المقعد وثبّت الصدر إن كان للجهاز مسند.','اسحب المقابض من أعلى باتجاه أضلاعك.','ارجع ببطء مع تحكم كامل.'],'لا تجعل أسفل الظهر يتحمل الحركة.',['ظهر','high row','plate loaded']),
  'machine-pullover': variant('machine-pullover','جهاز Pullover للات','Lat Pullover Machine','الأجنحة والعضلة المدورة الكبيرة','lat-pulldown','CAwf7n6Luuc','شرح استهداف عضلات اللات — مدرب رجل',['ثبت ظهرك وصدرَك على الجهاز.','ادفع/اسحب الذراعين من فوق الرأس إلى أسفل باتجاه الجذع.','ارجع ببطء حتى تمدد مريح.'],'المرفقان شبه ثابتين؛ لا تحوّلها إلى ترايسبس.',['ظهر','pullover','لات']),

  // السحب الأفقي للظهر
  'chest-supported-row': variant('chest-supported-row','تجديف بمسند صدر','Chest-Supported Row','منتصف الظهر، اللات، البايسبس','seated-row','GZbfZ033f74','شرح التجديف الجالس — مدرب رجل',['اضبط المقعد والصدر ملاصق للمسند.','اسحب المقابض نحو أسفل الأضلاع مع ضم لوحي الكتف.','ارجع ببطء دون فقدان وضع الصدر.'],'لا ترفع كتفيك نحو الأذنين.',['ظهر','row','مسند صدر']),
  'cable-row-neutral': variant('cable-row-neutral','تجديف كيبل قبضة محايدة','Neutral Cable Row','منتصف الظهر والبايسبس','seated-row','GZbfZ033f74','شرح التجديف الجالس — مدرب رجل',['اجلس بظهر محايد وأمسك مقبض V.','اسحب نحو السرة/أسفل الأضلاع.','مد الذراعين ببطء دون تقويس الظهر.'],'لا تستخدم التأرجح لكسب التكرار.',['ظهر','كيبل','row']),
  'plate-loaded-row': variant('plate-loaded-row','تجديف Plate Loaded','Plate Loaded Row','منتصف الظهر واللات والبايسبس','seated-row','GZbfZ033f74','شرح نمط التجديف — مدرب رجل',['ثبت الصدر أو الجذع حسب تصميم الجهاز.','اسحب الذراعين للخلف باتجاه الأضلاع.','ارجع ببطء حتى تمدد الكتفين دون انهيار الوضعية.'],'ابدأ بأقراص قليلة لمعرفة مقاومة الجهاز.',['ظهر','row','plate loaded']),
  'one-arm-dumbbell-row': variant('one-arm-dumbbell-row','تجديف دمبل يد واحدة','One-Arm Dumbbell Row','اللات ومنتصف الظهر والبايسبس','seated-row','GZbfZ033f74','شرح نمط التجديف — مدرب رجل',['اسند يدًا وركبة على البنش وثبت الظهر.','اسحب الدمبل باتجاه الورك لا باتجاه الكتف.','انزل ببطء ثم بدّل الجهة.'],'لا تلف الجذع أثناء الرفع.',['ظهر','دمبل','row']),
  'single-arm-cable-row': variant('single-arm-cable-row','تجديف كيبل يد واحدة','Single-Arm Cable Row','منتصف الظهر واللات','seated-row','GZbfZ033f74','شرح نمط التجديف — مدرب رجل',['اجلس/قف بثبات أمام بكرة أفقية.','اسحب المرفق للخلف بمحاذاة الجذع.','ارجع ببطء دون دوران الجسم.'],'ثبت الحوض والجذع.',['ظهر','كيبل','يد واحدة']),
  'tbar-row-machine': variant('tbar-row-machine','تجديف T-Bar جهاز','T-Bar Row Machine','منتصف الظهر واللات والبايسبس','seated-row','GZbfZ033f74','شرح نمط التجديف — مدرب رجل',['ثبت صدرك على الوسادة إن وجدت.','اسحب المقابض نحو أسفل الصدر.','ارجع ببطء مع بقاء الرقبة محايدة.'],'لا ترفع الصدر عن المسند لرفع وزن أكبر.',['ظهر','t-bar','row']),

  // الكتف — دفع رأسي
  'seated-dumbbell-shoulder-press': variant('seated-dumbbell-shoulder-press','ضغط كتف دمبل جالس','Seated Dumbbell Shoulder Press','الأكتاف والترايسبس','shoulder-press','3R14MnZbcpw','شرح ضغط الكتف — مدرب رجل',['اجلس بمسند ظهر والدمبلان عند مستوى الأذن.','ادفع للأعلى دون اصطدام الدمبلين.','انزل بتحكم إلى مستوى مريح.'],'لا تقوّس أسفل الظهر.',['كتف','دمبل','press']),
  'smith-shoulder-press': variant('smith-shoulder-press','ضغط كتف سميث','Smith Shoulder Press','الأكتاف والترايسبس','shoulder-press','3R14MnZbcpw','شرح ضغط الكتف — مدرب رجل',['ضع بنش بظهر مستقيم تقريبًا تحت السميث.','انزل البار أمام الوجه إلى مستوى مناسب.','ادفع للأعلى مع ثبات الجذع.'],'استخدم أقفال الأمان ووزنًا محافظًا.',['كتف','smith']),
  'plate-loaded-shoulder-press': variant('plate-loaded-shoulder-press','ضغط كتف Plate Loaded','Plate Loaded Shoulder Press','الأكتاف والترايسبس','shoulder-press','3R14MnZbcpw','شرح ضغط الكتف — مدرب رجل',['اضبط المقعد لتبدأ المقابض قرب مستوى الكتف.','ادفع للأعلى مع إبقاء الرأس والصدر ثابتين.','ارجع ببطء.'],'لا تنزل أعمق من مدى كتفك المريح.',['كتف','plate loaded']),
  'arnold-press': variant('arnold-press','أرنولد برس دمبل','Arnold Press','الأكتاف والترايسبس','shoulder-press','3R14MnZbcpw','شرح نمط ضغط الكتف — مدرب رجل',['ابدأ بالدمبلين أمام الكتفين والكفان باتجاهك.','افتح الذراعين أثناء الدفع للأعلى.','اعكس الحركة ببطء في النزول.'],'استخدم وزنًا أخف من ضغط الكتف العادي.',['كتف','arnold']),
  'single-arm-cable-shoulder-press': variant('single-arm-cable-shoulder-press','ضغط كتف كيبل يد واحدة','Single-Arm Cable Shoulder Press','الكتف والترايسبس والجذع','shoulder-press','3R14MnZbcpw','شرح نمط ضغط الكتف — مدرب رجل',['ضع البكرة منخفضة وأمسك المقبض عند الكتف.','ثبت الجذع وادفع للأعلى بيد واحدة.','ارجع ببطء ثم بدّل الجهة.'],'لا تمِل بالجذع لتعويض الوزن.',['كتف','كيبل']),
  'landmine-press': variant('landmine-press','لاندماين برس','Landmine Press','الكتف العلوي والصدر العلوي والترايسبس','shoulder-press','3R14MnZbcpw','شرح نمط دفع الكتف — مدرب رجل',['ثبت طرف البار في landmine أو زاوية مخصصة.','أمسك الطرف عند الكتف وادفع قطريًا للأعلى.','ارجع بتحكم ثم بدّل الجهة.'],'استخدمه كبديل مريح للكتف عند توفر محطة مخصصة.',['كتف','landmine']),

  // الكتف الخلفي
  'reverse-pec-deck': variant('reverse-pec-deck','فراشة عكسية للكتف الخلفي','Reverse Pec Deck','الكتف الخلفي وأعلى الظهر','face-pull','rep-qVOkqgk','شرح استهداف الكتف الخلفي — مدرب رجل',['اجلس مواجهًا للمسند واضبط المقابض.','افتح الذراعين للخلف مع مرفقين لينين.','ارجع ببطء دون ارتطام الأوزان.'],'لا تضم لوحي الكتف بعنف؛ ركّز على الكتف الخلفي.',['كتف خلفي','reverse fly']),
  'rear-delt-cable-fly': variant('rear-delt-cable-fly','رفرفة خلفية بالكيبل','Rear-Delt Cable Fly','الكتف الخلفي وأعلى الظهر','face-pull','rep-qVOkqgk','شرح نمط الكتف الخلفي — مدرب رجل',['استخدم بكرتين متقاطعتين أو مقبضين خفيفين.','افتح الذراعين للخارج والخلف مع ثبات الجذع.','ارجع ببطء.'],'وزن خفيف أفضل من تأرجح ثقيل.',['كتف خلفي','كيبل']),
  'rear-delt-machine': variant('rear-delt-machine','جهاز الكتف الخلفي','Rear Delt Machine','الكتف الخلفي وأعلى الظهر','face-pull','rep-qVOkqgk','شرح الكتف الخلفي — مدرب رجل',['اضبط المقعد بحيث تكون الذراعان عند مستوى الكتف.','ادفع/افتح المقابض للخلف.','ارجع ببطء مع بقاء الكتفين منخفضين.'],'لا ترفع الكتفين نحو الأذنين.',['كتف خلفي','machine']),
  'band-face-pull': variant('band-face-pull','فيس بول بالمطاط','Band Face Pull','الكتف الخلفي وأعلى الظهر','face-pull','rep-qVOkqgk','شرح Face Pull — مدرب رجل',['ثبت المطاط عند مستوى الوجه.','اسحب باتجاه الوجه وافتح اليدين للخارج.','ارجع ببطء مع ثبات الجذع.'],'اختر مقاومة تسمح بتحكم كامل.',['كتف خلفي','band']),
  'incline-rear-delt-raise': variant('incline-rear-delt-raise','رفرفة خلفية على بنش مائل','Incline Rear-Delt Raise','الكتف الخلفي','face-pull','rep-qVOkqgk','شرح نمط الكتف الخلفي — مدرب رجل',['استلقِ بصدرِك على بنش مائل ودمبلان خفيفان.','ارفع الذراعين للجانبين بزاوية مريحة.','انزل ببطء.'],'لا تستخدم أوزانًا تجبرك على تأرجح الذراعين.',['كتف خلفي','دمبل']),
  'rope-face-pull': variant('rope-face-pull','فيس بول كيبل بالحبل','Rope Face Pull','الكتف الخلفي وأعلى الظهر','face-pull','rep-qVOkqgk','شرح Face Pull — Scott Herman',['ثبت الحبل عند مستوى الوجه.','اسحب إلى الوجه مع فتح طرفي الحبل.','ارجع ببطء وحافظ على المرفقين مرتفعين نسبيًا.'],'استخدم وزنًا خفيفًا إلى متوسط.',['كتف خلفي','rope']),

  // البايسبس
  'preacher-curl-machine': variant('preacher-curl-machine','جهاز بريتشر بايسبس','Preacher Curl Machine','البايسبس','biceps-curl','sAq_ocpRh_I','شرح حركة بايسبس كيرل — مدرب رجل',['ثبت أعلى الذراعين على وسادة الجهاز.','اثنِ المرفقين لرفع المقابض.','انزل ببطء دون مد المرفق بقوة في الأسفل.'],'لا ترفع كتفيك عن الوسادة.',['بايسبس','preacher','machine']),
  'cable-biceps-curl': variant('cable-biceps-curl','بايسبس بالكيبل','Cable Biceps Curl','البايسبس','biceps-curl','sAq_ocpRh_I','شرح حركة بايسبس كيرل — مدرب رجل',['استخدم البكرة السفلية واثبت المرفقين بجانب الجسم.','اثنِ المرفقين وارفع المقبض نحو الصدر.','انزل بتحكم.'],'لا تتراجع بالجذع لرفع الوزن.',['بايسبس','كيبل']),
  'ezbar-curl': variant('ezbar-curl','بايسبس EZ-Bar','EZ-Bar Curl','البايسبس والساعد','biceps-curl','sAq_ocpRh_I','شرح حركة بايسبس كيرل — مدرب رجل',['أمسك البار بقبضة مريحة بعرض الكتفين تقريبًا.','ثبّت المرفقين وارفع البار.','انزل ببطء حتى قرب الاستقامة.'],'لا تستخدم دفع الورك.',['بايسبس','ez bar']),
  'incline-dumbbell-curl': variant('incline-dumbbell-curl','بايسبس دمبل على بنش مائل','Incline Dumbbell Curl','البايسبس','biceps-curl','sAq_ocpRh_I','شرح حركة بايسبس كيرل — مدرب رجل',['اجلس على بنش مائل والذراعان متدليتان.','اثنِ المرفقين دون تقديم الكتفين.','انزل ببطء.'],'اختر وزنًا أخف بسبب وضعية التمدد.',['بايسبس','دمبل','مائل']),
  'concentration-curl': variant('concentration-curl','كونسنتريشن كيرل','Concentration Curl','البايسبس','biceps-curl','sAq_ocpRh_I','شرح حركة بايسبس كيرل — مدرب رجل',['اجلس واسند المرفق إلى داخل الفخذ.','ارفع الدمبل نحو الكتف دون تحريك أعلى الذراع.','انزل ببطء ثم بدّل اليد.'],'لا تلف الجذع للمساعدة.',['بايسبس','دمبل']),

  // الترايسبس
  'rope-triceps-pushdown': variant('rope-triceps-pushdown','ترايسبس حبل','Rope Triceps Pushdown','الترايسبس','triceps-pushdown','_w-HpW70nSQ','شرح دفع الترايسبس — مدرب رجل',['أمسك الحبل من البكرة العليا وثبت المرفقين.','ادفع لأسفل وافتح طرفي الحبل قليلًا.','ارجع ببطء دون تحريك أعلى الذراع.'],'المرفقان يبقيان قرب الجسم.',['ترايسبس','rope']),
  'overhead-cable-triceps': variant('overhead-cable-triceps','ترايسبس كيبل فوق الرأس','Overhead Cable Triceps Extension','الترايسبس، خصوصًا الرأس الطويل','triceps-pushdown','_w-HpW70nSQ','شرح حركة الترايسبس بالكيبل — مدرب رجل',['اجعل البكرة خلفك وأمسك الحبل فوق الرأس.','ثبت المرفقين وامدد الذراعين للأمام/الأعلى.','ارجع ببطء حتى تمدد مريح.'],'لا توسع المرفقين بشدة.',['ترايسبس','فوق الرأس','كيبل']),
  'triceps-dip-machine': variant('triceps-dip-machine','جهاز ديبس ترايسبس','Triceps Dip Machine','الترايسبس والصدر','triceps-pushdown','_w-HpW70nSQ','شرح نمط دفع الترايسبس — مدرب رجل',['اجلس وثبت الظهر على المسند.','ادفع المقابض لأسفل حتى قرب استقامة الذراعين.','ارجع ببطء.'],'تجنب ارتفاع الكتفين نحو الأذنين.',['ترايسبس','dip','machine']),
  'assisted-dip': variant('assisted-dip','ديبس بمساعدة','Assisted Dip','الترايسبس والصدر','triceps-pushdown','_w-HpW70nSQ','شرح نمط دفع الترايسبس — مدرب رجل',['اضبط مقدار المساعدة وثبت الركبتين/القدمين.','انزل بمدى مريح مع مرفقين للخلف.','ادفع للأعلى دون قفل عنيف للمرفقين.'],'لا تنزل لعمق يسبب ألمًا في الكتف.',['ترايسبس','dip','assisted']),
  'dumbbell-overhead-triceps': variant('dumbbell-overhead-triceps','ترايسبس دمبل فوق الرأس','Dumbbell Overhead Triceps Extension','الترايسبس','triceps-pushdown','_w-HpW70nSQ','شرح نمط تمديد الترايسبس — مدرب رجل',['أمسك دمبلًا واحدًا فوق الرأس بكلتا اليدين.','اثنِ المرفقين وأنزل الدمبل خلف الرأس.','مد الذراعين للأعلى بتحكم.'],'أبقِ الجذع ثابتًا والمرفقين متقاربين.',['ترايسبس','دمبل']),

  // الفخذ الأمامي/الحركة الأساسية
  'hack-squat': variant('hack-squat','هاك سكوات جهاز','Hack Squat','الفخذ الأمامي والمؤخرة','leg-press','oujca3_Shgw','شرح نمط الدفع بالرجلين — مدرب رجل',['ثبت الكتفين والظهر على المسند وقدماك بعرض مريح.','انزل ببطء مع اتجاه الركبتين نحو أصابع القدم.','ادفع من كامل القدم للعودة.'],'ابدأ خفيفًا وحدد عمقًا مريحًا للركبتين.',['رجل','hack squat']),
  'pendulum-squat': variant('pendulum-squat','بندول سكوات','Pendulum Squat','الفخذ الأمامي والمؤخرة','leg-press','oujca3_Shgw','شرح نمط الدفع بالرجلين — مدرب رجل',['ثبت الظهر والكتفين على الجهاز واضبط القدمين.','انزل بمسار الجهاز حتى عمق مريح.','ادفع للأعلى دون قفل الركبتين.'],'قد يكون الجهاز أثقل مما يبدو؛ ابدأ قليلًا.',['رجل','pendulum']),
  'v-squat': variant('v-squat','V-Squat جهاز','V-Squat Machine','الفخذ الأمامي والمؤخرة','leg-press','oujca3_Shgw','شرح نمط الدفع بالرجلين — مدرب رجل',['ثبت الظهر والكتفين واضبط القدمين بعرض مريح.','انزل بتحكم مع بقاء الكعبين ثابتين.','ادفع للأعلى من كامل القدم.'],'تجنب تقريب الركبتين للداخل.',['رجل','v squat']),
  'smith-squat': variant('smith-squat','سكوات على السميث','Smith Machine Squat','الفخذ الأمامي والمؤخرة والجذع','leg-press','oujca3_Shgw','شرح نمط السكوات — مدرب رجل',['ضع البار على أعلى الظهر وليس الرقبة.','ثبت القدمين وانزل حتى عمق مريح.','ادفع للأعلى مع ثبات الركبتين باتجاه القدمين.'],'استخدم أقفال الأمان ولا تبدأ بوزن كبير.',['رجل','smith','squat']),
  'goblet-squat': variant('goblet-squat','Goblet Squat دمبل','Goblet Squat','الفخذ الأمامي والمؤخرة والجذع','leg-press','oujca3_Shgw','شرح نمط السكوات — مدرب رجل',['أمسك دمبلًا أمام الصدر.','انزل بين الوركين مع صدر مرفوع.','ادفع الأرض بقدميك للعودة.'],'ابدأ خفيفًا وحافظ على الكعبين ثابتين.',['رجل','دمبل','squat']),
  'belt-squat': variant('belt-squat','بيلت سكوات','Belt Squat','الفخذان والمؤخرة مع حمل أقل على الظهر','leg-press','oujca3_Shgw','شرح نمط السكوات — مدرب رجل',['ثبت الحزام بمنصة الجهاز حسب التعليمات.','قف بثبات وانزل ببطء إلى عمق مريح.','ادفع للأعلى من كامل القدم.'],'تأكد من تثبيت الحزام قبل بدء السيت.',['رجل','belt squat']),

  // الفخذ الخلفي
  'lying-leg-curl': variant('lying-leg-curl','ليج كيرل مستلقٍ','Lying Leg Curl','الفخذ الخلفي','leg-curl','ELOCsoDSmrg','شرح ليج كيرل — مدرب رجل',['استلقِ وثبت الوسادة فوق الكعبين/أسفل الساق.','اثنِ الركبتين واسحب الكعبين نحو المؤخرة.','انزل ببطء دون رفع الحوض.'],'لا تقوّس أسفل الظهر.',['رجل','خلفي','lying curl']),
  'standing-leg-curl': variant('standing-leg-curl','ليج كيرل واقف','Standing Leg Curl','الفخذ الخلفي','leg-curl','ELOCsoDSmrg','شرح ليج كيرل — مدرب رجل',['ثبت الفخذ والجذع على الجهاز.','اثنِ ركبة واحدة واسحب الكعب للخلف.','ارجع ببطء ثم بدّل الرجل.'],'لا تحرك الورك للأمام والخلف.',['رجل','خلفي','standing curl']),
  'single-leg-curl': variant('single-leg-curl','ليج كيرل رجل واحدة','Single-Leg Curl','الفخذ الخلفي','leg-curl','ELOCsoDSmrg','شرح ليج كيرل — مدرب رجل',['استخدم جهاز الكيرل برجل واحدة إذا يسمح التصميم.','اثنِ الركبة بتحكم حتى نهاية المدى المريح.','ارجع ببطء ثم بدّل الرجل.'],'استخدم وزنًا أقل من تمرين الرجلين معًا.',['رجل','خلفي','single leg']),
  'cable-leg-curl': variant('cable-leg-curl','ليج كيرل بالكيبل','Cable Leg Curl','الفخذ الخلفي','leg-curl','ELOCsoDSmrg','شرح نمط ثني الركبة — مدرب رجل',['ثبت رباط الكاحل في بكرة منخفضة.','ثبت الفخذ واثنِ الركبة للخلف.','ارجع ببطء دون حركة الورك.'],'ابدأ بمقاومة خفيفة للحفاظ على التوازن.',['رجل','خلفي','كيبل']),
  'nordic-assisted': variant('nordic-assisted','Nordic Curl مساعد','Assisted Nordic Curl','الفخذ الخلفي','leg-curl','ELOCsoDSmrg','شرح استهداف الفخذ الخلفي — مدرب رجل',['ثبت الكاحلين في محطة مخصصة أو بمساعدة آمنة.','حافظ على الجذع مستقيمًا وانزل ببطء بقدر قدرتك.','استخدم المساعدة باليدين للعودة.'],'تمرين متقدم؛ استخدم مساعدة واضحة ولا تجبر المدى.',['رجل','خلفي','nordic']),

  // رجل واحدة/لانجز
  'reverse-lunge': variant('reverse-lunge','لانجز خلفي','Reverse Lunge','الفخذان والمؤخرة والتوازن','walking-lunge','COKYKgQ8KR0','شرح اللانجز — مدرب رجل',['خذ خطوة للخلف بدلًا من الأمام.','انزل بالركبة الخلفية باتجاه الأرض مع صدر مرفوع.','ادفع بالقدم الأمامية للعودة.'],'ابدأ بوزن الجسم.',['رجل','lunge','خلفي']),
  'step-up': variant('step-up','Step-Up على صندوق','Step-Up','الفخذ الأمامي والمؤخرة والتوازن','walking-lunge','COKYKgQ8KR0','شرح نمط الرجل الواحدة — مدرب رجل',['ضع قدمًا كاملة على صندوق/بنش ثابت منخفض.','ادفع من الرجل الموجودة فوق المنصة وارفع الجسم.','انزل بتحكم ثم بدّل الجهة.'],'لا تستخدم منصة مرتفعة أكثر من قدرتك.',['رجل','step up']),
  'smith-split-squat': variant('smith-split-squat','Split Squat على السميث','Smith Split Squat','الفخذ الأمامي والمؤخرة','bulgarian-split-squat','2C-uNgKwPLE','شرح Split Squat — مدرب رجل',['ضع القدمين في وضع متباعد تحت السميث.','انزل عموديًا ببطء مع ثبات القدمين.','ادفع بالرجل الأمامية للعودة.'],'استخدم أقفال الأمان وابدأ خفيفًا.',['رجل','split squat','smith']),
  'stationary-split-squat': variant('stationary-split-squat','Split Squat ثابت','Stationary Split Squat','الفخذ الأمامي والمؤخرة والتوازن','bulgarian-split-squat','2C-uNgKwPLE','شرح Split Squat — مدرب رجل',['ثبت وضع القدمين واحدة أمام الأخرى.','انزل عموديًا حتى مدى مريح.','ادفع بالرجل الأمامية دون تغيير مكان القدمين.'],'ابدأ بوزن الجسم.',['رجل','split squat']),
  'single-leg-press': variant('single-leg-press','ليج برس رجل واحدة','Single-Leg Press','الفخذ الأمامي والمؤخرة','leg-press','oujca3_Shgw','شرح جهاز ضغط الأرجل — مدرب رجل',['ضع قدمًا واحدة في منتصف المنصة بمكان مريح.','ادفع دون تدوير الحوض.','ارجع ببطء ثم بدّل الرجل.'],'خفف الوزن كثيرًا مقارنة بالضغط بالرجلين.',['رجل','leg press','single']),

  // السمانة
  'legpress-calf-raise': variant('legpress-calf-raise','سمانة على Leg Press','Leg Press Calf Raise','السمانة','calf-raise','ORT4oJ_R8Qs','شرح رفع السمانة — مدرب رجل',['ضع مقدمة القدمين على حافة منصة الليج برس والكعبان حران.','ادفع بأصابع القدم لرفع الكعبين.','انزل ببطء حتى تمدد مريح.'],'لا تثنِ الركبتين كثيرًا أثناء الحركة.',['سمانة','leg press']),
  'smith-calf-raise': variant('smith-calf-raise','سمانة على السميث','Smith Calf Raise','السمانة','calf-raise','ORT4oJ_R8Qs','شرح رفع السمانة — مدرب رجل',['ضع مقدمة القدمين على قرص/درجة ثابتة إن كانت آمنة.','ارفع الكعبين للأعلى مع ثبات الركبتين نسبيًا.','انزل ببطء.'],'استخدم أقفال الأمان وتمسك جيدًا.',['سمانة','smith']),
  'standing-calf-machine': variant('standing-calf-machine','جهاز سمانة واقف','Standing Calf Machine','السمانة','calf-raise','ORT4oJ_R8Qs','شرح رفع السمانة — مدرب رجل',['ثبت الكتفين تحت الوسائد ومقدمة القدم على المنصة.','ارفع الكعبين لأعلى ما تستطيع.','انزل ببطء حتى تمدد مريح.'],'لا ترتد من أسفل الحركة.',['سمانة','machine']),
  'single-leg-calf-raise': variant('single-leg-calf-raise','سمانة رجل واحدة','Single-Leg Calf Raise','السمانة','calf-raise','ORT4oJ_R8Qs','شرح رفع السمانة — مدرب رجل',['قف على رجل واحدة وامسك دعامة للتوازن.','ارفع الكعب لأعلى واثبت لحظة.','انزل ببطء ثم بدّل الجهة.'],'ابدأ بوزن الجسم.',['سمانة','single']),
  'donkey-calf-raise': variant('donkey-calf-raise','Donkey Calf Raise جهاز','Donkey Calf Raise','السمانة','calf-raise','ORT4oJ_R8Qs','شرح رفع السمانة — مدرب رجل',['ثبت الحوض/الظهر حسب تصميم الجهاز.','اجعل مقدمة القدمين على المنصة.','ارفع الكعبين ثم انزل ببطء.'],'لا ترتد بالوزن.',['سمانة','donkey']),

  // المؤخرة/تمديد الورك
  'glute-drive-machine': variant('glute-drive-machine','جهاز Glute Drive','Glute Drive Machine','المؤخرة والفخذ الخلفي','hip-thrust','SEdqd1n0cvg','شرح Hip Thrust — مدرب رجل',['ثبت الظهر على المسند والحزام/الوسادة فوق الحوض.','ادفع الحوض للأعلى بشد المؤخرة.','توقف لحظة ثم انزل ببطء.'],'لا تبالغ في تقويس أسفل الظهر.',['مؤخرة','glute drive']),
  'smith-hip-thrust': variant('smith-hip-thrust','Hip Thrust على السميث','Smith Hip Thrust','المؤخرة والفخذ الخلفي','hip-thrust','SEdqd1n0cvg','شرح Hip Thrust — مدرب رجل',['ثبت أعلى الظهر على بنش ثابت والبار فوق الحوض مع وسادة.','ادفع الحوض للأعلى بشد المؤخرة.','انزل بتحكم حتى مدى مريح.'],'استخدم وسادة للبار وأقفال الأمان.',['مؤخرة','smith','hip thrust']),
  'barbell-hip-thrust': variant('barbell-hip-thrust','Hip Thrust بالبار','Barbell Hip Thrust','المؤخرة والفخذ الخلفي','hip-thrust','SEdqd1n0cvg','شرح Hip Thrust — مدرب رجل',['ثبت أعلى الظهر على بنش والبار فوق الحوض.','ثبت القدمين وارفع الحوض حتى الجذع أفقي تقريبًا.','انزل ببطء.'],'استخدم وسادة مناسبة للبار.',['مؤخرة','barbell','hip thrust']),
  'cable-pull-through': variant('cable-pull-through','Cable Pull-Through','Cable Pull-Through','المؤخرة والفخذ الخلفي','hip-thrust','SEdqd1n0cvg','شرح نمط تمديد الورك — مدرب رجل',['قف وظهرك للبكرة السفلية والحبل بين الرجلين.','ادفع الوركين للخلف ثم مد الورك للأمام.','حافظ على ظهر محايد طوال الحركة.'],'الحركة من الورك لا من أسفل الظهر.',['مؤخرة','cable','hinge']),
  'glute-bridge-machine': variant('glute-bridge-machine','جهاز Glute Bridge','Glute Bridge Machine','المؤخرة والفخذ الخلفي','glute-bridge','8bbE64NuDTU','شرح Glute Bridge — مدرب رجل',['ثبت الظهر والقدمين حسب الجهاز.','ارفع الحوض بشد المؤخرة.','انزل ببطء دون ارتداد.'],'حافظ على البطن مشدودًا.',['مؤخرة','bridge','machine']),

  // خيارات ترايسبس دفع للأسفل — نفس مفصل الحركة، وليس ديبس أو تمديد فوق الرأس.
  'single-arm-triceps-pushdown': variant('single-arm-triceps-pushdown','ترايسبس كيبل يد واحدة','Single-Arm Cable Triceps Pushdown','الترايسبس','triceps-pushdown','','',['ثبت المرفق بجانب الجذع أمام البكرة العليا.','مد الساعد للأسفل دون تأرجح الكتف.','ارجع ببطء ثم بدّل الذراع.'],'لا تدفع بمفصل الكتف بدل المرفق.',['ترايسبس','يد واحدة']),
  'vbar-triceps-pushdown': variant('vbar-triceps-pushdown','ترايسبس كيبل مقبض V','V-Bar Triceps Pushdown','الترايسبس','triceps-pushdown','','',['ضع مقبض V على البكرة العليا وثبت المرفقين.','مد الذراعين للأسفل بتحكم.','ارجع ببطء دون ابتعاد المرفقين للأمام.'],'تحكم في المعصم، وتجنب تقويس الظهر.',['ترايسبس','v bar']),
  'reverse-grip-triceps-pushdown': variant('reverse-grip-triceps-pushdown','ترايسبس قبضة معكوسة','Reverse-Grip Triceps Pushdown','الترايسبس','triceps-pushdown','','',['أمسك البار بقبضة راحة اليد للأعلى.','حافظ على المرفقين قرب الجذع.','مد الساعدين للأسفل بوزن خفيف ثم ارجع بتحكم.'],'استخدم وزنًا أخف للمحافظة على المعصم.',['ترايسبس','قبضة معكوسة']),
  // الجذع
  'dead-bug': variant('dead-bug','Dead Bug','Dead Bug','الجذع العميق والتحكم بالحوض','plank','fqzUlmyTpJk','شرح ثبات الجذع — مدرب رجل',['استلقِ وارفع الذراعين والركبتين 90 درجة.','مد ذراعًا والرجل المقابلة ببطء دون رفع أسفل الظهر.','ارجع وبدّل الجهة.'],'قلل المدى إذا بدأ أسفل الظهر يبتعد عن الأرض.',['بطن','core','dead bug']),
  'bird-dog': variant('bird-dog','Bird Dog','Bird Dog','الجذع والظهر والتوازن','plank','fqzUlmyTpJk','شرح ثبات الجذع — مدرب رجل',['ابدأ على أربع والظهر محايد.','مد ذراعًا والرجل المقابلة دون دوران الحوض.','ارجع وبدّل الجهة.'],'الحركة بطيئة؛ لا ترفع الرجل أعلى من الجذع.',['بطن','core','bird dog']),
  'pallof-press': variant('pallof-press','Pallof Press بالكيبل','Pallof Press','الجذع ومقاومة الدوران','plank','fqzUlmyTpJk','شرح ثبات الجذع — مدرب رجل',['قف جانب البكرة وأمسك المقبض أمام الصدر.','ادفع اليدين للأمام دون أن يدور الجذع.','ارجع ببطء وكرر ثم بدّل الجهة.'],'استخدم وزنًا يسمح بثبات الحوض.',['بطن','core','cable']),
  'machine-crunch': variant('machine-crunch','جهاز كرنش البطن','Ab Crunch Machine','عضلات البطن','crunch','NIqgTCTd2MM','شرح الكرنش — مدرب رجل',['اضبط المقعد والوسائد حسب الجهاز.','قرّب القفص الصدري من الحوض بانقباض البطن.','ارجع ببطء دون سحب بالذراعين.'],'الحركة من الجذع لا من الرقبة.',['بطن','crunch','machine']),
  'cable-crunch': variant('cable-crunch','كرنش بالكيبل','Cable Crunch','عضلات البطن','crunch','NIqgTCTd2MM','شرح الكرنش — مدرب رجل',['اركع أمام البكرة العليا وأمسك الحبل قرب الرأس.','اثنِ الجذع بتقريب الأضلاع من الحوض.','ارجع ببطء دون تحريك الورك كثيرًا.'],'لا تسحب الحبل بذراعيك.',['بطن','كيبل','crunch']),
});

export interface ExercisePoolOption { id: MachineId; tag: string; note: string }
export interface ExercisePool { id: string; label: string; cue: string; options: ExercisePoolOption[] }
const opt = (id: MachineId, tag: string, note: string): ExercisePoolOption => ({ id, tag, note });

export const EXERCISE_POOLS: Record<string, ExercisePool> = {
  chestHorizontal: { id:'chestHorizontal', label:'الصدر — دفع أفقي', cue:'اختر تمرينًا واحدًا. كلها بدائل لنمط دفع الصدر.', options:[
    opt('chest-press','جهاز','الاختيار الأبسط والأثبت'), opt('plate-loaded-chest-press','Plate Loaded','إحساس أقرب للأوزان الحرة'), opt('converging-chest-press','جهاز','مسار متقارب مريح'), opt('smith-bench-press','سميث','بديل ثابت للبنش'), opt('dumbbell-bench-press','دمبل','حرية حركة أكبر'), opt('cable-chest-press','كيبل','شد مستمر'), opt('machine-chest-press-neutral','جهاز','قبضة محايدة مريحة للكتف') ]},
  chestIncline: { id:'chestIncline', label:'أعلى الصدر — دفع مائل', cue:'اختر تمرينًا واحدًا مائلًا لأعلى الصدر.', options:[
    opt('incline-dumbbell-press','دمبل','المقترح الأساسي'), opt('incline-machine-press','جهاز','أثبت وأسهل في الإعداد'), opt('incline-smith-press','سميث','مسار ثابت'), opt('incline-plate-loaded-press','Plate Loaded','مقاومة حرة على جهاز'), opt('incline-cable-press','كيبل','شد مستمر'), opt('low-incline-dumbbell-press','دمبل','ميل خفيف ومريح') ]},
  verticalPull: { id:'verticalPull', label:'الظهر — سحب رأسي', cue:'اختر تمرين سحب من أعلى إلى أسفل.', options:[
    opt('lat-pulldown','جهاز','المقترح الأساسي'), opt('neutral-grip-pulldown','جهاز','قبضة محايدة'), opt('close-grip-pulldown','جهاز','قبضة ضيقة'), opt('single-arm-pulldown','كيبل','يد واحدة'), opt('assisted-pullup','جهاز','عقلة بمساعدة') ]},
  horizontalRow: { id:'horizontalRow', label:'الظهر — تجديف أفقي', cue:'اختر Row واحدًا واسحب باتجاه الجذع.', options:[
    opt('seated-row','جهاز','المقترح الأساسي'), opt('chest-supported-row','جهاز','مسند صدر وثبات أكبر'), opt('cable-row-neutral','كيبل','قبضة محايدة'), opt('plate-loaded-row','Plate Loaded','مقاومة مستقلة'), opt('one-arm-dumbbell-row','دمبل','يد واحدة'), opt('single-arm-cable-row','كيبل','تحكم مستقل'), opt('tbar-row-machine','جهاز','T-Bar بمسند') ]},
  shoulderPress: { id:'shoulderPress', label:'الكتف — دفع رأسي', cue:'اختر تمرين ضغط كتف واحدًا.', options:[
    opt('shoulder-press','جهاز','المقترح الأساسي'), opt('seated-dumbbell-shoulder-press','دمبل','حرية حركة'), opt('smith-shoulder-press','سميث','مسار ثابت'), opt('plate-loaded-shoulder-press','Plate Loaded','جهاز محمل بالأقراص'), opt('arnold-press','دمبل','مسار متغير'), opt('single-arm-cable-shoulder-press','كيبل','يد واحدة') ]},
  rearDelt: { id:'rearDelt', label:'الكتف الخلفي', cue:'اختر تمرينًا واحدًا للكتف الخلفي وأعلى الظهر.', options:[
    opt('face-pull','كيبل','المقترح الأساسي'), opt('rope-face-pull','كيبل','فيس بول بالحبل'), opt('band-face-pull','مطاط','فيس بول بالمطاط') ]},
  rearDeltFly: { id:'rearDeltFly', label:'الكتف الخلفي — رفرفة عكسية', cue:'اختر عزلًا للكتف الخلفي بحركة فتح الذراعين.', options:[
    opt('reverse-pec-deck','جهاز','فراشة عكسية'), opt('rear-delt-machine','جهاز','عزل خلفي'), opt('rear-delt-cable-fly','كيبل','رفرفة بالكيبل'), opt('incline-rear-delt-raise','دمبل','بنش مائل') ]},
  biceps: { id:'biceps', label:'البايسبس', cue:'اختر تمرين بايسبس واحدًا.', options:[
    opt('biceps-curl','دمبل','كيرل تقليدي'), opt('hammer-curl','دمبل','قبضة محايدة'), opt('preacher-curl-machine','جهاز','ثبات أعلى الذراع'), opt('cable-biceps-curl','كيبل','شد مستمر'), opt('ezbar-curl','بار','قبضة مريحة'), opt('incline-dumbbell-curl','دمبل','تمدد أكبر'), opt('concentration-curl','دمبل','عزل يد واحدة') ]},
  triceps: { id:'triceps', label:'الترايسبس', cue:'اختر تمرين ترايسبس واحدًا.', options:[
    opt('triceps-pushdown','كيبل','بار مستقيم'), opt('rope-triceps-pushdown','كيبل','حبل'), opt('single-arm-triceps-pushdown','كيبل','يد واحدة'), opt('vbar-triceps-pushdown','كيبل','مقبض V'), opt('reverse-grip-triceps-pushdown','كيبل','قبضة معكوسة') ]},
  overheadTriceps: { id:'overheadTriceps', label:'الترايسبس — تمديد فوق الرأس', cue:'اختر نوع تمديد الترايسبس فوق الرأس.', options:[
    opt('overhead-cable-triceps','كيبل','فوق الرأس بالكيبل'), opt('dumbbell-overhead-triceps','دمبل','فوق الرأس بالدمبل') ]},
  dipTriceps: { id:'dipTriceps', label:'الترايسبس — حركة ديبس', cue:'اختر تمرين ديبس بنفس الحركة.', options:[
    opt('triceps-dip-machine','جهاز','ديبس جهاز'), opt('assisted-dip','جهاز','ديبس بمساعدة') ]},
  kneeDominant: { id:'kneeDominant', label:'الأرجل — حركة أساسية', cue:'اختر تمرينًا واحدًا للفخذ الأمامي والمؤخرة.', options:[
    opt('leg-press','جهاز','المقترح الأساسي'), opt('hack-squat','جهاز','هاك سكوات'), opt('pendulum-squat','جهاز','بندول سكوات'), opt('v-squat','جهاز','V-Squat'), opt('smith-squat','سميث','سكوات ثابت المسار'), opt('goblet-squat','دمبل','بسيط وواضح'), opt('belt-squat','جهاز','حمل أقل على الظهر') ]},
  hamstrings: { id:'hamstrings', label:'الفخذ الخلفي — ثني الركبة', cue:'اختر تمرينًا واحدًا للفخذ الخلفي.', options:[
    opt('leg-curl','جهاز','كيرل جالس'), opt('lying-leg-curl','جهاز','كيرل مستلقٍ'), opt('standing-leg-curl','جهاز','كيرل واقف'), opt('single-leg-curl','جهاز','رجل واحدة'), opt('cable-leg-curl','كيبل','رباط كاحل') ]},
  unilateralLeg: { id:'unilateralLeg', label:'الأرجل — رجل واحدة', cue:'اختر تمرينًا أحادي الرجل للتوازن والقوة.', options:[
    opt('walking-lunge','وزن جسم','لانجز مشي'), opt('bulgarian-split-squat','بنش','بلغاريان'), opt('reverse-lunge','وزن جسم','لانجز خلفي'), opt('step-up','صندوق','Step-Up'), opt('smith-split-squat','سميث','Split Squat ثابت'), opt('stationary-split-squat','وزن جسم','Split Squat'), opt('single-leg-press','جهاز','Leg Press رجل واحدة') ]},
  calves: { id:'calves', label:'السمانة', cue:'اختر نوع رفع سمانة واحدًا.', options:[
    opt('calf-raise','واقف','رفع سمانة'), opt('seated-calf-raise','جهاز','جالس'), opt('legpress-calf-raise','جهاز','على Leg Press'), opt('smith-calf-raise','سميث','على السميث'), opt('standing-calf-machine','جهاز','جهاز واقف'), opt('single-leg-calf-raise','وزن جسم','رجل واحدة'), opt('donkey-calf-raise','جهاز','Donkey') ]},
  glutes: { id:'glutes', label:'المؤخرة — تمديد الورك', cue:'اختر Hip Thrust / Bridge واحدًا.', options:[
    opt('hip-thrust','بنش','المقترح الأساسي'), opt('glute-drive-machine','جهاز','Glute Drive'), opt('smith-hip-thrust','سميث','Hip Thrust ثابت'), opt('barbell-hip-thrust','بار','النسخة الحرة'), opt('glute-bridge-machine','جهاز','Glute Bridge') ]},
  hingeGlutes: { id:'hingeGlutes', label:'المؤخرة — تمرين شد الورك', cue:'هذا تمرين قائم مختلف عن Hip Thrust؛ اختره فقط إذا ناسب برنامجك.', options:[
    opt('cable-pull-through','كيبل','مد الورك مع ثني الجذع') ]},
  flexionCore: { id:'flexionCore', label:'البطن — الثني', cue:'اختر تمرين كرنش للبطن.', options:[
    opt('machine-crunch','جهاز','كرنش جهاز'), opt('cable-crunch','كيبل','كرنش كيبل') ]},
  sidePlank: { id:'sidePlank', label:'الجذع — ثبات جانبي', cue:'حافظ على تمرين الثبات الجانبي، ولا تستبدله بكرنش.', options:[
    opt('side-plank','وزن الجسم','ثبات جانبي') ]},
  core: { id:'core', label:'الجذع', cue:'اختر تمرين جذع واحدًا بجودة حركة عالية.', options:[
    opt('plank','وزن جسم','ثبات أمامي'), opt('dead-bug','وزن جسم','مقاومة تمدد الظهر'), opt('bird-dog','وزن جسم','ثبات الجذع') ]},
};


/**
 * روابط يوتيوب محددة لكل تمرين تم التحقق من مطابقة عنوانه للحركة.
 * إذا لم يوجد مقطع معتمد لا نكرر فيديو حركة أخرى؛ نظهر بحثًا بالاسم الدقيق.
 */
const VERIFIED_VARIANT_VIDEOS: Record<string, string> = {
  'plate-loaded-chest-press': '0Wa9CfRXUkA',
  'dumbbell-bench-press': 'v0NisWqmKJQ',
  'cable-chest-press': 'FVWJglwid4I',
  'incline-machine-press': '-7d6XCeQd0g',
  'incline-smith-press': 'D_h6XI_YxhA',
  'neutral-grip-pulldown': 'fR_Pw6PxLz4',
  'arnold-press': 'ris9tKqMwgU',
  'preacher-curl-machine': 'R-8Sa0_qiws',
  'v-squat': 'h4eE6-Hs2hQ',
  'hack-squat': 'VY8ko6ecfso',
  'lying-leg-curl': '-6quHxbz-RM',
  'glute-drive-machine': 'zlvRjuXyWQQ',
  'smith-hip-thrust': 'ADgWjz9i42Y',
  'barbell-hip-thrust': '0InBEUP0-aA',
  'reverse-pec-deck': 'Z84HkxGCBqQ',
  'cable-pull-through': '4oZ_0_bQcOg',
  // مقاطع إضافية بأسماء مطابقة للتمارين (تضاف إلى النسخة السابقة دون تغيير البدائل).
  'smith-bench-press': 'KJSgqUDFe00',
  'close-grip-pulldown': 'nCLHWEUyyOY',
  'single-arm-pulldown': 'lboym0z-fxA',
  'single-arm-cable-row': 'Y9vk5jBXx5s',
  'chest-supported-row': 'af-WbPlA_iY',
  'rear-delt-cable-fly': 'QRUaTRQ_M64',
  'tbar-row-machine': 'TyLoy3n_a10',
};
for (const [id, youtubeId] of Object.entries(VERIFIED_VARIANT_VIDEOS)) {
  const machine = MACHINES[id];
  if (!machine) throw new Error(`Missing exercise for verified video ${id}`);
  machine.guideYoutubeId = youtubeId;
  machine.guideYoutubeQuery = undefined;
  machine.guideTitle = `شرح ${machine.ar} — ${machine.en}`;
}

// الأجهزة الموجودة فعليًا في النادي: لا ننشئ جهازًا ثانيًا للصور المتكررة.
Object.assign(MACHINES, {
  'biceps-curl-machine': {
    id:'biceps-curl-machine', ar:'جهاز البايسبس (هامر سترنث)', en:'Hammer Strength Biceps Curl Machine', group:'strength',
    muscles:'عضلة البايسبس وأمام الذراع', illustration:'biceps-curl-machine', guideYoutubeId:'c1xKUR79ktU', guideTitle:'تمرين بايسبس على جهاز مخصص',
    steps:['اضبط ارتفاع المقعد حتى يتوافق محور الجهاز مع مفصل المرفق، وثبت ظهر الذراع على الوسادة إن وجدت.','أمسك المقبضين مع استقرار الكتفين واثنِ المرفقين بهدوء حتى يرتفع الساعد.','أنزل الوزن خلال ثانيتين إلى ثلاث، دون قفل المرفقين أو تحريك الكتفين.'],
    warn:'إذا اضطررت إلى تحريك ظهرك أو رفع كتفيك فالوزن ثقيل. اضبط الجهاز قبل البدء.',keywords:['بايسبس','biceps','hammer strength','نادي']
  },
  'hip-abduction-machine': {
    id:'hip-abduction-machine', ar:'فتح الفخذين للمؤخرة الجانبية', en:'Life Fitness Hip Abduction Machine', group:'strength',
    muscles:'المؤخرة الجانبية (الألوية الوسطى والصغرى)، مثبتات الحوض', illustration:'hip-abduction-machine', guideYoutubeId:'830CzAeOaqw', guideTitle:'توضيح جهاز فتح الفخذين',
    steps:['اجلس وظهرك مستند واضبط وسادتي الفخذين بحيث تبدآن في وضع مريح دون شد مؤلم.','امسك المقبضين، ثم افتح الركبتين إلى الخارج ببطء مع إبقاء الحوض ثابتًا.','توقف لحظة عند المدى المريح ثم عد ببطء دون أن تصطدم الأوزان.'],
    warn:'هذا جهاز فتح الفخذين للخارج (Abduction)، وليس ضم الفخذين للداخل (Adduction). لا تستخدم اندفاع الجذع.',keywords:['مؤخرة','ورك','فتح الفخذين','hip abduction','glute medius','نادي']
  }
});

// تحديث شرح الأجهزة المصوّرة من النادي بدل النصوص العامة.
Object.assign(MACHINES['leg-curl'], {
 ar:'الفخذ الخلفي جلوس (لايف فتنس)',en:'Life Fitness Seated Leg Curl',illustration:'leg-curl',
 steps:['اضبط المقعد ليسند الظهر والحوض، وليكون محور الجهاز بمحاذاة مفصل الركبة.','ثبت الفخذين أسفل الوسادة العلوية واضبط الأسطوانة السفلية فوق الكاحلين.','اسحب الساقين للخلف والأسفل بثني الركبتين دون رفع الحوض، ثم عد ببطء.'],warn:'لا ترفع الحوض عن المقعد ولا تستخدم وزنًا يجبرك على رمي القدمين.'
});
Object.assign(MACHINES['lying-leg-curl'], {ar:'ثني الفخذ الخلفي مستلقيًا (هامر سترنث)', en:'Hammer Strength Lying Leg Curl', illustration:'lying-leg-curl',
 steps:['استلقِ على الوسادة ووجّه الركبتين إلى نقطة مفصل الجهاز، وضع أسطوانة الساق فوق الكاحلين.','شد البطن وثبت الحوض، ثم اثنِ الركبتين لرفع الوسادة نحو المؤخرة بمدى مريح.','أنزل الساقين ببطء مع بقاء الوركين ملاصقين للمسند.'], warn:'لا ترفع الحوض ولا تقوّس أسفل الظهر لتعويض الوزن.'});
Object.assign(MACHINES['leg-extension'], {ar:'تمديد الفخذ الأمامي (جهاز النادي)',illustration:'leg-extension',
 steps:['اجلس وظهرك ثابت، واضبط محور الجهاز في محاذاة مفصل الركبة.','ضع الأسطوانة أمام أسفل الساق فوق الكاحلين وامسك المقبضين.','مدّ الركبتين للأمام بتحكم ثم انزل ببطء دون رمي الوزن.'],warn:'اختر وزنًا مناسبًا، ولا تدفع الركبة بقوة إلى نهاية المدى.'});
Object.assign(MACHINES['standing-calf-machine'], {ar:'السمانة واقف (هامر سترنث)', illustration:'standing-calf-machine',guideYoutubeId:'g_E7_q1z2bo',
 steps:['ضع مقدمة القدمين على حافة منصة الجهاز والكتفين أسفل الوسادتين.','اثبت الركبتين مع ارتخاء طفيف وارفع الكعبين عاليًا بالضغط بمقدمة القدمين.','انزل ببطء إلى تمدد مريح للسمانة، ثم كرر دون هز الجسم.'],warn:'لا ترتد من أسفل الحركة أو تقفل الركبتين بقوة.'});
Object.assign(MACHINES['machine-crunch'], {ar:'جهاز البطن (لايف فتنس)',en:'Life Fitness Abdominal Crunch',illustration:'machine-crunch',guideYoutubeId:'kLyXnHGuJO4',
 steps:['اضبط الجلوس والوسادة حسب طولك وثبّت القدمين في الموضع المخصص.','اسحب الأضلاع نحو الحوض بانقباض عضلات البطن، لا بسحب الذراعين أو الرقبة.','ارجع ببطء حتى تستقيم الجذع في مدى مريح دون الإفراط في تقوس الظهر.'],warn:'تجنب الشد بالرقبة أو دفع الحمل بالورك. ابدأ بمقاومة خفيفة.'});
Object.assign(MACHINES['pec-deck'], {ar:'فراشة الصدر (لايف فتنس)', en:'Life Fitness Chest Fly / Pec Deck',illustration:'pec-deck',guideYoutubeId:'vmXwGbJe4Lk',
 steps:['اضبط المقعد بحيث تكون الذراعان والمقابض قرب منتصف الصدر، وثبت الظهر على المسند.','اجمع المقابض أمام الصدر مع انثناء بسيط وثابت بالمرفقين.','عد ببطء إلى فتح مريح للصدر دون مد الذراعين للخلف أكثر من قدرة الكتف.'],warn:'لا تفتح الذراعين بقوة خلف خط الكتف، ولا تجعل الوزن يسحبك للخلف.'});
Object.assign(MACHINES['leg-press'], {illustration:'leg-press'});

MACHINES["band-chest-press"] = {id:"band-chest-press",ar:"ضغط الصدر بالمطاط",en:"Band Chest Press",group:'strength',muscles:"الصدر والترايسبس",illustration:"resistance-band",guideYoutubeQuery:"Band Chest Press male coach technique",steps:["ثبت الشريط في نقطة مخصصة وثابتة خلفك عند ارتفاع منتصف الصدر.", "تقدم خطوة وادفع اليدين أمام الصدر ببطء دون رفع الكتفين.", "ارجع بتحكم إلى محاذاة الصدر."],warn:"لا تثبّت المطاط في جسم غير آمن أو متحرك.",keywords:["مطاط","مقاومة","band"]};

MACHINES["band-pull-apart"] = {id:"band-pull-apart",ar:"فتح المطاط للظهر",en:"Band Pull-Apart",group:'strength',muscles:"الكتف الخلفي وأعلى الظهر",illustration:"resistance-band",guideYoutubeQuery:"Band Pull-Apart male coach technique",steps:["امسك المطاط أمام الصدر وذراعاك شبه مستقيمتين.", "افتح اليدين للجانبين مع إبقاء الكتفين منخفضين.", "عد ببطء دون تقويس أسفل الظهر."],warn:"المقاومة خفيفة؛ ركّز على الكتفين لا على دفع الظهر.",keywords:["مطاط","مقاومة","band"]};

MACHINES["band-triceps-pushdown"] = {id:"band-triceps-pushdown",ar:"دفع الترايسبس بالمطاط",en:"Banded Triceps Pushdown",group:'strength',muscles:"الترايسبس",illustration:"resistance-band",guideYoutubeQuery:"Banded Triceps Pushdown male coach technique",steps:["ثبت الشريط عاليًا في نقطة آمنة ثابتة.", "ضع المرفقين بجانب الجذع وأمسك طرفي الشريط.", "مدّ الساعدين للأسفل ثم عد ببطء دون تحريك الكتفين."],warn:"لا تسمح للشريط بالارتداد إلى وجهك.",keywords:["مطاط","مقاومة","band"]};

MACHINES["mini-band-squat-hold"] = {id:"mini-band-squat-hold",ar:"ثبات نصف القرفصاء بالمطاط",en:"Mini Band Squat Hold",group:'strength',muscles:"الفخذ الأمامي والمؤخرة",illustration:"resistance-band",guideYoutubeQuery:"Mini Band Squat Hold male coach technique",steps:["ضع المطاط الصغير فوق الركبتين مباشرة.", "انزل إلى نصف قرفصاء مريح مع توزيع الوزن على كامل القدم.", "اثبت مع توجيه الركبتين في اتجاه أصابع القدمين."],warn:"لا تدع الركبتين تنهاران للداخل.",keywords:["مطاط","مقاومة","band"]};

MACHINES["band-hamstring-curl"] = {id:"band-hamstring-curl",ar:"ثني الفخذ الخلفي بالمطاط",en:"Banded Hamstring Curl",group:'strength',muscles:"الفخذ الخلفي",illustration:"resistance-band",guideYoutubeId:"Nn8KaxGBvPw",steps:["ثبت المطاط أمامك عند مستوى منخفض في نقطة موثوقة وثابتة.", "ضع الطرف الآخر خلف الكاحلين واجلس على مقعد ثابت.", "اثنِ الركبتين واسحب القدمين للخلف ثم ارجع ببطء."],warn:"تأكد أن المطاط لا ينزلق عن الكاحل.",keywords:["مطاط","مقاومة","band"]};

MACHINES["band-calf-raise"] = {id:"band-calf-raise",ar:"السمانة مع المطاط",en:"Banded Calf Raise",group:'strength',muscles:"السمانة",illustration:"resistance-band",guideYoutubeQuery:"Banded Calf Raise male coach technique",steps:["قف مع الاتكاء على دعامة ثابتة للتوازن والمطاط بمقاومة خفيفة مناسبة.", "ارفع الكعبين لأعلى بتحكم دون ثني الركبتين بعنف.", "انزل ببطء حتى تلامس الكعوب الأرض."],warn:"يمكن أداؤه بوزن الجسم إذا لم يكن إعداد المطاط آمنًا.",keywords:["مطاط","مقاومة","band"]};

MACHINES["band-row"] = {id:"band-row",ar:"التجديف بالمطاط",en:"Banded Row",group:'strength',muscles:"منتصف الظهر والبايسبس",illustration:"resistance-band",guideYoutubeQuery:"Banded Row male coach technique",steps:["ثبت المطاط في مستوى الصدر بنقطة مصممة للتثبيت.", "اسحب المرفقين للخلف باتجاه الأضلاع مع صدر مرفوع.", "مد الذراعين للأمام ببطء دون تحريك أسفل الظهر."],warn:"لا تلتف بالجسم ولا ترفع كتفيك نحو الأذنين.",keywords:["مطاط","مقاومة","band"]};

MACHINES["band-biceps-curl"] = {id:"band-biceps-curl",ar:"البايسبس بالمطاط",en:"Banded Biceps Curl",group:'strength',muscles:"البايسبس",illustration:"resistance-band",guideYoutubeQuery:"Banded Biceps Curl male coach technique",steps:["قف على وسط المطاط مع توازن القدمين وأمسك نهايتيه.", "ثبت المرفقين بجانب الخصر، ثم اثنِ الذراعين للأعلى.", "انزل ببطء دون الدفع بالوركين."],warn:"اختر طول مطاطًا لا يضطر المعصم للالتواء.",keywords:["مطاط","مقاومة","band"]};

MACHINES["band-rear-face-pull"] = {id:"band-rear-face-pull",ar:"فيس بول بالمطاط",en:"Banded Face Pull",group:'strength',muscles:"الكتف الخلفي وأعلى الظهر",illustration:"resistance-band",guideYoutubeId:"KzKvoDaax4s",steps:["ثبت المطاط عند مستوى الوجه في نقطة متينة ثابتة.", "اسحب نحو الوجه وافتح طرفي الشريط مع خروج المرفقين للخارج.", "ارجع ببطء مع ثبات الحوض والرقبة."],warn:"تجنب ارتداد الشريط نحو الوجه، وافحصه قبل التمرين.",keywords:["مطاط","مقاومة","band"]};

MACHINES["band-glute-bridge"] = {id:"band-glute-bridge",ar:"جسر المؤخرة بالمطاط",en:"Banded Glute Bridge",group:'strength',muscles:"المؤخرة",illustration:"resistance-band",guideYoutubeQuery:"Banded Glute Bridge male coach technique",steps:["ضع شريطًا صغيرًا فوق الركبتين واستلقِ مع ثني الركبتين والقدمين ثابتتين.", "اضغط بالكعبين وارفع الحوض إلى خط مريح من الكتف للركبة.", "اضغط الركبتين للخارج قليلًا ثم أنزل الحوض ببطء."],warn:"لا تبالغ في تقويس الظهر؛ الحركة من الورك.",keywords:["مطاط","مقاومة","band"]};

MACHINES["lateral-band-walk"] = {id:"lateral-band-walk",ar:"مشي جانبي بالمطاط",en:"Lateral Band Walk",group:'strength',muscles:"المؤخرة الجانبية",illustration:"resistance-band",guideYoutubeQuery:"Lateral Band Walk male coach technique",steps:["ضع الشريط فوق الركبتين أو حول الكاحلين حسب قوتك.", "اثنِ الركبتين قليلًا وأبقِ الحوض مستويًا.", "خذ خطوات جانبية قصيرة مع إبقاء الشريط مشدودًا دون سحب القدمين."],warn:"لا تتمايل بالجذع ولا تدع الركبتين تتجهان للداخل.",keywords:["مطاط","مقاومة","band"]};

MACHINES["band-hip-abduction"] = {id:"band-hip-abduction",ar:"فتح الورك واقفًا بالمطاط",en:"Standing Band Hip Abduction",group:'strength',muscles:"المؤخرة الجانبية وثبات الحوض",illustration:"resistance-band",guideYoutubeQuery:"Standing Band Hip Abduction male coach technique",steps:["ضع شريطًا خفيفًا حول الكاحلين وتمسك بدعامة ثابتة.", "حرّك رجلًا إلى الجانب بمدى صغير مع بقاء الحوض مستقيمًا.", "عد ببطء ثم بدّل الجهة."],warn:"لا تمِل بالجذع لتعويض ضعف عضلات الورك.",keywords:["مطاط","مقاومة","band"]};

// أجهزة جديدة من صور النادي. اربط الجهاز القائم بدل تكرار إدخال الصور لنفس المفتاح.
EXERCISE_POOLS.biceps.options.push(opt('biceps-curl-machine','جهاز النادي','بايسبس هامر سترنث الثابت'));
// يظل فتح الورك/فراشة الصدر/كرنش البطن عزلًا مستقلًا، وليس بديلًا مكافئًا للضغط أو البلانك.
const POOL_BY_MACHINE = new Map<string, ExercisePool>();
Object.values(EXERCISE_POOLS).forEach((pool) => pool.options.forEach((o) => POOL_BY_MACHINE.set(o.id, pool)));
export function exercisePoolFor(machineId: string): ExercisePool | null { return POOL_BY_MACHINE.get(machineId) ?? null; }

export const MACHINE_LIST: Machine[] = Object.values(MACHINES);

/** بدائل حسب نمط الحركة، مع بقاء بدائل الكارديو البسيطة. */
export const ALTERNATIVES: Partial<Record<MachineId, { id: MachineId; note: string }[]>> = {};
for (const pool of Object.values(EXERCISE_POOLS)) {
  for (const current of pool.options) {
    ALTERNATIVES[current.id] = pool.options
      .filter((o) => o.id !== current.id)
      .map((o) => ({ id: o.id, note: `${o.tag} · ${o.note}` }));
  }
}
ALTERNATIVES.elliptical = [{ id: 'bike', note: 'الدراجة العادية خيار كارديو عند الحاجة.' }];
ALTERNATIVES['recumbent-bike'] = [{ id: 'bike', note: 'إذا لم تتوفر الدراجة ذات الظهر استخدم الدراجة العادية بنفس المدة.' }];

/** أين يُستخدم الجهاز في البرنامج — يُحسب من بيانات الأيام (انظر program.ts). */



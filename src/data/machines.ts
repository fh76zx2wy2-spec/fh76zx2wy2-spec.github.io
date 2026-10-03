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
  guideYoutubeStartSeconds?: number;
  guideTitle?: string;
  /** العضلات المستهدفة */
  muscles: string;
  /** طريقة الاستخدام (خطوات مختصرة) */
  steps: string[];
  /** تنبيه مهم إن وُجد */
  warn?: string;
  illustration: IllustrationId;
  /** كلمات إضافية للبحث في دليل الأجهزة */
  keywords?: string[];
}

export type MachineId =
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

export const MACHINES: Record<MachineId, Machine> = {
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

export const MACHINE_LIST: Machine[] = Object.values(MACHINES);

/**
 * بدائل معتمدة داخل نطاق الخطة نفسها (لا تُضاف تمارين من خارج البرنامج).
 * تظهر فقط عند ضغط «لا أستطيع استخدام هذا الجهاز».
 * إن لم يوجد بديل معتمد، يعرض الموقع خيار التخطي فقط.
 */
export const ALTERNATIVES: Partial<Record<MachineId, { id: MachineId; note: string }[]>> = {
  'chest-press': [{ id: 'incline-dumbbell-press', note: 'تمرين صدر آخر ضمن Upper B.' }],
  'incline-dumbbell-press': [{ id: 'chest-press', note: 'جهاز صدر ثابت ضمن Upper A.' }],
  'lat-pulldown': [{ id: 'seated-row', note: 'تمرين ظهر آخر ضمن Upper B.' }],
  'seated-row': [{ id: 'lat-pulldown', note: 'تمرين ظهر آخر ضمن Upper A.' }],
  'biceps-curl': [{ id: 'hammer-curl', note: 'تمرين بايسبس آخر ضمن Upper B.' }],
  'hammer-curl': [{ id: 'biceps-curl', note: 'تمرين بايسبس آخر ضمن Upper A.' }],
  'calf-raise': [{ id: 'seated-calf-raise', note: 'رفع السمانة جالسًا ضمن Lower B.' }],
  'seated-calf-raise': [{ id: 'calf-raise', note: 'رفع السمانة واقفًا ضمن Lower A.' }],
  plank: [{ id: 'side-plank', note: 'تمرين جذع آخر ضمن Lower B.' }],
  'side-plank': [{ id: 'plank', note: 'بلانك أمامي ضمن Lower A.' }],
  elliptical: [{ id: 'bike', note: 'الدراجة العادية خيار كارديو عند الحاجة.' }],
  'recumbent-bike': [{ id: 'bike', note: 'إذا لم تتوفر الدراجة ذات الظهر استخدم الدراجة العادية بنفس المدة.' }],
};

/** أين يُستخدم الجهاز في البرنامج — يُحسب من بيانات الأيام (انظر program.ts). */

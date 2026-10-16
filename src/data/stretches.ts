import type { DayId } from './program';

export interface StretchGuide {
  id: string;
  ar: string;
  en: string;
  target: string;
  hold: string;
  steps: string[];
  warning: string;
  youtubeId: string;
  videoTitle: string;
}

export const STRETCHES: Record<string, StretchGuide> = {
  chest: {
    id: 'chest', ar: 'إطالة الصدر عند الإطار', en: 'Doorway Chest Stretch', target: 'الصدر ومقدمة الكتف', hold: '30 ثانية لكل جهة',
    steps: ['قف بجانب إطار ثابت وضع أعلى الذراع عليه مع ثني المرفق قليلًا.', 'اسحب لوح الكتف للخلف بلطف وثبّت الكتف بعيدًا عن الأذن.', 'لف صدرك بعيدًا عن الذراع حتى تشعر بتمدد مريح في الصدر، ثم بدّل الجهة.'],
    warning: 'المطلوب شد مريح في الصدر، وليس ألمًا في مقدمة مفصل الكتف.', youtubeId: 'LB4CxC7Ckbw', videoTitle: 'Chest stretch — ATHLEAN-X (مدرب رجل)',
  },
  shoulderCross: {
    id: 'shoulderCross', ar: 'إطالة الكتف عبر الصدر', en: 'Cross-Body Shoulder Stretch', target: 'الكتف الخلفي وأعلى الظهر', hold: '30 ثانية لكل جهة',
    steps: ['قف أو اجلس باستقامة وارفع ذراعًا أمامك بمستوى الكتف.', 'مرّر الذراع أمام الصدر وامسكها بالذراع الأخرى فوق المرفق قليلًا.', 'اسحبها نحو الصدر بلطف مع إبقاء الكتف منخفضًا والجذع ثابتًا، ثم بدّل الجهة.'],
    warning: 'لا تلف الجذع ولا تضغط مباشرة على مفصل المرفق.', youtubeId: 'sOuKeVuej9E', videoTitle: 'Upper-body mobility — Jeremy Ethier (مدرب رجل)',
  },
  triceps: {
    id: 'triceps', ar: 'إطالة الترايسبس فوق الرأس', en: 'Overhead Triceps Stretch', target: 'خلف الذراع والكتف', hold: '20–30 ثانية لكل جهة',
    steps: ['ارفع ذراعك للأعلى ثم اثنِ المرفق واجعل اليد خلف الرأس/أعلى الظهر.', 'ضع اليد الأخرى على المرفق.', 'اضغط المرفق بلطف إلى الداخل والخلف مع إبقاء الصدر مرفوعًا، ثم بدّل الجهة.'],
    warning: 'لا تدفع المرفق بقوة ولا تقوّس أسفل الظهر.', youtubeId: 'cPTrm13hSSo', videoTitle: 'Overhead Triceps Stretch — PureGym (مدرب رجل)',
  },
  childsPose: {
    id: 'childsPose', ar: 'وضعية الطفل', en: "Child's Pose", target: 'الظهر واللات والكتفين', hold: '30–45 ثانية',
    steps: ['اجثُ على الأرض واجلس بالحوض باتجاه الكعبين.', 'مد الذراعين للأمام وضع الكفين على الأرض.', 'اخفض الصدر والرأس قدر المريح وتنفس ببطء، ويمكن تحريك اليدين يمينًا ويسارًا لاستهداف الجانبين.'],
    warning: 'إذا ضايقت الركبتين، وسّع المسافة بينهما أو لا تنزل للحوض كاملًا.', youtubeId: 'sOuKeVuej9E', videoTitle: 'Mobility & stretching — Jeremy Ethier (مدرب رجل)',
  },
  quad: {
    id: 'quad', ar: 'إطالة الفخذ الأمامي واقفًا', en: 'Standing Quad Stretch', target: 'الفخذ الأمامي', hold: '30 ثانية لكل رجل',
    steps: ['قف بجانب دعامة للتوازن.', 'اثنِ ركبة واحدة وأمسك الكاحل/القدم خلفك.', 'قرّب الكعب من المؤخرة مع بقاء الركبتين متقاربتين والحوض مستقيمًا، ثم بدّل الرجل.'],
    warning: 'لا تسحب القدم بعنف ولا تدع الركبة تندفع للخارج.', youtubeId: 'kzAsm4WQqvQ', videoTitle: 'Standing Quad Stretch — PureGym (مدرب رجل)',
  },
  calf: {
    id: 'calf', ar: 'إطالة السمانة على الجدار', en: 'Wall Calf Stretch', target: 'السمانة والكاحل', hold: '30 ثانية لكل رجل',
    steps: ['ضع يديك على الجدار وخذ خطوة للخلف برجل واحدة.', 'اجعل القدم الخلفية مستقيمة والكعب ملاصقًا للأرض وأصابع القدم للأمام.', 'اثنِ الركبة الأمامية وتحرك للأمام حتى تشعر بالتمدد في السمانة، ثم بدّل.'],
    warning: 'الكعب الخلفي يبقى على الأرض؛ لا تلف القدم للخارج.', youtubeId: '_Iy3DyS_NNY', videoTitle: 'Lower-body stretching — Bob & Brad (مدربان)',
  },
  figure4: {
    id: 'figure4', ar: 'إطالة Figure 4', en: 'Figure-4 Glute Stretch', target: 'المؤخرة والورك', hold: '30 ثانية لكل جهة',
    steps: ['استلقِ على ظهرك واثنِ الركبتين.', 'ضع كاحل رجل فوق فخذ الرجل الأخرى لتشكل رقم 4.', 'اسحب الفخذ السفلي نحو صدرك بلطف حتى تشعر بالتمدد في المؤخرة، ثم بدّل الجهة.'],
    warning: 'لا تضغط على الركبة المرفوعة؛ الحركة تأتي من الورك.', youtubeId: '_Iy3DyS_NNY', videoTitle: 'Lower-body stretching — Bob & Brad (مدربان)',
  },
  forwardFold: {
    id: 'forwardFold', ar: 'انحناء أمامي للهامسترنغ', en: 'Standing Forward Fold', target: 'الفخذ الخلفي وأسفل الظهر بلطف', hold: 'حوالي 30 ثانية',
    steps: ['قف والقدمان بعرض الوركين والركبتان غير مقفلتين.', 'ابدأ الحركة من مفصل الورك وانحنِ للأمام مع إرخاء الرأس والكتفين.', 'توقف عند أول شد مريح في خلف الفخذ، ويمكن ثني الركبتين قليلًا.'],
    warning: 'لا تجبر اليدين للوصول للأرض ولا ترتد لأعلى وأسفل.', youtubeId: 'goN4rWbQUn4', videoTitle: 'Standing Forward Fold — Group HIIT (مدرب رجل)',
  },
};

const UPPER = ['chest', 'shoulderCross', 'triceps', 'childsPose'];
const LOWER = ['quad', 'calf', 'figure4', 'forwardFold'];

export function stretchesForDay(day: DayId | null): StretchGuide[] {
  return (day === 1 || day === 3 ? UPPER : LOWER).map((id) => STRETCHES[id]);
}

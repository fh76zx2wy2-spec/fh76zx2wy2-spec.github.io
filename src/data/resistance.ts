/** 45/4 v1.7.0 — روتين المطاط وأجهزة النادي الموثقة بالصور؛ لا يغيّر بيانات الأعضاء أو الاشتراكات. */
import type { DayId } from './program';
export type ResistanceItem = { machineId: string; seconds: number };
export type ClubDevice = { machineId: string; note: string };
export const RESISTANCE_BY_DAY: Record<DayId, ResistanceItem[]> = {
  1: [{machineId:'band-chest-press',seconds:100},{machineId:'band-pull-apart',seconds:100},{machineId:'band-triceps-pushdown',seconds:100}],
  2: [{machineId:'mini-band-squat-hold',seconds:100},{machineId:'band-hamstring-curl',seconds:100},{machineId:'band-calf-raise',seconds:100}],
  3: [{machineId:'band-row',seconds:100},{machineId:'band-biceps-curl',seconds:100},{machineId:'band-rear-face-pull',seconds:100}],
  4: [{machineId:'band-glute-bridge',seconds:100},{machineId:'lateral-band-walk',seconds:100},{machineId:'band-hip-abduction',seconds:100}],
};
export const CLUB_BY_DAY: Record<DayId, ClubDevice[]> = {
  1: [{machineId:"pec-deck",note:"فراشة الصدر: عزل اختياري، وليس بديلًا مطابقًا للضغط"},{machineId:"biceps-curl-machine",note:"بايسبس على جهاز النادي"}],
  2: [{machineId:"leg-extension",note:"الفخذ الأمامي: إضافة اختيارية"},{machineId:"leg-curl",note:"الفخذ الخلفي جلوس"},{machineId:"lying-leg-curl",note:"بديل للفخذ الخلفي مستلقيًا"},{machineId:"standing-calf-machine",note:"بديل للسمانة"},{machineId:"machine-crunch",note:"كرنش البطن: تمرين إضافي وليس بديل البلانك"}],
  3: [{machineId:"pec-deck",note:"عزل الصدر اختياري عند وجود وقت"},{machineId:"biceps-curl-machine",note:"بديل مباشر للبايسبس"}],
  4: [{machineId:"hip-abduction-machine",note:"المؤخرة الجانبية: فتح الورك، لا يُستبدل به Hip Thrust"},{machineId:"lying-leg-curl",note:"بديل للفخذ الخلفي"},{machineId:"machine-crunch",note:"عزل بطن إضافي وليس بديل بلانك جانبي"}],
};
export const RESISTANCE_MINUTES = 5;

export type FallbackIllustration = { vb: string; body: string };

type Kind =
  | 'chest-horizontal'
  | 'chest-incline'
  | 'pulldown'
  | 'row'
  | 'shoulder-press'
  | 'rear-delt'
  | 'curl'
  | 'triceps-pushdown'
  | 'overhead-triceps'
  | 'dip'
  | 'squat'
  | 'leg-curl'
  | 'split-squat'
  | 'calf'
  | 'hip-thrust'
  | 'pull-through'
  | 'dead-bug'
  | 'bird-dog'
  | 'pallof'
  | 'crunch'
  | 'plank'
  | 'side-plank'
  | 'rowing-cardio'
  | 'stairs-cardio'
  | 'recumbent-cardio'
  | 'warmup-track';

type Equip = 'machine' | 'dumbbell' | 'cable' | 'smith' | 'plate' | 'bodyweight' | 'barbell' | 'band' | 'landmine' | 'step';

const VB = '0 0 150 110';
const S1 = 'var(--il-p)';
const S2 = 'var(--il-p2)';
const METAL = 'var(--il-m)';
const METAL2 = 'var(--il-m2)';
const ACCENT = 'var(--il-t)';
const FLOOR = 'var(--il-floor)';

const line = (x1: number, y1: number, x2: number, y2: number, stroke = S1, w = 5) => `<path d="M${x1} ${y1} L${x2} ${y2}" style="fill:none;stroke:${stroke};stroke-width:${w};stroke-linecap:round;stroke-linejoin:round"/>`;
const poly = (pts: string, stroke = S1, w = 5) => `<path d="M${pts}" style="fill:none;stroke:${stroke};stroke-width:${w};stroke-linecap:round;stroke-linejoin:round"/>`;
const rect = (x: number, y: number, w: number, h: number, fill = 'none', stroke = METAL, sw = 3, rx = 2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" style="fill:${fill};stroke:${stroke};stroke-width:${sw}"/>`;
const circ = (x: number, y: number, r: number, fill = S1, stroke = 'none', sw = 0) => `<circle cx="${x}" cy="${y}" r="${r}" style="fill:${fill};stroke:${stroke};stroke-width:${sw}"/>`;
const arrow = (x1: number, y1: number, x2: number, y2: number, stroke = ACCENT) => `${line(x1, y1, x2, y2, stroke, 2.6)}${line(x2, y2, x2 - (x2 > x1 ? 4 : -4), y2 - 4, stroke, 2.6)}${line(x2, y2, x2 - (x2 > x1 ? 4 : -4), y2 + 4, stroke, 2.6)}`;

const floor = () => `<rect x="8" y="99" width="134" height="3" rx="1.5" style="fill:${FLOOR}"/>`;

function badge(equip: Equip) {
  const shell = `<circle cx="124" cy="22" r="15" style="fill:#fff;fill-opacity:.8;stroke:${METAL};stroke-width:1.4"/>`;
  switch (equip) {
    case 'dumbbell':
      return `${shell}${line(116,22,132,22,METAL2,3)}${rect(114,18,3,8,METAL2,METAL2,0,1)}${rect(133,18,3,8,METAL2,METAL2,0,1)}${rect(111,17,2,10,METAL2,METAL2,0,1)}${rect(137,17,2,10,METAL2,METAL2,0,1)}`;
    case 'cable':
      return `${shell}${line(120,13,120,31,METAL2,2.4)}${circ(120,16,2,METAL2)}${line(120,16,130,24,METAL2,2.4)}${circ(130,24,2,METAL2)}${line(130,24,130,31,S2,2.4)}`;
    case 'smith':
      return `${shell}${line(118,11,118,33,METAL2,2.4)}${line(130,11,130,33,METAL2,2.4)}${line(116,18,132,18,S2,3)}`;
    case 'plate':
      return `${shell}${line(116,22,132,22,METAL2,3)}${circ(114,22,3,'none',METAL2,2.2)}${circ(134,22,3,'none',METAL2,2.2)}${circ(111,22,2.1,'none',METAL2,2)}${circ(137,22,2.1,'none',METAL2,2)}`;
    case 'barbell':
      return `${shell}${line(114,22,134,22,METAL2,3)}${rect(111,18,2,8,METAL2,METAL2,0,1)}${rect(135,18,2,8,METAL2,METAL2,0,1)}`;
    case 'band':
      return `${shell}<path d="M116 24 Q124 10 132 24" style="fill:none;stroke:${S2};stroke-width:3;stroke-linecap:round"/>`;
    case 'landmine':
      return `${shell}${line(116,28,132,16,METAL2,3)}${circ(114,30,2.6,METAL2)}${circ(134,14,2.6,METAL2)}`;
    case 'step':
      return `${shell}${rect(116,24,16,4,METAL2,METAL2,0,1)}${rect(120,20,12,4,METAL, METAL,0,1)}`;
    case 'bodyweight':
      return `${shell}${circ(124,17,3,S1)}${line(124,20,124,29,S1,2.8)}${line(124,22,118,26,S2,2.2)}${line(124,22,130,26,S2,2.2)}${line(124,29,119,33,S2,2.2)}${line(124,29,129,33,S2,2.2)}`;
    default:
      return `${shell}${rect(116,16,16,12,'none',METAL2,2.2,2)}${line(120,30,128,30,METAL2,2.2)}`;
  }
}

function humanStanding() {
  return `${circ(72,24,7)}${line(72,32,72,58,S1,8)}${line(72,40,58,52,S2,5)}${line(72,40,87,49,S1,5)}${line(72,58,63,88,S2,6)}${line(72,58,82,88,S1,6)}`;
}

function humanSeatedPull() {
  return `${circ(82,27,7)}${line(82,35,78,54,S1,8)}${line(78,54,70,79,S2,6)}${line(78,54,90,78,S1,6)}${line(80,41,96,37,S2,5)}${line(80,43,63,45,S1,5)}${rect(56,80,20,4,METAL2,METAL2,0,1)}${line(58,80,58,60,METAL,4)}`;
}

function humanSeatedPress() {
  return `${circ(66,30,7)}${line(66,38,66,58,S1,8)}${line(66,58,58,84,S2,6)}${line(66,58,78,82,S1,6)}${line(66,44,52,36,S2,5)}${line(66,44,82,36,S1,5)}${rect(48,82,22,4,METAL2,METAL2,0,1)}${line(50,82,50,60,METAL,4)}`;
}

function chestHorizontal(equip: Equip) {
  return `${floor()}${badge(equip)}${rect(40,70,32,5,METAL2,METAL2,0,1)}${line(48,70,36,89,METAL,4)}${line(66,70,78,89,METAL,4)}${line(72,66,102,66,METAL,3)}${circ(86,44,7)}${line(82,48,66,58,S1,7)}${line(66,58,55,78,S2,6)}${line(66,58,76,77,S1,6)}${line(70,56,96,51,S2,5)}${line(70,56,98,59,S1,5)}${equip === 'dumbbell' ? `${circ(101,51,3,'none',METAL2,2)}${circ(104,59,3,'none',METAL2,2)}` : ''}${equip === 'cable' ? `${line(108,36,108,86,METAL,3)}${line(98,51,108,45,METAL2,2.6)}${line(98,59,108,61,S2,2.6)}` : ''}${equip === 'smith' || equip === 'barbell' ? `${line(98,50,112,50,METAL2,3)}${line(112,34,112,86,METAL,3)}` : ''}${equip === 'plate' ? `${line(98,55,111,55,METAL2,3)}${circ(114,55,3,'none',METAL2,2)}${circ(118,55,2,'none',METAL2,2)}` : ''}${equip === 'machine' ? `${rect(104,44,12,20,'none',METAL,2,2)}${line(102,55,104,55,METAL2,2.4)}` : ''}`;
}

function chestIncline(equip: Equip) {
  return `${floor()}${badge(equip)}${poly('48 77 L71 63',METAL2,4)}${line(54,76,43,90,METAL,4)}${line(66,66,76,89,METAL,4)}${circ(84,44,7)}${line(80,48,67,57,S1,7)}${line(67,57,58,80,S2,6)}${line(67,57,80,77,S1,6)}${line(71,55,95,45,S2,5)}${line(71,55,99,50,S1,5)}${equip === 'dumbbell' ? `${circ(98,45,3,'none',METAL2,2)}${circ(102,50,3,'none',METAL2,2)}` : ''}${equip === 'cable' ? `${line(110,30,110,86,METAL,3)}${line(95,45,110,38,S2,2.4)}${line(99,50,110,52,S1,2.4)}` : ''}${equip === 'smith' || equip === 'barbell' ? `${line(96,48,115,43,METAL2,3)}${line(115,28,115,86,METAL,3)}` : ''}${equip === 'plate' ? `${line(96,48,112,44,METAL2,3)}${circ(116,43,3,'none',METAL2,2)}${circ(120,42,2,'none',METAL2,2)}` : ''}${equip === 'machine' ? `${rect(106,37,13,18,'none',METAL,2,2)}${line(97,47,106,46,METAL2,2.4)}` : ''}${arrow(106,63,120,52)}`;
}

function pulldown(equip: Equip) {
  return `${floor()}${badge(equip)}${line(44,14,44,91,METAL,4)}${line(44,14,105,14,METAL,4)}${line(96,14,96,31,METAL2,3)}${line(60,82,82,82,METAL2,4)}${line(64,82,64,60,METAL,4)}${circ(74,30,7)}${line(74,38,74,60,S1,8)}${line(74,60,67,88,S2,6)}${line(74,60,86,86,S1,6)}${line(74,44,60,30,S2,5)}${line(74,44,88,31,S1,5)}${line(58,31,90,31,METAL2,3)}${arrow(58,25,58,40)}${arrow(90,25,90,40)}${equip === 'bodyweight' ? `${line(58,18,90,18,METAL2,3)}${line(72,18,72,25,S2,2.5)}${line(76,18,76,25,S1,2.5)}` : ''}${equip === 'cable' ? `${line(96,31,96,41,S2,2.5)}${circ(96,44,2.5,METAL2)}` : ''}`;
}

function row(equip: Equip) {
  return `${floor()}${badge(equip)}${line(30,84,55,84,METAL2,4)}${line(53,84,53,60,METAL,4)}${circ(75,29,7)}${line(75,37,71,56,S1,8)}${line(71,56,60,85,S2,6)}${line(71,56,83,83,S1,6)}${line(73,43,92,40,S2,5)}${line(73,44,56,46,S1,5)}${equip === 'dumbbell' ? `${line(88,40,98,48,METAL2,3)}${circ(101,50,3,'none',METAL2,2)}` : ''}${equip === 'cable' ? `${line(104,40,120,40,METAL,3)}${line(120,15,120,91,METAL,3)}${line(92,40,104,40,S2,2.6)}` : ''}${equip === 'machine' ? `${rect(98,34,18,16,'none',METAL,2,2)}${line(92,40,98,40,S2,2.6)}` : ''}${equip === 'plate' ? `${rect(94,34,14,18,'none',METAL,2,2)}${circ(111,42,3,'none',METAL2,2)}` : ''}${arrow(47,44,58,44)}`;
}

function shoulderPress(equip: Equip) {
  return `${floor()}${badge(equip)}${rect(52,82,22,4,METAL2,METAL2,0,1)}${line(54,82,54,60,METAL,4)}${circ(66,30,7)}${line(66,38,66,58,S1,8)}${line(66,58,58,86,S2,6)}${line(66,58,78,85,S1,6)}${line(66,42,56,24,S2,5)}${line(66,42,78,24,S1,5)}${equip === 'dumbbell' ? `${circ(54,22,3,'none',METAL2,2)}${circ(80,22,3,'none',METAL2,2)}` : ''}${equip === 'cable' ? `${line(50,18,50,86,METAL,3)}${line(82,18,82,86,METAL,3)}${line(56,24,50,24,S2,2.5)}${line(78,24,82,24,S1,2.5)}` : ''}${equip === 'smith' || equip === 'barbell' ? `${line(52,22,82,22,METAL2,3)}${line(52,10,52,86,METAL,3)}${line(82,10,82,86,METAL,3)}` : ''}${equip === 'machine' || equip === 'plate' ? `${rect(44,18,10,18,'none',METAL,2,2)}${rect(78,18,10,18,'none',METAL,2,2)}` : ''}${equip === 'landmine' ? `${line(80,28,110,18,METAL2,3)}${circ(112,17,3,METAL2)}${line(78,24,80,28,S1,2.5)}` : ''}${arrow(56,20,56,10)}${arrow(78,20,78,10)}`;
}

function rearDelt(equip: Equip) {
  return `${floor()}${badge(equip)}${rect(54,82,22,4,METAL2,METAL2,0,1)}${line(56,82,56,60,METAL,4)}${circ(66,30,7)}${line(66,38,66,58,S1,8)}${line(66,58,58,86,S2,6)}${line(66,58,78,85,S1,6)}${line(66,42,48,35,S2,5)}${line(66,42,84,35,S1,5)}${line(48,35,40,46,S2,4)}${line(84,35,92,46,S1,4)}${equip === 'cable' || equip === 'band' ? `${line(40,15,40,85,METAL,3)}${line(92,15,92,85,METAL,3)}` : ''}${equip === 'machine' ? `${rect(39,28,8,22,'none',METAL,2,2)}${rect(85,28,8,22,'none',METAL,2,2)}` : ''}${arrow(46,34,36,34)}${arrow(86,34,96,34)}`;
}

function curl(equip: Equip) {
  return `${floor()}${badge(equip)}${humanStanding()}${line(87,49,95,40,S1,5)}${equip === 'dumbbell' ? `${circ(98,38,3,'none',METAL2,2)}` : ''}${equip === 'barbell' ? `${line(90,42,108,42,METAL2,3)}${rect(109,38,2,8,METAL2,METAL2,0,1)}` : ''}${equip === 'cable' ? `${line(98,38,118,38,METAL,3)}${line(118,18,118,91,METAL,3)}` : ''}${equip === 'machine' ? `${rect(90,33,18,18,'none',METAL,2,2)}` : ''}${arrow(92,48,98,36)}`;
}

function tricepsPushdown(equip: Equip) {
  return `${floor()}${badge(equip)}${humanStanding()}${line(95,14,95,90,METAL,3)}${line(74,42,92,36,S2,5)}${line(73,43,92,46,S1,5)}${line(92,36,92,51,METAL2,2.6)}${line(92,46,92,59,METAL2,2.6)}${equip === 'bodyweight' ? `${line(92,38,107,38,METAL,3)}${line(92,58,107,58,METAL,3)}` : ''}${arrow(92,40,92,58)}`;
}

function overheadTriceps(equip: Equip) {
  return `${floor()}${badge(equip)}${humanStanding()}${line(72,40,68,19,S2,5)}${line(72,40,80,18,S1,5)}${equip === 'dumbbell' || equip === 'barbell' ? `${line(66,17,82,17,METAL2,3)}${circ(64,17,2.5,'none',METAL2,2)}${circ(84,17,2.5,'none',METAL2,2)}` : ''}${equip === 'cable' ? `${line(94,14,94,90,METAL,3)}${line(80,18,94,18,S1,2.6)}` : ''}${arrow(76,20,76,10)}`;
}

function dip() {
  return `${floor()}${badge('bodyweight')}${line(42,36,42,82,METAL,4)}${line(86,36,86,82,METAL,4)}${line(42,48,56,48,METAL2,3)}${line(72,48,86,48,METAL2,3)}${circ(64,24,7)}${line(64,32,64,57,S1,8)}${line(64,57,56,84,S2,6)}${line(64,57,73,84,S1,6)}${line(64,42,54,49,S2,5)}${line(64,42,74,49,S1,5)}${arrow(98,24,98,41)}`;
}

function squat(equip: Equip) {
  return `${floor()}${badge(equip)}${circ(72,23,7)}${line(72,31,72,54,S1,8)}${line(72,54,58,75,S2,6)}${line(58,75,58,93,S2,6)}${line(72,54,86,75,S1,6)}${line(86,75,86,93,S1,6)}${line(72,39,59,46,S2,5)}${line(72,39,85,33,S1,5)}${equip === 'smith' || equip === 'barbell' ? `${line(54,18,90,18,METAL2,3)}${line(54,8,54,94,METAL,3)}${line(90,8,90,94,METAL,3)}` : ''}${equip === 'dumbbell' ? `${circ(56,47,3,'none',METAL2,2)}${circ(88,34,3,'none',METAL2,2)}` : ''}${equip === 'plate' || equip === 'machine' ? `${rect(92,28,14,22,'none',METAL,2,2)}${rect(38,44,12,18,'none',METAL,2,2)}` : ''}${equip === 'step' ? `${rect(54,92,32,4,METAL2,METAL2,0,1)}` : ''}${arrow(104,24,104,40)}`;
}

function legCurl(equip: Equip) {
  return `${floor()}${badge(equip)}${rect(34,70,28,5,METAL2,METAL2,0,1)}${line(40,70,33,89,METAL,4)}${line(56,70,63,89,METAL,4)}${circ(79,44,7)}${line(75,48,60,59,S1,7)}${line(60,59,49,77,S2,6)}${line(60,59,76,78,S1,6)}${line(60,59,94,57,S2,5)}${line(94,57,106,67,S1,5)}${line(106,67,98,79,S2,5)}${equip === 'cable' ? `${line(114,18,114,90,METAL,3)}${line(104,67,114,61,S2,2.6)}` : ''}${equip === 'bodyweight' ? `${rect(98,76,10,4,METAL2,METAL2,0,1)}` : ''}${equip === 'machine' ? `${rect(98,53,12,18,'none',METAL,2,2)}` : ''}${arrow(105,66,96,58)}`;
}

function splitSquat(equip: Equip) {
  return `${floor()}${badge(equip)}${circ(78,24,7)}${line(78,32,76,54,S1,8)}${line(76,54,62,78,S2,6)}${line(62,78,48,92,S2,6)}${line(76,54,91,72,S1,6)}${line(91,72,96,92,S1,6)}${line(76,41,62,48,S2,5)}${line(76,41,88,36,S1,5)}${equip === 'step' ? `${rect(90,72,20,4,METAL2,METAL2,0,1)}` : ''}${equip === 'dumbbell' ? `${circ(59,50,3,'none',METAL2,2)}${circ(90,36,3,'none',METAL2,2)}` : ''}${equip === 'smith' ? `${line(96,20,96,92,METAL,3)}${line(53,20,53,92,METAL,3)}${line(58,30,88,30,METAL2,3)}` : ''}${arrow(102,24,110,16)}`;
}

function calf() {
  return `${floor()}${badge('bodyweight')}${circ(74,24,7)}${line(74,32,74,58,S1,8)}${line(74,58,68,88,S2,6)}${line(74,58,84,88,S1,6)}${line(74,40,60,49,S2,5)}${line(74,40,88,36,S1,5)}${rect(66,92,26,4,METAL2,METAL2,0,1)}${arrow(105,78,105,62)}`;
}

function hipThrust(equip: Equip) {
  const person = `${circ(63,52,7)}${line(58,56,47,62,S1,7)}${line(47,62,69,62,S2,7)}${line(69,62,93,62,S1,7)}${line(47,62,37,86,S2,6)}${line(93,62,105,85,S1,6)}`;
  const bench = `${rect(34,63,24,5,METAL2,METAL2,0,1)}${line(39,63,31,84,METAL,4)}${line(53,63,61,84,METAL,4)}`;
  const device = equip === 'plate'
    ? `${rect(31,64,29,6,METAL2,METAL2,0,1)}${line(37,69,29,91,METAL,4)}${line(102,48,120,48,METAL2,5)}${line(118,48,118,90,METAL,4)}${circ(121,48,7,'none',METAL2,3)}${rect(112,87,18,6,METAL2,METAL2,0,1)}${line(68,56,96,56,METAL2,5)}`
    : equip === 'smith'
    ? `${bench}${line(110,17,110,91,METAL,4)}${line(24,17,24,91,METAL,4)}${line(26,55,110,55,METAL2,4)}${circ(24,55,6,'none',METAL2,2)}${circ(110,55,6,'none',METAL2,2)}`
    : equip === 'barbell'
    ? `${bench}${line(70,54,112,54,METAL2,4)}${circ(68,54,6,'none',METAL2,2)}${circ(114,54,6,'none',METAL2,2)}${circ(120,54,3,'none',METAL2,1.8)}`
    : equip === 'machine'
    ? `${rect(35,80,84,6,METAL2,METAL2,0,2)}${line(38,79,30,91,METAL,4)}${line(112,80,119,91,METAL,4)}${rect(36,60,22,5,METAL2,METAL2,0,1)}${line(69,54,106,54,METAL2,6)}${line(106,54,116,78,METAL,4)}${rect(114,76,13,4,METAL2,METAL2,0,1)}`
    : bench;
  return `${floor()}${badge(equip)}${device}${person}${arrow(70,75,70,58)}`;
}

function pullThrough() {
  return `${floor()}${badge('cable')}${line(108,14,108,90,METAL,3)}${circ(64,24,7)}${line(64,32,64,57,S1,8)}${line(64,57,55,87,S2,6)}${line(64,57,79,84,S1,6)}${line(64,43,54,52,S2,5)}${line(64,43,77,51,S1,5)}${line(77,51,96,66,METAL2,3)}${line(96,66,108,58,S2,2.6)}${arrow(86,68,74,56)}`;
}

function deadBug() {
  return `${floor()}${badge('bodyweight')}${circ(54,53,7)}${line(60,56,81,56,S1,8)}${line(81,56,101,46,S1,6)}${line(81,56,101,72,S2,6)}${line(52,60,37,74,S2,5)}${line(53,48,37,34,S1,5)}${arrow(101,46,114,36)}${arrow(101,72,114,82)}`;
}

function birdDog() {
  return `${floor()}${badge('bodyweight')}${circ(66,33,7)}${line(61,38,50,52,S1,6)}${line(50,52,68,62,S2,6)}${line(68,62,91,54,S1,6)}${line(54,54,50,86,S2,6)}${line(72,63,79,88,S1,6)}${arrow(92,54,109,49)}${arrow(50,86,40,94)}`;
}

function pallof() {
  return `${floor()}${badge('cable')}${line(112,14,112,90,METAL,3)}${circ(67,24,7)}${line(67,32,67,58,S1,8)}${line(67,58,60,88,S2,6)}${line(67,58,79,88,S1,6)}${line(67,44,88,44,S2,5)}${line(88,44,112,44,METAL2,2.6)}${arrow(88,44,101,44)}`;
}

function crunch(equip: Equip) {
  return `${floor()}${badge(equip)}${rect(44,82,24,4,METAL2,METAL2,0,1)}${line(48,82,48,56,METAL,4)}${circ(74,30,7)}${line(74,38,68,55,S1,8)}${line(68,55,58,86,S2,6)}${line(68,55,80,84,S1,6)}${line(70,40,55,34,S2,5)}${line(70,41,84,36,S1,5)}${equip === 'cable' ? `${line(105,14,105,91,METAL,3)}${line(84,36,105,24,METAL2,2.6)}` : `${rect(86,26,16,20,'none',METAL,2,2)}`}${arrow(90,28,82,40)}`;
}

function plank() {
  return `${floor()}${badge('bodyweight')}${circ(40,64,7)}${line(47,66,76,60,S1,8)}${line(76,60,111,64,S1,7)}${line(46,69,46,87,S2,6)}${line(111,64,121,89,S2,6)}${arrow(78,48,98,48)}`;
}

function sidePlank() {
  return `${floor()}${badge('bodyweight')}${circ(44,50,7)}${line(49,55,73,63,S1,8)}${line(73,63,104,77,S1,7)}${line(49,62,38,88,S2,6)}${line(71,63,72,37,S2,6)}${line(104,77,115,90,S2,6)}${arrow(72,38,72,22)}`;
}

function rowingCardio() {
  return `${floor()}${badge('machine')}${rect(23,80,104,5,METAL2,METAL2,0,1)}${line(33,82,27,91,METAL,4)}${line(116,82,121,91,METAL,4)}${circ(102,64,8,'none',METAL2,3)}${circ(62,30,7)}${line(62,38,69,56,S1,8)}${line(69,56,56,78,S2,6)}${line(69,56,79,78,S1,6)}${line(64,44,91,49,S2,5)}${line(91,49,107,58,METAL,2.6)}${arrow(98,37,82,37)}`;
}

function stairsCardio() {
  return `${floor()}${badge('machine')}${rect(68,80,60,5,METAL2,METAL2,0,1)}${rect(80,70,45,9,METAL,METAL,0,1)}${rect(93,60,32,9,METAL,METAL,0,1)}${circ(67,25,7)}${line(67,33,69,55,S1,8)}${line(69,55,83,76,S1,6)}${line(69,55,55,77,S2,6)}${line(69,41,89,39,S1,5)}${line(89,39,118,39,METAL2,3)}${arrow(105,54,105,40)}`;
}

function recumbentCardio() {
  return `${floor()}${badge('machine')}${rect(40,65,30,5,METAL2,METAL2,0,1)}${line(42,65,31,49,METAL,4)}${line(47,71,45,87,METAL,4)}${circ(71,39,7)}${line(67,46,57,65,S1,8)}${line(57,65,67,79,S2,6)}${line(57,65,93,74,S1,6)}${line(67,47,81,57,S2,5)}${line(93,74,107,69,METAL2,3)}${circ(110,73,13,'none',METAL2,3)}${line(109,74,120,84,METAL2,3)}`;
}

function warmupTrack() {
  return `${floor()}${badge('bodyweight')}${circ(65,24,7)}${line(65,32,77,55,S1,8)}${line(76,54,96,81,S1,6)}${line(75,54,55,79,S2,6)}${line(68,39,52,53,S2,5)}${line(68,39,88,31,S1,5)}${arrow(94,46,112,46)}`;
}

function inferKind(id: string): { kind: Kind; equip: Equip } {
  const s = id.toLowerCase();
  const equip: Equip = s.includes('dumbbell') ? 'dumbbell'
    : s.includes('cable') ? 'cable'
    : s.includes('smith') ? 'smith'
    : s.includes('plate-loaded') || s.includes('plate-loaded') || s.includes('glute-drive-machine') ? 'plate'
    : s.includes('barbell') ? 'barbell'
    : s.includes('band') ? 'band'
    : s.includes('landmine') ? 'landmine'
    : s.includes('step-up') ? 'step'
    : s.includes('assisted') || s.includes('single-leg-calf-raise') || s.includes('goblet') || s.includes('dead-bug') || s.includes('bird-dog') || s.includes('pallof') ? 'bodyweight'
    : s.includes('pushdown') || s.includes('vbar') ? 'cable'
    : s.includes('machine') || s.includes('neutral') || s.includes('converging') || s.includes('drive') ? 'machine'
    : 'machine';

  if (s === 'rower') return { kind: 'rowing-cardio', equip: 'machine' };
  if (s === 'stair-climber') return { kind: 'stairs-cardio', equip: 'machine' };
  if (s === 'recumbent-bike') return { kind: 'recumbent-cardio', equip: 'machine' };
  if (s === 'warmup-track') return { kind: 'warmup-track', equip: 'bodyweight' };
  if (s === 'side-plank') return { kind: 'side-plank', equip: 'bodyweight' };
  if (s === 'plank') return { kind: 'plank', equip: 'bodyweight' };
  if (s.includes('dead-bug')) return { kind: 'dead-bug', equip };
  if (s.includes('bird-dog')) return { kind: 'bird-dog', equip };
  if (s.includes('pallof')) return { kind: 'pallof', equip: 'cable' };
  if (s.includes('crunch')) return { kind: 'crunch', equip: s.includes('cable') ? 'cable' : 'machine' };
  if (s.includes('hip-thrust') || s.includes('glute-drive') || s.includes('glute-bridge-machine')) return { kind: 'hip-thrust', equip: s === 'hip-thrust' ? 'bodyweight' : s.includes('barbell') ? 'barbell' : s.includes('smith') ? 'smith' : s.includes('cable') ? 'cable' : s.includes('glute-drive') ? 'plate' : s.includes('machine') ? 'machine' : equip };
  if (s.includes('pull-through')) return { kind: 'pull-through', equip: 'cable' };
  if (s.includes('calf')) return { kind: 'calf', equip };
  if (s.includes('split-squat') || s.includes('lunge') || s.includes('step-up')) return { kind: 'split-squat', equip };
  if (s.includes('leg-curl') || s.includes('nordic')) return { kind: 'leg-curl', equip };
  if (s.includes('squat') || s.includes('legpress') || s.includes('single-leg-press')) return { kind: 'squat', equip };
  if (s.includes('triceps') || s.includes('dip')) return s.includes('overhead') ? { kind: 'overhead-triceps', equip } : s.includes('dip') ? { kind: 'dip', equip: 'bodyweight' } : { kind: 'triceps-pushdown', equip: equip === 'dumbbell' ? 'dumbbell' : equip };
  if (s.includes('curl')) return { kind: 'curl', equip: s.includes('ezbar') ? 'barbell' : equip };
  if (s.includes('rear-delt') || s.includes('face-pull') || s.includes('pec-deck')) return { kind: 'rear-delt', equip };
  if (s.includes('shoulder-press') || s.includes('arnold') || s.includes('landmine-press')) return { kind: 'shoulder-press', equip };
  if (s.includes('row')) return { kind: 'row', equip };
  if (s.includes('pulldown') || s.includes('pullup') || s.includes('pullover')) return { kind: 'pulldown', equip };
  if (s.includes('incline')) return { kind: 'chest-incline', equip };
  return { kind: 'chest-horizontal', equip };
}

export function buildFallbackIllustration(id: string): FallbackIllustration {
  const { kind, equip } = inferKind(id);
  const body = {
    'chest-horizontal': chestHorizontal(equip),
    'chest-incline': chestIncline(equip),
    pulldown: pulldown(equip),
    row: row(equip),
    'shoulder-press': shoulderPress(equip),
    'rear-delt': rearDelt(equip),
    curl: curl(equip),
    'triceps-pushdown': tricepsPushdown(equip),
    'overhead-triceps': overheadTriceps(equip),
    dip: dip(),
    squat: squat(equip),
    'leg-curl': legCurl(equip),
    'split-squat': splitSquat(equip),
    calf: calf(),
    'hip-thrust': hipThrust(equip),
    'pull-through': pullThrough(),
    'dead-bug': deadBug(),
    'bird-dog': birdDog(),
    pallof: pallof(),
    crunch: crunch(equip),
    plank: plank(),
    'side-plank': sidePlank(),
    'rowing-cardio': rowingCardio(),
    'stairs-cardio': stairsCardio(),
    'recumbent-cardio': recumbentCardio(),
    'warmup-track': warmupTrack(),
  }[kind];
  const caption = id.replace(/[^a-z0-9-]/gi, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ').slice(0, 31);
  const fullBody = `${body}<text x="74" y="108" text-anchor="middle" style="fill:var(--text-muted);font-family:Arial,sans-serif;font-size:7px;font-weight:650;letter-spacing:.12px">${caption}</text>`;
  return { vb: VB, body: fullBody };
}

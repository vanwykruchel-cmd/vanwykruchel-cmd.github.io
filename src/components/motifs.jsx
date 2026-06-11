import InkDrawing from './Ink';

/*
 * Hand-drawn ink motifs. Each begins with a flowing entry line — the pen
 * sweeps in, then the line "becomes" the family-law image as you scroll.
 */
const MOTIFS = {
  // The scales of justice — slightly imbalanced, like the system itself.
  scales: {
    viewBox: '0 0 300 190',
    paths: [
      { d: 'M2,120 C55,120 75,42 148,42', w: 2.5 },
      { d: 'M150,42 L150,152', w: 3 },
      { d: 'M118,152 L182,152', w: 3 },
      { d: 'M82,62 L218,62', w: 3 },
      { d: 'M82,62 L82,96', w: 2.2 },
      { d: 'M58,96 Q82,124 106,96', w: 2.5, copper: true },
      { d: 'M218,62 L218,108', w: 2.2 },
      { d: 'M194,108 Q218,136 242,108', w: 2.5, copper: true },
      { d: 'M150,42 a6,6 0 1,0 0.1,0', w: 2.5, copper: true },
    ],
  },

  // A winding path with four waypoints — the four steps.
  journey: {
    viewBox: '0 0 300 170',
    paths: [
      { d: 'M5,100 C55,30 105,150 155,75 C195,18 245,140 295,80', w: 3 },
      { d: 'M43,67 a6,6 0 1,0 0.1,0', w: 3, copper: true },
      { d: 'M118,103 a6,6 0 1,0 0.1,0', w: 3, copper: true },
      { d: 'M196,57 a6,6 0 1,0 0.1,0', w: 3, copper: true },
      { d: 'M272,92 a6,6 0 1,0 0.1,0', w: 3, copper: true },
    ],
  },

  // One home becomes two — the line walks from the first roof to the second.
  twoHomes: {
    viewBox: '0 0 300 190',
    paths: [
      { d: 'M2,158 C40,158 55,158 86,158', w: 2.5 },
      { d: 'M86,158 L86,104 L122,72 L158,104 L158,158', w: 3 },
      { d: 'M104,158 L104,128 L122,128 L122,158', w: 2.2, copper: true },
      { d: 'M158,148 C180,148 186,168 208,156', w: 2.5 },
      { d: 'M208,156 L208,118 L234,96 L260,118 L260,156', w: 3 },
      { d: 'M226,156 L226,134 L242,134 L242,156', w: 2.2, copper: true },
      { d: 'M178,92 c-5,-9 -18,-3 -13,7 c4,7 13,11 13,11 c0,0 9,-4 13,-11 c5,-10 -8,-16 -13,-7', w: 2.2, copper: true },
    ],
  },

  // A shield, then the tick inside it — protection, properly prepared.
  shield: {
    viewBox: '0 0 300 200',
    paths: [
      { d: 'M2,96 C50,96 75,58 112,52', w: 2.5 },
      {
        d: 'M150,34 C172,50 196,56 214,57 C214,108 196,152 150,176 C104,152 86,108 86,57 C104,56 128,50 150,34',
        w: 3,
      },
      { d: 'M124,104 L144,126 L182,82', w: 3.5, copper: true },
    ],
  },

  // A parent and child, hand in hand.
  parentChild: {
    viewBox: '0 0 300 190',
    paths: [
      { d: 'M2,120 C50,120 75,70 118,62', w: 2.5 },
      { d: 'M148,38 a15,15 0 1,0 0.1,0', w: 3 },
      { d: 'M148,68 L148,126', w: 3 },
      { d: 'M148,126 L134,168', w: 3 },
      { d: 'M148,126 L162,168', w: 3 },
      { d: 'M148,84 L188,110', w: 3 },
      { d: 'M200,96 a10,10 0 1,0 0.1,0', w: 2.6, copper: true },
      { d: 'M200,116 L200,146', w: 2.6, copper: true },
      { d: 'M200,146 L191,170', w: 2.6, copper: true },
      { d: 'M200,146 L209,170', w: 2.6, copper: true },
      { d: 'M200,122 L188,110', w: 2.6, copper: true },
    ],
  },

  // A question mark drawn in one sweep.
  question: {
    viewBox: '0 0 300 180',
    paths: [
      { d: 'M2,110 C50,110 70,60 112,52', w: 2.5 },
      { d: 'M122,62 C122,30 186,30 186,66 C186,92 152,90 152,118', w: 3.5 },
      { d: 'M152,140 a5,5 0 1,0 0.1,0', w: 3.5, copper: true },
    ],
  },
};

// The signature — drawn by a travelling pen nib when it enters view.
export const SIGNATURE = {
  viewBox: '0 0 320 150',
  paths: [
    { d: 'M12,95 C40,40 62,118 92,82 C118,52 124,108 158,84 C184,66 192,100 224,78 C248,62 262,90 305,68', w: 3 },
    { d: 'M40,122 C120,136 220,124 290,112', w: 2.2, copper: true },
  ],
};

export function Motif({ name, maxWidth = 320, align = 'flex-start' }) {
  const m = MOTIFS[name];
  if (!m) return null;
  return (
    <div style={{ display: 'flex', justifyContent: align, marginBottom: 8 }}>
      <InkDrawing paths={m.paths} viewBox={m.viewBox} mode="scroll" style={{ width: '100%', maxWidth }} />
    </div>
  );
}

export { InkDrawing };

/*
 * "Matter" — the structured intake captured once per file and reused by every
 * generated court document and the settlement agreement. Fill it in on the
 * Court Docs tab; the generators in legalDocs.js read from it.
 *
 * Anything left blank prints as the marker **** so it is easy to find (Ctrl-F)
 * and complete by hand before filing.
 */

export const M = '****';
export const fill = (x) => (x !== undefined && x !== null && String(x).trim() !== '' ? String(x).trim() : M);

export const COURT_TYPES = ['Regional Court', 'High Court', 'Maintenance Court'];
export const ROLES = ['Plaintiff', 'Defendant'];
export const GENDERS = ['', 'male', 'female'];

export const REGIMES = [
  'in community of property',
  'out of community of property with the inclusion of the accrual system',
  'out of community of property with the exclusion of the accrual system',
];

export const FURNITURE_OPTIONS = [
  { key: 'divided', label: 'Already divided to mutual satisfaction' },
  { key: 'plaintiff', label: 'Plaintiff keeps listed items, Defendant the rest' },
  { key: 'defendant', label: 'Defendant keeps listed items, Plaintiff the rest' },
];

export const SPOUSAL_OPTIONS = [
  { key: 'none', label: 'None — each party waives spousal maintenance' },
  { key: 'rehab', label: 'Rehabilitative — for a fixed number of months' },
  { key: 'life', label: 'Until death or remarriage' },
  { key: 'lump', label: 'Lump-sum settlement' },
];

export const COSTS_OPTIONS = [
  { key: 'each', label: 'Each party pays their own costs' },
  { key: 'plaintiff', label: 'Plaintiff pays the costs' },
  { key: 'defendant', label: 'Defendant pays the costs' },
  { key: 'other', label: 'Other (type it in)' },
];

export const DEBT_OPTIONS = [
  { key: 'each', label: 'Each keeps and pays their own debt' },
  { key: 'plaintiff', label: 'Plaintiff responsible for the joint debt' },
  { key: 'defendant', label: 'Defendant responsible for the joint debt' },
  { key: 'other', label: 'Other (type it in)' },
];

export const CONTRIBUTION_TYPES = ['School fees', 'School clothing & uniforms', 'Transport', 'Extramural activities', 'Medical / medical aid', 'Crèche / aftercare', 'Stationery & books', 'Other'];
export const CONTRIB_FREQ = ['per month', 'per term', 'per year', 'once-off', 'as incurred'];

/* Map the casual regime stored on the Case File to the formal wording. */
function mapRegime(r) {
  if (!r) return '';
  const s = r.toLowerCase();
  if (s.includes('in community')) return REGIMES[0];
  if (s.includes('with accrual')) return REGIMES[1];
  if (s.includes('without accrual')) return REGIMES[2];
  return '';
}

/* A blank matter, pre-filled from whatever the Case File already knows. */
export function defaultMatter(client) {
  const cs = client?.case || {};
  return {
    courtType: 'Regional Court',
    division: '', heldAt: '', caseNumber: '',
    ourRole: 'Plaintiff',

    plaintiffName: client?.name || '', plaintiffId: '', plaintiffGender: '', plaintiffAddress: '', plaintiffOccupation: '', plaintiffEmployer: '',
    defendantName: cs.oppName || '', defendantId: cs.oppId || '', defendantGender: '', defendantAddress: cs.oppAddress || '', defendantOccupation: '', defendantEmployer: '',

    marriageDate: '', marriagePlace: '', regime: mapRegime(cs.marriageRegime), antenuptialNumber: '',
    customary: false, customaryDate: '', separationDate: '', grounds: '',

    children: [], primaryResidence: 'Plaintiff', contact: 'reasonable rights of contact',

    childMaintenance: '', escalation: '', medicalAidBy: '', educationBy: '', contributions: [],

    spousalType: 'none', spousalAmount: '', spousalMonths: '',

    forfeiture: false,
    vehicles: [], furnitureOption: 'divided', furnitureItems: '',
    properties: [], pensions: [],

    costsOption: 'each', costsOther: '', debtOption: 'each', debtOther: '',
  };
}

/* Merge a stored matter over the defaults so new fields always exist. */
export function withMatter(client) {
  return { ...defaultMatter(client), ...(client?.matter || {}) };
}

/* ---- pronoun / wording helpers ---- */
export const he = (g) => (g === 'male' ? 'he' : g === 'female' ? 'she' : 'he/she');
export const him = (g) => (g === 'male' ? 'him' : g === 'female' ? 'her' : 'him/her');
export const his = (g) => (g === 'male' ? 'his' : g === 'female' ? 'her' : 'his/her');
export const maleFemale = (g) => (g === 'male' ? 'male' : g === 'female' ? 'female' : 'male/female');

const WORDS = ['zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
export const numberWord = (n) => (n >= 0 && n <= 10 ? WORDS[n] : String(n));

/* Resolve "our side" / "other side" given which role the client plays. */
export function sides(matter) {
  const ourIsDef = matter.ourRole === 'Defendant';
  return {
    ourRole: matter.ourRole,
    otherRole: ourIsDef ? 'Plaintiff' : 'Defendant',
    ourName: ourIsDef ? matter.defendantName : matter.plaintiffName,
    ourAddress: ourIsDef ? matter.defendantAddress : matter.plaintiffAddress,
    otherName: ourIsDef ? matter.plaintiffName : matter.defendantName,
    otherAddress: ourIsDef ? matter.plaintiffAddress : matter.defendantAddress,
  };
}

/* The court heading + the "in the matter between" citation block.
 * leftLabel/rightLabel default to PLAINTIFF / DEFENDANT but can be
 * APPLICANT / RESPONDENT for motion proceedings. ids=true shows ID lines. */
export function heading(matter, { leftLabel = 'PLAINTIFF', rightLabel = 'DEFENDANT', ids = true } = {}) {
  let court;
  if (matter.courtType === 'High Court') {
    court = `IN THE HIGH COURT OF SOUTH AFRICA\n(${fill(matter.division)} DIVISION, ${fill(matter.heldAt)})`;
  } else if (matter.courtType === 'Maintenance Court') {
    court = `IN THE MAINTENANCE COURT FOR THE DISTRICT OF ${fill(matter.division || matter.heldAt)}\nHELD AT ${fill(matter.heldAt)}`;
  } else {
    court = `IN THE REGIONAL COURT FOR THE REGIONAL DIVISION OF ${fill(matter.division)}\nHELD AT ${fill(matter.heldAt)}`;
  }
  const pId = ids ? `\nIdentity Number: ${fill(matter.plaintiffId)}` : '';
  const dId = ids ? `\nIdentity Number: ${fill(matter.defendantId)}` : '';
  return `${court}
CASE NUMBER: ${fill(matter.caseNumber)}

In the matter between:-

${fill(matter.plaintiffName).toUpperCase()}\t\t${leftLabel}${pId}

- and -

${fill(matter.defendantName).toUpperCase()}\t\t${rightLabel}${dId}`;
}

/* Standard dated footer for a self-representing litigant (consultant-compliant —
 * the party signs in person, not as an attorney of record). */
export function footer(matter, settings, { clerk = true } = {}) {
  const s = sides(matter);
  const contact = [settings?.phone, settings?.email].filter(Boolean).join(' · ');
  const toBlock = clerk
    ? `\n\nTO:\tTHE CLERK OF THE COURT, ${fill(matter.heldAt)}\nAND TO:\t${fill(s.otherName)}\n\t${fill(s.otherAddress)}`
    : '';
  return `DATED at ${fill(matter.heldAt)} on this the ${M} day of ${M} 20${M}.


______________________________
${fill(s.ourName)} (${s.ourRole}, in person)
${fill(s.ourAddress)}${contact ? `\n${contact}` : ''}${toBlock}`;
}

/* Commissioner-of-oaths attestation block for affidavits. */
export function attestation(name) {
  return `______________________________
DEPONENT: ${fill(name)}

Signed and sworn to before me at ${M} on this the ${M} day of ${M} 20${M}, the deponent having acknowledged that ${M} knows and understands the contents of this affidavit, and the regulations contained in Government Notice R1258 of 21 July 1972, as amended, having been complied with.

______________________________
COMMISSIONER OF OATHS
Full names: ${M} | Capacity: ${M} | Address: ${M}`;
}

/* Children helpers used by several documents. */
export function liveChildren(matter) {
  return (matter.children || []).filter((c) => (c.name || c.dob || c.gender));
}
export function childrenClause(matter) {
  const kids = liveChildren(matter);
  if (kids.length === 0) return { any: false, count: M, list: M, n: 0 };
  const list = kids
    .map((c) => `${fill(c.name)}${c.gender ? `, a ${c.gender}` : ''}, born ${fill(c.dob)}`)
    .join('; ');
  return { any: true, n: kids.length, count: numberWord(kids.length), list };
}

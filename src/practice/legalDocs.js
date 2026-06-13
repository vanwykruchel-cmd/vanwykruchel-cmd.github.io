/*
 * Court-document generators. Each reads the structured `matter` (see matter.js)
 * plus the client and practice settings, and returns the full text of a working
 * draft — clauses are assembled conditionally from the intake, and **** marks
 * anything still to be completed by hand.
 *
 * These are working drafts prepared to support a self-representing litigant.
 * They are NOT the work of an admitted attorney and must be reviewed and adapted
 * to the specific matter before filing.
 */

import {
  M, fill, heading, footer, attestation, sides, childrenClause,
  he, his, maleFemale, REGIMES,
} from './matter';

const R = (x) => (x !== undefined && x !== null && String(x).trim() !== '' ? `R ${x}` : `R ${M}`);
const para = (...lines) => lines.filter((l) => l !== null && l !== undefined).join('\n');

/* ---- shared clause builders (used by the Settlement Agreement) ---- */

function regimeDivisionClause(matter) {
  if (matter.regime === REGIMES[0]) {
    return matter.forfeiture
      ? `DIVISION OF THE JOINT ESTATE. Save as specifically provided in this agreement, the Defendant forfeits the patrimonial benefits of the marriage in community of property in terms of Section 9(1) of the Divorce Act, 70 of 1979, on the grounds set out in the particulars of claim.`
      : `DIVISION OF THE JOINT ESTATE. Save as specifically provided in this agreement, the joint estate shall be divided equally between the parties, and each party shall retain the assets presently in their possession in full and final settlement of their share.`;
  }
  if (matter.regime === REGIMES[1]) {
    return `ACCRUAL. The parties' accrual claims in terms of the Matrimonial Property Act, 88 of 1984, are settled in full as set out in this agreement, and save as so provided each party retains the assets and liabilities in their own estate, with no further accrual claim against the other.`;
  }
  if (matter.regime === REGIMES[2]) {
    return `PROPRIETARY CONSEQUENCES. The parties are married out of community of property with the exclusion of the accrual system. Each party retains the assets and liabilities in their own estate, and neither has any proprietary claim against the other save as specifically provided in this agreement.`;
  }
  return `PROPRIETARY CONSEQUENCES. ${M} [set out the division / accrual / forfeiture position, consistent with the marital regime].`;
}

function vehiclesClause(matter) {
  const vs = (matter.vehicles || []).filter((x) => x.description || x.retainedBy);
  if (vs.length === 0) return null;
  return vs.map((x) => {
    const who = x.retainedBy || M;
    const parts = [`The ${who} shall retain the ${fill(x.description)} as ${who === 'Plaintiff' ? 'the Plaintiff' : who === 'Defendant' ? 'the Defendant' : 'that party'}'s sole and exclusive property.`];
    if (x.underFinance) {
      parts.push(`The ${fill(x.financeBy)} shall be solely responsible for the outstanding finance and instalments in respect thereof and shall indemnify the other party against all claims arising therefrom.`);
    }
    if (x.insuranceBy) parts.push(`The ${x.insuranceBy} shall be responsible for the comprehensive insurance of the said vehicle.`);
    return parts.join(' ');
  }).join('\n');
}

function furnitureClause(matter) {
  if (matter.furnitureOption === 'divided') {
    return `The household furniture, contents and effects have already been divided between the parties to their mutual satisfaction, and neither party has any further claim against the other in respect thereof.`;
  }
  const keeper = matter.furnitureOption === 'plaintiff' ? 'Plaintiff' : 'Defendant';
  const other = keeper === 'Plaintiff' ? 'Defendant' : 'Plaintiff';
  return `The ${keeper} shall retain the following household furniture and effects: ${fill(matter.furnitureItems)}. Notwithstanding the aforementioned items, the ${other} shall retain all the remaining household furniture, contents and effects, and neither party shall have any further claim against the other in respect thereof.`;
}

function propertiesClause(matter) {
  const ps = (matter.properties || []).filter((x) => x.description || x.retainedBy);
  if (ps.length === 0) return null;
  return ps.map((x) => {
    const who = x.retainedBy || M;
    const parts = [`The ${who} shall retain the immovable property situated at ${fill(x.description)} as ${who === 'Plaintiff' ? 'the Plaintiff' : who === 'Defendant' ? 'the Defendant' : 'that party'}'s sole and exclusive property.`];
    if (x.bondBy) parts.push(`The ${x.bondBy} shall be solely responsible for the bond instalments, rates, taxes and all costs in respect of the said property, and shall indemnify the other party accordingly.`);
    if (x.buyOut) {
      parts.push(`The ${who} shall pay to the other party ${x.buyOutAmount ? `the amount of ${R(x.buyOutAmount)}` : `an amount equal to one half (50%) of the nett value of the property`} as a buy-out of the other party's interest, within ${M} of the date of divorce.`);
    }
    return parts.join(' ');
  }).join('\n');
}

function pensionClause(matter) {
  const ps = (matter.pensions || []).filter((x) => x.fundName || x.percentage);
  if (ps.length === 0) return null;
  return ps.map((x) => {
    const member = x.memberSpouse || M;
    const nonMember = member === 'Plaintiff' ? 'Defendant' : member === 'Defendant' ? 'Plaintiff' : 'other party';
    return `The ${nonMember} is awarded ${fill(x.percentage)}% of the ${member}'s pension interest in the ${fill(x.fundName)}, as at the date of divorce, in terms of Section 7(8) of the Divorce Act, 70 of 1979. The said fund is directed to make an endorsement in its records and to pay the said portion to the ${nonMember} in terms of the Pension Funds Act, 24 of 1956.`;
  }).join('\n');
}

function contributionsList(matter) {
  const cs = (matter.contributions || []).filter((x) => x.type || x.amount);
  if (cs.length === 0) return null;
  return cs.map((x) => `   • ${fill(x.type)}: ${R(x.amount)} ${x.freq || M}`).join('\n');
}

function spousalClause(matter) {
  switch (matter.spousalType) {
    case 'none':
      return `Neither party shall be liable to maintain the other, and each party waives any claim to spousal maintenance against the other, now and in the future.`;
    case 'rehab':
      return `The ${sides(matter).otherRole} shall pay rehabilitative spousal maintenance to the ${sides(matter).ourRole} in the amount of ${R(matter.spousalAmount)} per month for a period of ${fill(matter.spousalMonths)} months from the date of divorce, where after such obligation shall cease.`;
    case 'life':
      return `The ${sides(matter).otherRole} shall pay spousal maintenance to the ${sides(matter).ourRole} in the amount of ${R(matter.spousalAmount)} per month until the death or remarriage of the recipient, whichever occurs first.`;
    case 'lump':
      return `The ${sides(matter).otherRole} shall pay the ${sides(matter).ourRole} a lump sum of ${R(matter.spousalAmount)} in full and final settlement of any claim for spousal maintenance, payable within ${M} of the date of divorce.`;
    default:
      return `${M} [spousal maintenance terms].`;
  }
}

function costsClause(matter) {
  switch (matter.costsOption) {
    case 'each': return `Each party shall pay their own legal costs.`;
    case 'plaintiff': return `The Plaintiff shall pay the costs of and incidental to the divorce action.`;
    case 'defendant': return `The Defendant shall pay the costs of and incidental to the divorce action.`;
    default: return fill(matter.costsOther) + (matter.costsOther ? '' : ' [legal costs].');
  }
}

function debtClause(matter) {
  switch (matter.debtOption) {
    case 'each': return `Each party shall retain and be solely responsible for the debts in their own name, and shall indemnify the other against any claim in respect thereof.`;
    case 'plaintiff': return `The Plaintiff shall be responsible for the joint liabilities of the parties and shall indemnify the Defendant against any claim in respect thereof.`;
    case 'defendant': return `The Defendant shall be responsible for the joint liabilities of the parties and shall indemnify the Plaintiff against any claim in respect thereof.`;
    default: return fill(matter.debtOther) + (matter.debtOther ? '' : ' [allocation of debt].');
  }
}

/* ====================================================================
 * 1. SETTLEMENT AGREEMENT (Deed of Settlement)
 * ==================================================================== */
function settlement(matter, client, settings) {
  const kids = childrenClause(matter);
  const primary = matter.primaryResidence || M;
  const payer = (matter.ourRole === 'Plaintiff') ? 'Defendant' : 'Plaintiff'; // best-guess payer = non-residence parent below
  void payer;
  const items = [];
  let n = 0;
  const clause = (title, body) => { n += 1; items.push(`${n}. ${title}\n${body}`); };

  clause('DIVORCE', `The parties agree that a decree of divorce shall be granted and that this agreement shall be made an order of court and incorporated into the decree of divorce.`);

  if (kids.any || true) {
    clause('PARENTAL RESPONSIBILITIES AND RIGHTS',
      `Both parties shall retain full parental responsibilities and rights in respect of the minor child(ren) as contemplated in Sections 18, 19 and 20 of the Children's Act, 38 of 2005, including guardianship, care, contact and maintenance. The primary place of residence of the minor child(ren) shall vest with the ${primary}, subject to the ${primary === 'Plaintiff' ? 'Defendant' : primary === 'Defendant' ? 'Plaintiff' : 'other party'}'s ${fill(matter.contact)}.`);
  }

  clause('MINOR CHILDREN',
    kids.any
      ? `There are ${kids.count} minor child(ren) born of the marriage, namely: ${kids.list}.`
      : `${M} minor child(ren) born of the marriage, namely ${M} [name(s) and date(s) of birth].`);

  const contribs = contributionsList(matter);
  clause('CHILD MAINTENANCE',
    para(
      `The ${primary === 'Plaintiff' ? 'Defendant' : primary === 'Defendant' ? 'Plaintiff' : M} shall pay maintenance in respect of each minor child in the amount of ${R(matter.childMaintenance)} per child per month, payable on or before the ${M} day of each month, free of deduction or set-off, into a bank account nominated by the ${primary}.`,
      `The said amount shall escalate annually on the anniversary of the decree of divorce at ${matter.escalation ? `${matter.escalation}%` : `${M}% / the official rate of inflation`}.`,
      matter.medicalAidBy ? `The ${matter.medicalAidBy} shall retain the minor child(ren) as dependants on a medical aid scheme and shall be liable for all reasonable medical, dental, ophthalmic, pharmaceutical and related expenses not covered by the scheme.` : `The ${M} shall retain the minor child(ren) on a medical aid scheme and be liable for non-covered medical expenses.`,
      matter.educationBy ? `The ${matter.educationBy} shall be liable for the educational expenses of the minor child(ren).` : null,
      contribs ? `In addition, the following contributions shall be made:\n${contribs}` : null,
    ));

  clause('SPOUSAL MAINTENANCE', spousalClause(matter));

  // Proprietary section — division + assets, each as sub-paragraphs
  const propParts = [regimeDivisionClause(matter)];
  const veh = vehiclesClause(matter); if (veh) propParts.push(`MOTOR VEHICLES.\n${veh}`);
  propParts.push(`HOUSEHOLD FURNITURE AND EFFECTS.\n${furnitureClause(matter)}`);
  const prop = propertiesClause(matter); if (prop) propParts.push(`IMMOVABLE PROPERTY.\n${prop}`);
  const pen = pensionClause(matter); if (pen) propParts.push(`PENSION INTEREST.\n${pen}`);
  clause('PROPRIETARY CONSEQUENCES', propParts.join('\n\n'));

  clause('DEBT', debtClause(matter));
  clause('LEGAL COSTS', costsClause(matter));
  clause('FULL AND FINAL SETTLEMENT',
    `This agreement constitutes the entire agreement between the parties and is in full and final settlement of all claims of whatsoever nature which either party may have against the other arising from the marriage, save for the obligations recorded herein. No variation shall be of force unless reduced to writing and signed by both parties.`);

  const sig = (label, name) => `SIGNED at ${M} on this the ${M} day of ${M} 20${M}.

AS WITNESSES:
1. ______________________
2. ______________________            ______________________________
                                     ${fill(name)} (${label})`;

  return para(
    heading(matter),
    '',
    'DEED OF SETTLEMENT',
    '',
    `WHEREAS the parties were married to each other on ${fill(matter.marriageDate)} at ${fill(matter.marriagePlace)}, ${fill(matter.regime)}${matter.antenuptialNumber ? ` (antenuptial contract registered under number ${matter.antenuptialNumber})` : ''}, which marriage still subsists;`,
    '',
    `AND WHEREAS the marriage relationship between the parties has broken down irretrievably and the parties have agreed to regulate the consequences of their divorce;`,
    '',
    `NOW THEREFORE the parties agree as follows:`,
    '',
    items.join('\n\n'),
    '',
    sig('Plaintiff', matter.plaintiffName),
    '',
    sig('Defendant', matter.defendantName),
    '',
    `Prepared for a self-representing litigant by ${settings?.ownerName || 'Van Wyk Family Law Advisory'} (Family Law Consultant). This is a working draft, not the work of an admitted attorney; review and adapt before signature.`,
  );
}

/* ====================================================================
 * 2. PARTICULARS OF CLAIM — DIVORCE
 * ==================================================================== */
function poc(matter, client, settings) {
  const kids = childrenClause(matter);
  const primary = matter.primaryResidence || M;
  const otherParent = primary === 'Plaintiff' ? 'Defendant' : 'Plaintiff';
  return para(
    heading(matter),
    '',
    'PARTICULARS OF CLAIM',
    '',
    '1.\tTHE PARTIES',
    `1.1\tThe Plaintiff is ${fill(matter.plaintiffName)}, an adult ${maleFemale(matter.plaintiffGender)} with Identity Number ${fill(matter.plaintiffId)}, residing at ${fill(matter.plaintiffAddress)}${matter.plaintiffOccupation ? `, employed as ${matter.plaintiffOccupation}` : ''}.`,
    `1.2\tThe Defendant is ${fill(matter.defendantName)}, an adult ${maleFemale(matter.defendantGender)} with Identity Number ${fill(matter.defendantId)}, residing at ${fill(matter.defendantAddress)}${matter.defendantOccupation ? `, employed as ${matter.defendantOccupation}${matter.defendantEmployer ? ` at ${matter.defendantEmployer}` : ''}` : ''}.`,
    '',
    '2.\tJURISDICTION',
    `2.1\tThis Honourable Court has jurisdiction in terms of Section 28 of the Divorce Act, 70 of 1979${matter.courtType === 'Regional Court' ? ', read with Section 29(1B) of the Magistrates’ Courts Act, 32 of 1944' : ''}, in that the ${matter.ourRole} is domiciled / ordinarily resident within the area of jurisdiction of this Honourable Court and has been so resident for a period of not less than one year prior to the institution of this action.`,
    '',
    '3.\tTHE MARRIAGE',
    `3.1\tThe parties were married to each other on ${fill(matter.marriageDate)} at ${fill(matter.marriagePlace)}, ${fill(matter.regime)}${matter.antenuptialNumber ? `, in terms of an antenuptial contract registered under number ${matter.antenuptialNumber}` : ''}, which marriage still subsists. A copy of the marriage certificate is annexed as Annexure “A”.`,
    '',
    '4.\tMINOR CHILDREN',
    kids.any
      ? `4.1\t${kids.count} minor child(ren) was/were born of the marriage, namely ${kids.list}, which child(ren) is/are still minor(s).`
      : `4.1\t${M} minor child(ren) was/were born of the marriage [alternatively: no children were born of the marriage and none are expected].`,
    '',
    '5.\tIRRETRIEVABLE BREAKDOWN',
    `5.1\tThe marriage relationship has broken down irretrievably as contemplated in Section 4(1) of the Divorce Act, 70 of 1979, there being no reasonable prospect of the restoration of a normal marriage relationship, by reason of, inter alia:`,
    `5.1.1\tThe parties have not lived together as husband and wife since ${fill(matter.separationDate)};`,
    `5.1.2\tThe parties have lost all love, respect and affection for one another;`,
    `5.1.3\tThe parties no longer communicate meaningfully and continuous conflict occurs between them;`,
    `5.1.4\t${fill(matter.grounds)} [further specific grounds — keep factual].`,
    '',
    '6.\tANCILLARY RELIEF',
    `6.1\tIt is in the best interests of the minor child(ren) that both parties retain full parental responsibilities and rights in terms of Sections 18, 19 and 20 of the Children's Act, 38 of 2005, that primary residence vest with the ${primary}, and that the ${otherParent} exercise reasonable contact.`,
    `6.2\tThe ${otherParent} is liable to contribute towards the maintenance of the minor child(ren) in the amount of ${R(matter.childMaintenance)} per child per month, together with medical and educational expenses.`,
    matter.regime === REGIMES[0]
      ? `6.3\tThe Plaintiff is entitled to a division of the joint estate${matter.forfeiture ? `, alternatively an order of forfeiture of the patrimonial benefits in terms of Section 9(1) of the Divorce Act, 70 of 1979` : ''}.`
      : matter.regime === REGIMES[1]
        ? `6.3\tThe Plaintiff is entitled to payment of an amount equal to one half of the difference between the accrual of the respective estates in terms of Section 3 of the Matrimonial Property Act, 88 of 1984.`
        : `6.3\tEach party retains the assets and liabilities in their own estate${M ? '' : ''}.`,
    (matter.pensions || []).some((p) => p.fundName || p.percentage)
      ? `6.4\tThe Plaintiff is entitled to an order in terms of Section 7(8) of the Divorce Act, 70 of 1979, in respect of the Defendant's pension interest as set out in the prayers.`
      : null,
    '',
    'WHEREFORE the Plaintiff claims:',
    '(a)\tA decree of divorce;',
    `(b)\tAn order that both parties retain full parental responsibilities and rights in respect of the minor child(ren), with primary residence vesting with the ${primary} subject to the ${otherParent}'s right of reasonable contact;`,
    `(c)\tMaintenance for the minor child(ren) of ${R(matter.childMaintenance)} per child per month, escalating annually at ${matter.escalation ? `${matter.escalation}%` : `${M}%`}, together with retention on a medical aid and payment of educational expenses;`,
    `(d)\t${matter.regime === REGIMES[0] ? 'Division of the joint estate' + (matter.forfeiture ? ' / forfeiture of benefits in terms of Section 9(1) of the Divorce Act' : '') : matter.regime === REGIMES[1] ? 'Payment of the accrual in terms of the Matrimonial Property Act, 88 of 1984' : 'An order confirming that each party retains their own estate'};`,
    (matter.pensions || []).some((p) => p.fundName || p.percentage)
      ? `(e)\t${pensionPrayer(matter)}`
      : `(e)\t[Pension interest order in terms of Section 7(8) of the Divorce Act, if applicable: ${M}];`,
    matter.spousalType !== 'none' ? `(f)\t${spousalPrayer(matter)}` : `(f)\t[Spousal maintenance, if claimed: ${M}];`,
    '(g)\tCosts of suit, only in the event of the action being defended;',
    '(h)\tFurther and/or alternative relief.',
    '',
    footer(matter, settings),
  );
}
function pensionPrayer(matter) {
  const p = (matter.pensions || []).find((x) => x.fundName || x.percentage) || {};
  return `An order in terms of Section 7(8) of the Divorce Act, 70 of 1979, that ${fill(p.percentage)}% of the ${fill(p.memberSpouse || 'Defendant')}'s pension interest in the ${fill(p.fundName)}, calculated as at date of divorce, be paid to the ${p.memberSpouse === 'Plaintiff' ? 'Defendant' : 'Plaintiff'}, and that the fund endorse its records accordingly;`;
}
function spousalPrayer(matter) {
  if (matter.spousalType === 'rehab') return `Rehabilitative spousal maintenance of ${R(matter.spousalAmount)} per month for ${fill(matter.spousalMonths)} months;`;
  if (matter.spousalType === 'life') return `Spousal maintenance of ${R(matter.spousalAmount)} per month until death or remarriage;`;
  if (matter.spousalType === 'lump') return `A lump sum of ${R(matter.spousalAmount)} in settlement of spousal maintenance;`;
  return `Spousal maintenance: ${M};`;
}

/* ====================================================================
 * 3. NOTICE OF INTENTION TO DEFEND
 * ==================================================================== */
function defend(matter, client, settings) {
  const s = sides(matter);
  return para(
    heading(matter),
    '',
    'NOTICE OF INTENTION TO DEFEND',
    '',
    `KINDLY TAKE NOTICE THAT the Defendant hereby gives notice of ${his(matter.defendantGender)} intention to defend the above action.`,
    '',
    `TAKE NOTICE FURTHER THAT the Defendant chooses as the address at which ${he(matter.defendantGender)} will accept service of all process and documents in these proceedings: ${fill(s.ourRole === 'Defendant' ? s.ourAddress : matter.defendantAddress)}, with e-mail service accepted at ${fill(settings?.email)}.`,
    '',
    footer(matter, settings),
  );
}

/* ====================================================================
 * 4. DEFENDANT'S PLEA AND COUNTERCLAIM
 * ==================================================================== */
function pleaCC(matter, client, settings) {
  const primary = matter.primaryResidence || M;
  return para(
    heading(matter),
    '',
    "DEFENDANT'S PLEA AND COUNTERCLAIM",
    '',
    'PLEA',
    'AD PARAGRAPHS 1, 2, 3 AND 4 THEREOF:',
    '1.\tThe contents of these paragraphs are admitted.',
    'AD PARAGRAPH 5 THEREOF:',
    `2.\tThe Defendant admits that the marriage relationship has broken down irretrievably, but denies the grounds as pleaded and puts the Plaintiff to the proof thereof. The Defendant pleads that the breakdown is attributable to, inter alia, ${fill(matter.grounds)}.`,
    'AD PARAGRAPH 6 THEREOF:',
    '3.\tThe Defendant denies that the relief claimed is appropriate and pleads as set out in the Counterclaim below. Each remaining allegation is denied as if specifically traversed.',
    '',
    'WHEREFORE the Defendant prays that the Plaintiff’s claims be dismissed with costs, save to the extent admitted, and that relief be granted in terms of the Counterclaim.',
    '',
    'COUNTERCLAIM',
    '1.\tThe Defendant repeats the admissions in the Plea and incorporates the common-cause facts regarding the parties, jurisdiction, the marriage and the minor child(ren).',
    `2.\tThe marriage has broken down irretrievably as contemplated in Section 4(1) of the Divorce Act, 70 of 1979, in that ${fill(matter.grounds)}.`,
    `3.\tIt is in the best interests of the minor child(ren) that primary residence vest with the ${primary === 'Defendant' ? 'Defendant' : M}, with the other party exercising reasonable contact, and that the other party contribute maintenance of ${R(matter.childMaintenance)} per child per month.`,
    `4.\t${M} [set out property, accrual, pension and/or forfeiture claims as applicable].`,
    '',
    'WHEREFORE the Defendant (Plaintiff in reconvention) claims:',
    '(a)\tA decree of divorce;',
    '(b)\tAn order regulating parental responsibilities and rights with primary residence vesting with the Defendant;',
    `(c)\tMaintenance for the minor child(ren) of ${R(matter.childMaintenance)} per child per month;`,
    `(d)\t[Proprietary relief: ${M}];`,
    '(e)\tCosts of suit, only in the event of the counterclaim being defended;',
    '(f)\tFurther and/or alternative relief.',
    '',
    footer(matter, settings),
  );
}

/* ====================================================================
 * 5. PLAINTIFF'S PLEA TO DEFENDANT'S COUNTERCLAIM
 * ==================================================================== */
function pleaToCC(matter, client, settings) {
  return para(
    heading(matter),
    '',
    "PLAINTIFF'S PLEA TO DEFENDANT'S COUNTERCLAIM",
    '',
    'AD PARAGRAPHS 1 AND 2 THEREOF:',
    '1.\tThe Plaintiff admits that the marriage has broken down irretrievably but denies the grounds as pleaded and refers to the Particulars of Claim.',
    'AD PARAGRAPH 3 THEREOF:',
    `2.\tThe Plaintiff denies that it is in the best interests of the minor child(ren) that primary residence vest with the Defendant, and pleads that ${M}.`,
    'AD PARAGRAPH 4 THEREOF:',
    `3.\tThe contents hereof are denied as if specifically traversed and the Defendant is put to the proof thereof. [Plead to each proprietary allegation: ${M}.]`,
    '',
    'WHEREFORE the Plaintiff prays that the Defendant’s Counterclaim be dismissed with costs and that relief be granted in terms of the Particulars of Claim.',
    '',
    footer(matter, settings),
  );
}

/* ====================================================================
 * 6. RULE 58 APPLICATION (interim relief) + FOUNDING AFFIDAVIT
 * ==================================================================== */
function rule58(matter, client, settings) {
  const s = sides(matter);
  const kids = childrenClause(matter);
  return para(
    heading(matter, { leftLabel: 'APPLICANT', rightLabel: 'RESPONDENT', ids: false }),
    '',
    "APPLICATION IN TERMS OF RULE 58 OF THE MAGISTRATES' COURTS RULES",
    '(Interim relief in matrimonial matters pendente lite)',
    '',
    'KINDLY TAKE NOTICE THAT the Applicant applies for an order in the following terms:',
    `1.\tThat the Respondent pay interim maintenance pendente lite in respect of the Applicant and/or the minor child(ren) of ${R(matter.childMaintenance)} per month, on or before the ${M} day of each month;`,
    `2.\tThat the Respondent retain the Applicant and/or minor child(ren) on ${his(matter.defendantGender)} medical aid and pay [school fees of ${M} / the bond instalment / ${M}];`,
    `3.\tThat pending finalisation of the divorce, primary residence of the minor child(ren) vest with the Applicant, with the Respondent exercising contact as follows: ${fill(matter.contact)};`,
    `4.\tThat the Respondent contribute ${M} towards the Applicant's legal costs;`,
    '5.\tCosts of this application, only in the event of opposition;',
    '6.\tFurther and/or alternative relief.',
    '',
    'TAKE NOTICE FURTHER THAT the affidavit annexed hereto will be used in support of this application, and that the Respondent is called upon to deliver an answering affidavit, if any, within 10 (ten) days of service hereof.',
    '',
    footer(matter, settings),
    '',
    'FOUNDING AFFIDAVIT',
    `I, the undersigned, ${fill(s.ourName)}, do hereby make oath and state:`,
    `1.\tI am the Applicant, an adult ${maleFemale(matter.ourRole === 'Plaintiff' ? matter.plaintiffGender : matter.defendantGender)} residing at ${fill(s.ourAddress)}. The facts herein fall within my personal knowledge and are true and correct.`,
    `2.\tThe Respondent and I are married to each other (${fill(matter.regime)}) and a divorce action is pending under the above case number. A pending matrimonial action being a jurisdictional requirement for relief under Rule 58, same exists.`,
    kids.any
      ? `3.\tThere are ${kids.count} minor child(ren) born of the marriage, namely ${kids.list}, who reside with me and whose day-to-day care I provide.`
      : `3.\t${M} minor child(ren) were born of the marriage, namely ${M}, who reside with me.`,
    `4.\tMY FINANCIAL POSITION: I am ${fill(client?.case?.yourIncome ? `employed earning a nett income of ${client.case.yourIncome} per month` : M)}. My reasonable monthly expenses and those of the child(ren) are set out in the Income and Expenditure Schedule annexed as “FA1”, with supporting bank statements and payslips. I make full and frank disclosure of my financial position.`,
    `5.\tTHE RESPONDENT'S FINANCIAL POSITION: To the best of my knowledge the Respondent is employed as ${fill(matter.defendantOccupation)}${matter.defendantEmployer ? ` at ${matter.defendantEmployer}` : ''}, earning approximately ${fill(client?.case?.oppIncome)} per month, and is well able to pay the amounts claimed.`,
    `6.\tSince ${fill(matter.separationDate)}, the Respondent has [failed to contribute / contributed only ${M} per month], leaving a shortfall of ${M} which I cannot meet.`,
    `7.\tCONTRIBUTION TOWARDS COSTS: I am unable to fund the litigation on an equal footing with the Respondent and require a contribution of ${M} towards my legal costs.`,
    '8.\tThe relief is interim only, pending finalisation of the divorce, and is in the best interests of the minor child(ren).',
    '',
    'WHEREFORE I pray for an order in terms of the Notice of Application.',
    '',
    attestation(s.ourName),
  );
}

/* ====================================================================
 * 7. RULE 21B(2) — FINANCIAL DISCLOSURE NOTICE
 * ==================================================================== */
function rule21b(matter, client, settings) {
  const us = matter.ourRole; const them = us === 'Plaintiff' ? 'Defendant' : 'Plaintiff';
  return para(
    heading(matter),
    '',
    "NOTICE IN TERMS OF RULE 21B(2) OF THE MAGISTRATES' COURTS RULES",
    '',
    `KINDLY TAKE NOTICE THAT the ${us} hereby delivers ${his(us === 'Plaintiff' ? matter.plaintiffGender : matter.defendantGender)} completed Financial Disclosure Form, together with supporting documentation, in terms of Rule 21B(2) of the Magistrates' Courts Rules, in the pending divorce action under the above case number.`,
    '',
    `TAKE NOTICE FURTHER THAT the ${them} is required to deliver ${his(them === 'Plaintiff' ? matter.plaintiffGender : matter.defendantGender)} completed Financial Disclosure Form within the period prescribed by the Rule, failing which the ${us} reserves the right to approach the Court for appropriate relief, including costs.`,
    '',
    'The Financial Disclosure Form must be completed in full, attested under oath, and accompanied by the supporting documents it prescribes, including bank statements, payslips, and proof of assets and liabilities.',
    '',
    footer(matter, settings),
  );
}

/* ====================================================================
 * 8. SUBSTITUTED SERVICE APPLICATION + AFFIDAVIT
 * ==================================================================== */
function subst(matter, client, settings) {
  const s = sides(matter);
  return para(
    heading(matter, { leftLabel: 'APPLICANT', rightLabel: 'RESPONDENT', ids: false }),
    '',
    'APPLICATION FOR SUBSTITUTED SERVICE',
    '',
    `KINDLY TAKE NOTICE THAT application will be made on behalf of the Applicant on ${M} at ${M}, or so soon thereafter as the matter may be heard, for an order in the following terms:`,
    `1.\tThat the Applicant be granted leave to serve the Summons and Particulars of Claim on the Respondent by way of substituted service, namely by:`,
    `1.1\ttransmitting same by WhatsApp / SMS to the Respondent's cellular number ${M}, together with a message recording the nature of the document; and/or`,
    `1.2\ttransmitting same by e-mail to ${M}; and/or`,
    `1.3\tdelivering a copy to ${M} [last known address / a family member]; and/or`,
    `1.4\tpublication of a notice in the ${M} newspaper circulating in the area of ${fill(matter.heldAt)};`,
    '2.\tThat such service be deemed good and sufficient service;',
    '3.\tFurther and/or alternative relief.',
    '',
    'TAKE NOTICE FURTHER THAT the affidavit annexed hereto will be used in support hereof.',
    '',
    footer(matter, settings, { clerk: true }),
    '',
    'FOUNDING AFFIDAVIT',
    `I, the undersigned, ${fill(s.ourName)}, do hereby make oath and state:`,
    '1.\tI am the Applicant herein. The facts deposed to fall within my personal knowledge and are true and correct.',
    `2.\tI have instituted / intend instituting a divorce action against the Respondent, my ${matter.defendantGender === 'male' ? 'husband' : matter.defendantGender === 'female' ? 'wife' : 'spouse'}, under the above case number.`,
    `3.\tThe Sheriff attempted service at the Respondent's last known address at ${fill(matter.defendantAddress)} on ${M}, and a return of non-service was rendered (Annexure “SA1”). [Detail every further attempt: ${M}.]`,
    `4.\tThe Respondent's present whereabouts are unknown to me despite the following reasonable steps: enquiries with family (${M}), ${his(matter.defendantGender)} last known employer (${fill(matter.defendantEmployer)}), and tracing (${M}).`,
    `5.\tThe Respondent however actively uses cellular number ${M} / e-mail ${M} / the social media account ${M}, and the proposed manner of service is the method most likely to bring the proceedings to ${his(matter.defendantGender)} attention.`,
    '6.\tThe Respondent is, to the best of my knowledge, not outside the Republic.',
    '7.\tI pray for an order in terms of the Notice of Application.',
    '',
    attestation(s.ourName),
  );
}

/* ====================================================================
 * 9. APPLICATION FOR COURT DATE + NOTICE OF SET DOWN
 * ==================================================================== */
function courtDate(matter, client, settings) {
  return para(
    heading(matter),
    '',
    'APPLICATION FOR COURT DATE',
    '',
    `KINDLY TAKE NOTICE THAT the ${matter.ourRole} hereby applies for the allocation of a date for the hearing of the above matter, which proceeds on an [unopposed / opposed] basis. The pleadings have closed / no notice of intention to defend has been delivered, and the matter is ripe for hearing. [Where minor children are involved: the Family Advocate's endorsement has been obtained and is filed of record.]`,
    '',
    footer(matter, settings),
    '',
    'NOTICE OF SET DOWN',
    '',
    `KINDLY TAKE NOTICE THAT the above matter has been set down for hearing on ${M} at ${M}, or so soon thereafter as the matter may be heard, in the ${matter.courtType}, ${fill(matter.heldAt)}, Court Room ${M}.`,
    '',
    footer(matter, settings),
  );
}

/* ====================================================================
 * 10. WARRANT OF EXECUTION — MAINTENANCE ARREARS (Founding Affidavit)
 * ==================================================================== */
function warrant(matter, client, settings) {
  const s = sides(matter);
  return para(
    `IN THE MAINTENANCE COURT FOR THE DISTRICT OF ${fill(matter.division || matter.heldAt)}`,
    `HELD AT ${fill(matter.heldAt)}`,
    `CASE NUMBER: ${fill(matter.caseNumber)} (Maintenance Reference: ${M})`,
    '',
    'In the matter between:-',
    '',
    `${fill(matter.plaintiffName).toUpperCase()}\t\tAPPLICANT / JUDGMENT CREDITOR`,
    '',
    '- and -',
    '',
    `${fill(matter.defendantName).toUpperCase()}\t\tRESPONDENT / JUDGMENT DEBTOR`,
    '',
    'FOUNDING AFFIDAVIT — APPLICATION FOR A WARRANT OF EXECUTION',
    'In terms of Section 26 read with Section 27 of the Maintenance Act, 99 of 1998',
    '',
    `I, the undersigned, ${fill(s.ourName)}, Identity Number ${fill(matter.ourRole === 'Plaintiff' ? matter.plaintiffId : matter.defendantId)}, residing at ${fill(s.ourAddress)}, do hereby make oath and state:`,
    '1.\tI am the Applicant and the person in whose favour the maintenance order described below operates. The facts herein fall within my personal knowledge and are true and correct.',
    `2.\tIn terms of [the Order of Divorce granted on ${M} under case number ${fill(matter.caseNumber)}, incorporating a Settlement Agreement / the maintenance order granted by this Honourable Court on ${M}], the Respondent is obliged to pay maintenance of ${R(matter.childMaintenance)} per month in respect of [the minor child(ren) ${childrenClause(matter).any ? childrenClause(matter).list : M} / myself], on or before the ${M} day of each month. A certified copy is annexed as “WA1”.`,
    `3.\tThe Respondent has failed to comply. The arrears as at ${M} total ${R(M)}, calculated as set out in the schedule annexed as “WA2”, reflecting for each month the amount due, paid and the shortfall.`,
    `4.\tIn support I annex my complete bank statements for the full period of non-payment, from ${M} to ${M}, as “WA3”.`,
    `5.\tThe Respondent resides at ${fill(matter.defendantAddress)} and is employed by ${fill(matter.defendantEmployer)}. The Respondent owns or possesses movable property at the said address against which execution may be levied.`,
    `6.\tI pray that a warrant of execution be authorised against the movable property of the Respondent for the arrear maintenance of ${R(M)}, together with the costs of execution.`,
    '',
    attestation(s.ourName),
  );
}

export const DOC_CATEGORIES = ['Settlement', 'Divorce pleadings', 'Interim & enforcement'];

export function getLegalDocs() {
  return [
    { id: 'settlement', name: 'Settlement Agreement (Deed of Settlement)', category: 'Settlement', build: settlement },
    { id: 'poc', name: 'Particulars of Claim — Divorce', category: 'Divorce pleadings', build: poc },
    { id: 'defend', name: 'Notice of Intention to Defend', category: 'Divorce pleadings', build: defend },
    { id: 'plea-cc', name: "Defendant's Plea & Counterclaim", category: 'Divorce pleadings', build: pleaCC },
    { id: 'plea-to-cc', name: "Plaintiff's Plea to Counterclaim", category: 'Divorce pleadings', build: pleaToCC },
    { id: 'rule21b', name: 'Rule 21B(2) Financial Disclosure Notice', category: 'Divorce pleadings', build: rule21b },
    { id: 'courtdate', name: 'Application for Court Date & Notice of Set Down', category: 'Divorce pleadings', build: courtDate },
    { id: 'rule58', name: 'Rule 58 Application + Founding Affidavit', category: 'Interim & enforcement', build: rule58 },
    { id: 'subst', name: 'Substituted Service Application + Affidavit', category: 'Interim & enforcement', build: subst },
    { id: 'warrant', name: 'Warrant of Execution — Maintenance Arrears', category: 'Interim & enforcement', build: warrant },
  ];
}

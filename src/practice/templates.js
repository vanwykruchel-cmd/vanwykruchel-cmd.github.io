/*
 * Document template library. Each template body is a function of the client
 * record and practice settings — placeholders auto-fill where data exists and
 * fall back to blanks for handwriting. All templates are working drafts for
 * the consultant to review and adapt per matter; they are not legal opinions.
 */

const B = '________________________';
const v = (x) => (x && String(x).trim() ? x : B);

const SIGN_BLOCK = (clientName) => `
SIGNED at ${B} on this ${B} day of ${B} 20${B}.


_________________________________
CLIENT: ${v(clientName)}


_________________________________
FOR: VAN WYK FAMILY LAW ADVISORY
Family Law Consultant (LLB, UNISA)
`;

const HEADER = (s, title) => `VAN WYK FAMILY LAW ADVISORY
Family Law Consultant (LLB, University of South Africa)
${s.email || ''}${s.phone ? ' · ' + s.phone : ''}

${title.toUpperCase()}
`;

export function getTemplates() {
  return [
    /* ---------------- COMPLIANCE ---------------- */
    {
      id: 'popia',
      name: 'POPIA Consent Form',
      category: 'Compliance',
      body: (c, s) => `${HEADER(s, 'Consent to Process Personal Information (POPIA)')}
Full name of client: ${v(c?.name)}
ID number: ${B}
Contact: ${v(c?.phone)} / ${v(c?.email)}

In terms of the Protection of Personal Information Act 4 of 2013 ("POPIA"), I consent to Van Wyk Family Law Advisory ("the Practice") collecting, storing and processing my personal information — including my identity details, contact details, financial information and the details of my family law matter — for the following purposes:

1. Providing me with family law advisory services;
2. Preparing documents relating to my matter;
3. Communicating with me about my matter;
4. Billing and record-keeping.

I understand that:
- My information will not be sold or shared with any third party without my written consent, except where required by law;
- My information is stored securely and retained only as long as necessary;
- I may at any time request access to, correction of, or deletion of my personal information by writing to ${s.email || B};
- I may lodge a complaint with the Information Regulator of South Africa (inforegulator.org.za).
${SIGN_BLOCK(c?.name)}`,
    },
    {
      id: 'disclosure',
      name: 'Advisor Status Disclosure & Acknowledgement',
      category: 'Compliance',
      body: (c, s) => `${HEADER(s, 'Disclosure of Advisor Status and Client Acknowledgement')}
Client: ${v(c?.name)}

This document records that the following has been disclosed to me clearly, before any services were rendered and before any fee was paid:

1. Van Wyk Family Law Advisory is a specialist legal consultancy operated by a Family Law Consultant holding an LLB from the University of South Africa.
2. The consultant is NOT an admitted attorney or advocate under the Legal Practice Act 28 of 2014, and this is NOT a law firm.
3. The consultant cannot appear in court on my behalf. Where my matter requires court representation by an admitted legal practitioner, I will be advised and referred.
4. Advice and documents provided do not constitute formal legal opinions of an admitted attorney and may not be represented as such in court proceedings.
5. No attorney-client privilege as between attorney and client arises; confidentiality is instead protected contractually and under POPIA.
6. The consultant is not regulated by the Legal Practice Council. My recourse lies with the National Consumer Commission under the Consumer Protection Act 68 of 2008 and the Information Regulator under POPIA.

I confirm that I understand and accept the above, and that I choose to make use of the Practice's services on this basis.
${SIGN_BLOCK(c?.name)}`,
    },
    {
      id: 'indemnity',
      name: 'Indemnity & Limitation of Liability',
      category: 'Compliance',
      body: (c, s) => `${HEADER(s, 'Indemnity and Limitation of Liability')}
Client: ${v(c?.name)}

1. I acknowledge that the outcome of any legal matter depends on facts, evidence, the conduct of the opposing party and the decisions of presiding officers, and that no outcome has been or can be guaranteed by the Practice.

2. I acknowledge that where I elect to represent myself in court proceedings, I do so in my own name and at my own risk, and that the Practice's role is limited to advice, document preparation and coaching.

3. I indemnify the Practice against any claim arising from: (a) my own decisions or conduct in or out of court; (b) information I supplied that was incomplete or inaccurate; (c) deadlines missed because I failed to provide instructions or documents timeously.

4. The Practice's total liability for any claim arising from its services is limited to the fees actually paid by me for the specific service concerned, to the maximum extent permitted by the Consumer Protection Act 68 of 2008.

5. Nothing in this document excludes or limits liability for gross negligence or fraud, and nothing limits any right I have under the Consumer Protection Act.
${SIGN_BLOCK(c?.name)}`,
    },
    {
      id: 'contract',
      name: 'Consultancy Service Agreement',
      category: 'Compliance',
      body: (c, s) => `${HEADER(s, 'Consultancy Service Agreement')}
Between: VAN WYK FAMILY LAW ADVISORY ("the Practice")
And: ${v(c?.name)} ("the Client")
Matter: ${v(c?.matterType)}

1. SERVICES. The Practice will provide family law consulting services as set out in the written quote accepted by the Client, which forms part of this agreement.

2. NATURE OF THE PRACTICE. The Practice is a legal consultancy, not a law firm. The consultant is not an admitted attorney or advocate and will not appear in court on the Client's behalf. The Client has signed the Advisor Status Disclosure recording this.

3. FEES. All fees are fixed and agreed in writing before work begins. Payment is by EFT only, in advance, to the account stated on the quote. No work commences before payment reflects.

4. CANCELLATION. Consultations cancelled with more than 24 hours' notice are credited toward a rescheduled session. Less than 24 hours' notice: no refund.

5. CLIENT OBLIGATIONS. The Client will provide complete and truthful information and documents timeously, and remains responsible for all decisions in their matter.

6. CONFIDENTIALITY & POPIA. The Practice processes personal information in accordance with the signed POPIA consent and its Privacy Policy.

7. TERMINATION. Either party may terminate on written notice. Fees for work already performed are not refundable; fees for work not yet commenced will be refunded.

8. GOVERNING LAW. South African law. Disputes go first to the National Consumer Commission.
${SIGN_BLOCK(c?.name)}`,
    },

    /* ---------------- ENGAGEMENT ---------------- */
    {
      id: 'mandate',
      name: 'Mandate & Fee Acceptance',
      category: 'Engagement',
      body: (c, s) => `${HEADER(s, 'Mandate and Acceptance of Fixed-Fee Quote')}
Client: ${v(c?.name)}
Quote number accepted: ${B}
Total fixed fee: R ${B}

I instruct Van Wyk Family Law Advisory to proceed with the services set out in the quote above. I confirm that:
- I have read and accepted the quote in full;
- I understand the fee is fixed for the scope described, and that work outside that scope will be quoted separately before it begins;
- Payment is by EFT to the account on the quote, reference: my quote number;
- Work begins once payment reflects.
${SIGN_BLOCK(c?.name)}`,
    },
    {
      id: 'quote-cover',
      name: 'Quote Cover Email',
      category: 'Engagement',
      body: (c, s) => `Subject: Your fixed-fee quote — Van Wyk Family Law Advisory

Dear ${v(c?.name)},

Thank you for your consultation. As promised, please find attached:

1. Your written fixed-fee quote (valid for ${s.quoteValidityDays || 14} days);
2. The POPIA consent form;
3. The Advisor Status Disclosure;
4. The Consultancy Service Agreement.

To proceed:
1. Sign and return the three documents;
2. Pay the quoted fee by EFT to the account on the quote (reference: your quote number);
3. As soon as payment reflects, work begins — I will confirm receipt and the timeline the same day.

There is no obligation. If anything in the quote is unclear, reply to this email and I will gladly talk you through it.

Kind regards
${s.ownerName || 'Van Wyk Family Law Advisory'}
Family Law Consultant (LLB, UNISA)
${s.phone || ''}`,
    },

    /* ---------------- DIVORCE ---------------- */
    {
      id: 'settlement',
      name: 'Settlement Agreement — Skeleton',
      category: 'Divorce',
      body: (c, s) => `${HEADER(s, 'Settlement Agreement (Deed of Settlement) — Working Draft')}
IN THE MATTER BETWEEN:
${v(c?.name)} (Plaintiff)
and
${v(c?.case?.oppName)} (Defendant)

WHEREAS the parties were married to each other on ${B} (${v(c?.case?.marriageRegime)});
AND WHEREAS the marriage relationship has irretrievably broken down;
NOW THEREFORE the parties agree as follows:

1. DIVORCE. The Defendant shall not defend the action and the agreement shall be incorporated in the decree of divorce.

2. DIVISION OF THE JOINT ESTATE / ACCRUAL. [Set out: immovable property, vehicles, pension interests (s 7(8) Divorce Act endorsement), policies, debts, movables.]

3. MAINTENANCE — SPOUSAL. [Amount / duration / rehabilitative or token / or each party waives.]

4. MINOR CHILDREN. [Names and dates of birth.] Both parties retain full parental responsibilities and rights (s 18, Children's Act 38 of 2005). Primary residence with ${v(c?.case?.childrenStay)}. Contact for the other party: [define]. The attached Parenting Plan forms part of this agreement.

5. CHILD MAINTENANCE. The ${B} shall pay maintenance of R${B} per child per month, escalating annually by CPI, plus [school fees / medical aid / extramurals].

6. COSTS. Each party pays own costs / [other].

7. FULL AND FINAL SETTLEMENT.
${SIGN_BLOCK(c?.name)}`,
    },
    {
      id: 'parenting-plan',
      name: 'Parenting Plan — Skeleton',
      category: 'Divorce',
      body: (c, s) => `${HEADER(s, 'Parenting Plan (ss 33–35, Children’s Act 38 of 2005) — Working Draft')}
PARTIES: ${v(c?.name)} and ${v(c?.case?.oppName)}
CHILDREN: [Full names and dates of birth]

1. PARENTAL RESPONSIBILITIES AND RIGHTS. Both parties retain full responsibilities and rights of care, contact, guardianship and maintenance.

2. PRIMARY RESIDENCE. The children reside primarily with ${v(c?.case?.childrenStay)}.

3. CONTACT SCHEDULE.
   3.1 Weekends: [alternate weekends Fri 17:00 – Sun 17:00]
   3.2 Mid-week: [e.g. Wednesday afternoon + dinner]
   3.3 Holidays: [alternate short holidays; long holidays shared equally]
   3.4 Special days: [birthdays, Mother's/Father's Day, religious days]
   3.5 Telephone/video contact: [daily/reasonable]

4. SCHOOLING AND RELIGION. [Decisions made jointly; current school remains unless agreed.]

5. MEDICAL. [Medical aid by whom; excess shared; emergencies notify immediately.]

6. RELOCATION. Neither party relocates a child's primary residence beyond ${B} km / outside the province / the Republic without written consent or a court order.

7. DISPUTE RESOLUTION. Mediation first (FAMAC/social worker/Family Advocate) before approaching a court, save for urgency.

8. BEST INTERESTS. The parties acknowledge the standard in s 7 of the Children's Act.
${SIGN_BLOCK(c?.name)}`,
    },
    {
      id: 'rule43',
      name: 'Rule 43 Founding Affidavit — Skeleton',
      category: 'Divorce',
      body: (c, s) => `${HEADER(s, 'Rule 43 / Rule 58 Application — Founding Affidavit Working Draft')}
I, the undersigned, ${v(c?.name)}, ID ${B}, state under oath:

1. I am the Applicant. The Respondent is ${v(c?.case?.oppName)}, my spouse, residing at ${v(c?.case?.oppAddress)}.
2. A divorce action is pending between us under case number ${B}.
3. INTERIM RELIEF SOUGHT: (a) interim maintenance for myself of R${B} p/m; (b) interim child maintenance of R${B} per child p/m; (c) interim contact/care as set out below; (d) contribution to legal costs of R${B}.
4. MY FINANCIAL POSITION: My income is ${v(c?.case?.yourIncome)} per month. My reasonable monthly expenses are set out in annexure "A" (income & expenditure schedule).
5. RESPONDENT'S FINANCIAL POSITION: To my knowledge the Respondent earns ${v(c?.case?.oppIncome)} per month. [Set out lifestyle evidence if income is concealed.]
6. THE CHILDREN: [Names, ages; current residence: ${v(c?.case?.childrenStay)}; current contact arrangements; what is sought.]
7. The relief is urgent because [school fees / bond / groceries cannot be met].

WHEREFORE I pray for an order in terms of the Notice of Motion.
${SIGN_BLOCK(c?.name)}`,
    },

    /* ---------------- MAINTENANCE ---------------- */
    {
      id: 'j101-pack',
      name: 'Maintenance Application (J101) — Preparation Checklist',
      category: 'Maintenance',
      body: (c, s) => `${HEADER(s, 'Maintenance Court Preparation Checklist (Form J101)')}
Client: ${v(c?.name)} · Children stay with: ${v(c?.case?.childrenStay)}
Respondent: ${v(c?.case?.oppName)} · Address: ${v(c?.case?.oppAddress)}

DOCUMENTS TO TAKE TO THE MAINTENANCE OFFICE:
[ ] Your ID and the children's birth certificates
[ ] Proof of your income: 3 months' payslips / bank statements
[ ] Completed income & expenditure schedule (see separate template)
[ ] Proof of the children's expenses: school fees, aftercare, medical, clothing receipts
[ ] Respondent's details: full name, ID if known (${v(c?.case?.oppId)}), home and WORK address
[ ] Any existing order or written agreement: ${v(c?.case?.existingOrder)}
[ ] Proof of attempts to get the respondent to pay (messages, emails)

WHAT HAPPENS:
1. File J101 at the maintenance court for the district where you or the children live — no fee.
2. The maintenance officer investigates and summonses the respondent for an enquiry date.
3. Both parties' finances are examined. Magistrates decide on DOCUMENTS — your file wins the day.
4. If an order is granted and not paid: s 26 emoluments attachment (garnishee on salary), warrant of execution, or criminal complaint under s 31.

NOTES: ${B}`,
    },
    {
      id: 'income-exp',
      name: 'Income & Expenditure Schedule',
      category: 'Maintenance',
      body: (c, s) => `${HEADER(s, 'Income and Expenditure Schedule')}
Name: ${v(c?.name)} · Month: ${B}

A. INCOME (monthly)
Salary / wages (nett): R${B}
Other income (grants, rental, side income): R${B}
TOTAL INCOME: R${B}

B. EXPENSES (monthly)
Rent / bond: R${B}
Rates, water, electricity: R${B}
Groceries & toiletries: R${B}
Transport / petrol / car payment: R${B}
Car & household insurance: R${B}
Medical aid / medicine: R${B}
School fees & aftercare: R${B}
School clothes / stationery / extramurals: R${B}
Cellphone & data: R${B}
Clothing: R${B}
Debt repayments (list): R${B}
Other: R${B}
TOTAL EXPENSES: R${B}

C. SHORTFALL (B minus A): R${B}

Attach proof for every line where possible. Honesty is non-negotiable — an inflated schedule destroys credibility with the magistrate.`,
    },
    {
      id: 'variation',
      name: 'Maintenance Variation — Request Letter',
      category: 'Maintenance',
      body: (c, s) => `${HEADER(s, 'Application for Variation of Maintenance Order — Supporting Letter')}
Existing order: case/file number ${B}, granted on ${B} at the ${B} Maintenance Court.
Current obligation: R${B} per month.

Material change in circumstances relied upon (s 6, Maintenance Act 99 of 1998):
[ ] Loss of employment / reduced income (attach proof)
[ ] Increased income of the other party
[ ] Changed needs of the child(ren) (school change, medical condition)
[ ] Change in care arrangements — children now stay with: ${v(c?.case?.childrenStay)}
[ ] Other: ${B}

Variation sought: R${B} per month with effect from ${B}.

Attach: new income & expenditure schedule, proof of changed circumstances, copy of existing order.`,
    },
    {
      id: 'demand',
      name: 'Letter of Demand — Maintenance Arrears',
      category: 'Maintenance',
      body: (c, s) => `Dear ${v(c?.case?.oppName)},

DEMAND: ARREAR MAINTENANCE — ${v(c?.name)}

1. You are obliged to pay maintenance of R${B} per month in terms of [the order of the ${B} Maintenance Court dated ${B} / our written agreement dated ${B}].
2. As at today's date you are in arrears in the amount of R${B}, calculated as set out in the attached schedule.
3. Demand is hereby made that you pay the full arrears within 7 (seven) days of this letter, into the following account: ${B}.
4. Failing payment, the following steps will be taken without further notice: enforcement under the Maintenance Act 99 of 1998, including an emoluments attachment order against your salary (s 26), execution against your property (s 27), and/or a criminal complaint (s 31 — failure to pay maintenance is a criminal offence).

This letter is written without prejudice to any rights, all of which are reserved.

${v(c?.name)}
Date: ${B}`,
    },

    /* ---------------- PROTECTION ---------------- */
    {
      id: 'po-affidavit',
      name: 'Protection Order — Founding Statement Skeleton',
      category: 'Protection',
      body: (c, s) => `${HEADER(s, 'Application for Protection Order — Supporting Statement Working Draft')}
Applicant: ${v(c?.name)}
Respondent: ${v(c?.case?.oppName)} · Relationship: ${v(c?.case?.relationship)}
Act: [Domestic Violence Act 116 of 1998 / Protection from Harassment Act 17 of 2011]

1. RELATIONSHIP / HISTORY: [How you know the respondent; domestic relationship if DVA.]

2. INCIDENTS (most recent first — date, place, what happened, injuries, witnesses):
   2.1 On ${B} at ${B}: ${B}
   2.2 On ${B} at ${B}: ${B}
   [Attach: photos, medical/J88 reports, SAPS case numbers, screenshots of messages — print with dates visible.]

3. WHY PROTECTION IS NEEDED NOW: [Ongoing threat; pattern; escalation. Immediate danger: ${v(c?.case?.urgentSafety)}.]

4. RELIEF SOUGHT: that the respondent be ordered not to [assault / threaten / contact / come within ${B}m of home/work/school / damage property]; [emergency monetary relief]; [seizure of firearm]; [no-contact via third parties or electronic means].

5. INTERIM ORDER: I ask that an interim order be granted before notice to the respondent, because [risk of harm if forewarned].

NOTE: an interim order is not a guarantee of safety — pair with the Safety Plan template.
${SIGN_BLOCK(c?.name)}`,
    },
    {
      id: 'safety-plan',
      name: 'Personal Safety Plan',
      category: 'Protection',
      body: (c, s) => `${HEADER(s, 'Personal Safety Plan')}
Prepared with: ${v(c?.name)}

IMMEDIATE DANGER: Call SAPS 10111. GBV Command Centre: 0800 428 428 (24h).

1. SAFE PLACES: Where will you go if you must leave quickly? ${B}
2. EMERGENCY BAG (keep at a trusted person's home): IDs & children's birth certificates, protection order copy, bank cards, medication, spare keys, some cash, change of clothes.
3. PEOPLE WHO KNOW: Two people who know the situation and your code word: ${B}
4. CHILDREN: What the children must do during an incident (go to a room with a lock / neighbour; never intervene): ${B}
5. PHONE: Keep it charged; emergency numbers on speed dial; share live location with a trusted person when meeting the respondent is unavoidable.
6. ORDER BREACHES: Every breach of the protection order → call SAPS immediately, give them the warrant of arrest attached to your order, and write down the case number. Keep a breach diary.
7. DIGITAL: Change passwords; check phone for shared accounts/location sharing; new email if needed.`,
    },

    /* ---------------- PRACTICE ---------------- */
    {
      id: 'intake',
      name: 'Client Intake Questionnaire',
      category: 'Practice',
      body: (c, s) => `${HEADER(s, 'Client Intake Questionnaire')}
CLIENT: ${v(c?.name)} · ${v(c?.phone)} · ${v(c?.email)} · ${v(c?.province)}
MATTER: ${v(c?.matterType)}

1. What outcome are you hoping for, in one sentence? ${B}
2. Opposing party: ${v(c?.case?.oppName)} · ID: ${v(c?.case?.oppId)} · Lives at: ${v(c?.case?.oppAddress)}
3. Are they likely to have an attorney? ${B}
4. Children: involved? ${v(c?.case?.childrenInvolved)} · Staying with: ${v(c?.case?.childrenStay)}
5. Court history: any existing orders / pending cases / next date: ${v(c?.case?.nextCourtDate)}
6. Your income: ${v(c?.case?.yourIncome)} · Their income (if known): ${v(c?.case?.oppIncome)}
7. Marriage regime (if divorce): ${v(c?.case?.marriageRegime)}
8. Spousal maintenance sought? ${v(c?.case?.spousalMaintenance)}
9. Any safety concerns? ${v(c?.case?.urgentSafety)}
10. Documents the client already has: [ ] marriage certificate [ ] children's birth certificates [ ] payslips [ ] bank statements [ ] existing orders [ ] message evidence
11. What was agreed at the end of this consultation: ${B}
12. Next steps and by whom: ${B}`,
    },
    {
      id: 'phone-note',
      name: 'Telephone / Consultation Note',
      category: 'Practice',
      body: (c, s) => `${HEADER(s, 'Telephone / Consultation Note')}
Client: ${v(c?.name)} · Date: ${new Date().toISOString().slice(0, 10)} · Time: ${B}
Type: [ ] Telephone [ ] Video [ ] In-person · Duration: ${B}

Discussed:
${B}
${B}
${B}

Advice given:
${B}
${B}

Client to do:                         By:
${B}                                  ${B}

I to do:                              By:
${B}                                  ${B}

Next contact / consultation: ${B}`,
    },
  ];
}

export const TEMPLATE_CATEGORIES = ['Compliance', 'Engagement', 'Divorce', 'Maintenance', 'Protection', 'Practice'];

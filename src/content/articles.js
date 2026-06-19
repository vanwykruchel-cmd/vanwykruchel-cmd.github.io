/*
 * Blog / Insights articles. Each article is plain data (no framework code) so it
 * can be rendered both in the app and by the static blog generator.
 *
 * To ADD A PHOTO: drop the image file in  public/articles/<slug>/  and add an
 * { type: 'image', src: '/articles/<slug>/filename.jpg', alt: '...', caption: '...' }
 * block where you want it (or set `hero` for the lead image).
 *
 * To ADD AN ARTICLE: copy one of these objects, give it a new unique `slug`,
 * write the blocks, list your sources, then redeploy.
 */

export const ARTICLES = [
  {
    slug: 'maintenance-officer-south-africa-first-court-date',
    title: 'What a Maintenance Officer Does — and Your Rights at the First Court Date',
    description:
      'A clear, plain-English guide to the role of the maintenance officer in South Africa, what really happens at your first maintenance court date, and why you can never be forced to settle for less than is fair.',
    category: 'Maintenance',
    date: '2026-06-19',
    updated: '2026-06-19',
    readingMinutes: 8,
    keywords: [
      'maintenance officer South Africa',
      'maintenance court first appearance',
      'Maintenance Act 99 of 1998',
      'child maintenance court process',
      'informal enquiry maintenance',
      'formal enquiry maintenance court',
      'do I have to settle maintenance',
      'maintenance court rights',
    ],
    hero: {
      src: '/articles/maintenance-officer-south-africa-first-court-date/hero.svg',
      alt: 'Illustration of the scales of justice representing the South African maintenance court',
      caption: 'The maintenance court is designed to be used without an attorney — but knowing how it works changes everything.',
    },
    blocks: [
      { type: 'p', text: 'If you have applied for maintenance — or been summonsed to answer a claim — the first person you deal with is not the magistrate. It is the **maintenance officer**. Understanding who they are, what they may and may not do, and what happens on your first court date is the difference between walking in anxious and walking in prepared.' },
      { type: 'p', text: 'This guide explains the maintenance officer’s role under the **Maintenance Act 99 of 1998**, how the first appearance really works, and — most importantly — the rights you keep throughout, including the right **not** to settle.' },

      { type: 'h2', text: 'Who is the maintenance officer?' },
      { type: 'p', text: 'A maintenance officer is a court official appointed in terms of **section 4** of the Maintenance Act. In most courts the role is filled by a public prosecutor to whom this function has been delegated. They are assisted by **maintenance investigators** (section 5), who trace parties and gather financial information.' },
      { type: 'p', text: 'The single most important thing to understand: the maintenance officer is **neutral**. They are not your lawyer, and they are not on the other side either. Their job is to investigate the matter properly and to help the court reach a fair, lawful outcome — guided by one principle: the best interests of the child.' },

      { type: 'h2', text: 'What the maintenance officer is responsible for' },
      { type: 'p', text: 'The maintenance officer drives the matter from start to finish. Their core responsibilities include:' },
      { type: 'ul', items: [
        'Receiving and processing your complaint (the application is lodged on **Form A**, also called the J101) in terms of **section 6** of the Act — whether it is a claim for maintenance, or to increase, decrease or discharge an existing order;',
        'Investigating the financial position of both parties — income, expenses, assets and the reasonable needs of the child or spouse — with the help of maintenance investigators (section 5);',
        'Subpoenaing witnesses and documents where needed, such as payslips, bank statements and employer records (**section 9**);',
        'Convening the **informal enquiry** and trying to help the parties reach a fair agreement;',
        'If an agreement is reached, placing a **consent order** before the magistrate to be made an order of court;',
        'If no agreement is reached, referring the matter to the magistrate for a **formal enquiry** (**section 10**);',
        'Applying for a **default order** where a properly summonsed respondent fails to appear (**section 18**);',
        'Assisting with enforcement when an order is not paid — emoluments (salary) attachment, warrant of execution, or a criminal complaint.',
      ] },

      { type: 'h2', text: 'How the first court date actually works' },
      { type: 'p', text: 'Your first appearance is usually an **informal enquiry**, not a dramatic trial. After your name is called, the maintenance officer brings both parties together to discuss the claim and to see whether an agreement is possible. It is conducted informally precisely because the system is meant to be used by ordinary people without attorneys.' },
      { type: 'p', text: 'Come prepared. Bring everything that proves the numbers:' },
      { type: 'ul', items: [
        'Your ID and the child’s birth certificate;',
        'Proof of your income — three months’ payslips or bank statements;',
        'A complete, realistic list of the child’s monthly expenses (school fees, aftercare, clothing, medical, transport, food) **with receipts**;',
        'Any existing order or written agreement;',
        'The other party’s details — full name, ID if known, and especially their **work** address.',
      ] },
      { type: 'p', text: 'Magistrates and maintenance officers decide on **documents, not stories**. A complete, organised file is the most powerful thing you can bring.' },

      { type: 'callout', title: 'Your most important right: you do not have to settle', text: 'The informal enquiry exists to *offer* settlement — it can never *force* it. If you believe the amount being proposed is unfair, or you are being pressured to accept less than the child reasonably needs, you are entitled to refuse. When no agreement is reached, the maintenance officer **must** refer the matter to the magistrate for a formal enquiry, where a decision is made on the evidence. Saying “I would like this to go to a formal enquiry” is your right — not a problem.' },

      { type: 'h2', text: 'If you reach agreement: the consent order' },
      { type: 'p', text: 'If both parties agree, the terms are written up and placed before the magistrate as a **consent order**. Once granted it is a binding order of court — enforceable in exactly the same way as an order made after a full hearing. In a straightforward agreed matter, the magistrate may grant the order without requiring a long appearance.' },
      { type: 'p', text: 'Only agree to a figure you understand and can live with. A consent order is not a quick formality to escape an uncomfortable morning — it governs the next several years.' },

      { type: 'h2', text: 'If you do not agree: the formal enquiry' },
      { type: 'p', text: 'Where settlement fails, the matter proceeds to a **formal enquiry** before the magistrate under **section 10**. Both sides present evidence and may call witnesses; the magistrate examines the finances and decides whether maintenance is payable and how much. You are entitled to legal representation or assistance, although many people present their own well-prepared case.' },
      { type: 'p', text: 'If a respondent was properly summonsed but simply does not arrive, the court can grant a **maintenance order by default** under **section 18** — failing to show up does not make the claim go away.' },

      { type: 'h2', text: 'Your rights, in a nutshell' },
      { type: 'ol', items: [
        'It costs **nothing** to lodge a maintenance complaint;',
        'You have the right to have both parties’ finances investigated;',
        'You have the right **not** to settle, and to insist the matter go to a formal enquiry;',
        'You have the right to a decision by the magistrate based on evidence;',
        'You have the right to legal representation or assistance;',
        'If an order is granted and not paid, you have the right to enforce it.',
      ] },

      { type: 'h2', text: 'How preparation changes the outcome' },
      { type: 'p', text: 'Maintenance court is one of the most misunderstood processes in South Africa. People lose not because the law is against them, but because they arrive without the documents that prove their case. That is exactly the gap this practice fills: I help you build a complete, organised file, understand what you are entitled to, and walk in knowing precisely what to expect — at a clear fixed fee, a fraction of what an attorney would charge by the hour.' },
    ],
    sources: [
      { title: 'Maintenance Act 99 of 1998 (full text) — Department of Justice & Constitutional Development', url: 'https://www.justice.gov.za/legislation/acts/1998-099.pdf' },
      { title: 'Regulations relating to Maintenance, 1999 (GN R1361)', url: 'https://www.justice.gov.za/legislation/regulations/1998-99_MNTAct_regulations.pdf' },
      { title: 'Maintenance — Department of Justice & Constitutional Development', url: 'https://www.justice.gov.za/vg/mnt.html' },
      { title: 'Maintenance: Frequently Asked Questions — Department of Justice', url: 'https://www.justice.gov.za/vg/mnt-faq.html' },
      { title: 'Maintenance Act 99 of 1998 — South African Government', url: 'https://www.gov.za/documents/maintenance-act' },
    ],
  },
];

export function getArticle(slug) {
  return ARTICLES.find((a) => a.slug === slug);
}

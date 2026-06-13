import { useState } from 'react';
import { card, btn } from './ui';

/*
 * Plain-language manual for the Practice Manager, written for everyday use —
 * no jargon. Each topic opens and closes when clicked.
 */

const TOPICS = [
  {
    q: 'What is this and how is my information kept safe?',
    a: [
      'This is your private office: every client file, fee, invoice, payment and document lives here.',
      'Your information is stored only in this browser, on this computer. It is never sent to the internet or to anyone else. That keeps it private and POPIA-friendly.',
      'Because it lives on this computer, there is one golden rule: BACK UP REGULARLY. Go to Settings → Backup & Restore → "Download Backup" once a week and save the file to OneDrive. If your computer is ever lost or reset, that file is how you get everything back.',
      'Do not clear your browsing data / cookies for this site, or the information could be erased. The backup file is always your safety net.',
    ],
  },
  {
    q: 'How do I open a new client file?',
    a: [
      'Click the "Clients" tab, then "+ New Client".',
      'Type the client’s name (the only required field) and any contact details you have, then "Create Client File".',
      'Each file is given its own reference number automatically (for example VW-001). You will see it next to the client’s name and on their invoices.',
      'Open a file any time by clicking "Open File". Inside, the small tabs (Case File, Activity, Fees & Time, Invoices, Payments, Statement, Quotes, Forms, Documents) are everything about that one client.',
    ],
  },
  {
    q: 'How do I record the work I do?',
    a: [
      'Open the client’s file and click "Fees & Time". This is where you log everything you do so it can be billed later.',
      'Pick the type of charge:',
      '• Time / attendance — consultations, drafting, calls. Enter the hours (e.g. 1.5) and your rate fills in automatically.',
      '• Time units — the 6-minute attorney-style unit, if you prefer to charge that way.',
      '• Per page — drafting or copies charged per page.',
      '• Travel — kilometres to court or a meeting.',
      '• Fixed fee — a set amount you agreed (e.g. a document pack).',
      '• Disbursement / cost — money you paid out for the client (sheriff, court fees, courier).',
      'Type a short description and click "Add to file". The amount is worked out for you. The box at the top shows how much work is "not yet invoiced".',
      'Your default rates are set once in Settings, so you don’t have to retype them each time — but you can always change a rate on a single entry.',
    ],
  },
  {
    q: 'How do I send a client an invoice?',
    a: [
      'Open the file and click "Invoices", then "+ New Tax Invoice".',
      'The work you recorded under "Fees & Time" is listed with ticks — untick anything you don’t want to bill yet, or add a custom line.',
      'Check the total (VAT is added automatically if you switched it on in Settings), add a note if you like, then "Create & Print Invoice".',
      'A clean Tax Invoice opens ready to print or save as PDF (see "How do I print or make a PDF?"). It has your logo, the client’s details, your banking details and the invoice number as the payment reference.',
      'Once work is on an invoice it is marked "Invoiced" so you never bill it twice.',
    ],
  },
  {
    q: 'How do I record a payment from a client?',
    a: [
      'Open the file and click "Payments".',
      'Enter the amount, the date, and how they paid (EFT, cash, card), then "Add Payment".',
      'The three boxes at the top always show: how much you have Invoiced, how much you have Received, and the Balance still owing.',
    ],
  },
  {
    q: 'What is the Statement?',
    a: [
      'The "Statement" tab inside a file is the client’s account: every invoice (a charge) and every payment, in date order, with a running balance.',
      'Click "Print Statement / PDF" to give the client a professional summary of what they owe. This is the document to send when chasing an unpaid balance.',
    ],
  },
  {
    q: 'What is the difference between a Quote and an Invoice?',
    a: [
      'A Quote is an estimate you send BEFORE doing work — "this is what it will cost". You build quotes from your price list under the "Quotes" tab.',
      'An Invoice is the real bill you send AFTER (or as) you do the work, based on the fees you recorded. Invoices are what create the balance the client owes.',
      'A simple way to remember: Quote first to agree the price, Invoice later to ask for payment.',
    ],
  },
  {
    q: 'How do the Diary and reminders work?',
    a: [
      'The "Diary" tab is your to-do list with dates: court dates, follow-up calls, deadlines.',
      'Add a reminder and pick the file it belongs to. Anything due in the next two weeks also shows on your Dashboard so nothing slips.',
      'Court dates you enter on a client’s Case File appear in the Diary automatically.',
      'Tick a reminder as "Done" when it’s handled.',
    ],
  },
  {
    q: 'How do I use the document templates and signing forms?',
    a: [
      'Inside a file, "Forms" holds the four documents every client signs before work begins (POPIA consent, advisor-status disclosure, indemnity, service agreement). Print each one already filled in with the client’s details, and track whether it’s been signed.',
      'The main "Quotes" tab and the templates fill in client details for you. Always read through a document and adjust it before it goes out.',
      '"Documents" lets you keep a record of every document drafted or received — either paste the text, or paste a link to the file in the client’s OneDrive folder.',
    ],
  },
  {
    q: 'What do the Reports show?',
    a: [
      'The "Reports" tab is the money overview across your whole practice:',
      '• Income received per month (actual payments banked).',
      '• Work in progress — fees you’ve recorded but not yet invoiced.',
      '• Outstanding accounts — who still owes you and how much (your collection list).',
      'Use it at month-end to see how the practice is doing and who to follow up.',
    ],
  },
  {
    q: 'How does Search work?',
    a: [
      'Click "Search" and type anything — a name, a phone number, a file reference, an invoice number, even a word from your notes.',
      'Results are grouped (clients, invoices, quotes, notes). Click any client result to jump straight into that file.',
    ],
  },
  {
    q: 'How do I set my rates, VAT and banking details?',
    a: [
      'Go to "Settings". Fill in your business name, email, phone and banking details — these appear on every quote, invoice and statement.',
      'Under "Rates & VAT", set your standard hourly rate, per-unit, per-page and travel rates so they fill in automatically when you record work.',
      'If you are registered for VAT, switch VAT on and enter your VAT number and rate (15% in South Africa). If you are not registered, leave it off and no VAT is added.',
      'Your price list for quotes is on the "Pricing" tab.',
    ],
  },
  {
    q: 'How do I print or make a PDF?',
    a: [
      'Anywhere you see "Print / PDF", click it. Your computer’s print window opens.',
      'To get a PDF instead of paper, choose "Save as PDF" (or "Microsoft Print to PDF") as the printer, then Save. You can then email that PDF to the client.',
      'Only the document itself prints — the menus and buttons are hidden automatically.',
    ],
  },
  {
    q: 'Something looks wrong / I made a mistake',
    a: [
      'Almost everything can be deleted with the ✕ button and re-added.',
      'Deleting an invoice puts its work back to "not yet invoiced" so you can re-bill it correctly.',
      'If the whole thing ever looks empty or odd, restore your most recent backup from Settings → Restore from Backup.',
      'When in doubt, download a fresh backup first — then you can experiment safely.',
    ],
  },
];

function Item({ topic, open, onToggle }) {
  return (
    <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{ width: '100%', textAlign: 'left', background: open ? 'var(--forest)' : 'transparent', color: open ? '#fff' : 'var(--forest)', border: 'none', padding: '16px 20px', fontSize: '1rem', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif', display: 'flex', justifyContent: 'space-between', gap: 12 }}
      >
        <span>{topic.q}</span>
        <span style={{ flexShrink: 0 }}>{open ? '–' : '+'}</span>
      </button>
      {open && (
        <div style={{ padding: '16px 20px 20px' }}>
          {topic.a.map((line, i) => (
            <p key={i} style={{ marginBottom: 8, lineHeight: 1.7, color: 'var(--mid)', fontSize: '0.92rem' }}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Manual() {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ ...card, borderTop: '3px solid var(--copper)', marginBottom: 18 }}>
        <h3 className="serif" style={{ fontSize: '1.5rem', marginBottom: 8 }}>How to use your Practice Manager</h3>
        <p style={{ color: 'var(--mid)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          A short, plain-language guide to everything in here. Click a question to open it.
          The single most important habit is the weekly backup — start with the first topic.
        </p>
        <a href="#/practice" style={{ display: 'none' }} aria-hidden />
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {TOPICS.map((t, i) => (
          <Item key={i} topic={t} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
        ))}
      </div>
      <div style={{ ...card, marginTop: 18, background: 'var(--cream)' }}>
        <p style={{ lineHeight: 1.7, fontSize: '0.92rem' }}>
          <strong>Remember:</strong> you are a Family Law Consultant, not an admitted attorney — every quote,
          invoice and statement carries that disclosure automatically. Fees are agreed in writing before work
          begins, and payment is by EFT only.
        </p>
        <button style={{ ...btn, marginTop: 12 }} onClick={() => setOpen(0)}>Back to top</button>
      </div>
    </div>
  );
}

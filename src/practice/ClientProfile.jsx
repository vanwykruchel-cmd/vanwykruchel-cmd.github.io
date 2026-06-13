import { useState } from 'react';
import { card, input, label, btn, btnGhost, tag, STAGES, STAGE_COLORS, R, uid, today, quoteTotal, PrintTextDoc } from './ui';
import { getTemplates } from './templates';
import { MATTER_TYPES, PROVINCES } from '../constants/data';
import { account } from './billing';
import { FeesTime, FileInvoices, Payments, AccountStatement, PrintInvoice, PrintAccount } from './FileBilling';
import CourtDocs from './CourtDocs';

const ACTIVITY_TYPES = ['Note', 'Telephone call', 'Email', 'WhatsApp', 'Session recording', 'Document sent', 'Other'];
const DOC_CATEGORIES = ['Drafted document', 'Court document', 'Client correspondence', 'Evidence', 'Other'];

const COMPLIANCE_FORMS = [
  { key: 'popia', name: 'POPIA Consent', templateId: 'popia' },
  { key: 'disclosure', name: 'Advisor Status Disclosure', templateId: 'disclosure' },
  { key: 'indemnity', name: 'Indemnity & Limitation of Liability', templateId: 'indemnity' },
  { key: 'contract', name: 'Consultancy Service Agreement', templateId: 'contract' },
];
const FORM_STATUSES = ['Pending', 'Sent to client', 'Signed'];

const CASE_FIELD_DEFS = [
  ['oppName', 'Opposing party — name & surname'],
  ['oppId', 'Opposing party — ID number'],
  ['oppAddress', 'Opposing party — address / area'],
  ['childrenInvolved', 'Children involved?', ['', 'Yes', 'No']],
  ['childrenStay', 'Children staying with'],
  ['nextCourtDate', 'Next court date', 'date'],
  ['yourIncome', "Client's monthly income"],
  ['oppIncome', "Other party's income (if known)"],
  ['marriageRegime', 'Marriage regime', ['', 'In community of property', 'Out of community — with accrual', 'Out of community — without accrual', 'Not sure']],
  ['spousalMaintenance', 'Spousal maintenance sought?', ['', 'Yes', 'No', 'Not sure']],
  ['existingOrder', 'Existing orders / case numbers'],
  ['relationship', 'Relationship to other party (protection matters)'],
  ['urgentSafety', 'Immediate safety concern?', ['', 'Yes', 'No']],
  ['currentArrangement', 'Current care / contact arrangement'],
];

const SUB_TABS = ['Case File', 'Court Docs', 'Activity', 'Fees & Time', 'Invoices', 'Payments', 'Statement', 'Quotes', 'Forms', 'Documents'];

export default function ClientProfile({ client, data, update, onBack, onNewQuote }) {
  const [sub, setSub] = useState('Case File');
  const [printDoc, setPrintDoc] = useState(null); // {title,text} | {invoice} | {account:true}

  function patchClient(patch) {
    update({ clients: data.clients.map((c) => (c.id === client.id ? { ...c, ...patch } : c)) });
  }

  function doPrint(setter) {
    setter();
    setTimeout(() => {
      window.print();
      setPrintDoc(null);
    }, 150);
  }
  const printText = (title, text) => doPrint(() => setPrintDoc({ title, text }));
  const printInvoice = (invoice) => doPrint(() => setPrintDoc({ invoice }));
  const printStatement = () => doPrint(() => setPrintDoc({ account: true }));

  const clientQuotes = data.quotes.filter((q) => q.clientId === client.id);
  const acc = account(client, data);
  const [bg, fg] = STAGE_COLORS[client.stage] || ['#eee', '#333'];

  return (
    <div>
      <button style={{ ...btnGhost, marginBottom: 16 }} onClick={onBack}>← All clients</button>

      <div style={{ ...card, marginBottom: 18, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
        <div>
          <h2 className="serif" style={{ fontSize: '1.6rem' }}>
            {client.name}{client.ref && <span style={{ color: 'var(--muted)', fontSize: '1rem', fontWeight: 400 }}> · {client.ref}</span>}
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 4 }}>
            {client.matterType} · {client.province} · {client.phone || '—'} · {client.email || '—'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {acc.balance > 0 && <span style={tag('#fbeede', '#9a5c38')}>Owing {R(acc.balance)}</span>}
          <span style={tag(bg, fg)}>{client.stage}</span>
          <select style={{ ...input, width: 'auto', padding: '7px 10px' }} value={client.stage} onChange={(e) => patchClient({ stage: e.target.value })}>
            {STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        {SUB_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setSub(t)}
            style={{
              ...btnGhost,
              padding: '8px 16px',
              background: sub === t ? 'var(--copper)' : 'transparent',
              color: sub === t ? '#fff' : 'var(--forest)',
              borderColor: sub === t ? 'var(--copper)' : 'var(--creamdark)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {sub === 'Case File' && <CaseFile client={client} patchClient={patchClient} />}
      {sub === 'Court Docs' && <CourtDocs client={client} patchClient={patchClient} settings={data.settings} printText={printText} />}
      {sub === 'Activity' && <Activity client={client} patchClient={patchClient} />}
      {sub === 'Fees & Time' && <FeesTime client={client} patchClient={patchClient} settings={data.settings} />}
      {sub === 'Invoices' && <FileInvoices client={client} data={data} update={update} settings={data.settings} onPrint={printInvoice} />}
      {sub === 'Payments' && <Payments client={client} patchClient={patchClient} data={data} />}
      {sub === 'Statement' && <AccountStatement client={client} data={data} onPrint={printStatement} />}
      {sub === 'Quotes' && <ProfileQuotes quotes={clientQuotes} onNewQuote={() => onNewQuote(client.id)} />}
      {sub === 'Forms' && <Forms client={client} patchClient={patchClient} settings={data.settings} printText={printText} />}
      {sub === 'Documents' && <Documents client={client} patchClient={patchClient} printText={printText} />}

      {printDoc?.text != null && <PrintTextDoc title={printDoc.title} text={printDoc.text} settings={data.settings} />}
      {printDoc?.invoice && <PrintInvoice invoice={printDoc.invoice} client={client} settings={data.settings} />}
      {printDoc?.account && <PrintAccount client={client} data={data} settings={data.settings} />}
    </div>
  );
}

/* ---------- Case File ---------- */
function CaseFile({ client, patchClient }) {
  const [c, setC] = useState({ preferConsult: false, notes: '', ...(client.case || {}) });
  const [basics, setBasics] = useState({ name: client.name, email: client.email, phone: client.phone, province: client.province, matterType: client.matterType });
  const [saved, setSaved] = useState(false);

  function save() {
    patchClient({ ...basics, case: c });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ ...card, maxWidth: 820 }}>
      <h3 className="serif" style={{ fontSize: '1.25rem', marginBottom: 14 }}>Client Details</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={label}>Full name</label>
          <input style={input} value={basics.name} onChange={(e) => setBasics({ ...basics, name: e.target.value })} />
        </div>
        <div><label style={label}>Email</label><input style={input} value={basics.email || ''} onChange={(e) => setBasics({ ...basics, email: e.target.value })} /></div>
        <div><label style={label}>Phone</label><input style={input} value={basics.phone || ''} onChange={(e) => setBasics({ ...basics, phone: e.target.value })} /></div>
        <div>
          <label style={label}>Province</label>
          <select style={input} value={basics.province} onChange={(e) => setBasics({ ...basics, province: e.target.value })}>
            {PROVINCES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label style={label}>Matter type</label>
          <select style={input} value={basics.matterType} onChange={(e) => setBasics({ ...basics, matterType: e.target.value })}>
            {MATTER_TYPES.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <h3 className="serif" style={{ fontSize: '1.25rem', marginBottom: 6 }}>Case Details</h3>
      <label style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, cursor: 'pointer' }}>
        <input type="checkbox" checked={!!c.preferConsult} onChange={(e) => setC({ ...c, preferConsult: e.target.checked })} style={{ accentColor: 'var(--copper)' }} />
        <span style={{ fontSize: '0.9rem' }}>Client preferred to discuss details in consultation</span>
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>
        {CASE_FIELD_DEFS.map(([key, lbl, opts]) => (
          <div key={key}>
            <label style={label}>{lbl}</label>
            {Array.isArray(opts) ? (
              <select style={input} value={c[key] || ''} onChange={(e) => setC({ ...c, [key]: e.target.value })}>
                {opts.map((o) => <option key={o} value={o}>{o || 'Select…'}</option>)}
              </select>
            ) : (
              <input type={opts === 'date' ? 'date' : 'text'} style={input} value={c[key] || ''} onChange={(e) => setC({ ...c, [key]: e.target.value })} />
            )}
          </div>
        ))}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={label}>Case notes</label>
          <textarea rows={4} style={{ ...input, resize: 'vertical' }} value={c.notes || ''} onChange={(e) => setC({ ...c, notes: e.target.value })} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 18 }}>
        <button style={btn} onClick={save}>Save Case File</button>
        {saved && <span style={{ color: 'var(--forest)', fontWeight: 600 }}>Saved ✓</span>}
      </div>
    </div>
  );
}

/* ---------- Activity timeline ---------- */
function Activity({ client, patchClient }) {
  const [entry, setEntry] = useState({ type: 'Note', date: today(), text: '', link: '' });
  const list = [...(client.activities || [])].sort((a, b) => (a.date < b.date ? 1 : -1));

  function add() {
    if (!entry.text.trim() && !entry.link.trim()) return;
    patchClient({ activities: [...(client.activities || []), { ...entry, id: uid() }] });
    setEntry({ type: 'Note', date: today(), text: '', link: '' });
  }

  function remove(id) {
    patchClient({ activities: (client.activities || []).filter((a) => a.id !== id) });
  }

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 760 }}>
      <div style={card}>
        <h3 className="serif" style={{ fontSize: '1.25rem', marginBottom: 12 }}>Add Entry</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={label}>Type</label>
            <select style={input} value={entry.type} onChange={(e) => setEntry({ ...entry, type: e.target.value })}>
              {ACTIVITY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Date</label>
            <input type="date" style={input} value={entry.date} onChange={(e) => setEntry({ ...entry, date: e.target.value })} />
          </div>
        </div>
        <label style={label}>What happened / was discussed</label>
        <textarea rows={3} style={{ ...input, resize: 'vertical', marginBottom: 12 }} value={entry.text} onChange={(e) => setEntry({ ...entry, text: e.target.value })} />
        <label style={label}>Link (recording, email, OneDrive file — optional)</label>
        <input style={{ ...input, marginBottom: 12 }} placeholder="https://…" value={entry.link} onChange={(e) => setEntry({ ...entry, link: e.target.value })} />
        <button style={btn} onClick={add}>Add to Timeline</button>
      </div>

      {list.length === 0 && <p style={{ color: 'var(--muted)' }}>No entries yet. Every call, note, email and session lands here with its date.</p>}
      {list.map((a) => (
        <div key={a.id} style={{ ...card, borderLeft: '3px solid var(--copper)', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>
              {a.date} · <strong style={{ color: 'var(--copper)' }}>{a.type}</strong>
            </p>
            {a.text && <p style={{ marginTop: 6, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{a.text}</p>}
            {a.link && (
              <a href={a.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--copper)', textDecoration: 'underline', fontSize: '0.88rem', display: 'inline-block', marginTop: 6 }}>
                Open link
              </a>
            )}
          </div>
          <button style={{ ...btnGhost, color: '#a33', alignSelf: 'flex-start', padding: '5px 10px' }} onClick={() => remove(a.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}

/* ---------- Quotes (read view inside profile) ---------- */
function ProfileQuotes({ quotes, onNewQuote }) {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
      <div>
        <button style={btn} onClick={onNewQuote}>+ New Quote for this client</button>
      </div>
      {quotes.length === 0 && <p style={{ color: 'var(--muted)' }}>No quotes for this client yet.</p>}
      {[...quotes].reverse().map((q) => (
        <div key={q.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <strong style={{ color: 'var(--forest)' }}>{q.number}</strong>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 3 }}>{q.created} · {q.items.length} item(s)</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <strong style={{ color: 'var(--copper)' }}>{R(quoteTotal(q))}</strong>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 3 }}>{q.status}</p>
          </div>
        </div>
      ))}
      <p style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>Editing and printing quotes happens in the main Quotes tab.</p>
    </div>
  );
}

/* ---------- Compliance forms ---------- */
function Forms({ client, patchClient, settings, printText }) {
  const templates = getTemplates();
  const forms = client.forms || {};

  function setForm(key, patch) {
    patchClient({ forms: { ...forms, [key]: { ...(forms[key] || { status: 'Pending', date: '' }), ...patch } } });
  }

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 760 }}>
      <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>
        The four documents every client signs before work begins. Print each one pre-filled, send it for signature,
        and track its status here.
      </p>
      {COMPLIANCE_FORMS.map((f) => {
        const state = forms[f.key] || { status: 'Pending', date: '' };
        const tpl = templates.find((t) => t.id === f.templateId);
        const done = state.status === 'Signed';
        return (
          <div key={f.key} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderLeft: `3px solid ${done ? '#1d6b3a' : 'var(--copper)'}` }}>
            <div>
              <strong style={{ color: 'var(--forest)' }}>{f.name}</strong>
              <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 3 }}>
                {done ? `Signed on ${state.date || '—'}` : state.status}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                style={{ ...input, width: 'auto', padding: '7px 10px' }}
                value={state.status}
                onChange={(e) => setForm(f.key, { status: e.target.value, date: e.target.value === 'Signed' ? today() : state.date })}
              >
                {FORM_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <button style={btn} onClick={() => printText(f.name, tpl.body(client, settings))}>Print / PDF</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Documents vault ---------- */
function Documents({ client, patchClient, printText }) {
  const [doc, setDoc] = useState({ title: '', category: DOC_CATEGORIES[0], link: '', content: '' });
  const docs = [...(client.documents || [])].sort((a, b) => (a.date < b.date ? 1 : -1));

  function add() {
    if (!doc.title.trim()) return;
    patchClient({ documents: [...(client.documents || []), { ...doc, id: uid(), date: today() }] });
    setDoc({ title: '', category: DOC_CATEGORIES[0], link: '', content: '' });
  }

  function remove(id) {
    if (!window.confirm('Remove this document record?')) return;
    patchClient({ documents: (client.documents || []).filter((d) => d.id !== id) });
  }

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 760 }}>
      <div style={card}>
        <h3 className="serif" style={{ fontSize: '1.25rem', marginBottom: 12 }}>Add Document</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: 14, lineHeight: 1.6 }}>
          Save the document file itself in the client's OneDrive folder and paste its link here — or paste the
          full drafted text below to keep it (and print it) right inside the profile.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
          <div><label style={label}>Title</label><input style={input} value={doc.title} onChange={(e) => setDoc({ ...doc, title: e.target.value })} /></div>
          <div>
            <label style={label}>Category</label>
            <select style={input} value={doc.category} onChange={(e) => setDoc({ ...doc, category: e.target.value })}>
              {DOC_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <label style={label}>Link to file (OneDrive / Drive — optional)</label>
        <input style={{ ...input, marginBottom: 12 }} placeholder="https://…" value={doc.link} onChange={(e) => setDoc({ ...doc, link: e.target.value })} />
        <label style={label}>Document text (optional)</label>
        <textarea rows={5} style={{ ...input, resize: 'vertical', marginBottom: 12 }} value={doc.content} onChange={(e) => setDoc({ ...doc, content: e.target.value })} />
        <button style={btn} onClick={add}>Save Document</button>
      </div>

      {docs.length === 0 && <p style={{ color: 'var(--muted)' }}>No documents stored yet.</p>}
      {docs.map((d) => (
        <div key={d.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <strong style={{ color: 'var(--forest)' }}>{d.title}</strong>
            <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 3 }}>{d.date} · {d.category}</p>
            {d.link && (
              <a href={d.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--copper)', textDecoration: 'underline', fontSize: '0.85rem' }}>
                Open file
              </a>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            {d.content && <button style={btnGhost} onClick={() => printText(d.title, d.content)}>Print</button>}
            <button style={{ ...btnGhost, color: '#a33', padding: '5px 10px' }} onClick={() => remove(d.id)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* The Statement (debtor account) now lives in FileBilling.jsx — it is built from
 * real Tax Invoices and Payments, not from quote statuses. */

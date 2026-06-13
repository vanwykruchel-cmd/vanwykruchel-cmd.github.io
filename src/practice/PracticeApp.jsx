import { useEffect, useMemo, useState } from 'react';
import VWLogo from '../components/VWLogo';
import ClientProfile from './ClientProfile';
import { getTemplates, TEMPLATE_CATEGORIES } from './templates';
import {
  STAGES, QUOTE_STATUS, R, uid, today, quoteTotal,
  card, input, label, btn, btnGhost, tag, STAGE_COLORS, PrintHeader,
} from './ui';
import { MATTER_TYPES, PROVINCES, DISCLAIMER } from '../constants/data';
import {
  DEFAULT_RATES, account, unbilledTotal, paymentsOf, nextFileRef,
} from './billing';
import { PrintInvoice } from './FileBilling';
import GlobalSearch from './GlobalSearch';
import Manual from './Manual';

/*
 * Van Wyk Practice Manager — private CRM, client files, pricing, quoting,
 * compliance forms, document templates and income ledger. All data lives in
 * THIS browser's localStorage; nothing is sent to any server. Back up weekly
 * from the Settings tab.
 */

const STORE_KEY = 'vwfla_practice_v1';

const DEFAULT_PRICES = [
  { id: 'p1', name: 'Intake Consultation (60 min)', price: 650 },
  { id: 'p2', name: 'Divorce — Uncontested (full preparation)', price: 4500 },
  { id: 'p3', name: 'Settlement Agreement Drafting', price: 2500 },
  { id: 'p4', name: 'Rule 43 Application Pack', price: 2800 },
  { id: 'p5', name: 'Maintenance Application Pack (J101)', price: 1800 },
  { id: 'p6', name: 'Maintenance Variation Pack', price: 1600 },
  { id: 'p7', name: 'Protection Order Pack', price: 1500 },
  { id: 'p8', name: 'Parenting Plan (comprehensive)', price: 2200 },
  { id: 'p9', name: "Children's Court Preparation", price: 1900 },
  { id: 'p10', name: 'Document Review (per document)', price: 450 },
  { id: 'p11', name: 'Court Coaching Session (60 min)', price: 600 },
  { id: 'p12', name: 'Monthly Advisory Retainer', price: 1200 },
  { id: 'b1', name: 'BUNDLE: Divorce Complete (consult + settlement + process)', price: 7500 },
  { id: 'b2', name: 'BUNDLE: Maintenance Complete (consult + pack + coaching)', price: 2900 },
  { id: 'b3', name: 'BUNDLE: Safety (protection order + coaching)', price: 1950 },
];

function freshData() {
  return {
    pin: null,
    settings: {
      ownerName: 'Van Wyk Family Law Advisory',
      email: 'vanwykruchel@gmail.com',
      phone: '060 702 3765',
      bankName: '',
      accName: '',
      accNo: '',
      branch: '',
      quoteValidityDays: 14,
      ...DEFAULT_RATES,
    },
    clients: [],
    prices: DEFAULT_PRICES,
    quotes: [],
    invoices: [],
    diary: [],
    invoiceSeq: 0,
    fileSeq: 0,
  };
}

/* Bring any saved data up to the current shape without losing a thing:
 * add new top-level lists, default rates, and give older client files a
 * reference number and empty fee/payment lists. */
function migrate(d) {
  const base = freshData();
  let seq = d.fileSeq || 0;
  const clients = (d.clients || []).map((c) => {
    let ref = c.ref;
    if (!ref) { seq += 1; ref = `VW-${String(seq).padStart(3, '0')}`; }
    return {
      ...c, ref,
      activities: c.activities || [], documents: c.documents || [],
      forms: c.forms || {}, case: c.case || {},
      fees: c.fees || [], payments: c.payments || [],
    };
  });
  return {
    ...base,
    ...d,
    settings: { ...base.settings, ...(d.settings || {}) },
    clients,
    invoices: d.invoices || [],
    diary: d.diary || [],
    invoiceSeq: d.invoiceSeq || 0,
    fileSeq: Math.max(seq, d.fileSeq || 0),
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return migrate(JSON.parse(raw));
  } catch (e) { /* corrupted store — start fresh */ }
  return freshData();
}

function persist(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

/* ================= PIN GATE ================= */
function PinGate({ data, setData, onUnlock }) {
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const setup = !data.pin;

  function submit(e) {
    e.preventDefault();
    if (setup) {
      if (pin.length < 4) return setErr('PIN must be at least 4 digits.');
      if (pin !== confirm) return setErr('PINs do not match.');
      const next = { ...data, pin };
      setData(next);
      persist(next);
      onUnlock();
    } else {
      if (pin === data.pin) onUnlock();
      else setErr('Incorrect PIN.');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', padding: 24 }}>
      <form onSubmit={submit} style={{ ...card, maxWidth: 380, width: '100%', textAlign: 'center', padding: 40 }}>
        <VWLogo size={80} />
        <h1 className="serif" style={{ fontSize: '1.6rem', margin: '18px 0 6px' }}>Practice Manager</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 24 }}>
          {setup ? 'Create a PIN to protect this device.' : 'Enter your PIN to continue.'}
        </p>
        <input type="password" inputMode="numeric" placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} style={{ ...input, textAlign: 'center', letterSpacing: '0.4em', marginBottom: 12 }} autoFocus />
        {setup && (
          <input type="password" inputMode="numeric" placeholder="Confirm PIN" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={{ ...input, textAlign: 'center', letterSpacing: '0.4em', marginBottom: 12 }} />
        )}
        {err && <p style={{ color: '#a33', fontSize: '0.85rem', marginBottom: 10 }}>{err}</p>}
        <button type="submit" style={{ ...btn, width: '100%' }}>{setup ? 'Create PIN' : 'Unlock'}</button>
        <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: 18, lineHeight: 1.6 }}>
          Your data is stored only in this browser on this computer. Use the Backup in Settings regularly.
        </p>
      </form>
    </div>
  );
}

/* Gather diary reminders + court dates from across every file, soonest first. */
function diaryItems(data) {
  const items = (data.diary || []).map((e) => {
    const c = data.clients.find((x) => x.id === e.clientId);
    return { id: e.id, date: e.date, note: e.note, done: !!e.done, clientId: e.clientId, clientName: c?.name || 'General', kind: 'reminder' };
  });
  data.clients.forEach((c) => {
    const d = c.case?.nextCourtDate;
    if (d) items.push({ id: 'court-' + c.id, date: d, note: 'Court date', done: false, clientId: c.id, clientName: c.name, kind: 'court' });
  });
  return items.sort((a, b) => (a.date < b.date ? -1 : 1));
}

/* ================= DASHBOARD ================= */
function Dashboard({ data, onOpenClient, goTab }) {
  const stats = useMemo(() => {
    const ym = today().slice(0, 7);
    let outstanding = 0, wip = 0, thisMonth = 0;
    data.clients.forEach((c) => {
      const a = account(c, data);
      if (a.balance > 0) outstanding += a.balance;
      wip += unbilledTotal(c);
      paymentsOf(c).forEach((p) => { if ((p.date || '').slice(0, 7) === ym) thisMonth += Number(p.amount) || 0; });
    });
    const open = data.clients.filter((c) => !['Completed', 'Referred Out'].includes(c.stage)).length;
    const formsOutstanding = data.clients.reduce((n, c) => {
      const f = c.forms || {};
      const signedCount = ['popia', 'disclosure', 'indemnity', 'contract'].filter((k) => f[k]?.status === 'Signed').length;
      return n + (c.stage === 'Paid — Active' && signedCount < 4 ? 1 : 0);
    }, 0);
    return { open, outstanding, wip, thisMonth, formsOutstanding };
  }, [data]);

  const horizon = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
  const upcoming = diaryItems(data).filter((i) => !i.done && i.date <= horizon);

  const boxes = [
    ['Active matters', stats.open],
    ['Income this month', R(stats.thisMonth)],
    ['Outstanding (owed to you)', R(stats.outstanding)],
    ['Unbilled work', R(stats.wip)],
    ['Active files missing signed forms', stats.formsOutstanding],
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
      {boxes.map(([t, v]) => (
        <div key={t} style={{ ...card, borderTop: '3px solid var(--copper)' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t}</p>
          <p className="serif" style={{ fontSize: '2rem', color: 'var(--forest)', fontWeight: 700, marginTop: 6 }}>{v}</p>
        </div>
      ))}

      <div style={{ ...card, gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <h3 className="serif" style={{ fontSize: '1.3rem' }}>Coming up (next 14 days)</h3>
          <button style={{ ...btnGhost, padding: '6px 12px' }} onClick={() => goTab('Diary')}>Open Diary</button>
        </div>
        {upcoming.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Nothing due in the next two weeks.</p>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {upcoming.map((i) => {
              const overdue = i.date < today();
              return (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--cream)', borderRadius: 4, borderLeft: `3px solid ${overdue ? '#a33' : i.kind === 'court' ? 'var(--forest)' : 'var(--copper)'}` }}>
                  <div>
                    <span style={{ fontWeight: 600, color: overdue ? '#a33' : 'var(--forest)' }}>{i.date}</span>
                    <span style={{ color: 'var(--mid)' }}> · {i.note}</span>
                    <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}> — {i.clientName}</span>
                    {i.kind === 'court' && <span style={{ ...tag('#e7f0e9', '#1d6b3a'), marginLeft: 8 }}>court</span>}
                  </div>
                  {i.clientId && <button style={{ ...btnGhost, padding: '5px 10px' }} onClick={() => onOpenClient(i.clientId)}>Open</button>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ ...card, gridColumn: '1 / -1' }}>
        <h3 className="serif" style={{ fontSize: '1.3rem', marginBottom: 12 }}>Pipeline</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {STAGES.map((s) => {
            const n = data.clients.filter((c) => c.stage === s).length;
            const [bg, fg] = STAGE_COLORS[s];
            return <span key={s} style={tag(bg, fg)}>{s}: {n}</span>;
          })}
        </div>
      </div>
    </div>
  );
}

/* ================= CLIENTS (list + profile) ================= */
function Clients({ data, update, onNewQuote, focusId, clearFocus }) {
  const [openId, setOpenId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (focusId) { setOpenId(focusId); clearFocus(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId]);

  const openClient = data.clients.find((c) => c.id === openId);

  if (openClient) {
    return <ClientProfile client={openClient} data={data} update={update} onBack={() => setOpenId(null)} onNewQuote={onNewQuote} />;
  }

  function startAdd() {
    setDraft({ name: '', email: '', phone: '', province: PROVINCES[2], matterType: MATTER_TYPES[0], stage: STAGES[0], notes: '', created: today() });
    setAdding(true);
  }

  function saveNew() {
    const { ref, seq } = nextFileRef(data);
    const c = { ...draft, id: uid(), ref, activities: [], documents: [], forms: {}, case: {}, fees: [], payments: [] };
    update({ clients: [...data.clients, c], fileSeq: seq });
    setAdding(false);
    setOpenId(c.id);
  }

  function remove(id) {
    if (!window.confirm('Delete this client and their entire file? This cannot be undone.')) return;
    update({ clients: data.clients.filter((c) => c.id !== id) });
  }

  const q = search.toLowerCase();
  const list = data.clients
    .filter((c) => [c.name, c.ref, c.phone, c.email, c.matterType].some((v) => String(v || '').toLowerCase().includes(q)))
    .sort((a, b) => (a.created < b.created ? 1 : -1));

  if (adding)
    return (
      <div style={{ ...card, maxWidth: 560 }}>
        <h3 className="serif" style={{ fontSize: '1.3rem', marginBottom: 16 }}>New Client</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          <div><label style={label}>Full name *</label><input style={input} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} autoFocus /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={label}>Email</label><input style={input} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></div>
            <div><label style={label}>Phone</label><input style={input} value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={label}>Province</label>
              <select style={input} value={draft.province} onChange={(e) => setDraft({ ...draft, province: e.target.value })}>
                {PROVINCES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Matter type</label>
              <select style={input} value={draft.matterType} onChange={(e) => setDraft({ ...draft, matterType: e.target.value })}>
                {MATTER_TYPES.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button style={btn} onClick={saveNew} disabled={!draft.name.trim()}>Create Client File</button>
          <button style={btnGhost} onClick={() => setAdding(false)}>Cancel</button>
        </div>
      </div>
    );

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input style={{ ...input, maxWidth: 280 }} placeholder="Search clients…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button style={btn} onClick={startAdd}>+ New Client</button>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {list.length === 0 && <p style={{ color: 'var(--muted)' }}>No clients yet. Every enquiry from the website starts a file here.</p>}
        {list.map((c) => {
          const [bg, fg] = STAGE_COLORS[c.stage] || ['#eee', '#333'];
          const signed = ['popia', 'disclosure', 'indemnity', 'contract'].filter((k) => c.forms?.[k]?.status === 'Signed').length;
          return (
            <div key={c.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ cursor: 'pointer' }} onClick={() => setOpenId(c.id)}>
                <strong style={{ color: 'var(--forest)', fontSize: '1.05rem' }}>{c.name}</strong>
                {c.ref && <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}> · {c.ref}</span>}
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 3 }}>
                  {c.matterType} · {c.province} · forms signed: {signed}/4
                  {account(c, data).balance > 0 && <strong style={{ color: 'var(--copper)' }}> · owing {R(account(c, data).balance)}</strong>}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={tag(bg, fg)}>{c.stage}</span>
                <button style={btn} onClick={() => setOpenId(c.id)}>Open File</button>
                <button style={{ ...btnGhost, color: '#a33', padding: '6px 10px' }} onClick={() => remove(c.id)}>✕</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= PRICING ================= */
function Pricing({ data, update }) {
  const [items, setItems] = useState(data.prices);

  return (
    <div style={{ ...card, maxWidth: 760 }}>
      <h3 className="serif" style={{ fontSize: '1.3rem', marginBottom: 6 }}>Services, Prices & Bundles</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 18 }}>
        These feed the quote builder. The starting prices are suggestions — set your real ones and click Save.
      </p>
      <div style={{ display: 'grid', gap: 10 }}>
        {items.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', gap: 10 }}>
            <input style={{ ...input, flex: 3 }} value={p.name} onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
            <input type="number" style={{ ...input, flex: 1, maxWidth: 130 }} value={p.price} onChange={(e) => setItems(items.map((x, j) => (j === i ? { ...x, price: Number(e.target.value) } : x)))} />
            <button style={{ ...btnGhost, color: '#a33', padding: '6px 12px' }} onClick={() => setItems(items.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button style={btnGhost} onClick={() => setItems([...items, { id: uid(), name: '', price: 0 }])}>+ Add item</button>
        <button style={btn} onClick={() => update({ prices: items.filter((i) => i.name.trim()) })}>Save Price List</button>
      </div>
    </div>
  );
}

/* ================= QUOTES ================= */
function Quotes({ data, update, newFor, clearNewFor }) {
  const [editing, setEditing] = useState(null);
  const [printQuote, setPrintQuote] = useState(null);

  const nextNumber = () => `VW-${new Date().getFullYear()}-${String(data.quotes.length + 1).padStart(3, '0')}`;

  useEffect(() => {
    if (newFor) {
      setEditing({ id: '', number: nextNumber(), clientId: newFor, items: [], status: 'Draft', created: today(), paidDate: '', notes: '' });
      clearNewFor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newFor]);

  function newQuote() {
    setEditing({ id: '', number: nextNumber(), clientId: data.clients[0]?.id || '', items: [], status: 'Draft', created: today(), paidDate: '', notes: '' });
  }

  function save(q) {
    const quotes = q.id ? data.quotes.map((x) => (x.id === q.id ? q : x)) : [...data.quotes, { ...q, id: uid() }];
    update({ quotes });
    setEditing(null);
  }

  function setStatus(q, status) {
    const upd = { ...q, status, paidDate: status === 'Paid' ? today() : q.paidDate };
    update({ quotes: data.quotes.map((x) => (x.id === q.id ? upd : x)) });
  }

  function doPrint(q) {
    setPrintQuote(q);
    setTimeout(() => {
      window.print();
      setPrintQuote(null);
    }, 150);
  }

  const clientOf = (q) => data.clients.find((c) => c.id === q.clientId);

  if (editing) {
    const t = quoteTotal(editing);
    return (
      <div style={{ ...card, maxWidth: 720 }}>
        <h3 className="serif" style={{ fontSize: '1.3rem', marginBottom: 18 }}>
          {editing.id ? `Edit Quote ${editing.number}` : `New Quote ${editing.number}`}
        </h3>
        {data.clients.length === 0 ? (
          <p style={{ color: '#a33' }}>Add a client first — quotes are made for clients.</p>
        ) : (
          <>
            <label style={label}>Client</label>
            <select style={{ ...input, marginBottom: 16 }} value={editing.clientId} onChange={(e) => setEditing({ ...editing, clientId: e.target.value })}>
              {data.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <label style={label}>Add service from price list</label>
            <select
              style={{ ...input, marginBottom: 16 }}
              value=""
              onChange={(e) => {
                const p = data.prices.find((x) => x.id === e.target.value);
                if (p) setEditing({ ...editing, items: [...editing.items, { desc: p.name, price: p.price, qty: 1 }] });
              }}
            >
              <option value="">Select a service to add…</option>
              {data.prices.map((p) => <option key={p.id} value={p.id}>{p.name} — {R(p.price)}</option>)}
            </select>

            {editing.items.map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input style={{ ...input, flex: 3 }} value={it.desc} onChange={(e) => setEditing({ ...editing, items: editing.items.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)) })} />
                <input type="number" style={{ ...input, width: 70 }} value={it.qty} onChange={(e) => setEditing({ ...editing, items: editing.items.map((x, j) => (j === i ? { ...x, qty: Number(e.target.value) } : x)) })} />
                <input type="number" style={{ ...input, width: 110 }} value={it.price} onChange={(e) => setEditing({ ...editing, items: editing.items.map((x, j) => (j === i ? { ...x, price: Number(e.target.value) } : x)) })} />
                <button style={{ ...btnGhost, color: '#a33', padding: '6px 12px' }} onClick={() => setEditing({ ...editing, items: editing.items.filter((_, j) => j !== i) })}>✕</button>
              </div>
            ))}

            <button style={{ ...btnGhost, marginBottom: 16 }} onClick={() => setEditing({ ...editing, items: [...editing.items, { desc: '', price: 0, qty: 1 }] })}>
              + Custom line
            </button>

            <label style={label}>Notes on quote (optional)</label>
            <textarea rows={2} style={{ ...input, resize: 'vertical', marginBottom: 14 }} value={editing.notes} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />

            <p className="serif" style={{ fontSize: '1.4rem', color: 'var(--forest)', fontWeight: 700, marginBottom: 16 }}>Total: {R(t)}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={btn} onClick={() => save(editing)} disabled={!editing.clientId || editing.items.length === 0}>Save Quote</button>
              <button style={btnGhost} onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <button style={{ ...btn, marginBottom: 16 }} onClick={newQuote}>+ New Quote</button>
      <div style={{ display: 'grid', gap: 12 }}>
        {data.quotes.length === 0 && <p style={{ color: 'var(--muted)' }}>No quotes yet. Build one from your price list in under a minute.</p>}
        {[...data.quotes].reverse().map((q) => {
          const c = clientOf(q);
          return (
            <div key={q.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <strong style={{ color: 'var(--forest)' }}>{q.number}</strong>
                <span style={{ color: 'var(--muted)' }}> — {c ? c.name : 'Unknown client'}</span>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 3 }}>
                  {q.created} · {q.items.length} item(s) · <strong style={{ color: 'var(--forest)' }}>{R(quoteTotal(q))}</strong>
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <select style={{ ...input, width: 'auto', padding: '7px 10px' }} value={q.status} onChange={(e) => setStatus(q, e.target.value)}>
                  {QUOTE_STATUS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button style={btnGhost} onClick={() => setEditing(q)}>Edit</button>
                <button style={btn} onClick={() => doPrint(q)}>Print / PDF</button>
              </div>
            </div>
          );
        })}
      </div>

      {printQuote && <PrintableQuote quote={printQuote} client={clientOf(printQuote)} settings={data.settings} total={quoteTotal(printQuote)} />}
    </div>
  );
}

function PrintableQuote({ quote, client, settings, total }) {
  const validUntil = new Date(Date.now() + (settings.quoteValidityDays || 14) * 86400000).toISOString().slice(0, 10);
  return (
    <div id="print-quote" style={{ background: '#fff', color: '#222', padding: '40px 48px', fontFamily: 'Raleway, sans-serif', fontSize: '13px', lineHeight: 1.6 }}>
      <PrintHeader title="FIXED-FEE QUOTE" settings={settings} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ fontWeight: 700, color: '#2D4A3E', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>For</p>
          <p style={{ margin: 0 }}>{client?.name || ''}</p>
          {client?.email && <p style={{ margin: 0 }}>{client.email}</p>}
          {client?.phone && <p style={{ margin: 0 }}>{client.phone}</p>}
          {client?.province && <p style={{ margin: 0 }}>{client.province}</p>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0 }}><strong>{quote.number}</strong></p>
          <p style={{ margin: 0 }}>Date: {quote.created}</p>
          <p style={{ margin: 0 }}>Valid until: {validUntil}</p>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
        <thead>
          <tr style={{ background: '#2D4A3E', color: '#fff' }}>
            <th style={{ textAlign: 'left', padding: '9px 12px' }}>Service</th>
            <th style={{ textAlign: 'center', padding: '9px 12px', width: 60 }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '9px 12px', width: 120 }}>Fee</th>
          </tr>
        </thead>
        <tbody>
          {quote.items.map((it, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '9px 12px' }}>{it.desc}</td>
              <td style={{ textAlign: 'center', padding: '9px 12px' }}>{it.qty || 1}</td>
              <td style={{ textAlign: 'right', padding: '9px 12px' }}>{R(it.price * (it.qty || 1))}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={2} style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '15px', color: '#2D4A3E' }}>TOTAL (fixed fee)</td>
            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '15px', color: '#B5714A' }}>{R(total)}</td>
          </tr>
        </tbody>
      </table>

      {quote.notes && <p style={{ marginBottom: 18 }}><strong>Notes:</strong> {quote.notes}</p>}

      {(settings.bankName || settings.accNo) && (
        <div style={{ background: '#F7F3EC', padding: '14px 18px', borderLeft: '3px solid #B5714A', marginBottom: 20 }}>
          <p style={{ fontWeight: 700, color: '#2D4A3E', margin: '0 0 4px' }}>Payment — EFT only</p>
          {settings.bankName && <p style={{ margin: 0 }}>Bank: {settings.bankName}</p>}
          {settings.accName && <p style={{ margin: 0 }}>Account name: {settings.accName}</p>}
          {settings.accNo && <p style={{ margin: 0 }}>Account number: {settings.accNo}</p>}
          {settings.branch && <p style={{ margin: 0 }}>Branch code: {settings.branch}</p>}
          <p style={{ margin: '4px 0 0' }}>Reference: {quote.number}</p>
        </div>
      )}

      <p style={{ fontSize: '10px', color: '#777', lineHeight: 1.55, borderTop: '1px solid #ddd', paddingTop: 14 }}>{DISCLAIMER}</p>
    </div>
  );
}

/* ================= TEMPLATES LIBRARY ================= */
function Templates({ data }) {
  const templates = getTemplates();
  const [category, setCategory] = useState('Compliance');
  const [selectedId, setSelectedId] = useState(null);
  const [clientId, setClientId] = useState('');
  const [printing, setPrinting] = useState(false);
  const [copied, setCopied] = useState(false);

  const selected = templates.find((t) => t.id === selectedId);
  const client = data.clients.find((c) => c.id === clientId) || null;
  const text = selected ? selected.body(client, data.settings) : '';

  function doPrint() {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 150);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  }

  return (
    <div>
      <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 16, maxWidth: 700, lineHeight: 1.7 }}>
        Working drafts for every matter type. Pick a client and the template fills in their details automatically.
        Review and adapt every document before it goes out — these are starting points, not final advice.
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {TEMPLATE_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => { setCategory(c); setSelectedId(null); }}
            style={{ ...btnGhost, padding: '7px 14px', background: category === c ? 'var(--forest)' : 'transparent', color: category === c ? '#fff' : 'var(--forest)' }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 300px) 1fr', gap: 16, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 8 }}>
          {templates.filter((t) => t.category === category).map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              style={{ ...btnGhost, textAlign: 'left', background: selectedId === t.id ? 'var(--copper)' : 'var(--white)', color: selectedId === t.id ? '#fff' : 'var(--forest)' }}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div style={card}>
          {!selected ? (
            <p style={{ color: 'var(--muted)' }}>Select a template on the left.</p>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
                <select style={{ ...input, width: 'auto', minWidth: 200 }} value={clientId} onChange={(e) => setClientId(e.target.value)}>
                  <option value="">No client — blank template</option>
                  {data.clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button style={btn} onClick={doPrint}>Print / PDF</button>
                <button style={btnGhost} onClick={copy}>{copied ? 'Copied ✓' : 'Copy text'}</button>
              </div>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Raleway, sans-serif', fontSize: '0.86rem', lineHeight: 1.7, background: 'var(--cream)', padding: 18, borderRadius: 4, maxHeight: 520, overflowY: 'auto' }}>
                {text}
              </pre>
            </>
          )}
        </div>
      </div>

      {printing && selected && (
        <div id="print-quote" style={{ background: '#fff', color: '#222', padding: '36px 44px', fontFamily: 'Raleway, sans-serif', fontSize: '12.5px', lineHeight: 1.65 }}>
          <PrintHeader title={selected.name} settings={data.settings} />
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>{text}</pre>
        </div>
      )}
    </div>
  );
}

/* ================= REPORTS ================= */
function Reports({ data, onOpenClient }) {
  const r = useMemo(() => {
    const byMonth = {};
    let received = 0, outstanding = 0, wip = 0, invoiced = 0;
    const debtors = [];
    data.clients.forEach((c) => {
      paymentsOf(c).forEach((p) => {
        const m = (p.date || '').slice(0, 7);
        const amt = Number(p.amount) || 0;
        byMonth[m] = (byMonth[m] || 0) + amt;
        received += amt;
      });
      const a = account(c, data);
      invoiced += a.charges;
      wip += unbilledTotal(c);
      if (a.balance > 0) { outstanding += a.balance; debtors.push({ c, balance: a.balance }); }
    });
    const months = Object.keys(byMonth).filter(Boolean).sort().reverse();
    debtors.sort((x, y) => y.balance - x.balance);
    return { byMonth, months, received, outstanding, wip, invoiced, debtors };
  }, [data]);

  return (
    <div style={{ display: 'grid', gap: 18, maxWidth: 760 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
        {[['Received (all time)', R(r.received), 'var(--forest)'], ['Invoiced (all time)', R(r.invoiced), 'var(--forest)'], ['Outstanding', R(r.outstanding), 'var(--copper)'], ['Unbilled work', R(r.wip), 'var(--copper)']].map(([t, v, c]) => (
          <div key={t} style={{ ...card, borderTop: '3px solid var(--copper)' }}>
            <p style={{ color: 'var(--muted)', fontSize: '0.74rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t}</p>
            <p className="serif" style={{ fontSize: '1.6rem', color: c, fontWeight: 700, marginTop: 4 }}>{v}</p>
          </div>
        ))}
      </div>

      <div style={card}>
        <h3 className="serif" style={{ fontSize: '1.3rem', marginBottom: 12 }}>Income received per month</h3>
        {r.months.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No payments recorded yet. Record payments inside a file and they total up here.</p>
        ) : r.months.map((m) => (
          <div key={m} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--creamdark)' }}>
            <span>{m}</span><strong style={{ color: 'var(--forest)' }}>{R(r.byMonth[m])}</strong>
          </div>
        ))}
      </div>

      <div style={card}>
        <h3 className="serif" style={{ fontSize: '1.3rem', marginBottom: 6 }}>Outstanding accounts</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 12 }}>Who still owes you — your follow-up list.</p>
        {r.debtors.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>Nothing outstanding. Everyone is paid up. 🎉</p>
        ) : r.debtors.map(({ c, balance }) => (
          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--creamdark)' }}>
            <span>{c.name}{c.ref ? ` · ${c.ref}` : ''}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <strong style={{ color: 'var(--copper)' }}>{R(balance)}</strong>
              <button style={{ ...btnGhost, padding: '5px 10px' }} onClick={() => onOpenClient(c.id)}>Open</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= ALL INVOICES (across files) ================= */
function GlobalInvoices({ data, onOpenClient, onPrint }) {
  const [q, setQ] = useState('');
  const query = q.toLowerCase();
  const rows = [...(data.invoices || [])]
    .map((i) => ({ inv: i, client: data.clients.find((c) => c.id === i.clientId) }))
    .filter(({ inv, client }) => [inv.number, client?.name].some((v) => String(v || '').toLowerCase().includes(query)))
    .sort((a, b) => (a.inv.date < b.inv.date ? 1 : -1));
  const total = rows.reduce((s, { inv }) => s + (inv.total || 0), 0);

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
        <input style={{ ...input, maxWidth: 300 }} placeholder="Search invoice number or client…" value={q} onChange={(e) => setQ(e.target.value)} />
        <span style={{ color: 'var(--muted)', alignSelf: 'center' }}>{rows.length} invoice(s) · {R(total)}</span>
      </div>
      {rows.length === 0 && <p style={{ color: 'var(--muted)' }}>No invoices yet. Create one from inside a client file (Invoices tab).</p>}
      <div style={{ display: 'grid', gap: 10 }}>
        {rows.map(({ inv, client }) => (
          <div key={inv.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <strong style={{ color: 'var(--forest)' }}>{inv.number}</strong>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 3 }}>{inv.date} · {client?.name || 'Unknown'}{client?.ref ? ` · ${client.ref}` : ''}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <strong style={{ color: 'var(--copper)' }}>{R(inv.total)}</strong>
              <button style={btnGhost} onClick={() => onPrint(inv, client)}>Print / PDF</button>
              {client && <button style={btn} onClick={() => onOpenClient(client.id)}>Open File</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= DIARY (reminders + court dates) ================= */
function Diary({ data, update, onOpenClient }) {
  const blank = () => ({ date: today(), note: '', clientId: '' });
  const [e, setE] = useState(blank);
  const items = diaryItems(data);

  function add() {
    if (!e.note.trim()) return;
    update({ diary: [...(data.diary || []), { ...e, id: uid(), done: false }] });
    setE(blank());
  }
  function toggle(id) {
    update({ diary: (data.diary || []).map((x) => (x.id === id ? { ...x, done: !x.done } : x)) });
  }
  function remove(id) {
    update({ diary: (data.diary || []).filter((x) => x.id !== id) });
  }

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 760 }}>
      <div style={card}>
        <h3 className="serif" style={{ fontSize: '1.25rem', marginBottom: 12 }}>Add a reminder</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, marginBottom: 12 }}>
          <div><label style={label}>Date</label><input type="date" style={input} value={e.date} onChange={(ev) => setE({ ...e, date: ev.target.value })} /></div>
          <div>
            <label style={label}>File (optional)</label>
            <select style={input} value={e.clientId} onChange={(ev) => setE({ ...e, clientId: ev.target.value })}>
              <option value="">General — not tied to a file</option>
              {data.clients.map((c) => <option key={c.id} value={c.id}>{c.name}{c.ref ? ` · ${c.ref}` : ''}</option>)}
            </select>
          </div>
        </div>
        <label style={label}>Reminder</label>
        <input style={{ ...input, marginBottom: 12 }} placeholder="e.g. Phone client about settlement / File Rule 43 by…" value={e.note} onChange={(ev) => setE({ ...e, note: ev.target.value })} />
        <button style={btn} onClick={add} disabled={!e.note.trim()}>Add to Diary</button>
      </div>

      {items.length === 0 && <p style={{ color: 'var(--muted)' }}>No reminders yet. Court dates you enter on a file’s Case File show up here automatically.</p>}
      {items.map((i) => {
        const overdue = !i.done && i.date < today();
        return (
          <div key={i.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, padding: '14px 18px', opacity: i.done ? 0.55 : 1, borderLeft: `3px solid ${overdue ? '#a33' : i.kind === 'court' ? 'var(--forest)' : 'var(--copper)'}` }}>
            <div>
              <span style={{ fontWeight: 600, color: overdue ? '#a33' : 'var(--forest)' }}>{i.date}</span>
              <span style={{ color: 'var(--mid)', textDecoration: i.done ? 'line-through' : 'none' }}> · {i.note}</span>
              <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}> — {i.clientName}</span>
              {i.kind === 'court' && <span style={{ ...tag('#e7f0e9', '#1d6b3a'), marginLeft: 8 }}>court</span>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {i.clientId && <button style={{ ...btnGhost, padding: '5px 10px' }} onClick={() => onOpenClient(i.clientId)}>Open</button>}
              {i.kind === 'reminder' && <>
                <button style={{ ...btnGhost, padding: '5px 10px' }} onClick={() => toggle(i.id)}>{i.done ? 'Undo' : 'Done'}</button>
                <button style={{ ...btnGhost, color: '#a33', padding: '5px 10px' }} onClick={() => remove(i.id)}>✕</button>
              </>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================= SETTINGS / BACKUP ================= */
function Settings({ data, update }) {
  const [s, setS] = useState(data.settings);
  const [msg, setMsg] = useState('');

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vanwyk-practice-backup-${today()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed.clients || !parsed.prices) throw new Error('bad file');
        update(migrate(parsed));
        setMsg('Backup restored successfully.');
      } catch {
        setMsg('That file is not a valid backup.');
      }
    };
    reader.readAsText(file);
  }

  const fields = [
    ['ownerName', 'Business / Your Name'],
    ['email', 'Email (appears on quotes)'],
    ['phone', 'Phone / WhatsApp'],
    ['bankName', 'Bank'],
    ['accName', 'Account Name'],
    ['accNo', 'Account Number'],
    ['branch', 'Branch Code'],
  ];

  return (
    <div style={{ display: 'grid', gap: 18, maxWidth: 640 }}>
      <div style={card}>
        <h3 className="serif" style={{ fontSize: '1.3rem', marginBottom: 14 }}>Business & Banking Details</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 16 }}>
          These appear on every quote, statement and document you print.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {fields.map(([k, lbl]) => (
            <div key={k} style={k === 'ownerName' || k === 'email' ? { gridColumn: '1 / -1' } : undefined}>
              <label style={label}>{lbl}</label>
              <input style={input} value={s[k] || ''} onChange={(e) => setS({ ...s, [k]: e.target.value })} />
            </div>
          ))}
          <div>
            <label style={label}>Quote validity (days)</label>
            <input type="number" style={input} value={s.quoteValidityDays} onChange={(e) => setS({ ...s, quoteValidityDays: Number(e.target.value) })} />
          </div>
        </div>
        <button style={{ ...btn, marginTop: 16 }} onClick={() => { update({ settings: s }); setMsg('Settings saved.'); }}>
          Save Settings
        </button>
      </div>

      <div style={card}>
        <h3 className="serif" style={{ fontSize: '1.3rem', marginBottom: 6 }}>Rates & VAT</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 16 }}>
          Your standard rates fill in automatically when you record work on a file (you can still change any single entry).
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['hourlyRate', 'Hourly rate (R)'], ['unitRate', 'Per 6-min unit (R)'], ['perPageRate', 'Per page (R)'], ['travelRate', 'Travel per km (R)']].map(([k, lbl]) => (
            <div key={k}>
              <label style={label}>{lbl}</label>
              <input type="number" step="0.01" style={input} value={s[k] ?? ''} onChange={(e) => setS({ ...s, [k]: Number(e.target.value) })} />
            </div>
          ))}
        </div>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '16px 0 12px', cursor: 'pointer' }}>
          <input type="checkbox" checked={!!s.vatEnabled} onChange={(e) => setS({ ...s, vatEnabled: e.target.checked })} style={{ accentColor: 'var(--copper)' }} />
          <span style={{ fontSize: '0.9rem' }}>I am registered for VAT (add VAT to invoices)</span>
        </label>
        {s.vatEnabled && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={label}>VAT rate (%)</label><input type="number" step="0.01" style={input} value={s.vatRate ?? 15} onChange={(e) => setS({ ...s, vatRate: Number(e.target.value) })} /></div>
            <div><label style={label}>VAT number</label><input style={input} value={s.vatNumber || ''} onChange={(e) => setS({ ...s, vatNumber: e.target.value })} /></div>
          </div>
        )}
        <button style={{ ...btn, marginTop: 16 }} onClick={() => { update({ settings: s }); setMsg('Rates saved.'); }}>Save Rates</button>
      </div>

      <div style={card}>
        <h3 className="serif" style={{ fontSize: '1.3rem', marginBottom: 10 }}>Backup & Restore</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 14, lineHeight: 1.7 }}>
          Everything lives in this browser only. Export a backup file weekly and keep it somewhere safe
          (OneDrive is perfect — it syncs automatically).
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button style={btn} onClick={exportData}>Download Backup</button>
          <label style={{ ...btnGhost, cursor: 'pointer' }}>
            Restore from Backup
            <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
          </label>
        </div>
      </div>
      {msg && <p style={{ color: 'var(--forest)', fontWeight: 600 }}>{msg}</p>}
    </div>
  );
}

/* ================= SHELL ================= */
const TABS = ['Dashboard', 'Search', 'Clients', 'Quotes', 'Invoices', 'Diary', 'Reports', 'Templates', 'Pricing', 'Settings', 'Manual'];

export default function PracticeApp() {
  const [data, setData] = useState(load);
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState('Dashboard');
  const [newQuoteFor, setNewQuoteFor] = useState(null);
  const [focusClient, setFocusClient] = useState(null);
  const [printInv, setPrintInv] = useState(null); // {invoice, client}

  useEffect(() => {
    persist(data);
  }, [data]);

  function update(patch) {
    setData((d) => ({ ...d, ...patch }));
  }

  function handleNewQuote(clientId) {
    setNewQuoteFor(clientId);
    setTab('Quotes');
  }

  function openClient(clientId) {
    setFocusClient(clientId);
    setTab('Clients');
  }

  function printInvoice(invoice, client) {
    setPrintInv({ invoice, client });
    setTimeout(() => { window.print(); setPrintInv(null); }, 150);
  }

  if (!unlocked) return <PinGate data={data} setData={setData} onUnlock={() => setUnlocked(true)} />;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <VWLogo size={44} showText={false} />
            <h1 className="serif" style={{ fontSize: '1.9rem' }}>Practice Manager</h1>
          </div>
          <a href="#/" style={{ color: 'var(--copper)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.08em' }}>
            ← Back to website
          </a>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 26 }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                ...btnGhost,
                background: tab === t ? 'var(--forest)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--forest)',
                borderColor: tab === t ? 'var(--forest)' : 'var(--creamdark)',
              }}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === 'Dashboard' && <Dashboard data={data} onOpenClient={openClient} goTab={setTab} />}
        {tab === 'Search' && <GlobalSearch data={data} onOpenClient={openClient} />}
        {tab === 'Clients' && <Clients data={data} update={update} onNewQuote={handleNewQuote} focusId={focusClient} clearFocus={() => setFocusClient(null)} />}
        {tab === 'Quotes' && <Quotes data={data} update={update} newFor={newQuoteFor} clearNewFor={() => setNewQuoteFor(null)} />}
        {tab === 'Invoices' && <GlobalInvoices data={data} onOpenClient={openClient} onPrint={printInvoice} />}
        {tab === 'Diary' && <Diary data={data} update={update} onOpenClient={openClient} />}
        {tab === 'Reports' && <Reports data={data} onOpenClient={openClient} />}
        {tab === 'Templates' && <Templates data={data} />}
        {tab === 'Pricing' && <Pricing data={data} update={update} />}
        {tab === 'Settings' && <Settings data={data} update={update} />}
        {tab === 'Manual' && <Manual />}
      </div>
      {printInv && <PrintInvoice invoice={printInv.invoice} client={printInv.client} settings={data.settings} />}
    </div>
  );
}

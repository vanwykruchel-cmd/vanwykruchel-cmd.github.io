import { useState } from 'react';
import { card, input, label, btn, btnGhost, tag, R, uid, today, round2, PrintHeader } from './ui';
import {
  FEE_TYPES, FEE_TYPE, PAYMENT_METHODS, lineAmount, rateFor,
  feesOf, paymentsOf, invoicesOf, unbilledFees, unbilledTotal,
  account, invoiceTotals, nextInvoiceNumber,
} from './billing';
import { DISCLAIMER } from '../constants/data';

/* =================================================================
 * FEES & TIME — record the work done on a file.
 * ================================================================= */
export function FeesTime({ client, patchClient, settings }) {
  const blank = () => ({ date: today(), type: 'time', desc: '', qty: 1, rate: rateFor('time', settings), amount: 0 });
  const [e, setE] = useState(blank);
  const fees = [...feesOf(client)].sort((a, b) => (a.date < b.date ? 1 : -1));
  const t = FEE_TYPE[e.type];
  const isManual = e.type === 'fixed' || e.type === 'disb';
  const preview = lineAmount(e);

  function changeType(type) {
    setE((x) => ({ ...x, type, rate: rateFor(type, settings) }));
  }

  function add() {
    if (!e.desc.trim()) return;
    const entry = { ...e, id: uid(), qty: Number(e.qty) || 0, rate: Number(e.rate) || 0, amount: Number(e.amount) || 0, invoiceId: null };
    entry.amount = lineAmount(entry);
    patchClient({ fees: [...feesOf(client), entry] });
    setE(blank());
  }

  function remove(id) {
    patchClient({ fees: feesOf(client).filter((f) => f.id !== id) });
  }

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 860 }}>
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <h3 className="serif" style={{ fontSize: '1.25rem' }}>Record Work</h3>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
            Not yet invoiced: <strong style={{ color: 'var(--copper)' }}>{R(unbilledTotal(client))}</strong>
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={label}>Date</label>
            <input type="date" style={input} value={e.date} onChange={(ev) => setE({ ...e, date: ev.target.value })} />
          </div>
          <div>
            <label style={label}>Type of charge</label>
            <select style={input} value={e.type} onChange={(ev) => changeType(ev.target.value)}>
              {FEE_TYPES.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
          </div>
        </div>

        <label style={label}>Description</label>
        <input style={{ ...input, marginBottom: 12 }} placeholder={t.hint} value={e.desc} onChange={(ev) => setE({ ...e, desc: ev.target.value })} />

        {isManual ? (
          <div style={{ maxWidth: 240, marginBottom: 12 }}>
            <label style={label}>Amount (R)</label>
            <input type="number" step="0.01" style={input} value={e.amount} onChange={(ev) => setE({ ...e, amount: ev.target.value })} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12, maxWidth: 480 }}>
            <div>
              <label style={label}>{t.unit ? t.unit.charAt(0).toUpperCase() + t.unit.slice(1) : 'Qty'}</label>
              <input type="number" step="0.01" style={input} value={e.qty} onChange={(ev) => setE({ ...e, qty: ev.target.value })} />
            </div>
            <div>
              <label style={label}>Rate (R)</label>
              <input type="number" step="0.01" style={input} value={e.rate} onChange={(ev) => setE({ ...e, rate: ev.target.value })} />
            </div>
            <div>
              <label style={label}>= Amount</label>
              <div style={{ ...input, background: 'var(--cream)', fontWeight: 700, color: 'var(--forest)' }}>{R(preview)}</div>
            </div>
          </div>
        )}

        <button style={btn} onClick={add} disabled={!e.desc.trim()}>Add to file</button>
      </div>

      {fees.length === 0 && <p style={{ color: 'var(--muted)' }}>No work recorded yet. Log every consultation, document and call here — it becomes the invoice.</p>}
      {fees.map((f) => (
        <div key={f.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, padding: '14px 18px' }}>
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{f.date} · {FEE_TYPE[f.type]?.label || f.type}</p>
            <p style={{ marginTop: 3 }}>{f.desc}</p>
            {!(f.type === 'fixed' || f.type === 'disb') && (
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>{f.qty} {FEE_TYPE[f.type]?.unit} × {R(f.rate)}</p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <strong style={{ color: 'var(--forest)' }}>{R(lineAmount(f))}</strong>
            {f.invoiceId
              ? <span style={tag('#e7f0e9', '#1d6b3a')}>Invoiced</span>
              : <button style={{ ...btnGhost, color: '#a33', padding: '5px 10px' }} onClick={() => remove(f.id)}>✕</button>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =================================================================
 * INVOICES — turn unbilled work into a numbered Tax Invoice.
 * ================================================================= */
export function FileInvoices({ client, data, update, settings, onPrint }) {
  const [building, setBuilding] = useState(false);
  const [picked, setPicked] = useState({});      // feeId -> bool
  const [extra, setExtra] = useState([]);          // manual lines
  const [note, setNote] = useState('');
  const invoices = [...invoicesOf(client, data)].sort((a, b) => (a.date < b.date ? 1 : -1));
  const unbilled = unbilledFees(client);

  function startBuild() {
    const all = {};
    unbilled.forEach((f) => { all[f.id] = true; });
    setPicked(all);
    setExtra([]);
    setNote('');
    setBuilding(true);
  }

  const chosenFees = unbilled.filter((f) => picked[f.id]);
  const lines = [
    ...chosenFees.map((f) => ({ date: f.date, desc: f.desc, type: f.type, qty: f.type === 'fixed' || f.type === 'disb' ? '' : f.qty, rate: f.type === 'fixed' || f.type === 'disb' ? '' : f.rate, amount: lineAmount(f), feeId: f.id })),
    ...extra.map((x) => ({ ...x, amount: round2(x.amount || 0) })),
  ];
  const totals = invoiceTotals(lines, settings);

  function create() {
    if (lines.length === 0) return;
    const { number, seq } = nextInvoiceNumber(data);
    const id = uid();
    const invoice = {
      id, number, clientId: client.id, date: today(),
      lines: lines.map(({ feeId, ...l }) => l),
      feeIds: chosenFees.map((f) => f.id),
      subtotal: totals.subtotal, vat: totals.vat, vatRate: settings.vatEnabled ? Number(settings.vatRate) || 0 : 0,
      total: totals.total, note,
    };
    const clients = data.clients.map((c) =>
      c.id === client.id
        ? { ...c, fees: feesOf(c).map((f) => (picked[f.id] ? { ...f, invoiceId: id } : f)) }
        : c);
    update({ invoices: [...(data.invoices || []), invoice], invoiceSeq: seq, clients });
    setBuilding(false);
    onPrint(invoice);
  }

  function deleteInvoice(inv) {
    if (!window.confirm(`Delete ${inv.number}? The work on it returns to "not invoiced".`)) return;
    const clients = data.clients.map((c) =>
      c.id === client.id
        ? { ...c, fees: feesOf(c).map((f) => (f.invoiceId === inv.id ? { ...f, invoiceId: null } : f)) }
        : c);
    update({ invoices: (data.invoices || []).filter((i) => i.id !== inv.id), clients });
  }

  if (building) {
    return (
      <div style={{ ...card, maxWidth: 760 }}>
        <h3 className="serif" style={{ fontSize: '1.25rem', marginBottom: 12 }}>New Tax Invoice</h3>
        {unbilled.length === 0 && extra.length === 0 && (
          <p style={{ color: 'var(--muted)', marginBottom: 12 }}>No unbilled work on this file. Add a custom line below, or record work in “Fees & Time” first.</p>
        )}
        {unbilled.length > 0 && (
          <>
            <label style={label}>Work to include</label>
            <div style={{ display: 'grid', gap: 6, marginBottom: 14 }}>
              {unbilled.map((f) => (
                <label key={f.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '8px 10px', background: 'var(--cream)', borderRadius: 4, cursor: 'pointer' }}>
                  <span style={{ display: 'flex', gap: 8 }}>
                    <input type="checkbox" checked={!!picked[f.id]} onChange={(ev) => setPicked({ ...picked, [f.id]: ev.target.checked })} style={{ accentColor: 'var(--copper)' }} />
                    <span style={{ fontSize: '0.9rem' }}>{f.date} · {f.desc}</span>
                  </span>
                  <strong style={{ color: 'var(--forest)' }}>{R(lineAmount(f))}</strong>
                </label>
              ))}
            </div>
          </>
        )}

        {extra.map((x, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input style={{ ...input, flex: 3 }} placeholder="Description" value={x.desc} onChange={(ev) => setExtra(extra.map((y, j) => (j === i ? { ...y, desc: ev.target.value } : y)))} />
            <input type="number" step="0.01" style={{ ...input, width: 120 }} placeholder="Amount" value={x.amount} onChange={(ev) => setExtra(extra.map((y, j) => (j === i ? { ...y, amount: ev.target.value } : y)))} />
            <button style={{ ...btnGhost, color: '#a33', padding: '6px 12px' }} onClick={() => setExtra(extra.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
        <button style={{ ...btnGhost, marginBottom: 14 }} onClick={() => setExtra([...extra, { desc: '', amount: 0, type: 'fixed', qty: '', rate: '' }])}>+ Custom line</button>

        <label style={label}>Note on invoice (optional)</label>
        <textarea rows={2} style={{ ...input, resize: 'vertical', marginBottom: 14 }} value={note} onChange={(ev) => setNote(ev.target.value)} />

        <div style={{ borderTop: '1px solid var(--creamdark)', paddingTop: 12, marginBottom: 16 }}>
          <Row k="Subtotal" v={R(totals.subtotal)} />
          {settings.vatEnabled && <Row k={`VAT @ ${settings.vatRate}%`} v={R(totals.vat)} />}
          <Row k="Total" v={R(totals.total)} big />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={btn} onClick={create} disabled={lines.length === 0}>Create & Print Invoice</button>
          <button style={btnGhost} onClick={() => setBuilding(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 760 }}>
      <div>
        <button style={btn} onClick={startBuild}>+ New Tax Invoice</button>
        {unbilled.length > 0 && <span style={{ marginLeft: 12, color: 'var(--muted)', fontSize: '0.85rem' }}>{R(unbilledTotal(client))} of work ready to bill</span>}
      </div>
      {invoices.length === 0 && <p style={{ color: 'var(--muted)' }}>No invoices yet for this file.</p>}
      {invoices.map((inv) => (
        <div key={inv.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <strong style={{ color: 'var(--forest)' }}>{inv.number}</strong>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 3 }}>{inv.date} · {inv.lines.length} line(s)</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <strong style={{ color: 'var(--copper)' }}>{R(inv.total)}</strong>
            <button style={btnGhost} onClick={() => onPrint(inv)}>Print / PDF</button>
            <button style={{ ...btnGhost, color: '#a33', padding: '6px 10px' }} onClick={() => deleteInvoice(inv)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* =================================================================
 * PAYMENTS / RECEIPTS — money received against the account.
 * ================================================================= */
export function Payments({ client, patchClient, data }) {
  const acc = account(client, data);
  const blank = () => ({ date: today(), amount: '', method: 'EFT', ref: '', note: '' });
  const [p, setP] = useState(blank);
  const list = [...paymentsOf(client)].sort((a, b) => (a.date < b.date ? 1 : -1));

  function add() {
    if (!(Number(p.amount) > 0)) return;
    patchClient({ payments: [...paymentsOf(client), { ...p, id: uid(), amount: round2(p.amount) }] });
    setP(blank());
  }
  function remove(id) {
    patchClient({ payments: paymentsOf(client).filter((x) => x.id !== id) });
  }

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 760 }}>
      <div style={{ ...card, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <Mini k="Invoiced" v={R(acc.charges)} />
        <Mini k="Received" v={R(acc.receipts)} c="#1d6b3a" />
        <Mini k="Balance owing" v={R(acc.balance)} c="var(--copper)" />
      </div>

      <div style={card}>
        <h3 className="serif" style={{ fontSize: '1.25rem', marginBottom: 12 }}>Record a Payment</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div><label style={label}>Date</label><input type="date" style={input} value={p.date} onChange={(e) => setP({ ...p, date: e.target.value })} /></div>
          <div><label style={label}>Amount (R)</label><input type="number" step="0.01" style={input} value={p.amount} onChange={(e) => setP({ ...p, amount: e.target.value })} /></div>
          <div>
            <label style={label}>Method</label>
            <select style={input} value={p.method} onChange={(e) => setP({ ...p, method: e.target.value })}>
              {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <label style={label}>Reference / note (optional)</label>
        <input style={{ ...input, marginBottom: 12 }} value={p.ref} onChange={(e) => setP({ ...p, ref: e.target.value })} />
        <button style={btn} onClick={add} disabled={!(Number(p.amount) > 0)}>Add Payment</button>
      </div>

      {list.length === 0 && <p style={{ color: 'var(--muted)' }}>No payments recorded yet.</p>}
      {list.map((x) => (
        <div key={x.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, padding: '14px 18px' }}>
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{x.date} · {x.method}{x.ref ? ` · ${x.ref}` : ''}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <strong style={{ color: '#1d6b3a' }}>{R(x.amount)}</strong>
            <button style={{ ...btnGhost, color: '#a33', padding: '5px 10px' }} onClick={() => remove(x.id)}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* =================================================================
 * ACCOUNT STATEMENT — running debtor ledger for the file.
 * ================================================================= */
export function AccountStatement({ client, data, onPrint }) {
  const ledger = buildLedger(client, data);
  const acc = account(client, data);

  return (
    <div style={{ ...card, maxWidth: 720 }}>
      <h3 className="serif" style={{ fontSize: '1.25rem', marginBottom: 14 }}>Account — {client.name}</h3>
      {ledger.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>Nothing on the account yet. Create an invoice or record a payment and it appears here.</p>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '6px 8px' }}>Date</th><th style={{ padding: '6px 8px' }}>Detail</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>Charge</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>Paid</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((r) => (
                  <tr key={r.id} style={{ borderTop: '1px solid var(--creamdark)' }}>
                    <td style={{ padding: '8px' }}>{r.date}</td>
                    <td style={{ padding: '8px' }}>{r.detail}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>{r.charge ? R(r.charge) : ''}</td>
                    <td style={{ padding: '8px', textAlign: 'right', color: '#1d6b3a' }}>{r.paid ? R(r.paid) : ''}</td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>{R(r.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', marginTop: 14, borderTop: '2px solid var(--forest)', paddingTop: 12 }}>
            <strong>Balance outstanding</strong>
            <strong style={{ color: acc.balance > 0 ? 'var(--copper)' : '#1d6b3a' }}>{R(acc.balance)}</strong>
          </div>
          <button style={{ ...btn, marginTop: 16 }} onClick={onPrint}>Print Statement / PDF</button>
        </>
      )}
    </div>
  );
}

/* Combined invoices (charges) + payments (credits) sorted by date, running balance. */
export function buildLedger(client, data) {
  const rows = [
    ...invoicesOf(client, data).map((i) => ({ id: 'i' + i.id, date: i.date, detail: `Invoice ${i.number}`, charge: i.total, paid: 0 })),
    ...paymentsOf(client).map((p) => ({ id: 'p' + p.id, date: p.date, detail: `Payment received${p.method ? ' · ' + p.method : ''}`, charge: 0, paid: Number(p.amount) || 0 })),
  ].sort((a, b) => (a.date === b.date ? (b.charge - b.paid) - (a.charge - a.paid) : a.date < b.date ? -1 : 1));
  let bal = 0;
  return rows.map((r) => { bal = round2(bal + r.charge - r.paid); return { ...r, balance: bal }; });
}

/* =================================================================
 * Printable documents (rendered into #print-quote).
 * ================================================================= */
export function PrintInvoice({ invoice, client, settings }) {
  return (
    <div id="print-quote" style={{ background: '#fff', color: '#222', padding: '40px 48px', fontFamily: 'Raleway, sans-serif', fontSize: '13px', lineHeight: 1.6 }}>
      <PrintHeader title="TAX INVOICE" settings={settings} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ fontWeight: 700, color: '#2D4A3E', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }}>Billed to</p>
          <p style={{ margin: 0 }}>{client?.name || ''}</p>
          {client?.ref && <p style={{ margin: 0 }}>File: {client.ref}</p>}
          {client?.email && <p style={{ margin: 0 }}>{client.email}</p>}
          {client?.phone && <p style={{ margin: 0 }}>{client.phone}</p>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0 }}><strong>{invoice.number}</strong></p>
          <p style={{ margin: 0 }}>Date: {invoice.date}</p>
          {settings.vatEnabled && settings.vatNumber && <p style={{ margin: 0 }}>VAT No: {settings.vatNumber}</p>}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 18 }}>
        <thead>
          <tr style={{ background: '#2D4A3E', color: '#fff' }}>
            <th style={{ textAlign: 'left', padding: '8px 12px', width: 78 }}>Date</th>
            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Description</th>
            <th style={{ textAlign: 'center', padding: '8px 12px', width: 50 }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '8px 12px', width: 80 }}>Rate</th>
            <th style={{ textAlign: 'right', padding: '8px 12px', width: 100 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lines.map((l, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px 12px' }}>{l.date || invoice.date}</td>
              <td style={{ padding: '8px 12px' }}>{l.desc}</td>
              <td style={{ padding: '8px 12px', textAlign: 'center' }}>{l.qty !== '' && l.qty != null ? l.qty : ''}</td>
              <td style={{ padding: '8px 12px', textAlign: 'right' }}>{l.rate !== '' && l.rate != null ? R(l.rate) : ''}</td>
              <td style={{ padding: '8px 12px', textAlign: 'right' }}>{R(l.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginLeft: 'auto', width: 260 }}>
        <PRow k="Subtotal" v={R(invoice.subtotal)} />
        {invoice.vat > 0 && <PRow k={`VAT @ ${invoice.vatRate}%`} v={R(invoice.vat)} />}
        <PRow k="TOTAL DUE" v={R(invoice.total)} big />
      </div>

      {invoice.note && <p style={{ margin: '18px 0' }}><strong>Note:</strong> {invoice.note}</p>}

      {(settings.bankName || settings.accNo) && (
        <div style={{ background: '#F7F3EC', padding: '14px 18px', borderLeft: '3px solid #B5714A', margin: '18px 0' }}>
          <p style={{ fontWeight: 700, color: '#2D4A3E', margin: '0 0 4px' }}>Payment — EFT only</p>
          {settings.bankName && <p style={{ margin: 0 }}>Bank: {settings.bankName}</p>}
          {settings.accName && <p style={{ margin: 0 }}>Account name: {settings.accName}</p>}
          {settings.accNo && <p style={{ margin: 0 }}>Account number: {settings.accNo}</p>}
          {settings.branch && <p style={{ margin: 0 }}>Branch code: {settings.branch}</p>}
          <p style={{ margin: '4px 0 0' }}>Reference: {invoice.number}</p>
        </div>
      )}
      <p style={{ fontSize: '10px', color: '#777', lineHeight: 1.55, borderTop: '1px solid #ddd', paddingTop: 14 }}>{DISCLAIMER}</p>
    </div>
  );
}

export function PrintAccount({ client, data, settings }) {
  const ledger = buildLedger(client, data);
  const acc = account(client, data);
  return (
    <div id="print-quote" style={{ background: '#fff', color: '#222', padding: '40px 48px', fontFamily: 'Raleway, sans-serif', fontSize: '13px', lineHeight: 1.6 }}>
      <PrintHeader title="ACCOUNT STATEMENT" settings={settings} />
      <p style={{ marginBottom: 4 }}><strong>Client:</strong> {client.name}{client.ref ? ` · File ${client.ref}` : ''}</p>
      <p style={{ marginBottom: 18 }}><strong>Date:</strong> {today()}</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
        <thead>
          <tr style={{ background: '#2D4A3E', color: '#fff' }}>
            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Date</th>
            <th style={{ textAlign: 'left', padding: '8px 12px' }}>Detail</th>
            <th style={{ textAlign: 'right', padding: '8px 12px' }}>Charge</th>
            <th style={{ textAlign: 'right', padding: '8px 12px' }}>Paid</th>
            <th style={{ textAlign: 'right', padding: '8px 12px' }}>Balance</th>
          </tr>
        </thead>
        <tbody>
          {ledger.map((r) => (
            <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '7px 12px' }}>{r.date}</td>
              <td style={{ padding: '7px 12px' }}>{r.detail}</td>
              <td style={{ padding: '7px 12px', textAlign: 'right' }}>{r.charge ? R(r.charge) : ''}</td>
              <td style={{ padding: '7px 12px', textAlign: 'right' }}>{r.paid ? R(r.paid) : ''}</td>
              <td style={{ padding: '7px 12px', textAlign: 'right' }}>{R(r.balance)}</td>
            </tr>
          ))}
          <tr><td colSpan={4} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#B5714A' }}>Balance outstanding</td><td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#B5714A' }}>{R(acc.balance)}</td></tr>
        </tbody>
      </table>
      {(settings.bankName || settings.accNo) && (
        <div style={{ background: '#F7F3EC', padding: '12px 16px', borderLeft: '3px solid #B5714A' }}>
          <p style={{ fontWeight: 700, margin: '0 0 4px', color: '#2D4A3E' }}>Payment — EFT only</p>
          {settings.bankName && <p style={{ margin: 0 }}>Bank: {settings.bankName}</p>}
          {settings.accName && <p style={{ margin: 0 }}>Account name: {settings.accName}</p>}
          {settings.accNo && <p style={{ margin: 0 }}>Account number: {settings.accNo}</p>}
          {settings.branch && <p style={{ margin: 0 }}>Branch code: {settings.branch}</p>}
        </div>
      )}
    </div>
  );
}

/* ---- small layout helpers ---- */
function Row({ k, v, big }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: big ? '1.15rem' : '0.95rem' }}>
      <span style={{ fontWeight: big ? 700 : 400 }}>{k}</span>
      <strong style={{ color: big ? 'var(--copper)' : 'var(--forest)' }}>{v}</strong>
    </div>
  );
}
function PRow({ k, v, big }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: big ? '8px 0 0' : '3px 0', borderTop: big ? '2px solid #2D4A3E' : 'none', marginTop: big ? 6 : 0, fontSize: big ? '15px' : '13px' }}>
      <span style={{ fontWeight: big ? 700 : 400, color: '#2D4A3E' }}>{k}</span>
      <strong style={{ color: big ? '#B5714A' : '#2D4A3E' }}>{v}</strong>
    </div>
  );
}
function Mini({ k, v, c }) {
  return (
    <div>
      <p style={{ color: 'var(--muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</p>
      <p className="serif" style={{ fontSize: '1.5rem', fontWeight: 700, color: c || 'var(--forest)', marginTop: 2 }}>{v}</p>
    </div>
  );
}

import { useState } from 'react';
import { card, input, label, btnGhost } from './ui';
import {
  COURT_TYPES, ROLES, GENDERS, REGIMES, FURNITURE_OPTIONS, SPOUSAL_OPTIONS,
  COSTS_OPTIONS, DEBT_OPTIONS, CONTRIBUTION_TYPES, CONTRIB_FREQ,
} from './matter';

/* The structured intake. `m` (the matter object) and `setM` are owned by the
 * parent CourtDocs so the live preview always reflects what is typed here. */

const PARTY = ['', 'Plaintiff', 'Defendant'];

export default function MatterForm({ m, setM }) {
  const [open, setOpen] = useState('Court & case');
  const set = (k, v) => setM((p) => ({ ...p, [k]: v }));
  const addRow = (key, blank) => setM((p) => ({ ...p, [key]: [...(p[key] || []), blank] }));
  const setRow = (key, i, patch) => setM((p) => ({ ...p, [key]: p[key].map((r, j) => (j === i ? { ...r, ...patch } : r)) }));
  const delRow = (key, i) => setM((p) => ({ ...p, [key]: p[key].filter((_, j) => j !== i) }));

  const Sec = ({ title, children }) => (
    <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(open === title ? '' : title)}
        style={{ width: '100%', textAlign: 'left', background: open === title ? 'var(--forest)' : 'transparent', color: open === title ? '#fff' : 'var(--forest)', border: 'none', padding: '13px 18px', fontSize: '1.05rem', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif', display: 'flex', justifyContent: 'space-between' }}
      >
        <span>{title}</span><span>{open === title ? '–' : '+'}</span>
      </button>
      {open === title && <div style={{ padding: '16px 18px 20px' }}>{children}</div>}
    </div>
  );

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 };
  const T = (k, lbl, opts = {}) => (
    <div style={opts.full ? { gridColumn: '1 / -1' } : undefined}>
      <label style={label}>{lbl}</label>
      <input type={opts.type || 'text'} style={input} value={m[k] || ''} onChange={(e) => set(k, e.target.value)} />
    </div>
  );
  const Sel = (k, lbl, options, opts = {}) => (
    <div style={opts.full ? { gridColumn: '1 / -1' } : undefined}>
      <label style={label}>{lbl}</label>
      <select style={input} value={m[k] ?? ''} onChange={(e) => set(k, e.target.value)}>
        {options.map((o) => (typeof o === 'string'
          ? <option key={o} value={o}>{o || 'Select…'}</option>
          : <option key={o.key} value={o.key}>{o.label}</option>))}
      </select>
    </div>
  );

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
        Fill in what you know — anything left blank prints as <strong>****</strong> so you can find and complete it by hand.
        These details feed every document below. Click <strong>Save case details</strong> when done.
      </p>

      <Sec title="Court & case">
        <div style={grid}>
          {Sel('courtType', 'Court', COURT_TYPES)}
          {T('division', 'Division / Regional division')}
          {T('heldAt', 'Held at (town)')}
          {T('caseNumber', 'Case number')}
          {Sel('ourRole', 'Your client is the…', ROLES)}
        </div>
      </Sec>

      <Sec title="Parties">
        <p style={{ ...label, color: 'var(--copper)', marginBottom: 8 }}>Plaintiff</p>
        <div style={grid}>
          {T('plaintiffName', 'Full names')}
          {T('plaintiffId', 'ID number')}
          {Sel('plaintiffGender', 'Gender', GENDERS)}
          {T('plaintiffOccupation', 'Occupation')}
          {T('plaintiffEmployer', 'Employer')}
          {T('plaintiffAddress', 'Residential address', { full: true })}
        </div>
        <p style={{ ...label, color: 'var(--copper)', margin: '16px 0 8px' }}>Defendant</p>
        <div style={grid}>
          {T('defendantName', 'Full names')}
          {T('defendantId', 'ID number')}
          {Sel('defendantGender', 'Gender', GENDERS)}
          {T('defendantOccupation', 'Occupation')}
          {T('defendantEmployer', 'Employer')}
          {T('defendantAddress', 'Residential address', { full: true })}
        </div>
      </Sec>

      <Sec title="Marriage">
        <div style={grid}>
          {T('marriageDate', 'Date of marriage', { type: 'date' })}
          {T('marriagePlace', 'Place of marriage')}
          {Sel('regime', 'Marriage regime', ['', ...REGIMES], { full: true })}
          {T('antenuptialNumber', 'Antenuptial contract no. (if any)')}
          {T('separationDate', 'Living apart since', { type: 'date' })}
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={label}>Grounds for breakdown (specific, factual)</label>
          <textarea rows={2} style={{ ...input, resize: 'vertical' }} value={m.grounds || ''} onChange={(e) => set('grounds', e.target.value)} />
        </div>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={!!m.forfeiture} onChange={(e) => set('forfeiture', e.target.checked)} style={{ accentColor: 'var(--copper)' }} />
          <span style={{ fontSize: '0.9rem' }}>Claim forfeiture of benefits (s 9(1) Divorce Act)</span>
        </label>
      </Sec>

      <Sec title="Children">
        {(m.children || []).map((c, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 1fr auto', gap: 8, marginBottom: 8 }}>
            <input style={input} placeholder="Full name" value={c.name || ''} onChange={(e) => setRow('children', i, { name: e.target.value })} />
            <input type="date" style={input} value={c.dob || ''} onChange={(e) => setRow('children', i, { dob: e.target.value })} />
            <select style={input} value={c.gender || ''} onChange={(e) => setRow('children', i, { gender: e.target.value })}>
              {GENDERS.map((g) => <option key={g} value={g}>{g || 'Gender'}</option>)}
            </select>
            <button style={{ ...btnGhost, color: '#a33', padding: '6px 10px' }} onClick={() => delRow('children', i)}>✕</button>
          </div>
        ))}
        <button style={{ ...btnGhost, marginTop: 4 }} onClick={() => addRow('children', { name: '', dob: '', gender: '' })}>+ Add child</button>
        <div style={{ ...grid, marginTop: 14 }}>
          {Sel('primaryResidence', 'Primary residence with', PARTY)}
          {T('contact', "Other parent's contact")}
        </div>
      </Sec>

      <Sec title="Child maintenance & contributions">
        <div style={grid}>
          {T('childMaintenance', 'Per child per month (R)', { type: 'number' })}
          {T('escalation', 'Annual escalation (%)', { type: 'number' })}
          {Sel('medicalAidBy', 'Keeps children on medical aid', PARTY)}
          {Sel('educationBy', 'Pays educational expenses', PARTY)}
        </div>
        <p style={{ ...label, color: 'var(--copper)', margin: '16px 0 8px' }}>Additional contributions</p>
        {(m.contributions || []).map((c, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.3fr auto', gap: 8, marginBottom: 8 }}>
            <select style={input} value={c.type || ''} onChange={(e) => setRow('contributions', i, { type: e.target.value })}>
              <option value="">Type…</option>
              {CONTRIBUTION_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <input type="number" style={input} placeholder="Amount" value={c.amount || ''} onChange={(e) => setRow('contributions', i, { amount: e.target.value })} />
            <select style={input} value={c.freq || ''} onChange={(e) => setRow('contributions', i, { freq: e.target.value })}>
              <option value="">How often…</option>
              {CONTRIB_FREQ.map((f) => <option key={f}>{f}</option>)}
            </select>
            <button style={{ ...btnGhost, color: '#a33', padding: '6px 10px' }} onClick={() => delRow('contributions', i)}>✕</button>
          </div>
        ))}
        <button style={btnGhost} onClick={() => addRow('contributions', { type: '', amount: '', freq: 'per month' })}>+ Add contribution</button>
      </Sec>

      <Sec title="Spousal maintenance">
        <div style={grid}>
          {Sel('spousalType', 'Type', SPOUSAL_OPTIONS, { full: true })}
          {(m.spousalType === 'rehab' || m.spousalType === 'life' || m.spousalType === 'lump') && T('spousalAmount', m.spousalType === 'lump' ? 'Lump sum (R)' : 'Amount per month (R)', { type: 'number' })}
          {m.spousalType === 'rehab' && T('spousalMonths', 'For how many months', { type: 'number' })}
        </div>
      </Sec>

      <Sec title="Assets — vehicles">
        {(m.vehicles || []).map((vh, i) => (
          <div key={i} style={{ border: '1px solid var(--creamdark)', borderRadius: 6, padding: 12, marginBottom: 10 }}>
            <div style={grid}>
              <div style={{ gridColumn: '1 / -1' }}><label style={label}>Vehicle (make, model, registration)</label><input style={input} value={vh.description || ''} onChange={(e) => setRow('vehicles', i, { description: e.target.value })} /></div>
              <div><label style={label}>Retained by</label><select style={input} value={vh.retainedBy || ''} onChange={(e) => setRow('vehicles', i, { retainedBy: e.target.value })}>{PARTY.map((p) => <option key={p} value={p}>{p || 'Select…'}</option>)}</select></div>
              <div><label style={label}>Still under finance?</label><select style={input} value={vh.underFinance ? 'yes' : 'no'} onChange={(e) => setRow('vehicles', i, { underFinance: e.target.value === 'yes' })}><option value="no">No / paid off</option><option value="yes">Yes</option></select></div>
              {vh.underFinance && <div><label style={label}>Finance paid by</label><select style={input} value={vh.financeBy || ''} onChange={(e) => setRow('vehicles', i, { financeBy: e.target.value })}>{PARTY.map((p) => <option key={p} value={p}>{p || 'Select…'}</option>)}</select></div>}
              <div><label style={label}>Insured by</label><select style={input} value={vh.insuranceBy || ''} onChange={(e) => setRow('vehicles', i, { insuranceBy: e.target.value })}>{PARTY.map((p) => <option key={p} value={p}>{p || 'Select…'}</option>)}</select></div>
            </div>
            <button style={{ ...btnGhost, color: '#a33', padding: '6px 10px', marginTop: 10 }} onClick={() => delRow('vehicles', i)}>✕ Remove vehicle</button>
          </div>
        ))}
        <button style={btnGhost} onClick={() => addRow('vehicles', { description: '', retainedBy: '', underFinance: false, financeBy: '', insuranceBy: '' })}>+ Add vehicle</button>
      </Sec>

      <Sec title="Assets — furniture & household">
        {Sel('furnitureOption', 'How is the furniture dealt with?', FURNITURE_OPTIONS)}
        {(m.furnitureOption === 'plaintiff' || m.furnitureOption === 'defendant') && (
          <div style={{ marginTop: 12 }}>
            <label style={label}>Items the {m.furnitureOption === 'plaintiff' ? 'Plaintiff' : 'Defendant'} keeps</label>
            <textarea rows={3} style={{ ...input, resize: 'vertical' }} placeholder="e.g. the lounge suite, the double-door fridge, the washing machine…" value={m.furnitureItems || ''} onChange={(e) => set('furnitureItems', e.target.value)} />
          </div>
        )}
      </Sec>

      <Sec title="Assets — immovable property">
        {(m.properties || []).map((pr, i) => (
          <div key={i} style={{ border: '1px solid var(--creamdark)', borderRadius: 6, padding: 12, marginBottom: 10 }}>
            <div style={grid}>
              <div style={{ gridColumn: '1 / -1' }}><label style={label}>Property (full address / erf description)</label><input style={input} value={pr.description || ''} onChange={(e) => setRow('properties', i, { description: e.target.value })} /></div>
              <div><label style={label}>Retained by</label><select style={input} value={pr.retainedBy || ''} onChange={(e) => setRow('properties', i, { retainedBy: e.target.value })}>{PARTY.map((p) => <option key={p} value={p}>{p || 'Select…'}</option>)}</select></div>
              <div><label style={label}>Bond / costs paid by</label><select style={input} value={pr.bondBy || ''} onChange={(e) => setRow('properties', i, { bondBy: e.target.value })}>{PARTY.map((p) => <option key={p} value={p}>{p || 'Select…'}</option>)}</select></div>
              <div><label style={label}>Buy out the other party?</label><select style={input} value={pr.buyOut ? 'yes' : 'no'} onChange={(e) => setRow('properties', i, { buyOut: e.target.value === 'yes' })}><option value="no">No — simply retains</option><option value="yes">Yes — pays a buy-out</option></select></div>
              {pr.buyOut && <div><label style={label}>Buy-out amount (R, blank = 50%)</label><input type="number" style={input} value={pr.buyOutAmount || ''} onChange={(e) => setRow('properties', i, { buyOutAmount: e.target.value })} /></div>}
            </div>
            <button style={{ ...btnGhost, color: '#a33', padding: '6px 10px', marginTop: 10 }} onClick={() => delRow('properties', i)}>✕ Remove property</button>
          </div>
        ))}
        <button style={btnGhost} onClick={() => addRow('properties', { description: '', retainedBy: '', bondBy: '', buyOut: false, buyOutAmount: '' })}>+ Add property</button>
      </Sec>

      <Sec title="Assets — pension interest">
        {(m.pensions || []).map((pn, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr auto', gap: 8, marginBottom: 8 }}>
            <input style={input} placeholder="Fund name" value={pn.fundName || ''} onChange={(e) => setRow('pensions', i, { fundName: e.target.value })} />
            <select style={input} value={pn.memberSpouse || ''} onChange={(e) => setRow('pensions', i, { memberSpouse: e.target.value })}>
              <option value="">Member is…</option><option>Plaintiff</option><option>Defendant</option>
            </select>
            <input type="number" style={input} placeholder="% to other" value={pn.percentage || ''} onChange={(e) => setRow('pensions', i, { percentage: e.target.value })} />
            <button style={{ ...btnGhost, color: '#a33', padding: '6px 10px' }} onClick={() => delRow('pensions', i)}>✕</button>
          </div>
        ))}
        <button style={btnGhost} onClick={() => addRow('pensions', { fundName: '', memberSpouse: '', percentage: '' })}>+ Add pension interest</button>
      </Sec>

      <Sec title="Legal costs & debt">
        <div style={grid}>
          {Sel('costsOption', 'Legal costs', COSTS_OPTIONS)}
          {m.costsOption === 'other' && T('costsOther', 'Specify costs arrangement', { full: true })}
          {Sel('debtOption', 'Debt', DEBT_OPTIONS)}
          {m.debtOption === 'other' && T('debtOther', 'Specify debt arrangement', { full: true })}
        </div>
      </Sec>
    </div>
  );
}

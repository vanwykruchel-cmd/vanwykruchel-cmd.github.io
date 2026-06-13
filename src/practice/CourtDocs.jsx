import { useState } from 'react';
import { card, input, label, btn, btnGhost } from './ui';
import MatterForm from './MatterForm';
import { withMatter } from './matter';
import { getLegalDocs, DOC_CATEGORIES } from './legalDocs';

/*
 * Court Docs sub-tab: fill in the case details once (MatterForm), then generate
 * the Settlement Agreement and every pleading from that single intake. The
 * preview is live; **** marks anything still to complete by hand.
 */
export default function CourtDocs({ client, patchClient, settings, printText }) {
  const [m, setM] = useState(() => withMatter(client));
  const [savedMsg, setSavedMsg] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [copied, setCopied] = useState(false);

  const docs = getLegalDocs();
  const [selId, setSelId] = useState(docs[0].id);
  const selected = docs.find((d) => d.id === selId) || docs[0];
  const text = selected.build(m, client, settings);

  function save() {
    patchClient({ matter: m });
    setSavedMsg('Saved ✓');
    setTimeout(() => setSavedMsg(''), 2500);
  }
  function doPrint() {
    patchClient({ matter: m });   // persist before printing
    printText(selected.name, text);
  }
  async function copy() {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* clipboard unavailable */ }
  }

  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 920 }}>
      <div style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h3 className="serif" style={{ fontSize: '1.3rem' }}>Case details</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.84rem', marginTop: 2 }}>Fill in once — used by every document below.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {savedMsg && <span style={{ color: 'var(--forest)', fontWeight: 600 }}>{savedMsg}</span>}
          <button style={btnGhost} onClick={() => setShowForm(!showForm)}>{showForm ? 'Hide' : 'Show'} form</button>
          <button style={btn} onClick={save}>Save case details</button>
        </div>
      </div>

      {showForm && <MatterForm m={m} setM={setM} />}

      <div style={card}>
        <h3 className="serif" style={{ fontSize: '1.3rem', marginBottom: 12 }}>Generate a document</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
          <select style={{ ...input, maxWidth: 380 }} value={selId} onChange={(e) => setSelId(e.target.value)}>
            {DOC_CATEGORIES.map((cat) => (
              <optgroup key={cat} label={cat}>
                {docs.filter((d) => d.category === cat).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </optgroup>
            ))}
          </select>
          <button style={btn} onClick={doPrint}>Print / PDF</button>
          <button style={btnGhost} onClick={copy}>{copied ? 'Copied ✓' : 'Copy text'}</button>
        </div>
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'Raleway, sans-serif', fontSize: '0.84rem', lineHeight: 1.7, background: 'var(--cream)', padding: 18, borderRadius: 4, maxHeight: 560, overflowY: 'auto', margin: 0 }}>
          {text}
        </pre>
        <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 10, lineHeight: 1.6 }}>
          Working draft to support a self-representing litigant — not the work of an admitted attorney.
          Search the document for <strong>****</strong> and complete every one before filing. Review and adapt to the matter.
        </p>
      </div>
    </div>
  );
}

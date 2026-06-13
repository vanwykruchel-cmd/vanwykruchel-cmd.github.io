import { useMemo, useState } from 'react';
import { card, input, btn, btnGhost, tag, R, STAGE_COLORS } from './ui';
import { account } from './billing';

/*
 * One box that searches the whole practice — clients, files, invoices, quotes
 * and the words in your notes. Click any result to jump into that file.
 */

const has = (v, q) => String(v || '').toLowerCase().includes(q);

export default function GlobalSearch({ data, onOpenClient }) {
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (query.length < 1) return null;
    const clients = [];
    const invoices = [];
    const quotes = [];
    const notes = [];

    data.clients.forEach((c) => {
      const caseVals = Object.values(c.case || {}).join(' ');
      if ([c.name, c.ref, c.email, c.phone, c.province, c.matterType, c.stage, caseVals].some((v) => has(v, query))) {
        clients.push(c);
      }
      (c.activities || []).forEach((a) => {
        if (has(a.text, query) || has(a.type, query)) notes.push({ client: c, label: `${a.date} · ${a.type}`, snippet: a.text });
      });
      (c.documents || []).forEach((d) => {
        if (has(d.title, query) || has(d.content, query)) notes.push({ client: c, label: `Document · ${d.title}`, snippet: d.content });
      });
      if (has(c.case?.notes, query)) notes.push({ client: c, label: 'Case note', snippet: c.case.notes });
    });

    (data.invoices || []).forEach((i) => {
      const lineText = (i.lines || []).map((l) => l.desc).join(' ');
      if (has(i.number, query) || has(lineText, query)) {
        invoices.push({ inv: i, client: data.clients.find((c) => c.id === i.clientId) });
      }
    });

    (data.quotes || []).forEach((qt) => {
      const lineText = (qt.items || []).map((l) => l.desc).join(' ');
      if (has(qt.number, query) || has(lineText, query)) {
        quotes.push({ quote: qt, client: data.clients.find((c) => c.id === qt.clientId) });
      }
    });

    return { clients, invoices, quotes, notes };
  }, [query, data]);

  const total = results ? results.clients.length + results.invoices.length + results.quotes.length + results.notes.length : 0;

  return (
    <div style={{ maxWidth: 820 }}>
      <input
        autoFocus
        style={{ ...input, fontSize: '1.05rem', padding: '14px 16px', marginBottom: 18 }}
        placeholder="Search names, file numbers, invoices, phone numbers, notes…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {!results && <p style={{ color: 'var(--muted)' }}>Start typing to search across every file, invoice, quote and note.</p>}
      {results && total === 0 && <p style={{ color: 'var(--muted)' }}>Nothing found for “{q}”.</p>}

      {results && results.clients.length > 0 && (
        <Group title={`Clients & files (${results.clients.length})`}>
          {results.clients.map((c) => {
            const [bg, fg] = STAGE_COLORS[c.stage] || ['#eee', '#333'];
            const acc = account(c, data);
            return (
              <div key={c.id} style={row}>
                <div>
                  <strong style={{ color: 'var(--forest)' }}>{c.name}</strong>
                  {c.ref && <span style={{ color: 'var(--muted)' }}> · {c.ref}</span>}
                  <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 3 }}>{c.matterType} · {c.phone || c.email || '—'}{acc.balance > 0 ? ` · owing ${R(acc.balance)}` : ''}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={tag(bg, fg)}>{c.stage}</span>
                  <button style={btn} onClick={() => onOpenClient(c.id)}>Open File</button>
                </div>
              </div>
            );
          })}
        </Group>
      )}

      {results && results.invoices.length > 0 && (
        <Group title={`Invoices (${results.invoices.length})`}>
          {results.invoices.map(({ inv, client }) => (
            <div key={inv.id} style={row}>
              <div>
                <strong style={{ color: 'var(--forest)' }}>{inv.number}</strong>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 3 }}>{client?.name || 'Unknown'} · {inv.date} · {R(inv.total)}</p>
              </div>
              {client && <button style={btnGhost} onClick={() => onOpenClient(client.id)}>Open File</button>}
            </div>
          ))}
        </Group>
      )}

      {results && results.quotes.length > 0 && (
        <Group title={`Quotes (${results.quotes.length})`}>
          {results.quotes.map(({ quote, client }) => (
            <div key={quote.id} style={row}>
              <div>
                <strong style={{ color: 'var(--forest)' }}>{quote.number}</strong>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 3 }}>{client?.name || 'Unknown'} · {quote.created} · {quote.status}</p>
              </div>
              {client && <button style={btnGhost} onClick={() => onOpenClient(client.id)}>Open File</button>}
            </div>
          ))}
        </Group>
      )}

      {results && results.notes.length > 0 && (
        <Group title={`Notes & documents (${results.notes.length})`}>
          {results.notes.map((n, i) => (
            <div key={i} style={row}>
              <div style={{ minWidth: 0 }}>
                <strong style={{ color: 'var(--forest)' }}>{n.client.name}</strong>
                <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}> · {n.label}</span>
                {n.snippet && <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.snippet}</p>}
              </div>
              <button style={btnGhost} onClick={() => onOpenClient(n.client.id)}>Open File</button>
            </div>
          ))}
        </Group>
      )}
    </div>
  );
}

const row = { ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, padding: '14px 18px' };

function Group({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--copper)', marginBottom: 10 }}>{title}</p>
      <div style={{ display: 'grid', gap: 10 }}>{children}</div>
    </div>
  );
}

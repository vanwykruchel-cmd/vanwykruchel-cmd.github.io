/* Shared building blocks for the Practice Manager. */

export const STAGES = ['Enquiry', 'Consult Booked', 'Quote Sent', 'Paid — Active', 'Completed', 'Referred Out'];
export const QUOTE_STATUS = ['Draft', 'Sent', 'Accepted', 'Paid', 'Declined'];

export const R = (n) => 'R ' + Number(n || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 });
export const uid = () => Math.random().toString(36).slice(2, 10);
export const today = () => new Date().toISOString().slice(0, 10);
export const quoteTotal = (q) => q.items.reduce((s, i) => s + i.price * (i.qty || 1), 0);
/* Round to two decimals (cents) without floating-point drift. */
export const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

export const card = {
  background: 'var(--white)',
  border: '1px solid var(--creamdark)',
  borderRadius: 6,
  padding: 22,
};
export const input = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid var(--creamdark)',
  borderRadius: 4,
  background: '#fff',
  fontSize: '0.95rem',
};
export const label = {
  fontSize: '0.72rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontWeight: 600,
  color: 'var(--forest)',
  display: 'block',
  marginBottom: 5,
};
export const btn = {
  background: 'var(--copper)',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  padding: '10px 20px',
  fontWeight: 600,
  fontSize: '0.85rem',
  letterSpacing: '0.06em',
};
export const btnGhost = {
  ...btn,
  background: 'transparent',
  color: 'var(--forest)',
  border: '1px solid var(--creamdark)',
};
export const tag = (bg, fg) => ({
  display: 'inline-block',
  padding: '3px 10px',
  borderRadius: 20,
  fontSize: '0.72rem',
  fontWeight: 600,
  background: bg,
  color: fg,
});

export const STAGE_COLORS = {
  Enquiry: ['#eef3f0', '#2D4A3E'],
  'Consult Booked': ['#fdf3ec', '#B5714A'],
  'Quote Sent': ['#fbeede', '#9a5c38'],
  'Paid — Active': ['#e7f0e9', '#1d6b3a'],
  Completed: ['#e9e9e9', '#555'],
  'Referred Out': ['#f3e9f0', '#7a4a6b'],
};

/* Brand header used on printed documents — real logo with graceful fallback. */
export function PrintHeader({ title, settings }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid #B5714A', paddingBottom: 16, marginBottom: 22 }}>
      <img
        src={`${import.meta.env.BASE_URL}logo.jpg`}
        alt="Van Wyk Family Law Advisory"
        style={{ height: 84 }}
        onError={(e) => (e.currentTarget.style.display = 'none')}
      />
      <div style={{ textAlign: 'right' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', color: '#2D4A3E', fontSize: '22px', margin: 0 }}>
          {title}
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '11px' }}>{settings?.ownerName || 'Van Wyk Family Law Advisory'}</p>
        <p style={{ margin: 0, fontSize: '11px' }}>Family Law Consultant (LLB, UNISA)</p>
        <p style={{ margin: 0, fontSize: '11px' }}>{settings?.email}{settings?.phone ? ' · ' + settings.phone : ''}</p>
      </div>
    </div>
  );
}

/* Renders a plain-text document (template output) as a printable page. */
export function PrintTextDoc({ text, title, settings }) {
  return (
    <div id="print-quote" style={{ background: '#fff', color: '#222', padding: '36px 44px', fontFamily: 'Raleway, sans-serif', fontSize: '12.5px', lineHeight: 1.65 }}>
      <PrintHeader title={title} settings={settings} />
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>{text}</pre>
    </div>
  );
}

import { useState } from 'react';
import useReveal from './useReveal';
import Counter from './Counter';
import { Motif, InkDrawing, SIGNATURE } from './motifs';
import { SERVICES, FAQS, MATTER_TYPES, INCOME_BRACKETS, PROVINCES, CONTACT } from '../constants/data';

const wrap = { maxWidth: 1100, margin: '0 auto', padding: '0 24px' };

/* ---------- THE GAP ---------- */
export function GapSection() {
  const ref = useReveal();
  return (
    <section ref={ref} id="gap" style={{ background: 'var(--white)', padding: 'clamp(70px, 10vw, 130px) 0' }}>
      <div style={wrap}>
        <Motif name="scales" />
        <p className="eyebrow reveal">The Gap in South African Justice</p>
        <h2 className="section-title reveal d1">
          Too much for Legal Aid.
          <br />
          Too little for an attorney.
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 28,
            marginTop: 50,
          }}
        >
          {[
            {
              n: <Counter target={8000} suffix="" />,
              pre: 'R',
              label: 'Legal Aid income ceiling per month. Earn more and you are on your own.',
            },
            {
              n: <Counter target={5000} suffix="" />,
              pre: 'R2,500–R',
              label: 'What private attorneys charge per hour in South Africa.',
            },
            {
              n: <Counter target={200} suffix="k+" />,
              pre: 'R',
              label: 'What a contested divorce routinely costs over two to five years.',
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`reveal d${i + 1}`}
              style={{
                background: 'var(--cream)',
                border: '1px solid var(--creamdark)',
                borderTop: '3px solid var(--copper)',
                padding: '38px 30px',
                borderRadius: 4,
              }}
            >
              <div className="serif" style={{ fontSize: '2.6rem', color: 'var(--forest)', fontWeight: 700 }}>
                {s.pre}
                {s.n}
              </div>
              <p style={{ marginTop: 14, lineHeight: 1.7, color: 'var(--mid)' }}>{s.label}</p>
            </div>
          ))}
        </div>
        <div className="reveal d4" style={{ marginTop: 56, maxWidth: 760 }}>
          <p style={{ fontSize: '1.12rem', lineHeight: 1.9, color: 'var(--mid)' }}>
            You earn R15,000 a month. After rent, groceries, transport, school fees and the car payment, there is
            nothing left for a legal retainer. You earn too much for Legal Aid and too little for private
            representation. So you sit in maintenance court alone, not knowing what to fill in or what to say —
            while the other side has an attorney.
          </p>
          <p
            className="serif"
            style={{ fontSize: '1.5rem', marginTop: 26, color: 'var(--forest)', fontStyle: 'italic' }}
          >
            This practice exists for you.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- HOW IT WORKS ---------- */
export function HowSection() {
  const ref = useReveal();
  const steps = [
    {
      t: 'Reach out',
      d: 'Send an enquiry through the form or WhatsApp. Tell me briefly what you are facing. No cost, no obligation.',
    },
    {
      t: 'Intake consultation',
      d: 'We talk — by video call or phone. I assess your matter honestly: what can be done, what it involves, and whether I am the right person to help.',
    },
    {
      t: 'Written fixed-fee quote',
      d: 'Before any work begins, you receive a written quote with a fixed fee. No hourly billing. No surprises. Banking details come with the quote — EFT only.',
    },
    {
      t: 'The work begins',
      d: 'Documents drafted, applications prepared, strategy mapped, coaching before every appearance. You are never sent into a courtroom unprepared.',
    },
  ];
  return (
    <section ref={ref} id="how" style={{ background: 'var(--cream)', padding: 'clamp(70px, 10vw, 130px) 0' }}>
      <div style={wrap}>
        <Motif name="journey" />
        <p className="eyebrow reveal">How It Works</p>
        <h2 className="section-title reveal d1">Four steps. Complete transparency.</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: 26,
            marginTop: 50,
          }}
        >
          {steps.map((s, i) => (
            <div key={i} className={`reveal d${i + 1}`} style={{ position: 'relative', paddingTop: 18 }}>
              <div
                className="serif"
                style={{
                  fontSize: '3.4rem',
                  fontWeight: 700,
                  color: 'var(--creamdark)',
                  lineHeight: 1,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ position: 'relative', paddingTop: 34 }}>
                <h3 style={{ fontSize: '1.45rem', marginBottom: 12 }}>{s.t}</h3>
                <p style={{ lineHeight: 1.75 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <p
          className="reveal d5"
          style={{
            marginTop: 54,
            padding: '22px 28px',
            background: 'var(--white)',
            borderLeft: '3px solid var(--copper)',
            borderRadius: 4,
            maxWidth: 720,
            lineHeight: 1.8,
          }}
        >
          <strong style={{ color: 'var(--forest)' }}>A note on payment:</strong> there is no payment on this
          website. Banking details are only provided after your intake consultation, by email, together with your
          written fixed-fee quote. All payment is by EFT.
        </p>
      </div>
    </section>
  );
}

/* ---------- SERVICES ---------- */
export function ServicesSection() {
  const ref = useReveal();
  const [open, setOpen] = useState(null);
  return (
    <section ref={ref} id="services" style={{ background: 'var(--white)', padding: 'clamp(70px, 10vw, 130px) 0' }}>
      <div style={wrap}>
        <Motif name="twoHomes" />
        <p className="eyebrow reveal">Services</p>
        <h2 className="section-title reveal d1">Five areas. Deep specialisation.</h2>
        <p className="reveal d2" style={{ maxWidth: 640, lineHeight: 1.8, marginBottom: 50 }}>
          Click any service to see the full scope — and the honest truth about what it involves. Every service ends
          the same way: a written fixed-fee quote before any work begins.
        </p>
        <div style={{ display: 'grid', gap: 18 }}>
          {SERVICES.map((s, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`reveal d${Math.min(i + 1, 5)}`}
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  background: 'var(--cream)',
                  border: '1px solid var(--creamdark)',
                  borderTop: isOpen ? '3px solid var(--copper)' : '3px solid transparent',
                  borderRadius: 4,
                  padding: '28px 32px',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                  boxShadow: isOpen ? '0 12px 40px rgba(45,74,62,0.1)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem' }}>{s.title}</h3>
                    <p style={{ color: 'var(--muted)', marginTop: 6 }}>{s.short}</p>
                  </div>
                  <span
                    className="serif"
                    style={{
                      fontSize: '1.8rem',
                      color: 'var(--copper)',
                      transform: isOpen ? 'rotate(45deg)' : 'none',
                      transition: 'transform 0.3s',
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </div>
                <div
                  style={{
                    maxHeight: isOpen ? 600 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <div style={{ paddingTop: 24, display: 'grid', gap: 18 }}>
                    <div>
                      <p
                        style={{
                          fontSize: '0.78rem',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: 'var(--copper)',
                          fontWeight: 600,
                          marginBottom: 8,
                        }}
                      >
                        What this covers
                      </p>
                      <p style={{ lineHeight: 1.8 }}>{s.scope}</p>
                    </div>
                    <div
                      style={{
                        background: 'var(--white)',
                        borderLeft: '3px solid var(--copper)',
                        padding: '18px 22px',
                        borderRadius: 4,
                      }}
                    >
                      <p
                        style={{
                          fontSize: '0.78rem',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          color: 'var(--forest)',
                          fontWeight: 600,
                          marginBottom: 8,
                        }}
                      >
                        The honest truth
                      </p>
                      <p style={{ lineHeight: 1.8, fontStyle: 'italic' }}>{s.truth}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- SCOPE / WHAT I AM NOT ---------- */
export function ScopeSection() {
  const ref = useReveal();
  return (
    <section ref={ref} id="scope" style={{ background: 'var(--darkgreen)', padding: 'clamp(70px, 10vw, 130px) 0' }}>
      <div style={wrap}>
        <div style={{ display: 'flex', marginBottom: 8 }}>
          <InkDrawing
            paths={[
              { d: 'M2,96 C50,96 75,58 112,52', w: 2.5 },
              {
                d: 'M150,34 C172,50 196,56 214,57 C214,108 196,152 150,176 C104,152 86,108 86,57 C104,56 128,50 150,34',
                w: 3,
              },
              { d: 'M124,104 L144,126 L182,82', w: 3.5, copper: true },
            ]}
            viewBox="0 0 300 200"
            mode="scroll"
            strokeBase="rgba(247,243,236,0.85)"
            style={{ width: '100%', maxWidth: 300 }}
          />
        </div>
        <p className="eyebrow reveal">Complete Honesty</p>
        <h2 className="section-title reveal d1" style={{ color: 'var(--cream)' }}>
          What I am — and what I am not.
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 28,
            marginTop: 50,
          }}
        >
          <div
            className="reveal d2"
            style={{
              background: 'rgba(247,243,236,0.06)',
              border: '1px solid rgba(247,243,236,0.14)',
              borderRadius: 4,
              padding: '34px 32px',
            }}
          >
            <h3 style={{ color: 'var(--copperlight)', fontSize: '1.5rem', marginBottom: 18 }}>I am</h3>
            {[
              'A Family Law Consultant with an LLB from the University of South Africa',
              'Years of hands-on experience inside a family law practice',
              'A specialist in guiding self-represented litigants',
              'Available nationwide — online and telephonic, all nine provinces',
              'Honest with you at every step, including when your position is weak',
            ].map((t, i) => (
              <p key={i} style={{ color: 'var(--cream)', lineHeight: 1.7, marginBottom: 12, paddingLeft: 22, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--copper)' }}>—</span>
                {t}
              </p>
            ))}
          </div>
          <div
            className="reveal d3"
            style={{
              background: 'rgba(247,243,236,0.06)',
              border: '1px solid rgba(247,243,236,0.14)',
              borderRadius: 4,
              padding: '34px 32px',
            }}
          >
            <h3 style={{ color: 'var(--copperlight)', fontSize: '1.5rem', marginBottom: 18 }}>I am not</h3>
            {[
              'An admitted attorney or advocate',
              'A law firm',
              'Able to appear in court on your behalf',
              'Regulated by the Legal Practice Council',
              'Going to pretend otherwise — ever',
            ].map((t, i) => (
              <p key={i} style={{ color: 'var(--cream)', lineHeight: 1.7, marginBottom: 12, paddingLeft: 22, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--copper)' }}>—</span>
                {t}
              </p>
            ))}
          </div>
        </div>
        <p className="reveal d4" style={{ color: 'rgba(247,243,236,0.75)', marginTop: 44, maxWidth: 760, lineHeight: 1.85 }}>
          Where your matter requires the appearance of an admitted attorney or advocate, you will be told clearly
          and referred — with everything already prepared, so the expensive hours are kept to a minimum. These
          limitations are not small print. They are part of what you are buying: a service that never oversells
          what it can do.
        </p>
      </div>
    </section>
  );
}

/* ---------- ABOUT ---------- */
export function AboutSection() {
  const ref = useReveal();
  const creds = [
    'LLB — University of South Africa',
    'Family Law Consultant',
    'Years of family law paralegal experience',
    "Divorce · Maintenance · Children's Court · Protection Orders",
    'Specialist in self-represented litigant guidance',
    'Online and telephonic — available nationwide',
    'Practice founded: 2025',
  ];
  return (
    <section ref={ref} id="about" style={{ background: 'var(--cream)', padding: 'clamp(70px, 10vw, 130px) 0' }}>
      <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56 }}>
        <div>
          <Motif name="parentChild" />
          <p className="eyebrow reveal">About</p>
          <h2 className="section-title reveal d1">Why this practice exists.</h2>
          <div className="reveal d2" style={{ display: 'grid', gap: 18, lineHeight: 1.85 }}>
            <p>
              Van Wyk Family Law Advisory was founded on a straightforward observation: the most expensive part of
              a family law matter happens long before anyone walks into a courtroom. The advice, the preparation,
              the documents, the negotiation — that is where most people have nobody guiding them.
            </p>
            <p>
              Years of working inside a family law practice means I have sat with real families through real crises
              — divorce, maintenance disputes, custody battles, domestic violence. I have answered calls from
              people who just needed someone to explain their rights, and watched them leave with nothing because
              they could not afford representation.
            </p>
            <p className="serif" style={{ fontSize: '1.35rem', fontStyle: 'italic', color: 'var(--forest)' }}>
              This practice exists because I believe that is wrong.
            </p>
            <p>
              With an LLB from the University of South Africa and years of hands-on experience across the full
              range of family law matters, I offer what most people in this situation have never had access to:
              someone who knows the law deeply, will be honest with you at every step, and genuinely cares whether
              you come out of this with your dignity and your finances intact.
            </p>
            <p>
              Van Wyk Family Law Advisory is a legal consultancy, not a law firm. I am a Family Law Consultant —
              not an admitted attorney or advocate. I handle everything that does not require admission. Where your
              matter does require an admitted attorney, I refer you to one with everything already prepared.
            </p>
          </div>
        </div>
        <div className="reveal d3">
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--creamdark)',
              borderTop: '3px solid var(--copper)',
              borderRadius: 4,
              padding: '38px 34px',
              position: 'sticky',
              top: 110,
            }}
          >
            <h3 style={{ fontSize: '1.4rem', marginBottom: 22 }}>Credentials</h3>
            {creds.map((c, i) => (
              <p
                key={i}
                style={{
                  padding: '12px 0',
                  borderBottom: i < creds.length - 1 ? '1px solid var(--creamdark)' : 'none',
                  lineHeight: 1.6,
                }}
              >
                {c}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export function FAQSection({ limit }) {
  const ref = useReveal();
  const [open, setOpen] = useState(0);
  const list = limit ? FAQS.slice(0, limit) : FAQS;
  return (
    <section ref={ref} id="faq" style={{ background: 'var(--white)', padding: 'clamp(70px, 10vw, 130px) 0' }}>
      <div style={{ ...wrap, maxWidth: 860 }}>
        <Motif name="question" maxWidth={260} />
        <p className="eyebrow reveal">Questions, Answered Honestly</p>
        <h2 className="section-title reveal d1">Frequently asked questions.</h2>
        <div style={{ marginTop: 40 }}>
          {list.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="reveal d2" style={{ borderBottom: '1px solid var(--creamdark)' }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    padding: '24px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 18,
                  }}
                >
                  <span className="serif" style={{ fontSize: '1.3rem', color: 'var(--forest)', fontWeight: 600 }}>
                    {f.q}
                  </span>
                  <span
                    className="serif"
                    style={{
                      fontSize: '1.6rem',
                      color: 'var(--copper)',
                      transform: isOpen ? 'rotate(45deg)' : 'none',
                      transition: 'transform 0.3s',
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? 400 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <p style={{ lineHeight: 1.85, paddingBottom: 26, maxWidth: 720 }}>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- CONTACT ---------- */
export function ContactSection() {
  const ref = useReveal();
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const sent = status === 'sent';
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!consent || status === 'sending') return;
    setStatus('sending');
    const fd = new FormData(e.target);
    const payload = {
      _subject: `New website enquiry — ${fd.get('matterType')}`,
      Name: `${fd.get('firstName')} ${fd.get('lastName')}`,
      Email: fd.get('email'),
      Phone: fd.get('phone'),
      'Matter Type': fd.get('matterType'),
      Province: fd.get('province'),
      'Income Bracket': fd.get('income'),
      Description: fd.get('description'),
      'POPIA Consent': 'Given',
    };
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('send failed');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid var(--creamdark)',
    borderRadius: 3,
    background: 'var(--white)',
    color: 'var(--dark)',
    outline: 'none',
  };
  const labelStyle = {
    fontSize: '0.78rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    fontWeight: 600,
    color: 'var(--forest)',
    marginBottom: 8,
    display: 'block',
  };

  return (
    <section ref={ref} id="contact" style={{ background: 'var(--cream)', padding: 'clamp(70px, 10vw, 130px) 0' }}>
      <div style={{ ...wrap, maxWidth: 920 }}>
        <div style={{ display: 'flex', marginBottom: 4 }}>
          <InkDrawing
            paths={SIGNATURE.paths}
            viewBox={SIGNATURE.viewBox}
            mode="auto"
            duration={3800}
            pen
            style={{ width: '100%', maxWidth: 340 }}
          />
        </div>
        <p className="eyebrow reveal">Book a Consultation</p>
        <h2 className="section-title reveal d1">Tell me what you are facing.</h2>
        <p className="reveal d2" style={{ maxWidth: 640, lineHeight: 1.8 }}>
          Send your enquiry below, or message directly on WhatsApp. You will hear back within one business day.
        </p>
        <div
          className="reveal d3"
          style={{
            marginTop: 30,
            marginBottom: 40,
            padding: '20px 26px',
            background: 'var(--white)',
            borderLeft: '3px solid var(--copper)',
            borderRadius: 4,
            lineHeight: 1.75,
          }}
        >
          <strong style={{ color: 'var(--forest)' }}>We do not accept payment on this website.</strong> After your
          intake consultation you will receive a written fixed-fee quote and our banking details by email. Payment
          is by EFT only.
        </div>

        {sent ? (
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--creamdark)',
              borderTop: '3px solid var(--copper)',
              borderRadius: 4,
              padding: '60px 40px',
              textAlign: 'center',
              animation: 'fadeUp 0.6s ease both',
            }}
          >
            <h3 className="serif" style={{ fontSize: '1.9rem', marginBottom: 14 }}>
              Thank you.
            </h3>
            <p style={{ lineHeight: 1.8 }}>We will be in touch within one business day.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reveal d4" style={{ display: 'grid', gap: 22 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
              <div>
                <label style={labelStyle}>First Name *</label>
                <input required style={inputStyle} name="firstName" />
              </div>
              <div>
                <label style={labelStyle}>Last Name *</label>
                <input required style={inputStyle} name="lastName" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input required type="email" style={inputStyle} name="email" />
              </div>
              <div>
                <label style={labelStyle}>Phone / WhatsApp *</label>
                <input required type="tel" style={inputStyle} name="phone" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 22 }}>
              <div>
                <label style={labelStyle}>Matter Type *</label>
                <select required style={inputStyle} name="matterType" defaultValue="">
                  <option value="" disabled>
                    Select…
                  </option>
                  {MATTER_TYPES.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Province *</label>
                <select required style={inputStyle} name="province" defaultValue="">
                  <option value="" disabled>
                    Select…
                  </option>
                  {PROVINCES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Monthly Household Income (optional)</label>
              <select style={inputStyle} name="income" defaultValue="Prefer not to say">
                {INCOME_BRACKETS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 6 }}>
                Helps scope a realistic plan — never shared.
              </p>
            </div>
            <div>
              <label style={labelStyle}>Brief Description of Your Matter *</label>
              <textarea required rows={5} style={{ ...inputStyle, resize: 'vertical' }} name="description" />
            </div>
            <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', lineHeight: 1.6 }}>
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ marginTop: 4, accentColor: 'var(--copper)', width: 18, height: 18, flexShrink: 0 }}
              />
              <span style={{ fontSize: '0.92rem' }}>
                I consent to Van Wyk Family Law Advisory collecting and processing my personal information for the
                purpose of responding to my enquiry, in accordance with the{' '}
                <a href="#/privacy" style={{ color: 'var(--copper)', textDecoration: 'underline' }}>
                  Privacy Policy
                </a>
                . *
              </span>
            </label>
            <div>
              <button
                type="submit"
                className="btn-copper"
                disabled={!consent || status === 'sending'}
                style={{ opacity: consent ? 1 : 0.55 }}
              >
                {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
              </button>
              {status === 'error' && (
                <p style={{ color: '#a33', marginTop: 12, lineHeight: 1.6 }}>
                  Something went wrong sending your enquiry. Please try again, or message us directly on WhatsApp
                  at {CONTACT.whatsappDisplay}.
                </p>
              )}
            </div>
          </form>
        )}

        <div className="reveal d5" style={{ marginTop: 50, display: 'flex', flexWrap: 'wrap', gap: 30 }}>
          <div>
            <p style={{ fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--copper)', fontWeight: 600 }}>
              Email
            </p>
            <a href={`mailto:${CONTACT.email}`} className="serif" style={{ fontSize: '1.2rem', color: 'var(--forest)' }}>
              {CONTACT.email}
            </a>
          </div>
          <div>
            <p style={{ fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--copper)', fontWeight: 600 }}>
              WhatsApp
            </p>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="serif"
              style={{ fontSize: '1.2rem', color: 'var(--forest)' }}
            >
              {CONTACT.whatsappDisplay}
            </a>
          </div>
          <div>
            <p style={{ fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--copper)', fontWeight: 600 }}>
              Coverage
            </p>
            <p className="serif" style={{ fontSize: '1.2rem', color: 'var(--forest)' }}>
              All nine provinces — online & telephonic
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

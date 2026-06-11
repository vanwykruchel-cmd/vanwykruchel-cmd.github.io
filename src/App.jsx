import { useEffect, useRef, useState } from 'react';
import VWLogo from './components/VWLogo';
import {
  GapSection,
  HowSection,
  ServicesSection,
  ScopeSection,
  AboutSection,
  FAQSection,
  ContactSection,
} from './components/HomeSections';
import { PrivacyPage, TermsPage } from './components/LegalPages';
import PracticeApp from './practice/PracticeApp';
import { CONTACT, DISCLAIMER } from './constants/data';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'How It Works', href: '#how' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
];

function Nav({ scrolled, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(247,243,236,0.96)' : 'transparent',
        boxShadow: scrolled ? '0 2px 24px rgba(20,26,21,0.08)' : 'none',
        transition: 'background 0.4s, box-shadow 0.4s',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <a
          href="#/"
          onClick={() => {
            setMenuOpen(false);
            onNavigate('top');
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 12 }}
        >
          <VWLogo size={46} showText={false} />
          <div>
            <div
              className="serif"
              style={{
                fontWeight: 700,
                fontSize: '1.1rem',
                letterSpacing: '0.16em',
                color: 'var(--forest)',
              }}
            >
              VAN WYK
            </div>
            <div
              style={{
                fontSize: '0.58rem',
                letterSpacing: '0.3em',
                color: 'var(--copper)',
                fontWeight: 600,
              }}
            >
              FAMILY LAW ADVISORY
            </div>
          </div>
        </a>

        {/* desktop links */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={`#/${l.href}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(l.href.slice(1));
              }}
              style={{
                fontSize: '0.82rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: 'var(--forest)',
              }}
            >
              {l.label}
            </a>
          ))}
          <button
            className="btn-copper"
            style={{ padding: '11px 24px', fontSize: '0.75rem' }}
            onClick={() => onNavigate('contact')}
          >
            Book a Consultation
          </button>
        </div>

        {/* mobile hamburger */}
        <button
          className="nav-burger"
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            flexDirection: 'column',
            gap: 5,
            padding: 8,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 24,
                height: 2,
                background: 'var(--forest)',
                display: 'block',
                transition: 'transform 0.3s, opacity 0.3s',
                transform: menuOpen
                  ? i === 0
                    ? 'translateY(7px) rotate(45deg)'
                    : i === 2
                      ? 'translateY(-7px) rotate(-45deg)'
                      : 'none'
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {menuOpen && (
        <div
          style={{
            background: 'var(--cream)',
            borderTop: '1px solid var(--creamdark)',
            padding: '18px 24px 28px',
            display: 'grid',
            gap: 18,
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={`#/${l.href}`}
              onClick={(e) => {
                e.preventDefault();
                setMenuOpen(false);
                onNavigate(l.href.slice(1));
              }}
              style={{
                fontSize: '0.95rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: 'var(--forest)',
                padding: '6px 0',
              }}
            >
              {l.label}
            </a>
          ))}
          <button
            className="btn-copper"
            onClick={() => {
              setMenuOpen(false);
              onNavigate('contact');
            }}
          >
            Book a Consultation
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 880px) {
          .nav-desktop { display: none !important; }
          .nav-burger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

function Leaf({ top, left, right, delay, duration, size = 16 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={{
        position: 'absolute',
        top,
        left,
        right,
        opacity: 0.3,
        animation: `leafDrift ${duration}s ease-in-out ${delay}s infinite alternate`,
      }}
      aria-hidden="true"
    >
      <path
        d="M12 2 C18 6 20 14 12 22 C4 14 6 6 12 2 Z M12 6 L12 18"
        stroke="#c98a65"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeroLogo() {
  const [usePng, setUsePng] = useState(true);
  if (usePng) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}logo.png`}
        alt="Van Wyk Family Law Advisory"
        onError={() => setUsePng(false)}
        style={{
          width: 'min(460px, 82vw)',
          mixBlendMode: 'multiply',
          animation: 'fadeUp 1.4s ease both',
        }}
      />
    );
  }
  return <VWLogo size={170} draw />;
}

function Hero({ scrollY, onNavigate }) {
  return (
    <header
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 38%, var(--white) 0%, var(--cream) 55%, var(--creamdark) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <Leaf top="18%" left="12%" delay={0} duration={9} size={18} />
      <Leaf top="30%" right="14%" delay={2} duration={11} size={14} />
      <Leaf top="62%" left="20%" delay={4} duration={10} size={12} />
      <Leaf top="55%" right="22%" delay={1} duration={12} size={16} />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '110px 24px 80px',
          maxWidth: 880,
          transform: `translateY(${scrollY * 0.3}px)`,
          opacity: Math.max(0, 1 - scrollY / 520),
        }}
      >
        <HeroLogo />
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            lineHeight: 1.12,
            marginTop: 26,
            animation: 'fadeUp 1s ease 1.1s both',
          }}
        >
          Family law guidance for the people the system forgot.
        </h1>
        <p
          style={{
            color: 'var(--mid)',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            lineHeight: 1.8,
            maxWidth: 640,
            margin: '24px auto 0',
            animation: 'fadeUp 1s ease 1.5s both',
          }}
        >
          Specialist divorce, maintenance, children's court and protection order guidance â€” online, nationwide,
          at a fixed fee you agree to in writing before any work begins.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: 36,
            animation: 'fadeUp 1s ease 1.9s both',
          }}
        >
          <button className="btn-copper" onClick={() => onNavigate('contact')}>
            Book a Consultation
          </button>
          <button className="btn-outline-dark" onClick={() => onNavigate('services')}>
            Explore Services
          </button>
        </div>
        <p
          style={{
            color: 'var(--muted)',
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            marginTop: 42,
            animation: 'fadeUp 1s ease 2.3s both',
          }}
        >
          Family Law Consultant (LLB, UNISA) Â· Legal consultancy â€” not a law firm Â· All nine provinces
        </p>
      </div>
    </header>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer style={{ background: 'var(--dark)', padding: '70px 0 40px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 44,
            paddingBottom: 50,
            borderBottom: '1px solid rgba(247,243,236,0.12)',
          }}
        >
          <div>
            <VWLogo size={80} light />
            <p style={{ color: 'rgba(247,243,236,0.6)', lineHeight: 1.75, marginTop: 16, fontSize: '0.92rem' }}>
              Specialist family law guidance, document preparation and court coaching. Online and telephonic â€”
              nationwide.
            </p>
          </div>
          <div>
            <p style={{ color: 'var(--copper)', fontSize: '0.78rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 18 }}>
              Navigate
            </p>
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={`#/${l.href}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(l.href.slice(1));
                }}
                style={{ display: 'block', color: 'rgba(247,243,236,0.7)', padding: '6px 0', fontSize: '0.92rem' }}
              >
                {l.label}
              </a>
            ))}
            <a href="#/privacy" style={{ display: 'block', color: 'rgba(247,243,236,0.7)', padding: '6px 0', fontSize: '0.92rem' }}>
              Privacy Policy
            </a>
            <a href="#/terms" style={{ display: 'block', color: 'rgba(247,243,236,0.7)', padding: '6px 0', fontSize: '0.92rem' }}>
              Terms of Service
            </a>
          </div>
          <div>
            <p style={{ color: 'var(--copper)', fontSize: '0.78rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 18 }}>
              Contact
            </p>
            <a href={`mailto:${CONTACT.email}`} style={{ display: 'block', color: 'rgba(247,243,236,0.7)', padding: '6px 0', fontSize: '0.92rem' }}>
              {CONTACT.email}
            </a>
            <p style={{ color: 'rgba(247,243,236,0.7)', padding: '6px 0', fontSize: '0.92rem' }}>
              EFT only â€” no online payment
            </p>
            <p style={{ color: 'rgba(247,243,236,0.7)', padding: '6px 0', fontSize: '0.92rem' }}>
              All nine provinces of South Africa
            </p>
          </div>
        </div>
        <p style={{ color: 'rgba(247,243,236,0.45)', fontSize: '0.8rem', lineHeight: 1.8, marginTop: 36 }}>
          {DISCLAIMER}
        </p>
        <p style={{ color: 'rgba(247,243,236,0.35)', fontSize: '0.78rem', marginTop: 24 }}>
          Â© {new Date().getFullYear()} Van Wyk Family Law Advisory. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${CONTACT.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      style={{
        position: 'fixed',
        bottom: 26,
        right: 26,
        zIndex: 60,
        width: 58,
        height: 58,
        borderRadius: '50%',
        background: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 28px rgba(20,26,21,0.3)',
        transition: 'transform 0.3s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [route]);

  function navigate(sectionId) {
    if (window.location.hash.startsWith('#/privacy') || window.location.hash.startsWith('#/terms')) {
      window.location.hash = '#/';
      setTimeout(() => scrollToSection(sectionId), 80);
    } else {
      scrollToSection(sectionId);
    }
  }

  function scrollToSection(id) {
    if (id === 'top') {
      containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const isPrivacy = route.startsWith('#/privacy');
  const isTerms = route.startsWith('#/terms');
  const isPractice = route.startsWith('#/practice');
  const scrolled = scrollY > 50 || isPrivacy || isTerms || isPractice;

  if (isPractice) {
    return (
      <div style={{ height: '100vh', overflowY: 'auto' }}>
        <PracticeApp />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
      style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}
    >
      <Nav scrolled={scrolled} onNavigate={navigate} />
      {isPrivacy ? (
        <PrivacyPage />
      ) : isTerms ? (
        <TermsPage />
      ) : (
        <>
          <Hero scrollY={scrollY} onNavigate={navigate} />
          <GapSection />
          <HowSection />
          <ServicesSection />
          <ScopeSection />
          <AboutSection />
          <FAQSection />
          <ContactSection />
        </>
      )}
      <Footer onNavigate={navigate} />
      <WhatsAppFloat />
    </div>
  );
}

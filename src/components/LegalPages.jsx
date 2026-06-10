import { CONTACT } from '../constants/data';

function LegalShell({ title, children }) {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingTop: 130, paddingBottom: 100 }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 24px' }}>
        <p className="eyebrow">Van Wyk Family Law Advisory</p>
        <h1 className="section-title">{title}</h1>
        <div style={{ display: 'grid', gap: 26, lineHeight: 1.85, marginTop: 30 }}>{children}</div>
        <a href="#/" className="btn-copper" style={{ marginTop: 50 }}>
          Back to Home
        </a>
      </div>
    </div>
  );
}

const H = ({ children }) => (
  <h2 className="serif" style={{ fontSize: '1.5rem', marginTop: 14 }}>
    {children}
  </h2>
);

export function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <p>
        This Privacy Policy explains how Van Wyk Family Law Advisory collects, uses, stores and protects your
        personal information, in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA).
      </p>
      <H>Who we are</H>
      <p>
        The responsible party is Van Wyk Family Law Advisory, operated by a Family Law Consultant (LLB, University
        of South Africa). The operator is registered as an Information Officer with the South African Information
        Regulator. For any data query, contact {CONTACT.email}.
      </p>
      <H>What we collect</H>
      <p>
        Through the enquiry form on this website we collect: your name, contact details (email and phone number),
        province, the type of matter you are enquiring about, an optional household income range, and any details
        of your legal matter that you choose to share voluntarily.
      </p>
      <H>Why we collect it</H>
      <p>
        Your information is used solely to respond to your enquiry, to provide advisory services if you engage the
        practice, and for billing. Nothing more.
      </p>
      <H>Legal basis</H>
      <p>
        Processing is based on your consent, given through the consent checkbox on the enquiry form. You may
        withdraw consent at any time by writing to {CONTACT.email}.
      </p>
      <H>How it is stored</H>
      <p>Your information is stored securely, password-protected, and encrypted where possible.</p>
      <H>How long we keep it</H>
      <p>
        Personal data is retained for the duration of the engagement plus a reasonable period for record-keeping,
        after which it is deleted or anonymised.
      </p>
      <H>Third parties</H>
      <p>
        Your personal data is never sold. It is never shared with third parties without your written consent,
        except where disclosure is required by law.
      </p>
      <H>Your rights</H>
      <p>
        You have the right to access the personal information we hold about you, to request that it be corrected,
        and to request its deletion. Send any such request to {CONTACT.email}.
      </p>
      <H>Complaints</H>
      <p>
        If you believe your personal information has been mishandled, you may lodge a complaint with the
        Information Regulator of South Africa: inforegulator.org.za.
      </p>
    </LegalShell>
  );
}

export function TermsPage() {
  return (
    <LegalShell title="Terms of Service">
      <H>Nature of the service</H>
      <p>
        Van Wyk Family Law Advisory is a specialist legal consultancy operated by a Family Law Consultant (LLB,
        University of South Africa). It is not a law firm. The operator is not an admitted attorney or advocate
        under the Legal Practice Act 28 of 2014, does not perform reserved legal activities, and does not appear in
        court on behalf of clients.
      </p>
      <H>Scope and limitations</H>
      <p>
        Services include family law guidance, document preparation, process navigation and court coaching for
        self-represented litigants. Where a matter requires the appearance of an admitted attorney or advocate, the
        client will be advised clearly and referred accordingly.
      </p>
      <H>No formal legal opinions</H>
      <p>
        Information and advice provided does not constitute formal legal opinions for use in court proceedings and
        should not be represented as such.
      </p>
      <H>No attorney-client relationship</H>
      <p>No attorney-client relationship is created by use of this website or by any consultation.</p>
      <H>Payment terms</H>
      <p>
        All fees are fixed and agreed in writing before any work begins. Payment is by EFT only, upfront. Banking
        details are provided by email after the intake consultation, together with the written quote. No payment is
        processed on this website.
      </p>
      <H>Cancellation policy</H>
      <p>
        Consultations cancelled with less than 24 hours' notice are not refunded. Consultations cancelled with more
        than 24 hours' notice receive a full credit toward a rescheduled session.
      </p>
      <H>Liability</H>
      <p>
        Liability is limited to the extent permitted by the Consumer Protection Act 68 of 2008. Liability for gross
        negligence or fraud is not excluded.
      </p>
      <H>Governing law and disputes</H>
      <p>
        These terms are governed by South African law. Disputes should be directed in the first instance to the
        National Consumer Commission.
      </p>
    </LegalShell>
  );
}

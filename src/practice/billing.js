/*
 * Billing engine for the Practice Manager — business-only (no trust account).
 *
 * The flow mirrors LexPro, simplified for a Family Law Consultant:
 *   record work (fees & time)  ->  bill it on a Tax Invoice  ->  receive payment
 *   ->  the Account Statement shows charges - receipts = balance outstanding.
 *
 * Everything is stored in this browser's localStorage via PracticeApp.
 */

import { round2 } from './ui';

/* The kinds of work you can record against a file. */
export const FEE_TYPES = [
  { key: 'time', label: 'Time / attendance', unit: 'hours', rateKey: 'hourlyRate', hint: 'Consultations, drafting, phone calls — entered in hours (e.g. 1.5).' },
  { key: 'unit', label: 'Time units (6 min)', unit: 'units', rateKey: 'unitRate', hint: 'Per 6-minute unit, the attorney-style way of charging time.' },
  { key: 'page', label: 'Per page', unit: 'pages', rateKey: 'perPageRate', hint: 'Drafting / copies charged per page.' },
  { key: 'travel', label: 'Travel', unit: 'km', rateKey: 'travelRate', hint: 'Mileage to court or meetings, charged per kilometre.' },
  { key: 'fixed', label: 'Fixed fee', unit: '', rateKey: null, hint: 'A set fee you agreed, e.g. a quoted document pack.' },
  { key: 'disb', label: 'Disbursement / cost', unit: '', rateKey: null, hint: 'Money paid out on the client’s behalf — sheriff, court, courier.' },
];

export const FEE_TYPE = Object.fromEntries(FEE_TYPES.map((t) => [t.key, t]));

export const PAYMENT_METHODS = ['EFT', 'Cash', 'Card', 'Other'];

/* Default rates / VAT settings, merged into settings on load. */
export const DEFAULT_RATES = {
  hourlyRate: 750,
  unitRate: 75,
  perPageRate: 12,
  travelRate: 5,
  vatEnabled: false,
  vatRate: 15,
  vatNumber: '',
};

/* Amount for a single fee line = quantity x rate, rounded to cents.
 * Fixed fees and disbursements keep whatever amount was typed. */
export function lineAmount(entry) {
  if (entry.type === 'fixed' || entry.type === 'disb') return round2(entry.amount || 0);
  return round2((Number(entry.qty) || 0) * (Number(entry.rate) || 0));
}

/* Default rate for a fee type, pulled from settings. */
export function rateFor(typeKey, settings) {
  const t = FEE_TYPE[typeKey];
  if (!t || !t.rateKey) return 0;
  return Number(settings?.[t.rateKey]) || 0;
}

/* ---- Per-file money helpers (a "file" is a client object) ---- */

export const feesOf = (client) => client.fees || [];
export const paymentsOf = (client) => client.payments || [];
export const invoicesOf = (client, data) => (data.invoices || []).filter((i) => i.clientId === client.id);

/* Work recorded but not yet placed on an invoice. */
export const unbilledFees = (client) => feesOf(client).filter((f) => !f.invoiceId);
export const unbilledTotal = (client) => round2(unbilledFees(client).reduce((s, f) => s + lineAmount(f), 0));

/* The debtor account: what has been invoiced, what has been paid, the balance. */
export function account(client, data) {
  const charges = round2(invoicesOf(client, data).reduce((s, i) => s + (i.total || 0), 0));
  const receipts = round2(paymentsOf(client).reduce((s, p) => s + (Number(p.amount) || 0), 0));
  return { charges, receipts, balance: round2(charges - receipts) };
}

/* VAT breakdown for a list of invoice lines. */
export function invoiceTotals(lines, settings) {
  const subtotal = round2(lines.reduce((s, l) => s + (Number(l.amount) || 0), 0));
  const vat = settings?.vatEnabled ? round2(subtotal * (Number(settings.vatRate) || 0) / 100) : 0;
  return { subtotal, vat, total: round2(subtotal + vat) };
}

/* Sequential reference helpers. We keep counters on the data object so numbers
 * never reuse, even after something is deleted. */
export function nextInvoiceNumber(data) {
  const year = new Date().getFullYear();
  const seq = (data.invoiceSeq || 0) + 1;
  return { number: `INV-${year}-${String(seq).padStart(3, '0')}`, seq };
}

export function nextFileRef(data, prefix = 'VW') {
  const seq = (data.fileSeq || 0) + 1;
  return { ref: `${prefix}-${String(seq).padStart(3, '0')}`, seq };
}

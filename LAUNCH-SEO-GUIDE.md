# Soft Launch & Google Guide — Van Wyk Family Law Advisory

Everything below is written so you can do it yourself, step by step. Do the parts in order.
When you finish the DNS step, tell me and I'll flip the site over to your domain in a couple of minutes.

---

## What is already done ✅

- New email everywhere on the site: **vwfamilylawadvisory@gmail.com**
- Phone & WhatsApp removed (we'll add a number later)
- Clear "affordable alternative to attorney fees" messaging on the home page
- A new **Insights** blog with your first article: *What a Maintenance Officer Does — and Your Rights at the First Court Date* (fully referenced, with a "Book a consultation" call-to-action and room for photos)
- Full **SEO** set up: search-friendly titles & descriptions, social-share previews, Google "structured data", a `sitemap.xml`, and `robots.txt`
- Each article becomes its **own real web page** so Google can find and rank it

The upgraded site is **live right now** at your current address so you can share it today.

---

## Step 1 — Turn on your contact form (2 minutes, do this first)

The contact form emails enquiries to **vwfamilylawadvisory@gmail.com** using a free service (FormSubmit).
The very first time someone sends an enquiry, FormSubmit emails *that Gmail* asking you to confirm — **once**.

- Send yourself a test enquiry from the website's contact form.
- Open the Gmail inbox, find the "Confirm your email" message from FormSubmit, click the link.
- After that, every enquiry arrives in your inbox automatically. (Check the Spam folder for the first one.)

---

## Step 2 — Connect your domain (vwfamilylawadvisory.com)

You bought the domain from a registrar (e.g. Afrihost, GoDaddy, domains.co.za). Log in there and open the
**DNS** settings for vwfamilylawadvisory.com. Add these records exactly:

**Four A records** (Type: A, Host/Name: `@`):
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**One CNAME record** for the www version (Type: CNAME, Host/Name: `www`, Value/Target):
```
vanwykruchel-cmd.github.io
```

Save. DNS usually takes 1–3 hours (sometimes up to a day) to take effect.

> When you've added these, **message me** and I'll switch the site onto your domain and turn on the padlock (HTTPS).
> I keep this as a separate step on purpose — see Step 3 for why.

---

## Step 3 — Protect your Practice Manager data BEFORE the domain switch (important)

Your private **Practice Manager** (clients, invoices, court documents) is saved inside *this browser, on this
web address*. When the site moves to vwfamilylawadvisory.com, that is technically a new address, so your saved
data needs to be carried across **once**. It's easy:

1. **Before** the switch: open the site → Practice Manager → **Settings → Download Backup**. Save the file
   (OneDrive is perfect).
2. After I switch the domain: open the site at **vwfamilylawadvisory.com** → Practice Manager → **Settings →
   Restore from Backup**, and choose that file.

That's it — everything reappears. (If you haven't used the Practice Manager with real client data yet, you can
skip this.)

---

## Step 4 — Get on Google (after the domain is live)

### 4a. Google Search Console (tells Google your site exists)
1. Go to **search.google.com/search-console** and sign in with your Google account.
2. Choose **URL prefix**, enter `https://vwfamilylawadvisory.com`, and verify (the easiest method is usually
   adding a TXT record at your registrar — Google shows you exactly what).
3. Once verified, open **Sitemaps** and submit: `sitemap.xml`
4. This is how Google discovers your home page and every article. Re-submit whenever we add new articles.

### 4b. Google Business Profile (the panel that appears on the right in Google)
This is the "striking Google listing" you asked about. It's free.
1. Go to **business.google.com** and click **Manage now**.
2. Business name: **Van Wyk Family Law Advisory**
3. Category: **Legal services** (you can add "Family law attorney" is NOT appropriate — use "Legal services"
   or "Consultant"). Keep it consistent with the site: a legal *consultancy*, not a law firm.
4. Because you work online/nationwide and don't want to show a street address, choose **"I deliver goods and
   services to my customers"** (a *service-area business*) and set your service area to the provinces you cover.
5. Add the website (vwfamilylawadvisory.com), the email, your hours, and a short description (you can reuse the
   home-page wording).
6. **Verification:** Google will ask to verify you (by video, phone, or postcard). A phone number helps here —
   this is a good reason to add the business number once you have it.
7. After approval, add a few photos and post your first article link as an update.

> Tip: the more your website and your Business Profile say the *same* things (name, services, area), the more
> Google trusts and shows you.

---

## Step 5 — Keep adding articles (this is what grows your Google traffic)

Every good article is another page that can rank when someone searches that topic. The more genuinely helpful
articles, the more often you appear.

**To publish a new article, send me:**
- A title and the topic
- The text (headings + paragraphs are fine)
- Any **photos** you want in it (just attach them)
- The **sources** you used (links) — we always reference sources

I'll format it, add it to the Insights page, and redeploy. (Technically: articles live in
`src/content/articles.js`; photos go in `public/articles/<slug>/`.)

**Good next topics** (high-search, ranking-friendly):
- How to apply for a divorce in South Africa without an attorney
- Rule 43 vs Rule 58: getting interim maintenance during a divorce
- What a parenting plan must include (Children's Act)
- How to get a protection order — and what it can and can't do
- What "in community of property" really means when you divorce

---

## Quick reference

| Thing | Value |
|---|---|
| Domain | vwfamilylawadvisory.com |
| Email | vwfamilylawadvisory@gmail.com |
| Current (pre-switch) address | vanwykruchel-cmd.github.io |
| Sitemap (after go-live) | https://vwfamilylawadvisory.com/sitemap.xml |
| Blog index | https://vwfamilylawadvisory.com/articles/ |
| First article | /articles/maintenance-officer-south-africa-first-court-date/ |

Compliance reminder: the site is careful never to call you an attorney or a law firm — you are a **Family Law
Consultant**, offering an affordable alternative. Keep that wording in anything you add.

/*
 * Static blog generator. Runs after `vite build`.
 *
 * For every article it writes a real, crawlable HTML page at
 *   dist/articles/<slug>/index.html
 * plus a blog index at dist/articles/index.html and a dist/sitemap.xml.
 *
 * These pages carry full SEO meta + JSON-LD and the article text as real HTML,
 * so Google can index each article as its own page (hash routes cannot rank).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ARTICLES } from '../src/content/articles.js';
import { bodyHtml, sourcesHtml, excerpt, formatDate, esc } from '../src/content/renderArticle.js';
import { SITE } from '../src/constants/site.js';
import { DISCLAIMER } from '../src/constants/data.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const u = (p) => `${SITE.url}${p}`;

const FONTS = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Raleway:wght@300;400;500;600;700&display=swap';

const CSS = `
  :root{--forest:#2D4A3E;--dark:#1d3228;--cream:#F7F3EC;--creamdark:#ede8df;--copper:#B5714A;--mid:#4a4a47;--muted:#8a8a82;--white:#FEFCF8}
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Raleway',sans-serif;color:var(--mid);background:var(--cream);-webkit-font-smoothing:antialiased;line-height:1.75}
  a{color:var(--copper);text-decoration:none}a:hover{text-decoration:underline}
  .bar{position:sticky;top:0;z-index:10;background:rgba(247,243,236,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--creamdark)}
  .bar-in{max-width:1080px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px}
  .brand{font-family:'Cormorant Garamond',serif;font-weight:700;letter-spacing:.16em;color:var(--forest);font-size:1.05rem}
  .brand small{display:block;font-family:'Raleway';font-size:.55rem;letter-spacing:.3em;color:var(--copper);font-weight:600}
  .btn{display:inline-block;background:var(--copper);color:#fff;padding:11px 22px;border-radius:3px;font-size:.78rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase}
  .btn:hover{background:#c98a65;text-decoration:none}
  main{max-width:720px;margin:0 auto;padding:46px 24px 30px}
  .crumb{font-size:.8rem;color:var(--muted);margin-bottom:20px}
  .eyebrow{font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;color:var(--copper);font-weight:600}
  h1{font-family:'Cormorant Garamond',serif;color:var(--forest);font-size:clamp(2rem,4.5vw,3rem);line-height:1.12;margin:10px 0 16px;font-weight:700}
  .lede{font-size:1.12rem;color:var(--mid);margin-bottom:8px}
  article h2{font-family:'Cormorant Garamond',serif;color:var(--forest);font-size:1.7rem;margin:34px 0 12px;font-weight:600}
  article h3{font-family:'Cormorant Garamond',serif;color:var(--forest);font-size:1.3rem;margin:24px 0 8px}
  article p{margin:0 0 16px}
  article ul,article ol{margin:0 0 18px 22px}article li{margin:0 0 9px}
  main figure{margin:26px 0}
  main img{display:block;width:100%;height:auto;max-height:360px;object-fit:cover;border-radius:6px;border:1px solid var(--creamdark)}
  main figcaption{font-size:.85rem;color:var(--muted);margin-top:8px;text-align:center}
  blockquote{border-left:3px solid var(--copper);background:var(--white);padding:14px 20px;margin:22px 0;font-style:italic}
  blockquote cite{display:block;font-style:normal;font-size:.85rem;color:var(--muted);margin-top:6px}
  .callout{background:var(--white);border:1px solid var(--creamdark);border-left:4px solid var(--copper);border-radius:6px;padding:20px 24px;margin:26px 0}
  .callout-title{font-family:'Cormorant Garamond',serif;color:var(--forest);font-size:1.25rem;font-weight:700;margin-bottom:6px}
  .sources{margin-top:40px;padding-top:24px;border-top:1px solid var(--creamdark)}
  .sources h2{font-family:'Cormorant Garamond',serif;color:var(--forest);font-size:1.4rem;margin-bottom:12px}
  .sources ol{margin-left:20px}.sources li{margin-bottom:8px;font-size:.92rem;word-break:break-word}
  .cta{background:var(--forest);color:var(--cream);border-radius:8px;padding:34px 32px;margin:40px 0 10px;text-align:center}
  .cta h2{font-family:'Cormorant Garamond',serif;color:#fff;font-size:1.7rem;margin-bottom:10px}
  .cta p{color:rgba(247,243,236,.85);max-width:520px;margin:0 auto 18px}
  footer{background:var(--dark);color:rgba(247,243,236,.6);font-size:.82rem;line-height:1.8}
  footer .f{max-width:1080px;margin:0 auto;padding:40px 24px}
  footer a{color:rgba(247,243,236,.8)}
  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px;margin-top:30px}
  .card{display:block;background:var(--white);border:1px solid var(--creamdark);border-top:3px solid var(--copper);border-radius:6px;padding:26px 24px;color:inherit}
  .card:hover{text-decoration:none;transform:translateY(-2px);transition:transform .2s}
  .card h2{font-family:'Cormorant Garamond',serif;color:var(--forest);font-size:1.35rem;margin:10px 0 8px;line-height:1.25}
  .meta{font-size:.78rem;color:var(--muted)}
`;

function shell({ title, description, canonical, ogImage, headExtra = '', body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="theme-color" content="#2D4A3E"/>
<link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}"/>
<link rel="canonical" href="${canonical}"/>
<meta name="robots" content="index, follow"/>
<meta property="og:type" content="article"/>
<meta property="og:site_name" content="${esc(SITE.name)}"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:locale" content="en_ZA"/>
<meta property="og:image" content="${ogImage}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:description" content="${esc(description)}"/>
<meta name="twitter:image" content="${ogImage}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="${FONTS}" rel="stylesheet"/>
<style>${CSS}</style>
${headExtra}
</head>
<body>
<div class="bar"><div class="bar-in">
  <a href="/" style="color:inherit"><span class="brand">VAN WYK<small>FAMILY LAW ADVISORY</small></span></a>
  <a class="btn" href="/#contact">Book a Consultation</a>
</div></div>
${body}
<footer><div class="f">
  <p style="margin-bottom:14px"><a href="/">← Back to the main site</a> &nbsp;·&nbsp; <a href="/articles/">All articles</a></p>
  <p style="margin-bottom:14px">${esc(DISCLAIMER)}</p>
  <p>© ${new Date().getFullYear()} ${esc(SITE.name)}. All rights reserved.</p>
</div></footer>
</body>
</html>`;
}

const ctaBlock = `
<section class="cta">
  <h2>Talk it through before you act</h2>
  <p>Book a fixed-fee consultation to discuss your own situation. Clear advice and a complete, organised file — an affordable alternative to high attorney fees.</p>
  <a class="btn" href="/#contact">Book a consultation</a>
</section>`;

function articlePage(a) {
  const canonical = u(`/articles/${a.slug}/`);
  const ogImage = a.hero ? u(a.hero.src) : u('/logo.jpg');
  const hero = a.hero
    ? `<figure><img src="${esc(a.hero.src)}" alt="${esc(a.hero.alt || '')}"/>${a.hero.caption ? `<figcaption>${esc(a.hero.caption)}</figcaption>` : ''}</figure>`
    : '';
  const ld = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: a.title, description: a.description,
    datePublished: a.date, dateModified: a.updated || a.date,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: u('/logo.jpg') } },
    mainEntityOfPage: canonical, image: ogImage, keywords: (a.keywords || []).join(', '),
  };
  const crumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: u('/') },
      { '@type': 'ListItem', position: 2, name: 'Insights', item: u('/articles/') },
      { '@type': 'ListItem', position: 3, name: a.title, item: canonical },
    ],
  };
  const headExtra =
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n` +
    `<script type="application/ld+json">${JSON.stringify(crumbLd)}</script>`;

  const body = `
<main>
  <p class="crumb"><a href="/">Home</a> › <a href="/articles/">Insights</a> › ${esc(a.category)}</p>
  <p class="eyebrow">${esc(a.category)} · ${formatDate(a.date)}${a.readingMinutes ? ` · ${a.readingMinutes} min read` : ''}</p>
  <h1>${esc(a.title)}</h1>
  <p class="lede">${esc(a.description)}</p>
  ${hero}
  <article>
    ${bodyHtml(a)}
    ${sourcesHtml(a)}
  </article>
  ${ctaBlock}
</main>`;

  return shell({ title: `${a.title} | ${SITE.name}`, description: a.description, canonical, ogImage, headExtra, body });
}

function indexPage(list) {
  const canonical = u('/articles/');
  const cards = list.map((a) => `
    <a class="card" href="/articles/${a.slug}/">
      <p class="meta">${esc(a.category)} · ${formatDate(a.date)}</p>
      <h2>${esc(a.title)}</h2>
      <p>${esc(excerpt(a, 150))}</p>
      <span style="display:inline-block;margin-top:14px;color:var(--copper);font-weight:600;font-size:.85rem">Read the article →</span>
    </a>`).join('');
  const body = `
<main style="max-width:1080px">
  <p class="crumb"><a href="/">Home</a> › Insights</p>
  <p class="eyebrow">Insights &amp; Articles</p>
  <h1>Family law, in plain language</h1>
  <p class="lede" style="max-width:640px">Guides to South African family law — written so you understand your rights and the process before you ever set foot in court.</p>
  <div class="cards">${cards}</div>
  ${ctaBlock}
</main>`;
  return shell({
    title: `Insights & Articles | ${SITE.name}`,
    description: 'Plain-English guides to South African family law — divorce, maintenance, children’s court and protection orders.',
    canonical, ogImage: u('/logo.jpg'), body,
  });
}

function sitemap(list) {
  const urls = [
    { loc: u('/'), pri: '1.0' },
    { loc: u('/articles/'), pri: '0.8' },
    ...list.map((a) => ({ loc: u(`/articles/${a.slug}/`), pri: '0.7', lastmod: a.updated || a.date })),
  ];
  const body = urls.map((x) =>
    `  <url><loc>${x.loc}</loc>${x.lastmod ? `<lastmod>${x.lastmod}</lastmod>` : ''}<priority>${x.pri}</priority></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function write(rel, content) {
  const full = resolve(dist, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
  return rel;
}

const sorted = [...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1));
const written = [];
for (const a of sorted) written.push(write(`articles/${a.slug}/index.html`, articlePage(a)));
written.push(write('articles/index.html', indexPage(sorted)));
written.push(write('sitemap.xml', sitemap(sorted)));

console.log(`[prerender] generated ${written.length} files:`);
written.forEach((f) => console.log('  dist/' + f));

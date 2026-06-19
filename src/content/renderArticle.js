/*
 * Framework-free article renderer. Turns an article's block list into an HTML
 * string. Used by BOTH the in-app Insights list (for excerpts) and the static
 * blog generator (scripts/prerender.mjs) so there is one source of truth.
 *
 * Supported blocks:
 *   { type: 'p',  text }                      paragraph (inline **bold** + [links](url))
 *   { type: 'h2'|'h3', text }                 sub-heading
 *   { type: 'ul'|'ol', items: [] }            list
 *   { type: 'callout', title, text }          highlighted box (key rights / warnings)
 *   { type: 'quote', text, cite }             pull-quote
 *   { type: 'image', src, alt, caption }      figure (this is how photos are added)
 */

export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* Apply tiny inline markdown AFTER escaping: **bold** and [text](url). */
export function inline(s) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, t, u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a>`);
}

function block(b) {
  switch (b.type) {
    case 'h2': return `<h2>${inline(b.text)}</h2>`;
    case 'h3': return `<h3>${inline(b.text)}</h3>`;
    case 'p': return `<p>${inline(b.text)}</p>`;
    case 'ul': return `<ul>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`;
    case 'ol': return `<ol>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ol>`;
    case 'quote': return `<blockquote><p>${inline(b.text)}</p>${b.cite ? `<cite>${inline(b.cite)}</cite>` : ''}</blockquote>`;
    case 'callout':
      return `<aside class="callout">${b.title ? `<p class="callout-title">${inline(b.title)}</p>` : ''}<p>${inline(b.text)}</p></aside>`;
    case 'image':
      return `<figure><img src="${esc(b.src)}" alt="${esc(b.alt || '')}" loading="lazy" />${b.caption ? `<figcaption>${inline(b.caption)}</figcaption>` : ''}</figure>`;
    default: return '';
  }
}

export function bodyHtml(article) {
  return (article.blocks || []).map(block).join('\n');
}

export function sourcesHtml(article) {
  if (!article.sources || article.sources.length === 0) return '';
  const items = article.sources
    .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>${s.note ? ` — ${esc(s.note)}` : ''}</li>`)
    .join('');
  return `<section class="sources"><h2>Sources &amp; further reading</h2><ol>${items}</ol></section>`;
}

/* Plain-text excerpt for cards / meta descriptions. */
export function excerpt(article, max = 175) {
  if (article.description) return article.description;
  const firstP = (article.blocks || []).find((b) => b.type === 'p');
  const t = firstP ? String(firstP.text).replace(/\*\*|\[|\]\([^)]*\)/g, '') : '';
  return t.length > max ? t.slice(0, max).trim() + '…' : t;
}

export function formatDate(iso) {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return iso; }
}

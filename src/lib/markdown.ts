import DOMPurify from 'dompurify'

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Markdown renderer with XSS sanitization via DOMPurify.
// The text is HTML-escaped first and code is set aside before the other rules run: before,
// a Vue/TS snippet's <template>, <div> or Promise<string> was parsed as HTML and vanished,
// and `*`, `#` or blank lines inside code turned into bold, headings or paragraph breaks.
export function renderMarkdown(text: string): string {
  const stash: string[] = []
  const keep = (html: string) => `\u0000${stash.push(html) - 1}\u0000`

  const html = escapeHtml(text)
    // Code blocks (``` ... ```) and inline code: kept as-is, restored at the end
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code: string) =>
      keep(`<pre class="bg-surface-2 rounded-lg p-4 overflow-x-auto my-4 text-sm"><code>${code}</code></pre>`))
    .replace(/`([^`]+)`/g, (_match, code: string) =>
      keep(`<code class="bg-surface-2 px-1.5 py-0.5 rounded text-brand-light text-sm">${code}</code>`))
    // Headings (order: h3 before h2 before h1 to avoid partial matches)
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    // Bold + italic (order: triple before double/single)
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links — block javascript: URLs
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, url: string) => {
      const safeUrl = /^javascript:/i.test(url) ? '#' : url.replace(/"/g, '%22')
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="text-brand hover:text-brand-light underline">${label}</a>`
    })
    // Paragraph breaks
    .replace(/\n\n/g, '</p><p class="mb-4">')
    // Wrap in paragraph
    .replace(/^/, '<p class="mb-4">')
    .replace(/$/, '</p>')
    // Put the code back
    .replace(/\u0000(\d+)\u0000/g, (_match, index: string) => stash[Number(index)])

  return DOMPurify.sanitize(html)
}

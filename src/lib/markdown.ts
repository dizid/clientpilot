// Minimal markdown renderer for Dev.to articles — no external dependencies
export function renderMarkdown(text: string): string {
  return text
    // Code blocks (``` ... ```)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-surface-2 rounded-lg p-4 overflow-x-auto my-4 text-sm"><code>$2</code></pre>')
    // Headings (order: h3 before h2 before h1 to avoid partial matches)
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    // Bold + italic (order: triple before double/single)
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-surface-2 px-1.5 py-0.5 rounded text-brand-light text-sm">$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-brand hover:text-brand-light underline">$1</a>')
    // Paragraph breaks
    .replace(/\n\n/g, '</p><p class="mb-4">')
    // Wrap in paragraph
    .replace(/^/, '<p class="mb-4">')
    .replace(/$/, '</p>')
}

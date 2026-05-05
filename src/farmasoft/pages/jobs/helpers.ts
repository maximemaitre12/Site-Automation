export function parseProfile(raw: string | null) {
  try { return raw ? JSON.parse(raw) : null } catch { return null }
}

export function parseTags(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : raw.split(',').map(s => s.trim()).filter(Boolean)
  } catch {
    return raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : []
  }
}

// Convert robota.ua HTML strings (<br>, <ul>, <li>, <p>, &nbsp;) to clean text with bullets
export function stripHtmlToText(raw: string | null | undefined): string {
  if (!raw) return ''
  return raw
    .replace(/<\/?(p|div)[^>]*>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?ul[^>]*>/gi, '\n')
    .replace(/<\/?ol[^>]*>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    .replace(/<[^>]+>/g, '')        // strip remaining tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

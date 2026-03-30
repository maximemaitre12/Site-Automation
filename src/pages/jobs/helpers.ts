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

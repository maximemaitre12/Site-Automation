export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'à l\'instant'
  if (minutes < 60) return `il y a ${minutes}min`
  if (hours < 24) return `il y a ${hours}h`
  if (days < 7) return `il y a ${days}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function formatSalary(min: number, max: number, currency = 'UAH'): string {
  if (!min && !max) return 'Salaire non précisé'
  if (!max) return `${min.toLocaleString()} ${currency}`
  return `${min.toLocaleString()}–${max.toLocaleString()} ${currency}`
}

export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

export function getInitialsColor(initials: string): string {
  const colors = [
    'bg-green-900 text-green-300',
    'bg-blue-900 text-blue-300',
    'bg-purple-900 text-purple-300',
    'bg-amber-900 text-amber-300',
    'bg-red-900 text-red-300',
    'bg-teal-900 text-teal-300',
    'bg-pink-900 text-pink-300',
    'bg-indigo-900 text-indigo-300',
  ]
  const code = (initials.charCodeAt(0) || 0) + (initials.charCodeAt(2) || 0)
  return colors[code % colors.length]
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    return true
  }
}

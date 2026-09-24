export function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'blueprint'
}

export function uniqueId(title: string, existing: string[]): string {
  const base = slugify(title)
  if (!existing.includes(base)) return base
  let n = 2
  while (existing.includes(`${base}-${n}`)) n += 1
  return `${base}-${n}`
}

export function safeHttpUrl(value: string): string | null {
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString()
  } catch {
    return null
  }
}

export function repoNameFromUrl(value: string): string | null {
  const url = safeHttpUrl(value)
  if (!url) return null
  const parsed = new URL(url)
  const host = parsed.hostname.replace(/^www\./, '')
  if (host !== 'github.com') return null
  const parts = parsed.pathname.split('/').filter(Boolean)
  if (parts.length < 2) return null
  return parts[1].replace(/\.git$/i, '')
}

export function classifyUrl(value: string): { siteUrl: string; repoUrl: string } {
  const url = safeHttpUrl(value)
  if (!url) return { siteUrl: '', repoUrl: '' }
  const host = new URL(url).hostname.replace(/^www\./, '')
  if (host === 'github.com') return { siteUrl: '', repoUrl: url }
  return { siteUrl: url, repoUrl: '' }
}

export function summarize(text: string, max = 320): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= max) return flat
  return `${flat.slice(0, max - 1).trimEnd()}…`
}

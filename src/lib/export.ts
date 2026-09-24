import type { Blueprint } from '../types'

export function downloadBlueprints(blueprints: Blueprint[]) {
  const clean = blueprints.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    siteUrl: item.siteUrl,
    repoUrl: item.repoUrl,
    tags: item.tags,
    summary: item.summary,
    prompt: item.prompt,
  }))
  const blob = new Blob([`${JSON.stringify(clean, null, 2)}\n`], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'blueprints.json'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

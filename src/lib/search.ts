import Fuse, { type IFuseOptions } from 'fuse.js'
import type { Blueprint } from '../types'

const options: IFuseOptions<Blueprint> = {
  threshold: 0.38,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: 'title', weight: 0.35 },
    { name: 'tags', weight: 0.3 },
    { name: 'summary', weight: 0.2 },
    { name: 'category', weight: 0.15 },
  ],
}

function hasTag(item: Blueprint, tag: string) {
  const needle = tag.toLowerCase()
  return item.tags.some((itemTag) => itemTag.toLowerCase() === needle)
}

export function filterBlueprints(items: Blueprint[], query: string, tags: string[]) {
  const tagged =
    tags.length === 0 ? items : items.filter((item) => tags.every((tag) => hasTag(item, tag)))
  const q = query.trim()
  if (!q) return tagged
  return new Fuse(tagged, options).search(q).map((result) => result.item)
}

export function collectTags(items: Blueprint[]): string[] {
  const tags = new Set<string>()
  for (const item of items) {
    for (const tag of item.tags) tags.add(tag)
  }
  return [...tags].sort((a, b) => a.localeCompare(b))
}

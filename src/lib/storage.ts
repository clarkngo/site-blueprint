import data from '../data/blueprints.json'
import type { Blueprint } from '../types'

const STORAGE_KEY = 'siteblueprint.custom.v1'

function isBlueprint(value: unknown): value is Blueprint {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  const keys = ['id', 'title', 'category', 'siteUrl', 'repoUrl', 'summary', 'prompt']
  if (!keys.every((key) => typeof item[key] === 'string')) return false
  return Array.isArray(item.tags) && item.tags.every((tag) => typeof tag === 'string')
}

function readSeed(): Blueprint[] {
  if (!Array.isArray(data)) return []
  return data.filter(isBlueprint)
}

const seedBlueprints = readSeed()
const seedIds = new Set(seedBlueprints.map((item) => item.id))

function readCustom(): Blueprint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isBlueprint).filter((item) => !seedIds.has(item.id))
  } catch {
    return []
  }
}

export function isLocalBlueprint(id: string) {
  return !seedIds.has(id)
}

export function loadBlueprints(): Blueprint[] {
  return [...readCustom(), ...seedBlueprints]
}

export function saveCustomBlueprints(all: Blueprint[]) {
  try {
    const custom = all.filter((item) => !seedIds.has(item.id))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom))
  } catch {
    // Private mode or a full quota should not break the catalog.
  }
}

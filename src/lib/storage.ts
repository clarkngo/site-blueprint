import data from '../data/blueprints.json'
import type { Blueprint, BlueprintKind, PromptMode } from '../types'

const STORAGE_KEY = 'siteblueprint.custom.v1'

function isPromptMode(value: unknown): value is PromptMode {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    typeof item.label === 'string' &&
    typeof item.prompt === 'string'
  )
}

function isKind(value: unknown): value is BlueprintKind {
  return value === 'site' || value === 'page'
}

export function isBlueprint(value: unknown): value is Blueprint {
  if (!value || typeof value !== 'object') return false
  const item = value as Record<string, unknown>
  const keys = ['id', 'title', 'category', 'siteUrl', 'repoUrl', 'summary', 'prompt']
  if (!keys.every((key) => typeof item[key] === 'string')) return false
  if (!Array.isArray(item.tags) || !item.tags.every((tag) => typeof tag === 'string')) return false
  if (item.kind !== undefined && !isKind(item.kind)) return false
  if (item.promptModes !== undefined) {
    if (!Array.isArray(item.promptModes) || !item.promptModes.every(isPromptMode)) return false
  }
  return true
}

function normalize(item: Blueprint): Blueprint {
  return {
    ...item,
    kind: item.kind ?? 'site',
    promptModes: item.promptModes,
  }
}

function readSeed(): Blueprint[] {
  if (!Array.isArray(data)) return []
  return data.filter(isBlueprint).map(normalize)
}

const seedBlueprints = readSeed()
const seedIds = new Set(seedBlueprints.map((item) => item.id))

function readCustom(): Blueprint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(isBlueprint)
      .filter((item) => !seedIds.has(item.id))
      .map(normalize)
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

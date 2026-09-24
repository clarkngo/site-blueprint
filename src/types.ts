export type BlueprintKind = 'site' | 'page'

export type PromptMode = {
  id: string
  label: string
  prompt: string
}

export type Blueprint = {
  id: string
  title: string
  category: string
  kind: BlueprintKind
  siteUrl: string
  repoUrl: string
  tags: string[]
  summary: string
  prompt: string
  promptModes?: PromptMode[]
}

export type BlueprintDraft = Omit<Blueprint, 'id'>

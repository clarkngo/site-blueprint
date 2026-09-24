export type Blueprint = {
  id: string
  title: string
  category: string
  siteUrl: string
  repoUrl: string
  tags: string[]
  summary: string
  prompt: string
}

export type BlueprintDraft = Omit<Blueprint, 'id'>

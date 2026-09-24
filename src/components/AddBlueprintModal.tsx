import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Download } from 'lucide-react'
import { TagInput } from './TagInput'
import { safeHttpUrl } from '../lib/blueprint'
import { fieldClass, labelClass, primaryButtonClass, quietButtonClass } from '../lib/styles'
import type { BlueprintDraft } from '../types'

type AddBlueprintModalProps = {
  suggestions: string[]
  onClose: () => void
  onExport: () => void
  onSubmit: (draft: BlueprintDraft) => void
}

export function AddBlueprintModal({ suggestions, onClose, onExport, onSubmit }: AddBlueprintModalProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Custom Blueprint')
  const [siteUrl, setSiteUrl] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [prompt, setPrompt] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    titleRef.current?.focus()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  function submit(event: FormEvent) {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!title.trim()) next.title = 'Title is required.'
    if (!summary.trim()) next.summary = 'Summary is required.'
    if (!prompt.trim()) next.prompt = 'Prompt is required.'
    if (siteUrl.trim() && !safeHttpUrl(siteUrl)) next.siteUrl = 'Use a full http or https URL.'
    if (repoUrl.trim() && !safeHttpUrl(repoUrl)) next.repoUrl = 'Use a full http or https URL.'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    onSubmit({
      title: title.trim(),
      category: category.trim() || 'Custom Blueprint',
      siteUrl: safeHttpUrl(siteUrl) ?? '',
      repoUrl: safeHttpUrl(repoUrl) ?? '',
      tags,
      summary: summary.trim(),
      prompt: prompt.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#040a10]/75 backdrop-blur-[6px]" onMouseDown={onClose}>
      <div className="flex min-h-full items-start justify-center px-4 py-8 sm:py-14">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-blueprint-title"
          className="w-full max-w-2xl rounded-3xl border border-line bg-panel p-5 shadow-2xl sm:p-7"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <h2 id="add-blueprint-title" className="font-serif text-3xl text-paper">
            Add Blueprint
          </h2>
          <p className="mt-1 text-sm text-muted">Saved in this browser until you export JSON.</p>
          <form className="mt-5 grid gap-4" onSubmit={submit}>
            <div>
              <label htmlFor="add-title" className={labelClass}>
                Site Title
              </label>
              <input ref={titleRef} id="add-title" value={title} onChange={(event) => setTitle(event.target.value)} className={fieldClass} aria-invalid={Boolean(errors.title)} />
              {errors.title ? <p className="mt-1 text-sm text-danger">{errors.title}</p> : null}
            </div>
            <div>
              <label htmlFor="add-category" className={labelClass}>
                Category
              </label>
              <input id="add-category" value={category} onChange={(event) => setCategory(event.target.value)} className={fieldClass} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="add-site" className={labelClass}>
                  Live site URL
                </label>
                <input id="add-site" value={siteUrl} onChange={(event) => setSiteUrl(event.target.value)} className={fieldClass} placeholder="https://" aria-invalid={Boolean(errors.siteUrl)} />
                {errors.siteUrl ? <p className="mt-1 text-sm text-danger">{errors.siteUrl}</p> : null}
              </div>
              <div>
                <label htmlFor="add-repo" className={labelClass}>
                  GitHub repo URL
                </label>
                <input id="add-repo" value={repoUrl} onChange={(event) => setRepoUrl(event.target.value)} className={fieldClass} placeholder="https://github.com/" aria-invalid={Boolean(errors.repoUrl)} />
                {errors.repoUrl ? <p className="mt-1 text-sm text-danger">{errors.repoUrl}</p> : null}
              </div>
            </div>
            <div>
              <label htmlFor="add-summary" className={labelClass}>
                Description
              </label>
              <textarea id="add-summary" value={summary} rows={3} onChange={(event) => setSummary(event.target.value)} className={fieldClass} aria-invalid={Boolean(errors.summary)} />
              {errors.summary ? <p className="mt-1 text-sm text-danger">{errors.summary}</p> : null}
            </div>
            <TagInput id="add-tags" label="Tech stack" tags={tags} onChange={setTags} suggestions={suggestions} />
            <div>
              <label htmlFor="add-prompt" className={labelClass}>
                System prompt
              </label>
              <textarea id="add-prompt" value={prompt} rows={8} onChange={(event) => setPrompt(event.target.value)} className={`${fieldClass} font-mono text-[13px]`} placeholder="Paste or write the system prompt for this site." aria-invalid={Boolean(errors.prompt)} />
              {errors.prompt ? <p className="mt-1 text-sm text-danger">{errors.prompt}</p> : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <button type="button" className={quietButtonClass} onClick={onExport}>
                <Download className="size-4" aria-hidden="true" />
                Export catalog JSON
              </button>
              <div className="flex gap-2">
                <button type="button" className={quietButtonClass} onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className={primaryButtonClass}>
                  Add Blueprint
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

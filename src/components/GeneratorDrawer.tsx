import { useEffect, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { CopyButton } from './CopyButton'
import { PromptBlock } from './PromptBlock'
import { TagInput } from './TagInput'
import { classifyUrl, safeHttpUrl, summarize } from '../lib/blueprint'
import { generateMasterPrompt } from '../lib/prompt'
import { fieldClass, labelClass, primaryButtonClass, quietButtonClass } from '../lib/styles'
import type { BlueprintDraft } from '../types'

type GeneratorDrawerProps = {
  open: boolean
  suggestions: string[]
  onClose: () => void
  onSave: (draft: BlueprintDraft) => void
  onCopied: () => void
  onCopyFailed: () => void
}

export function GeneratorDrawer({ open, suggestions, onClose, onSave, onCopied, onCopyFailed }: GeneratorDrawerProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [purpose, setPurpose] = useState('')
  const [stack, setStack] = useState<string[]>([])
  const titleRef = useRef<HTMLInputElement>(null)
  const wasOpen = useRef(false)

  useEffect(() => {
    if (open && !wasOpen.current) {
      document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      titleRef.current?.focus()
    }
    wasOpen.current = open
  }, [open])

  const validUrl = safeHttpUrl(url)
  const urlInvalid = url.trim().length > 0 && !validUrl
  const canSave = title.trim().length > 0 && purpose.trim().length > 0 && !urlInvalid
  const prompt = generateMasterPrompt({
    title,
    url: validUrl ?? '',
    purpose,
    stack,
  })

  function save() {
    if (!canSave) return
    const links = classifyUrl(url)
    const draft: BlueprintDraft = {
      title: title.trim(),
      category: 'Custom Blueprint',
      kind: 'site',
      siteUrl: links.siteUrl,
      repoUrl: links.repoUrl,
      tags: stack,
      summary: summarize(purpose),
      prompt,
    }
    setTitle('')
    setUrl('')
    setPurpose('')
    setStack([])
    onSave(draft)
  }

  return (
    <section
      id="generator"
      className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
    >
      <div
        className={`min-h-0 overflow-hidden${!open ? ' invisible pointer-events-none' : ''}`}
        {...(!open ? { inert: true as const } : {})}
        aria-hidden={!open}
      >
        <div className="border-b border-line bg-panel/90">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-10">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                save()
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 id="generator-title" className="font-serif text-3xl text-paper">
                    Reverse-Prompt Generator
                  </h2>
                  <p className="mt-1 text-sm text-muted">The master prompt updates as you type.</p>
                </div>
                <button type="button" className="rounded-full border border-line p-2 text-muted hover:text-paper" aria-label="Close reverse-prompt generator" onClick={onClose}>
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-5 grid gap-4">
                <div>
                  <label htmlFor="site-title" className={labelClass}>
                    Site Title
                  </label>
                  <input
                    ref={titleRef}
                    id="site-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className={fieldClass}
                    placeholder="Research Hub"
                  />
                </div>
                <div>
                  <label htmlFor="site-url" className={labelClass}>
                    Target URL or GitHub Repo URL
                  </label>
                  <input
                    id="site-url"
                    value={url}
                    inputMode="url"
                    spellCheck={false}
                    onChange={(event) => setUrl(event.target.value)}
                    className={fieldClass}
                    placeholder="https://github.com/you/project"
                    aria-invalid={urlInvalid}
                  />
                  {urlInvalid ? <p className="mt-1 text-sm text-danger">Use a full http or https URL, or leave this blank.</p> : null}
                </div>
                <div>
                  <label htmlFor="site-purpose" className={labelClass}>
                    Primary Purpose & Key Features
                  </label>
                  <textarea
                    id="site-purpose"
                    value={purpose}
                    rows={6}
                    onChange={(event) => setPurpose(event.target.value)}
                    className={fieldClass}
                    placeholder="Who it is for, what it does, and the features that matter. One feature per line works well."
                  />
                </div>
                <TagInput id="stack" label="Preferred Tech Stack" tags={stack} onChange={setStack} suggestions={suggestions} />
              </div>
            </form>

            <div className="flex h-[32rem] max-h-[75vh] flex-col overflow-hidden rounded-2xl border border-line bg-ink">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <p className="font-mono text-[11px] tracking-[0.18em] text-cyan uppercase">Generated prompt</p>
                <p className="font-mono text-[11px] text-muted">{prompt.length.toLocaleString()} chars</p>
              </div>
              <div className="min-h-0 flex-1 overflow-auto p-4">
                <PromptBlock text={prompt} />
              </div>
              <div className="flex flex-wrap gap-2 border-t border-line p-4">
                <CopyButton
                  text={prompt}
                  label="Copy Generated Prompt"
                  disabled={!canSave}
                  onCopied={onCopied}
                  onFailed={onCopyFailed}
                  className={primaryButtonClass}
                />
                <button type="button" className={quietButtonClass} disabled={!canSave} onClick={save}>
                  <Plus className="size-4" aria-hidden="true" />
                  Save as New Card
                </button>
              </div>
              {!canSave ? <p className="px-4 pb-4 text-xs text-muted">Add a title and a purpose to copy or save this prompt.</p> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

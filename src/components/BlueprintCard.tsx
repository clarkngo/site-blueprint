import { useState, type ReactNode } from 'react'
import { Globe, RefreshCw } from 'lucide-react'
import { CopyButton } from './CopyButton'
import { PromptBlock } from './PromptBlock'
import { safeHttpUrl } from '../lib/blueprint'
import type { Blueprint } from '../types'

type BlueprintCardProps = {
  blueprint: Blueprint
  number: number
  local: boolean
  delayIndex: number
  onTag: (tag: string) => void
  onRemove: (id: string) => void
  onCopied: () => void
  onCopyFailed: () => void
}

function categoryTone(category: string) {
  const key = category.toLowerCase()
  if (key.includes('decision') || key.includes('map')) return 'bg-[#d7f0e6] text-[#0e3d34]'
  if (key.includes('doc') || key.includes('lab')) return 'bg-[#f6e4c4] text-[#5c3d09]'
  if (key.includes('utility') || key.includes('tool')) return 'bg-[#e4e0f6] text-[#312c66]'
  return 'bg-[#d7eef8] text-[#0e3a52]'
}

function CornerMarks({ tone }: { tone: string }) {
  const tick = 'pointer-events-none absolute size-2.5 border-current'
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${tone}`}>
      <span className={`${tick} top-2 left-2 border-t border-l`} />
      <span className={`${tick} top-2 right-2 border-t border-r`} />
      <span className={`${tick} bottom-2 left-2 border-b border-l`} />
      <span className={`${tick} right-2 bottom-2 border-r border-b`} />
    </div>
  )
}

function SiteLink({ href, children }: { href: string; children: ReactNode }) {
  const url = safeHttpUrl(href)
  const className =
    'inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#172333]/15 px-2 py-2 text-sm font-medium whitespace-nowrap'
  if (!url) {
    return (
      <button type="button" disabled className={`${className} cursor-not-allowed opacity-40`}>
        {children}
      </button>
    )
  }
  return (
    <a href={url} target="_blank" rel="noreferrer noopener" className={`${className} hover:bg-[#172333]/5`}>
      {children}
    </a>
  )
}

export function BlueprintCard({
  blueprint,
  number,
  local,
  delayIndex,
  onTag,
  onRemove,
  onCopied,
  onCopyFailed,
}: BlueprintCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)
  const label = String(number).padStart(2, '0')

  return (
    <article
      id={`card-${blueprint.id}`}
      aria-label={blueprint.title}
      className="flip-scene sheet-in h-[32rem]"
      style={{ animationDelay: `${Math.min(delayIndex, 8) * 40}ms` }}
    >
      <div className={`flip-inner${flipped ? ' is-flipped' : ''}`}>
        <div className={`flip-face${flipped ? ' pointer-events-none' : ''}`} aria-hidden={flipped} inert={flipped}>
          <div className="relative flex h-full flex-col bg-paper p-6 text-[#172333]">
            <CornerMarks tone="text-[#172333]/30" />
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-[11px] tracking-[0.18em] text-[#172333]/45">{label}</span>
              <span className={`max-w-[70%] rounded-full px-2.5 py-1 text-right text-[11px] leading-4 font-semibold ${categoryTone(blueprint.category)}`}>
                {blueprint.category}
              </span>
            </div>
            {local ? (
              <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-[#172333]/45 uppercase">In this browser</p>
            ) : null}
            <h2 className="mt-3 font-serif text-[1.65rem] leading-tight tracking-[-0.02em]">{blueprint.title}</h2>
            <div className="mt-3 min-h-0 flex-1 overflow-auto">
              <p className="text-sm leading-6 text-[#243446]">{blueprint.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {blueprint.tags.map((tag) => (
                  <li key={tag}>
                    <button
                      type="button"
                      title={`Filter by ${tag}`}
                      onClick={() => onTag(tag)}
                      className="rounded-full bg-[#172333]/5 px-2.5 py-1 text-xs font-medium ring-1 ring-[#172333]/10 hover:bg-[#172333]/10"
                    >
                      {tag}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2 pt-5">
              <div className="flex gap-2">
                <SiteLink href={blueprint.siteUrl}>
                  <Globe className="size-4" aria-hidden="true" />
                  Live Site
                </SiteLink>
                <SiteLink href={blueprint.repoUrl}>
                  <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.7 7.7 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  GitHub Repo
                </SiteLink>
              </div>
              <button
                type="button"
                onClick={() => setFlipped(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#142433] px-3 py-2.5 text-sm font-semibold text-paper hover:bg-[#1c3348]"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Flip to Blueprint Prompt
              </button>
            </div>
          </div>
        </div>

        <div className={`flip-face flip-back${flipped ? '' : ' pointer-events-none'}`} aria-hidden={!flipped} inert={!flipped}>
          <div className="relative flex h-full flex-col bg-panel p-6 text-paper">
            <CornerMarks tone="text-cyan/40" />
            <h2 className="font-serif text-[1.35rem] leading-snug">System Prompt for {blueprint.title}</h2>
            {local ? (
              <button
                type="button"
                className="mt-2 self-start text-xs font-medium text-danger hover:underline"
                onClick={() => {
                  if (!confirmRemove) {
                    setConfirmRemove(true)
                    return
                  }
                  onRemove(blueprint.id)
                }}
              >
                {confirmRemove ? 'Confirm remove' : 'Remove local card'}
              </button>
            ) : null}
            <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-cyan/25 bg-ink">
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-3 py-2 font-mono text-[10px] tracking-[0.16em] text-cyan uppercase">
                <span>blueprint.md</span>
                <span>{blueprint.prompt.length.toLocaleString()} chars</span>
              </div>
              <div className="min-h-0 flex-1 overflow-auto overscroll-contain p-3">
                <PromptBlock text={blueprint.prompt} />
              </div>
            </div>
            <div className="mt-4 flex shrink-0 flex-wrap gap-2">
              <CopyButton
                text={blueprint.prompt}
                label="Copy Prompt"
                onCopied={onCopied}
                onFailed={onCopyFailed}
                className="inline-flex min-w-40 flex-1 items-center justify-center gap-2 rounded-full bg-ice px-3 py-2.5 text-sm font-semibold text-ink hover:bg-white"
              />
              <button
                type="button"
                onClick={() => setFlipped(false)}
                className="inline-flex min-w-40 flex-1 items-center justify-center gap-2 rounded-full border border-line px-3 py-2.5 text-sm font-medium text-paper hover:border-cyan/60"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Flip Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

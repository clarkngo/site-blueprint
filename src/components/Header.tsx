import { useEffect, useRef, type Ref } from 'react'
import { Plus, Search, X, Zap } from 'lucide-react'
import { primaryButtonClass, quietButtonClass } from '../lib/styles'

type HeaderProps = {
  query: string
  onQueryChange: (value: string) => void
  tags: string[]
  activeTags: string[]
  onToggleTag: (tag: string) => void
  onClear: () => void
  resultCount: number
  totalCount: number
  drawerOpen: boolean
  onToggleDrawer: () => void
  onAdd: () => void
  generatorButtonRef: Ref<HTMLButtonElement>
  addButtonRef: Ref<HTMLButtonElement>
}

function tagActive(activeTags: string[], tag: string) {
  const needle = tag.toLowerCase()
  return activeTags.some((item) => item.toLowerCase() === needle)
}

export function Header({
  query,
  onQueryChange,
  tags,
  activeTags,
  onToggleTag,
  onClear,
  resultCount,
  totalCount,
  drawerOpen,
  onToggleDrawer,
  onAdd,
  generatorButtonRef,
  addButtonRef,
}: HeaderProps) {
  const searchRef = useRef<HTMLInputElement>(null)
  const filtering = query.trim().length > 0 || activeTags.length > 0

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target
      if (target instanceof HTMLElement) {
        const tag = target.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return
      }
      event.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-cyan/40 bg-panel text-ice">
              <svg viewBox="0 0 32 32" className="size-6" aria-hidden="true">
                <path d="M7 6h12l6 6v14H7V6z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M19 6v6h6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M11 18h10M11 22h7" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            <div>
              <p className="font-mono text-[11px] tracking-[0.22em] text-cyan uppercase">Catalog — GitHub Pages</p>
              <h1 className="mt-1 font-serif text-4xl tracking-tight text-paper sm:text-5xl">SiteBlueprint</h1>
              <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
                Replicable AI System Prompts for Web Applications
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 xl:justify-end">
            <button
              ref={generatorButtonRef}
              type="button"
              className={primaryButtonClass}
              aria-expanded={drawerOpen}
              aria-controls="generator"
              onClick={onToggleDrawer}
            >
              <Zap className="size-4" aria-hidden="true" />
              Reverse-Prompt Generator
            </button>
            <button ref={addButtonRef} type="button" className={quietButtonClass} onClick={onAdd}>
              <Plus className="size-4" aria-hidden="true" />
              Add Blueprint
            </button>
          </div>
        </div>

        <div className="relative mt-5">
          <label htmlFor="blueprint-search" className="sr-only">
            Search blueprints
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            ref={searchRef}
            id="blueprint-search"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by title, stack, or purpose"
            className="w-full rounded-full border border-line bg-panel/80 py-2.5 pr-16 pl-10 text-sm text-paper outline-none placeholder:text-muted/80 focus:border-cyan"
          />
          {query ? (
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted hover:text-paper"
              aria-label="Clear search"
              onClick={() => onQueryChange('')}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">
              /
            </kbd>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {tags.map((tag) => {
            const active = tagActive(activeTags, tag)
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => onToggleTag(tag)}
                className={
                  active
                    ? 'rounded-full bg-ice px-2.5 py-1 text-xs font-semibold text-ink'
                    : 'rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:text-paper'
                }
              >
                {tag}
              </button>
            )
          })}
          {filtering ? (
            <button type="button" className="text-xs text-cyan underline-offset-2 hover:underline" onClick={onClear}>
              Clear filters
            </button>
          ) : null}
          <p className="ml-auto font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
            {resultCount === totalCount
              ? `${String(totalCount).padStart(2, '0')} blueprints`
              : `Showing ${resultCount} of ${totalCount}`}
          </p>
        </div>
      </div>
    </header>
  )
}

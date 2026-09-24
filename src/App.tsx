import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { AddBlueprintModal } from './components/AddBlueprintModal'
import { BlueprintCard } from './components/BlueprintCard'
import { GeneratorDrawer } from './components/GeneratorDrawer'
import { Header } from './components/Header'
import { Toast } from './components/Toast'
import { uniqueId } from './lib/blueprint'
import { downloadBlueprints } from './lib/export'
import { collectTags, filterBlueprints } from './lib/search'
import { STACK_PRESETS } from './lib/stacks'
import { isLocalBlueprint, loadBlueprints, saveCustomBlueprints } from './lib/storage'
import { quietButtonClass } from './lib/styles'
import type { Blueprint, BlueprintDraft, BlueprintKind } from './types'

export default function App() {
  const [blueprints, setBlueprints] = useState<Blueprint[]>(loadBlueprints)
  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [kind, setKind] = useState<BlueprintKind | 'all'>('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null)
  const generatorButtonRef = useRef<HTMLButtonElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    saveCustomBlueprints(blueprints)
  }, [blueprints])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const show = useCallback((message: string) => {
    setToast({ id: Date.now(), message })
  }, [])

  const tags = useMemo(() => collectTags(blueprints), [blueprints])
  const suggestions = useMemo(() => [...new Set([...STACK_PRESETS, ...tags])], [tags])
  const results = useMemo(
    () => filterBlueprints(blueprints, query, activeTags, kind),
    [blueprints, query, activeTags, kind],
  )

  function toggleTag(tag: string) {
    const needle = tag.toLowerCase()
    setActiveTags((current) =>
      current.some((item) => item.toLowerCase() === needle)
        ? current.filter((item) => item.toLowerCase() !== needle)
        : [...current, tag],
    )
  }

  function toggleDrawer() {
    setDrawerOpen((open) => {
      if (open) generatorButtonRef.current?.focus({ preventScroll: true })
      return !open
    })
  }

  function scrollToCard(id: string) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(`card-${id}`)?.scrollIntoView({
          behavior: reduce ? 'auto' : 'smooth',
          block: 'center',
        })
      })
    })
  }

  function handleAdd(draft: BlueprintDraft) {
    const id = uniqueId(draft.title, blueprints.map((item) => item.id))
    setBlueprints((prev) => [{ ...draft, id }, ...prev])
    setModalOpen(false)
    setDrawerOpen(false)
    show(`Added "${draft.title}" to this browser`)
    scrollToCard(id)
  }

  function removeBlueprint(id: string) {
    const current = blueprints.find((item) => item.id === id)
    if (!current || !isLocalBlueprint(id)) return
    setBlueprints((prev) => prev.filter((item) => item.id !== id))
    show(`Removed "${current.title}" from this browser`)
  }

  function exportCatalog() {
    downloadBlueprints(blueprints)
    show('Downloaded blueprints.json')
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (modalOpen) {
        setModalOpen(false)
        addButtonRef.current?.focus({ preventScroll: true })
        return
      }
      if (drawerOpen) {
        setDrawerOpen(false)
        generatorButtonRef.current?.focus({ preventScroll: true })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen, drawerOpen])

  return (
    <div className="min-h-screen">
      <a
        href="#catalog"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[80] focus:rounded-full focus:bg-ice focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to catalog
      </a>
      <Header
        query={query}
        onQueryChange={setQuery}
        tags={tags}
        activeTags={activeTags}
        onToggleTag={toggleTag}
        kind={kind}
        onKindChange={setKind}
        onClear={() => {
          setQuery('')
          setActiveTags([])
          setKind('all')
        }}
        resultCount={results.length}
        totalCount={blueprints.length}
        drawerOpen={drawerOpen}
        onToggleDrawer={toggleDrawer}
        onAdd={() => setModalOpen(true)}
        generatorButtonRef={generatorButtonRef}
        addButtonRef={addButtonRef}
      />
      <GeneratorDrawer
        open={drawerOpen}
        suggestions={suggestions}
        onClose={toggleDrawer}
        onSave={handleAdd}
        onCopied={() => show('Prompt copied')}
        onCopyFailed={() => show("Couldn't copy. Select the prompt and copy it manually.")}
      />
      <main id="catalog" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <h2 className="sr-only">Blueprints</h2>
        <p className="mb-6 text-sm text-muted">
          Flip a card for its rebuild prompt. Filter by Sites for full apps, or Pages for a single page blueprint.
        </p>
        {results.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line px-6 py-16 text-center">
            <p className="font-serif text-3xl text-paper">No matching blueprints</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Try another title, stack, or purpose. You can also generate a prompt for a site that is not in the catalog yet.
            </p>
            <button
              type="button"
              className={`${quietButtonClass} mt-6`}
              onClick={() => {
                setQuery('')
                setActiveTags([])
                setKind('all')
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            {results.map((blueprint, index) => (
              <li key={blueprint.id} className="min-w-0">
                <BlueprintCard
                  blueprint={blueprint}
                  number={blueprints.findIndex((item) => item.id === blueprint.id) + 1}
                  local={isLocalBlueprint(blueprint.id)}
                  delayIndex={index}
                  onTag={toggleTag}
                  onRemove={removeBlueprint}
                  onCopied={() => show('Prompt copied')}
                  onCopyFailed={() => show("Couldn't copy. Select the prompt and copy it manually.")}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
      <footer className="mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-sm text-muted">
          <p>Cards you add stay in this browser. Export JSON to keep them in the repo.</p>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className="inline-flex items-center gap-2 text-paper hover:text-ice" onClick={exportCatalog}>
              <Download className="size-4" aria-hidden="true" />
              Export catalog JSON
            </button>
            <a
              href="https://github.com/clarkngo/site-blueprint"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-paper"
            >
              clarkngo/site-blueprint
            </a>
          </div>
        </div>
      </footer>
      {modalOpen ? (
        <AddBlueprintModal
          suggestions={suggestions}
          onClose={() => {
            setModalOpen(false)
            addButtonRef.current?.focus({ preventScroll: true })
          }}
          onExport={exportCatalog}
          onSubmit={handleAdd}
        />
      ) : null}
      <Toast message={toast?.message ?? null} />
    </div>
  )
}

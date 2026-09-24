import { useState } from 'react'
import { X } from 'lucide-react'
import { labelClass } from '../lib/styles'

type TagInputProps = {
  id: string
  label: string
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
}

export function TagInput({ id, label, tags, onChange, suggestions = [] }: TagInputProps) {
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(false)
  const inputId = `${id}-input`
  const needle = draft.trim().toLowerCase()

  function commit(raw: string) {
    const parts = raw.split(',').map((part) => part.trim()).filter(Boolean)
    if (parts.length === 0) {
      setDraft('')
      return
    }
    const merged = [...tags]
    for (const tag of parts) {
      if (merged.some((item) => item.toLowerCase() === tag.toLowerCase())) continue
      merged.push(tag)
    }
    onChange(merged)
    setDraft('')
  }

  const matches = suggestions
    .filter((item) => item.toLowerCase().includes(needle))
    .filter((item) => !tags.some((tag) => tag.toLowerCase() === item.toLowerCase()))
    .slice(0, 6)

  const quickPicks = suggestions
    .filter((item) => !tags.some((tag) => tag.toLowerCase() === item.toLowerCase()))
    .slice(0, 8)

  return (
    <div>
      <label htmlFor={inputId} className={labelClass}>
        {label}
      </label>
      <div className="rounded-xl border border-line bg-ink px-2 py-2 focus-within:border-cyan">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-panel px-2.5 py-1 text-xs text-paper">
              {tag}
              <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(tags.filter((item) => item !== tag))}>
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
          <input
            id={inputId}
            value={draft}
            autoCapitalize="off"
            autoCorrect="off"
            placeholder={tags.length === 0 ? 'Type a stack and press Enter' : 'Add another'}
            className="min-w-32 flex-1 bg-transparent px-2 py-1 text-sm text-paper outline-none placeholder:text-muted/70"
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onChange={(event) => {
              const value = event.target.value
              if (value.includes(',')) {
                commit(value)
                return
              }
              setDraft(value)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ',') {
                event.preventDefault()
                commit(draft)
              } else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
                onChange(tags.slice(0, -1))
              }
            }}
          />
        </div>
      </div>
      {open && needle && matches.length > 0 ? (
        <ul className="relative z-10 mt-1 overflow-hidden rounded-xl border border-line bg-panel shadow-lg">
          {matches.map((match) => (
            <li key={match}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm text-paper hover:bg-ink"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => commit(match)}
              >
                {match}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {quickPicks.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {quickPicks.map((preset) => (
            <button
              key={preset}
              type="button"
              className="rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:border-cyan/60 hover:text-paper"
              onClick={() => commit(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

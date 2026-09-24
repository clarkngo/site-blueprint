import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { copyText } from '../lib/clipboard'

type CopyButtonProps = {
  text: string
  label: string
  className: string
  disabled?: boolean
  onCopied?: () => void
  onFailed?: () => void
}

export function CopyButton({ text, label, className, disabled, onCopied, onFailed }: CopyButtonProps) {
  const [done, setDone] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  async function handleClick() {
    const ok = await copyText(text)
    if (!ok) {
      onFailed?.()
      return
    }
    setDone(true)
    onCopied?.()
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setDone(false), 2000)
  }

  return (
    <button
      type="button"
      className={className}
      disabled={disabled || text.trim().length === 0}
      onClick={() => void handleClick()}
    >
      {done ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      {done ? 'Copied' : label}
    </button>
  )
}

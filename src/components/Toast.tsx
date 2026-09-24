import { Check } from 'lucide-react'

export function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full border border-cyan/40 bg-panel px-4 py-2 text-sm text-paper shadow-lg"
    >
      <Check className="size-4 text-cyan" aria-hidden="true" />
      {message}
    </div>
  )
}

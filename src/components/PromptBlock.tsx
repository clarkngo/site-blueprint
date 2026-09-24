function lineClass(line: string) {
  if (/^#\s/.test(line)) return 'mt-1 text-[15px] font-medium text-ice'
  if (/^##\s/.test(line)) return 'mt-4 text-[13px] font-medium text-ice'
  if (/^###\s/.test(line)) return 'mt-3 font-medium text-cyan'
  if (/^```/.test(line)) return 'text-cyan'
  if (/^>\s?/.test(line)) return 'text-muted'
  if (/^-\s/.test(line) || /^\d+\.\s/.test(line)) return 'text-paper/90'
  return 'text-paper/80'
}

export function PromptBlock({ text }: { text: string }) {
  return (
    <div className="prompt-block">
      {text.split('\n').map((line, index) => (
        <div key={index} className={lineClass(line)}>
          {line.length > 0 ? line : '\u00a0'}
        </div>
      ))}
    </div>
  )
}

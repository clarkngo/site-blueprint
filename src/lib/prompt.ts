import { repoNameFromUrl, slugify } from './blueprint'

export type PromptInput = {
  title: string
  url: string
  purpose: string
  stack: string[]
}

type Mode = 'docs' | 'next' | 'canvas' | 'app'

function detectMode(stack: string[]): Mode {
  const names = stack.map((item) => item.toLowerCase())
  const has = (name: string) => names.some((item) => item.includes(name))
  if (has('astro') || (has('mdx') && !has('react flow'))) return 'docs'
  if (has('next')) return 'next'
  if (has('react flow') || has('d3') || has('dagre')) return 'canvas'
  return 'app'
}

function libraryNotes(stack: string[]): string[] {
  const has = (name: string) => stack.some((item) => item.toLowerCase().includes(name))
  const notes: string[] = []
  if (has('fuse')) {
    notes.push('- Use Fuse.js for client-side fuzzy search. Ignore match position so short queries still hit tags and titles.')
  }
  if (has('react flow')) {
    notes.push('- Use React Flow for the node canvas and custom node components.')
  }
  if (has('dagre')) {
    notes.push('- Run Dagre to place nodes. Do not hand-position a large graph.')
  }
  if (has('d3')) {
    notes.push('- Use D3 for scales, shapes, or layout math. Keep React in charge of the surrounding UI.')
  }
  if (has('astro')) {
    notes.push('- Prefer Astro pages and content collections. Add a client island only for a widget that needs state.')
  }
  if (has('lucide')) {
    notes.push('- Use lucide-react for icons, at a consistent size.')
  }
  return notes
}

function componentTree(mode: Mode, title: string): string {
  if (mode === 'docs') {
    return ['BaseLayout', '  Header', '  Sidebar', '  Chapter', '    Callout', '    Figure', '  Home (subject map)'].join('\n')
  }
  if (mode === 'next') {
    return ['app/layout.tsx', 'app/page.tsx', 'components/Header', 'components/PrimaryView', `components/${title.replace(/\s+/g, '')}Panel`].join('\n')
  }
  if (mode === 'canvas') {
    return ['App', '  Header', '  Toolbar (search, filters, fit view)', '  Stage', '    Custom nodes', '  DetailPanel', '  Legend'].join('\n')
  }
  return ['App', `  Header — ${title}`, '  Primary workspace', '  Supporting panel (details, parameters, or preview)', '  Empty state'].join('\n')
}

function scaffoldStep(mode: Mode, base: string): string {
  if (mode === 'docs') {
    return `1. Scaffold Astro with TypeScript and Tailwind. Set \`base\` to \`${base}\`.`
  }
  if (mode === 'next') {
    return `1. Scaffold Next.js with TypeScript and Tailwind. Use a static export and set \`basePath\` to \`${base}\`.`
  }
  return `1. Scaffold Vite + React + TypeScript and add Tailwind. Set Vite \`base\` to \`${base}\`.`
}

function quote(purpose: string): string {
  if (!purpose) return '> Add the audience, the job to be done, and the features that matter.'
  return purpose.split('\n').map((line) => `> ${line}`).join('\n')
}

export function generateMasterPrompt(input: PromptInput): string {
  const title = input.title.trim() || 'Untitled Site'
  const url = input.url.trim()
  const purpose = input.purpose.replace(/\r\n/g, '\n').trim()
  const stack = input.stack.map((item) => item.trim()).filter(Boolean)
  const mode = detectMode(stack)
  const repo = repoNameFromUrl(url)
  const base = `/${repo ?? slugify(title)}/`
  const featureLines = purpose
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean)
  const stackBullet =
    stack.length > 0
      ? `- Required stack: ${stack.join(', ')}. Treat each item as a constraint, not a suggestion to swap out.`
      : '- Default stack: React, TypeScript, Vite, and Tailwind CSS. Change one only if the purpose clearly needs a different tool.'

  const modeRules =
    mode === 'docs'
      ? [
          '- Home is a map of the subject, not a marketing hero.',
          '- A persistent sidebar lists the chapters. The current page is obvious.',
          '- Keep the reading column narrow. Tables and code scroll inside themselves.',
        ]
      : mode === 'canvas'
        ? [
            '- The canvas is the product. Controls sit in a slim toolbar.',
            '- Marks on the canvas stay readable at the default zoom.',
            '- Selecting an item opens details without leaving the stage. On a phone, use a bottom sheet.',
          ]
        : mode === 'next'
          ? [
              '- The first screen is the working surface.',
              '- Ship a static export. Do not add a server runtime for the core flow.',
            ]
          : [
              '- The first screen is the working surface, not a landing page.',
              '- Keep the primary task and its preview or details in one view on desktop.',
              '- On a phone, stack the form above the result.',
            ]

  const featureBullets =
    featureLines.length > 1
      ? featureLines.map((line) => `- Required feature: ${line}`)
      : ['- Derive the screens from the product purpose. Do not invent a second product beside it.']

  const lines = [
    `# Build ${title}`,
    '',
    `You are an expert frontend engineer. Build a production-ready static site called "${title}" for GitHub Pages.`,
    '',
    '## Target Architecture & Stack',
    stackBullet,
    `- GitHub Pages base path: \`${base}\`. Set it before you add routes or assets.`,
    '- Client-side only unless the purpose explicitly requires a backend. No secrets in the browser.',
    '- Deploy the static build with GitHub Actions.',
    ...libraryNotes(stack),
    ...(url
      ? [
          '',
          '## Reference (do not clone)',
          `- URL: ${url}`,
          '- Use this only for UX, information architecture, and interaction quality.',
          `- Build "${title}" as an **original** product: new brand voice, visuals, and seed content.`,
          '- Do not reuse the reference site\'s name, logos, trademarks, proprietary copy, course text, or other IP.',
        ]
      : []),
    '',
    '## Originality',
    '- Invent naming and copy that belong to this project.',
    '- Seed data must be original. Structural similarity to a reference is fine; identity copying is not.',
    '',
    '## Product purpose',
    quote(purpose),
    '',
    '## Key Features & Layout Rules',
    ...modeRules,
    '- Design mobile first, then enhance at `md` and `lg`.',
    '- Choose one visual material and stay with it. Do not ship a generic purple-gradient template.',
    '- Include empty, no-result, and failure states on purpose.',
    '- Interactive controls are keyboard reachable and show a visible focus state.',
    '- Text and controls meet WCAG AA contrast.',
    ...featureBullets,
    '',
    '## Component Tree',
    '```text',
    componentTree(mode, title),
    '```',
    '',
    '## Step-by-Step Implementation Strategy',
    scaffoldStep(mode, base),
    '2. Define the TypeScript content model and a realistic seed so the first screen is not empty.',
    '3. Build the shell: header, the primary view, and the supporting panel from the component tree.',
    mode === 'canvas'
      ? '4. Implement the canvas, custom marks, selection, and search before visual polish.'
      : mode === 'docs'
        ? '4. Implement the content collection, sidebar, and two finished chapters before adding extra pages.'
        : '4. Implement the core interaction and wire it to local state before visual polish.',
    '5. Add responsive layout, empty states, and clipboard or external-link behavior the purpose needs.',
    '6. Check keyboard access, contrast, and a phone-width pass.',
    `7. Add a GitHub Actions workflow that installs dependencies, builds the site, and deploys the static output to GitHub Pages at \`${base}\`.`,
    '',
    '## Acceptance Criteria',
    `- [ ] The production build loads under \`${base}\` with no missing assets.`,
    '- [ ] The primary task is obvious on a phone and on a desktop.',
    '- [ ] Empty and no-result states are designed.',
    '- [ ] Controls are keyboard reachable with a visible focus state.',
    '- [ ] The named stack is actually used, not listed and then replaced.',
    '- [ ] No API key or account is required for the core flow.',
    '- [ ] Branding and seed content are original (not a clone of any reference URL).',
  ]

  return lines.join('\n')
}

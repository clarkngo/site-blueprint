/**
 * Regenerates blueprint prompts so catalog cards teach a reusable *pattern*,
 * not a clone of the reference brand, novel, or curriculum IP.
 */
import { writeFileSync } from 'node:fs'

function dedent(text) {
  const trimmed = text.replace(/^\n/, '').replace(/\s+$/, '')
  const lines = trimmed.split('\n')
  const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^ */)[0].length)
  const cut = indents.length > 0 ? Math.min(...indents) : 0
  return lines.map((line) => line.slice(cut)).join('\n')
}

function originality({ pattern, references = [], forbidden = [] }) {
  const refs = references.map((r) => `- ${r}`).join('\n')
  const bans = forbidden.map((f) => `- ${f}`).join('\n')
  return dedent(`
    ## Originality (required)
    This prompt describes a **${pattern}** pattern. Live links below are UX and architecture references only.

    ${refs ? `Reference (do not clone):\n${refs}\n` : ''}
    - Invent a **new product name**, brand voice, visual identity, and seed content.
    - Do **not** reuse logos, trademarks, institution names, character names, chapter text, lesson bodies, or marketing copy from the reference.
    - Match structure and interaction quality — not the reference's identity.
    ${bans ? `\nHard bans:\n${bans}` : ''}
  `)
}

const data = [
  {
    id: 'problem-atlas',
    title: 'Problem Atlas',
    category: 'Interactive Decision Map',
    kind: 'site',
    siteUrl: 'https://clarkngo.github.io/problem-atlas/',
    repoUrl: 'https://github.com/clarkngo/problem-atlas',
    tags: ['React Flow', 'Vite', 'Tailwind', 'Dagre', 'Fuse.js'],
    summary:
      'Pattern: interactive node-based scenario map. Navigate domain challenges down to solutions, improvements, and blockers — with search, layout, and detail panels. Catalog entry references Problem Atlas; the prompt builds your own map, not a clone.',
    prompt: dedent(`
      # Build an interactive decision-map site (pattern)

      You are an expert frontend architect. Build a production-ready interactive decision map for GitHub Pages. Give it an **original name** (not "Problem Atlas").

      ${originality({
        pattern: 'node-based decision / scenario atlas',
        references: [
          'https://clarkngo.github.io/problem-atlas/ (interaction reference)',
          'https://github.com/clarkngo/problem-atlas (stack reference)',
        ],
        forbidden: [
          'Do not copy Problem Atlas titles, node copy, domains, or branding.',
        ],
      })}

      ## Target Architecture & Stack
      - Vite, React, TypeScript, and Tailwind CSS.
      - React Flow for the node canvas, with custom nodes.
      - Dagre for automatic top-down layout. Do not hand-place a large graph.
      - Fuse.js for fuzzy search across challenges, solutions, and blockers.
      - Client-side only. Typed JSON is the database.
      - Choose your own repo slug and set Vite \`base\` to \`/<that-slug>/\`.
      - Deploy \`dist\` with GitHub Actions.

      ## Product purpose
      A person starts at a domain challenge and walks downward through process improvements, solution options, and the blockers in the way. Dense, calm, fast to scan — an operational atlas for *their* domain (invent one).

      ## Key Features & Layout Rules
      - Canvas fills the viewport. Slim header: title, active domain, search.
      - Three visually distinct node types: Challenge, Solution, Blocker.
      - Directed edges. Detail panel / mobile bottom sheet on select.
      - Search dims non-matches; empty query states are designed.
      - Fit-view, zoom, reset-layout. Original visual material — not the React Flow demo theme and not the reference site's look.

      ## Component Tree
      App
        Header
        Toolbar
        AtlasCanvas
          ChallengeNode
          SolutionNode
          BlockerNode
        DetailPanel
        Legend

      ## Data model
      - Node: id, type, title, summary, domain, tags, requirements[]
      - Edge: id, source, target, relation
      - Seed at least two **original** domains with invented content.

      ## Step-by-Step Implementation Strategy
      1. Scaffold Vite + React + TypeScript + Tailwind. Set your base path.
      2. Define the model and original seed data.
      3. Custom nodes + Dagre layout helper.
      4. React Flow canvas; fit view on load.
      5. Fuse.js search, detail panel, domain filter, mobile sheet.
      6. A11y / contrast / phone pass.
      7. GitHub Actions → Pages.

      ## Acceptance Criteria
      - [ ] Original name and content (not a clone of the reference).
      - [ ] Auto layout readable at default zoom; search and details work.
      - [ ] Challenge / solution / blocker distinguishable without color alone.
      - [ ] Production build loads under your chosen base path.
    `),
  },
  {
    id: 'physical-ai',
    title: 'Physical AI & Operational Tech',
    category: 'Documentation & Lab Hub',
    kind: 'site',
    siteUrl: 'https://clarkngo.github.io/physical-ai/',
    repoUrl: 'https://github.com/clarkngo/physical-ai',
    tags: ['Astro', 'Tailwind', 'Cyber-Physical Systems'],
    summary:
      'Pattern: educational docs/lab hub for cyber-physical systems and OT. Chapters move from plain-language concepts to sensors, control loops, and real systems. Prompt builds your own hub with original chapters.',
    prompt: dedent(`
      # Build a Physical AI / OT documentation hub (pattern)

      You are a technical educator and frontend engineer. Build a modern static documentation and lab hub for GitHub Pages with an **original site name**.

      ${originality({
        pattern: 'subject-map documentation hub for cyber-physical / OT topics',
        references: [
          'https://clarkngo.github.io/physical-ai/',
          'https://github.com/clarkngo/physical-ai',
        ],
        forbidden: [
          'Do not copy chapter titles, prose, figures, or "Physical AI & Operational Tech" branding.',
        ],
      })}

      ## Target Architecture & Stack
      - Astro + TypeScript + Tailwind. Markdown/MDX content collections.
      - No backend. Client islands only when a widget needs state.
      - Choose your slug; set Astro \`base\` to \`/<slug>/\`. Deploy with Actions.

      ## Product purpose
      An educational hub for cyber-physical systems, digital twins, and operational technology. Readers move from a plain-language concept to how it shows up on a real system. Invent your audience and chapter set.

      ## Key Features & Layout Rules
      - Home is a subject map (entry paths), not a marketing hero.
      - Persistent sidebar; short chapters with definition, system example, failure note.
      - Callouts for definitions, lab notes, safety/failure warnings.
      - Comfortable reading measure. Original visual material (lab/field-manual feel is fine; do not clone the reference theme).

      ## Component Tree
      BaseLayout
        Header
        Sidebar
        Chapter
          Definition / Figure / Callout / NextPrev
        Home (subject map)

      ## Step-by-Step Implementation Strategy
      1. Scaffold Astro + TS + Tailwind; set base.
      2. Content collection: title, summary, order, section, body.
      3. Layout, sidebar, subject-map home.
      4. Write original starter chapters (CPS, twins, OT automation or your own triad).
      5. Prev/next, a11y, deploy.

      ## Acceptance Criteria
      - [ ] Original branding and chapter prose.
      - [ ] New chapters are content files, not hand-edited routers.
      - [ ] Phone-readable; builds under your base path.
    `),
  },
  {
    id: 'prompt-builder',
    title: 'Prompt Builder',
    category: 'Utility App',
    kind: 'site',
    siteUrl: 'https://clarkngo.github.io/prompt-builder/',
    repoUrl: 'https://github.com/clarkngo/prompt-builder',
    tags: ['React', 'Tailwind', 'LLM Utility'],
    summary:
      'Pattern: client-side prompt composition workbench with templates, variables, and copy — no model API. Prompt builds your own utility with original templates.',
    prompt: dedent(`
      # Build a prompt-composition workbench (pattern)

      You are an AI tools engineer. Build a client-side React utility for composing parameterized system prompts. Give it an **original name** (not "Prompt Builder").

      ${originality({
        pattern: 'template + variables → assembled prompt workbench',
        references: [
          'https://clarkngo.github.io/prompt-builder/',
          'https://github.com/clarkngo/prompt-builder',
        ],
        forbidden: [
          'Do not copy the reference app name, UI copy, or seed template bodies verbatim.',
        ],
      })}

      ## Target Architecture & Stack
      - React, TypeScript, Vite, Tailwind. localStorage for user templates.
      - Formats prompts only — never calls an LLM; never asks for an API key.
      - Your own slug / Vite base. Deploy \`dist\` with Actions.

      ## Product purpose
      A workbench where a system prompt is a template with named \`{{variables}}\`. Pick a template, fill fields, see the assembly update, copy it.

      ## Key Features & Layout Rules
      - Workbench first: list, variable form, live preview.
      - Seed 3 **original** builtin templates (e.g. coding agent, editor, research brief) with your own wording.
      - Save / duplicate / delete user templates; builtins duplicate-only.
      - Phone stacks form above preview. Tool-like visual material — not a chat-app clone and not the reference skin.

      ## Component Tree
      App → Header, TemplateList, VariableForm, PromptPreview, TemplateEditor, Toast

      ## Acceptance Criteria
      - [ ] Original name and template text.
      - [ ] Variables update preview immediately; no API key ever.
      - [ ] Builds under your base path.
    `),
  },
  {
    id: 'maritime-ot',
    title: 'Maritime OT Security',
    category: 'Course Curriculum',
    kind: 'site',
    siteUrl: 'https://clarkngo.github.io/maritime-ot/',
    repoUrl: 'https://github.com/clarkngo/maritime-ot',
    tags: ['HTML', 'Curriculum', 'Maritime OT', 'ICS'],
    summary:
      'Pattern: multi-day OT security curriculum site with safeguards-first policy, lesson index, and browser-safe labs. Prompt builds your own course — not a copy of the Maritime OT materials.',
    prompt: dedent(`
      # Build a maritime / OT security curriculum site (pattern)

      You are a curriculum designer and frontend engineer. Build a static multi-day course site for GitHub Pages with an **original course title and code**.

      ${originality({
        pattern: 'safeguards-first practitioner curriculum (lessons + labs + policy)',
        references: [
          'https://clarkngo.github.io/maritime-ot/',
          'https://github.com/clarkngo/maritime-ot',
        ],
        forbidden: [
          'Do not copy lesson titles, lesson bodies, key-term lists, or "Maritime Operational Technology Security" / MOT-101 branding.',
          'Do not reproduce any copyrighted curriculum prose from the reference.',
          'Do not include working exploit code or attack procedures against live vessels or terminals.',
        ],
      })}

      ## Target Architecture & Stack
      - Static HTML or Astro/Vite. Client-side only.
      - Your slug; base \`/<slug>/\`. Deploy with Actions.

      ## Product purpose
      A ~5-day practitioner path for defending shipboard and port operational technology. Each lesson pairs technical framing with a worked example and a **simulation-only** activity. Invent your outline (you may cover similar themes: devices, protocols, threats, frameworks, GRC, IR) in **your own words**.

      ## Key Features & Layout Rules
      - Course navigation home, not a marketing landing page.
      - Collapsible Safeguards & Responsible Use first: safety > exercise, sims only, air-gap, defensive scope, scrubbed data, AI-content review, accessible by default.
      - Lesson cards: title, outcome, key terms (original).
      - Optional dark mode with AA contrast.

      ## Component Tree
      CourseShell → Header, SafeguardsPanel, LessonIndex/LessonCard, FrameworksExpandable, PolicyFooter

      ## Acceptance Criteria
      - [ ] Original course identity and all-new lesson prose.
      - [ ] Safeguards visible before labs; defensive scope only.
      - [ ] Builds under your base path.
    `),
  },
  {
    id: 'courses',
    title: 'Courses Catalog',
    category: 'Course Catalog',
    kind: 'site',
    siteUrl: 'https://clarkngo.github.io/courses/',
    repoUrl: 'https://github.com/clarkngo/courses',
    tags: ['Astro', 'MDX', 'Tailwind', 'Education'],
    summary:
      'Pattern: multi-course catalog with categories, Available / Coming soon states, and MDX lesson collections. Prompt builds your catalog with original courses — not a mirror of the reference catalog.',
    prompt: dedent(`
      # Build a multi-course catalog (pattern)

      You are an education-product engineer. Build a static Astro course catalog for GitHub Pages with an **original catalog name**.

      ${originality({
        pattern: 'category-grouped course catalog + lesson collections',
        references: [
          'https://clarkngo.github.io/courses/',
          'https://github.com/clarkngo/courses',
        ],
        forbidden: [
          'Do not copy course titles, blurbs, lesson counts, or category copy from the reference catalog.',
        ],
      })}

      ## Target Architecture & Stack
      - Astro, MDX, TypeScript, Tailwind. Content collections for courses and lessons.
      - Your slug / Astro base. Deploy with Actions.

      ## Product purpose
      Practical short courses for beginners, taught through projects. Home lists courses by category with Available vs Coming soon. Invent your catalog's subject mix.

      ## Key Features & Layout Rules
      - Short hero for audience + promise (original voice).
      - Category sections; cards with status, lesson count, link.
      - Coming soon looks intentional. One visual system for the whole catalog.

      ## Component Tree
      BaseLayout → Header, Home/CategorySection/CourseCard, CourseLayout/LessonNav/LessonContent

      ## Acceptance Criteria
      - [ ] Original catalog branding and course list.
      - [ ] Adding a course is a content-file change.
      - [ ] Builds under your base path.
    `),
  },
  {
    id: 'scripted-ot',
    title: 'ScriptedOT',
    category: 'Narrative Learning Hub',
    kind: 'site',
    siteUrl: 'https://clarkngo.github.io/scripted-ot/',
    repoUrl: 'https://github.com/clarkngo/scripted-ot',
    tags: ['HTML', 'OT/ICS', 'Comics', 'Education'],
    summary:
      'Pattern: fiction→field OT/ICS modules (cinematic hook, architecture, real incident, runbook). Prompt builds your own series with original scenes and cases — not a ScriptedOT clone.',
    prompt: dedent(`
      # Build a fiction-to-field OT/ICS learning series (pattern)

      You are a technical educator and frontend engineer. Build a static module series for GitHub Pages with an **original series name** (not "ScriptedOT").

      ${originality({
        pattern: 'cinematic hook → ICS architecture → empirical grounding → runbook',
        references: [
          'https://clarkngo.github.io/scripted-ot/',
          'https://github.com/clarkngo/scripted-ot',
        ],
        forbidden: [
          'Do not copy ScriptedOT module titles, comics, dialogue, or incident writeups.',
          'Do not paste copyrighted film/TV dialogue; write original short comic captions inspired by public domain or clearly fair-use educational paraphrase, or invent fictional scenes.',
          'Keep empirical sections factual and defensive — no attack how-tos.',
        ],
      })}

      ## Target Architecture & Stack
      - Static HTML/CSS/JS or Astro + Tailwind. Your slug / base. Actions deploy.

      ## Product purpose
      Each module uses a dramatic scene as a teaching hook, then maps roles onto real control-room work, breaks down Purdue levels/protocols, grounds in a documented incident, and ends with a mitigation runbook + standard clauses (ISA/IEC 62443, NIST SP 800-82). Invent ~6–10 original modules across industrial domains.

      ## Key Features & Layout Rules
      - Fixed four-part module structure (Anchor → Architecture → Grounding → Runbook).
      - Home grid with Live / Coming soon.
      - Comics need captions + alt text. Fiction is a hook; empirical section stays factual.

      ## Component Tree
      AppShell → Header, HowItWorks, ModuleGrid/ModuleCard, ModulePage (ComicStrip, Architecture, Grounding, Runbook)

      ## Acceptance Criteria
      - [ ] Original series identity and module content.
      - [ ] Every live module has all four sections.
      - [ ] Builds under your base path.
    `),
  },
  {
    id: 'cityu-ebooks',
    title: 'CityU Guides',
    category: 'Gated Ebook Library',
    kind: 'site',
    siteUrl: 'https://clarkngo.github.io/cityu-ebooks/',
    repoUrl: 'https://github.com/clarkngo/cityu-ebooks',
    tags: ['Static Site', 'Lead Capture', 'Education'],
    summary:
      'Pattern: static ebook library with optional lead-capture gate. Flip for gated vs open prompts. Both build *your* library brand — not City University / CityU Guides.',
    prompt: '',
    promptModes: [],
  },
  {
    id: 'project-ouroboros',
    title: 'Project Ouroboros',
    category: 'Technical Novel',
    kind: 'site',
    siteUrl: '',
    repoUrl: 'https://github.com/clarkngo/project-ouroboros',
    tags: ['Pandoc', 'Manuscript', 'GitHub Pages', 'Novel'],
    summary:
      'Pattern: Pandoc/Make manuscript → HTML/PDF/EPUB → GitHub Pages reading site. Prompt builds publishing plumbing for *your* book — never copies the Ouroboros novel.',
    prompt: dedent(`
      # Build a long-form manuscript reading site (pattern)

      You are a technical writer and publishing engineer. Build a GitHub Pages reading experience fed by a Pandoc manuscript pipeline for an **original book** you invent.

      ${originality({
        pattern: 'Markdown manuscript → Pandoc/Make → Pages reading site',
        references: [
          'https://github.com/clarkngo/project-ouroboros (pipeline / repo shape only)',
        ],
        forbidden: [
          'Do NOT reproduce Project Ouroboros title, plot, characters (Alex, Devon, Claire, Victor, Sloan, etc.), chapter text, or docs bible content.',
          'Do NOT paste any novel prose from the reference repo.',
          'Invent your own working title, characters, and sample chapters (short stubs are enough).',
        ],
      })}

      ## Target Architecture & Stack
      - Manuscript Markdown under act/part folders (\`chNN-slug.md\`, lexical order).
      - Makefile + Pandoc → html / pdf / epub / site.
      - \`templates/metadata.yaml\`, \`templates/manuscript.css\`.
      - Optional \`docs/\` for *your* glossary/character notes.
      - GitHub Actions publish on push to \`main\`.

      ## Product purpose
      Calm long-form reading site for a technical or business novel (or non-fiction book) that you own. Typography for long sessions; chapter navigation; not a marketing landing page.

      ## Key Features & Layout Rules
      - Front matter + multi-act/part structure with original stub chapters.
      - Optional sticky chapter nav / progress.
      - Reading CSS: measure, leading, contrast. Original title in metadata.

      ## Artifact Tree
      manuscript/… · templates/ · docs/ · Makefile · .github/workflows/publish.yml · site/

      ## Step-by-Step Implementation Strategy
      1. Scaffold Makefile targets (html, pdf, epub, site, clean).
      2. Add original metadata + a few stub chapters.
      3. Style the HTML build for long reading.
      4. Wire Actions to deploy \`site/\`.
      5. Proof on phone and desktop.

      ## Acceptance Criteria
      - [ ] No Ouroboros IP in the output.
      - [ ] \`make html\` / \`make site\` succeed with your book title.
      - [ ] Pages deploy produces a readable site.
    `),
  },
  {
    id: 'maritime-atlas-illustrations',
    title: 'Maritime Atlas — Illustrations',
    category: 'Page Blueprint',
    kind: 'page',
    siteUrl: 'https://clarkngo.github.io/maritime-atlas/illustrations.html',
    repoUrl: 'https://github.com/clarkngo/maritime-atlas',
    tags: ['Page', 'Gallery', 'Attribution', 'Maritime Atlas'],
    summary:
      'Pattern: single-page reviewed raster gallery with tags, lightbox, and attribution. Prompt builds an illustrations page for *your* atlas — not a copy of Maritime Atlas assets.',
    prompt: dedent(`
      # Build a reviewed illustrations gallery page (pattern)

      You are a frontend engineer. Build **one page** (gallery) inside an existing docs/atlas site — or a tiny stand-alone page — for GitHub Pages. Use an **original page and product name**.

      ${originality({
        pattern: 'filtered raster gallery + lightbox attribution + review-before-publish',
        references: [
          'https://clarkngo.github.io/maritime-atlas/illustrations.html (UX reference)',
          'https://github.com/clarkngo/maritime-atlas (repo shape reference)',
        ],
        forbidden: [
          'Do not copy Maritime Atlas branding, image assets, captions, or attribution text.',
          'Do not hotlink reference images; use your own placeholders or openly licensed demos.',
        ],
      })}

      ## Scope (page blueprint)
      - Deliver one gallery page/route, not a full-site redesign.
      - Raster gallery only (photos / AI illustrations). Schematics can live elsewhere.

      ## Target Architecture & Stack
      - Match a simple static stack (HTML/JS or the host site's tooling).
      - Your base path. Client-side filters. No backend.

      ## Product purpose
      Topic-tagged illustrations with human review before publish; lightbox shows caption, attribution, and generation tool/model credits.

      ## Key Features & Layout Rules
      - Intro + "review before publication" callout.
      - Tag filters; empty state; thumbnail grid; accessible lightbox (keyboard, focus trap, alt text).
      - Unreviewed items must not look published.

      ## Component Tree
      Shell → IllustrationsPage → Intro, ReviewCallout, TagFilters, ImageGrid/Thumbnail, Lightbox (Attribution, ModelCredits)

      ## Acceptance Criteria
      - [ ] Original branding and demo images.
      - [ ] Filters + lightbox work; attribution visible.
      - [ ] Page loads under your base path.
    `),
  },
]

const gated = dedent(`
  # Build a gated ebook library (pattern)

  You are a frontend engineer. Build a static GitHub Pages ebook library with lead-capture unlock. Invent an **original library brand** (do not use CityU, City University, or "CityU Guides").

  ${originality({
    pattern: 'browse guides → short form gate → on-page download unlock',
    references: [
      'https://clarkngo.github.io/cityu-ebooks/ (flow reference only)',
      'https://github.com/clarkngo/cityu-ebooks',
    ],
    forbidden: [
      'Do not use City University of Seattle / CityU naming, logos, or guide titles/covers from the reference.',
      'Do not copy reference marketing copy; write original blurbs for fictional or your-owned guides.',
    ],
  })}

  ## Target Architecture & Stack
  - Static site. Your slug / base \`/<slug>/\`.
  - Embedded third-party form (e.g. Google Form) for the gate. No custom backend.
  - Deploy with GitHub Actions.

  ## Product purpose
  Practical free guides for a defined audience you invent. Browse → share a few details → download unlocks on the same page.

  ## Key Features & Layout Rules
  - Guide grid (cover placeholder, title, blurb) with **original** titles.
  - How-it-works: choose → form → unlock.
  - Download stays locked until the gate completes; unlock on-page after submit.
  - Accessible controls. Original visual identity — not the reference skin.

  ## Component Tree
  LibraryPage → Header, HowItWorks, GuideGrid/GuideCard, GatePanel (EmbeddedForm, DownloadUnlock)

  ## Acceptance Criteria
  - [ ] No CityU / reference branding in the UI.
  - [ ] Gate then unlock works; builds under your base path.
`)

const openLib = dedent(`
  # Build an open ebook library (pattern)

  You are a frontend engineer. Build a static GitHub Pages ebook library with **no lead gate**. Invent an **original library brand** (do not use CityU / City University / "CityU Guides").

  ${originality({
    pattern: 'immediate-download ebook library (ungated)',
    references: [
      'https://clarkngo.github.io/cityu-ebooks/ (layout reference only)',
      'https://github.com/clarkngo/cityu-ebooks',
    ],
    forbidden: [
      'Do not use CityU / City University branding, logos, or reference guide titles/covers.',
    ],
  })}

  ## Target Architecture & Stack
  - Static site. Your slug / base. Direct file links. No form. Actions deploy.

  ## Product purpose
  Same library pattern as the gated variant, but every guide downloads immediately — for demos, classrooms, or accessibility-first mirrors.

  ## Key Features & Layout Rules
  - Guide grid with original titles; primary Download per card.
  - Optional one-line how-it-works. No fake unlock animation.
  - Show file type (and size when known).

  ## Component Tree
  LibraryPage → Header, GuideGrid/GuideCard/DownloadButton

  ## Acceptance Criteria
  - [ ] No CityU / reference branding.
  - [ ] One-click download; no email gate; builds under your base path.
`)

const cityu = data.find((item) => item.id === 'cityu-ebooks')
cityu.prompt = gated
cityu.promptModes = [
  { id: 'gated', label: 'Gated download', prompt: gated },
  { id: 'open', label: 'Open library', prompt: openLib },
]

writeFileSync(new URL('../src/data/blueprints.json', import.meta.url), `${JSON.stringify(data, null, 2)}\n`)
console.log(
  data
    .map((d) => `${d.id}: prompt mentions clone-ban=${/Originality|Do not copy|Do NOT/.test(d.prompt)}`)
    .join('\n'),
)

import { writeFileSync } from 'node:fs'

function dedent(text) {
  const trimmed = text.replace(/^\n/, '').replace(/\s+$/, '')
  const lines = trimmed.split('\n')
  const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^ */)[0].length)
  const cut = indents.length > 0 ? Math.min(...indents) : 0
  return lines.map((line) => line.slice(cut)).join('\n')
}

const data = [
  {
    id: 'problem-atlas',
    title: 'Problem Atlas',
    category: 'Interactive Decision Map',
    siteUrl: 'https://clarkngo.github.io/problem-atlas/',
    repoUrl: 'https://github.com/clarkngo/problem-atlas',
    tags: ['React Flow', 'Vite', 'Tailwind', 'Dagre', 'Fuse.js'],
    summary:
      'Interactive node-based scenario map allowing users to navigate domain challenges down to AI solutions, process improvements, and requirement blockers. Search the map, follow the edges, and open a node to see what unblocks the next step.',
    prompt: dedent(`
      # Build Problem Atlas

      You are an expert frontend architect. Build a production-ready interactive decision map called "Problem Atlas" and ship it as a static GitHub Pages site.

      Live reference: https://clarkngo.github.io/problem-atlas/
      Repository: https://github.com/clarkngo/problem-atlas

      ## Target Architecture & Stack
      - Vite, React, TypeScript, and Tailwind CSS.
      - React Flow for the node canvas, with custom nodes.
      - Dagre for automatic top-down layout. Do not hand-place a large graph.
      - Fuse.js for fuzzy search across challenges, solutions, and blockers.
      - Client-side only. Typed JSON is the database.
      - Set Vite base to /problem-atlas/ before you reference any asset.
      - Deploy the dist folder with GitHub Actions.

      ## Product purpose
      Problem Atlas lets a person start at a domain challenge and walk downward through process improvements, AI solution options, and the requirement blockers in the way. It should feel like an operational atlas: dense, calm, and fast to scan.

      ## Key Features & Layout Rules
      - The canvas fills the viewport. A slim header carries the title, the active domain, and search.
      - Three node types, each visually distinct and readable at the default zoom: Challenge, Solution, and Blocker.
      - Edges show direction. A challenge leads to an improvement or a solution. A blocker attaches as a constraint.
      - Clicking a node opens a detail panel with the summary, prerequisites, and neighboring nodes. On a phone that panel is a bottom sheet.
      - Search highlights matches and frames the first hit. A query with no matches explains itself in the toolbar.
      - Include fit-view, zoom, and reset-layout controls.
      - Choose one visual material and stay with it. Do not ship the default React Flow demo theme.

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
      - Node: id, type (challenge | solution | blocker), title, summary, domain, tags, requirements[]
      - Edge: id, source, target, relation (leads-to | improves | blocked-by)
      - Seed at least two domains. Each challenge reaches both a solution and a blocker.

      ## Step-by-Step Implementation Strategy
      1. Scaffold Vite + React + TypeScript and Tailwind. Set the base path to /problem-atlas/.
      2. Define the TypeScript model and a realistic seed file.
      3. Build the three custom nodes and a Dagre layout helper that returns ranked positions.
      4. Render the graph in React Flow. Fit the view on load.
      5. Add Fuse.js search that dims non-matching nodes and focuses the first match.
      6. Add the detail panel, legend, domain filter, and mobile bottom sheet.
      7. Check keyboard access, contrast, and the phone layout.
      8. Add the GitHub Actions workflow that builds and deploys dist to GitHub Pages.

      ## Acceptance Criteria
      - [ ] The map lays itself out and stays readable at the default zoom.
      - [ ] Search, domain filter, and node details work without a reload.
      - [ ] Challenge, solution, and blocker are distinguishable without relying on color alone.
      - [ ] The phone layout keeps the canvas usable and moves details into a bottom sheet.
      - [ ] The production build loads at /problem-atlas/ with no missing assets.
    `),
  },
  {
    id: 'physical-ai',
    title: 'Physical AI & Operational Tech',
    category: 'Documentation & Lab Hub',
    siteUrl: 'https://clarkngo.github.io/physical-ai/',
    repoUrl: 'https://github.com/clarkngo/physical-ai',
    tags: ['Astro', 'Tailwind', 'Cyber-Physical Systems'],
    summary:
      'Interactive educational hub exploring Cyber-Physical Systems, Digital Twins, and Operational Technology automation. Chapters walk from a plain-language concept to how that concept shows up in sensors, control loops, and shop-floor systems.',
    prompt: dedent(`
      # Build Physical AI & Operational Tech

      You are a technical educator and frontend engineer. Build a modern static documentation and lab site called "Physical AI & Operational Tech" for GitHub Pages.

      Live reference: https://clarkngo.github.io/physical-ai/
      Repository: https://github.com/clarkngo/physical-ai

      ## Target Architecture & Stack
      - Astro with TypeScript and Tailwind CSS.
      - Content lives in Markdown or MDX collections, not in one giant page component.
      - No backend and no account system.
      - Set the Astro base to /physical-ai/.
      - Deploy the static build with GitHub Actions.
      - Use a client island only if a single widget needs state. Reading must work without it.

      ## Product purpose
      An educational hub for Cyber-Physical Systems, digital twins, and operational technology automation. A reader should move from a plain-language concept to how that concept shows up on a real system: sensors, control loops, twins, and the operational risks around them.

      ## Key Features & Layout Rules
      - Home is a map of the subject: three or four entry paths, not a marketing hero.
      - A persistent sidebar lists the chapters. The current page is obvious.
      - Each chapter is short, with a definition, a concrete system example, and a note on where it fails.
      - Cover cyber-physical systems, digital twins, and operational technology automation.
      - Use callouts for definitions, lab notes, and safety or failure warnings.
      - Diagrams are designed figures with a caption and a one-sentence reading guide.
      - The page column is a comfortable reading measure. Code and tables scroll inside themselves.
      - Pick a lab / field-manual visual material. Do not clone a default docs theme and only change the logo.

      ## Component Tree
      BaseLayout
        Header
        Sidebar
        Chapter
          Definition
          Figure
          Callout
          NextPrev
        Home (subject map)

      ## Step-by-Step Implementation Strategy
      1. Scaffold Astro + TypeScript + Tailwind. Set base to /physical-ai/.
      2. Define a content collection for chapters: title, summary, order, section, and body.
      3. Build the base layout, sidebar, and header. Mark the active chapter.
      4. Build the home page as a subject map that links into the collection.
      5. Write starter chapters for cyber-physical systems, digital twins, and OT automation. Include one figure and one warning callout in each.
      6. Add previous and next links from the collection order.
      7. Check the phone layout, contrast, and focus states.
      8. Add the GitHub Actions workflow that builds and deploys the static output to GitHub Pages.

      ## Acceptance Criteria
      - [ ] A new chapter is added by creating a content file, not by editing a router by hand.
      - [ ] Home, sidebar, and chapter pages share one layout.
      - [ ] The three core themes include a concrete system example, not only a definition.
      - [ ] The site is readable on a phone without horizontal page scroll.
      - [ ] The production build loads at /physical-ai/ with no missing assets.
    `),
  },
  {
    id: 'prompt-builder',
    title: 'Prompt Builder',
    category: 'Utility App',
    siteUrl: 'https://clarkngo.github.io/prompt-builder/',
    repoUrl: 'https://github.com/clarkngo/prompt-builder',
    tags: ['React', 'Tailwind', 'LLM Utility'],
    summary:
      'Interactive tool for composing, parameterizing, and formatting structured system prompts for LLMs. Fill a template\'s variables, watch the assembled prompt update, and copy it without sending it to a model.',
    prompt: dedent(`
      # Build Prompt Builder

      You are an AI tools engineer. Build a client-side React app called "Prompt Builder" for composing, parameterizing, and formatting structured system prompts. Ship it on GitHub Pages.

      Live reference: https://clarkngo.github.io/prompt-builder/
      Repository: https://github.com/clarkngo/prompt-builder

      ## Target Architecture & Stack
      - React, TypeScript, Vite, and Tailwind CSS.
      - Persist templates in localStorage. No account, no database, and no model API.
      - The tool formats a prompt. It does not call an LLM and it never asks for an API key.
      - Set Vite base to /prompt-builder/.
      - Deploy dist with GitHub Actions.

      ## Product purpose
      A workbench where a system prompt is a template with named variables, not one brittle text blob. The user picks a template, fills the fields, sees the assembled prompt update, and copies it.

      ## Key Features & Layout Rules
      - The first screen is the workbench: template list, variable form, and live assembled prompt.
      - A template has a name, a short description, and a body. Variables are written as double-brace tokens and rendered as labeled fields.
      - Editing a field updates the assembled prompt immediately. Unfilled tokens stay visible.
      - Seed a coding-agent template, a writing-editor template, and a research-brief template.
      - Let the user save, duplicate, and delete their own templates. Seed templates can be duplicated, not destroyed.
      - Copy puts the assembled prompt on the clipboard and confirms it.
      - Parameterize with structured fields. Do not add a control that calls a model.
      - Phone layout stacks the form above the preview. Desktop shows them side by side.
      - Choose a precise, tool-like visual material. Do not ship a generic chat-app clone.

      ## Component Tree
      App
        Header
        TemplateList
        VariableForm
        PromptPreview
        TemplateEditor
        Toast

      ## Data model
      - Template: id, name, description, body, builtin
      - Scan the body for double-brace tokens and render one field per token name.
      - Store user templates and the current draft in localStorage under a versioned key.

      ## Step-by-Step Implementation Strategy
      1. Scaffold Vite + React + TypeScript and Tailwind. Set base to /prompt-builder/.
      2. Define the template model, the token parser, and the assembler. Cover a missing value, a repeated token, and a body with no tokens.
      3. Seed three builtin templates.
      4. Build the workbench layout: list, form, and preview.
      5. Add save, duplicate, and delete for user templates, with localStorage hydration on load.
      6. Add copy with a success and failure message, plus an empty state for a template with no fields.
      7. Check the phone stack, the desktop split, keyboard access, and contrast.
      8. Add the GitHub Actions workflow that builds and deploys dist to GitHub Pages.

      ## Acceptance Criteria
      - [ ] Changing a variable updates the preview immediately.
      - [ ] A template with two tokens produces those fields and no others.
      - [ ] User templates survive a reload. Builtin templates survive a delete attempt.
      - [ ] Copy writes the assembled prompt once every field is filled.
      - [ ] The app never requests an API key.
      - [ ] The production build loads at /prompt-builder/ with no missing assets.
    `),
  },
]

writeFileSync(new URL('../src/data/blueprints.json', import.meta.url), `${JSON.stringify(data, null, 2)}\n`)

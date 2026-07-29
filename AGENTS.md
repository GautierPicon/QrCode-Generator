# AGENTS.md

## Commands

| Command | Action |
|---------|--------|
| `bun run dev` | Start dev server |
| `bun run build` | Production build |
| `bun run preview` | Preview production build |
| `bun run check` | Typecheck (svelte-check) |
| `bun run lint` | Prettier check + ESLint |
| `bun run format` | Prettier write |

Always run `bun run lint && bun run check && bun run build` before committing.

## Stack

- **Svelte 5** — runes mode forced via `vite.config.ts` (no `$:` syntax, use `$state` / `$derived` / `$effect`)
- **TailwindCSS v4** — configured via `@import 'tailwindcss'` in `layout.css`; no `tailwind.config.js`
- **qr-code-styling** v1.9.2 — renders QR code into a `<div>` container (creates its own canvas internally). Use `new QRCodeStyling(options)`, `.append(el)`, `.update(options)`, `.download({ name, extension })`
- **Bun** — package manager
- **Single page app** — all UI in `src/routes/+page.svelte`

## Conventions

- **Prettier**: tabs, single quotes, no trailing commas (`prettier.config.js`)
- **Color inputs**: use `value={var} oninput={...}` instead of `bind:value` (avoids hydration error `""` on `<input type="color">`)
- **Dark theme**: `<body class="bg-neutral-950">` in `app.html`
- **Logo**: uploaded via file input → blob URL → passed as `image` in `qr-code-styling` options; error level auto-forces to `'H'` and restores previous on removal
- **No tests** in the project

## Key files

| Path | Role |
|------|------|
| `src/routes/+page.svelte` | Main page (all UI) |
| `src/routes/+layout.svelte` | Root layout (CSS, favicon, console easter egg) |
| `src/routes/layout.css` | TailwindCSS import |
| `src/scripts/ConsoleArt.ts` | Console easter egg |
| `src/app.html` | HTML shell (body has `bg-neutral-950`) |
| `src/lib/assets/` | Static assets (logo, favicon, github.png) |

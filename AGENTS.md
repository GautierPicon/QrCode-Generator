# AGENTS.md

## Commands

| Command           | Action                   |
| ----------------- | ------------------------ |
| `bun run dev`     | Start dev server         |
| `bun run build`   | Production build         |
| `bun run preview` | Preview production build |
| `bun run check`   | svelte-check + typecheck |
| `bun run lint`    | Prettier check + ESLint  |
| `bun run format`  | Prettier write           |

Always run `bun run lint && bun run check && bun run build` before committing.

## Stack

- **Svelte 5 runes** — forced via `vite.config.ts`. Use `$state`/`$derived`/`$effect`, never `$:`
- **TailwindCSS v4** — `@import 'tailwindcss'` in `layout.css`; no `tailwind.config.js`
- **qr-code-styling** v1.9.2 — creates its own `<canvas>` inside a container `<div>`. API: `new QRCodeStyling(options)`, `.append(el)`, `.update(options)`, `.download({ name, extension })`
- **Bun** — package manager
- **Single page app** — all UI in `src/routes/+page.svelte`; components in `src/lib/components/`

## Conventions

- **Prettier**: tabs, single quotes, no trailing commas (`prettier.config.js`)
- **Color inputs**: use `value={var} oninput={...}` + `bind:this` + `onMount` set `.value` (avoids hydration error `""` on `<input type="color">`). Never `bind:value` on color inputs.
- **Dark theme**: `<body class="bg-neutral-950">` in `app.html`
- **Logo**: file input → blob URL → `image` option in qr-code-styling. Forces error level to `'H'` while set, restores previous on removal.
- **URLSearchParams**: ESLint rule `svelte/prefer-svelte-reactivity` rejects bare `new URLSearchParams()`. Suppress with `// eslint-disable-next-line svelte/prefer-svelte-reactivity` (we only use it to build a string, never reactively).
- **Prop initialization from `data`**: Svelte 5 warns `state_referenced_locally` when reading `$props()` values inside `$state()`. Intentional — suppress with `// svelte-ignore state_referenced_locally` per line.
- **No tests** in the project.

## Data types & buildData()

All QR content is built by `buildData()` in `+page.svelte`. Per-type output:

| Type    | Input fields                      | Encoded output                                     |
| ------- | --------------------------------- | -------------------------------------------------- |
| text    | single textarea                   | raw content                                        |
| url     | single textarea                   | raw URL                                            |
| email   | single textarea                   | `mailto:` + content                                |
| phone   | single textarea                   | `tel:` + content                                   |
| sms     | single textarea                   | `sms:` + content                                   |
| wifi    | SSID + Security select + Password | `WIFI:T:{sec};S:{ssid};P:{pwd};;`                  |
| contact | 6 text inputs (name, org, etc.)   | vCard (`BEGIN:VCARD\nVERSION:3.0\n...\nEND:VCARD`) |

Empty fields fall back to example values (visible in Data Preview).

## URL sharing

Search params read via `+page.ts` `load` function, passed as `data` prop to `+page.svelte`:

```
/?type=url&content=https%3A%2F%2Fexample.com
/?type=wifi&ssid=MyWiFi&security=WPA&password=123
/?type=contact&firstName=John&lastName=Doe
```

## Key files

| Path                                      | Role                                                      |
| ----------------------------------------- | --------------------------------------------------------- |
| `src/routes/+page.svelte`                 | Main page: state, buildData, render, all components       |
| `src/routes/+page.ts`                     | Load function — reads search params                       |
| `src/routes/+layout.svelte`               | Layout: CSS import, console easter egg                    |
| `src/routes/layout.css`                   | TailwindCSS import                                        |
| `src/lib/types.ts`                        | `Label`, `labels`, `types` constants                      |
| `src/lib/components/QRData.svelte`        | Data type select + conditional input fields               |
| `src/lib/components/Customization.svelte` | Size, margin, colors, error level, logo                   |
| `src/lib/components/QRCodeDisplay.svelte` | QR preview, Download PNG, Copy URL buttons                |
| `src/lib/components/DataPreview.svelte`   | Raw data preview box                                      |
| `src/lib/components/GitHubLink.svelte`    | Open source link                                          |
| `src/app.html`                            | HTML shell, dark body class, favicons                     |
| `static/favicons/`                        | Favicon files (`.png`, `.ico`) served at `/favicons/`     |
| `src/scripts/ConsoleArt.ts`               | Browser console easter egg (guarded with `browser` check) |

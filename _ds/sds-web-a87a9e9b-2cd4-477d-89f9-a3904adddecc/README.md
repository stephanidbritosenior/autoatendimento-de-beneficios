# Senior Design System (SDS)

This project is a **design system** for the **Senior Design System (SDS)** — the internal product design language used by **[Senior Sistemas](https://www.senior.com.br/)**, a Brazilian enterprise-software vendor (ERP, HCM, healthcare, manufacturing, …). The system targets **desktop web** interfaces at 1366×768 and is built on top of **Angular 18 + Tailwind + PrimeNG**.

It exists so an AI designer (Claude) can generate well-branded interfaces, mocks, and prototypes that look and behave like Senior's real products — using only the components, tokens and patterns of SDS rather than inventing new ones.

## Sources

| Source | Where to find it |
|---|---|
| **Component library (Angular)** | `@seniorsistemas/angular-components` — code mounted at `angular-components-develop/`. 70+ Angular 18 sub-packages (button, panel, accordion, table, …) + a Showcase app + Storybook. |
| **Figma — Componentes** | `vdHhfUXeq3134AcvWTRqcO` — `https://www.figma.com/design/vdHhfUXeq3134AcvWTRqcO/-SDS---WEB--Componentes`. Mounted as a virtual FS in this session. |
| **Notion (SDS guidelines)** | Root page id `1baecabc23b98091a6bce701b959f1d5`. Each component has a Notion page with do's/don'ts, variants, Figma specs. |
| **PrimeNG theme** | `@seniorsistemas/primeng-theme` — applied globally to all primeng controls. |
| **Authoring guide** | `uploads/SDS_CLAUDE_DESIGN_INSTRUCTIONS.md` — full taxonomy of components, decision trees, golden rules. |

Reader has access to **none** of those by default — the salient details have been distilled into this folder.

## Index — what's in this folder

| Path | What |
|---|---|
| `colors_and_type.css` | All color & type tokens (CSS vars), plus semantic type presets (`.sds-body`, `.sds-label`, etc). Wires the local Open Sans variable font. |
| `fonts/` | Open Sans variable font (regular + italic). |
| `assets/` | Senior wordmark + glyph SVGs (use the glyph only in loading state / Navbar). |
| `preview/` | Design-system reference cards (typography, palette, components) — populates the **Design System** tab. |
| `ui_kits/sds-desktop/` | Clickable React+Babel recreation of the SDS desktop product. See its own README for the screen list. |
| `SKILL.md` | Agent Skill manifest — makes this folder usable as a Claude Code skill. |

---

## CONTENT FUNDAMENTALS

SDS ships **enterprise B2B software in Brazilian Portuguese** (with es-CO, es-419 and en-US fallbacks). Copy is **clear, neutral, and professional** — not playful.

### Language

- **Portuguese (pt-BR) is the primary voice.** All button labels in the codebase are in pt-BR: *Salvar*, *Cancelar*, *Excluir*, *Buscar*, *Selecione…*, *Próximo*, *Concluir*. English & Spanish are translations of the same patterns (see `projects/angular-components/src/lib/locale/`).
- **Formal "você"** — the user is addressed as a professional, never with slang. No "tu", no "tá".
- **Domain-rich** — copy uses real enterprise nouns: *Colaborador*, *Workspace*, *Cadastro*, *Tabela*, *Histórico*, *Auditoria*.

### Casing

- **Sentence case** everywhere except where the system *explicitly* asks for uppercase:
  - **Accordion headers** → `UPPERCASE + Bold` (the one place uppercase is mandatory).
  - **Section Title** → Sentence case.
  - **Buttons** → Sentence case, never ALL CAPS, never Title Case.
- **Labels** → "Nome", "E-mail", "Cargo" — no trailing colon (`:`), no bold.

### Tone

- **Helper text is neutral and instructional**, not chatty.
  - ✅ "Mínimo de 8 caracteres com letras maiúsculas e símbolos."
  - ❌ "Capricha numa senha forte! 🔒"
- **Empty / error states use respectful active voice**, with one clear action.
  - "Nenhum resultado encontrado. Refine sua busca."
  - "Não foi possível salvar. Verifique os campos destacados."
- **Confirmation dialogs** state the consequence first, then ask.
  - Header: "Excluir colaborador?" — Body: "Esta ação não poderá ser desfeita."

### Emoji

- **No emoji in product UI.** The Rating Scale "Happiness Index" uses face icons (😞→😄) but they are SVG illustrations from the component, not Unicode emoji.
- Marketing surfaces may use them; product surfaces never.

### Unicode glyphs

- **Asterisk** (`*` in red `#C13018`) for required fields.
- **Lowercase i in a circle** (Font Awesome `info-circle`) for hint tooltips on field labels.
- **×** to clear a selected value (Select, Chip).

---

## VISUAL FOUNDATIONS

SDS is a **calm, dense, business-software UI**. Backgrounds are flat off-white, accents are scarce, and every pixel has a job. Whitespace is generous *inside* containers but layouts are dense.

### Color vibe

- **One dominant accent — azul-laguna `#428BCA`** — used for primary buttons, focus rings, links, selected states, and progress.
- **Senior brand green `#00C89A`** appears only on the **loading "logo indicator"** (pulses around the Senior glyph). It is **not** a UI surface color — never paint a button or chip with it.
- **Grayscale ramp does 90% of the work** — `#F5F6F7` page, `#FFFFFF` cards, `#DEDCE5` separators, `#212533` text. The UI is mostly black-on-white.
- **Criticality colors are reserved** for status (blue/green/yellow/red), badges, and panel severity stripes — not decoration.

### Typography

- **Open Sans, Regular 400 + Bold 700** is the product face — body, labels, buttons, components, the workspace switcher, badges, everything. SemiBold appears only twice in the whole Figma. No display-serif, no monospace except in code editor.
- **Inter 24px** is used for **one thing only: the module title in the Page header** (`Título do módulo`). It is the single Inter usage in the product UI — everything else is Open Sans. Don't use Inter anywhere else.
- **Body = 14px / 1.5.** Helper = 12px. There is essentially no other size in the product UI; bigger sizes are for marketing pages or empty-state hero illustrations.
- **Label rules are sacred:**
  - Field label → **Regular** (never bold) + sentence case + no colon.
  - Label Value → label Regular `#6E7280`, value **Bold** `#212533`. Never same weight.
  - Accordion header → Bold + UPPERCASE.

### Spacing

- **4-pt scale** internally — `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40`. The `20px` and `24px` rungs map exactly to the Checkbox/Radio and Switch heights, so vertical alignment between controls is automatic.
- Panels have `20px` inner padding. Form rows have `16px` gap. Buttons have `5px 10px` padding inside a `35px` tall pill.

### Borders, radii, shadows

- **Borders are thin (`1px`) and quiet (`#C1C1CC`).** No double-borders, no thick accents.
- **Radii are SMALL.** `3px` on inputs, `4px` on buttons, `6px` on fieldsets. Anything `>10px` is reserved for switch toggles and pill badges. The system is not "fluffy" — it does not use 12/16/24px rounded cards.
- **Shadows are minimal:** drop-shadow filters only, never offset-y > 6px. Three elevation steps:
  1. Tooltip — `0 1px 2.5px rgba(0,0,0,.25)`
  2. Dropdown — `0 4px 2.5px rgba(0,0,0,.20)`
  3. Spotlight (max) — a 3-layer Material-like stack
- **Cards have a 1px border, no shadow.** A card with both border and shadow is wrong.

### Backgrounds & imagery

- **Page background = `#F5F6F7`** (one off-white tone, always flat).
- **No gradients in chrome.** The single exception is the *Thumbnails* component, which fills empty thumbnails with `linear-gradient(to top right, #5288b6, #00c89a)` — Senior's brand gradient.
- **No textures, no patterns, no full-bleed photography in product UI.** Imagery only appears in empty-states, Spotlight tour cards, and Object Cards.
- **Brand imagery is warm-cool corporate** — corporate photos when used (Spotlight onboarding cards). Marketing site goes warmer.

### Animation & easing

- **Motion is purposeful and short.**
  - Buttons: `transition: 200ms ease-out` on background-color, border-color, color.
  - Panel severity border: `500ms ease`.
  - Loading-logo: `1s infinite pulse + scale` — the only continuous animation in the system.
- **No bounce, no spring, no parallax, no easing curves longer than ~250ms.**

### Hover / press / focus

- **Hover:** darken background by ~15% (buttons); change `#FFFFFF`→`#EEEBF2` (rows, menu items, caret area). Link-style text becomes `darken(#428BCA, 15%)`.
- **Press / active:** darken by ~20% (buttons); same color change but slightly deeper.
- **Focus:** **`#22DCE6` cyan border on buttons** (a brighter focus ring, distinct from the primary blue). Inputs in focus get a `#428BCA` border.
- **Disabled:** `opacity: 0.5`. No filter, no desaturation.

### Transparency / blur

- **The system avoids blur entirely.** Tooltip background uses solid `rgba(14,17,25,0.9)`. Modals use a flat backdrop, not a blurred one.
- **Transparency** is used only for: shadow alphas, tooltip, disabled state opacity.

### Layout rules

- **Topbar = fixed, 70px tall, white** with a `1px` bottom border. Always at the top.
- **Sidebar/Navigation = left, fixed.** Off-canvas on mobile.
- **Page content = card on a `#F5F6F7` page.** Cards/Panels never nest (Panel-in-Panel is forbidden).
- **Form columns = 12-column grid.** File Picker is always full-width (12 cols).
- **Action buttons row:** Cancelar (terciário) on the LEFT, Secundário + Primário on the RIGHT.

### Iconography

- **Font Awesome 5 Solid + Regular** is the *only* icon system. Loaded via `@fortawesome/fontawesome-pro`. The most-used glyphs in the file are *caret-down*, *plus*, *search*, *chevron-down*, *star* — utilitarian icons, never decorative.
- **Two custom SVGs** beyond Font Awesome: the **Senior glyph** (loading indicator) and the **IAssist mark** (Sara AI assistant). Both shipped via `s-svg-factory` directive.
- **No emoji.** No PNG icons. No Lucide / Heroicons / Material — *only* Font Awesome.
- **Icon size = 16px in buttons, 20px in field affixes, 24px in section titles.**

### Cards (in summary)

A Senior card is:
- White (`#FFFFFF`) surface
- 1px border `#DEDCE5` or `#C1C1CC` — never both border + shadow
- 20px padding
- 6px outer radius for fieldsets; 4px or 0px for content panels
- Bold header on top, optional severity stripe on the left edge
- Footer row aligns Cancel-left, Primary-right

---

## ICONOGRAPHY

| What | How |
|---|---|
| **Icon font** | **Font Awesome 5 Pro** — Solid + Regular weights. Used via the `iconClass` prop on buttons/badges (e.g. `iconClass="fa fa-save"`). |
| **Loader / brand glyph** | `assets/senior-glyph.svg` — the white "S" mark used by `<s-loading-state indicator="logo">`. Animated with a pulsing green halo on the brand color `#00C89A`. |
| **Wordmark** | `assets/logo-senior.svg` (white, for dark surfaces) and `assets/logo-senior-mono.svg` (monochrome, for print). Extracted from the Figma's shared library. |
| **Country flags** | Sprite-based flags in `angular-components/src/lib/assets/flags/` — used inside the Country Phone Picker. Not copied here (only relevant in that one component). |
| **AI mark (IAssist)** | The "Sara" assistant icon — a stylized geometric SVG. Embedded inline in the `s-svg-factory` directive; not used outside IA surfaces. |
| **Emoji** | Not used. |
| **Unicode** | `*` (required), `×` (clear), `ℹ` (rendered via Font Awesome `info-circle`). |

For demos in this design system we load **Font Awesome 6 Free** via CDN as the closest open substitute for FA 5 Pro. **⚠ Substitution to flag with user:** FA 6 Free is missing a handful of Pro-only glyphs (e.g. `fa-circle-info` Pro-only variants); replace with FA 5 Pro when shipping a production design.

---

## Fonts

- **Open Sans** is loaded locally from `fonts/OpenSans-VariableFont_wdth_wght.ttf` + `fonts/OpenSans-Italic-VariableFont_wdth_wght.ttf` (Google Fonts variable build). Wired via `@font-face` in `colors_and_type.css`. The variable axis exposes weight `300–800` and width `75–125%`; we use weight 400 and 700 in the product UI.
- **Inter** is used in the product UI for exactly one role — the **module title in the Page header (Inter 24px)**. Self-hosted from `fonts/Inter-VariableFont_opsz_wght.ttf` via `@font-face`. Everything else is Open Sans.
- **Font Awesome 6 Free** substitutes Font Awesome 5 Pro. Two-tone/light variants are unavailable; we use Solid + Regular only.

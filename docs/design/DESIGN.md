# UI — Style Reference
> a restrained technical document on a pure white field

**Theme:** light

This system is a pure-white, restrained technical-document style for tutorials and training materials. Structure comes from typography, whitespace, hairline rules, and a small set of explicit visual cues—not from gradients, shadows, textures, or decorative UI chrome. Black, white, and gray carry the document; three controlled accents carry meaning: red-orange for emphasis and obstacles, orange for warnings, and blue for links and directional guidance. Typography leans on Geist's geometric neutrality with tight letter-spacing on display sizes, creating a quiet, code-adjacent voice without becoming a technology-dashboard aesthetic.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Canvas | `#ffffff` | `--color-canvas` | Page background and broadest reading surface |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, popover backgrounds, primary button fills |
| Surface Alt | `#f7f7f7` | `--color-surface-alt` | Subtle structural bands, code blocks, input resting state |
| Ink | `#0a0a0a` | `--color-ink` | Primary text, headings, button labels, icon strokes |
| Ink Soft | `#171717` | `--color-ink-soft` | Filled button backgrounds, secondary text on light surfaces |
| Mid Gray | `#737373` | `--color-mid-gray` | Muted body text, placeholder text, helper labels, icon fills at rest |
| Hairline | `#e5e5e5` | `--color-hairline` | Borders, input outlines, card edges, badge outlines |
| Emphasis | `#FF3700` | `--color-emphasis` | Key emphasis, blockers, obstacles, and must-not-miss callouts |
| Warning | `#FE7E0F` | `--color-warning` | Warnings, cautionary notes, and attention-required states |
| Link | `#0348ED` | `--color-link` | Links, directional text, arrows, and navigational cues |

## Tokens — Typography

### Geist — All interface text — body at 14px/400, headings ranging 24–48px/600, buttons at 13–14px/500. Geist's geometric letterforms and uniform stroke width create a developer-tool neutrality; weight 600 at 48px with -0.05em tracking produces tight, confident display headlines that feel engineered rather than editorial. · `--font-geist`
- **Substitute:** Inter
- **Weights:** 400, 500, 600
- **Sizes:** 12, 13, 14, 16, 18, 24, 30, 36, 48
- **Line height:** 1.10, 1.11, 1.20, 1.33, 1.43, 1.50, 1.56, 1.63, 2.00
- **Letter spacing:** -0.0500em at display (48px), -0.0250em at subheading (24–30px), 0.0500em at caption (12px uppercase). Tracking tightens aggressively at large sizes and loosens slightly at small uppercase labels.
- **OpenType features:** `"ss01" on, "cv11" on`
- **Role:** All interface text — body at 14px/400, headings ranging 24–48px/600, buttons at 13–14px/500. Geist's geometric letterforms and uniform stroke width create a developer-tool neutrality; weight 600 at 48px with -0.05em tracking produces tight, confident display headlines that feel engineered rather than editorial.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.33 | 0.6px | `--text-caption` |
| body | 14px | 1.43 | — | `--text-body` |
| body-lg | 16px | 1.5 | — | `--text-body-lg` |
| subheading | 18px | 1.56 | — | `--text-subheading` |
| heading-sm | 24px | 1.33 | -0.6px | `--text-heading-sm` |
| heading | 30px | 1.2 | -0.75px | `--text-heading` |
| heading-lg | 36px | 1.11 | -0.9px | `--text-heading-lg` |
| display | 48px | 1.1 | -2.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px

**Density:** compact

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 48 | 48px | `--spacing-48` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 24px |
| small | 6px |
| badges | 18px |
| inputs | 18px |
| nested | 10px |
| buttons | 18px |

### Shadows

No shadows. Separate regions with whitespace, hairline borders, and restrained gray surfaces.

### Layout

- **Page max-width:** 1280px
- **Section gap:** 48–80px, implemented as `clamp(48px, 7vw, 80px)`
- **Card padding:** 20px
- **Element gap:** 8px

## Components

### Primary Filled Button
**Role:** High-emphasis action (Submit, Save, Create)

Background #0a0a0a, text #fafafa, border none, radius 18px, padding 0px 12px (compact) or 8px 16px (comfortable), font 14px Geist weight 500. Height ≈ 36–40px. The dark-on-light inversion creates the system's highest-contrast action treatment; the fully rounded radius (18px on a ~36px height) produces perfect pill geometry.

### Secondary Ghost Button
**Role:** Low-emphasis action (Cancel, Back)

Background #f7f7f7, text #0a0a0a, no border, radius 18px, padding 0px 12px or 8px 16px, font 14px weight 500. Soft gray fill reads as a tonal sibling to the primary rather than a muted alternative — both buttons share shape and type, differing only in lightness.

### Outline Button
**Role:** Tertiary action with visible boundary

Background transparent, text #0a0a0a, border 1px solid #e5e5e5, radius 18px, padding 0px 12px or 8px 10px. The hairline border defines the shape without weight — preferred when the button sits inside a card or alongside filled controls.

### Card
**Role:** Content container for blocks, previews, dashboard panels

Background #ffffff, radius 24px, border 1px solid #e5e5e5, no shadow, padding 20px. Cards are defined by a hairline edge and whitespace; they must never look like floating dashboard widgets.

### Nested Card Header/Footer
**Role:** Header or footer strip inside a card

Asymmetric radius — top corners 24px on header, bottom corners 24px on footer. Padding 20px horizontal, transparent fill. Provides a subtle tonal band within card boundaries without introducing a new color.

### Input Field
**Role:** Text entry, search, form controls

Background #f7f7f7 (resting) or transparent (inline), text #0a0a0a, border none at rest with a 1px #0a0a0a focus ring, radius 18px, padding 8px 10px, font 14px weight 400. The soft gray fill differentiates the input from the card surface beneath it; focus adds a crisp, high-contrast boundary.

### Badge — Solid
**Role:** Tag, status pill, counter

Background #171717, text #fafafa, radius 18px, padding 2px 8px, font 12px weight 500. Pill-shaped at 18px radius — the minimum height creates a capsule tag.

### Badge — Soft
**Role:** Neutral label, category tag

Background #f7f7f7, text #171717, radius 18px, padding 2px 8px, font 12px weight 500. Same capsule geometry as solid badge, tonal variant.

### Badge — Outline
**Role:** Subtle tag with no fill

Transparent background, text #0a0a0a, radius 18px, padding 2px 8px. The lightest-weight tag — used when the label is informational rather than categorical.

### Sidebar Surface
**Role:** Left navigation panel

Background #f7f7f7, full-height, contained width. It is an optional quiet structural band beside the pure-white canvas; use a hairline divider when the boundary needs clarification.

### Breadcrumb Trail
**Role:** Hierarchical path indicator

Inline text with chevron separators, font 14px weight 400, color #737373 for separators and #0a0a0a for the current segment. No background, no borders — purely typographic hierarchy.

### Stat Block
**Role:** Large numeric metric display

Label in 12–14px uppercase #737373, value in 30–48px weight 600 #0a0a0a with tight tracking. Progress bar or comparison text in 14px #737373. The block relies on typographic scale alone — no card chrome — to establish the metric.

### Search Trigger
**Role:** Command palette / search input

Background #f7f7f7, text #737373, radius 18px, padding 8px 10px, with a keyboard shortcut indicator (e.g., ⌘K) right-aligned. Functions as both a button and an input affordance.

### Emphasis / Obstacle
**Role:** Key conclusion, blocker, obstacle, or must-not-miss content

Use #FF3700 for a short label, rule, icon, or small piece of emphasized text. It may mark destructive actions when needed, but its broader semantic role is emphasis and obstruction. Keep its area small.

### Warning
**Role:** Caution, prerequisite, risk, or attention-required note

Use #FE7E0F for warning labels, icons, and left rules. Do not use it as general decoration or for ordinary emphasis.

### Link / Direction
**Role:** Hyperlinks, directional labels, arrows, and navigation cues

Use #0348ED for linked text, directional copy, arrow strokes, and clear next-step cues. Blue should imply movement or destination rather than general decoration.

## Do's and Don'ts

### Do
- Use #0a0a0a on #ffffff for filled buttons — the dark inversion is the only primary action treatment.
- Maintain 18px radius on buttons, inputs, and badges; use 24px on outer cards, 10px on nested regions, and 6px on small utility controls.
- Set display headlines at 48px/600 with -0.0500em tracking — Geist's geometric weight at this size with aggressive tightening produces the engineered headline voice.
- Use #FF3700 for emphasis and obstacles, #FE7E0F for warnings, and #0348ED for links and directional cues.
- Use whitespace and 1px hairlines to establish hierarchy. Keep every surface flat.
- Keep the page canvas pure white. Use #f7f7f7 only for restrained structural differentiation such as code blocks, input fills, or quiet side notes.

### Don't
- Do not introduce chromatic colors beyond #FF3700, #FE7E0F, and #0348ED.
- Do not invent arbitrary border-radius values. Use the named 6px, 10px, 18px, and 24px roles.
- Do not skip the 1px hairline border when a card boundary is necessary; do not add a shadow as a substitute.
- Do not set body text below 14px or above #737373 lightness — the type scale is deliberately compact.
- Do not apply gradients, shadows, noise, paper textures, or decorative accent fills—every surface is flat and solid.
- Do not use letter-spacing wider than 0.05em or tighter than -0.05em; tracking outside this range breaks the typographic system.
- Do not mix filled and outline buttons of the same size in a single row without visual rhythm — alternate ghost or secondary variants.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Canvas | `#ffffff` | Page background, broadest layer |
| 1 | Sidebar | `#f7f7f7` | Optional quiet navigation surface |
| 2 | Card | `#ffffff` | Primary content container, brightest surface |
| 3 | Input Fill | `#f7f7f7` | Resting input field and quiet structural surface |

## Elevation

- **Card:** `none — use a 1px #e5e5e5 border when containment is needed`
- **Button (filled):** `none — relies on tonal contrast`
- **Input (focus):** `1px solid #0a0a0a ring, no shadow`

## Imagery

Illustrations and videos are allowed when they teach something the text cannot communicate as efficiently. They should sit inside the reading flow, use neutral framing, and include captions. Avoid hero photography, decorative graphics, glossy mockups, and imagery used only to create mood. Icons are thin-stroke geometric marks at 1.5–2px in #0a0a0a, #737373, or one of the three semantic accents, used sparingly as functional cues.

## Agent Prompt Guide

**Quick Color Reference**
- Canvas/background: #ffffff
- Card/surface: #ffffff
- Primary text: #0a0a0a
- Muted text: #737373
- Border: #e5e5e5
- Primary action: #171717 (filled action)
- Emphasis / obstacle: #FF3700
- Warning: #FE7E0F
- Link / direction: #0348ED

**Example Component Prompts**
1. Create a document stat card: white (#ffffff) background, 24px radius, 1px solid #e5e5e5 border, no shadow, 20px padding. Label in 12px uppercase #737373, value in 36px Geist weight 600 #0a0a0a with -0.025em tracking.

2. Create a filled dark button: background #0a0a0a, text #fafafa, no border, 18px radius, padding 0px 12px, font 14px Geist weight 500. Height 36px. No shadow — tonal contrast only.

3. Create a ghost secondary button: background #f7f7f7, text #0a0a0a, no border, 18px radius, padding 0px 12px, font 14px weight 500. Same dimensions as the filled button for visual parity.

4. Create an input field: background #f7f7f7, text #0a0a0a, placeholder #737373, no border at rest, 18px radius, padding 8px 10px, font 14px weight 400. On focus: 1px solid #0a0a0a ring with no offset.

5. Create a badge tag: background #171717, text #fafafa, 18px radius (full pill), padding 2px 8px, font 12px Geist weight 500.

## Design Philosophy

The system is built on four principles visible in every token: (1) pure white is the reading field; (2) black, white, and gray carry structure; (3) red-orange, orange, and blue are semantic signals rather than decoration; and (4) hierarchy comes from typography, whitespace, and hairlines—not depth effects. The system is designed to be copied, modified, and owned: every value is explicit, every token is simple, and nothing is locked behind abstraction.

## Similar Brands

- **Vercel** — Same monochromatic palette, same Geist/geometric sans pairing, same pill-shaped buttons with tight letter-spacing on display text
- **Linear** — Similar tight typographic tracking and hairline precision, but this system is flatter and more document-led
- **Radix UI** — Same developer-tool visual language — neutral surfaces, geometric type, and component-first documentation layout
- **Tailwind UI** — Matching restrained palette, identical border-radius scale (large radii on containers), and code-adjacent minimal chrome
- **Cal.com** — Similar compact density and pill-badge geometry, with a more restrained document layout here

## Course Docs Contract

`src/css/course-docs.css` is the shared presentation layer for every public or
enterprise course implemented with Docusaurus Docs. It is scoped to
`html.plugin-docs`, not to a course or client ID.

- Use `intro` as the course homepage document ID.
- Use `index.mdx` inside every chapter directory as the authored category index
  page. The top-level sidebar category links to this page.
- Chapter index pages with two or more child lessons use Docusaurus
  `DocCardList` with the shared `course-chapter-card-list` class. Its cards use
  `Part 01`, `Part 02`, … numbering, with two columns on desktop, one on narrow
  screens, 24px radius, a 1px hairline border, white background, and no shadow.
- When a chapter has only one lesson, put that lesson's content directly in the
  chapter `index.mdx`. Do not create a separate lesson page or render an empty
  `DocCardList`.
- On the course homepage, the first blockquote is the course metadata group.
  Each paragraph becomes one metadata column on desktop and one row on mobile.
- The last homepage blockquote is the key course judgment.
- The second level-two heading starts the course outline. Following level-three
  headings render their authored chapter titles without an additional numeric
  prefix from CSS.
- The left Docs sidebar receives automatic `00`, `01`, … numbering based on its
  real top-level order. Do not type those display numbers into sidebar labels.
- Breadcrumbs are hidden for every Course Docs instance and are not part of the
  course acceptance contract.
- Course-specific facts such as duration remain in Markdown content, normally
  in the metadata group. The shared CSS does not generate client- or
  course-specific copy.
- Page H1 headings use a wider measure and a restrained display size so long
  course titles stay compact. Duration belongs in course metadata, not in H1.
- A page with `status: draft` shows one small neutral badge directly below its
  H1. Do not duplicate draft state with Docusaurus `draft`, a banner, a quote,
  or an admonition.
- A semantic teaching figure with `class="course-figure"` uses the full reading
  width. Screenshots and simple, low-information SVG flow diagrams add
  `course-figure--compact`, which is capped at `32rem` on desktop and expands to
  the available reading width on narrow screens. Do not set figure width with
  inline styles or course-specific CSS. Images have no rounded corners. The
  shared client module makes the image focusable and opens the original image
  in an accessible native dialog on click, Enter, or Space, so ordinary lesson
  files can remain Markdown.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-canvas: #ffffff;
  --color-paper: #ffffff;
  --color-surface-alt: #f7f7f7;
  --color-ink: #0a0a0a;
  --color-ink-soft: #171717;
  --color-mid-gray: #737373;
  --color-hairline: #e5e5e5;
  --color-emphasis: #FF3700;
  --color-warning: #FE7E0F;
  --color-link: #0348ED;

  /* Typography — Font Families */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.6px;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.6px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.75px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.9px;
  --text-display: 48px;
  --leading-display: 1.1;
  --tracking-display: -2.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;

  /* Spacing */
  --spacing-unit: 4px;
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-48: 48px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: clamp(48px, 7vw, 80px);
  --card-padding: 20px;
  --element-gap: 8px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;

  /* Named Radii */
  --radius-cards: 24px;
  --radius-small: 6px;
  --radius-badges: 18px;
  --radius-inputs: 18px;
  --radius-nested: 10px;
  --radius-buttons: 18px;

  /* Shadows */
  --shadow-none: none;

  /* Surfaces */
  --surface-canvas: #ffffff;
  --surface-sidebar: #f7f7f7;
  --surface-card: #ffffff;
  --surface-input-fill: #f7f7f7;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-canvas: #ffffff;
  --color-paper: #ffffff;
  --color-surface-alt: #f7f7f7;
  --color-ink: #0a0a0a;
  --color-ink-soft: #171717;
  --color-mid-gray: #737373;
  --color-hairline: #e5e5e5;
  --color-emphasis: #FF3700;
  --color-warning: #FE7E0F;
  --color-link: #0348ED;

  /* Typography */
  --font-geist: 'Geist', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.33;
  --tracking-caption: 0.6px;
  --text-body: 14px;
  --leading-body: 1.43;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 18px;
  --leading-subheading: 1.56;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.33;
  --tracking-heading-sm: -0.6px;
  --text-heading: 30px;
  --leading-heading: 1.2;
  --tracking-heading: -0.75px;
  --text-heading-lg: 36px;
  --leading-heading-lg: 1.11;
  --tracking-heading-lg: -0.9px;
  --text-display: 48px;
  --leading-display: 1.1;
  --tracking-display: -2.4px;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-48: 48px;

  /* Border Radius */
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-2xl: 18px;
  --radius-3xl: 24px;

  /* Shadows */
  --shadow-none: none;
}
```

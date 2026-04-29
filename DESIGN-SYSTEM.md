# Korean Language Learning Platform — Design System (Prototype)

This document is the visual and structural foundation for the platform. The architecture document explains *what* gets built; the philosophy document explains *why*; this one explains *how things look and feel* — the tokens, the components, the layout grammar — so that everything from a flashcard to a long graded reader to a future co-authored story session lives in a coherent visual language.

It is labeled **prototype** deliberately. The bones here — the token names, the component inventory, the layout rules — should be stable enough to start building against. The specific values — exact hex codes, exact pixel sizes — are starting points, not decrees. We expect to revise them once real content is rendered in the browser. The structure should outlive the values.

Read the philosophy first when a design tradeoff feels uncertain. The visual restraint in this document is downstream of "the content is the reward; our voice gets out of the way."

## 1. Design Principles

Five principles, each derived from a commitment in the philosophy document. When a design decision is contested, these are the tiebreakers.

**Content first, chrome quiet.** The Korean text, the story prose, the audio waveform — these are what the learner came for. UI affordances exist to serve those things and then recede. No decorative gradients, no hero illustrations on functional pages, no marketing language inside the product.

**Calm over performance.** The palette is muted. Motion is slow when it appears at all. Typography sets the rhythm; color is for meaning, not energy. A learner who is tired, distracted, or returning after a month should find a page that is gentle on their attention.

**Reading is a first-class mode.** The platform serves a learner who wants to read more than they want to click. Every page that contains prose treats it as something to be read — generous line-height, comfortable measure, dignified type — not as content blocks to be scanned.

**Modular, not maximal.** Activities are composed from a small set of repeatable pieces: a card, a chip, an audio button, a dialogue line. New activity types are built by recombining these pieces, not by introducing new visual languages. When a piece is missing, we add it to the kit; we do not invent it locally.

**Honest about state.** Loading is loading; empty is empty; an error is an error. We do not paper over slowness with fake skeletons or empty states with marketing prose. If the learner has not started a lesson, the page says so plainly.

## 2. Tokens

Tokens are the lowest layer. Everything else references them. They are written here as semantic names; the implementation maps them to CSS custom properties in a single tokens file.

### 2.1 Color

The palette is warm and muted. Background is a warm paper, not pure white. Foreground is an ink that is not pure black. One calm accent carries meaning across the product. A small set of functional colors handles state.

Conceptually we work in two modes: **default** (paper, for most of the product) and **reading** (a darker, warmer surface for long-form reading, modeled on the brown mode in the Kidory reference). They share semantic names.

```
--color-bg              # default page background — warm off-white
--color-bg-raised       # cards, panels — slightly brighter than bg
--color-bg-sunken       # input wells, code blocks — slightly darker than bg
--color-fg              # primary text — warm near-black
--color-fg-muted        # secondary text, captions
--color-fg-subtle       # disabled, placeholder, very secondary

--color-accent          # the one calm accent — a muted indigo or slate-blue
--color-accent-fg       # text on accent surfaces
--color-accent-soft     # tinted surface for accent backgrounds (chips, highlights)

--color-border          # default hairlines and dividers
--color-border-strong   # for emphasized container edges

--color-success         # success state — muted green
--color-warning         # warning state — muted amber
--color-danger          # error state — muted red
--color-info            # informational — same family as accent

--color-known           # known-vocab token in mixed-language reader (= --color-fg)
--color-unknown         # unknown-vocab token in mixed-language reader (= --color-accent or muted)
```

In **reading mode**, the same semantic names point to a different palette: a warm brown background, a cream foreground, with the accent shifted slightly to remain legible. This mode is opt-in per surface, not a global theme; reading mode is for the reader and the listening transcript, not for navigation.

Starting values (subject to revision once we see them on screen):

| Token | Default mode | Reading mode |
|---|---|---|
| `--color-bg` | `#FAF7F2` | `#3E2E25` |
| `--color-bg-raised` | `#FFFFFF` | `#4A372C` |
| `--color-bg-sunken` | `#F2EDE5` | `#332520` |
| `--color-fg` | `#1F1B16` | `#F0E6D6` |
| `--color-fg-muted` | `#6B6359` | `#C9BCA8` |
| `--color-fg-subtle` | `#A39A8C` | `#8C7E6E` |
| `--color-accent` | `#4A5A8C` | `#A8B5D6` |
| `--color-accent-soft` | `#E6E9F2` | `#5A4A45` |
| `--color-border` | `#E8E1D5` | `#5A4438` |

The accent value is the most uncertain. It is sketched as a muted indigo because indigo sits well next to both Korean text and the brown reading mode, and because it does not signal "this is a quiz app." We may end up with a slate-blue, a muted teal, or a desaturated terracotta. We will choose by mocking three or four options on a real lesson page.

### 2.2 Typography

Two families. A serif for display and long-form prose; a sans-serif for UI, captions, and navigation. This pairing borrows from the third reference image — the serif headline gives the product its quiet dignity; the sans handles every functional moment so the serif never has to argue.

```
--font-serif   # display, lesson titles, story prose, large reading text
--font-sans    # UI, navigation, buttons, captions, metadata
--font-mono    # IDs, tokenizer output, debug surfaces
```

Starting choices (subject to revision):

- **Serif:** a humanist serif with good Korean font fallback. Candidates: *Source Serif 4*, *Fraunces* (low optical size), *Newsreader*. The candidate must sit comfortably next to the Korean system font on macOS, Windows, and mobile.
- **Sans:** a neutral grotesque with a strong Korean fallback. Candidates: *Inter*, *Geist*, *Pretendard* (Korean-optimized, so possibly a strong default).
- **Mono:** *JetBrains Mono* or *Geist Mono*.

Korean typeface handling deserves its own note: Korean glyphs come from a system or webfont fallback applied via `font-family` ordering. We will test that the fallback's metrics line up reasonably with the Latin face — particularly cap height and x-height — and adjust line-height to favor readability of Korean over micro-tuning of Latin.

#### Type scale

A modest scale. Sizes are named by role, not by number, so a refactor of the scale does not require renaming components.

```
--text-display      # 48px / 56px — homepage and big moments only
--text-title        # 32px / 40px — lesson title, story title
--text-heading      # 24px / 32px — section heads inside a page
--text-subheading   # 18px / 28px — activity titles, card titles
--text-body         # 16px / 26px — default body, UI
--text-prose        # 18px / 32px — long-form reading (story body, transcript)
--text-small        # 14px / 22px — metadata, captions
--text-micro        # 12px / 18px — chips, badges, labels
```

Notes:
- `--text-prose` is intentionally larger and looser than `--text-body`. Reading is different from scanning.
- `--text-display` is reserved for moments. Most pages do not use it.
- Korean text often benefits from a touch more line-height than Latin at the same size; the prose values reflect that.

#### Weight

Three weights, no more.

```
--weight-regular   # 400
--weight-medium    # 500 — UI emphasis, buttons, active nav
--weight-bold      # 700 — display, headings
```

### 2.3 Space

A geometric scale based on a 4px unit. Tokens are named by role inside a layout, not by number.

```
--space-0    # 0
--space-1    # 4px   — tight inset
--space-2    # 8px   — chip padding, small gap
--space-3    # 12px  — default small gap
--space-4    # 16px  — default gap, button padding-y
--space-5    # 24px  — section spacing
--space-6    # 32px  — between major blocks
--space-7    # 48px  — page-level gaps
--space-8    # 64px  — top-of-page spacing
--space-9    # 96px  — hero whitespace
```

A standing rule: vertical rhythm on prose pages prefers the larger end of this scale. The reading view is allowed to feel uncrowded.

### 2.4 Radii, borders, shadows

```
--radius-sm   # 6px   — chips, small buttons
--radius-md   # 12px  — cards, inputs
--radius-lg   # 20px  — large containers, modal sheets
--radius-pill # 999px — fully rounded pills

--border-thin    # 1px solid var(--color-border)
--border-strong  # 1.5px solid var(--color-border-strong)

--shadow-none   # for most surfaces; we lean on borders, not shadows
--shadow-soft   # very subtle, for the rare elevated card
--shadow-modal  # for sheets and modals only
```

We default to no shadow. When a surface needs to feel raised, we use `--shadow-soft` or a slightly stronger border. Heavy drop shadows do not belong here.

### 2.5 Motion

Motion is sparse, slow, and purposeful. Defaults below; a component may override only with reason.

```
--ease-standard   # cubic-bezier(.2, .0, .2, 1)
--ease-emphasized # cubic-bezier(.2, .0, 0, 1)

--duration-instant  # 80ms   — toggles, immediate feedback
--duration-short    # 160ms  — most UI transitions
--duration-medium   # 280ms  — page-level transitions
--duration-long     # 480ms  — reserved for special moments
```

No bouncy easings. No spring physics in v1. Reduced-motion preferences are respected: any non-essential motion is dropped to a 0ms duration when `prefers-reduced-motion: reduce` is set.

## 3. Layout

### 3.1 Page structure

Two top-level frames cover the whole product:

**App frame** — sidebar + content. Used for everything inside the product (lessons, readers, kitchen sink, future settings). The sidebar is the navigation tree; the content area is one of the page templates below.

**Reader frame** — content-only, sidebar collapsible. Used for the long-form reading view. Maximizes vertical space for prose. The sidebar can be summoned but defaults closed.

The home page uses the app frame with a wide content area and no sidebar selection.

### 3.2 The content column

Most pages render into a single column with a maximum readable measure. The column has three widths:

```
--measure-narrow   # 560px  — tight prose, focused activities
--measure-default  # 720px  — standard lesson page
--measure-wide     # 960px  — overview pages, kitchen sink, readers
```

We do not build full-bleed pages outside of intentional moments (e.g. a story session may break the column). The measure is what protects readability.

### 3.3 Vertical rhythm

A page is a stack of blocks separated by `--space-6` by default. Within a block, smaller increments apply. The reading view uses `--space-7` between paragraphs of UI commentary and the prose itself, so the prose has clear room.

### 3.4 Responsive behavior

Three breakpoints are enough.

```
--bp-sm   # 640px   — phone
--bp-md   # 960px   — tablet, narrow desktop
--bp-lg   # 1280px  — desktop
```

Below `--bp-md`, the sidebar collapses into a header menu. The content column fills the viewport with consistent gutters (`--space-4` minimum). The reading view is mobile-first: it should feel right on a phone before it feels right on a desktop, because a meaningful share of reading happens on phones.

## 4. Components

This is the kit. Each component is named, given a purpose, and described by structure and behavior. Visual specifics — exact padding, exact color choices — live in the implementation alongside the tokens, not duplicated here.

The list is grouped by role. Activities (the components from the architecture document) are at the bottom because they are composed from everything above.

### 4.1 Foundations

These appear everywhere.

- **Button** — Three variants: `primary` (accent fill), `secondary` (border, fg text), `ghost` (text only, no border). Three sizes: `sm`, `md`, `lg`. Always uses sans, medium weight. No icon-only buttons in v1 except the audio play control.
- **Link** — Inline text link. Underlined by default; the underline is the affordance.
- **Chip** — Small inline tag. Used for vocab tags, lesson metadata, filter selectors. Pill radius. Two states: passive (border only) and selected (filled with `--color-accent-soft`).
- **Input** — Text input. Single-line and multi-line variants. Borders, not fills.
- **Toggle** — Binary state, used sparingly. The mode switch on the reader (Audio/Text) is a toggle.
- **Slider** — Used for type-size, brightness, and (later) speed. Borrowed visually from the Kidory reference.

### 4.2 Containers

- **Card** — A bordered container at `--radius-md` with `--space-5` inset by default. The default building block for grouping content. No shadow.
- **Panel** — A larger container at `--radius-lg`. Used for the reading view, the audio player tray, the future story session frame.
- **Sheet** — A modal-like overlay that slides from the bottom on mobile and the right on desktop. Used for settings, vocab quick-look, and (later) the session inspector.
- **Divider** — A hairline rule. Used to separate activities within a lesson when the gap alone is not enough.

### 4.3 Navigation

- **Sidebar** — The folder-like nav from the architecture. Top-level entries are tracks. A track expands to stages; a stage expands to its lessons. Current location is bolded. No icons on the tree itself; icons (if any) live on the track header only.
- **Sidebar header** — A compact area at the top with the product name and a track switcher.
- **Breadcrumb** — Stage > Lesson, on the lesson page. Small, sans, muted color. Clickable parts are links.
- **Page header** — The title block at the top of any page. Title in serif, optional subtitle in sans-muted, optional metadata row of chips.
- **Activity stepper** — On a lesson page, a small inline indicator showing the activity sequence and which one the learner is on. Not a progress bar in the gamified sense — a reading aid. Skippable, non-blocking.

### 4.4 Korean-language pieces

Components specific to rendering Korean content. These are the ones that will earn their keep across many activities.

- **Vocab token** — A single Korean word inline in prose. Hover (or tap) reveals the gloss. Three states: `known` (plain text), `unknown` (substituted English gloss in mixed-language reader), `highlighted` (subtly tinted, used in the vocab introduction activity). The same component handles all three; the variant is a prop.
- **Vocab card** — Front/back card for flashcards. Korean on the front, gloss + audio on the back. Generous padding, serif Korean, sans gloss. Audio button bottom-right.
- **Grammar block** — A bordered block presenting a grammar pattern. Pattern in serif, description in sans, examples as a small list with vocab tokens inline.
- **Expression block** — Same shape as grammar block, distinguished by a different left-border accent so the learner can scan and tell them apart.
- **Dialogue line** — Speaker label (sans, micro) + Korean line (serif, prose) + optional gloss line (sans, muted). Used in dialogue activities and inside readers when prose contains dialogue.
- **Audio button** — A small circular control with play/pause. Used for vocab audio, story audio, and the listening clip. Lives next to the content it plays. The button is the affordance; we do not also caption it with "Listen."
- **Audio tray** — A persistent strip at the bottom of the reading view when audio is loaded for the current story. Includes play/pause, progress, speed (later), and a close button. Borrowed in spirit from Kidory's text/audio mode.
- **Tokenized prose** — A wrapper component that renders a block of Korean prose split into vocab tokens, with optional gloss popovers, optional unknown-substitution (the mixed-language mode), and optional click-to-play-from-here for audio. Activities compose this; they do not re-implement tokenization.

### 4.5 State and feedback

- **Empty state** — A single-line message in muted sans. No illustration. No CTA button unless there is exactly one thing the learner should do next.
- **Loading state** — A subtle skeleton shape on the affected component, not a full-page spinner. For audio loading, the audio button shows a small indeterminate ring.
- **Error state** — A bordered block in `--color-danger` with plain language. Always offers a recovery action where one exists.
- **Toast** — Used sparingly, for confirmations after a non-page-changing action. Auto-dismiss in `--duration-medium * 4` ≈ 1.1s. We do not use toasts for errors.

### 4.6 Activities

These are the components from §3 of the architecture, expressed in the kit. Each is composed from the pieces above. New activities are added by composition; the kit grows when a piece is missing.

- **vocab-introduction** — Page header (activity title, intro prose if author provided one), then a stack of vocab cards each with audio button. No quiz, no checks — this activity is about being seen.
- **flashcards** — A single vocab card centered in the column. Buttons below: previous, flip, next. Optional shuffle toggle in the card header. Keyboard support: space to flip, arrow keys to move.
- **listening-clip** — Audio tray at the top of the column with the clip loaded; transcript below as tokenized prose with gloss-on-tap; optional comprehension check at the bottom rendered as a small inline quiz.
- **cloze-quiz** — A series of sentences with a blank. Sentence rendered as tokenized prose; the blank is a chip-shaped slot that expands when answered. Distractors as chips below the sentence. Submit, then reveal correct/incorrect inline. Never modal, never punitive.
- **mixed-language-reader** — A panel containing the story title (serif, title size), author (sans, micro), then tokenized prose with mixed-language substitution active. An optional reading-mode toggle in the panel header switches the panel into reading-mode colors.

### 4.7 Future activities (named so the kit anticipates them)

- **dialogue-puppet** — Composed from dialogue lines, vocab tokens, and chip-style choice prompts.
- **story-session** — A larger panel with its own internal layout (a prompt area, a learner-input area, a generated-output area). The session is the most ambitious composition; the kit should make it possible without anything new.
- **journal** — A long-form input that saves to the future state layer. Composed from input, tokenized prose (for re-reading past entries), and the audio button (for read-back).

The session is far enough out that we will not finalize its visual form here. Naming it ensures the panel and tokenized-prose components can scale to it.

## 5. Page templates

Concrete arrangements of components for the v1 surfaces.

### 5.1 Home

App frame, no sidebar selection. Wide measure. Three blocks:

1. **Title block.** Product name in display serif. One-sentence description in body sans-muted. No marketing prose.
2. **Tracks.** A short list of tracks (Lessons, Graded Readers, future tracks), each rendered as a card with title, one-line description, and a "go" link.
3. **Footer note.** A small block crediting the Korean teacher reviewer and noting the project's current stage.

No dashboard. No streaks. No daily nags.

### 5.2 Sidebar

Always-visible on `--bp-md` and up, drawer on smaller. Tracks at top, current selection bolded. The expanded stage shows lessons with their numbers and short titles. No progress bars, no checkmarks-as-trophies. A subtle dot indicates the lesson the learner most recently opened, for return convenience.

### 5.3 Lesson page

App frame, default measure. Stack:

1. **Breadcrumb.** Stage > Lesson.
2. **Page header.** Lesson title in serif (Korean and English glosses if both are author-provided), subtitle, metadata chips (introduces N vocab, M grammar).
3. **Activity stepper.** Inline indicator of the activity sequence.
4. **Activities.** Rendered in order from the manifest, each in its own block, separated by `--space-6` and a divider.
5. **Lesson footer.** A quiet "next lesson" link. No celebration. No "you completed this!" — the learner knows.

### 5.4 Reader (graded reader / story page)

Reader frame, panel-led layout. The panel contains:

1. Story title (serif, title size), author (sans, micro).
2. Mode toggle — Audio / Text — borrowed from Kidory.
3. Audio tray (if audio mode) at the top of the panel.
4. Story prose, tokenized, in `--text-prose`.
5. Reading-mode toggle (default mode / reading mode) and type-size slider in a settings sheet, accessed via a settings icon.

The reader is the page where the brown reading mode shines. We will mock both modes side by side once the panel is in code.

### 5.5 Kitchen sink

App frame, wide measure. The hidden route from the architecture. Renders every component in every state — empty, loaded, with audio, without audio, error — under section headings that mirror this document. It is the design system's living documentation.

When prompting AI for a new component, the instruction is "match the kitchen sink." When debugging a visual inconsistency, the kitchen sink is the reference.

## 6. Accessibility minimums

Stated as commitments, not aspirations. Each is checked in the kitchen sink.

- All text meets WCAG AA contrast against its background, in both default and reading modes.
- All interactive elements are keyboard reachable in a sensible order.
- Focus states are visible and use a 2px outline in `--color-accent`, never `outline: none` without replacement.
- Audio always has a transcript. The transcript is not behind a click; it is on the page.
- Korean text has `lang="ko"` so screen readers and font fallback handle it correctly.
- `prefers-reduced-motion` is respected globally.
- The reading view supports user-selected type size from the settings sheet.

## 7. What this design system does not try to do (yet)

Named so we do not drift into them by accident.

- It does not define brand. There is no logo treatment, no marketing site styling, no social card templates. When those are needed, they will reference the same tokens.
- It does not define a dark mode in the system-wide sense. The reading mode is the only dark surface, and it is opt-in per surface.
- It does not theme by track or stage. Beginning 1 looks like Beginning 2 looks like an Intermediate reader. The visual identity is the platform; the variation is the content.
- It does not specify illustration. Stories may include author-provided art (per the architecture, audio sits next to its content; illustration would too), but illustration is content, not chrome. We do not commission or generate decorative art for functional pages.
- It does not specify motion choreography for the future story session. That work happens when the session itself is built.

## 8. Decisions deferred

- Final accent color. Sketched as muted indigo; final choice after seeing it on a real lesson page in both modes.
- Final serif and sans choices. Candidates listed; final choice after Korean-fallback testing.
- Dark default mode (vs. dark only as reading mode). Open question; we will probably keep default as paper for v1 and revisit if learners ask.
- The exact visual treatment of unknown vocab in mixed-language reader (italicized? bracketed? tinted background? underlined?). To be decided when the validator's output drives the first reader render.
- Iconography. We are starting near-zero on icons; if they are needed, the choice between a paid icon set and a hand-curated micro-set is open.
- Settings sheet contents and ordering.

## 9. How this document is used

This is the foundation. New components are added by extending it. Token values are revised by editing it. When a built screen contradicts something here, one of the two is wrong, and we figure out which before going further — same rule as the philosophy and architecture documents.

The kitchen sink is the executable version of this document. When in doubt, look at the kitchen sink. When the kitchen sink and this document disagree, this document is correct and the kitchen sink is out of date — fix the kitchen sink.

The point of starting in prototype is to keep the bones load-bearing while the surface is still in flux. The bones are: tokens by role, a small modular component kit, a flat page-template layer, and the kitchen sink as living truth. Those should not change. Everything that hangs on them — colors, fonts, exact spacing — is allowed to.

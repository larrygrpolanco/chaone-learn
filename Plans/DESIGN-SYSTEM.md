# Korean Language Learning Platform — Design System (Prototype)

This document is the visual and structural foundation for the platform. The architecture document explains *what* gets built; the philosophy document explains *why*; this one explains *how things look and feel* — the tokens, the components, the layout grammar — so that everything from a flashcard to a long graded reader to a future co-authored story session lives in a coherent visual language.

It is labeled **prototype** deliberately. The bones here — the token names, the component inventory, the layout rules — should be stable enough to start building against. The specific values — exact hex codes, exact pixel sizes — are starting points, not decrees. We expect to revise them once real content is rendered in the browser. The structure should outlive the values.

Read the philosophy first when a design tradeoff feels uncertain. The visual restraint in this document is downstream of "the content is the reward; our voice gets out of the way."

## 1. Design Principles

Six principles, each derived from a commitment in the philosophy document. When a design decision is contested, these are the tiebreakers.

**Content first, chrome quiet.** The Korean text, the story prose, the audio waveform — these are what the learner came for. UI affordances exist to serve those things and then recede. No decorative gradients, no hero illustrations on functional pages, no marketing language inside the product.

**Calm over performance.** The palette is muted. Motion is slow when it appears at all. Typography sets the rhythm; color is for meaning, not energy. A learner who is tired, distracted, or returning after a month should find a page that is gentle on their attention.

**Reading is a first-class mode.** The platform serves a learner who wants to read more than they want to click. Every page that contains prose treats it as something to be read — generous line-height, comfortable measure, dignified type — not as content blocks to be scanned.

**One activity, one page.** A learner does one thing at a time. Activities do not stack on a lesson page; each activity is its own surface, with its own focus, its own measure, its own keyboard rhythm. Moving between activities is a navigation action, not a scroll.

**Modular, not maximal.** Activities are composed from a small set of repeatable pieces: a card, an audio button, a dialogue line. New activity types are built by recombining these pieces, not by introducing new visual languages. When a piece is missing, we add it to the kit; we do not invent it locally.

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
--color-accent-soft     # tinted surface for accent backgrounds, highlights

--color-border          # default hairlines and dividers
--color-border-strong   # for emphasized container edges

--color-success         # success state — muted green
--color-warning         # warning state — muted amber
--color-danger          # error state — muted red
--color-info            # informational — same family as accent

--color-known           # known-vocab token in mixed-language reader (= --color-fg)
--color-unknown         # unknown-vocab token in mixed-language reader
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
--text-micro        # 12px / 18px — labels, very small affordances
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
--space-2    # 8px   — small gap
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
--radius-sm   # 6px   — small buttons, inline affordances
--radius-md   # 12px  — cards, inputs
--radius-lg   # 20px  — large containers, modal sheets

--border-thin    # 1px solid var(--color-border)
--border-strong  # 1.5px solid var(--color-border-strong)

--shadow-none   # for most surfaces; we lean on borders, not shadows
--shadow-soft   # very subtle, for the rare elevated card
--shadow-modal  # for sheets and modals only
```

We default to no shadow. When a surface needs to feel raised, we use `--shadow-soft` or a slightly stronger border. Heavy drop shadows do not belong here.

There is no pill radius. Pill-shaped affordances tend to read as "tag" or "chip" — the cheap, decorative kind we are deliberately avoiding. Where a small affordance is needed, it lives at `--radius-sm` and earns its presence through type and spacing rather than through shape.

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

**App frame** — sidebar + content. Used for everything inside the product (home, lesson hub, activities, kitchen sink, future settings). The sidebar is the primary navigation; the content area is one of the page templates below.

**Reader frame** — content-only, sidebar collapsible. Used for the long-form reading view. Maximizes vertical space for prose. The sidebar can be summoned but defaults closed.

The home page uses the app frame with a wide content area and no sidebar selection.

### 3.2 The content column

Most pages render into a single column with a maximum readable measure. The column has three widths, picked per page (and per activity):

```
--measure-narrow   # 560px  — focused activities (flashcards, vocab cards)
--measure-default  # 720px  — lesson hub, listening clip, cloze quiz
--measure-wide     # 960px  — home, kitchen sink, mixed-language reader
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

## 4. Information architecture

The product has four levels of depth, expressed identically in the URL, the sidebar, and the breadcrumb:

```
Home → Track → Stage → Lesson → Activity
```

Examples:

```
/                                                  # home
/lessons                                           # the Lessons track
/lessons/beginning-1                               # a stage
/lessons/beginning-1/lesson-4                      # a lesson hub
/lessons/beginning-1/lesson-4/flashcards           # an activity inside that lesson
/lessons/beginning-1/lesson-4/mixed-language-reader
```

The lesson is the **hub**: a landing page for the lesson itself. The activity is the **focus**: one task, one screen. A learner moves between activities by either returning to the hub or jumping sideways via the sidebar — both are first-class navigation moves.

This structure carries a few consequences worth naming:

- The sidebar is deeper than a typical product. It expands to four levels. We design for that explicitly (see §5.3).
- A learner who deep-links into an activity (a bookmark, a shared URL) lands on a fully-formed page, not inside a stack. The activity does not assume the hub was visited first.
- There is no activity stepper. Activities are not steps; the lesson hub is the map.

## 5. Components

This is the kit. Each component is named, given a purpose, and described by structure and behavior. Visual specifics — exact padding, exact color choices — live in the implementation alongside the tokens, not duplicated here.

The list is grouped by role.

### 5.1 Foundations

These appear everywhere.

- **Button** — Three variants: `primary` (accent fill), `secondary` (border, fg text), `ghost` (text only, no border). Three sizes: `sm`, `md`, `lg`. Always uses sans, medium weight. No icon-only buttons in v1 except the audio play control.
- **Link** — Inline text link. Underlined by default; the underline is the affordance.
- **Inline tag** — A small piece of muted sans text (`--text-small`, `--color-fg-muted`) used to label a vocab item's part of speech, register, etc. Sits inline with its content, no border, no background, no rounded shape. This is where we used to reach for a chip; we now reach for inline muted text instead.
- **Segmented control** — A small group of options with one selected, used for binary or ternary mode switches (Audio / Text on the reader). Border on the group, accent-soft fill on the selected segment. Used sparingly.
- **Input** — Text input. Single-line and multi-line variants. Borders, not fills.
- **Toggle** — Binary state switch, used for settings (e.g. "show glosses").
- **Slider** — Used for type-size, brightness, and (later) speed. Borrowed visually from the Kidory reference.

### 5.2 Containers

- **Card** — A bordered container at `--radius-md` with `--space-5` inset by default. The default building block for grouping content. No shadow.
- **Panel** — A larger container at `--radius-lg`. Used for the reading view, the audio player tray, the future story session frame.
- **Sheet** — A modal-like overlay that slides from the bottom on mobile and the right on desktop. Used for settings, vocab quick-look, and (later) the session inspector.
- **Divider** — A hairline rule. Used to separate sections within a page where the gap alone is not enough.

### 5.3 Navigation

- **Sidebar** — The primary navigation for the product. Folder-like, expandable, four levels deep:
  - Track (e.g. *Lessons*, *Graded Readers*)
  - Stage (e.g. *Beginning 1*)
  - Lesson (e.g. *Lesson 4 — At Home*)
  - Activity (e.g. *Flashcards*, *Mixed-language reader*)

  The activity level is collapsed by default and expands when its lesson is the current page (or is manually expanded). Current location is bolded at every level. A subtle dot marks the lesson the learner most recently opened, for return convenience. No icons on the tree itself; icons (if any) live on the track header only.

  On mobile (below `--bp-md`), the sidebar is a drawer summoned from a header menu, with the current breadcrumb visible in the page header so the learner does not have to open it to know where they are.

- **Breadcrumb** — Track > Stage > Lesson, on the lesson hub. Track > Stage > Lesson > Activity, on an activity page. Small, sans, muted. Clickable parts are links. Always present on activity pages — it is the primary "back" affordance after the sidebar.

- **Page header** — The title block at the top of any page. Title in serif, optional subtitle in sans-muted, optional metadata as a quiet sentence (not a row of pills).

### 5.4 Activity launcher

The component that turns a lesson hub into a launchpad. Lives on the lesson hub; one entry per activity in the lesson.

Each entry is a card-shaped row with:

- **Activity name.** Sans, subheading size, medium weight (e.g. *Flashcards*).
- **One-line description.** Muted sans, body size (e.g. *14 cards covering this lesson's vocabulary*).
- **Status.** A quiet trailing line of muted text, never a checkmark or badge: e.g. *not started*, *in progress*, *visited*. We do not gamify this — see §1.
- **Suggested-order indicator.** A small, muted leading numeral (1, 2, 3 …) suggesting the author's recommended sequence. The numeral is a hint, not a gate; every entry is clickable regardless of order.

The entire row is the click target. Hover state is a slight border darken; no scale, no shadow lift. On click, the learner navigates to the activity page; the back button or sidebar returns them.

### 5.5 Korean-language pieces

Components specific to rendering Korean content. These are the ones that will earn their keep across many activities.

- **Vocab token** — A single Korean word inline in prose. Hover (or tap) reveals the gloss. Three states: `known` (plain text), `unknown` (substituted English gloss in mixed-language reader), `highlighted` (subtly tinted, used in the vocab introduction activity). The same component handles all three; the variant is a prop.
- **Vocab card** — Front/back card for flashcards. Korean on the front, gloss + audio on the back. Generous padding, serif Korean, sans gloss. Audio button bottom-right.
- **Grammar block** — A bordered block presenting a grammar pattern. Pattern in serif, description in sans, examples as a small list with vocab tokens inline.
- **Expression block** — Same shape as grammar block, distinguished by a different left-border accent so the learner can scan and tell them apart.
- **Dialogue line** — Speaker label (sans, micro) + Korean line (serif, prose) + optional gloss line (sans, muted). Used in dialogue activities and inside readers when prose contains dialogue.
- **Audio button** — A small circular control with play/pause. Used for vocab audio, story audio, and the listening clip. Lives next to the content it plays. The button is the affordance; we do not also caption it with "Listen."
- **Audio tray** — A persistent strip at the bottom of the reading view when audio is loaded for the current story. Includes play/pause, progress, speed (later), and a close button.
- **Tokenized prose** — A wrapper component that renders a block of Korean prose split into vocab tokens, with optional gloss popovers, optional unknown-substitution (the mixed-language mode), and optional click-to-play-from-here for audio. Activities compose this; they do not re-implement tokenization.

### 5.6 State and feedback

- **Empty state** — A single-line message in muted sans. No illustration. No CTA button unless there is exactly one thing the learner should do next.
- **Loading state** — A subtle skeleton shape on the affected component, not a full-page spinner. For audio loading, the audio button shows a small indeterminate ring.
- **Error state** — A bordered block in `--color-danger` with plain language. Always offers a recovery action where one exists.
- **Toast** — Used sparingly, for confirmations after a non-page-changing action. Auto-dismiss in roughly a second. We do not use toasts for errors.

### 5.7 Activity components

These are the activity components from the architecture, expressed in the kit. **Each is a full page**, not a section of a longer page. They share a common shell — page header, breadcrumb, content area at the activity's preferred measure — and differ in what they render inside that shell.

- **vocab-introduction** — Activity page header, optional intro prose from the author, then a stack of vocab cards each with an audio button. Default measure. No quiz, no checks — this activity is about being seen.
- **flashcards** — A single vocab card centered in the column at narrow measure. Buttons below: previous, flip, next. Optional shuffle in the page header. Keyboard support: space to flip, arrow keys to move.
- **listening-clip** — Audio tray at the top of the column with the clip loaded; transcript below as tokenized prose with gloss-on-tap; optional comprehension check at the bottom rendered as a small inline quiz. Default measure.
- **cloze-quiz** — A series of sentences with a blank. Sentence rendered as tokenized prose; the blank is a small rectangular slot that fills when answered. Distractors as bordered button-shaped options below the sentence. Submit, then reveal correct/incorrect inline. Never modal, never punitive. Default measure.
- **mixed-language-reader** — A panel containing the story title (serif, title size), author (sans, micro), then tokenized prose with mixed-language substitution active. Wide measure. An optional reading-mode toggle in the panel header switches the panel into reading-mode colors.

#### Future activities (named so the kit anticipates them)

- **dialogue-puppet** — Composed from dialogue lines, vocab tokens, and bordered choice options.
- **story-session** — A larger panel with its own internal layout. The session is the most ambitious composition; the kit should make it possible without anything new.
- **journal** — A long-form input that saves to the future state layer. Composed from input, tokenized prose (for re-reading past entries), and the audio button (for read-back).

## 6. Page templates

Concrete arrangements of components for the v1 surfaces.

### 6.1 Home

App frame, no sidebar selection, wide measure. Three blocks:

1. **Title block.** Product name in display serif. One-sentence description in body sans-muted. No marketing prose.
2. **Tracks.** A short list of tracks (Lessons, Graded Readers, future tracks), each rendered as a card with title, one-line description, and a "go" link.
3. **Footer note.** A small block crediting the Korean teacher reviewer and noting the project's current stage.

No dashboard, no streaks, no daily nags.

### 6.2 Stage page

App frame, default measure. A simple landing for the stage:

1. **Page header.** Stage title in serif, one-line description in muted sans.
2. **Lesson list.** An ordered list of lessons in the stage. Each entry shows the lesson number, title (Korean and English where both exist), and a one-line description from the manifest. Click enters the lesson hub.
3. **Stage footer.** A quiet "next stage" link if a next stage exists. No completion fanfare.

### 6.3 Lesson hub

App frame, default measure. **The center of gravity for a lesson.** This is where a learner lands when they click into a lesson, and where they return between activities. It is also useful as a reference page in its own right — the learner can come back to it to look up a vocab item or re-read a grammar point without entering an activity.

Stack:

1. **Breadcrumb.** Track > Stage > Lesson.
2. **Page header.** Lesson title in serif (Korean and English glosses if both are author-provided), subtitle. Lesson metadata ("introduces 12 vocabulary, 2 grammar points, 1 expression") rendered as a quiet sentence in muted sans, not a row of pills.
3. **Description.** A short prose block from the lesson manifest — what the lesson is about, why it exists, how the author thinks about it. Default body size. Three paragraphs at most.
4. **Vocabulary preview.** A simple list of the vocab introduced in this lesson: Korean form, gloss, audio button, optional inline tag for part of speech. Not a flashcard surface — this is preview, not practice.
5. **Grammar preview.** The grammar blocks from the architecture, one per grammar point introduced. Pattern, description, one or two examples. Same for expressions if any.
6. **Activities.** The activity launcher (§5.4): one entry per activity, in suggested order, each clickable to launch.
7. **Lesson footer.** A quiet "next lesson" link. No celebration. No "you completed this!" — the learner knows.

Vocabulary and grammar preview are part of the hub on purpose: they let the learner orient themselves before choosing an activity, and they make the hub useful as a reference page in its own right. They are previews, not practice; the practice surfaces are the activities.

### 6.4 Activity page

App frame, **measure varies per activity.** The shape of an activity page is:

1. **Breadcrumb.** Track > Stage > Lesson > Activity. The lesson segment is the primary "back to hub" affordance.
2. **Page header.** Activity name in serif, optional one-line activity description in muted sans. Activity-level controls (e.g. shuffle for flashcards) live on the right side of the header.
3. **Activity body.** The activity component, rendered at its preferred measure.
4. **Page footer.** A small "back to lesson" link, plus optional "previous activity" / "next activity" links if a sensible order exists. These are conveniences; the sidebar is the primary navigation between activities.

Activity pages do not have a global "submit lesson" or "complete" button. Activities track their own state internally where relevant (e.g. a cloze quiz can be checked); the lesson does not have a completion gate.

### 6.5 Reader (graded reader / long-form story page)

Reader frame, panel-led layout. Used for graded readers and (when the architecture's mixed-language-reader is invoked on a long story) for story prose. The panel contains:

1. Story title (serif, title size), author (sans, micro).
2. Mode toggle — Audio / Text — as a segmented control, borrowed from Kidory.
3. Audio tray (if audio mode) at the top of the panel.
4. Story prose, tokenized, in `--text-prose`.
5. Reading-mode toggle (default mode / reading mode) and type-size slider in a settings sheet, accessed via a settings icon.

The reader is the page where the brown reading mode shines. We will mock both modes side by side once the panel is in code.

### 6.6 Kitchen sink

App frame, wide measure. The hidden route from the architecture. Renders every component in every state — empty, loaded, with audio, without audio, error — under section headings that mirror this document. It is the design system's living documentation.

When prompting AI for a new component, the instruction is "match the kitchen sink." When debugging a visual inconsistency, the kitchen sink is the reference.

## 7. Accessibility minimums

Stated as commitments, not aspirations. Each is checked in the kitchen sink.

- All text meets WCAG AA contrast against its background, in both default and reading modes.
- All interactive elements are keyboard reachable in a sensible order.
- Focus states are visible and use a 2px outline in `--color-accent`, never `outline: none` without replacement.
- Audio always has a transcript. The transcript is not behind a click; it is on the page.
- Korean text has `lang="ko"` so screen readers and font fallback handle it correctly.
- `prefers-reduced-motion` is respected globally.
- The reading view supports user-selected type size from the settings sheet.

## 8. What this design system does not try to do (yet)

Named so we do not drift into them by accident.

- It does not define brand. There is no logo treatment, no marketing site styling, no social card templates. When those are needed, they will reference the same tokens.
- It does not define a dark mode in the system-wide sense. The reading mode is the only dark surface, and it is opt-in per surface.
- It does not theme by track or stage. Beginning 1 looks like Beginning 2 looks like an Intermediate reader. The visual identity is the platform; the variation is the content.
- It does not specify illustration. Stories may include author-provided art (per the architecture, audio sits next to its content; illustration would too), but illustration is content, not chrome. We do not commission or generate decorative art for functional pages.
- It does not specify motion choreography for the future story session. That work happens when the session itself is built.
- It does not include chips, pills, badges, or other shape-based decorative tagging. Where we used to reach for one, we reach for inline muted text or for a properly-sized control instead.

## 9. Decisions deferred

- Final accent color. Sketched as muted indigo; final choice after seeing it on a real lesson page in both modes.
- Final serif and sans choices. Candidates listed; final choice after Korean-fallback testing.
- Dark default mode (vs. dark only as reading mode). Open question; we will probably keep default as paper for v1 and revisit if learners ask.
- The exact visual treatment of unknown vocab in mixed-language reader (italicized? bracketed? tinted background? underlined?). To be decided when the validator's output drives the first reader render.
- Iconography. We are starting near-zero on icons; if they are needed, the choice between a paid icon set and a hand-curated micro-set is open.
- Settings sheet contents and ordering.
- The exact wording of activity launcher status text (*not started*, *in progress*, *visited* — or something else). The honest tone matters here; we will iterate.

## 10. How this document is used

This is the foundation. New components are added by extending it. Token values are revised by editing it. When a built screen contradicts something here, one of the two is wrong, and we figure out which before going further — same rule as the philosophy and architecture documents.

The kitchen sink is the executable version of this document. When in doubt, look at the kitchen sink. When the kitchen sink and this document disagree, this document is correct and the kitchen sink is out of date — fix the kitchen sink.

The point of starting in prototype is to keep the bones load-bearing while the surface is still in flux. The bones are: tokens by role, a small modular component kit, a four-level information architecture, a flat page-template layer, and the kitchen sink as living truth. Those should not change. Everything that hangs on them — colors, fonts, exact spacing — is allowed to.


**UI/UX DESIGN BRIEF**


**KAIRO**

*Visual and interaction design for Release 1*


| Document UI/UX Design Brief | Version 0.1 |
| --- | --- |
| Status Draft for review | Date 11 October 2026 |
| Implements PRD, TRD and App Flow v0.1 | Course Project-Based Learning |


**Contents**

1. Document control

2. Design intent

3. Brand identity

4. Color

5. Typography

6. Layout, spacing and surfaces

7. Iconography

8. Components

9. Screen designs

10. Legal and trust pages

11. Report and PDF design

12. Responsive design

13. Motion

14. Content design

15. Accessibility

16. Design tokens

17. Assets and hand-off

18. Traceability

19. Open questions and decisions

20. Sources


# 1. Document control

This brief gives every screen in the App Flow its visual and interaction design, and it adopts the KAIRO brand identity exactly as the owner supplied it.


| Field | Value |
| --- | --- |
| Product | KAIRO |
| Document | UI/UX Design Brief |
| Version | 0.1 |
| Status | Draft for review |
| Implements | PRD v0.1 (section 14, brand guardrails), TRD v0.1 (section 15), App Flow v0.1 |
| Audience | Designers, front-end engineers, faculty guide, evaluators |
| Source of truth for identity | The owner's KAIRO Geometric Brand Identity Guide, reproduced in section 3 |
| Companion files | A brand asset pack: icon.svg, icon-ink.svg, favicon.ico, apple-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png, opengraph-image.png, manifest.webmanifest |


## How to read this brief

- Sections 3 to 7 define the system: identity, color, type, layout and icons.
- Sections 8 to 13 apply it: components, screens, legal pages, reports, responsive behavior and motion.
- Sections 14 and 15 govern content and accessibility, and section 16 turns the system into design tokens that the build enforces (TRD section 15).
- Mockups use sample data and are labeled as such. They show structure, hierarchy and styling. The final copy belongs to the owners.
- Sizes are real pixels at a 16 px base. The mockups are drawn at roughly three quarters of that scale, so they look smaller than the real screens.

# 2. Design intent

KAIRO should look like a precise instrument built by a careful team: calm, dense where it needs to be, and never decorative for its own sake.


## What the design is for

People arrive worried that something they shipped is unsafe. The design has to turn a long list of technical findings into a short, ordered list of things to do, and to make it obvious how sure KAIRO is about each one. Trust is the product, so every visual choice either helps a person read evidence or is removed.


## Principles


| Principle | What it means on screen |
| --- | --- |
| Evidence first | Findings show what was observed, where, and how sure KAIRO is, before any advice. Evidence blocks are visually distinct from explanations |
| Words before symbols | Severity, confidence and status are always written. Shapes support the words. Color only reinforces them (BR-15) |
| One thing to do next | Every screen has one primary action, drawn once and drawn in emerald |
| Flat and exact | Hard-edged geometry that echoes the logo's 45 degree cuts. Surfaces separate with 1 px lines, not shadows or gradients |
| Quiet by default | Neutral surfaces carry the page. Emerald marks action and brand only. Semantic colors appear only on labels and messages |
| Honest about limits | Warnings, partial results and AI-assisted findings are labeled in plain text and placed where the reader will see them |
| Same everywhere | A component looks and behaves the same on every screen. There are no one-off styles |


## Patterns this product does not use

These come from the owner's list and from PRD section 14. Each has a defined replacement, so designers are not left guessing.


| Avoided | Replaced by |
| --- | --- |
| Purple or violet gradients, and gradient backgrounds | Flat fills from the palette in section 4. The token check rejects any hue between 250 and 300 degrees |
| Pill-shaped buttons and fully rounded controls | Rectangles with a 3 px radius, echoing the logo tile's square corners |
| Em dashes in any text | Commas, colons, periods and parentheses |
| Scroll-triggered effects, parallax, reveal-on-scroll | Static layouts. Content is present when the page loads |
| Custom cursors and cursor-following effects | The system cursor |
| Emoji as icons or bullets | One icon family (section 7) with words beside it |
| Sparkle, star and wand symbols for AI features | A plain label: "AI-assisted" |
| Invented statistics, testimonials, customer logos, ratings | Nothing. Only facts the product can prove, with their source or date |
| AI-generated images and stock photos of people | Real product screens, diagrams and typography |
| "Made with AI" or "Powered by AI" badges | No badge. Where AI influenced a finding, the finding says so in words |
| The framework's default favicon and starter assets | The KAIRO icon set in section 3 |
| Hype words and exclamation marks in copy | The voice rules in section 14 |


# 3. Brand identity

The identity is a chamfered tile holding a K, followed by the letters AIRO, so that the tile is the first letter of the name.


*The owner's brand identity guide, reproduced as the reference for this brief*


## Logo system


| Lockup | Where it is used | Rules |
| --- | --- | --- |
| Primary, dark theme (panel 01) | Dark backgrounds: the sign-in screen in dark theme, social preview, presentations | Emerald tile with a Midnight Ink K and Paper White letters |
| Primary, light theme (panel 02) | Light backgrounds: print, the PDF cover, documents | Midnight Ink tile with a Paper White K and Midnight Ink letters |
| Navbar lockup (panels 03 and 04) | The header on every page | Tile and letters on one line. Height 32 px on desktop, 28 px on phones |
| Footer lockup (panels 05 and 06) | The page footer and the PDF back cover | Tile above the letters, centered |
| Tile only (panel 07) | Favicon, app icon, avatar-sized spaces under 96 px | Never shown with a rounded corner. The chamfer is always at the top right |
| One-color versions (panel 11) | Single-color print, stamps, low-quality output | All white on dark, or all black on light |


*Primary logos, dark and light theme*


*Navbar usage, dark and light theme*


## Construction

The guide gives the construction numbers below. They are the only numbers the redraw may use.


| Property | Value |
| --- | --- |
| Grid | 8 by 8 |
| K stroke width | 18 percent of the tile |
| Slit width | 5 percent |
| Chamfer | 22 percent, at the top right |
| Margins | 16 percent |
| Angles | 45 degrees and 90 degrees only |
| Junction point | Where the arms meet at the center of the K |


*Construction, wordmark details, palette and one-color versions*


## Clear space and minimum size


| Rule | Value |
| --- | --- |
| Clear space | At least the width of the K stem on every side of any lockup |
| Minimum size, tile | 16 by 16 px on screen, 6 mm in print |
| Minimum size, lockup | 96 px wide on screen, 25 mm in print |
| Smallest lockup in the header | 28 px tall on phones |


## Do and do not

- Do place the lockup on Midnight Ink, Paper White, or a plain surface from the palette with enough contrast.
- Do use the one-color version when only one ink is available.
- Do not recolor the tile, add a gradient, outline, glow or shadow, rotate, stretch or round its corners.
- Do not place the lockup on photographs or busy backgrounds. There are no such backgrounds in the product.
- Do not retype the wordmark in another font. The letters are drawn, not typed.
- In running text, write the name in capitals: KAIRO. A lockup image always has the alternative text "KAIRO".

## Favicon and app icon set

The set below is derived from panel 07 and uses the emerald tile with a Midnight Ink K. Dimensions and files are final. The vector in this pack is a faithful redraw of the guide's raster, fitted to the construction numbers above, and it must be replaced by the designer's master vector when that exists (section 19).


*Favicon and app icon set*


| File | Size | Used for |
| --- | --- | --- |
| icon.svg | Vector | Primary favicon in modern browsers |
| favicon.ico | 16, 32 and 48 px in one file | Older browsers and some tools |
| apple-icon.png | 180 by 180 | iOS home screen. Midnight Ink background with the tile inset, because iOS masks the corners itself |
| icon-192.png and icon-512.png | 192 and 512 | Web manifest icons, with a transparent surround |
| icon-maskable-512.png | 512 by 512 | Android adaptive icons. The tile sits inside the central safe zone on a Midnight Ink field |
| icon-ink.svg | Vector | Light-theme tile for documents and print |
| opengraph-image.png | 1200 by 630 | Social preview: the dark primary lockup and one plain statement |
| manifest.webmanifest | Not applicable | Name, theme color Midnight Ink, background color Paper White, icon list |


## Social preview

The preview is a typographic card: the dark primary lockup at the top left, the statement "Find access-control flaws in AI-built apps before you launch." in IBM Plex Sans SemiBold, and one supporting line. It contains no screenshot, no gradient and no figure. A screenshot version may replace it only once real product screens exist.


# 4. Color

The palette is the three colors from the brand guide plus a restrained extension, and emerald is the only accent.


*Core and extended palette*


## Core colors


| Name | Value | Role |
| --- | --- | --- |
| Midnight Ink | #0B0D12 | Dark theme background, light theme text, logo tile on light |
| Paper White | #F2F0EA | Light theme background, dark theme text, button text |
| Deep Emerald | #0E6B57 | Primary buttons, solid accent fills, focus ring on light |
| Emerald tile | #0B9079 | The logo tile, as drawn in the guide (see section 19) |


## Theme tokens

Both themes are first-class. The default follows the person's system setting, and a setting on the Account screen can force either one.


| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| bg | #F2F0EA | #0B0D12 | Page background |
| surface | #FAF9F5 | #12151C | Cards, inputs, tables |
| raised | #FAF9F5 | #1A1E27 | Dialogs and menus |
| sunken | #E9E6DE | #080A0E | Code, wells, disabled controls |
| text | #0B0D12 | #F2F0EA | Primary text |
| text-2 | #333844 | #CFCCC2 | Secondary text |
| muted | #575C69 | #A3A39F | Captions, help text, metadata |
| line | #D9D5CA | #262B36 | Dividers and card borders |
| line-strong | #7A7667 | #6B7080 | Input borders and checkbox outlines |
| accent | #0E6B57 | #0E6B57 | Primary button fill |
| on-accent | #F2F0EA | #F2F0EA | Text on the primary button |
| accent-text | #0A5545 | #4CC2A2 | Links and active tab text |
| accent-tint | #DDEDE7 | #0F2A23 | Informational banners, selected rows |
| focus | #0E6B57 | #4CC2A2 | Focus ring |
| danger | #A12A20 | #A12A20 | Destructive button fill |


## Semantic colors

These appear only on severity labels, status labels and messages. Each pairs a text color with a tint, and both themes meet the contrast targets in section 15.


| Meaning | Light text on tint | Dark text on tint |
| --- | --- | --- |
| Critical | #A12A20 on #F8E5E2 | #FF9A8A on #2C1613 |
| High | #8F3F0B on #FBEBDD | #FFB885 on #2B1C10 |
| Medium | #6E5300 on #F8F0D2 | #EFCB62 on #2A2310 |
| Low | #2D4C74 on #E6ECF4 | #9CC1EE on #131F2E |
| Informational | #3A3F4B on #E9E6DE | #CFCCC2 on #1A1E27 |
| Fixed | #0A5545 on #DDEDE7 | #4CC2A2 on #0F2A23 |


## Rules for using color

- Emerald means action or brand. A primary button, a link, an active tab, a focus ring and the logo tile are emerald. Nothing else is.
- A screen has one emerald fill: its primary button. Banners use the tint, not the fill.
- Semantic colors never appear as backgrounds for large areas. They are labels and message tints only.
- Color never carries meaning alone. Every colored label has a word and a shape beside it.
- Surfaces are flat. There are no gradients, no glows and no decorative shadows.
- Paper White is a warm off-white. Do not substitute pure white for page backgrounds. Inputs and cards use the surface token, which is lighter than the page.

# 5. Typography

KAIRO uses IBM Plex Sans for the interface and IBM Plex Mono for code, both under the SIL Open Font License 1.1 and both self-hosted.


*Type scale in IBM Plex Sans and IBM Plex Mono*


## Why these families

The wordmark is drawn from hard geometry and 45 degree terminals. IBM Plex Sans has the same engineered, slightly squared character without competing with the logo, and its Mono companion shares the same proportions, so code blocks sit comfortably beside prose. Both have a full range of weights, tabular numerals and wide language support. The packages from the project's npm registry carry the OFL-1.1 license.


## Scale


| Style | Desktop size and line height | Phone size and line height | Weight | Use |
| --- | --- | --- | --- | --- |
| Display | 40 / 48 | 30 / 38 | 600 | The home page headline only |
| Heading 1 | 32 / 40 | 26 / 34 | 600 | Page titles |
| Heading 2 | 24 / 32 | 22 / 30 | 600 | Section titles |
| Heading 3 | 20 / 28 | 18 / 26 | 600 | Subsections |
| Heading 4 | 16 / 24 | 16 / 24 | 600 | Block labels such as "What is wrong" |
| Body | 16 / 24 | 16 / 24 | 400 | Running text |
| Small | 14 / 20 | 14 / 20 | 400 | Table cells, secondary text |
| Caption | 12 / 16 | 12 / 16 | 400 | Metadata, help text |
| Label | 12 / 16, tracked 0.06 em | 12 / 16 | 600 | Small eyebrow labels, the only uppercase text |
| Code | 14 / 20 in Plex Mono | 13 / 20 | 400 | Code, commands, paths, commit identifiers |


## Rules

- Weights in use: 400, 500 and 600. Bold 700 is not used.
- Line length in running text is 60 to 75 characters. Legal pages are held to 68.
- Numerals in tables, counters and progress text use tabular figures, so columns of numbers align.
- Headings are sentence case. Letter-spacing is normal except on Label text.
- Text is left-aligned. Nothing is justified or centered except short statements on error and sign-in screens.
- Fallback stack: IBM Plex Sans, then system-ui, then Segoe UI, Helvetica Neue, Arial, sans-serif. For code: IBM Plex Mono, then ui-monospace, Consolas, monospace.
- Fonts are subset to Latin, self-hosted, served with font-display: swap, and the Regular and SemiBold files of Plex Sans are preloaded. Two families at most (TRD section 15).

# 6. Layout, spacing and surfaces

The layout is a 12 column grid on a 4 px unit, held to a 1120 px content width, with hard-edged surfaces separated by 1 px lines.


*Grid and breakpoints*


## Grid and breakpoints


| Range | Columns | Gutter | Side margin | Notes |
| --- | --- | --- | --- | --- |
| 1024 px and up | 12 | 24 px | 40 px | Content is held to 1120 px and centered |
| 640 to 1023 px | 8 | 24 px | 32 px | Tables keep their columns where they fit |
| 360 to 639 px | 4 | 16 px | 16 px | Layouts stack. Tables become labeled blocks |
| Below 360 px | 4 | 12 px | 12 px | Content reflows. No sideways scrolling, except code and wide tables inside their own container |


## Spacing, radius and borders


| Token | Values |
| --- | --- |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64, 96 |
| Radius | 0 for tables and the page shell, 2 for labels, 3 for buttons and fields, 4 for cards and menus, 6 for dialogs. Nothing exceeds 8 |
| Borders | 1 px in the line token for cards and dividers. 1 px in line-strong for inputs. Focus and error borders are 2 px |
| Elevation | None on the page. Dialogs and menus use a 1 px line-strong border over a 55 percent scrim. No drop shadows |
| Density | One density. Table rows are 48 px, form fields 40 px |


## Page structure

- Header: 56 px tall, nav surface, a 1 px line below. Lockup at the left, navigation and account menu at the right.
- Main: one column, 1120 px maximum. The page title block sits at the top: trail, Heading 1, one line of metadata, and the page actions aligned right.
- Footer: a 1 px line above, then the five legal links and the version. It appears on every page (BR-12).
- Page padding: 48 px above the title block on desktop, 24 px on phones.

# 7. Iconography

One icon family, Lucide, is used throughout, drawn with square caps, mitered joins and a 1.75 stroke so it matches the hard geometry of the logo.


*The icon set in use, with its meaning*


## Why Lucide, and how it is customized

Lucide is licensed under the ISC License, is free for commercial use, and has more than 2,000 icons on a consistent 24 px grid. Version 1 removed all brand icons, which keeps trademarks out of the set. The default round caps look soft next to the logo, so the product draws every icon with a square line cap, a miter join and a 1.75 stroke, which gives crisp corners that echo the chamfered tile. Phosphor and Tabler were considered. Neither is needed, because the 44 icons on the sheet cover every function in the App Flow.


## Rules

- Icons are 16 px inline with text, 20 px inside controls, and 24 px in empty states. They inherit the text color.
- An icon never stands alone. A word always sits beside it, or the control has a visible text label. Icon-only buttons carry an accessible name and a visible tooltip.
- Only the 44 icons on the sheet are used. Adding one needs a review against the banned list.
- Banned: sparkle, stars, wand, robot, brain, magic and any other glyph that suggests "AI magic". Emoji are never used.
- The GitHub mark is not part of this family. It comes from GitHub's own logo assets and follows their guidelines. It appears only on the "Continue with GitHub" button.
- Severity, confidence and status use the drawn shapes in section 8, not icons from the family.

# 8. Components

Every component below is drawn once and reused. The sheet shows the main controls in both themes, and the tables give the numbers.


*Buttons, fields, banner, tabs and checkbox in both themes*


## Buttons


| Type | Fill and text | Use |
| --- | --- | --- |
| Primary | Deep Emerald fill, Paper White text | The single next step on a screen |
| Secondary | No fill, 1.25 px border in the text color, text in the text color | Other actions beside a primary |
| Link | Accent text, underlined | Low-emphasis actions inside content |
| Danger | Danger fill, Paper White text | Irreversible actions, always inside a confirming dialog |
| Disabled | Sunken fill, muted text, line border | An action that is not available, with the reason stated beside it |


| Property | Value |
| --- | --- |
| Heights | 32 px small, 40 px default, 48 px on the home page |
| Padding | 16 px sides, 20 px on the 48 px size |
| Radius | 3 px. Never fully rounded (BR-2) |
| Text | 15 px SemiBold, sentence case, a verb and an object: "Start scan", "Add project" |
| States | Hover darkens the fill one step. Focus shows the 2 px ring with a 2 px offset. Busy keeps the width and changes the label, for example "Saving". There is no spinner animation |
| Minimum width | 96 px |


## Fields


| Property | Value |
| --- | --- |
| Label | Above the field, 14 px Medium. The word "required" follows it in muted text. A symbol alone is never used |
| Control | 40 px tall, surface fill, 1 px line-strong border, 3 px radius, 12 px padding. Commands, paths and ports use Plex Mono |
| Help | 13 px muted text under the control, linked to it |
| Error | The border becomes 2 px in the error color. The message starts with the word "Error:" and replaces the help text |
| Focus | 2 px border in the focus color |
| Secret field | Masked after saving. Shows "Replace" and "Remove". A "Show" and "Hide" text button reveals text while typing |
| Checkbox and radio | 18 px box, line-strong border, a drawn check or dot. The label sits to the right and is part of the target |
| File picker | A bordered area with the limits written inside it and a "Choose file" button. Dropping a file works too |


## Severity, confidence and status


*Severity, confidence and status in both themes*


| Element | Design |
| --- | --- |
| Severity label | A tinted rectangle with a 2 px radius, a shape and the word. Critical: filled square. High: filled triangle. Medium: filled diamond. Low: filled circle. Informational: ring |
| Confidence | Three small bars, filled three, two or one, followed by the word Confirmed, Likely or Possible |
| Status | Open: ring. Fixed: check in a filled circle. Dismissed: a ring with a slash. The word always follows |


## Other components


| Component | Specification |
| --- | --- |
| Banner | Tint fill, 1 px line border, 4 px radius, a 20 px icon, a bold first line and one supporting line. Variants: information, warning, error, success. There is no colored side stripe |
| Tabs | Text only. The active tab is SemiBold with a 2 px accent underline. A 1 px line runs under the row. Targets are 40 px tall |
| Dialog | 480 px wide, 640 px for the larger ones, 24 px padding, 6 px radius, line-strong border, 55 percent scrim. Title in Heading 3. A close icon button at the top right. Focus is trapped inside |
| Table | No zebra. A 1 px line between rows. Header cells are 12 px SemiBold muted. Rows are 48 px. The row title is a link in accent text |
| Stage row | A state marker, the stage name in SemiBold, the state word, and one detail line. States: complete is a check in a filled circle, running is a half-filled ring, queued is a dashed ring. No animation |
| Finding row | Severity label, confidence, status, title as a link, then the route and file in Plex Mono |
| Code block | Sunken fill, 1 px line border, 3 px radius, Plex Mono 14 px, line numbers in muted text, the highlighted line marked by a 3 px accent bar at the left, a Copy button at the top right |
| Request and response block | The code block with a heading that says "Request" or "Response", and the note "Passwords, tokens and cookies were removed." |
| Filter bar | Controls on one line. Each shows its name and current value. The state lives in the address |
| Empty and error block | A 24 px icon, a Heading 3 sentence, one line of body text, and one action. Left-aligned inside the content area. No illustration |
| Header, footer, trail | As in section 6. The trail uses slashes, the current part is plain text |
| Copy button | A 16 px copy icon with the word "Copy". On success the word becomes "Copied" |
| Show more | A link-style button under a list, never infinite scroll |


# 9. Screen designs

Each mockup below shows the structure, hierarchy and styling of one screen, using sample data, and the notes call out the decisions that are not obvious from the picture.


## P-01 Home

The home page states what the product does in one headline, shows a real-looking report as proof of how it reads, and explains the three steps and one honest limit.


*P-01 Home, dark theme, with sample data*

- Layout: header, a two-part hero (headline and action at the left, a report panel at the right), a "How it works" row of three cards, a plain limits statement, and the footer.
- The only emerald fill is the "Continue with GitHub" button. The GitHub mark sits inside it, from GitHub's own assets.
- The report panel is built from the real finding components with sample data and the label "Sample data". It is not a screenshot and carries no numbers about usage.
- There are no logos of customers, no counts, no testimonials and no stock imagery (BR-6, BR-8).
- The statement "What KAIRO does not do" is on the page itself, not in the footer.
- The copy shown is a draft. The headline mirrors the social preview.

## A-02 Projects


*A-02 Projects, light theme, with sample data*

- The table uses the standard table component. The project name is the link. The result column gives counts in words, and "No findings in checks run" is worded to avoid claiming safety.
- "Add project" is the page's primary action. With no projects the table is replaced by the empty block E-03.

## A-07 Project settings, Run tab


*A-07 Settings, Run tab, light theme*

- Tabs follow the App Flow: Source, Run, Accounts, Review, Ignore, Danger zone.
- Secret values show the last two characters with "Replace" and "Remove". The page says "Values are write-only. A saved secret cannot be shown again."
- Save is primary and Cancel is secondary. Leaving with unsaved changes opens dialog D-12.

## A-08 Scan progress


*A-08 Scan progress, dark theme, with example values*

- One row per stage, each with a state marker, a name, a state word and a detail line.
- The overall state and the word "Live" sit at the top right. Stop scan is secondary, because stopping is never the next step.
- There is no spinner or moving bar. Counters change as text.

## A-09 Report


*A-09 Report, light theme, with sample data*

- Order: trail, title, metadata line, page actions, warning banner when needed, result overview, filters, finding list, Show more.
- The overview cards show severity labels with counts and no composite score.
- The banner appears above the overview whenever a stage failed, was partial or was skipped (N-02). It is never placed below the fold.

## A-10 Finding


*A-10 Finding, light theme, with sample data*

- Severity, confidence and status sit above the title. The title is Heading 1.
- Blocks appear in a fixed order: What is wrong, Evidence, How to fix, How to verify, Detected by, References.
- Evidence and fix use the code block. The evidence note states what was removed from it.
- The AI-assisted note appears under "Detected by" in plain text whenever logic review contributed.
- Re-check is the primary action. Dismiss is secondary.

## D-03 Dialog


*D-03 Dismiss a finding, dark theme*

- The dialog follows the component rules. The reason field shows the warning that the reason appears in reports and shared links.
- Dismiss is primary. Cancel is secondary. Escape closes the dialog. Focus starts on the first choice.

## O-02 Operator dashboard


*O-02 Operations dashboard, dark theme, with sample data*

- The operator console uses the dark theme only and a visible "Private link only" tag in the header, so it cannot be mistaken for the product.
- It shows queue, error and runner figures and nothing about customer content.

## The remaining screens

Every other screen uses a pattern already drawn above, so this table is the specification.


| Screen | Pattern | Notes |
| --- | --- | --- |
| P-02 Sign in | Centered card, 400 px wide | The tile at 40 px, Heading 1 "Sign in", the GitHub button, one line "KAIRO asks GitHub for your identity only", and the Privacy and Terms links |
| P-05 Security, P-06 Contact | Legal page layout (section 10) | P-05 leads with how to report a vulnerability. P-06 lists each address with its purpose |
| P-07 Licenses | Legal page layout with a table | Component, license and link, generated from the software bill of materials |
| P-08 Shared report | Report layout without owner actions | A banner reads "Shared report. Read only. Expires on {date}." Each finding without evidence says so |
| P-09, P-10 Errors | Centered block, 560 px | Heading 1 with the message from the App Flow, one line of help, and links to Home and Projects |
| A-01 Welcome | Centered card, 480 px | The two document names with their versions as links, and one primary button "Accept and continue" |
| A-03 Add project | Two option cards | "GitHub repository" and "Upload archive", each with one line of description and its own primary-weight button |
| A-04 Choose repository | Search field and a list | Rows with repository name and visibility. A link "Missing a repository? Change access on GitHub" sits below |
| A-05 Upload archive | File picker and limits | The limits are written inside the picker. A progress line states the percentage in words while uploading |
| A-06 Project overview | Summary block and table | Source, latest scan, a "Start scan" primary button and the scan history as a table |
| A-11 Route inventory | Wide table | Method, path, handler, and the three checks as words: Detected, Absent, Unknown |
| A-12 Compare scans | Two selectors and three groups | New, Fixed and Unchanged, each a titled list with a count |
| A-13 to A-15 Account | Stacked sections | Each section is a bordered card with a Heading 3, a description and its action |
| A-16 Shared links | Table | Created, expires, evidence included, and a Revoke link |
| O-01, O-03 to O-06 | Operator shell | The same header and table patterns as O-02 |
| D-01, D-02, D-04 to D-13 | Dialog component | Width and content from the App Flow. The authorization checkbox in D-01 is not pre-checked |


# 10. Legal and trust pages

The legal pages are designed as documents first: a clear version bar, a stable table of contents and a comfortable reading column.


*P-03 Privacy Policy layout, light theme. The wording is a draft and is not final text*


## Layout

- A narrow left column holds "On this page" with anchor links to each section. A 1 px line separates it from the reading column.
- The reading column is 68 characters wide. Headings are Heading 2 and Heading 3. Body text is 16 px with 24 px line height.
- Directly under the title sits a version bar: version number, effective date, and a link to earlier versions. Each earlier version has its own address under /privacy/archive/{version} or /terms/archive/{version} (App Flow section 15).
- Data tables, such as what is collected and how long it is kept, use the standard table component.
- On phones the table of contents becomes a collapsed "On this page" control above the text.
- There are no cookie banners in Release 1 because only strictly necessary cookies are used. If one is ever added it must follow LR-7, with Accept and Reject buttons of equal size and style.

## Content structure the layout must support


| Page | Sections |
| --- | --- |
| Privacy Policy (P-03) | Who we are, What we collect, Why we collect it, How long we keep it, Who receives it, How code is reviewed by a model, Your rights, Children, Security, Changes, Contact |
| Terms and Conditions (P-04) | Acceptance, Authorized use, Your content, Reports, No guarantee, AI-assisted review, Service changes and termination, Liability, Governing law, Changes, Contact |
| Security (P-05) | Report a vulnerability, Scope, What we ask of reporters, How we handle your code, Contact |
| Contact (P-06) | Support, Privacy and grievances, Abuse reports, Security reports |
| Licenses (P-07) | Third-party components and their licenses |


The wording is drafted separately and reviewed by a qualified professional before launch (LR-11). The layout carries no placeholder text when it ships (BR-13).


# 11. Report and PDF design

The PDF is the same report as the web view, set for A4 paper and designed to read well in black and white.


## Page setup


| Property | Value |
| --- | --- |
| Page | A4, portrait |
| Margins | 20 mm on all sides |
| Header | The light-theme navbar lockup at 24 px height at the left. The project name and scan date at the right in 9 pt muted text. A 0.5 pt line below |
| Footer | "Page x of y" at the right, the commit identifier in Plex Mono at the left, a 0.5 pt line above |
| Fonts | IBM Plex Sans for text and IBM Plex Mono for code, embedded in the file. Body 10 pt on 14 pt, code 8.5 pt |
| Color | Midnight Ink on white. Severity labels print as a shape plus a word and stay legible in grayscale |
| Accessibility | A tagged PDF with real headings, table headers and alternative text |


## Structure

- A first page with the report title, the scan summary table, the result overview as a table, and the scope and limits statement.
- Findings, grouped by severity, each starting with its label, confidence and title. A finding is kept together on a page where it fits.
- Dismissed items, with reasons.
- An appendix with the route inventory and the glossary.
- A back page with the footer lockup.

## Rules

- A warning banner on the web becomes a boxed paragraph on the first page with the word "Warning" at its start.
- Code blocks never split across pages when shorter than 30 lines.
- Evidence is included in the PDF only when the owner chose to include it (App Flow section 13).
- Every export states the KAIRO version, rule set version and model identifier at the foot of the first page (FR-R9).

# 12. Responsive design

The product is designed for desktop first and must remain fully usable from 360 px wide, with content that reflows at 320 px.


*A-09 Report on a phone, light theme*


## Behavior below 640 px


| Element | Behavior |
| --- | --- |
| Header | The lockup at 28 px height. A labeled menu button replaces the links. The account control stays visible |
| Page title block | Actions move below the title, full width, stacked |
| Result overview | Counts stack as a list, one severity per line |
| Finding rows | Become cards with severity and confidence on the first line, the title below, and the location last |
| Tables | Narrow tables become labeled blocks. Wide tables scroll sideways inside their own container, which can be focused and scrolled by keyboard |
| Tabs | Become a labeled select or a vertical list |
| Dialogs | Fill the screen with the actions fixed at the bottom |
| Code | Scrolls sideways inside its block. Lines are never wrapped, so indentation stays accurate |
| Forms | Fields are full width. Buttons are full width |


Targets are at least 24 by 24 px, and 44 px where space allows. Text can be enlarged to 200 percent without loss of content or function.


# 13. Motion

Motion confirms a change of state and nothing else.


| Item | Specification |
| --- | --- |
| Durations | 0 ms, 120 ms for color and border changes, 150 ms for dialog fade |
| Easing | A single standard curve: cubic-bezier(0.2, 0, 0, 1) |
| Allowed | Hover and focus color changes. Dialog and menu fade. Disclosure open and close with no movement of surrounding content |
| Not allowed | Scroll-triggered animation, parallax, reveal-on-scroll, cursor effects, looping or decorative animation, spinners, shimmer, bouncing or elastic easing |
| Progress | Text and counters change in place. Running stages show a static half-filled marker |
| Loading | A static placeholder shaped like the content, with no shimmer |
| Reduced motion | When the person asks for reduced motion, every transition duration becomes 0 ms |


# 14. Content design

KAIRO writes the way a careful colleague would: plain, specific and calm.


## Voice

- Say what happened, then what to do. Use short sentences in the present tense.
- Address the person as "you". Refer to KAIRO by name, not as "we", when describing what the product did.
- Be specific. "The application did not start within 120 seconds" beats "Something went wrong".
- Be honest about limits. Never claim safety. Say what was checked and what was not.
- No hype words (unlock, supercharge, seamless, revolutionize, elevate, game-changing, cutting-edge, leverage), no exclamation marks, no rhetorical questions in headings, no em dashes.

## Vocabulary


| Use | Avoid |
| --- | --- |
| Finding | Issue, alert, threat |
| Scan | Audit, assessment, analysis run |
| Fix | Remediation, mitigation |
| Re-check | Retest, rerun |
| Dismiss | Suppress, ignore |
| Project | Application, app (except when describing the person's code) |
| Test account | Dummy user, fake user |
| AI-assisted | AI-powered, smart, intelligent |
| Sign in, sign out | Log in, log out |


## Patterns


| Pattern | Rule | Example |
| --- | --- | --- |
| Buttons | A verb and an object. No "Submit", "OK" or "Yes" | "Start scan", "Add project", "Accept and continue" |
| Page titles | A noun phrase naming the thing | "Report for my-shop-api" |
| Empty states | What is missing, then the action | "No projects yet. Add a repository or upload an archive to run your first scan." |
| Errors | What happened, why if known, what to do | The 37 messages in App Flow section 17 |
| Warnings | State the consequence | "Some checks did not finish. See what was skipped." |
| Confirmations | Name the object and the effect | "Delete my-shop-api and its scans" |
| Numbers | Digits with thousands separators and units written out | "2,000 requests", "13 minutes" |
| Dates and times | Day, month name, year. Time with its zone | "12 October 2026, 14:30 IST" |
| AI involvement | A plain label wherever logic review contributed | "Logic review (AI-assisted)" |


The messages themselves are fixed in the App Flow and are not rewritten here.


# 15. Accessibility

The product meets WCAG 2.2 level AA, and the palette was chosen so that every text and control pair passes before any screen is designed.


## Contrast results

Ratios were calculated from the hex values. Text needs at least 4.5 to 1, and borders and focus indicators need at least 3 to 1.


| Pair | Light | Dark |
| --- | --- | --- |
| text on bg | 17.05 | 17.05 |
| text on surface | 18.45 | 16.03 |
| text-2 on bg | 10.30 | 12.10 |
| muted on bg | 5.87 | 7.68 |
| muted on surface | 6.35 | 7.22 |
| accent-text on bg | 7.68 | 8.83 |
| accent-text on accent-tint | 7.23 | 6.94 |
| on-accent on accent (button text) | 5.65 | 5.65 |
| line-strong on bg (input border) | 3.99 | 3.94 |
| line-strong on surface | 4.32 | 3.70 |
| focus on bg (focus ring) | 5.65 | 8.83 |
| danger button text | 6.43 | 6.43 |
| Critical label | 6.03 | 8.32 |
| High label | 6.25 | 9.75 |
| Medium label | 6.34 | 9.94 |
| Low label | 7.37 | 8.93 |
| Informational label | 8.45 | 10.38 |
| Fixed label | 7.23 | 6.94 |


The logo tile is exempt from text contrast rules. For reference, the Midnight Ink K on the emerald tile measures 4.89 to 1.


## Requirements


| Area | Requirement |
| --- | --- |
| Focus | A 2 px solid ring in the focus token with a 2 px offset on every interactive element, never removed and never hidden under sticky content |
| Targets | At least 24 by 24 px. Buttons are 40 px tall by default |
| Color independence | Severity, confidence, status and form errors are conveyed by words and shapes as well as color |
| Text | Resizable to 200 percent. Line height of 1.5 for body text, and 16 px between paragraphs |
| Motion | Honors the reduced-motion setting (section 13) |
| Forced colors | In high-contrast modes the borders, focus rings and shapes still carry meaning. The logo keeps its own colors |
| Keyboard | Every function works without a mouse, in a logical order, with a skip link and no keyboard traps outside dialogs |
| Screen readers | One level 1 heading per page, landmarks for header, navigation, main and footer, table headers, labels linked to fields, errors linked to fields, and the live announcements in App Flow section 18 |
| Names | The lockup has the text alternative "KAIRO". Icon-only controls have accessible names |
| Language | The page language is declared on the root element |


## How it is checked

- A script reads the token file, converts every pair in the table above and fails the build if any falls below its threshold (TRD section 15).
- axe-core runs on every route in the staging pipeline.
- Before each release a person walks through sign-in, starting a scan and reading a finding using only a keyboard, and again with a screen reader, in both themes.

# 16. Design tokens

All visual values live in one file, and Tailwind reads them from there, so a color or size can be changed in one place and checked in one place.

:root {

color-scheme: light dark;

/* light theme (default) */

--bg: #F2F0EA;        --surface: #FAF9F5;     --raised: #FAF9F5;     --sunken: #E9E6DE;

--text: #0B0D12;      --text-2: #333844;      --muted: #575C69;

--line: #D9D5CA;      --line-strong: #7A7667;

--accent: #0E6B57;    --on-accent: #F2F0EA;   --accent-text: #0A5545; --accent-tint: #DDEDE7;

--focus: #0E6B57;     --danger: #A12A20;

--sev-critical: #A12A20;  --sev-critical-bg: #F8E5E2;

--sev-high: #8F3F0B;      --sev-high-bg: #FBEBDD;

--sev-medium: #6E5300;    --sev-medium-bg: #F8F0D2;

--sev-low: #2D4C74;       --sev-low-bg: #E6ECF4;

--sev-info: #3A3F4B;      --sev-info-bg: #E9E6DE;

--status-fixed: #0A5545;  --status-fixed-bg: #DDEDE7;

/* type */

--font-sans: "IBM Plex Sans", system-ui, "Segoe UI", "Helvetica Neue", Arial, sans-serif;

--font-mono: "IBM Plex Mono", ui-monospace, Consolas, monospace;

/* space, radius, motion */

--space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;

--radius-label: 2px; --radius-control: 3px; --radius-card: 4px; --radius-dialog: 6px;

--dur-fast: 120ms; --dur-dialog: 150ms; --ease: cubic-bezier(0.2, 0, 0, 1);

}

:root[data-theme="dark"] {

--bg: #0B0D12;        --surface: #12151C;     --raised: #1A1E27;     --sunken: #080A0E;

--text: #F2F0EA;      --text-2: #CFCCC2;      --muted: #A3A39F;

--line: #262B36;      --line-strong: #6B7080;

--accent-text: #4CC2A2; --accent-tint: #0F2A23; --focus: #4CC2A2;

--sev-critical: #FF9A8A;  --sev-critical-bg: #2C1613;

--sev-high: #FFB885;      --sev-high-bg: #2B1C10;

--sev-medium: #EFCB62;    --sev-medium-bg: #2A2310;

--sev-low: #9CC1EE;       --sev-low-bg: #131F2E;

--sev-info: #CFCCC2;      --sev-info-bg: #1A1E27;

--status-fixed: #4CC2A2;  --status-fixed-bg: #0F2A23;

}

@media (prefers-color-scheme: dark) {

:root:not([data-theme="light"]) { /* the same values as the dark block above */ }

}

@media (prefers-reduced-motion: reduce) {

*, *::before, *::after { transition-duration: 0ms !important; animation-duration: 0ms !important; }

}


## Rules the build enforces (TRD section 15)

- Color literals appear only in this file.
- No gradient functions appear anywhere. No token falls between 250 and 300 degrees of hue.
- The radius scale stops at 6 px, and only the avatar component may use a full radius.
- Every pair in section 15 is converted to a contrast ratio and checked.
- The icon package may not import its sparkle, star or wand glyphs.

# 17. Assets and hand-off

The brand asset pack accompanies this brief, and the checklist below is what remains before design is complete.


## Delivered in the asset pack


| File | Purpose |
| --- | --- |
| icon.svg and icon-ink.svg | The tile as vector, emerald and ink versions |
| favicon.ico | 16, 32 and 48 px |
| apple-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png | Platform icons |
| opengraph-image.png | Social preview, 1200 by 630 |
| manifest.webmanifest | Manifest with theme and background colors |


## Still needed from the designer

☐   Master vector files for the tile, the wordmark letters and every lockup (dark, light, navbar, footer, one-color). The pack's tile is a redraw from the raster guide.

☐   Confirmation of the emerald used on the tile (section 19).

☐   The GitHub mark file and a check against GitHub's logo guidelines.

☐   Self-hosted font files for IBM Plex Sans (400, 500, 600, italic 400) and IBM Plex Mono (400, 500), subset to Latin.

☐   Final copy for the home page and the legal documents, from the owners.


## Visual quality checklist for release

☐   Every page shows the footer with five links, in both themes.

☐   No gradient, no pill-shaped control, no emoji, no sparkle icon and no em dash appears anywhere.

☐   Every severity, confidence and status reads correctly with color removed.

☐   Every screen in the App Flow has a designed default, loading, empty and error state.

☐   The favicon shows correctly in a browser tab, a bookmark and an iOS home screen.

☐   The PDF report is legible printed in black and white.

☐   Every page passes the axe-core check and the keyboard walkthrough.


# 18. Traceability

Each brand guardrail in the PRD has a design decision here, and each component the App Flow asked for has a specification.


| PRD guardrail | Design decision | Section |
| --- | --- | --- |
| BR-1 No purple or violet gradients | Flat fills only. A hue check on every token | 2, 4, 16 |
| BR-2 No pill-shaped controls | 3 px radius on controls and a scale that stops at 6 px | 6, 8 |
| BR-3 No em dashes | Voice rules and a repository check | 14 |
| BR-4 No scroll or cursor effects | Motion specification | 13 |
| BR-5 One icon family, no emoji, no sparkle | Lucide with a banned list | 7 |
| BR-6 No fabricated proof | The home page and mockups use only labeled sample data | 2, 9 |
| BR-7 Copy rules | Voice, vocabulary and patterns | 14 |
| BR-8 No generated or stock imagery | Product screens, diagrams and typography only | 2, 9 |
| BR-9 No AI badges | A plain "AI-assisted" label where relevant | 2, 14 |
| BR-10 Favicon set | The icon files and manifest | 3, 17 |
| BR-11 Metadata | Social preview and manifest | 3 |
| BR-12 Footer links | Footer in the page structure and on every mockup | 6, 9 |
| BR-13 No placeholders | The legal layout ships without placeholder text | 10 |
| BR-14 Error and empty states | A designed block, with messages from the App Flow | 8, 14 |
| BR-15 Accessible severity and contrast | Words, shapes and a contrast table | 8, 15 |


| App Flow component | Specified in |
| --- | --- |
| Header, footer, location trail | Sections 6 and 8 |
| Banner and error summary | Section 8 |
| Dialog with a typed-confirmation variant | Section 8 |
| Stage row | Section 8 |
| Severity, confidence and status labels | Section 8 |
| Finding row and result overview | Sections 8 and 9 |
| Code and evidence blocks | Section 8 |
| Settings tabs, secret field, test account form | Sections 8 and 9 |
| File picker, repository list, filter bar | Section 8 |
| Data table and stacked variant | Sections 8 and 12 |
| Empty and error blocks | Section 8 |
| Legal document layout | Section 10 |
| Operator console shell | Section 9 |


# 19. Open questions and decisions

Eight points need a decision from the owner or the designer before the design is final.

☐   **Emerald value.** The guide states Deep Emerald as #0E6B57 for the logo tile, but the tiles drawn in the guide measure about #0B9079, which is brighter. This brief uses #0E6B57 for buttons and accents and #0B9079 for the tile so that the tile matches the drawn logo. Confirm which value is intended for the tile.

☐   **Paper White value.** The guide states #F2F0EA, while the swatch drawn in the guide measures a slightly lighter #FAF6EF. This brief uses the stated value.

☐   **Master vectors.** The tile in the asset pack is a redraw from a raster. The designer's vector master replaces it, and the wordmark letters need a vector master too.

☐   **Navbar links.** The guide's navbar sample shows Home, Scan, Features and Pricing. The product header shows Projects and Account when signed in, and Security and Sign in when signed out, because billing and pricing are outside Release 1. Confirm.

☐   **Dark theme in Release 1.** The guide defines both themes. This brief ships both and adds an Appearance setting (System, Light, Dark) to the Account screen, which the App Flow does not yet include. Confirm, or defer dark to Release 2.

☐   **Operator console theme.** The console is dark only, to separate it from the product. Confirm.

☐   **Home page copy.** The headline and the three steps are drafts. The owners write the final words.

☐   **Icon family.** Lucide with square caps is proposed. Confirm, or name another family that satisfies BR-5.


# 20. Sources

- The owner's KAIRO Geometric Brand Identity Guide, supplied with this brief, for the logo system, construction numbers, palette and favicon sizes
- , for the ISC License and the statement that brand logos are not accepted
- , for the removal of brand icons
- IBM Plex Sans and IBM Plex Mono packages from the npm registry, licensed OFL-1.1
- Product Requirements Document v0.1, Technical Requirements Document v0.1 and App Flow v0.1, which this brief implements
- WCAG 2.2 level AA, the accessibility standard that sections 8 and 15 follow
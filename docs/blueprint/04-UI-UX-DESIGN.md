# UI/UX Design Document

**Product:** Sakinah | **Status:** As Built | **Version:** 1.0 | **Date:** 2026-09-07

## 1. Brand identity and assets

Sakinah uses a calm, devotional visual language: deep emerald, warm gold, cream surfaces, rounded cards, editorial serif headings, and Arabic-friendly reading text. Approved repository assets are `public/assets/sakinah-logo.png`, `public/icons/icon-192.png`, and `public/icons/icon-512.png`.

## 2. Verified palette

| Token/use | Hex | RGB |
|---|---|---|
| Primary emerald `--green` | `#0F5132` | 15, 81, 50 |
| Secondary emerald `--green2` | `#176B49` | 23, 107, 73 |
| Gold `--gold` | `#D4AF37` | 212, 175, 55 |
| Cream `--cream` | `#F8F5ED` | 248, 245, 237 |
| Card `--card` | `#FFFDFA` | 255, 253, 250 |
| Text `--text` | `#17352A` | 23, 53, 42 |
| Muted `--muted` | `#718078` | 113, 128, 120 |
| Line `--line` | `#E5E7DF` | 229, 231, 223 |
| Page background | `#E7EBE8` | 231, 235, 232 |
| Dark cream/card | `#101A16` / `#17241E` | 16,26,22 / 23,36,30 |

Dark mode remaps cream, card, text, muted, line, shadow, and active accents through `html[data-theme=dark]`.

## 3. Typography

| Role | Family | Typical values |
|---|---|---|
| Interface/body | DM Sans | 8–13 px in compact mobile UI; 400–700 |
| Display/headings | Playfair Display | 17–30 px; 600–700 |
| Quran/Arabic | Noto Naskh Arabic (component declarations) and Amiri import | Reader commonly 23–30 px; line-height 1.65–2 |
| Quote fallback | Georgia | Decorative quote glyph |

Google Fonts imports Amiri, DM Sans, and Playfair Display. Some components reference Noto Naskh Arabic without a matching Google import, so actual rendering may fall back to an installed Arabic font: inconsistency.

## 4. Spacing, radius, shadows

No formal numeric token scale exists. Repeated spacing clusters are 4, 8–12, 14–20, 22–30 px. Radius values vary intentionally: 8–14 px controls, 13–20 px cards, 22–30 px hero/modal surfaces, and 50% circles. Primary shadow is `0 12px 35px rgba(17,65,44,.09)`; deeper overlays use approximately `0 25–30px 80–90px rgba(0,0,0,.3–.4)`.

## 5. Layout and breakpoints

- `.app`: full width, maximum 560 px, minimum viewport height, centered.
- Main content: 20 px horizontal padding.
- Primary grids: two columns; Quran Juz grid uses three columns.
- Primary breakpoint: `min-width: 561px` adds 24 px page inset and rounded application shell.
- Mobile sidebar rule: `max-width: 560px` anchors drawer to the right.
- Safe-area bottom padding is used in bottom navigation.

## 6. Navigation patterns

- Sticky 76 px header with brand/back button, centered secondary title, and hamburger.
- Fixed 76 px bottom navigation: Home, Quran, Hadith, Ibadat, More.
- Right slide-out account/settings drawer with backdrop.
- Persistent prayer banner at the top of every main screen.
- Secondary screens use a Home-return back action rather than browser history traversal.

## 7. Components and states

| Component | Appearance/states | Source |
|---|---|---|
| Header | Brand vs back state; menu circle | `src/App.jsx`, `styles.css` |
| Prayer banner | Emerald gradient, mosque/crescent animation, countdown | `Upgrade.jsx`, `upgrade.css` |
| Bottom navigation | Muted/default and emerald/active | `App.jsx`, `styles.css` |
| Feature cards | White/cream, border, icon tile, chevron | `App.jsx`, `styles.css` |
| Buttons | Primary emerald, gold update, outlined/ghost, disabled opacity | Multiple CSS files |
| Inputs | Rounded card/background; search leading icon; native selects | `styles.css`, `auth.css`, `content.css` |
| Cards | 13–25 px radius, line border, occasional shadow | All view CSS |
| Modal | Centered 26 px auth dialog on translucent backdrop | `AuthModal.jsx`, `auth.css` |
| Drawer | Right fixed sidebar, shade, grouped settings | `App.jsx`, `upgrade.css` |
| Toast/note | Pale green compact status or centered muted note | `styles.css` |
| Badges | Small uppercase gold labels; next-prayer chip | Multiple |
| Loading | Suspense text, notes, Flash shimmer skeleton | `App.jsx`, `upgrade.css` |
| Empty | Centered moon icon and muted message | `App.jsx` |
| Error | Root retry screen or inline note/message | `main.jsx`, views |
| Icons | Lucide React line icons; logo PNG | Components/public |

Tables are not a meaningful app UI pattern. There is no general toast manager. Validation messages are inline, especially auth and custom-image errors.

## 8. Motion

- Onboarding/splash uses layered fixed surfaces and transitions.
- Mosque floats in 3D perspective; crescent glows.
- Counter scales on active press.
- Flash skeleton shimmers until image decode.
- Reduced-motion media query disables selected animations, not every transition.

## 9. Forms and validation UX

Auth uses required fields, email type, length limits, password autocomplete, busy state, and role=status feedback. Custom Tasbeeh uses required title/target, bounded number input, MIME-restricted file picker, and inline image error. Some provider/action failures remain console-only rather than surfaced near the initiating control.

## 10. Accessibility review

| Area | As-built assessment |
|---|---|
| Contrast | Core emerald/cream combinations are generally strong; very small muted text needs device review |
| Keyboard | Native buttons/inputs are keyboard-operable; focus styling is inconsistent/not systematically defined |
| Labels | Many icon buttons have labels, but some image/control labels are incomplete |
| Semantics | Auth modal has dialog semantics; sections/headings used; drawer lacks explicit dialog/navigation role |
| Text selection | Globally disabled except inputs/textareas, reducing native reading/copy accessibility |
| Font size | Numerous 8–10 px labels are visually compact and may fail user readability expectations |
| Motion | Partial reduced-motion support exists |
| Arabic | `dir=rtl` used in selected components; not systematic across all Arabic content |

## 11. Component inventory

- `src/App.jsx`: Header, Sidebar, Quran reader/control/favorites/edition browser, Tasbeeh, Prayer, Qibla, Library, Hadith, Calendar, Profile, InstallGate, scheduling and empty state.
- `src/components/Upgrade.jsx`: EnhancedOnboarding, PersistentPrayer, EnhancedHome, FlashCard, Flashes, Duas, Shahadat, Ibadat, More, Waqf, Names.
- `src/components/QuranExtras.jsx`: SeerahSeries, RecitationLibrary, QuranSubjects, FahmCourse, LineMushaf.
- `src/components/AuthModal.jsx`: accessible account dialog and flows.

## 12. Current inconsistencies

- Noto Naskh Arabic is referenced but not imported alongside the three declared Google fonts.
- Font sizes are often below 11 px.
- Focus-visible treatment is not standardized.
- Both legacy and enhanced home/onboarding components remain in source; enhanced versions are active.
- Some CSS is minified into long lines while other files are expanded.
- Status/error presentation varies by module.
- Global no-selection behavior conflicts with copying Quran/Hadith text and some accessibility expectations.

## 13. Hard aesthetic rules

- Preserve emerald `#0F5132` and gold `#D4AF37` as primary identity.
- Preserve cream/card warmth and restrained dark mode.
- Keep mobile-first, centered 560 px shell and safe-area bottom bar.
- Use Playfair for editorial headings and an actual Arabic-capable font for scripture.
- Keep religious content uncluttered and never cover Arabic text with decoration.
- Use rounded, calm surfaces; avoid neon colors, dense gradients, or unrelated illustration styles.
- Respect reduced motion and improve focus/readability before adding further animation.
# Product Requirements Document

**Product:** Sakinah - Islamic Companion  
**Document status:** As Built with implementation-status labels  
**Version:** 1.0 | **Date:** 2026-09-07

## 1. Product title and pitch

**Sakinah** is an installable, mobile-first Islamic companion that brings Quran study, Hadith, prayer support, remembrance, and daily guidance into one calm web application.

## 2. Executive summary

Sakinah serves guests and registered Muslims on Android, iOS, and desktop browsers. Guests can use most content locally; registered users can sync supported bookmarks and Tasbeeh records through an account. The product is delivered as a Progressive Web App (PWA), with an install gate in browsers and first-run onboarding in standalone mode.

## 3. Purpose and problem

Islamic resources are often distributed across unrelated websites and apps. Sakinah reduces switching by placing worship utilities, source content, personal progress, and shareable reminders under a consistent interface. It addresses discoverability, mobile convenience, location-aware prayer support, and continuity across sessions.

## 4. Target users and stakeholders

- Muslims seeking a daily Quran, Hadith, prayer, Dua, and Dhikr companion.
- Learners who want topical Quran references, recitation, and structured lessons.
- Travellers needing local prayer time and Qibla assistance.
- Guests who prefer no account.
- Registered users who need supported cloud synchronization.
- Product owner, content reviewers, support contact, Supabase/Vercel operators.

### Roles

| Role | Capabilities |
|---|---|
| Guest | Browse content; use utilities; retain selected data locally in the browser |
| Authenticated user | Guest capabilities plus supported Supabase synchronization |
| Administrator | Not implemented or verified from repository |

## 5. Pain points addressed

- Multiple disconnected religious tools.
- Loss of progress between visits.
- Difficulty finding Quran passages by topic or location.
- Static prayer schedules that do not follow current coordinates/date.
- Poor mobile readability and lack of installable access.

## 6. Current scope and modules

| Module | As-built capability | Status |
|---|---|---|
| Home | Live prayer banner, search handoff, Ayat card, Flashes, quick actions, Hajj/Umrah entry | Implemented |
| Quran | Surah/Juz browsing, Arabic/Urdu/English editions, recitation, bookmarks/favorites, 15/16-line visual modes, subjects, 38 lessons | Implemented with provider dependency |
| Seerat-un-Nabi | Seven seasons and episode launcher using one YouTube playlist | Partially implemented/content-dependent |
| Hadith | Eight collections, collection → topic → Hadith flow, language controls where provider data exists, share/save | Implemented with translation/provider limitations |
| Prayer | Geolocation, current-date AlAdhan calculation, next-prayer countdown, reminder controls | Implemented; background reliability platform-dependent |
| Qibla | Coordinate bearing plus device orientation | Implemented; sensor accuracy platform-dependent |
| Tasbeeh | Presets, vibration, target progress, local history, custom Tasbeeh and optional user sync | Implemented |
| Books | Categorized visual library and reader-oriented entries | Partially implemented; complete licensed book corpus/download verification absent |
| Duas | Local Hisnul Muslim dataset and fallback content | Implemented; corpus completeness not independently verified |
| Ibadat | Salah, fasting, Hajj, Umrah, Janaza guidance cards | Implemented as concise guidance |
| More | Flashes, Duas, Salah, Qibla, 99 Names, Shahadat, Waqf, Tasbeeh, Books | Implemented |
| Account | Email/password, reset, Google OAuth, session persistence, profile summary | Implemented; remote provider settings not repository-verifiable |
| PWA | Manifest, install UI, offline fallback, versioned updates | Implemented |

## 7. Out of scope

- Native App Store/Play Store binaries.
- Payments, subscriptions, commerce, or advertising.
- Admin console or editorial CMS.
- Social network, public profiles, or user-to-user messaging.
- Scholarly certification of third-party religious content.
- Guaranteed background Azan execution when the OS suspends a PWA.
- Server-owned push campaign scheduler.
- Dedicated book-file storage/download service.

## 8. Functional requirements

- **PRD-FR-01:** The browser view shall present installation guidance; standalone first run shall present onboarding.
- **PRD-FR-02:** Users shall navigate Home, Quran, Hadith, Ibadat, and More from the bottom bar.
- **PRD-FR-03:** Every primary view shall retain access to the header menu and persistent prayer banner.
- **PRD-FR-04:** The Quran experience shall support Surah/Juz selection, translations, recitation, reading preferences, favorites, and last-read markers.
- **PRD-FR-05:** Hadith navigation shall proceed collection → chapter/topic → Hadith.
- **PRD-FR-06:** Prayer times and Qibla shall use current permitted coordinates.
- **PRD-FR-07:** Tasbeeh shall count taps, support reset/history, and allow bounded custom records.
- **PRD-FR-08:** Guests shall be usable without account creation.
- **PRD-FR-09:** Authenticated ownership data shall be limited to its owner.
- **PRD-FR-10:** The application shall expose light/dark preference and install/update behavior.

## 9. Non-functional requirements

- Mobile-first presentation within a 560 px application shell on wider displays.
- Installable standalone PWA over HTTPS.
- Current application code fetched reliably with offline fallback.
- Arabic-capable typography and readable translation layouts.
- Security headers, strict input bounds, RLS ownership, and no frontend secret keys.
- Graceful loading, empty, error, and permission-denied states where implemented.
- No guarantee of offline availability for every third-party corpus item.

## 10. User stories

- As a guest, I want to explore without registering, so that I can evaluate the companion privately.
- As a reader, I want Urdu or English Quran translation, so that I can understand an Ayah.
- As a learner, I want a lesson to open its exact Ayah, so that study remains contextual.
- As a worshipper, I want local prayer times, so that the schedule fits my location.
- As a traveller, I want a Qibla bearing, so that I can orient prayer.
- As a registered user, I want saved bookmarks, so that supported progress follows my account.
- As a Dhikr user, I want a custom Tasbeeh, so that I can use my own title, meaning, target, and image.
- As a mobile user, I want Home Screen installation, so that Sakinah launches like an app.

## 11. Business rules

- Guest data is local and can be lost if browser/app storage is cleared.
- Cloud rows must be owned by the authenticated Supabase user.
- Custom images are JPG/PNG/WebP and no larger than 1.5 MB.
- Custom targets are integers from 1 to 100,000.
- Prayer calculation uses AlAdhan method 2 and school 0 for all users.
- Fiqh-specific filtering is not present.
- Third-party content remains subject to provider availability and licensing.

## 12. Assumptions and constraints

- Users grant geolocation, notification, and orientation permission when needed.
- Network access is needed for uncached provider content.
- iOS installation is initiated through Safari Share → Add to Home Screen.
- Browser/OS policies may prevent exact background reminder delivery.
- Supabase and OAuth Dashboard configuration is managed outside this repository.

## 13. Success criteria

- Production build completes without error.
- Security regression suite remains 100% passing.
- All 114 Surahs and Juz 1–30 can be requested from the provider within validated ranges.
- A permitted location yields current-date prayer data or a clear recoverable error.
- Guest launch does not require account creation.
- Authenticated cross-user database access is denied by RLS in an owner-run two-account test.
- PWA manifest and service worker are served with correct types/cache policy.

## 14. Known limitations

- No repository-owned backend or distributed notification scheduler.
- Complete book downloads are not verified.
- Some Hadith Urdu/Arabic availability depends on matching remote editions.
- “15-line/16-line” is a CSS reading mode over provider pages, not verified photographic Indopak pagination.
- Seerah uses playlist indexing rather than a repository-managed episode catalog.
- Account deletion/export is absent.

## 15. Glossary

| Term | Meaning |
|---|---|
| Ayah | A Quran verse |
| Surah | A Quran chapter |
| Juz/Para | One of 30 Quran divisions |
| Hadith | Narration about the Prophet's teachings/practice |
| Dhikr/Tasbeeh | Remembrance and counting practice |
| Qibla | Direction of the Kaaba for prayer |
| PWA | Installable web application with manifest/service worker |
| RLS | Database Row-Level Security |
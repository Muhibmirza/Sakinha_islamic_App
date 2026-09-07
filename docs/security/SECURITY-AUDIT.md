# Sakinah Security Audit

**Status:** Verified as-built review with targeted hardening  
**Audit date:** 2026-09-07  
**Repository:** `Sakinha_islamic_App`  
**Commit baseline:** `b9b8fe0`  
**Scope:** Local repository and local build/test environment only. No intrusive production testing was performed.

## 1. Executive summary

Sakinah is a browser-only React/Vite Progressive Web App (PWA). Authentication and user-owned persistence are delegated to Supabase Auth and PostgreSQL Row-Level Security (RLS). There is no repository-owned application server, privileged/admin interface, payment path, or conventional REST API. The audit found no committed active secret and no production dependency advisory. Five security weaknesses were corrected with localized changes: browser security headers, coordinate-bearing cache entries, authentication error/redirect handling, input bounds, and custom-image restrictions.

The application is not “unhackable.” Residual risk remains in externally managed Supabase settings, auth rate limits, third-party content availability/integrity, authenticated JSON payload size enforcement, and development-only Vite advisories requiring a major upgrade.

## 2. Verified architecture

| Area | Verified implementation |
|---|---|
| Frontend | React 18.3.1, React DOM 18.3.1, Vite 5.4.21 |
| Styling | Tailwind CSS 3.4.19 plus repository CSS files |
| Routing | Client state and `?view=` query parameter; no routing package |
| Backend | No repository-owned backend runtime or API routes |
| Authentication | Supabase JS 2.57.0; email/password, reset email, Google OAuth PKCE |
| Session | Supabase auto-refreshing session persisted under a dedicated local-storage key |
| Database | Supabase-hosted PostgreSQL; SQL definition in `supabase/schema.sql` |
| Authorization | RLS owner checks using `auth.uid()` for profiles, bookmarks, and Tasbeeh sessions |
| Hosting | Static Vite output on Vercel; SPA rewrite and response headers in `vercel.json` |
| PWA | Manifest plus versioned service worker caches |
| External data | Al Quran Cloud, AlAdhan, jsDelivr-hosted Hadith data, YouTube privacy-enhanced embeds, Unsplash images, Google Fonts |
| Uploads | Local custom-Tasbeeh image selection converted to a data URL; optionally stored inside the user's Supabase bookmark payload |
| Payments/admin | Not present |

## 3. Threat model

### Protected assets

- Supabase access and refresh tokens.
- User email/name/profile metadata.
- Quran and Hadith bookmarks.
- Tasbeeh counts, custom Tasbeeh records, and history.
- Precise device coordinates used for prayer times and Qibla.
- User-selected custom background images.
- Application integrity, availability, and trusted navigation.

### Actors and roles

- Guest: local-only application use.
- Authenticated user: owner access to profile, bookmarks, and Tasbeeh sessions.
- Supabase service infrastructure: authentication, token issuance, password handling, and database enforcement.
- No admin or privileged application role was found.

### Trust boundaries and entry points

1. Browser ↔ Supabase Auth/PostgREST.
2. Browser ↔ Quran, prayer, Hadith, image, font, and video providers.
3. Browser-controlled form/query/file inputs ↔ React state and outbound requests.
4. Browser storage/service-worker caches ↔ application code and user data.
5. Vercel edge ↔ static application responses.

### Highest-risk paths

- Stolen browser session token through script injection or compromised device.
- Misconfigured or disabled Supabase RLS.
- OAuth redirect manipulation.
- Storage abuse through large custom images/payloads.
- Precise coordinates retained in cache keys.
- Supply-chain compromise of third-party content or dependencies.

## 4. Security-control checklist

| Control | Result | Evidence |
|---|---|---|
| Secrets ignored | Pass | `.gitignore`, tracked-file scan |
| Public key only in frontend | Pass | `src/lib/supabase.js`, `.env.example` |
| OAuth PKCE | Pass | `src/lib/supabase.js` |
| Persistent session | Pass with inherent browser-storage risk | `src/lib/supabase.js` |
| Ownership authorization | Pass at declared-schema level | `supabase/schema.sql` RLS policies |
| XSS-safe rendering | Pass for reviewed paths | React interpolation; no dangerous HTML sinks found |
| OAuth destination allow-list | Fixed | `src/components/AuthModal.jsx` |
| Input bounds | Fixed for auth, Quran/Hadith/prayer requests, custom Tasbeeh | `src/lib/security.js`, callers |
| Upload type/size allow-list | Fixed | JPG/PNG/WebP, ≤1.5 MB |
| Coordinate caching | Fixed | AlAdhan excluded from service-worker data cache |
| Security headers | Fixed | `vercel.json` |
| Production dependencies | Pass | `npm audit --omit=dev`: 0 vulnerabilities |
| Development dependencies | Open | Vite/esbuild advisories; major upgrade required |
| Auth rate limits | Not verified from repository | Supabase Dashboard configuration is external |
| SMTP/email confirmation | Not verified from repository | Supabase Dashboard configuration is external |

## 5. Findings

| ID | Severity | Category | Location | Risk | Remediation and verification | Status |
|---|---|---|---|---|---|---|
| SAK-01 | High | CWE-693 / OWASP A05 | `vercel.json` | Missing CSP, anti-framing, HSTS, MIME, referrer, and permissions controls increased injection/clickjacking surface. | Added resource-specific CSP and standard headers. Regression test verifies required header definitions. | Fixed |
| SAK-02 | Medium | CWE-359 / OWASP A02 | `public/sw.js` | AlAdhan request URLs containing exact latitude/longitude were written to Cache Storage. | AlAdhan excluded from service-worker data caching; worker bumped to v15. Regression test confirms exclusion. | Fixed |
| SAK-03 | Medium | CWE-434 / CWE-400 | `src/App.jsx` | Arbitrary image types and unbounded sizes could consume browser/database storage; SVG was unnecessarily accepted. | Allow-listed JPEG/PNG/WebP, capped at 1.5 MB, validated the resulting data-URL prefix, and bounded text/target values. Tests cover type and size rejection. | Fixed |
| SAK-04 | Medium | CWE-601 | `src/components/AuthModal.jsx` | OAuth URL from a provider response was navigated without an explicit local allow-list check. | Require HTTPS and exact Supabase project origin before navigation. Production flow otherwise unchanged. | Fixed |
| SAK-05 | Low | CWE-209 / CWE-204 | `src/components/AuthModal.jsx` | Raw provider errors, user IDs, redirect details, and account-sensitive reset responses were exposed in the client console/UI. | Removed identifiers/raw messages; emit generic UI errors and redacted error codes; reset response is enumeration-resistant. | Fixed |
| SAK-06 | Medium | CWE-20 / CWE-918 defense-in-depth | `src/lib/islamicApi.js` | Numeric/path values lacked explicit bounds before constructing third-party URLs. | Added Surah/Juz/coordinate bounds, edition allow-list syntax, and Hadith path syntax validation. | Fixed |
| SAK-07 | High (development only) | CWE-22/CWE-200/CWE-346 | `package-lock.json` | Vite 5.4.21/esbuild advisories affect the local development server. npm recommends a major Vite 8 upgrade incompatible with the current Node baseline. | Bound `dev` and `preview` to `127.0.0.1`; do not expose the dev server. Plan a tested Node/toolchain upgrade. Production dependency audit is clean. | Open/mitigated |
| SAK-08 | Medium | CWE-770 | Supabase project configuration | Repository cannot prove shared per-IP/per-account auth rate limits or payload quotas. | Use Supabase Auth rate limits/CAPTCHA and database constraints after assessing existing payload sizes. | Owner action |

## 6. Secret review

- Scanner availability: neither Gitleaks nor TruffleHog was installed.
- Manual pattern scan covered tracked/current files and Git history indicators for Supabase secret/publishable prefixes, JWT-like tokens, private keys, Google keys, PostgreSQL URLs, and credential filenames.
- No active secret was found in tracked content or the searched history indicators.
- `.env.local` is ignored and not tracked.
- `.env.example` contains placeholders only.
- `VITE_SUPABASE_PUBLISHABLE_KEY` is intentionally browser-visible. A Supabase service-role/secret key must never use a `VITE_` prefix.
- No rotation is mandated by repository evidence. If a service-role, OAuth client secret, or SMTP secret has ever been pasted into a public issue/chat or deployed as a frontend variable, the owner must rotate it immediately; this cannot be verified from the repository.

## 7. Personal-data flow map

| Data | Collection | Validation | Storage | Transmission/exposure | Retention/deletion |
|---|---|---|---|---|---|
| Name | Signup form | Trim/control removal, 80-char cap | Supabase Auth metadata and `profiles` | Supabase only | Account deletion behavior not verified |
| Email | Login/signup/reset | Format and 254-char cap | Supabase Auth; session claims in browser | Supabase | Provider-controlled; not verified |
| Password | Auth form | 8–128 chars for signup; never stored by app | Supabase Auth only | TLS to Supabase | Hashing/provider policy not verifiable from repo |
| Auth tokens | Supabase callback/client | Supabase SDK | Browser local storage | Supabase | Logout removes local session; server revocation semantics not verified |
| Coordinates | Browser Geolocation | Geographic numeric ranges | React memory only after fix | AlAdhan; local Qibla calculation | Not intentionally persisted/cached by app |
| Bookmarks | User actions | Bounded indirectly by fixed UI; JSON schema not enforced DB-side | local storage and/or Supabase | Supabase | User can toggle/delete individual items |
| Tasbeeh history | User actions | Positive DB count; UI bounds for custom target | local storage and Supabase | Supabase | Local history capped at 30; cloud retention not specified |
| Custom image | File picker | Type, size and data-URL allow-list | local storage; user-owned Supabase JSON | Supabase if signed in | Replaced with custom Tasbeeh; explicit deletion flow not verified |
| Feedback text | Sidebar | No explicit maximum | local storage | Not transmitted by current implementation | Indefinite until storage cleared/replaced |
| Notification log | Generated locally | App-generated | local storage, capped to 30 | Not transmitted | Rolling cap |

Residual privacy notes: Supabase session persistence in local storage is architectural and necessary for the requested PWA auto-login behavior. Its exposure is reduced through CSP but remains dependent on device/browser integrity. Feedback is locally retained and currently not submitted to a service.

## 8. Authentication and authorization review

- Supabase Auth implements password processing and OAuth; the repository never stores plaintext passwords.
- PKCE, token auto-refresh, callback detection, and session persistence are explicitly configured.
- OAuth redirect target uses the current origin, while navigation to the provider URL is restricted to the configured Supabase origin.
- Authentication errors are generic and password-reset messaging does not confirm account existence.
- Database policies require `auth.uid()` to equal the row owner for all declared user-owned tables.
- Client queries do not supply arbitrary roles. No role-edit or admin path exists.
- Owner predicates are trusted to RLS, not UI hiding. Some delete calls omit an explicit `user_id` filter, but RLS still constrains deletion; adding the filter is optional defense-in-depth.
- JWT algorithm, lifetime, revocation, Google provider settings, email confirmation, SMTP, CAPTCHA, and dashboard rate limits are not verifiable from repository code.

## 9. Injection and input-validation review

- No SQL, Prisma, shell, server-side URL fetch, raw-query, template execution, or command-execution surface exists in the repository.
- React escapes displayed user/provider strings; no `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or `new Function` sink was found.
- Fixed YouTube and provider hosts are used. OAuth navigation now validates exact origin.
- Numeric coordinates, Surah/Juz indices, edition identifiers, Hadith paths, auth fields, custom Tasbeeh fields, and image data are bounded/allow-listed.
- `?view=` values select from a fixed component map and fall back to Home; they are not interpreted as markup or a filesystem path.
- Database JSON payload schemas remain unenforced server-side; RLS prevents cross-user access but not self-directed storage abuse.

## 10. Rate-limit matrix

The frontend cannot securely implement distributed enforcement. These controls must be configured at Supabase/provider/edge boundaries.

| Operation | Recommended owner configuration | Repository status |
|---|---|---|
| Login | Per-IP and per-account progressive throttling; CAPTCHA after anomalies | Supabase-managed, not verified |
| Signup | Strict per-IP/email limit; CAPTCHA; email abuse protection | Supabase-managed, not verified |
| Password reset | Strict per-IP/email window with enumeration-resistant response | Generic UI fixed; provider limit not verified |
| Google OAuth | Provider/Supabase state/PKCE and abuse controls | PKCE verified; external controls not verified |
| PostgREST writes | Supabase/API gateway quotas plus DB payload constraints | RLS verified; quotas not verified |
| Quran/Hadith/prayer | Third-party provider policies; client avoids rapid loops | No server proxy; no enforceable app rate limit |
| Custom image | ≤1.5 MB and allow-listed formats; recommended per-user total quota | Client limit fixed; DB quota absent |

## 11. Upload and payment review

### Uploads: applicable in limited form

The custom Tasbeeh image picker reads a browser-selected image as a data URL; it does not upload to a dedicated executable file store. Authenticated users may persist it in their own bookmark JSON. JPEG, PNG, and WebP are allowed up to 1.5 MB; SVG and other types are rejected. Magic-byte verification, malware scanning, and server-side quota enforcement are not available in the current client-only architecture. An owner-approved Supabase Storage design would be needed for stronger server-side validation.

### Payments: not applicable

No payment, order, invoice, discount, webhook, refund, subscription, or financial-calculation code was found.

## 12. Dependency audit

| Package/advisory | Direct? | Severity | Runtime exposure | Decision |
|---|---:|---:|---|---|
| Vite: optimized-deps map/path and Windows filesystem advisories | Yes, dev dependency | High aggregate | Local development server only; not shipped in static bundle | Major upgrade deferred; loopback binding applied |
| esbuild cross-origin dev-server request advisory | Transitive via Vite | Moderate | Local development server only | Same mitigation |

Exact audit results:

- `npm audit --omit=dev --json`: 0 production vulnerabilities.
- `npm audit --json`: 1 high direct Vite entry and 1 moderate transitive esbuild entry.
- npm's available remediation is Vite 8.2.2, a semver-major upgrade, and the installed Node 20.15.0 does not meet current Vite 8 ecosystem engine expectations observed during tooling. No risky upgrade was performed.

## 13. Tests executed

| Command/check | Baseline | Final |
|---|---|---|
| `git status --short --branch` | Clean, `main...origin/main` | Security files only modified |
| `npm run build` | Pass; 1,649 modules | Pass; 1,650 modules |
| `npm run test:security` | Not present | Pass: 6/6 tests |
| `npm audit --omit=dev --json` | Pass: 0 | Pass: 0 |
| `npm audit --json` | 2 development findings | Same; mitigated by loopback binding |
| Secret/current-tree scan | No active tracked secret found | No new secret added |
| Git history indicator scan | No secret/private-key indicator commit found | Unchanged |
| Dangerous DOM sink scan | No sink found | No sink introduced |
| `git diff --check` | N/A | Pass |

No lint or type-check script exists. No unit/e2e framework existed; focused tests use Node's built-in test runner rather than adding a dependency.

## 14. Remaining risks

1. Supabase Dashboard configuration (RLS deployment state, auth limits, CAPTCHA, SMTP, URL allow-list, token lifetime) is not represented as versioned configuration.
2. The SQL file declares secure RLS policies, but remote production policy state was not queried.
3. User JSON payload size/shape is not constrained at the database boundary.
4. Auth tokens remain in local storage by design; a same-origin script compromise could access them.
5. Third-party APIs/CDNs are availability and content-integrity dependencies.
6. Vite/esbuild development advisories remain until a planned major upgrade.
7. Daily notification reliability depends on browser/OS background scheduling and is not a server push system.
8. Explicit account deletion/data export behavior is not implemented or verified.
9. Custom-image magic-byte validation and malware scanning are absent.
10. No automated browser E2E authorization suite exists.

## 15. Deployment security checklist

- [ ] Deploy from the reviewed commit only.
- [ ] Confirm Vercel applies CSP, HSTS, anti-framing, MIME, referrer, permissions, and opener/resource headers.
- [ ] Confirm all required app resources load without CSP violations.
- [ ] Confirm `sw.js` reports v15 and AlAdhan requests are absent from Cache Storage.
- [ ] Confirm Supabase Site URL and redirect allow-list contain only approved HTTPS production origins.
- [ ] Confirm Google OAuth callback is the exact Supabase callback and consent branding is correct.
- [ ] Confirm RLS is enabled remotely and test cross-user reads/writes using dedicated test accounts.
- [ ] Configure Supabase Auth rate limits and CAPTCHA.
- [ ] Confirm only a publishable/anon key is present in Vercel frontend variables.
- [ ] Never add a service-role, OAuth client secret, SMTP password, or database URL to `VITE_*` variables.
- [ ] Run `npm run test:security`, `npm run build`, and `npm audit --omit=dev` before release.

## 16. Owner actions and secret rotation

- Review Vercel environment variables and confirm no server/service secret has a `VITE_` prefix.
- Verify Supabase production RLS and Auth settings with two non-production test users.
- Enable/configure Supabase CAPTCHA and rate limits for login, signup, and reset.
- Review JWT/session lifetime and refresh-token reuse detection in Supabase.
- Establish a secret-rotation schedule for Google OAuth, SMTP, and any future server keys.
- No repository evidence requires immediate rotation; rotate immediately if any non-public secret was previously pasted or exposed outside the repository.
- Plan the Node/Vite major upgrade as a separate, owner-approved compatibility phase.

## 17. Re-audit recommendation

Re-audit after any new backend, admin role, server function, payment feature, public upload/storage bucket, custom URL fetch, analytics SDK, or major authentication change. At minimum, review dependencies and remote Supabase controls quarterly and after each major release.

## Final terminal-style summary

```text
Security changes made:
- Added CSP and production browser security headers.
- Removed coordinate-bearing prayer API requests from service-worker caching.
- Restricted OAuth navigation to the configured HTTPS Supabase origin.
- Bounded auth/API/Tasbeeh inputs and redacted auth errors/logs.
- Restricted custom images to JPG/PNG/WebP <= 1.5 MB.
- Bound development and preview servers to 127.0.0.1.
- Added six Node-native security regression tests.

Application files changed:
package.json
public/offline.html
public/sw.js
src/App.jsx
src/components/AuthModal.jsx
src/lib/islamicApi.js
src/lib/security.js
vercel.json
tests/security.test.js

documentation created:
docs/security/SECURITY-AUDIT.md

Verification:
PASS npm run test:security (6/6)
PASS npm run build
PASS npm audit --omit=dev (0)
OPEN npm audit: Vite/esbuild dev-only advisories (major upgrade required)
PASS tracked/current secret scan (no active secret found)

Manual owner actions:
Verify remote Supabase RLS/Auth/rate-limit/CAPTCHA settings and Vercel environment variables.

Behavior preservation:
Routes, feature modules, database schema, Supabase provider, UI branding, and production architecture were preserved.
```
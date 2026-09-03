# Sakinah — Islamic Companion

Sakinah is a modern, mobile-first Islamic companion Progressive Web App. It brings Quran reading, authentic Hadith collections, prayer times, Qibla direction, dhikr tracking, the Hijri calendar, and personal worship history into one calm, installable experience.

🌐 **Live app:** [sakinah-islamic.vercel.app](https://sakinah-islamic.vercel.app)

## Highlights

- Complete Quran browser with all 114 Surahs and 30 Juz/Para
- Arabic Quran editions, Urdu and English translations
- Verse-by-verse audio recitation and bookmarks
- Major Hadith collections: Sahih al-Bukhari, Sahih Muslim, Sunan Abu Dawood, and Jami' at-Tirmidhi
- Daily rotating Hadith with exact collection reference
- Location-aware prayer times powered by AlAdhan
- Per-prayer notification controls and live countdowns
- Real-time Qibla bearing using geolocation and device orientation
- Digital Tasbeeh with vibration, presets, history, and account sync
- Live Hijri and Gregorian dates
- Supabase email/password and Google authentication
- User profiles, Quran bookmarks, and worship history protected by Row-Level Security
- Dark mode and Arabic-friendly typography
- Android and iOS Add to Home Screen installation experience
- Offline application shell and in-app update notifications

## Technology

- React 18 and Vite
- Tailwind CSS with a custom responsive design system
- Supabase Auth, PostgreSQL, and Row-Level Security
- Vercel deployment
- Al Quran Cloud, AlAdhan, and an open Hadith dataset
- Web App Manifest and Service Worker

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

On Windows PowerShell, copy the environment template with:

```powershell
Copy-Item .env.example .env.local
```

Configure these environment variables:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Never expose a Supabase service-role key in the frontend.

## Database setup

Run [`supabase/schema.sql`](supabase/schema.sql) once in the Supabase SQL Editor. It creates:

- User profiles
- Quran, Hadith, and book bookmarks
- Tasbeeh session history
- User-scoped Row-Level Security policies
- Automatic profile creation for new accounts

For Google authentication, enable Google under Supabase **Authentication → Sign In / Providers** and add the live URL to the allowed redirect URLs.

## Production build

```bash
npm run build
npm run preview
```

The generated production files are written to `dist/`.

## PWA installation

- Android: open the live link in Chrome and choose **Install app**.
- iPhone/iPad: open the live link in Safari, tap **Share**, then **Add to Home Screen**.

Browser notification delivery is subject to operating-system and browser background-execution policies.

## Privacy and security

- Public Supabase publishable keys are configured through environment variables.
- Database records are protected with Supabase Row-Level Security.
- Each authenticated user can access only their own profile, bookmarks, and Tasbeeh sessions.
- Precise location is requested only for prayer-time and Qibla calculations.

## License and content notice

Application source code is provided for the Sakinah project. Quran translations, recitations, Hadith datasets, fonts, and third-party APIs remain subject to their respective providers' licenses and terms.

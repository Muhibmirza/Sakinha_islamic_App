const QURAN = "https://api.alquran.cloud/v1";
export async function getSurahs() {
  const r = await fetch(`${QURAN}/surah`);
  if (!r.ok) throw new Error("Quran service unavailable");
  return (await r.json()).data;
}
export async function getSurah(number) {
  const r = await fetch(
    `${QURAN}/surah/${number}/editions/quran-uthmani,en.sahih,ur.jalandhry,ar.alafasy`,
  );
  if (!r.ok) throw new Error("Could not load this Surah");
  return (await r.json()).data;
}
export async function getPrayerTimes(
  latitude,
  longitude,
  date = new Date(),
  fiqh = "hanafi",
) {
  const stamp = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  const r = await fetch(
    `https://api.aladhan.com/v1/timings/${stamp}?latitude=${latitude}&longitude=${longitude}&method=${fiqh === "jafria" ? 0 : 1}&school=${fiqh === "hanafi" ? 1 : 0}`,
    { cache: "no-store" },
  );
  if (!r.ok) throw new Error("Prayer service unavailable");
  return (await r.json()).data;
}
export function qiblaBearing(lat, lon) {
  const kaabaLat = (21.4225 * Math.PI) / 180,
    kaabaLon = (39.8262 * Math.PI) / 180,
    p = (lat * Math.PI) / 180,
    d = ((39.8262 - lon) * Math.PI) / 180;
  return (
    ((Math.atan2(
      Math.sin(d),
      Math.cos(p) * Math.tan(kaabaLat) - Math.sin(p) * Math.cos(d),
    ) *
      180) /
      Math.PI +
      360) %
    360
  );
}
export function hijriToday() {
  return new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}
const HADITH = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";
export const hadithCollections = [
  {
    id: "eng-bukhari",
    name: "Sahih al-Bukhari",
    author: "Imam Muhammad al-Bukhari",
    arabic: "صحيح البخاري",
    count: 7563,
    color: "#234D3C",
  },
  {
    id: "eng-muslim",
    name: "Sahih Muslim",
    author: "Imam Muslim ibn al-Hajjaj",
    arabic: "صحيح مسلم",
    count: 7563,
    color: "#3A5370",
  },
  {
    id: "eng-abudawud",
    name: "Sunan Abu Dawood",
    author: "Imam Abu Dawood",
    arabic: "سنن أبي داود",
    count: 5274,
    color: "#7A5434",
  },
  {
    id: "eng-tirmidhi",
    name: "Jami' at-Tirmidhi",
    author: "Imam at-Tirmidhi",
    arabic: "جامع الترمذي",
    count: 3956,
    color: "#61435A",
  },
];
async function hadithFetch(path) {
  let r = await fetch(`${HADITH}/${path}.min.json`);
  if (!r.ok) r = await fetch(`${HADITH}/${path}.json`);
  if (!r.ok) throw new Error("Hadith collection is temporarily unavailable");
  return r.json();
}
export const getHadithCollection = (id) => hadithFetch(id);
export async function getDailyHadith() {
  const day = Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000);
  const book =
    hadithCollections[
      ((day % hadithCollections.length) + hadithCollections.length) %
        hadithCollections.length
    ];
  const no = ((((day * 37) % book.count) + book.count) % book.count) + 1;
  const data = await hadithFetch(`${book.id}/${no}`);
  return { ...data.hadiths[0], collection: book };
}
export async function getQuranEditions() {
  const r = await fetch(`${QURAN}/edition`);
  if (!r.ok) throw new Error("Edition list unavailable");
  return (await r.json()).data.filter(
    (x) =>
      x.format === "text" &&
      ["quran", "translation", "tafsir"].includes(x.type) &&
      (x.language === "en" || x.language === "ur" || x.type === "quran"),
  );
}
export async function getJuz(number, edition = "quran-uthmani") {
  const r = await fetch(`${QURAN}/juz/${number}/${edition}`);
  if (!r.ok) throw new Error("Could not load this Juz");
  return (await r.json()).data;
}

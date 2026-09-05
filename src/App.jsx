import React, { useEffect, useMemo, useState } from "react";
import {
  Home,
  BookOpen,
  Library,
  CalendarDays,
  Compass,
  Hand,
  Clock3,
  Moon,
  Sun,
  Search,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Bell,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Settings,
  Heart,
  Plus,
  Minus,
  Navigation,
  Download,
  X,
  Check,
} from "lucide-react";
import AuthModal from "./components/AuthModal";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import {
  getSurahs,
  getSurah,
  getPrayerTimes,
  qiblaBearing,
  hijriToday,
  hadithCollections,
  getHadithCollection,
  getDailyHadith,
  getQuranEditions,
  getJuz,
} from "./lib/islamicApi";

const prayers = [
  ["Fajr", "05:12", "Dawn"],
  ["Dhuhr", "12:28", "Noon"],
  ["Asr", "04:41", "Afternoon"],
  ["Maghrib", "06:37", "Sunset"],
  ["Isha", "07:58", "Night"],
];
const surahs = [
  {
    n: 1,
    name: "Al-Fatihah",
    ar: "الفاتحة",
    meaning: "The Opening",
    ayahs: 7,
    verses: [
      [
        "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "In the name of Allah, the Most Gracious, the Most Merciful.",
        "شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔",
      ],
      [
        "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        "All praise is for Allah—Lord of all worlds.",
        "سب تعریف اللہ ہی کے لیے ہے جو تمام جہانوں کا رب ہے۔",
      ],
      [
        "الرَّحْمَٰنِ الرَّحِيمِ",
        "The Most Gracious, the Most Merciful.",
        "بڑا مہربان نہایت رحم والا۔",
      ],
      [
        "مَالِكِ يَوْمِ الدِّينِ",
        "Master of the Day of Judgment.",
        "روز جزا کا مالک۔",
      ],
    ],
  },
  {
    n: 2,
    name: "Al-Baqarah",
    ar: "البقرة",
    meaning: "The Cow",
    ayahs: 286,
    verses: [
      ["الم", "Alif-Lam-Mim.", "الف لام میم۔"],
      [
        "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ",
        "This is the Book in which there is no doubt.",
        "یہ وہ کتاب ہے جس میں کوئی شک نہیں۔",
      ],
    ],
  },
  {
    n: 36,
    name: "Ya-Sin",
    ar: "يس",
    meaning: "Ya Sin",
    ayahs: 83,
    verses: [
      ["يس", "Ya-Sin.", "یٰسین۔"],
      [
        "وَالْقُرْآنِ الْحَكِيمِ",
        "By the Quran, rich in wisdom!",
        "قسم ہے حکمت والے قرآن کی۔",
      ],
    ],
  },
  {
    n: 55,
    name: "Ar-Rahman",
    ar: "الرحمن",
    meaning: "The Most Merciful",
    ayahs: 78,
    verses: [
      ["الرَّحْمَٰنُ", "The Most Compassionate.", "نہایت مہربان۔"],
      ["عَلَّمَ الْقُرْآنَ", "Taught the Quran.", "اسی نے قرآن سکھایا۔"],
    ],
  },
  {
    n: 67,
    name: "Al-Mulk",
    ar: "الملك",
    meaning: "The Sovereignty",
    ayahs: 30,
    verses: [
      [
        "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ",
        "Blessed is He in Whose Hands is all authority.",
        "بڑی برکت والا ہے وہ جس کے ہاتھ میں بادشاہی ہے۔",
      ],
    ],
  },
  {
    n: 112,
    name: "Al-Ikhlas",
    ar: "الإخلاص",
    meaning: "Sincerity",
    ayahs: 4,
    verses: [
      [
        "قُلْ هُوَ اللَّهُ أَحَدٌ",
        "Say, He is Allah—One.",
        "کہہ دو کہ وہ اللہ ایک ہے۔",
      ],
      ["اللَّهُ الصَّمَدُ", "Allah, the Eternal Refuge.", "اللہ بے نیاز ہے۔"],
    ],
  },
];
const books = [
  {
    title: "Riyad as-Salihin",
    author: "Imam an-Nawawi",
    topic: "Hadith & Character",
    color: "#234D3C",
    mark: "رياض الصالحين",
  },
  {
    title: "The Sealed Nectar",
    author: "Safiur Rahman Mubarakpuri",
    topic: "Seerah",
    color: "#9B6B3D",
    mark: "الرحيق المختوم",
  },
  {
    title: "Fortress of the Muslim",
    author: "Sa’id bin Ali",
    topic: "Dua & Dhikr",
    color: "#3A5370",
    mark: "حصن المسلم",
  },
  {
    title: "Purification of the Heart",
    author: "Hamza Yusuf",
    topic: "Spirituality",
    color: "#6A4057",
    mark: "تزكية القلب",
  },
];
const hadiths = [
  {
    cat: "Character",
    text: "The most beloved of you to me are those with the best character.",
    source: "Jami` at-Tirmidhi 2018",
  },
  {
    cat: "Kindness",
    text: "Allah is gentle and loves gentleness in all matters.",
    source: "Sahih al-Bukhari 6927",
  },
  {
    cat: "Intention",
    text: "Actions are judged by intentions.",
    source: "Sahih al-Bukhari 1",
  },
];
const features = [
  ["Quran", "Read & reflect", BookOpen, "quran"],
  ["Prayer Times", "Never miss salah", Clock3, "prayer"],
  ["Tasbeeh", "Daily dhikr", Hand, "tasbeeh"],
  ["Qibla", "Find direction", Compass, "qibla"],
  ["Library", "Books & wisdom", Library, "library"],
  ["Hadith", "Daily guidance", Heart, "hadith"],
];
function useStored(key, init) {
  const [v, setV] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? init;
    } catch {
      return init;
    }
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(v)), [key, v]);
  return [v, setV];
}
function Header({ title, back, onBack, dark, setDark, user, onProfile }) {
  const initials = (user?.user_metadata?.name || user?.email || "Guest")
    .split(/\s|@/)
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <header className="topbar">
      {back ? (
        <button className="icon-btn" onClick={onBack}>
          <ChevronLeft />
        </button>
      ) : (
        <div className="brand">
          <img src="/icons/icon-192.png" />
          <div>
            <b>Sakinah</b>
            <span>Islamic Companion</span>
          </div>
        </div>
      )}{" "}
      {title && <h2>{title}</h2>}
      <div className="header-actions">
        <button className="icon-btn" onClick={() => setDark(!dark)}>
          {dark ? <Sun /> : <Moon />}
        </button>
        <button className="avatar" onClick={onProfile}>
          {initials}
        </button>
      </div>
    </header>
  );
}
const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_LABELS = {
  Fajr: "Dawn",
  Dhuhr: "Noon",
  Asr: "Afternoon",
  Maghrib: "Sunset",
  Isha: "Night",
};
function cleanPrayerTime(value) {
  return value?.match(/\d{1,2}:\d{2}/)?.[0] || "";
}
function prayerMoment(name, time, baseDate = new Date()) {
  const [hours, minutes] = time.split(":").map(Number);
  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  return { name, time, date: result };
}
function getNextPrayer(timings, now = new Date()) {
  if (!timings) return null;
  for (const name of PRAYER_NAMES) {
    const time = cleanPrayerTime(timings[name]);
    if (!time) continue;
    const prayer = prayerMoment(name, time, now);
    if (prayer.date > now) return prayer;
  }
  const fajr = cleanPrayerTime(timings.Fajr);
  if (!fajr) return null;
  const next = prayerMoment("Fajr", fajr, now);
  next.date.setDate(next.date.getDate() + 1);
  return next;
}
function useLivePrayerData() {
  const [state, setState] = useState({
    data: null,
    coords: null,
    loading: true,
    error: "",
  });
  const refresh = React.useCallback(() => {
    if (!navigator.geolocation) {
      setState((current) => ({
        ...current,
        loading: false,
        error: "Location is not supported on this device.",
      }));
      return;
    }
    setState((current) => ({ ...current, loading: true, error: "" }));
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const point = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
          const data = await getPrayerTimes(
            point.latitude,
            point.longitude,
            new Date(),
          );
          setState({ data, coords: point, loading: false, error: "" });
        } catch (error) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error.message,
          }));
        }
      },
      () =>
        setState((current) => ({
          ...current,
          loading: false,
          error: "Allow location access for accurate local prayer times.",
        })),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
    );
  }, []);
  useEffect(() => {
    refresh();
    const refreshWhenVisible = () => {
      if (!document.hidden) refresh();
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);
    const timer = setInterval(refresh, 15 * 60 * 1000);
    return () => {
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      clearInterval(timer);
    };
  }, [refresh]);
  return { ...state, refresh };
}

function Countdown({ target }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!target) return <b>--:--:--</b>;
  const difference = Math.max(0, target.getTime() - now.getTime());
  const hours = Math.floor(difference / 36e5);
  const minutes = Math.floor((difference % 36e5) / 6e4);
  const seconds = Math.floor((difference % 6e4) / 1000);
  return (
    <b>
      {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </b>
  );
}
function HomeView({ go, user, prayerData }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  const nextPrayer = getNextPrayer(prayerData.data?.timings, now);
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 17
        ? "Good afternoon"
        : "Good evening";
  return (
    <>
      <section className="greeting">
        <div>
          <span>Assalamu Alaikum</span>
          <h1>
            {greeting}
            {user?.user_metadata?.name
              ? `, ${user.user_metadata.name.split(" ")[0]}`
              : ""}
          </h1>
          <p>
            {today} · {hijriToday()}
          </p>
        </div>
        <div className="sun-orbit">
          <Sun />
        </div>
      </section>
      <section className="prayer-hero">
        <div className="prayer-top">
          <span>
            <MapPin size={15} />{" "}
            {prayerData.data?.meta?.timezone ||
              (prayerData.loading
                ? "Finding your location..."
                : "Location needed")}
          </span>
          <span className="live">
            <i /> LIVE
          </span>
        </div>
        <div className="prayer-main">
          <div>
            <small>NEXT PRAYER</small>
            <h2>{nextPrayer?.name || "Waiting for location"}</h2>
            <p>
              {nextPrayer
                ? `Begins at ${nextPrayer.date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
                : prayerData.error || "Calculating today's prayer times..."}
            </p>
          </div>
          <div className="countdown">
            <Countdown target={nextPrayer?.date} />
            <span>remaining</span>
          </div>
        </div>
        <div className="prayer-line" />
        <div className="prayer-mini">
          {PRAYER_NAMES.map((name) => (
            <div
              className={nextPrayer?.name === name ? "active" : ""}
              key={name}
            >
              <span>{name}</span>
              <b>
                {cleanPrayerTime(prayerData.data?.timings?.[name]) || "--:--"}
              </b>
            </div>
          ))}
        </div>
      </section>
      <section className="section-title">
        <div>
          <span>EXPLORE</span>
          <h2>Your daily essentials</h2>
        </div>
        <button onClick={() => go("all")}>
          View all <ChevronRight size={16} />
        </button>
      </section>
      <div className="feature-grid">
        {features.map(([name, sub, Icon, id]) => (
          <button key={id} onClick={() => go(id)} className="feature-card">
            <span className="feature-icon">
              <Icon />
            </span>
            <b>{name}</b>
            <small>{sub}</small>
            <ChevronRight className="corner" size={16} />
          </button>
        ))}
      </div>
      <HadithCard />
    </>
  );
}
function HadithCard() {
  const [item, setItem] = useState(null);
  useEffect(() => {
    getDailyHadith()
      .then(setItem)
      .catch(() => {});
  }, []);
  return (
    <section className="hadith-card">
      <div className="quote">“</div>
      <span>HADITH OF THE DAY · CHANGES DAILY</span>
      <p>
        “
        {item?.text ||
          "The most beloved of you to me are those with the best character."}
        ”
      </p>
      <small>
        {item
          ? `${item.collection.name} · Hadith ${item.hadithnumber}`
          : "Jami’ at-Tirmidhi 2018"}
      </small>
    </section>
  );
}
function QuranView({ user }) {
  const [q, setQ] = useState(""),
    [list, setList] = useState([]),
    [selected, setSelected] = useState(null),
    [reader, setReader] = useState(null),
    [lang, setLang] = useState("en"),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [marks, setMarks] = useStored("bookmarks", []);
  useEffect(() => {
    getSurahs()
      .then(setList)
      .catch((e) => {
        setError(e.message);
        setList(
          surahs.map((s) => ({
            number: s.n,
            englishName: s.name,
            englishNameTranslation: s.meaning,
            name: s.ar,
            numberOfAyahs: s.ayahs,
          })),
        );
      })
      .finally(() => setLoading(false));
  }, []);
  const open = async (s) => {
    setSelected(s);
    setReader(null);
    setLoading(true);
    try {
      setReader(await getSurah(s.number));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const toggleMark = async (id, ayah) => {
    const marked = marks.includes(id);
    setMarks(marked ? marks.filter((x) => x !== id) : [...marks, id]);
    if (user && supabase) {
      if (marked)
        await supabase
          .from("bookmarks")
          .delete()
          .eq("kind", "ayah")
          .eq("reference", id);
      else
        await supabase.from("bookmarks").upsert({
          user_id: user.id,
          kind: "ayah",
          reference: id,
          payload: { text: ayah },
        });
    }
  };
  if (selected) {
    const arabic = reader?.[0]?.ayahs || [],
      english = reader?.[1]?.ayahs || [],
      urdu = reader?.[2]?.ayahs || [],
      audio = reader?.[3]?.ayahs || [];
    return (
      <div>
        <div className="reader-head">
          <button onClick={() => setSelected(null)}>
            <ChevronLeft />
          </button>
          <div>
            <h2>{selected.englishName}</h2>
            <span>
              {selected.englishNameTranslation} · {selected.numberOfAyahs} Ayahs
            </span>
          </div>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="ur">اردو</option>
          </select>
        </div>
        {loading ? (
          <Empty text="Loading the complete Surah…" />
        ) : (
          arabic.map((a, i) => {
            const id = `${selected.number}:${a.numberInSurah}`,
              marked = marks.includes(id);
            return (
              <article className="ayah" key={id}>
                <div className="ayah-meta">
                  <span>{id}</span>
                  <div>
                    <button
                      title="Play recitation"
                      onClick={() => new Audio(audio[i]?.audio).play()}
                    >
                      ▶
                    </button>
                    <button onClick={() => toggleMark(id, a.text)}>
                      {marked ? <BookmarkCheck /> : <Bookmark />}
                    </button>
                  </div>
                </div>
                <p className="arabic">
                  {a.text} <i>{a.numberInSurah}</i>
                </p>
                <p dir={lang === "ur" ? "rtl" : "ltr"}>
                  {lang === "ur" ? urdu[i]?.text : english[i]?.text}
                </p>
              </article>
            );
          })
        )}
      </div>
    );
  }
  const filtered = list.filter((s) =>
    (s.englishName + s.englishNameTranslation + s.name + s.number)
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <>
      <HeroTitle eyebrow="THE NOBLE QURAN" title="Read. Reflect. Return." />
      <SearchBox
        value={q}
        setValue={setQ}
        placeholder="Search all 114 Surahs"
      />
      {error && <div className="toast">{error}</div>}
      <div className="list-head">
        <b>Surahs</b>
        <span>{list.length || 114} chapters</span>
      </div>
      {loading ? (
        <Empty text="Loading the Quran…" />
      ) : (
        <div className="surah-list">
          {filtered.map((s) => (
            <button key={s.number} onClick={() => open(s)}>
              <span className="surah-no">{s.number}</span>
              <div>
                <b>{s.englishName}</b>
                <small>
                  {s.englishNameTranslation} · {s.numberOfAyahs} Ayahs
                </small>
              </div>
              <strong>{s.name}</strong>
              <ChevronRight />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
function TasbeehView({ user }) {
  const presets = [
    ["SubhanAllah", "سُبْحَانَ ٱللَّٰهِ", 33],
    ["Alhamdulillah", "ٱلْحَمْدُ لِلَّٰهِ", 33],
    ["Allahu Akbar", "ٱللَّٰهُ أَكْبَرُ", 34],
  ];
  const [idx, setIdx] = useStored("dhikr-preset", 0);
  const [count, setCount] = useStored("tasbeeh-count", 0);
  const [history, setHistory] = useStored("tasbeeh-history", []);
  const tap = () => {
    setCount(count + 1);
    navigator.vibrate?.(18);
  };
  const reset = async () => {
    if (count)
      setHistory(
        [
          {
            date: new Date().toLocaleDateString(),
            count,
            name: presets[idx][0],
          },
          ...history,
        ].slice(0, 7),
      );
    if (count && user && supabase)
      await supabase.from("tasbeeh_sessions").insert({
        user_id: user.id,
        dhikr: presets[idx][0],
        count,
      });
    setCount(0);
  };
  return (
    <>
      <HeroTitle eyebrow="REMEMBRANCE" title="Find stillness in dhikr." />
      <div className="preset-row">
        {presets.map((p, i) => (
          <button
            className={i === idx ? "selected" : ""}
            onClick={() => {
              setIdx(i);
              setCount(0);
            }}
            key={p[0]}
          >
            {p[0]}
          </button>
        ))}
      </div>
      <section className="tasbeeh-card">
        <span className="arabic dhikr">{presets[idx][1]}</span>
        <p>{presets[idx][0]}</p>
        <button className="counter" onClick={tap}>
          <span>{count}</span>
          <small>of {presets[idx][2]}</small>
        </button>
        <div className="progress">
          <i
            style={{
              width: `${Math.min(100, (count / presets[idx][2]) * 100)}%`,
            }}
          />
        </div>
        <div className="tasbeeh-actions">
          <button onClick={() => setCount(Math.max(0, count - 1))}>
            <Minus /> Undo
          </button>
          <button onClick={reset}>
            <RotateCcw /> Save & reset
          </button>
        </div>
      </section>
      <div className="list-head">
        <b>Recent practice</b>
        <span>{history.reduce((a, h) => a + h.count, 0)} total</span>
      </div>
      {history.length ? (
        <div className="history">
          {history.map((h, i) => (
            <div key={i}>
              <span>
                {h.name}
                <small>{h.date}</small>
              </span>
              <b>+{h.count}</b>
            </div>
          ))}
        </div>
      ) : (
        <Empty text="Your completed sessions will appear here." />
      )}
    </>
  );
}
function PrayerView({ prayerData }) {
  const [notice, setNotice] = useState("");
  const [enabled, setEnabled] = useStored("prayer-enabled", {
    Fajr: true,
    Dhuhr: true,
    Asr: true,
    Maghrib: true,
    Isha: true,
  });
  const rows = PRAYER_NAMES.map((name) => [
    name,
    cleanPrayerTime(prayerData.data?.timings?.[name]),
    PRAYER_LABELS[name],
  ]);

  useEffect(() => {
    if (!prayerData.data) return;
    const times = Object.fromEntries(rows.map(([name, time]) => [name, time]));
    localStorage.setItem(
      "prayer-reminder-settings",
      JSON.stringify({ times, enabled }),
    );
    window.dispatchEvent(new Event("sakinah-prayers-updated"));
  }, [prayerData.data, enabled]);

  const notify = async () => {
    if (!("Notification" in window))
      return setNotice("Notifications are not supported here");
    if (!prayerData.data)
      return setNotice("Allow location first so reminders use accurate times.");
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const registration = await navigator.serviceWorker?.ready;
      registration?.showNotification("Sakinah prayer reminders enabled", {
        body: "Your selected prayer reminders now use today's local times.",
        icon: "/icons/icon-192.png",
      });
    }
    setNotice(
      permission === "granted"
        ? "Prayer reminders enabled for today's local times"
        : "Notifications were not enabled",
    );
  };

  return (
    <>
      <HeroTitle eyebrow="SALAH" title="Pause. Pray. Be present." />
      <section className="location-card">
        <MapPin />
        <div>
          <small>PRAYER TIMES FOR</small>
          <b>{prayerData.data?.meta?.timezone || "Your current location"}</b>
        </div>
        <button onClick={prayerData.refresh} disabled={prayerData.loading}>
          <Navigation /> {prayerData.loading ? "Locating..." : "Refresh"}
        </button>
      </section>
      {(notice || prayerData.error) && (
        <div className="toast">
          <Check />
          {notice || prayerData.error}
        </div>
      )}
      <div className="prayer-list">
        {rows.map((prayer, index) => (
          <div key={prayer[0]}>
            <span className="pray-icon">
              {index === 0 ? <Moon /> : index === 3 ? <Sun /> : <Clock3 />}
            </span>
            <div>
              <b>{prayer[0]}</b>
              <small>{prayer[2]}</small>
            </div>
            <strong>{prayer[1] || "--:--"}</strong>
            <button
              className={`reminder-toggle ${enabled[prayer[0]] ? "on" : ""}`}
              aria-label={`${prayer[0]} reminder`}
              onClick={() =>
                setEnabled((current) => ({
                  ...current,
                  [prayer[0]]: !current[prayer[0]],
                }))
              }
            >
              <Bell />
            </button>
          </div>
        ))}
      </div>
      <button className="primary-btn" onClick={notify}>
        <Bell /> Enable prayer reminders
      </button>
      <p className="note">
        Times refresh from AlAdhan using your live coordinates and current date.
        Muslim World League calculation method is selected.
      </p>
    </>
  );
}

function QiblaView({ prayerData }) {
  const [heading, setHeading] = useState(0);
  const [motionNotice, setMotionNotice] = useState("");
  const qibla = prayerData.coords
    ? qiblaBearing(prayerData.coords.latitude, prayerData.coords.longitude)
    : null;

  const enableCompass = async () => {
    try {
      if (
        typeof window.DeviceOrientationEvent?.requestPermission === "function"
      ) {
        const permission =
          await window.DeviceOrientationEvent.requestPermission();
        setMotionNotice(
          permission === "granted" ? "Compass enabled" : "Motion access denied",
        );
      } else {
        setMotionNotice("Compass is active when supported by your device.");
      }
    } catch {
      setMotionNotice("Allow motion access in your browser settings.");
    }
  };

  useEffect(() => {
    const updateHeading = (event) =>
      setHeading(
        event.webkitCompassHeading ??
          (event.alpha == null ? 0 : 360 - event.alpha),
      );
    window.addEventListener("deviceorientationabsolute", updateHeading, true);
    window.addEventListener("deviceorientation", updateHeading, true);
    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        updateHeading,
        true,
      );
      window.removeEventListener("deviceorientation", updateHeading, true);
    };
  }, []);

  const place = prayerData.coords
    ? `${prayerData.coords.latitude.toFixed(4)} degrees, ${prayerData.coords.longitude.toFixed(4)} degrees`
    : "your live location";

  return (
    <>
      <HeroTitle eyebrow="DIRECTION" title="Turn your heart home." />
      <section className="qibla-card">
        <div
          className="compass-ring"
          style={{ transform: `rotate(${-heading}deg)` }}
        >
          <span className="north">N</span>
          <span className="east">E</span>
          <span className="south">S</span>
          <span className="west">W</span>
          <div
            className="needle"
            style={{ transform: `rotate(${qibla || 0}deg)` }}
          >
            <Navigation />
          </div>
          <div className="kaaba">KAABA</div>
        </div>
        <h2>{qibla == null ? "--" : Math.round(qibla)} degrees</h2>
        <p>
          {prayerData.error ||
            (prayerData.loading
              ? "Getting your precise location&"
              : `Qibla direction from ${place}`)}
        </p>
        <button className="primary-btn" onClick={enableCompass}>
          <Compass /> Enable live compass
        </button>
        {motionNotice && <small>{motionNotice}</small>}
      </section>
      <div className="tip">
        <Compass />
        <span>
          <b>For best accuracy</b>Calibrate your phone in a figure-eight and
          allow location and motion access.
        </span>
      </div>
    </>
  );
}
function LibraryView() {
  const [selected, setSelected] = useState(null);
  if (selected)
    return (
      <CollectionReader collection={selected} close={() => setSelected(null)} />
    );
  return (
    <>
      <HeroTitle eyebrow="AUTHENTIC COLLECTIONS" title="The books of Sunnah." />
      <p className="library-intro">
        Browse the complete English editions online. Hadith numbering and
        collection metadata remain visible for careful reference.
      </p>
      <div className="book-grid">
        {hadithCollections.map((b) => (
          <article key={b.id}>
            <div className="book-cover" style={{ background: b.color }}>
              <span>{b.arabic}</span>
              <b>{b.name}</b>
              <small>{b.author}</small>
            </div>
            <span>HADITH COLLECTION</span>
            <h3>{b.name}</h3>
            <p>{b.count.toLocaleString()} narrations</p>
            <button onClick={() => setSelected(b)}>
              Open collection <ChevronRight />
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
function CollectionReader({ collection, close }) {
  const [data, setData] = useState(null),
    [q, setQ] = useState(""),
    [page, setPage] = useState(0),
    [error, setError] = useState("");
  useEffect(() => {
    getHadithCollection(collection.id)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [collection]);
  const all = data?.hadiths || [],
    filtered = q
      ? all.filter(
          (h) =>
            h.text.toLowerCase().includes(q.toLowerCase()) ||
            String(h.hadithnumber) === q,
        )
      : all,
    shown = filtered.slice(page * 20, page * 20 + 20);
  return (
    <>
      <div className="reader-head">
        <button onClick={close}>
          <ChevronLeft />
        </button>
        <div>
          <h2>{collection.name}</h2>
          <span>
            {all.length
              ? `${all.length.toLocaleString()} narrations`
              : "Loading complete collection…"}
          </span>
        </div>
      </div>
      <SearchBox
        value={q}
        setValue={(v) => {
          setQ(v);
          setPage(0);
        }}
        placeholder="Search text or exact Hadith number"
      />
      {error && <div className="toast">{error}</div>}
      {!data ? (
        <Empty text="Opening the complete collection…" />
      ) : (
        <>
          <div className="hadith-feed">
            {shown.map((h) => (
              <article key={h.hadithnumber}>
                <span>
                  {collection.name} · {h.hadithnumber}
                </span>
                <p>“{h.text}”</p>
                <small>
                  Book {h.reference?.book} · Hadith {h.reference?.hadith}
                </small>
              </article>
            ))}
          </div>
          <div className="pagination">
            <button disabled={!page} onClick={() => setPage(page - 1)}>
              <ChevronLeft /> Previous
            </button>
            <span>
              Page {page + 1} of {Math.max(1, Math.ceil(filtered.length / 20))}
            </span>
            <button
              disabled={(page + 1) * 20 >= filtered.length}
              onClick={() => setPage(page + 1)}
            >
              Next <ChevronRight />
            </button>
          </div>
        </>
      )}
    </>
  );
}
function HadithView({ user }) {
  const [selected, setSelected] = useState(hadithCollections[0]),
    [daily, setDaily] = useState(null);
  useEffect(() => {
    getDailyHadith()
      .then(setDaily)
      .catch(() => {});
  }, []);
  return (
    <>
      <HeroTitle eyebrow="SUNNAH" title="Words that light the way." />
      {daily && (
        <section className="hadith-card">
          <span>TODAY · {daily.collection.name}</span>
          <p>“{daily.text}”</p>
          <small>Hadith {daily.hadithnumber}</small>
        </section>
      )}
      <div className="list-head">
        <b>Major collections</b>
        <span>Browse full books</span>
      </div>
      <div className="collection-list">
        {hadithCollections.map((c) => (
          <button key={c.id} onClick={() => setSelected(c)}>
            <span style={{ background: c.color }}>{c.arabic}</span>
            <div>
              <b>{c.name}</b>
              <small>
                {c.author} · {c.count.toLocaleString()} narrations
              </small>
            </div>
            <ChevronRight />
          </button>
        ))}
      </div>
      {selected && (
        <CollectionReader
          collection={selected}
          close={() => setSelected(null)}
        />
      )}
    </>
  );
}
function CalendarView() {
  return (
    <>
      <HeroTitle eyebrow="HIJRI CALENDAR" title="Sacred time, gently held." />
      <section className="calendar-card">
        <div className="cal-head">
          <button>
            <ChevronLeft />
          </button>
          <div>
            <span>RABI AL-AWWAL 1448</span>
            <h2>September 2026</h2>
          </div>
          <button>
            <ChevronRight />
          </button>
        </div>
        <div className="calendar-grid">
          {["S", "M", "T", "W", "T", "F", "S"].map((x) => (
            <b>{x}</b>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const d = i - 1;
            return (
              <span className={d === 3 ? "today" : d < 1 ? "muted" : ""}>
                {d > 0 && d <= 30 ? d : ""}
                {d === 3 && <small>20</small>}
              </span>
            );
          })}
        </div>
      </section>
      <div className="tip">
        <Moon />
        <span>
          <b>20 Rabi al-Awwal 1448</b>Hijri dates may vary by one day based on
          local moon sighting.
        </span>
      </div>
    </>
  );
}
function ProfileView({ user, openAuth }) {
  const [data, setData] = useState({ bookmarks: [], sessions: [] });
  useEffect(() => {
    if (!user || !supabase) return;
    Promise.all([
      supabase
        .from("bookmarks")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("tasbeeh_sessions")
        .select("*")
        .order("created_at", { ascending: false }),
    ]).then(([b, s]) =>
      setData({ bookmarks: b.data || [], sessions: s.data || [] }),
    );
  }, [user]);
  if (!user)
    return (
      <>
        <HeroTitle
          eyebrow="YOUR JOURNEY"
          title="Carry your progress with you."
        />
        <section className="profile-guest">
          <img src="/icons/icon-192.png" />
          <h2>Save and sync with Sakinah</h2>
          <p>
            Sign in to keep Quran bookmarks, Hadith favorites, dhikr history and
            preferences across every device.
          </p>
          <button className="primary-btn" onClick={openAuth}>
            Sign in or create account
          </button>
          {!isSupabaseConfigured && (
            <small>Connect a Supabase project to enable live accounts.</small>
          )}
        </section>
      </>
    );
  return (
    <>
      <HeroTitle
        eyebrow="YOUR PROFILE"
        title={user.user_metadata?.name || "Assalamu Alaikum"}
      />
      <section className="profile-card">
        <div className="profile-avatar">
          {(user.user_metadata?.name || user.email)[0].toUpperCase()}
        </div>
        <div>
          <b>{user.user_metadata?.name || "Sakinah member"}</b>
          <span>{user.email}</span>
          <small>Joined {new Date(user.created_at).toLocaleDateString()}</small>
        </div>
      </section>
      <div className="dashboard-stats">
        <div>
          <b>{data.bookmarks.length}</b>
          <span>Bookmarks</span>
        </div>
        <div>
          <b>{data.sessions.length}</b>
          <span>Dhikr sessions</span>
        </div>
        <div>
          <b>{data.sessions.reduce((a, x) => a + x.count, 0)}</b>
          <span>Total dhikr</span>
        </div>
      </div>
      <div className="list-head">
        <b>Recent activity</b>
      </div>
      {data.sessions.length ? (
        <div className="history">
          {data.sessions.slice(0, 6).map((x) => (
            <div key={x.id}>
              <span>
                {x.dhikr}
                <small>{new Date(x.created_at).toLocaleDateString()}</small>
              </span>
              <b>+{x.count}</b>
            </div>
          ))}
        </div>
      ) : (
        <Empty text="Your synced worship history will appear here." />
      )}
      <button className="signout" onClick={() => supabase.auth.signOut()}>
        Sign out
      </button>
    </>
  );
}
function QuranExperience({ user }) {
  const [mode, setMode] = useState("surahs");
  return (
    <>
      <div className="quran-modes">
        <button
          className={mode === "surahs" ? "active" : ""}
          onClick={() => setMode("surahs")}
        >
          114 Surahs
        </button>
        <button
          className={mode === "juz" ? "active" : ""}
          onClick={() => setMode("juz")}
        >
          30 Juz / Para
        </button>
        <button
          className={mode === "editions" ? "active" : ""}
          onClick={() => setMode("editions")}
        >
          Quran Editions
        </button>
      </div>
      {mode === "surahs" ? (
        <QuranView user={user} />
      ) : mode === "juz" ? (
        <JuzBrowser />
      ) : (
        <EditionBrowser />
      )}
    </>
  );
}
function JuzBrowser() {
  const [selected, setSelected] = useState(null),
    [data, setData] = useState(null),
    [loading, setLoading] = useState(false);
  const open = async (n) => {
    setSelected(n);
    setLoading(true);
    setData(null);
    try {
      setData(await getJuz(n));
    } finally {
      setLoading(false);
    }
  };
  if (selected)
    return (
      <>
        <div className="reader-head">
          <button onClick={() => setSelected(null)}>
            <ChevronLeft />
          </button>
          <div>
            <h2>Juz {selected}</h2>
            <span>Para {selected} · Uthmani Quran</span>
          </div>
        </div>
        {loading ? (
          <Empty text="Loading Juz…" />
        ) : (
          <div>
            {data?.ayahs?.map((a) => (
              <article className="ayah" key={a.number}>
                <div className="ayah-meta">
                  <span>
                    {a.surah.number}:{a.numberInSurah}
                  </span>
                  <small>{a.surah.englishName}</small>
                </div>
                <p className="arabic">
                  {a.text} <i>{a.numberInSurah}</i>
                </p>
              </article>
            ))}
          </div>
        )}
      </>
    );
  return (
    <>
      <HeroTitle eyebrow="THIRTY PARTS" title="Read by Juz or Para." />
      <div className="juz-grid">
        {Array.from({ length: 30 }, (_, i) => (
          <button key={i} onClick={() => open(i + 1)}>
            <b>{i + 1}</b>
            <span>Juz · Para {i + 1}</span>
          </button>
        ))}
      </div>
    </>
  );
}
function EditionBrowser() {
  const [editions, setEditions] = useState([]),
    [q, setQ] = useState("");
  useEffect(() => {
    getQuranEditions()
      .then(setEditions)
      .catch(() => {});
  }, []);
  const groups = [
    {
      title: "Arabic Quran scripts",
      items: editions.filter((x) => x.type === "quran"),
    },
    {
      title: "Urdu translations",
      items: editions.filter((x) => x.language === "ur"),
    },
    {
      title: "English translations",
      items: editions.filter((x) => x.language === "en"),
    },
  ];
  return (
    <>
      <HeroTitle eyebrow="QURAN EDITIONS" title="Choose how you read." />
      <SearchBox
        value={q}
        setValue={setQ}
        placeholder="Search translator or edition"
      />
      {!editions.length && <Empty text="Loading available Quran editions…" />}
      {groups.map((g) => {
        const items = g.items.filter((x) =>
          (x.name + x.englishName).toLowerCase().includes(q.toLowerCase()),
        );
        return items.length ? (
          <section className="edition-group" key={g.title}>
            <div className="list-head">
              <b>{g.title}</b>
              <span>{items.length} editions</span>
            </div>
            {items.map((x) => (
              <div className="edition-row" key={x.identifier}>
                <span className="arabic">{x.name}</span>
                <div>
                  <b>{x.englishName}</b>
                  <small>
                    {x.type} · {x.identifier}
                  </small>
                </div>
              </div>
            ))}
          </section>
        ) : null;
      })}
    </>
  );
}
function HeroTitle({ eyebrow, title }) {
  return (
    <div className="page-title">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
    </div>
  );
}
function SearchBox({ value, setValue, placeholder }) {
  return (
    <label className="search">
      <Search />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button onClick={() => setValue("")}>
          <X />
        </button>
      )}
    </label>
  );
}
function InstallGate({ prompt, close }) {
  const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isAndroid = /android/i.test(navigator.userAgent);
  const installApp = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") close();
  };
  return (
    <div className="install-gate">
      <section>
        <button className="gate-close" onClick={close}>
          <X />
        </button>
        <img src="/icons/icon-192.png" alt="Sakinah app icon" />
        <span>SAKINAH ISLAMIC COMPANION</span>
        <h2>Install this app</h2>
        <p>Keep Quran, prayer times, Hadith and daily dhikr one tap away.</p>
        {isiOS ? (
          <div className="ios-steps">
            <b>Install on iPhone or iPad</b>
            <ol>
              <li>
                Open this link in <strong>Safari</strong>.
              </li>
              <li>
                Tap the <strong>Share</strong> button.
              </li>
              <li>
                Select <strong>Add to Home Screen</strong>, then Add.
              </li>
            </ol>
          </div>
        ) : prompt ? (
          <button className="gate-install" onClick={installApp}>
            <Download /> Install Sakinah
          </button>
        ) : (
          <div className="ios-steps">
            <b>
              {isAndroid ? "Android installation" : "Install from your browser"}
            </b>
            <p>
              Open the browser menu and choose <strong>Install app</strong> or{" "}
              <strong>Add to Home screen</strong>.
            </p>
          </div>
        )}
        <button className="continue-web" onClick={close}>
          Continue in browser
        </button>
      </section>
    </div>
  );
}
function Onboarding({ onLogin, onSignup, onGuest }) {
  return (
    <div className="onboarding">
      <section>
        <div className="onboarding-brand">
          <img src="/icons/icon-192.png" alt="Sakinah" />
          <div>
            <span>WELCOME TO</span>
            <h1>Sakinah</h1>
            <p>Your peaceful Islamic companion</p>
          </div>
        </div>
        <h2>Everything for your daily deen.</h2>
        <div className="onboarding-features">
          <div>
            <BookOpen />
            <span>
              <b>Complete Quran</b>Surahs, Juz, translation & audio
            </span>
          </div>
          <div>
            <Clock3 />
            <span>
              <b>Prayer companion</b>Live times, Qibla & reminders
            </span>
          </div>
          <div>
            <Heart />
            <span>
              <b>Grow every day</b>Hadith collections, books & dhikr
            </span>
          </div>
        </div>
        <button className="onboard-primary" onClick={onSignup}>
          Create free account
        </button>
        <button className="onboard-secondary" onClick={onLogin}>
          Sign in
        </button>
        <button className="onboard-guest" onClick={onGuest}>
          Continue without an account <ChevronRight />
        </button>
        <small>
          Accounts securely sync your bookmarks and dhikr history across
          devices.
        </small>
      </section>
    </div>
  );
}
function usePrayerScheduler() {
  useEffect(() => {
    let timers = [];
    const schedule = () => {
      timers.forEach(clearTimeout);
      timers = [];
      if (Notification.permission !== "granted") return;
      let saved;
      try {
        saved = JSON.parse(localStorage.getItem("prayer-reminder-settings"));
      } catch {
        return;
      }
      if (!saved?.times) return;
      Object.entries(saved.times).forEach(([name, value]) => {
        if (saved.enabled?.[name] === false) return;
        const [hour, minute] = value.split(":").map(Number);
        const target = new Date();
        target.setHours(hour, minute, 0, 0);
        if (target <= new Date()) target.setDate(target.getDate() + 1);
        timers.push(
          setTimeout(async () => {
            const registration = await navigator.serviceWorker?.ready;
            registration?.showNotification(`${name} prayer time`, {
              body: "It is time to pause and pray. May Allah accept your salah.",
              icon: "/icons/icon-192.png",
              badge: "/icons/icon-192.png",
              tag: `sakinah-${name}`,
              vibrate: [180, 80, 180],
            });
          }, target.getTime() - Date.now()),
        );
      });
    };
    schedule();
    window.addEventListener("sakinah-prayers-updated", schedule);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("sakinah-prayers-updated", schedule);
    };
  }, []);
}
function Empty({ text }) {
  return (
    <div className="empty">
      <Moon />
      <p>{text}</p>
    </div>
  );
}
function App() {
  const params = new URLSearchParams(location.search);
  const [view, setView] = useState(params.get("view") || "home"),
    [dark, setDark] = useStored("dark-mode", params.get("theme") === "dark"),
    [install, setInstall] = useState(null),
    [user, setUser] = useState(null),
    [authReady, setAuthReady] = useState(!supabase),
    [authOpen, setAuthOpen] = useState(false),
    [authMode, setAuthMode] = useState("login"),
    [updateAvailable, setUpdateAvailable] = useState(false),
    [showOnboarding, setShowOnboarding] = useState(
      () =>
        localStorage.getItem("sakinah-onboarded") !== "1" &&
        params.get("screenshot") !== "1",
    ),
    [showInstallGate, setShowInstallGate] = useState(
      () =>
        !window.matchMedia("(display-mode: standalone)").matches &&
        !window.navigator.standalone &&
        params.get("screenshot") !== "1" &&
        sessionStorage.getItem("sakinah-install-dismissed") !== "1",
    );
  usePrayerScheduler();
  const prayerData = useLivePrayerData();
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user || null);
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user || null);
      setAuthReady(true);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    const ready = () => setUpdateAvailable(true);
    window.addEventListener("sakinah-update-ready", ready);
    return () => window.removeEventListener("sakinah-update-ready", ready);
  }, []);
  useEffect(() => {
    const fn = (e) => {
      e.preventDefault();
      setInstall(e);
    };
    window.addEventListener("beforeinstallprompt", fn);
    return () => window.removeEventListener("beforeinstallprompt", fn);
  }, []);
  const names = {
    quran: "Quran",
    tasbeeh: "Tasbeeh",
    prayer: "Prayer Times",
    qibla: "Qibla",
    library: "Books",
    hadith: "Hadith",
    calendar: "Calendar",
    profile: "Profile",
  };
  const go = (v) => {
    setView(v);
    history.replaceState({}, "", `/?view=${v}`);
    scrollTo(0, 0);
  };
  const render = () =>
    ({
      quran: <QuranExperience user={user} />,
      tasbeeh: <TasbeehView user={user} />,
      prayer: <PrayerView prayerData={prayerData} />,
      qibla: <QiblaView prayerData={prayerData} />,
      library: <LibraryView />,
      hadith: <HadithView user={user} />,
      calendar: <CalendarView />,
      profile: <ProfileView user={user} openAuth={() => setAuthOpen(true)} />,
    })[view] || <HomeView go={go} user={user} prayerData={prayerData} />;
  return (
    <div className="app">
      <Header
        title={view === "home" ? null : names[view]}
        back={view !== "home"}
        onBack={() => go("home")}
        dark={dark}
        setDark={setDark}
        user={user}
        onProfile={() => go("profile")}
      />
      <main>
        {install && view === "home" && (
          <div className="install">
            <div>
              <Download />
              <span>
                <b>Install Sakinah</b>Keep your companion one tap away.
              </span>
            </div>
            <button
              onClick={() => {
                install.prompt();
                setInstall(null);
              }}
            >
              Install
            </button>
          </div>
        )}
        {render()}
      </main>
      <nav className="bottom-nav">
        {[
          [Home, "Home", "home"],
          [BookOpen, "Quran", "quran"],
          [Heart, "Hadith", "hadith"],
          [Library, "Books", "library"],
          [Hand, "Tasbeeh", "tasbeeh"],
          [Settings, "Profile", "profile"],
        ].map(([Icon, label, id]) => (
          <button
            key={id}
            className={view === id ? "active" : ""}
            onClick={() => go(id)}
          >
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {updateAvailable && (
        <div className="update-banner">
          <div>
            <Download />
            <span>
              <b>A new Sakinah update is ready</b>Install it without losing your
              progress.
            </span>
          </div>
          <button
            onClick={async () => {
              const registration =
                await navigator.serviceWorker.getRegistration();
              registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
            }}
          >
            Update now
          </button>
        </div>
      )}
      {authOpen && (
        <AuthModal initialMode={authMode} close={() => setAuthOpen(false)} />
      )}
      {showInstallGate && (
        <InstallGate
          prompt={install}
          close={() => {
            sessionStorage.setItem("sakinah-install-dismissed", "1");
            setShowInstallGate(false);
          }}
        />
      )}
      {authReady && !showInstallGate && showOnboarding && !user && (
        <Onboarding
          onLogin={() => {
            setAuthMode("login");
            setAuthOpen(true);
          }}
          onSignup={() => {
            setAuthMode("signup");
            setAuthOpen(true);
          }}
          onGuest={() => {
            localStorage.setItem("sakinah-onboarded", "1");
            setShowOnboarding(false);
          }}
        />
      )}
    </div>
  );
}
export default App;

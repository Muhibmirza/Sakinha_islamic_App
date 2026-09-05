import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Clock3,
  Hand,
  Heart,
  Sparkles,
  ChevronRight,
  Search,
  Mic,
  Share2,
  Languages,
  Compass,
  Settings,
  User,
  LogIn,
  MoonStar,
  Star,
  ScrollText,
  Map,
  Utensils,
  Plane,
  Shield,
  Plus,
  X,
  Check,
  Library,
} from "lucide-react";

const slides = [
  {
    title: "Read the Quran",
    text: "Arabic Quran, translation, bookmarks and recitation.",
    icon: BookOpen,
  },
  {
    title: "Pray on time",
    text: "Live local prayer times, countdown, Qibla and reminders.",
    icon: Clock3,
  },
  {
    title: "Remember Allah",
    text: "Daily dhikr, personal tasbeehs and synced progress.",
    icon: Hand,
  },
  {
    title: "Learn authentic guidance",
    text: "Hadith, duas and worship guides in one peaceful place.",
    icon: Heart,
  },
  {
    title: "Choose your fiqh",
    text: "Select Hanafi or Jafria; you can change this anytime.",
    icon: Settings,
    fiqh: true,
  },
];

export function EnhancedOnboarding({ onDone }) {
  const [splash, setSplash] = useState(true);
  const [step, setStep] = useState(0);
  const [fiqh, setFiqh] = useState(
    localStorage.getItem("sakinah-fiqh") || "hanafi",
  );
  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 1900);
    return () => clearTimeout(timer);
  }, []);
  if (splash)
    return (
      <div className="setup-splash">
        <img src="/icons/icon-192.png" />
        <h1>Sakinah</h1>
        <p>Setting up Sakinah on your phone.</p>
      </div>
    );
  const slide = slides[step],
    Icon = slide.icon;
  return (
    <div className="journey-onboarding">
      <section>
        <div className="journey-progress">
          {slides.map((_, i) => (
            <i className={i <= step ? "done" : ""} key={i} />
          ))}
        </div>
        <div className="journey-icon">
          <Icon />
        </div>
        <span>WELCOME TO SAKINAH</span>
        <h1>{slide.title}</h1>
        <p>{slide.text}</p>
        {slide.fiqh && (
          <div className="fiqh-choice">
            <button
              className={fiqh === "hanafi" ? "selected" : ""}
              onClick={() => setFiqh("hanafi")}
            >
              <b>Hanafi</b>
              <small>Sunni Hanafi school</small>
            </button>
            <button
              className={fiqh === "jafria" ? "selected" : ""}
              onClick={() => setFiqh("jafria")}
            >
              <b>Jafria</b>
              <small>Shia Ithna-Ashari</small>
            </button>
          </div>
        )}
        <button
          className="journey-next"
          onClick={() => {
            if (step < slides.length - 1) setStep(step + 1);
            else {
              localStorage.setItem("sakinah-fiqh", fiqh);
              onDone(fiqh);
            }
          }}
        >
          {step === slides.length - 1 ? "All Done" : "Next"} <ChevronRight />
        </button>
        {step > 0 && (
          <button className="journey-back" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
      </section>
    </div>
  );
}

function remaining(target, now) {
  if (!target) return "--:--:--";
  const d = Math.max(0, target - now);
  return [
    Math.floor(d / 36e5),
    Math.floor((d % 36e5) / 6e4),
    Math.floor((d % 6e4) / 1000),
  ]
    .map((x) => String(x).padStart(2, "0"))
    .join(":");
}

export function PersistentPrayer({ prayerData, nextPrayer, onOpen }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <button className="persistent-prayer" onClick={onOpen}>
      <div className="mini-mosque">
        <i />
        <span>☾</span>
      </div>
      <div>
        <small>
          NEXT PRAYER · {prayerData.data?.meta?.timezone || "LIVE LOCATION"}
        </small>
        <b>
          {nextPrayer?.name ||
            (prayerData.loading ? "Locating…" : "Location required")}
        </b>
      </div>
      <strong>{remaining(nextPrayer?.date, now)}</strong>
    </button>
  );
}

const moments = [
  {
    ar: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    ur: "بے شک ہر مشکل کے ساتھ آسانی ہے۔",
    en: "Surely with hardship comes ease.",
    ref: "94:5",
  },
  {
    ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    ur: "خبردار! اللہ کے ذکر سے دل مطمئن ہوتے ہیں۔",
    en: "In the remembrance of Allah hearts find comfort.",
    ref: "13:28",
  },
  {
    ar: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
    ur: "اور تم جہاں کہیں ہو وہ تمہارے ساتھ ہے۔",
    en: "He is with you wherever you are.",
    ref: "57:4",
  },
];
const flashes = [
  [
    "Patience is beautiful",
    "Indeed, Allah is with the patient.",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=75",
  ],
  [
    "A grateful heart",
    "If you are grateful, I will surely increase you.",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=75",
  ],
  [
    "Jummah Mubarak",
    "Send blessings upon the Prophet ﷺ.",
    "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=700&q=75",
  ],
];
async function shareCard(title, text) {
  const data = { title, text: `${text}\n\nShared from Sakinah` };
  if (navigator.share) await navigator.share(data);
  else await navigator.clipboard?.writeText(data.text);
}
export function EnhancedHome({ go, user }) {
  const [language, setLanguage] = useState("ur");
  const [query, setQuery] = useState("");
  const moment = moments[Math.floor(Date.now() / 3600000) % moments.length];
  const voice = () => {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition)
      return alert("Voice search is not supported by this browser.");
    const r = new Recognition();
    r.lang = language === "ur" ? "ur-PK" : "en-US";
    r.onresult = (e) => setQuery(e.results[0][0].transcript);
    r.start();
  };
  const submit = (e) => {
    e.preventDefault();
    if (query.trim()) go("quran");
  };
  return (
    <>
      <section className="home-welcome">
        <span>ASSALAMU ALAIKUM</span>
        <h1>
          {user?.user_metadata?.name
            ? `Welcome, ${user.user_metadata.name.split(" ")[0]}`
            : "A peaceful day begins here."}
        </h1>
      </section>
      <form className="global-search" onSubmit={submit}>
        <Search />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Quran, Surah or Ayah"
        />
        <button type="button" onClick={voice}>
          <Mic />
        </button>
      </form>
      <article className="moment-card">
        <div className="moment-actions">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="ur">Urdu</option>
            <option value="en">English</option>
          </select>
          <button
            onClick={() => shareCard(`Quran ${moment.ref}`, moment[language])}
          >
            <Share2 />
          </button>
        </div>
        <small>AYAT OF THE MOMENT · {moment.ref}</small>
        <p className="moment-arabic">{moment.ar}</p>
        <p>{moment[language]}</p>
      </article>
      <div className="upgrade-heading">
        <div>
          <span>FLAHES & GREETINGS</span>
          <h2>Share a little light</h2>
        </div>
        <button onClick={() => go("flashes")}>See all</button>
      </div>
      <div className="flash-strip">
        {flashes.map(([title, text, image]) => (
          <article
            style={{
              backgroundImage: `linear-gradient(0deg,rgba(4,28,17,.8),rgba(4,28,17,.1)),url(${image})`,
            }}
            key={title}
          >
            <span>{title}</span>
            <p>{text}</p>
            <button onClick={() => shareCard(title, text)}>
              <Share2 />
            </button>
          </article>
        ))}
      </div>
      <div className="quick-four">
        {[
          ["Duas", "Urdu + English", MoonStar, "duas"],
          ["Shahadat", "Faith & meaning", Star, "shahadat"],
          ["Tasbeeh", "Dhikr counter", Hand, "tasbeeh"],
          ["Hajj & Umrah", "Step-by-step", Map, "ibadat"],
        ].map(([a, b, I, v]) => (
          <button key={a} onClick={() => go(v)}>
            <I />
            <span>
              <b>{a}</b>
              <small>{b}</small>
            </span>
          </button>
        ))}
      </div>
      <button className="hajj-banner" onClick={() => go("ibadat")}>
        <span>
          <small>PILGRIMAGE COMPANION</small>
          <b>Umrah & Hajj guidance</b>
          <em>Preparation, rituals, duas and checklists</em>
        </span>
        <ChevronRight />
      </button>
    </>
  );
}
export function FlashesView() {
  return (
    <>
      <div className="upgrade-title">
        <span>SHARE PEACE</span>
        <h1>Flashes & Greetings</h1>
      </div>
      <div className="flash-gallery">
        {[...flashes, ...flashes].map(([title, text, image], i) => (
          <article
            style={{
              backgroundImage: `linear-gradient(0deg,rgba(4,28,17,.85),transparent),url(${image})`,
            }}
            key={i}
          >
            <span>{title}</span>
            <p>{text}</p>
            <button onClick={() => shareCard(title, text)}>
              <Share2 /> Share
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
const duas = [
  [
    "Before eating",
    "بِسْمِ اللَّهِ",
    "In the name of Allah.",
    "اللہ کے نام سے۔",
    Utensils,
  ],
  [
    "Travel",
    "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا",
    "Glory to Him who subjected this for us.",
    "پاک ہے وہ جس نے اسے ہمارے تابع کیا۔",
    Plane,
  ],
  [
    "Distress",
    "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    "Allah is sufficient for us and the best disposer of affairs.",
    "ہمارے لیے اللہ کافی ہے۔",
    Shield,
  ],
];
export function DuasView() {
  return (
    <>
      <div className="upgrade-title">
        <span>SUPPLICATIONS</span>
        <h1>Daily Duas</h1>
      </div>
      <div className="dua-list">
        {duas.map(([t, ar, en, ur, I]) => (
          <article key={t}>
            <I />
            <div>
              <b>{t}</b>
              <p className="arabic">{ar}</p>
              <p>{ur}</p>
              <small>{en}</small>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
export function ShahadatView() {
  return (
    <>
      <div className="upgrade-title">
        <span>DECLARATION OF FAITH</span>
        <h1>Shahadat</h1>
      </div>
      <article className="shahada-card">
        <Star />
        <p className="arabic">
          أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا
          رَسُولُ اللهِ
        </p>
        <b>
          Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan rasulullah.
        </b>
        <p>
          I bear witness that none has the right to be worshipped but Allah, and
          Muhammad is the Messenger of Allah.
        </p>
        <small>
          میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اللہ کے
          رسول ہیں۔
        </small>
      </article>
    </>
  );
}
const guides = {
  Salah: [
    "Intention and purity",
    "Face the Qibla and say Takbir",
    "Recite Al-Fatihah and Quran",
    "Perform Ruku and Sujood",
    "Complete Tashahhud and Salam",
  ],
  Fasting: [
    "Make intention before dawn",
    "Eat Suhoor and stop at Fajr",
    "Avoid food, drink and harmful conduct",
    "Increase Quran, dua and charity",
    "Break the fast at Maghrib",
  ],
  Hajj: [
    "Enter Ihram and make intention",
    "Perform Tawaf and Sa'i",
    "Travel to Mina and Arafat",
    "Spend the night at Muzdalifah",
    "Rami, sacrifice and final Tawaf",
  ],
  Umrah: [
    "Enter Ihram at Miqat",
    "Recite Talbiyah",
    "Perform seven rounds of Tawaf",
    "Pray and drink Zamzam",
    "Perform Sa'i and trim hair",
  ],
  Janaza: [
    "Make intention in congregation",
    "First Takbir and Thana",
    "Second Takbir and Salawat",
    "Third Takbir and dua for deceased",
    "Fourth Takbir and Salam",
  ],
};
export function IbadatView() {
  const [tab, setTab] = useState("Salah");
  return (
    <>
      <div className="upgrade-title">
        <span>WORSHIP GUIDES</span>
        <h1>Learn your Ibadat</h1>
      </div>
      <div className="guide-tabs">
        {Object.keys(guides).map((x) => (
          <button
            className={tab === x ? "active" : ""}
            onClick={() => setTab(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="guide-steps">
        {guides[tab].map((x, i) => (
          <article key={x}>
            <b>{i + 1}</b>
            <div>
              <span>{x}</span>
              <small>
                {tab === "Salah" && i === 1
                  ? "اللّٰهُ أَكْبَرُ · Allah is the Greatest"
                  : "Read the detailed guidance carefully and follow in sequence."}
              </small>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
export function MoreView({ user, fiqh, setFiqh, go, openAuth }) {
  return (
    <>
      <div className="upgrade-title">
        <span>YOUR SAKINAH</span>
        <h1>More & Settings</h1>
      </div>
      <article className="account-status">
        <User />
        <div>
          <b>{user?.user_metadata?.name || "Guest mode"}</b>
          <small>{user?.email || "Local data is not cloud synced"}</small>
        </div>
        {!user && (
          <button onClick={openAuth}>
            <LogIn /> Sign in
          </button>
        )}
      </article>
      <section className="settings-section">
        <b>Fiqh preference</b>
        <div className="fiqh-setting">
          <button
            className={fiqh === "hanafi" ? "active" : ""}
            onClick={() => setFiqh("hanafi")}
          >
            Hanafi
          </button>
          <button
            className={fiqh === "jafria" ? "active" : ""}
            onClick={() => setFiqh("jafria")}
          >
            Jafria
          </button>
        </div>
        <small>
          Prayer calculation and recommended sources update instantly.
        </small>
      </section>
      <div className="more-grid">
        {[
          [Sparkles, "99 Names", "names"],
          [Compass, "Qibla", "qibla"],
          [MoonStar, "Supplications", "duas"],
          [Hand, "My Tasbeeh", "tasbeeh"],
          [Library, "Books", "library"],
          [Clock3, "Prayer settings", "prayer"],
        ].map(([I, t, v]) => (
          <button onClick={() => go(v)} key={t}>
            <I />
            <span>{t}</span>
            <ChevronRight />
          </button>
        ))}
      </div>
      {user && (
        <button
          className="signout"
          onClick={() => window.dispatchEvent(new Event("sakinah-signout"))}
        >
          Log out
        </button>
      )}
    </>
  );
}
export function NamesView() {
  const names = [
    "Ar-Rahman",
    "Ar-Raheem",
    "Al-Malik",
    "Al-Quddus",
    "As-Salam",
    "Al-Mu'min",
    "Al-Muhaymin",
    "Al-Aziz",
    "Al-Jabbar",
    "Al-Mutakabbir",
    "Al-Khaliq",
    "Al-Bari",
    "Al-Musawwir",
    "Al-Ghaffar",
    "Al-Qahhar",
    "Al-Wahhab",
    "Ar-Razzaq",
    "Al-Fattah",
  ];
  return (
    <>
      <div className="upgrade-title">
        <span>ASMA-UL-HUSNA</span>
        <h1>99 Names of Allah</h1>
      </div>
      <div className="names-grid">
        {names.map((n, i) => (
          <div key={n}>
            <b>{i + 1}</b>
            <span>{n}</span>
          </div>
        ))}
      </div>
      <p className="note">
        The complete 99-name reader will continue loading in future content
        updates.
      </p>
    </>
  );
}

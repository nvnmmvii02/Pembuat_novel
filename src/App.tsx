import { useCallback, useEffect, useRef, useState } from "react";
import { getGenre, matchCustomGenre } from "./data/genres";
import type { Proposal } from "./engine/engine";
import { generateChapters, generateProposals } from "./engine/engine";
import { LOADING_MSGS } from "./data/world";
import { Background } from "./components/Background";
import { Icon } from "./components/Icons";
import { IdleStage } from "./components/IdleStage";
import { OptionsStage } from "./components/OptionsStage";
import { BlueprintStage } from "./components/BlueprintStage";
import { WriterStage } from "./components/WriterStage";

type Stage = "idle" | "loading" | "options" | "blueprint" | "writer";

const LS_KEY = "mesinkisah:v1";

interface Persist {
  stage: Stage;
  genreId: string | null;
  proposals: Proposal[] | null;
  sel: Proposal | null;
  texts: Record<number, string>;
  cur: number;
  ack: boolean;
  seedBase: number;
}

function loadPersist(): Persist {
  const fallback: Persist = { stage: "idle", genreId: null, proposals: null, sel: null, texts: {}, cur: 1, ack: false, seedBase: 0 };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return fallback;
    const d = JSON.parse(raw) as Persist;
    if (d.stage === "loading") d.stage = "idle";
    if (!d.genreId || (d.stage !== "idle" && !d.proposals)) return fallback;
    return { ...fallback, ...d };
  } catch {
    return fallback;
  }
}

const CRUMB: Array<[Stage, string]> = [
  ["idle", "genre"],
  ["options", "proposal"],
  ["blueprint", "cetak biru"],
  ["writer", "naskah"],
];
const CRUMB_ORDER: Stage[] = ["idle", "options", "blueprint", "writer"];

export default function App() {
  const [persist] = useState(loadPersist);
  const [stage, setStage] = useState<Stage>(persist.stage);
  const [genreId, setGenreId] = useState<string | null>(persist.genreId);
  const [proposals, setProposals] = useState<Proposal[] | null>(persist.proposals);
  const [sel, setSel] = useState<Proposal | null>(persist.sel);
  const [texts, setTexts] = useState<Record<number, string>>(persist.texts);
  const [cur, setCur] = useState(persist.cur);
  const [ack, setAck] = useState(persist.ack);
  const [seedBase, setSeedBase] = useState(persist.seedBase);
  const [msgIdx, setMsgIdx] = useState(0);
  const [adultGate, setAdultGate] = useState(false);
  const pendingRef = useRef<string | null>(null);
  const bootTimer = useRef<number | null>(null);

  const genre = genreId ? getGenre(genreId) : null;

  /* simpan sesi */
  useEffect(() => {
    const d: Persist = { stage, genreId, proposals, sel, texts, cur, ack, seedBase };
    try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch { /* abaikan */ }
  }, [stage, genreId, proposals, sel, texts, cur, ack, seedBase]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [stage]);

  /* layar mesin berpikir */
  useEffect(() => {
    if (stage !== "loading") return;
    setMsgIdx(0);
    const iv = window.setInterval(() => setMsgIdx((m) => (m + 1) % LOADING_MSGS.length), 520);
    return () => clearInterval(iv);
  }, [stage]);

  const startRacik = useCallback((id: string) => {
    setGenreId(id);
    setStage("loading");
    if (bootTimer.current) clearTimeout(bootTimer.current);
    bootTimer.current = window.setTimeout(() => {
      const sb = Math.floor(Math.random() * 1e6) + 7;
      setSeedBase(sb);
      setProposals(generateProposals(getGenre(id), sb));
      setSel(null);
      setTexts({});
      setCur(1);
      setStage("options");
    }, 2900);
  }, []);

  useEffect(() => () => { if (bootTimer.current) clearTimeout(bootTimer.current); }, []);

  const requestGenre = useCallback((id: string) => {
    const g = getGenre(id);
    if (g.mature && !ack) {
      pendingRef.current = id;
      setAdultGate(true);
      return;
    }
    startRacik(id);
  }, [ack, startRacik]);

  const requestCustom = useCallback((text: string) => {
    requestGenre(matchCustomGenre(text));
  }, [requestGenre]);

  const pickProposal = useCallback((idx: number, titleIdx: number) => {
    if (!proposals || !genre) return;
    const p = { ...proposals[idx], titleIdx };
    setSel(generateChapters(p, genre));
    setTexts({});
    setCur(1);
    setStage("blueprint");
  }, [proposals, genre]);

  const saveChapter = useCallback((n: number, text: string) => {
    setTexts((t) => ({ ...t, [n]: text }));
  }, []);

  const resetAll = () => {
    try { localStorage.removeItem(LS_KEY); } catch { /* abaikan */ }
    setStage("idle"); setGenreId(null); setProposals(null); setSel(null);
    setTexts({}); setCur(1); setSeedBase(0);
  };

  const crumbActive = stage === "loading" ? "idle" : stage;
  const crumbIdx = CRUMB_ORDER.indexOf(crumbActive);

  return (
    <div className="min-h-screen relative">
      <Background />

      {/* ===== bilah atas ===== */}
      <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-950/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 md:px-8 h-16 flex items-center gap-4">
          <button onClick={() => stage === "idle" ? window.scrollTo({ top: 0, behavior: "smooth" }) : setStage(genre ? (sel ? "blueprint" : proposals ? "options" : "idle") : "idle")} className="flex items-center gap-3 group">
            <span className="p-2 bg-ember-500 text-ink-950 rounded-lg group-hover:rotate-12 transition-transform">
              <Icon name="nib" className="w-5 h-5" />
            </span>
            <span className="font-display font-black tracking-tight text-lg text-fog leading-none">
              MESIN<span className="text-ember-400">KISAH</span>
              <span className="block text-[9px] font-body font-semibold tracking-[0.3em] uppercase text-ink-400 mt-0.5">studio cerita otomatis</span>
            </span>
          </button>

          <nav className="ml-6 hidden md:flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider">
            {CRUMB.map(([s, label], i) => (
              <span key={s} className="flex items-center">
                <span className={`px-2.5 py-1 rounded-full transition-colors ${i === crumbIdx ? "bg-fog text-ink-950" : i < crumbIdx ? "text-aqua-400" : "text-ink-500"}`}>
                  {label}
                </span>
                {i < CRUMB.length - 1 && <span className="text-ink-600 mx-0.5">/</span>}
              </span>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {stage === "writer" && sel ? (
              <span className="hidden sm:flex items-center gap-2 text-xs text-ink-300 border border-ink-600 rounded-full px-3.5 py-1.5">
                <Icon name="book" className="w-3.5 h-3.5 text-gold-400" />
                bab {cur}/{sel.chapterCount}
              </span>
            ) : null}
            <span className="hidden sm:flex items-center gap-2 text-xs text-ink-300">
              <span className={`w-2 h-2 rounded-full ${stage === "loading" ? "bg-gold-400 anim-breathe" : "bg-aqua-400"}`} />
              {stage === "loading" ? "mesin bekerja" : "mesin siap"}
            </span>
            <button
              onClick={resetAll}
              title="Mulai racikan baru dari nol"
              className="flex items-center gap-2 text-xs font-semibold text-ink-300 hover:text-ember-400 border border-ink-600 hover:border-ember-500/60 rounded-lg px-3.5 py-2 transition-colors"
            >
              <Icon name="refresh" className="w-3.5 h-3.5" /> racikan baru
            </button>
          </div>
        </div>
      </header>

      {/* ===== panggung ===== */}
      {stage === "idle" && <IdleStage onPick={requestGenre} onCustom={requestCustom} />}

      {stage === "loading" && genre && (
        <div className="mx-auto max-w-2xl px-5 py-24 md:py-32">
          <div className="bg-ink-850 border border-ink-600 rounded-2xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-ink-700 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-ember-500 via-gold-400 to-aqua-400 transition-all duration-500" style={{ width: `${((msgIdx + 1) / LOADING_MSGS.length) * 100}%` }} />
            </div>
            <div className="inline-flex p-5 rounded-full border border-ink-600 text-ember-400 anim-spin-slow">
              <Icon name="nib" className="w-9 h-9" />
            </div>
            <h2 className="mt-6 font-display font-black text-2xl md:text-3xl text-fog">
              Mesin sedang mengarang untuk <em className="italic font-medium text-ember-400">{genre.label}</em>
            </h2>
            <p key={msgIdx} className="anim-drop mt-3 text-ink-300 font-manu italic text-lg">{LOADING_MSGS[msgIdx]}</p>
            <div className="mt-6 flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="ink-dot w-2.5 h-2.5 rounded-full bg-aqua-400" style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
            </div>
            <p className="mt-6 text-xs text-ink-400">
              Tiga proposal sedang diracik: judul, sinopsis, peta bab, dan para karakternya.
            </p>
          </div>
        </div>
      )}

      {stage === "options" && proposals && genre && (
        <OptionsStage
          genre={genre}
          proposals={proposals}
          onPick={pickProposal}
          onReroll={() => startRacik(genre.id)}
          onBack={() => setStage("idle")}
        />
      )}

      {stage === "blueprint" && sel && genre && (
        <BlueprintStage
          proposal={sel}
          genre={genre}
          onStartWriter={(n) => { setCur(n); setStage("writer"); }}
          onBackOptions={() => setStage("options")}
        />
      )}

      {stage === "writer" && sel && genre && (
        <WriterStage
          proposal={sel}
          genre={genre}
          texts={texts}
          cur={cur}
          onCur={setCur}
          onSave={saveChapter}
          onBackBlueprint={() => setStage("blueprint")}
        />
      )}

      {/* ===== footer ===== */}
      <footer className="mt-10 border-t border-ink-700 bg-ink-950/80">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-ink-800 border border-ink-600 rounded-md text-ember-400">
              <Icon name="nib" className="w-4 h-4" />
            </span>
            <span className="font-display font-bold text-fog">MesinKisah</span>
          </div>
          <p className="text-xs text-ink-400 leading-relaxed sm:ml-4 sm:mr-auto max-w-2xl">
            Mesin yang mengarang, rasa tetap punyamu. Semua hasil tulisan bebas disalin, direvisi,
            dan diakui sebagai kerjamu sendiri. Genre dewasa hanya memuat konten untuk pembaca 18 tahun ke atas.
          </p>
          <div className="text-xs text-ink-500 whitespace-nowrap">fiksi & nonfiksi · 15 genre · bab 10.000+ karakter</div>
        </div>
      </footer>

      {/* ===== gerbang 18+ ===== */}
      {adultGate && (
        <div className="fixed inset-0 z-50 bg-ink-950/85 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="anim-drop max-w-md w-full bg-ink-850 border border-ember-500/60 rounded-2xl p-8 text-center shadow-[0_40px_120px_-30px_rgba(255,92,56,0.4)]">
            <span className="inline-flex p-4 rounded-full bg-ember-500/15 border border-ember-500/50 text-ember-400">
              <Icon name="flame" className="w-9 h-9" />
            </span>
            <h3 className="mt-5 font-display font-black text-2xl text-fog">Genre Dewasa 18+</h3>
            <p className="mt-3 text-sm text-ink-200 leading-relaxed">
              Cerita di jalur ini memuat adegan dan bahasa dunia malam: seks, mabuk, judi, dan keputusan-keputusan
              yang diambil jam tiga pagi. Kontennya ditulis untuk pembaca dewasa, bukan untuk bahan bercandaan anak sekolah.
            </p>
            <p className="mt-3 text-xs text-ink-400">Dengan lanjut, kamu menyatakan sudah berusia 18 tahun atau lebih.</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setAdultGate(false)}
                className="flex-1 bg-ink-800 hover:bg-ink-700 border border-ink-600 text-ink-200 font-semibold rounded-lg py-3 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => { setAck(true); setAdultGate(false); if (pendingRef.current) startRacik(pendingRef.current); }}
                className="flex-1 bg-ember-500 hover:bg-ember-400 text-ink-950 font-bold rounded-lg py-3 transition-all active:scale-[0.97]"
              >
                Aku 18+, Lanjut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

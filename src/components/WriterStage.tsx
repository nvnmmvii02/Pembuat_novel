import { useEffect, useMemo, useRef, useState } from "react";
import type { GenreDef } from "../data/genres";
import type { ChapterOutline, Proposal } from "../engine/engine";
import { MIN_CHARS, chapterFile, writeChapter } from "../engine/engine";
import { Icon } from "./Icons";
import { copyText, downloadText, fmt, useCountUp } from "../lib/utils";

interface Props {
  proposal: Proposal;
  genre: GenreDef;
  texts: Record<number, string>;
  cur: number;
  onCur: (n: number) => void;
  onSave: (n: number, text: string) => void;
  onBackBlueprint: () => void;
}

interface Stream { n: number; full: string; shown: number; }

export function WriterStage({ proposal: p, genre, texts, cur, onCur, onSave, onBackBlueprint }: Props) {
  const [stream, setStream] = useState<Stream | null>(null);
  const [showBeats, setShowBeats] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const paperRef = useRef<HTMLDivElement>(null);

  const ch = useMemo<ChapterOutline>(() => p.chapters.find((c) => c.n === cur) ?? p.chapters[0], [p, cur]);
  const body = stream && stream.n === ch.n ? stream.full.slice(0, stream.shown) : texts[ch.n] ?? "";
  const eased = useCountUp(texts[ch.n]?.length ?? 0, 700);
  const counter = stream && stream.n === ch.n ? stream.shown : eased;
  const doneCount = Object.keys(texts).length;
  const streaming = stream !== null && stream.n === ch.n && stream.shown < stream.full.length;

  const write = (rewrite = false) => {
    if (streaming) return;
    const full = rewrite ? writeChapter(p, genre, ch, (Date.now() ^ (Math.random() * 1e9)) >>> 0) : writeChapter(p, genre, ch, (Date.now() * 7 + 13) >>> 0);
    setStream({ n: ch.n, full, shown: 0 });
    paperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!stream) return;
    if (stream.shown >= stream.full.length) {
      onSave(stream.n, stream.full);
      setStream(null);
      return;
    }
    timer.current = window.setTimeout(() => {
      setStream((s) => (s ? { ...s, shown: Math.min(s.full.length, s.shown + 90) } : s));
    }, 12);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [stream, onSave]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const paras = body ? body.split("\n\n") : [];
  const pct = stream && stream.n === ch.n ? Math.round((stream.shown / stream.full.length) * 100) : texts[ch.n] ? 100 : 0;

  const doCopy = async () => {
    const t = texts[ch.n];
    if (!t) return;
    const ok = await copyText(chapterFile(p, ch, t));
    setToast(ok ? "Bab tersalin ke papan klip" : "Gagal menyalin, coba lagi");
  };

  const doDownload = () => {
    const t = texts[ch.n];
    if (!t) return;
    downloadText(`bab-${String(ch.n).padStart(2, "0")}.txt`, chapterFile(p, ch, t));
    setToast("Bab diunduh sebagai .txt");
  };

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-8">
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* ===== sidebar bab ===== */}
        <aside className="lg:col-span-3 lg:sticky lg:top-6">
          <button onClick={onBackBlueprint} className="flex items-center gap-2 text-sm text-ink-300 hover:text-fog transition-colors">
            <Icon name="back" className="w-4 h-4" /> cetak biru
          </button>
          <div className="mt-4 bg-ink-850 border border-ink-600 rounded-xl p-5">
            <div className="font-display font-bold text-lg text-fog leading-tight">{p.titles[p.titleIdx]}</div>
            <div className="mt-1 text-xs text-ink-400">{genre.label} · {p.chapterCount} bab</div>
            <div className="mt-4">
              <div className="flex justify-between text-[11px] text-ink-300 mb-1.5">
                <span>progres menulis</span>
                <span className="text-aqua-400 font-bold">{doneCount}/{p.chapterCount}</span>
              </div>
              <div className="h-2 bg-ink-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-aqua-500 to-aqua-300 rounded-full transition-all duration-700" style={{ width: `${(doneCount / p.chapterCount) * 100}%` }} />
              </div>
            </div>
            <div className="mt-4 max-h-[46vh] overflow-y-auto pr-1 space-y-1">
              {p.chapters.map((c) => {
                const done = Boolean(texts[c.n]);
                const active = c.n === ch.n;
                return (
                  <button
                    key={c.n}
                    onClick={() => onCur(c.n)}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${
                      active ? "bg-ember-500/15 border border-ember-500/50 text-fog" : "border border-transparent hover:bg-ink-800 text-ink-300"
                    }`}
                  >
                    <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      done ? "bg-aqua-500 text-ink-950" : active ? "bg-ember-500 text-ink-950" : "bg-ink-700 text-ink-300"
                    }`}>
                      {done ? <Icon name="check" className="w-3 h-3" /> : c.n}
                    </span>
                    <span className="truncate flex-1">{c.title}</span>
                    {c.adult && <span className="text-[8px] font-bold text-ember-400">18+</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ===== naskah ===== */}
        <main className="lg:col-span-9">
          <div className="bg-ink-850 border border-ink-600 rounded-xl p-4 flex flex-wrap items-center gap-2.5">
            <div className="mr-auto">
              <div className="text-[11px] tracking-[0.25em] uppercase text-ink-400">Bab {ch.n} dari {p.chapterCount}</div>
              <div className="font-display font-bold text-xl text-fog">{ch.title}</div>
            </div>
            {streaming ? (
              <>
                <span className="text-xs text-ink-300 font-mono">{pct}%</span>
                <button
                  onClick={() => stream && setStream({ ...stream, shown: stream.full.length })}
                  className="flex items-center gap-2 bg-ink-800 hover:bg-ink-700 border border-ink-600 text-fog rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
                >
                  <Icon name="skip" className="w-4 h-4 text-gold-400" /> Lewati
                </button>
              </>
            ) : texts[ch.n] ? (
              <>
                <button onClick={() => write(true)} className="flex items-center gap-2 bg-ink-800 hover:bg-ink-700 border border-ink-600 hover:border-gold-400 text-fog rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors">
                  <Icon name="refresh" className="w-4 h-4 text-gold-400" /> Tulis Ulang
                </button>
                <button onClick={doCopy} className="flex items-center gap-2 bg-ink-800 hover:bg-ink-700 border border-ink-600 hover:border-aqua-400 text-fog rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors">
                  <Icon name="copy" className="w-4 h-4 text-aqua-400" /> Salin
                </button>
                <button onClick={doDownload} className="flex items-center gap-2 bg-ink-800 hover:bg-ink-700 border border-ink-600 hover:border-aqua-400 text-fog rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors">
                  <Icon name="download" className="w-4 h-4 text-aqua-400" /> Unduh
                </button>
              </>
            ) : (
              <button
                onClick={() => write(false)}
                className="flex items-center gap-2.5 bg-ember-500 hover:bg-ember-400 text-ink-950 font-bold rounded-lg px-6 py-3 transition-all active:scale-[0.97] shadow-[0_8px_30px_-8px_rgba(255,92,56,0.6)]"
              >
                <Icon name="play" className="w-4 h-4" /> Tulis Bab Ini
              </button>
            )}
            <button
              onClick={() => setShowBeats((v) => !v)}
              className={`flex items-center gap-2 border rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                showBeats ? "bg-aqua-500/15 border-aqua-500/60 text-aqua-300" : "bg-ink-800 border-ink-600 text-ink-300 hover:text-fog"
              }`}
            >
              <Icon name="layers" className="w-4 h-4" /> Kerangka
            </button>
          </div>

          {/* info bab + penghitung */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink-300">
            <span className="flex items-center gap-1.5"><Icon name="users" className="w-3.5 h-3.5" /> sudut pandang: <strong className="text-fog">{ch.pov}</strong></span>
            <span className="flex items-center gap-1.5"><Icon name="home" className="w-3.5 h-3.5" /> {ch.location}</span>
            <span className={`ml-auto flex items-center gap-2 font-mono ${texts[ch.n] ? "text-aqua-400" : "text-ink-400"}`}>
              {streaming && <span className="w-2 h-2 rounded-full bg-ember-500 anim-breathe" />}
              <strong className="text-base">{fmt(counter)}</strong> karakter
              {texts[ch.n] && texts[ch.n].length >= MIN_CHARS && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-aqua-500/15 border border-aqua-500/50 text-aqua-300 rounded px-2 py-0.5">
                  <Icon name="check" className="w-3 h-3" /> target 10.000 tercapai
                </span>
              )}
            </span>
          </div>

          {/* kerangka bab */}
          {showBeats && (
            <div className="mt-3 anim-drop bg-ink-900 border border-ink-700 rounded-xl p-5">
              <div className="text-[11px] tracking-[0.25em] uppercase text-ink-400 mb-3">Kerangka yang dipakai mesin untuk bab ini</div>
              <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                {ch.beats.map((b, j) => (
                  <li key={j} className="flex gap-2.5 text-[13px] text-ink-200">
                    <span className="text-ember-500 font-mono shrink-0">{String(j + 1).padStart(2, "0")}</span>
                    {b.desc}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* kertas naskah */}
          <div ref={paperRef} className="mt-4 manu manu-lines rounded-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-ember-500 via-gold-400 to-aqua-500" />
            <div className="px-6 sm:px-12 md:px-16 py-10 md:py-14 min-h-[420px]">
              <div className="text-center border-b border-paperink/15 pb-6 mb-8">
                <div className="text-[11px] tracking-[0.4em] uppercase text-paperink-2">Bab {ch.n}</div>
                <h2 className="mt-2 font-display italic font-bold text-3xl md:text-4xl text-paperink">{ch.title}</h2>
                <div className="mt-2 text-xs text-paperink-2 font-body">
                  sudut pandang {ch.pov} · {ch.location}{ch.adult ? " · bab dewasa" : ""}
                </div>
              </div>

              {paras.length === 0 && !streaming ? (
                <div className="py-16 text-center">
                  <span className="inline-flex p-5 rounded-full border-2 border-dashed border-paperink/25 text-paperink-2">
                    <Icon name="pen" className="w-10 h-10" />
                  </span>
                  <p className="mt-6 font-body text-paperink-2 max-w-md mx-auto leading-relaxed">
                    Bab ini masih kosong. Begitu kamu pencet <strong className="text-paperink">Tulis Bab Ini</strong>,
                    mesin akan menuang sekitar sebelas ribu karakter ke halaman ini, mengikuti kerangka di atas.
                  </p>
                </div>
              ) : (
                <div className="font-manu text-[17.5px] leading-[1.9] text-paperink">
                  {paras.map((par, i) => (
                    <p key={i} className={`mb-6 ${i === 0 ? "dropcap" : ""}`}>
                      {par}
                      {streaming && i === paras.length - 1 && (
                        <span className="caret-blink inline-block w-[3px] h-[1.1em] bg-ember-600 align-[-0.2em] ml-0.5" />
                      )}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* navigasi bab */}
          <div className="mt-5 flex items-center justify-between">
            <button
              disabled={ch.n <= 1}
              onClick={() => onCur(ch.n - 1)}
              className="flex items-center gap-2 bg-ink-850 border border-ink-600 text-fog rounded-lg px-5 py-3 text-sm font-semibold transition-all enabled:hover:border-aqua-400 disabled:opacity-40"
            >
              <Icon name="back" className="w-4 h-4" /> Bab {Math.max(1, ch.n - 1)}
            </button>
            <div className="text-xs text-ink-400 hidden sm:block">
              tiap bab ditulis mandiri · salin atau unduh sebelum pindah
            </div>
            <button
              disabled={ch.n >= p.chapterCount}
              onClick={() => onCur(ch.n + 1)}
              className="flex items-center gap-2 bg-ink-850 border border-ink-600 text-fog rounded-lg px-5 py-3 text-sm font-semibold transition-all enabled:hover:border-aqua-400 disabled:opacity-40"
            >
              Bab {Math.min(p.chapterCount, ch.n + 1)} <Icon name="chevron" className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 anim-drop bg-ink-800 border border-aqua-500/60 text-aqua-300 rounded-lg px-5 py-3 text-sm font-semibold shadow-xl flex items-center gap-2">
          <Icon name="check" className="w-4 h-4" /> {toast}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import type { GenreDef } from "../data/genres";
import type { Proposal } from "../engine/engine";
import { blueprintFile } from "../engine/engine";
import { Icon } from "./Icons";
import { downloadText, useRevealOnMount } from "../lib/utils";

const AVATAR = ["bg-ember-500", "bg-aqua-500", "bg-gold-500", "bg-ink-500", "bg-ember-400", "bg-aqua-400"];

interface Props {
  proposal: Proposal;
  genre: GenreDef;
  onStartWriter: (chapter: number) => void;
  onBackOptions: () => void;
}

export function BlueprintStage({ proposal: p, genre, onStartWriter, onBackOptions }: Props) {
  const [open, setOpen] = useState<number | null>(1);
  useRevealOnMount([p]);
  const labels = genre.fiction
    ? { desire: "Ingin", flaw: "Cacat", secret: "Rahasia", arc: "Arah" }
    : { desire: "Masalah", flaw: "Kebiasaan keliru", secret: "Titik balik", arc: "Hasil" };
  const title = p.titles[p.titleIdx];

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-10 pb-32">
      {/* kepala cetak biru */}
      <div className="reveal relative">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <button onClick={onBackOptions} className="flex items-center gap-2 text-sm text-ink-300 hover:text-fog transition-colors">
              <Icon name="back" className="w-4 h-4" /> kembali ke proposal
            </button>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className={`text-[11px] font-bold tracking-widest uppercase rounded px-3 py-1.5 ${genre.mature ? "bg-ember-500 text-ink-950" : "bg-aqua-500/15 text-aqua-400 border border-aqua-500/40"}`}>
                {genre.label}
              </span>
              <span className="text-[11px] text-ink-300 border border-ink-600 rounded px-3 py-1.5">{p.chapterCount} bab</span>
              <span className="text-[11px] text-ink-300 border border-ink-600 rounded px-3 py-1.5">latar: {p.city}</span>
              {genre.mature && (
                <span className="text-[11px] text-ember-300 border border-ember-500/40 rounded px-3 py-1.5">berisi seks, alkohol, dan perjudian</span>
              )}
            </div>
            <h1 className="mt-4 font-display font-black text-4xl md:text-6xl text-fog leading-[1.02] max-w-3xl">{title}</h1>
            <p className="mt-4 max-w-2xl font-manu italic text-lg text-gold-300">{p.logline}</p>
          </div>
          <div className="stamp-in hidden sm:block shrink-0 select-none border-[3px] border-ember-500/80 text-ember-400 rounded-lg px-5 py-3 text-center">
            <div className="font-display font-black text-lg tracking-[0.2em]">CETAK BIRU</div>
            <div className="text-[10px] tracking-[0.35em]">SIAP DITULIS</div>
          </div>
        </div>
      </div>

      {/* sinopsis + janji */}
      <div className="mt-10 grid lg:grid-cols-3 gap-5">
        <div className="reveal lg:col-span-2 bg-ink-850 border border-ink-600 border-l-4 border-l-ember-500 rounded-xl p-6 md:p-8">
          <div className="text-[11px] tracking-[0.3em] uppercase text-ink-400 mb-4">Sinopsis resmi</div>
          <div className="space-y-4">
            {p.synopsis.map((s, i) => (
              <p key={i} className="font-manu text-[17px] leading-8 text-ink-100">{s}</p>
            ))}
          </div>
        </div>
        <div className="reveal bg-ink-850 border border-ink-600 rounded-xl p-6" style={{ transitionDelay: "120ms" }}>
          <div className="text-[11px] tracking-[0.3em] uppercase text-ink-400 mb-4">Janji mesin ke pembaca</div>
          <ul className="space-y-3.5">
            {p.promises.map((pr) => (
              <li key={pr} className="flex gap-3 text-sm text-ink-200 leading-relaxed">
                <Icon name="check" className="w-4 h-4 text-aqua-400 shrink-0 mt-0.5" />
                {pr}
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-ink-700 pt-4">
            <div className="text-[11px] tracking-[0.3em] uppercase text-ink-400 mb-2.5">Napas cerita</div>
            <div className="flex flex-wrap gap-1.5">
              {p.themes.map((t) => (
                <span key={t} className="text-xs bg-ink-800 border border-ink-600 text-aqua-300 rounded-full px-3 py-1.5">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* peta babak */}
      <div className="reveal mt-10">
        <div className="text-[11px] tracking-[0.3em] uppercase text-ink-400 mb-4">Peta perjalanan bab</div>
        <div className="grid md:grid-cols-4 gap-3 relative">
          <div className="hidden md:block absolute top-[22px] left-[12%] right-[12%] h-px bg-ink-600" />
          {p.arcs.map((a, i) => (
            <div key={a.range} className="relative bg-ink-850 border border-ink-600 rounded-xl p-5 lift hover:border-aqua-400/60">
              <div className="flex items-center gap-3">
                <span className="relative z-10 w-9 h-9 rounded-full bg-ink-700 border-2 border-aqua-400 text-aqua-300 font-display font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-gold-400">{a.range}</div>
                  <div className="font-bold text-fog">{a.name}</div>
                </div>
              </div>
              <p className="mt-3 text-[13px] text-ink-300 leading-relaxed">{a.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* dossier karakter */}
      <div className="reveal mt-12">
        <div className="flex items-end justify-between flex-wrap gap-2 mb-4">
          <div className="text-[11px] tracking-[0.3em] uppercase text-ink-400">Dossier {genre.fiction ? "karakter" : "sumber & kasus"}</div>
          <div className="text-xs text-ink-400 flex items-center gap-2"><Icon name="users" className="w-4 h-4" />{p.characters.length} nama terdaftar</div>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {p.characters.map((c, i) => (
            <div key={c.name} className="lift bg-ink-850 border border-ink-600 hover:border-gold-400/60 rounded-xl p-5">
              <div className="flex items-center gap-4">
                <span className={`w-12 h-12 rounded-full ${AVATAR[i % AVATAR.length]} text-ink-950 font-display font-black text-lg flex items-center justify-center`}>
                  {c.name.charAt(0)}
                </span>
                <div>
                  <div className="font-display font-bold text-xl text-fog">{c.name}</div>
                  <div className="text-xs text-ink-300">{c.age} tahun · {c.job}</div>
                </div>
                <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-gold-400 border border-gold-500/40 rounded px-2 py-1">
                  {c.role}
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-[13px]">
                {(["desire", "flaw", "secret", "arc"] as const).map((k) => (
                  <div key={k} className="flex gap-2 leading-snug">
                    <dt className={`shrink-0 w-24 font-bold ${k === "secret" ? "text-ember-400" : "text-ink-400"}`}>{labels[k]}</dt>
                    <dd className="text-ink-200">{c[k]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>

      {/* daftar bab */}
      <div className="reveal mt-12">
        <div className="flex items-end justify-between flex-wrap gap-2 mb-4">
          <div className="text-[11px] tracking-[0.3em] uppercase text-ink-400">Kerangka {p.chapters.length} bab</div>
          <div className="text-xs text-ink-400">klik untuk membuka isi kerangka</div>
        </div>
        <div className="border border-ink-600 rounded-xl overflow-hidden divide-y divide-ink-700 bg-ink-850/60">
          {p.chapters.map((c) => {
            const isOpen = open === c.n;
            return (
              <div key={c.n}>
                <button
                  onClick={() => setOpen(isOpen ? null : c.n)}
                  className={`w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors ${isOpen ? "bg-ink-800" : "hover:bg-ink-800/60"}`}
                >
                  <span className={`font-display italic font-bold text-lg w-12 shrink-0 ${isOpen ? "text-ember-400" : "text-ink-400"}`}>
                    {String(c.n).padStart(2, "0")}
                  </span>
                  <span className="font-semibold text-fog flex-1 truncate">{c.title}</span>
                  {c.adult && <span className="text-[9px] font-bold bg-ember-500 text-ink-950 rounded px-1.5 py-0.5">18+</span>}
                  <span className="hidden md:inline text-xs text-ink-400 truncate max-w-[220px]">{c.pov} · {c.location}</span>
                  <Icon name="chevron" className={`w-4 h-4 text-ink-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 pl-[76px] anim-drop">
                    <div className="text-xs text-ink-400 mb-2 md:hidden">{c.pov} · {c.location}</div>
                    <ol className="space-y-1.5">
                      {c.beats.map((b, j) => (
                        <li key={j} className="flex gap-2.5 text-[13px] text-ink-200">
                          <span className="text-ember-500 font-mono shrink-0">{String(j + 1).padStart(2, "0")}</span>
                          {b.desc}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* bilah aksi */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink-700 bg-ink-950/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-3.5 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onStartWriter(1)}
            className="flex items-center gap-2.5 bg-ember-500 hover:bg-ember-400 text-ink-950 font-bold rounded-lg px-6 py-3 transition-all active:scale-[0.97] shadow-[0_8px_30px_-8px_rgba(255,92,56,0.6)]"
          >
            <Icon name="pen" className="w-5 h-5" /> Gas Tulis Bab 1
          </button>
          <button
            onClick={() => downloadText(`cetak-biru-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`, blueprintFile(p, genre))}
            className="flex items-center gap-2 bg-ink-800 hover:bg-ink-700 border border-ink-600 text-fog font-semibold rounded-lg px-5 py-3 transition-all active:scale-[0.97]"
          >
            <Icon name="download" className="w-4 h-4 text-aqua-400" /> Unduh Blueprint
          </button>
          <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-ink-400">
            <Icon name="spark" className="w-4 h-4 text-gold-400" />
            kerangka terkunci · mesin siap menulis kapan saja
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import type { GenreDef } from "../data/genres";
import type { Proposal } from "../engine/engine";
import { Icon } from "./Icons";
import { useRevealOnMount } from "../lib/utils";

const ACCENTS = [
  { border: "hover:border-ember-500", top: "bg-ember-500", text: "text-ember-400", btn: "bg-ember-500 hover:bg-ember-400", ring: "border-ember-500/50" },
  { border: "hover:border-aqua-400", top: "bg-aqua-500", text: "text-aqua-400", btn: "bg-aqua-500 hover:bg-aqua-400", ring: "border-aqua-400/50" },
  { border: "hover:border-gold-400", top: "bg-gold-500", text: "text-gold-400", btn: "bg-gold-500 hover:bg-gold-400", ring: "border-gold-400/50" },
];

interface Props {
  genre: GenreDef;
  proposals: Proposal[];
  onPick: (idx: number, titleIdx: number) => void;
  onReroll: () => void;
  onBack: () => void;
}

export function OptionsStage({ genre, proposals, onPick, onReroll, onBack }: Props) {
  const [titleIdx, setTitleIdx] = useState<number[]>([0, 0, 0]);
  useRevealOnMount([proposals]);

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="reveal">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-ink-300 hover:text-fog transition-colors">
            <Icon name="back" className="w-4 h-4" /> ganti genre
          </button>
          <h1 className="mt-3 font-display font-black text-3xl md:text-5xl text-fog">
            Tiga proposal <em className="italic font-medium text-aqua-400">di atas meja.</em>
          </h1>
          <p className="mt-2 text-ink-300 max-w-2xl">
            Mesin meracik tiga arah berbeda untuk genre <strong className="text-fog">{genre.label}</strong>.
            Ganti judul sesukamu, baca sinopsis dan peta babnya, lalu kunci salah satu.
          </p>
        </div>
        <div className="reveal flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-2 text-xs border border-ink-600 rounded-full px-4 py-2 text-ink-300">
            <span className={`w-2 h-2 rounded-full ${genre.mature ? "bg-ember-500" : "bg-aqua-400"}`} />
            {genre.label}{genre.mature ? " · khusus dewasa" : ""}
          </span>
          <button
            onClick={onReroll}
            className="group flex items-center gap-2.5 bg-ink-800 hover:bg-ink-700 border border-ink-600 hover:border-gold-400 text-fog font-semibold rounded-lg px-5 py-3 transition-all active:scale-95"
          >
            <Icon name="dice" className="w-5 h-5 text-gold-400 group-hover:rotate-12 transition-transform" />
            Acak Ulang Semua
          </button>
        </div>
      </div>

      <div className="mt-10 grid lg:grid-cols-3 gap-5 items-stretch">
        {proposals.map((p, i) => {
          const a = ACCENTS[i % 3];
          const ti = titleIdx[i];
          return (
            <article
              key={p.seed}
              style={{ transitionDelay: `${i * 110}ms` }}
              className={`reveal lift flex flex-col bg-ink-850 border border-ink-600 rounded-xl overflow-hidden ${a.border}`}
            >
              <div className={`h-1.5 ${a.top}`} />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between">
                  <span className={`font-display italic font-black text-5xl title-outline`}>0{i + 1}</span>
                  <div className="flex flex-wrap justify-end gap-1.5 max-w-[55%]">
                    {p.themes.map((t) => (
                      <span key={t} className="text-[10px] uppercase tracking-wider text-ink-300 border border-ink-600 rounded-full px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2">
                  <h2 className={`font-display font-bold text-[22px] leading-tight text-fog ${ti > 0 ? "anim-drop" : ""}`} key={`${p.seed}-${ti}`}>
                    {p.titles[ti]}
                  </h2>
                  <button
                    onClick={() => setTitleIdx((arr) => arr.map((v, j) => (j === i ? (v + 1) % p.titles.length : v)))}
                    title="Ganti opsi judul"
                    className={`shrink-0 mt-1 p-1.5 rounded-md border border-ink-600 hover:border-gold-400 hover:text-gold-400 text-ink-300 transition-colors`}
                  >
                    <Icon name="refresh" className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-1 text-[11px] text-ink-400">
                  opsi judul {ti + 1} dari {p.titles.length}
                </div>

                <p className={`mt-4 text-sm italic leading-relaxed ${a.text} font-manu text-[15px]`}>{p.logline}</p>

                <div className="mt-4 space-y-3">
                  {p.synopsis.map((s, j) => (
                    <p key={j} className="text-[13.5px] leading-relaxed text-ink-200">{s}</p>
                  ))}
                </div>

                <div className="mt-5 border-t border-ink-700 pt-4">
                  <div className="text-[11px] tracking-[0.25em] uppercase text-ink-400 mb-3">Dari bab ke bab, arahnya begini</div>
                  <div className="space-y-2.5">
                    {p.arcs.map((arc) => (
                      <div key={arc.range} className="flex gap-3">
                        <span className={`shrink-0 h-fit text-[10px] font-bold rounded border ${a.ring} ${a.text} px-2 py-1 whitespace-nowrap`}>
                          {arc.range}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-fog">{arc.name}</div>
                          <div className="text-xs text-ink-300 leading-relaxed">{arc.summary}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-ink-700 pt-4">
                  <div className="text-[11px] tracking-[0.25em] uppercase text-ink-400 mb-2.5">Pemainnya</div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.characters.map((c) => (
                      <span key={c.name} className="text-xs bg-ink-800 border border-ink-600 rounded-full px-2.5 py-1 text-ink-200">
                        {c.name.split(" ")[0]} <span className="text-ink-400">· {c.role}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] text-ink-300">
                  <div className="bg-ink-800/70 border border-ink-700 rounded-lg py-2.5">
                    <div className={`font-display font-bold text-lg ${a.text}`}>{p.chapterCount}</div>bab
                  </div>
                  <div className="bg-ink-800/70 border border-ink-700 rounded-lg py-2.5">
                    <div className={`font-display font-bold text-lg ${a.text}`}>10rb+</div>karakter/bab
                  </div>
                  <div className="bg-ink-800/70 border border-ink-700 rounded-lg py-2.5">
                    <div className={`font-display font-bold text-lg ${a.text}`}>{p.city.split(" ")[0]}</div>latar kota
                  </div>
                </div>

                <button
                  onClick={() => onPick(i, ti)}
                  className={`mt-6 w-full ${a.btn} text-ink-950 font-bold rounded-lg py-3.5 transition-all active:scale-[0.97] flex items-center justify-center gap-2`}
                >
                  Pakai Proposal Ini <Icon name="chevron" className="w-4 h-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <p className="reveal mt-8 text-center text-xs text-ink-400">
        Belum ada yang cocok? Acak ulang. Mesin tidak pernah kehabisan ide, cuma kadang idenya kelewat liar.
      </p>
    </div>
  );
}

import { useEffect, useState } from "react";
import { GENRES, matchCustomGenre } from "../data/genres";
import { TICKER_LINES } from "../data/world";
import { Icon } from "./Icons";
import { useRevealOnMount } from "../lib/utils";

const SPANS_FIKSI: Record<string, string> = {
  romansa: "md:col-span-3", horor: "md:col-span-3", thriller: "md:col-span-2", misteri: "md:col-span-2",
  fantasi: "md:col-span-2", scifi: "md:col-span-2", drama: "md:col-span-2", komedi: "md:col-span-2",
  aksi: "md:col-span-2", dewasa: "md:col-span-4",
};
const SPANS_NF: Record<string, string> = {
  selfhelp: "md:col-span-2", bisnis: "md:col-span-2", sains: "md:col-span-2", sejarah: "md:col-span-3", truecrime: "md:col-span-3",
};

const SAMPLES = [
  {
    genre: "Thriller", tone: "ember",
    title: "Empat Jam yang Hilang",
    syn: "Seorang auditor forensik jadi satu-satunya saksi sebuah kecelakaan di gudang pelabuhan. Masalahnya, ingatannya terpotong tepat di empat jam yang paling menentukan, dan seseorang rutin mengirim foto dirinya sedang tidur.",
  },
  {
    genre: "Romansa", tone: "aqua",
    title: "Segala yang Tidak Kita Bicarakan",
    syn: "Laras akhirnya pulang ke kota kecilnya untuk menjual rumah nenek. Di kedai kopi yang sama, Bara masih duduk di meja yang sama, dengan surat yang tujuh tahun tidak pernah ia kirim.",
  },
  {
    genre: "Dewasa 18+", tone: "gold",
    title: "Pulang Pagi",
    syn: "Penyanyi bar jazz itu tahu rahasia semua tamu VIP. Sampai suatu malam, rahasia terbesar duduk di meja paling depan, memesan lagu yang sama, dan menawarinya satu malam yang tidak masuk akal.",
  },
];

const TONE_COLOR: Record<string, string> = {
  ember: "border-ember-500/60 text-ember-400",
  aqua: "border-aqua-500/60 text-aqua-400",
  gold: "border-gold-500/60 text-gold-400",
};

interface Props {
  onPick: (genreId: string) => void;
  onCustom: (text: string) => void;
}

export function IdleStage({ onPick, onCustom }: Props) {
  const [tab, setTab] = useState<"fiksi" | "nonfiksi">("fiksi");
  const [query, setQuery] = useState("");
  const [sample, setSample] = useState(0);
  useRevealOnMount([]);

  useEffect(() => {
    const t = setInterval(() => setSample((s) => (s + 1) % SAMPLES.length), 4200);
    return () => clearInterval(t);
  }, []);

  const submitCustom = () => {
    const q = query.trim();
    if (!q) return;
    onCustom(q);
  };

  const list = GENRES.filter((g) => (tab === "fiksi" ? g.fiction : !g.fiction));

  return (
    <div className="relative">
      {/* ============ pembuka: meja racik ============ */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-10 md:pt-16 pb-10">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <div className="reveal flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase text-ink-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-aqua-400 opacity-60 anim-breathe" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-aqua-400" />
              </span>
              Studio cerita otomatis · mesin narasi v1.0
            </div>

            <h1 className="reveal mt-6 font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[0.98] text-fog">
              Ketik <em className="italic font-medium text-ember-400">genrenya.</em>
              <br />
              Mesin yang <span className="underline decoration-aqua-400 decoration-[6px] underline-offset-[10px]">gila kerja.</span>
            </h1>

            <p className="reveal mt-6 max-w-xl text-ink-200 text-base md:text-lg leading-relaxed">
              Kamu cukup sebut genre. Mesin langsung menyodorkan <strong className="text-fog">tiga proposal</strong>:
              pilihan judul, sinopsis, peta cerita dari bab awal sampai akhir, plus deretan karakter lengkap
              dengan rahasia masing-masing. Setuju? Mesin menulis babnya, minimal{" "}
              <strong className="text-fog">10.000 karakter</strong> per bab, dengan bahasa yang mengalir seperti
              ditulis orang, bukan diterjemahkan robot.
            </p>

            <div className="reveal mt-8 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitCustom()}
                  placeholder='Genre apa hari ini? Contoh: "horor psikologis" atau "bisnis startup"'
                  className="w-full bg-ink-850 border border-ink-600 focus:border-ember-500 rounded-lg pl-12 pr-4 py-4 text-fog placeholder:text-ink-400 outline-none transition-colors text-base"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-ember-400 transition-colors">
                  <Icon name="nib" className="w-5 h-5" />
                </span>
              </div>
              <button
                onClick={submitCustom}
                className="group bg-ember-500 hover:bg-ember-400 active:scale-[0.97] text-ink-950 font-bold rounded-lg px-7 py-4 transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_-8px_rgba(255,92,56,0.55)]"
              >
                Racik Cerita
                <Icon name="chevron" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="reveal mt-5 flex flex-wrap items-center gap-2 text-xs text-ink-300">
              <span className="text-ink-400">Coba cepat:</span>
              {["thriller psikologis", "romansa", "dunia malam 18+", "true crime", "fantasi naga"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); }}
                  className="px-3 py-1.5 rounded-full border border-ink-600 hover:border-aqua-400 hover:text-aqua-300 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="reveal mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink-700 pt-6 text-sm">
              <div><span className="font-display font-bold text-2xl text-fog">15</span> <span className="text-ink-300">genre siap racik</span></div>
              <div className="w-px h-8 bg-ink-700 hidden sm:block" />
              <div><span className="font-display font-bold text-2xl text-aqua-400">3</span> <span className="text-ink-300">proposal tiap racikan</span></div>
              <div className="w-px h-8 bg-ink-700 hidden sm:block" />
              <div><span className="font-display font-bold text-2xl text-gold-400">10rb+</span> <span className="text-ink-300">karakter per bab</span></div>
            </div>
          </div>

          {/* tumpukan contoh proposal */}
          <div className="lg:col-span-5 reveal">
            <div className="relative h-[360px] sm:h-[340px]" aria-hidden="true">
              {SAMPLES.map((s, i) => {
                const rel = (i - sample + SAMPLES.length) % SAMPLES.length;
                const style: React.CSSProperties =
                  rel === 0
                    ? { transform: "rotate(-1.5deg) translateY(0)", opacity: 1, zIndex: 3 }
                    : rel === 1
                      ? { transform: "rotate(2.5deg) translateY(18px) translateX(14px)", opacity: 0.75, zIndex: 2 }
                      : { transform: "rotate(-4deg) translateY(36px) translateX(-10px)", opacity: 0.45, zIndex: 1 };
                return (
                  <div
                    key={s.title}
                    className="absolute inset-0 bg-ink-850 border border-ink-600 rounded-xl p-6 transition-all duration-700 ease-[cubic-bezier(0.2,0.7,0.3,1)] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)]"
                    style={style}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] tracking-[0.25em] uppercase border rounded-full px-3 py-1 ${TONE_COLOR[s.tone]}`}>
                        Proposal · {s.genre}
                      </span>
                      <Icon name="nib" className="w-4 h-4 text-ink-400" />
                    </div>
                    <h3 className="mt-5 font-display italic font-bold text-2xl md:text-[27px] text-fog leading-tight">{s.title}</h3>
                    <p className="mt-4 text-sm text-ink-200 leading-relaxed font-manu">{s.syn}</p>
                    <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-[11px] text-ink-400">
                      <span>20 bab · target 10.400 karakter/bab</span>
                      <span className="flex items-center gap-1 text-aqua-400"><Icon name="spark" className="w-3.5 h-3.5" /> baru diracik</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-center text-xs text-ink-400">
              Contoh proposal yang baru keluar dari mesin. Punyamu akan beda. Selalu beda.
            </p>
          </div>
        </div>
      </section>

      {/* ============ rak genre ============ */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-14">
        <div className="reveal flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-ink-400">Rak genre</div>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-fog mt-1">
              Pilih jalur ceritamu<span className="text-ember-400">.</span>
            </h2>
          </div>
          <div className="flex rounded-lg border border-ink-600 overflow-hidden text-sm">
            {(["fiksi", "nonfiksi"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2.5 font-semibold capitalize transition-colors ${
                  tab === t ? "bg-fog text-ink-950" : "bg-transparent text-ink-300 hover:text-fog"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3.5">
          {list.map((g, idx) => {
            const spans = tab === "fiksi" ? SPANS_FIKSI[g.id] : SPANS_NF[g.id];
            const isAdult = g.mature;
            return (
              <button
                key={g.id}
                onClick={() => onPick(g.id)}
                style={{ transitionDelay: `${idx * 40}ms` }}
                className={`reveal lift group relative text-left rounded-xl border p-5 md:p-6 col-span-1 ${spans ?? "md:col-span-2"} ${
                  isAdult
                    ? "bg-gradient-to-br from-[#241014] to-ink-850 border-ember-500/50 hover:border-ember-400 hover:shadow-[0_18px_50px_-18px_rgba(255,92,56,0.5)]"
                    : "bg-ink-850/80 border-ink-600 hover:border-aqua-400/70 hover:shadow-[0_18px_50px_-20px_rgba(78,217,198,0.35)]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`inline-flex p-2.5 rounded-lg border ${isAdult ? "text-ember-400 border-ember-500/40 bg-ember-500/10" : "text-aqua-400 border-ink-600 bg-ink-800 group-hover:border-aqua-400/50"} transition-colors`}>
                    <Icon name={g.icon} className="w-6 h-6" />
                  </span>
                  {isAdult && (
                    <span className="text-[10px] font-bold tracking-widest bg-ember-500 text-ink-950 rounded px-2 py-1">18+</span>
                  )}
                </div>
                <h3 className="mt-4 font-display font-bold text-xl md:text-2xl text-fog">{g.label}</h3>
                <p className="mt-1.5 text-sm text-ink-300 leading-snug">{g.desc}</p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink-400">
                  <span className="flex items-center gap-1.5"><Icon name="book" className="w-3.5 h-3.5" />{g.chapters[0]} sampai {g.chapters[1]} bab</span>
                  <span className="flex items-center gap-1.5"><Icon name="layers" className="w-3.5 h-3.5" />{g.tones.join(" + ")}</span>
                </div>
                <span className={`absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 ${isAdult ? "text-ember-400" : "text-aqua-400"}`}>
                  <Icon name="chevron" className="w-5 h-5" />
                </span>
              </button>
            );
          })}

          <button
            onClick={submitCustom}
            className="reveal col-span-1 md:col-span-2 rounded-xl border-2 border-dashed border-ink-600 hover:border-gold-400 text-left p-5 md:p-6 transition-colors group bg-transparent"
          >
            <span className="inline-flex p-2.5 rounded-lg border border-ink-600 text-gold-400 bg-ink-800">
              <Icon name="pen" className="w-6 h-6" />
            </span>
            <h3 className="mt-4 font-display font-bold text-xl md:text-2xl text-fog">Genre campur aduk?</h3>
            <p className="mt-1.5 text-sm text-ink-300">
              Ketik di kolom atas, misal "horor komedi" atau "sejarah kuliner". Mesin akan mencari jalur terdekatnya.
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity">
              pakai kata kunci yang tadi kamu ketik <Icon name="chevron" className="w-4 h-4" />
            </span>
          </button>
        </div>
      </section>

      {/* ============ cara kerja singkat ============ */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-16">
        <div className="reveal rounded-xl border border-ink-700 bg-ink-900/70 p-6 md:p-8 grid md:grid-cols-4 gap-6">
          {[
            { n: "01", t: "Sebut genre", d: "Satu kata cukup. Mesin menebak sisanya dari ribuan pola cerita." },
            { n: "02", t: "Timbang 3 proposal", d: "Judul, sinopsis, dan arah bab demi bab. Tidak sreg? Acak ulang sepuasnya." },
            { n: "03", t: "Kunci cetak biru", d: "Karakter, rahasia, dan kerangka semua bab terkunci rapi." },
            { n: "04", t: "Mesin menulis", d: "Bab per bab, 10.000+ karakter, siap disalin atau diunduh." },
          ].map((s, i) => (
            <div key={s.n} className={`relative ${i < 3 ? "md:border-r md:border-ink-700 md:pr-6" : ""}`}>
              <div className="font-display italic text-4xl text-ink-600 font-black">{s.n}</div>
              <h4 className="mt-2 font-bold text-fog">{s.t}</h4>
              <p className="mt-1.5 text-sm text-ink-300 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ ticker kalimat pembuka ============ */}
      <div className="border-y border-ink-700 bg-ink-900/80 overflow-hidden py-3.5">
        <div className="anim-ticker flex whitespace-nowrap w-max">
          {[0, 1].map((rep) => (
            <div key={rep} className="flex">
              {TICKER_LINES.map((l, i) => (
                <span key={`${rep}-${i}`} className="flex items-center text-sm text-ink-300 font-manu italic">
                  <span className="px-6">"{l}"</span>
                  <span className="text-ember-500/70 not-italic">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function customToGenre(text: string): string {
  return matchCustomGenre(text);
}

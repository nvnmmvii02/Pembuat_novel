import type { GenreDef } from "../data/genres";
import { CITIES, GENERIC, NAMES, OBJEKS, PROMISES_FIKSI, PROMISES_NONFIKSI, TONE, type ToneKey } from "../data/world";
import { P } from "../data/prose";

/* ---------------- RNG ---------------- */

export function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Rng {
  next(): number;
  int(a: number, b: number): number;
  pick<T>(arr: T[]): T;
  pickN<T>(arr: T[], n: number): T[];
  chance(p: number): boolean;
}

export function makeRng(seed: number): Rng {
  const f = mulberry32(seed);
  const int = (a: number, b: number) => a + Math.floor(f() * (b - a + 1));
  return {
    next: f,
    int,
    pick: (arr) => arr[Math.floor(f() * arr.length)],
    pickN: (arr, n) => {
      const copy = [...arr];
      const out: typeof copy = [];
      while (out.length < n && copy.length) out.push(copy.splice(Math.floor(f() * copy.length), 1)[0]);
      return out;
    },
    chance: (p) => f() < p,
  };
}

/* ---------------- Tipe data ---------------- */

export type BeatType =
  | "scene" | "dialogue" | "action" | "inner" | "memory" | "tension" | "reveal"
  | "steamy" | "vice"
  | "nfHook" | "nfConcept" | "nfCase" | "nfSteps" | "nfObjection" | "nfClose";

export interface Beat { type: BeatType; desc: string; }
export interface Character {
  name: string; age: number; role: string; job: string;
  desire: string; flaw: string; secret: string; arc: string;
}
export interface ArcSegment { range: string; name: string; summary: string; }
export interface ChapterOutline {
  n: number; title: string; pov: string; location: string; beats: Beat[]; adult: boolean;
}
export interface Proposal {
  seed: number;
  genreId: string;
  titles: string[];
  titleIdx: number;
  logline: string;
  synopsis: string[];
  arcs: ArcSegment[];
  chapterCount: number;
  characters: Character[];
  city: string;
  setting: string;
  themes: string[];
  promises: string[];
  chapters: ChapterOutline[];
}

const first = (n: string) => n.split(" ")[0];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const sw = (s: string, a: string, b: string) => s.split(a).join(b);

/* ---------------- Proposal ---------------- */

const TARGETS = [
  "sudah baca banyak buku tapi hasilnya segitu-gitu saja",
  "butuh pegangan praktis, bukan kutipan motivasi",
  "baru mau mulai dan takut salah langkah",
  "sudah pernah gagal dan tidak mau mengulang dengan cara yang sama",
];

const JANJI: Array<[string, string]> = [
  ["pelan", "meledak"],
  ["ramah", "tidak kenal ampun"],
  ["hangat", "menusuk dari belakang"],
];

function buildCharacters(genre: GenreDef, rng: Rng): Character[] {
  const males = [...NAMES.male];
  const females = [...NAMES.female];
  const grab = (): string => {
    const pool = rng.chance(0.5) ? males : females;
    const src = pool.length ? pool : [...NAMES.male, ...NAMES.female];
    const i = rng.int(0, src.length - 1);
    const name = src[i];
    if (pool === males) males.splice(males.indexOf(name), 1);
    else if (pool === females) females.splice(females.indexOf(name), 1);
    return name;
  };
  return genre.archetypes.map((a) => {
    const name = grab();
    return {
      name,
      age: rng.int(19, 58),
      role: a.role,
      job: rng.pick(a.jobs),
      desire: rng.pick(GENERIC.desires),
      flaw: rng.pick(GENERIC.flaws),
      secret: rng.pick(GENERIC.secrets),
      arc: rng.pick(GENERIC.arcs),
    };
  });
}

function makeTitle(genre: GenreDef, rng: Rng, chars: Character[], city: string, used: Set<string>): string {
  for (let i = 0; i < 12; i++) {
    const mode = rng.int(0, 2);
    let t: string;
    if (mode === 0) {
      t = sw(sw(rng.pick(genre.titleSolo), "{nama}", first(rng.pick(chars).name)), "{kota}", city);
    } else if (mode === 1) {
      t = `${rng.pick(genre.titlePre)} ${rng.pick(genre.titleCore)}`;
    } else {
      t = rng.pick(genre.titleCore);
    }
    if (!used.has(t)) { used.add(t); return t; }
  }
  const t = `${genre.titlePre[0]} ${genre.titleCore[0]}`;
  used.add(t);
  return t;
}

function arcRanges(count: number): Array<[number, number]> {
  const cuts = [
    Math.max(1, Math.round(count * 0.28)),
    Math.max(2, Math.round(count * 0.55)),
    Math.max(3, Math.round(count * 0.8)),
  ];
  return [
    [1, cuts[0]],
    [cuts[0] + 1, cuts[1]],
    [cuts[1] + 1, cuts[2]],
    [cuts[2] + 1, count],
  ];
}

function buildProposal(genre: GenreDef, seed: number): Proposal {
  const rng = makeRng(seed);
  const city = rng.pick(CITIES);
  const setting = sw(rng.pick(genre.settings), "{kota}", city);
  const characters = buildCharacters(genre, rng);
  const [tokoh, kedua] = [characters[0], characters[1] ?? characters[0]];
  const konflik = rng.pick(genre.conflicts);
  const stake = rng.pick(genre.stakes);
  const themes = rng.pickN(genre.themes, Math.min(3, genre.themes.length));
  const used = new Set<string>();
  const titles = [makeTitle(genre, rng, characters, city, used), makeTitle(genre, rng, characters, city, used), makeTitle(genre, rng, characters, city, used)];
  const chapterCount = rng.int(genre.chapters[0], genre.chapters[1]);
  const adj = rng.pick(TONE[genre.tones[0]].adj);

  let logline: string;
  let synopsis: string[];
  if (genre.fiction) {
    const janji = rng.pick(JANJI);
    logline = rng.pick([
      `Ketika ${konflik}, ${first(tokoh.name)} harus memilih antara ${stake} dan semua yang selama ini ia yakini.`,
      `${cap(konflik)}. Bagi ${first(tokoh.name)}, itu bukan kabar. Itu undangan.`,
      `Satu ${stake} memisahkan ${first(tokoh.name)} dari hidup yang ia kenal.`,
    ]);
    synopsis = [
      rng.pick([
        `${first(tokoh.name)}, ${tokoh.age} tahun, seorang ${tokoh.job}, menjalani hari-hari yang ${adj} di ${city}. Sampai ${konflik}. Kalimat yang selama ini ia kira cuma cerita orang lain, kini resmi jadi jadwal hidupnya.`,
        `Selama ini ${first(tokoh.name)} percaya bahwa ${themes[0]} itu urusan orang lain. Hidupnya di ${setting} cukup ${adj}, cukup aman, cukup terkendali. Lalu ${konflik}, dan kata cukup kehilangan artinya.`,
      ]),
      rng.pick([
        `Masalahnya tidak pernah datang sendirian. ${first(kedua.name)}, ${kedua.role.toLowerCase()} dengan sifat ${kedua.flaw}, punya hitungan sendiri, dan ${stake} membuat semua pilihan terasa sama mahalnya.`,
        `Semakin dalam ${first(tokoh.name)} menggali, semakin jelas bahwa ${konflik} bukan kebetulan. Ada jejak ${first(kedua.name)} di sana, ada harga yang sengaja tidak ditulis di depan, ada ${themes[1] ?? themes[0]} yang menuntut dibayar.`,
      ]),
      rng.pick([
        `Ini cerita tentang ${themes[0]} dan ${themes[themes.length - 1]}, tentang orang-orang yang memilih bertahan ketika semua alasan menyuruh pergi. Kalau kamu suka cerita yang ${janji[0]} di awal dan ${janji[1]} di akhir, buku ini ditulis buat kamu.`,
        `Tidak semua luka di cerita ini akan sembuh, dan justru itu poinnya. ${first(tokoh.name)} akan sampai ke akhir, tapi versi dirinya yang sampai bukan lagi versi yang berangkat.`,
      ]),
    ];
  } else {
    logline = rng.pick([
      `${genre.premises?.[0] ?? "Buku ini ditulis tanpa basa-basi"}. ${chapterCount} bab, nol teori mengambang.`,
      `Satu masalah besar: ${rng.pick(P.nfMasalah)}.`,
    ]);
    synopsis = [
      `${genre.premises?.[rng.int(0, (genre.premises?.length ?? 1) - 1)] ?? "Buku ini tidak menjual mimpi"}. Buku ini ditulis untuk kamu yang ${rng.pick(TARGETS)}.`,
      `Dalam ${chapterCount} bab, kita akan membongkar ${genre.domainTerms?.[0] ?? "masalah utamanya"}, ${genre.domainTerms?.[1] ?? "akar masalahnya"}, dan ${genre.domainTerms?.[2] ?? "cara keluarnya"}, lengkap dengan studi kasus orang-orang biasa yang hasilnya masuk akal untuk ditiru.`,
      `Tidak ada rumus ajaib di sini. Yang ada sistem kecil yang tetap berjalan bahkan di hari terburukmu, dan cara mengukur progres tanpa menipu diri sendiri.`,
    ];
  }

  const ranges = arcRanges(chapterCount);
  const actNames = genre.fiction ? ["Fondasi", "Retakan", "Badai", "Pendaratan"] : ["Fondasi", "Membongkar", "Merakit", "Membawa Pulang"];
  const term = (i: number) => genre.domainTerms?.[i] ?? themes[0];
  const summaries = genre.fiction
    ? [
        `Dunia ${first(tokoh.name)} masih utuh, dan itu hanya bertahan sebentar. ${cap(konflik)} mulai mengetuk pintu, pelan tapi tidak bisa pura-pura tidak terdengar.`,
        `Pilihan-pilihan kecil mulai menagih. ${first(kedua.name)} masuk membawa agenda sendiri, dan ${stake} berubah dari sekadar kabar menjadi tenggat.`,
        `Semua yang disimpan meledak di bab-bab ini. ${first(tokoh.name)} kehilangan pegangan terakhirnya dan harus memilih versi dirinya yang mana yang boleh selamat.`,
        `Konsekuensi, bukan mukjizat. Semua benang yang ditanam sejak awal ditarik satu per satu, dan ${themes[0]} dibayar lunas.`,
      ]
    : [
        `Menyamakan peta: kenapa ${term(0)} sering gagal di minggu kedua, dan istilah-istilah kunci yang akan dipakai sepanjang buku.`,
        `Mitos dibongkar satu per satu. Di bagian ini banyak pembaca mulai tidak nyaman, dan itu memang disengaja.`,
        `Merakit sistem: langkah praktis, studi kasus ${first(tokoh.name)}, dan jebakan yang paling sering bikin balik ke titik nol.`,
        `Membawa pulang: rencana tiga puluh hari, cara evaluasi yang jujur, dan pengingat kapan harus berhenti membaca lalu mulai mengerjakan.`,
      ];
  const arcs = ranges.map((r, i) => ({
    range: `Bab ${r[0]}-${r[1]}`,
    name: actNames[i],
    summary: summaries[i],
  }));

  return {
    seed,
    genreId: genre.id,
    titles,
    titleIdx: 0,
    logline,
    synopsis,
    arcs,
    chapterCount,
    characters,
    city,
    setting,
    themes,
    promises: rng.pickN(genre.fiction ? PROMISES_FIKSI : PROMISES_NONFIKSI, 3),
    chapters: [],
  };
}

export function generateProposals(genre: GenreDef, seedBase: number): Proposal[] {
  return [0, 1, 2].map((i) => buildProposal(genre, seedBase + i * 7919 + 13));
}

/* ---------------- Kerangka bab ---------------- */

const CH_TITLE_PATTERNS = [
  "{n1} yang {adj}", "Di Balik {n1}", "{n1} Terakhir", "{n1} dan {n2}", "Setelah {n1}",
  "{n1} di {kota}", "Yang Tersisa dari {n1}", "{n1} yang Tidak Pernah Sampai", "Sebelum {n1}", "Hitungan {n1}",
];
const NF_TITLE_PATTERNS = [
  "{term} Tanpa Basa-Basi", "Kenapa {term} Selalu Gagal", "{term} untuk Hari Terburuk", "Peta {term}",
  "{term}: Versi Jujur", "Kasus {nama}", "Sistem yang Mau Berjalan", "Berhenti Menunggu Siap",
  "{term} dalam Dua Menit", "Bocor Halus",
];

const FICTION_SEQS: BeatType[][] = [
  ["scene", "inner", "dialogue", "memory", "dialogue", "tension"],
  ["scene", "tension", "dialogue", "action", "inner", "dialogue", "reveal"],
  ["scene", "action", "reveal", "dialogue", "tension", "memory", "dialogue"],
  ["scene", "tension", "reveal", "action", "dialogue", "inner", "dialogue", "tension"],
];
const NF_SEQS: BeatType[][] = [
  ["nfHook", "nfConcept", "nfCase", "nfSteps", "nfClose"],
  ["nfHook", "nfConcept", "nfObjection", "nfCase", "nfSteps", "nfClose"],
  ["nfHook", "nfCase", "nfConcept", "nfSteps", "nfObjection", "nfClose"],
];

function beatDesc(type: BeatType, rng: Rng, pov: Character, other: Character, genre: GenreDef): string {
  switch (type) {
    case "scene": return `${first(pov.name)} membaca situasi, ${rng.pick(TONE[genre.tones[0]].cuaca)} jadi saksi.`;
    case "dialogue": return `${first(pov.name)} dan ${first(other.name)} bicara soal ${rng.pick(P.topics)}. Tidak ada yang menang.`;
    case "action": return `Sekuens gerak cepat yang memaksa ${first(pov.name)} memilih tanpa sempat berpikir.`;
    case "inner": return `${first(pov.name)} menimbang ulang semua yang selama ini ia yakini.`;
    case "memory": return `Kilas balik ke versi lama ${first(pov.name)} yang belum tahu apa-apa.`;
    case "tension": return `Ancaman mendekat dari arah yang tidak dijaga.`;
    case "reveal": return `Satu fakta mengubah arah permainan untuk semua orang.`;
    case "steamy": return `Adegan intim: batas terakhir resmi dilewati.`;
    case "vice": return `Alkohol dan meja judi bicara lebih jujur dari manusia mana pun.`;
    case "nfHook": return `Pertanyaan pembuka yang bikin pembaca berhenti mengangguk.`;
    case "nfConcept": return `Konsep ${rng.pick(genre.domainTerms ?? ["utamanya"])} dijelaskan tanpa jargon.`;
    case "nfCase": return `Studi kasus ${first(pov.name)}: dari titik terendah sampai sistemnya jalan.`;
    case "nfSteps": return `Langkah praktis yang bisa dimulai hari ini juga.`;
    case "nfObjection": return `Keberatan paling umum dijawab dengan data, bukan semangat.`;
    case "nfClose": return `Penutup: satu tugas kecil, bukan motivasi kosong.`;
  }
}

export function generateChapters(p: Proposal, genre: GenreDef): Proposal {
  const rng = makeRng(p.seed + 424243);
  const chapters: ChapterOutline[] = [];
  const proto = p.characters[0];
  for (let i = 0; i < p.chapterCount; i++) {
    const frac = (i + 1) / p.chapterCount;
    const act = frac <= 0.28 ? 0 : frac <= 0.55 ? 1 : frac <= 0.8 ? 2 : 3;
    const pov = rng.chance(0.22) && p.characters.length > 1 ? rng.pick(p.characters.slice(1)) : proto;
    const other = rng.pick(p.characters.filter((c) => c.name !== pov.name));
    const tw = TONE[rng.pick(genre.tones)];
    const title = genre.fiction
      ? sw(
          sw(
            sw(sw(rng.pick(CH_TITLE_PATTERNS), "{n1}", rng.pick(genre.tNouns)), "{n2}", rng.pick(genre.tNouns)),
            "{adj}",
            rng.pick(tw.adj)
          ),
          "{kota}",
          p.city
        )
      : sw(sw(rng.pick(NF_TITLE_PATTERNS), "{term}", cap(rng.pick(genre.domainTerms ?? ["Fokus"]))), "{nama}", first(rng.pick(p.characters).name));

    let seq = genre.fiction ? [...FICTION_SEQS[act]] : rng.pick(NF_SEQS);
    let adult = false;
    if (genre.mature && act >= 1 && act <= 2) {
      if (rng.chance(0.55)) { seq.splice(rng.int(2, seq.length - 2), 0, "steamy"); adult = true; }
      if (rng.chance(0.5)) { seq.splice(rng.int(1, Math.max(1, seq.length - 2)), 0, "vice"); adult = true; }
    }
    const beats: Beat[] = seq.map((t) => ({ type: t, desc: beatDesc(t, rng, pov, other, genre) }));
    chapters.push({
      n: i + 1,
      title,
      pov: pov.name,
      location: sw(rng.pick(genre.settings), "{kota}", p.city),
      beats,
      adult,
    });
  }
  return { ...p, chapters };
}

/* ---------------- Penulis prosa ---------------- */

interface Dict { [k: string]: string; }

function makePicker(rng: Rng) {
  const caches = new Map<string[], string[]>();
  return (pool: string[]): string => {
    let c = caches.get(pool);
    if (!c || c.length === 0) {
      c = [...pool];
      for (let i = c.length - 1; i > 0; i--) {
        const j = Math.floor(rng.next() * (i + 1));
        [c[i], c[j]] = [c[j], c[i]];
      }
      caches.set(pool, c);
    }
    return c.pop() as string;
  };
}

function fill(t: string, d: Dict): string {
  return t.replace(/\{(\w+)\}/g, (_m: string, k: string) => d[k] ?? "");
}

export const MIN_CHARS = 10000;

export function writeChapter(p: Proposal, genre: GenreDef, ch: ChapterOutline, seed: number): string {
  const rng = makeRng(seed);
  const pick = makePicker(rng);
  const toneKey: ToneKey = rng.pick(genre.tones);
  const tw = TONE[toneKey];
  const pov = p.characters.find((c) => c.name === ch.pov) ?? p.characters[0];
  const other = p.characters.find((c) => c.name !== pov.name) ?? pov;
  const third = p.characters.find((c) => c.name !== pov.name && c.name !== other.name) ?? other;

  const fresh = (): Dict => ({
    nama: first(pov.name),
    namaLain: first(other.name),
    namaKetiga: first(third.name),
    tempat: ch.location,
    kota: p.city,
    cuaca: pick(tw.cuaca),
    waktu: pick(tw.waktu),
    aroma: pick(tw.aroma),
    suara: pick(tw.suara),
    adj: pick(tw.adj),
    objek: pick(OBJEKS),
    tema: pick(p.themes),
    term: genre.domainTerms ? rng.pick(genre.domainTerms) : "fokus",
    kasus: pick(P.nfKasus),
    langkah: pick(P.nfLangkah),
    masalah: pick(P.nfMasalah),
    mitos: pick(P.nfMitos),
    pertanyaan: pick(P.nfQs),
  });

  const sentences = (pool: string[], n: number, d: Dict): string[] => {
    const out: string[] = [];
    for (let i = 0; i < n; i++) out.push(fill(pick(pool), d));
    return out;
  };

  const paraDialogue = (d: Dict): string => {
    const lines: string[] = [];
    const count = rng.int(8, 12);
    let speakerA = true;
    for (let i = 0; i < count; i++) {
      const speaker = speakerA ? first(pov.name) : first(other.name);
      const tagFill: Dict = { ...d, nama: speaker };
      lines.push(`"${pick(P.dialogLines)}" ${fill(pick(P.dialogTags), tagFill)}.`);
      speakerA = !speakerA;
      if (i % 3 === 1) lines.push(fill(pick([...P.action, ...P.inner, ...P.setting]), d));
    }
    return lines.join(" ");
  };

  const paraFor = (t: BeatType): string => {
    const d = fresh();
    switch (t) {
      case "scene": return [...sentences(P.scene, 2, d), ...sentences(P.setting, 2, d), ...sentences(P.inner, 1, d)].join(" ");
      case "dialogue": return paraDialogue(d);
      case "action": return [...sentences(P.action, 3, d), ...sentences(P.tension, 1, d), ...sentences(P.action, 1, d)].join(" ");
      case "inner": return [...sentences(P.inner, 3, d), ...sentences(P.memory, 1, d)].join(" ");
      case "memory": return [...sentences(P.memory, 2, d), ...sentences(P.setting, 1, d), ...sentences(P.inner, 1, d)].join(" ");
      case "tension": return [...sentences(P.tension, 2, d), ...sentences(P.action, 1, d), ...sentences(P.inner, 1, d)].join(" ");
      case "reveal": return [...sentences(P.reveal, 1, d), ...sentences(P.tension, 1, d), ...sentences(P.inner, 2, d)].join(" ");
      case "steamy": return [...sentences(P.steamy, 3, d), ...sentences(P.setting, 1, d), ...sentences(P.inner, 1, d)].join(" ");
      case "vice": return [...sentences(P.vice, 3, d), ...sentences(P.setting, 1, d), ...sentences(P.inner, 1, d)].join(" ");
      case "nfHook": return [...sentences(P.nfHook, 2, d), ...sentences(P.nfConcept, 1, d)].join(" ");
      case "nfConcept": return [...sentences(P.nfConcept, 3, d), ...sentences(P.nfObjection, 1, d)].join(" ");
      case "nfCase": return [...sentences(P.nfCase, 2, d), ...sentences(P.nfConcept, 2, d)].join(" ");
      case "nfSteps": return [...sentences(P.nfSteps, 4, d), ...sentences(P.nfObjection, 1, d)].join(" ");
      case "nfObjection": return [...sentences(P.nfObjection, 2, d), ...sentences(P.nfConcept, 1, d)].join(" ");
      case "nfClose": return [...sentences(P.nfClose, 2, d), ...sentences(P.nfSteps, 1, d)].join(" ");
    }
  };

  const paras: string[] = [];
  ch.beats.forEach((b) => paras.push(paraFor(b.type)));
  paras.push(
    genre.fiction
      ? [...sentences(P.close, 2, fresh()), ...sentences(P.inner, 1, fresh())].join(" ")
      : paraFor("nfClose")
  );

  let text = paras.join("\n\n");
  let guard = 0;
  const filler: BeatType[] = genre.fiction
    ? ["inner", "memory", "tension", "dialogue", "scene", "action", "inner"]
    : ["nfConcept", "nfCase", "nfSteps", "nfObjection", "nfConcept", "nfCase"];
  while (text.length < MIN_CHARS + 300 && guard < 90) {
    text += "\n\n" + paraFor(filler[guard % filler.length]);
    guard++;
  }
  return text;
}

export function chapterFile(p: Proposal, ch: ChapterOutline, body: string): string {
  return `Bab ${ch.n}\n${ch.title}\n\n${body}`;
}

export function blueprintFile(p: Proposal, genre: GenreDef): string {
  const L: string[] = [];
  L.push(`${p.titles[p.titleIdx].toUpperCase()}`);
  L.push(`Genre: ${genre.label} | ${p.chapterCount} bab | target 10.000+ karakter per bab`);
  L.push("");
  L.push("LOGLINE");
  L.push(p.logline);
  L.push("");
  L.push("SINOPSIS");
  p.synopsis.forEach((s) => { L.push(s); L.push(""); });
  L.push("ARAH CERITA");
  p.arcs.forEach((a) => L.push(`${a.range} | ${a.name}: ${a.summary}`));
  L.push("");
  L.push("KARAKTER");
  p.characters.forEach((c) => {
    L.push(`- ${c.name} (${c.age}), ${c.role}, ${c.job}`);
    L.push(`  Ingin: ${c.desire}. Cacat: ${c.flaw}.`);
    L.push(`  Rahasia: ${c.secret}.`);
    L.push(`  Arah: ${c.arc}`);
  });
  L.push("");
  L.push("KERANGKA BAB");
  p.chapters.forEach((c) => {
    L.push(`Bab ${c.n} | ${c.title} (sudut pandang ${first(c.pov)}, ${c.location})`);
    c.beats.forEach((b) => L.push(`  . ${b.desc}`));
  });
  return L.join("\n");
}

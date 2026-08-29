export type ToneKey = "gelap" | "hangat" | "tegang" | "liar" | "reflektif" | "jenaka";

export interface ToneWords {
  cuaca: string[];
  waktu: string[];
  aroma: string[];
  suara: string[];
  adj: string[];
}

export const TONE: Record<ToneKey, ToneWords> = {
  gelap: {
    cuaca: ["kabut tipis", "hujan gerimis", "malam tanpa bulan", "angin dingin dari arah kuburan", "gerimis yang turun seperti bisikan"],
    waktu: ["Jam tiga pagi", "Menjelang tengah malam", "Waktu subuh yang terlalu sunyi", "Magrib yang keburu gelap", "Malam Jumat yang basah"],
    aroma: ["tanah basah", "kayu lapuk", "asap dupa", "karat dan debu", "bunga yang terlalu lama di vas"],
    suara: ["detak jam dinding", "langkah di lantai kayu", "pintu berderit", "napas tertahan", "anjing menggonggong jauh"],
    adj: ["pekat", "kelam", "dingin", "sunyi", "ganjil"],
  },
  hangat: {
    cuaca: ["senja jingga", "hujan yang baru reda", "pagi yang cerah tanpa buru-buru", "gerimis manja", "angin sore yang lewat seenaknya"],
    waktu: ["Sore itu", "Pagi yang pelan", "Habis hujan", "Menjelang tutup kedai", "Minggu yang tidak ke mana-mana"],
    aroma: ["kopi yang baru diseduh", "roti panggang", "hujan di aspal", "halaman yang habis disiram", "buku bekas"],
    suara: ["tawa pelan", "sendok beradu dengan gelas", "musik dari radio tua", "derit kursi kayu", "hujan di atap seng"],
    adj: ["hangat", "lembut", "pelan", "jernih", "rapuh"],
  },
  tegang: {
    cuaca: ["malam yang terlalu panjang", "gerimis tajam", "kabut pelabuhan", "lampu jalan yang berkedip", "panas yang tidak turun-turun"],
    waktu: ["Pukul sebelas lewat", "Beberapa menit sebelum tengah malam", "Subuh yang datang terlalu cepat", "Jam kantor yang sudah kosong", "Menit-menit terakhir"],
    aroma: ["bensin", "tembakau", "logam", "keringat dingin", "kopi basi"],
    suara: ["dering telepon yang tidak diangkat", "langkah tergesa", "kunci diputar", "napas pendek", "mesin yang tiba-tiba mati"],
    adj: ["tajam", "pendek", "gelisah", "rapat", "dingin"],
  },
  liar: {
    cuaca: ["malam penuh neon", "hujan kota yang memantulkan lampu", "asap panggung", "langit yang kalah oleh lampu kota", "udara panas bekas pesta"],
    waktu: ["Lewat tengah malam", "Jam-jam saat orang normal sudah tidur", "Menjelang bar tutup", "Pukul dua pagi", "Malam yang menolak selesai"],
    aroma: ["alkohol", "parfum mahal", "rokok", "laut malam", "keringat dan wiski"],
    suara: ["bas yang menggelegar", "gelas berdenting", "tawa serak", "musik jazz yang mabuk", "dadu dilempar ke meja"],
    adj: ["panas", "liar", "berkilau", "mabuk", "berbahaya"],
  },
  reflektif: {
    cuaca: ["langit yang abu-abu sopan", "hujan yang turun sebentar lalu minta maaf", "sore yang panjang", "pagi yang masih setengah mimpi", "angin yang membawa bau buku"],
    waktu: ["Bertahun-tahun kemudian", "Di hari yang tidak spesial", "Sore itu", "Waktu menunggu kereta", "Malam sebelum keputusan"],
    aroma: ["teh hitam", "kertas tua", "hujan di jendela", "sabun cuci", "kayu manis"],
    suara: ["jarum jam", "halaman buku dibalik", "hujan mengetuk kaca", "suara ibu dari dapur", "kereta lewat jauh"],
    adj: ["pelan", "dalam", "jernih", "sunyi", "jujur"],
  },
  jenaka: {
    cuaca: ["panas yang bikin orang gampang emosi", "hujan yang datang pas jemuran penuh", "pagi yang salah bangun", "sore yang niatnya santai malah ramai", "langit cerah yang mencurigakan"],
    waktu: ["Pagi-pagi buta", "Pas banget jam pulang", "Hari Senin yang panjang", "Waktu azan magrib di grup keluarga", "Tanggal tua"],
    aroma: ["gorengan", "kopi sachet", "parfum isi ulang", "sate yang lewat depan rumah", "karpet kantor yang perlu diganti"],
    suara: ["notifikasi grup yang tidak berhenti", "klakson ojek", "tawa meledak di warung", "bel sekolah", "kipas angin ngos-ngosan"],
    adj: ["kacau", "ramai", "ngaco", "hangat", "berisik"],
  },
};

export const NAMES = {
  male: [
    "Raka", "Dimas", "Bagas", "Arga", "Satria", "Bimo", "Fajar", "Gilang", "Rangga", "Aditya",
    "Bara", "Dewa", "Langit", "Panji", "Surya", "Tegar", "Wira", "Yuda", "Zaki", "Elang",
    "Adrian", "Viktor", "Elias", "Marco", "Julian", "Damian", "Rendra", "Galih",
  ],
  female: [
    "Laras", "Sekar", "Nadia", "Kirana", "Dara", "Sinta", "Rania", "Maya", "Tania", "Bulan",
    "Citra", "Dina", "Hana", "Intan", "Jingga", "Kartika", "Laila", "Melati", "Nara", "Prita",
    "Ratih", "Salsa", "Tari", "Ayu", "Elena", "Sofia", "Clara", "Vivian",
  ],
};

export const CITIES = [
  "Bandar Segara", "Rimbasari", "Kota Arunika", "Bukit Karsa", "Pelabuhan Rata", "Kota Tirta",
  "Lembah Wening", "Tanjung Kelam", "Kota Harapan Baru", "Margaluyu",
];

export const GENERIC = {
  desires: [
    "pengakuan dari orang yang tidak pernah memujinya",
    "hidup tenang tanpa dikejar masa lalu",
    "dimaafkan, walau ia tidak tahu harus minta maaf ke siapa",
    "rumah yang benar-benar terasa seperti rumah",
    "kesempatan kedua yang kali ini tidak akan ia sia-siakan",
    "cukup uang untuk berhenti pura-pura kuat",
    "satu orang yang tinggal ketika semua orang pergi",
  ],
  flaws: [
    "terlalu mudah percaya",
    "menyimpan semuanya sendirian",
    "gengsi minta tolong",
    "kabur kalau keadaan mulai rumit",
    "terlalu setia pada orang yang salah",
    "perfeksionis sampai lumpuh sendiri",
    "suka menguji orang lain demi merasa aman",
  ],
  secrets: [
    "pernah mengambil keputusan yang menghancurkan satu keluarga, dan tidak pernah mengaku",
    "masih menghubungi orang yang seharusnya sudah ia relakan",
    "memakai nama yang bukan nama aslinya",
    "tahu siapa pelakunya sejak lama",
    "punya utang yang tidak tercatat di mana pun",
    "menyimpan surat yang kalau dibuka bisa mengubah segalanya",
    "pernah pergi tanpa pamit, dan sampai sekarang belum bisa menjelaskan alasannya",
  ],
  arcs: [
    "Berawal dari orang yang cuma ingin selamat, berakhir sebagai orang yang berani rugi.",
    "Dari yang paling keras kepala, jadi yang paling dulu mengalah demi orang lain.",
    "Belajar bahwa menang terus-menerus itu cara paling cepat untuk kalah sendirian.",
    "Berhenti menunggu diselamatkan, lalu jadi alasan orang lain bertahan.",
    "Dari pengejar pengakuan, jadi orang yang tidak butuh tepuk tangan.",
    "Menyadari yang ia cari selama ini tidak pernah pergi, hanya tidak ia lihat.",
    "Dari tukang menyimpan rahasia, jadi orang yang akhirnya berani jujur di waktu yang paling mahal.",
  ],
};

export const OBJEKS = [
  "amplop cokelat tanpa nama", "kunci berkarat", "ponsel yang layarnya retak", "buku catatan bersampul kulit",
  "foto yang sudutnya terbakar", "cincin yang tidak pernah dipakai", "rekaman suara berdurasi empat puluh detik",
  "tiket kereta tanggal lama", "botol parfum yang isinya tinggal seperempat", "peta yang digambar tangan",
  "kotak kayu dengan gembok kecil", "surat yang tidak pernah dikirim", "dompet dengan satu foto lecek",
];

export const PROMISES_FIKSI = [
  "Semua utang plot dibayar lunas di bab-bab akhir, tidak ada misteri yang digantung cuma biar keren.",
  "Karakternya abu-abu: yang baik punya niat jelek, yang jahat punya alasan yang bisa kamu pahami.",
  "Twist ditanam sejak bab awal dan baru kelihatan kalau kamu baca ulang.",
  "Dialognya dipakai buat perang, bukan sekadar basa-basi.",
  "Ada satu adegan yang akan kamu ingat seminggu setelah tamat.",
  "Temponya diatur: boleh bernapas, tapi tidak boleh merasa aman terlalu lama.",
];

export const PROMISES_NONFIKSI = [
  "Tanpa motivasi kosong: setiap bab selesai dengan sesuatu yang bisa langsung dipraktikkan.",
  "Risetnya dikutip secukupnya, sisanya diterjemahkan ke bahasa manusia.",
  "Contoh kasusnya orang biasa, bukan miliarder yang ceritanya tidak bisa ditiru.",
  "Babnya bisa dibaca acak tanpa kehilangan benang merah.",
];

export const LOADING_MSGS = [
  "Memanaskan mesin tik tua...",
  "Menyuap mesin dengan ribuan novel referensi...",
  "Meracik karakter yang susah ditebak...",
  "Menyembunyikan plot twist di tempat yang sopan...",
  "Menyunting kalimat yang terlalu jujur...",
  "Menata bab supaya rumusnya tidak ketahuan...",
  "Menghapus jejak bahwa ini semua ulah mesin...",
];

export const TICKER_LINES = [
  "Hal pertama yang ia sadari pagi itu adalah: pintunya terbuka, dan ia tinggal sendirian.",
  "Hujan turun lagi, dan beberapa hal memang tidak pernah benar-benar berhenti.",
  "Semua orang di kota ini tahu aturan nomor satu: jangan menyebut nama itu setelah magrib.",
  "Ia datang lebih awal, seperti orang yang menyiapkan diri untuk kabar buruk.",
  "Kalau ada yang bertanya kapan hidupnya mulai berubah, ia akan menunjuk malam itu.",
  "Surat itu tidak punya pengirim, tapi ia hafal betul siapa yang menulisnya.",
  "Kita berdua tahu ini salah, makanya kita di sini.",
  "Ada hari-hari yang ditulis untuk orang lain, dan hari ini bukan miliknya.",
  "Teleponnya bergetar, dan nama yang muncul membuat darahnya turun beberapa derajat.",
  "Bandar tersenyum seperti orang yang sudah membaca akhir cerita.",
];

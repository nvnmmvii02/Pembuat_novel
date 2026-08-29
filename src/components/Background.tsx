import { useMemo } from "react";

const GLYPHS = "AKSRKISAH¶§*·aksarahuruf?";

interface GlyphSpec {
  ch: string;
  left: number;
  top: number;
  size: number;
  dur: number;
  delay: number;
  rot: number;
  op: number;
}

export function Background() {
  const glyphs = useMemo<GlyphSpec[]>(() => {
    const out: GlyphSpec[] = [];
    let s = 20260117;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    for (let i = 0; i < 26; i++) {
      out.push({
        ch: GLYPHS[Math.floor(rnd() * GLYPHS.length)],
        left: rnd() * 100,
        top: rnd() * 100,
        size: 14 + rnd() * 42,
        dur: 12 + rnd() * 16,
        delay: -rnd() * 20,
        rot: Math.round(rnd() * 60 - 30),
        op: 0.05 + rnd() * 0.07,
      });
    }
    return out;
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-ink-950" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px 700px at 12% -10%, rgba(255,92,56,0.10), transparent 60%), radial-gradient(900px 650px at 105% 15%, rgba(47,191,170,0.09), transparent 55%), radial-gradient(800px 700px at 50% 115%, rgba(245,184,75,0.07), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 bg-grid" />
      {glyphs.map((g, i) => (
        <span
          key={i}
          className="absolute font-display italic text-ink-300 anim-floaty select-none"
          style={{
            left: `${g.left}%`,
            top: `${g.top}%`,
            fontSize: `${g.size}px`,
            ["--d" as string]: `${g.dur}s`,
            ["--r" as string]: `${g.rot}deg`,
            ["--o" as string]: g.op,
            animationDelay: `${g.delay}s`,
            opacity: g.op,
          }}
        >
          {g.ch}
        </span>
      ))}
      <div className="absolute inset-0 noise-layer" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(7,13,16,0.75) 100%)" }}
      />
    </div>
  );
}

import { useEffect, useState } from "react";

const CATEGORIES = [
  { id: "coronas_funebres", label: "Coronas Fúnebres", href: "#coronas_funebres", image: "/manus-storage/cat-coronas_6657dc1a.jpg" },
  { id: "sudarios", label: "Sudarios", href: "#sudarios", image: "/manus-storage/cat-altar_68168df9.jpg" },
  { id: "rosas_inmortalizadas", label: "Rosas Inmortalizadas", href: "#rosas_inmortalizadas", image: "/manus-storage/cat-rosas-inmortalizadas_734fdfc2.png" },
  { id: "por_menos_200", label: "Por Menos de $200.000", href: "#por_menos_200", image: "/manus-storage/cat-coronas_6657dc1a.jpg" },
];

const gold = "oklch(0.72 0.12 80)";
const INTERVAL = 3500;

export default function CategoriesSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = CATEGORIES.length - visibleCount;
  const next = () => setCurrent(c => c >= maxIndex ? 0 : c + 1);
  const prev = () => setCurrent(c => c <= 0 ? maxIndex : c - 1);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(next, INTERVAL);
    return () => clearInterval(t);
  }, [isPaused, maxIndex, visibleCount]);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const ArrowBtn = ({ dir }: { dir: "prev" | "next" }) => (
    <button
      onClick={dir === "prev" ? prev : next}
      aria-label={dir === "prev" ? "Anterior" : "Siguiente"}
      style={{
        position: "absolute",
        top: "50%",
        [dir === "prev" ? "left" : "right"]: "0",
        transform: "translateY(-50%)",
        zIndex: 20,
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "50%",
        backgroundColor: "oklch(1 0 0)",
        border: `1px solid oklch(0.85 0.01 75)`,
        boxShadow: "0 2px 10px oklch(0.20 0 0 / 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "background 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = "oklch(0.94 0.01 75)"; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = "oklch(1 0 0)"; }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {dir === "prev"
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );

  return (
    <section id="categorias" className="py-16 md:py-20" style={{ backgroundColor: "oklch(0.97 0.008 75)" }}>
      <div className="container">
        <div className="section-divider mb-10" />
        <div className="text-center mb-10">
          <p className="text-xl font-light italic mb-1" style={{ color: "oklch(0.38 0 0)", fontFamily: "'Cormorant Garamond', serif" }}>
            Nuestros Servicios
          </p>
          <h2 className="text-4xl md:text-5xl font-light" style={{ color: "oklch(0.22 0 0)", fontFamily: "'Cormorant Garamond', serif" }}>
            Categorías
          </h2>
        </div>

        {/* Outer wrapper: padding lateral para que las flechas absolutas sean visibles */}
        <div
          style={{ position: "relative", padding: "0 2.75rem" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <ArrowBtn dir="prev" />

          {/* Track: overflow hidden solo aquí */}
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                transform: `translateX(calc(-${current * (100 / visibleCount)}% - ${current * (1 / visibleCount)}rem))`,
                transition: "transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollTo(cat.href)}
                  style={{
                    flexShrink: 0,
                    width: `calc(${100 / visibleCount}% - ${(visibleCount - 1) / visibleCount}rem)`,
                    borderRadius: "1rem",
                    overflow: "hidden",
                    border: "1px solid oklch(0.90 0.01 75)",
                    boxShadow: "0 2px 8px oklch(0.20 0 0 / 0.06)",
                    cursor: "pointer",
                    background: "none",
                    padding: 0,
                    textAlign: "left",
                    transition: "transform 0.25s, box-shadow 0.25s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 28px oklch(0.20 0 0 / 0.14)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px oklch(0.20 0 0 / 0.06)"; }}
                >
                  <div style={{ aspectRatio: "1/1", overflow: "hidden", position: "relative" }}>
                    <img src={cat.image} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, oklch(0.10 0 0 / 0.65) 0%, transparent 55%)" }} />
                  </div>
                  <div style={{ backgroundColor: "oklch(0.22 0 0)", padding: "0.8rem 1rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <span style={{ color: "white", fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 300, textAlign: "center", display: "block" }}>
                      {cat.label}
                    </span>
                    <span style={{ color: gold, fontFamily: "'Lato', sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center", display: "block" }}>
                      Ver productos →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <ArrowBtn dir="next" />
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.25rem" }}>
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir a ${i + 1}`}
              style={{
                width: i === current ? "1.5rem" : "0.5rem",
                height: "0.5rem",
                borderRadius: "9999px",
                backgroundColor: i === current ? gold : "oklch(0.75 0.01 75)",
                border: "none",
                cursor: "pointer",
                transition: "width 0.3s, background 0.3s",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

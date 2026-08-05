import { useEffect, useRef, useState } from "react";

const badges = [
  {
    image: "/manus-storage/insignia-siflor2_b1f3f6f9.png",
    title: "SIFLOR 2025",
    subtitle: "Simposio Internacional de Floricultura",
  },
  {
    image: "/manus-storage/insignia-corona2_1cccfaa2.png",
    title: "MEJOR CORONA FÚNEBRE 2026",
    subtitle: "Reconocimiento a la excelencia floral",
  },
  {
    image: "/manus-storage/insignia-atencion2_7bfc91fe.png",
    title: "EXCELENCIA AL CLIENTE 2026",
    subtitle: "Compromiso · Calidad · Confianza",
  },
];

export default function TrustBadges() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: "oklch(0.10 0 0)",
        borderTop: "1px solid oklch(0.72 0.12 80 / 0.2)",
        borderBottom: "1px solid oklch(0.72 0.12 80 / 0.2)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1)",
      }}
    >
      {/* Título impactante */}
      <div style={{
        textAlign: "center",
        padding: "clamp(1rem, 2.5vw, 1.5rem) 1rem clamp(0.5rem, 1.5vw, 0.75rem)",
        borderBottom: "1px solid oklch(0.72 0.12 80 / 0.15)",
      }}>
        <p style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: "clamp(0.65rem, 1.6vw, 0.8rem)",
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: "oklch(0.72 0.12 80)",
          textTransform: "uppercase",
          margin: "0 0 0.4rem",
        }}>Reconocidos por la industria</p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(1.3rem, 4vw, 2.2rem)",
          fontWeight: 600,
          color: "#ffffff",
          lineHeight: 1.2,
          margin: 0,
          letterSpacing: "0.01em",
        }}>
          La Floristería Fúnebre{" "}
          <span style={{ color: "oklch(0.72 0.12 80)", fontStyle: "italic" }}>
            Más Premiada de Barranquilla
          </span>
        </h2>
      </div>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          alignItems: "stretch",
        }}
      >
        {badges.map((badge, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "clamp(1.25rem, 3vw, 1.75rem) clamp(1rem, 2.5vw, 2rem)",
              borderRight: i < badges.length - 1 ? "1px solid oklch(0.72 0.12 80 / 0.2)" : "none",
              gap: "0.5rem",
              transition: "background-color 0.25s ease",
              cursor: "default",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = "oklch(0.14 0 0)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
            }}
          >
            {/* Badge image */}
            <div style={{ width: "clamp(60px, 8vw, 80px)", height: "clamp(60px, 8vw, 80px)", marginBottom: "0.5rem", flexShrink: 0 }}>
              <img
                src={(badge as any).image}
                alt={(badge as any).title}
                style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 2px 6px oklch(0.72 0.12 80 / 0.3))" }}
              />
            </div>

            {/* Title */}
            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "clamp(0.7rem, 1.8vw, 0.88rem)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "#ffffff",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              {badge.title}
            </p>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "clamp(0.65rem, 1.5vw, 0.78rem)",
                fontWeight: 400,
                color: "oklch(0.72 0.12 80 / 0.85)",
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {badge.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

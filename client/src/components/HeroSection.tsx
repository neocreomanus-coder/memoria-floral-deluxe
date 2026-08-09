import { useLocation } from "wouter";

const HERO_IMAGE = "/manus-storage/hero-hd_d737525c.webp";
const gold = "oklch(0.88 0.14 80)";
const goldMid = "oklch(0.72 0.12 80)";
const white = "oklch(0.97 0.01 75)";
const glass = "oklch(0.06 0 0 / 0.62)";

export default function HeroSection() {
  const [, navigate] = useLocation();

  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{
        backgroundColor: "oklch(0.03 0 0)",
        minHeight: "clamp(580px, 90vh, 96vh)",
      }}
    >
       {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Arreglos fúnebres Memoria Floral Deluxe Barranquilla"
          className="w-full h-full object-cover"
          style={{ opacity: 1 }}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* Gradient: strong dark left for text, fades right to show image */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, oklch(0.05 0 0 / 0.78) 0%, oklch(0.06 0 0 / 0.45) 45%, oklch(0.06 0 0 / 0.06) 100%)",
        }}
      />

      {/* Content */}
      <div className="container relative z-10 py-10 md:py-16 lg:py-20">
        <div
          className="max-w-lg"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >

          {/* 1. Pre-title pill — ¿Qué venden? ¿Dónde? */}
          <div
            className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full"
            style={{
              backgroundColor: glass,
              backdropFilter: "blur(8px)",
              border: `1px solid ${goldMid}55`,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={goldMid} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span style={{ color: goldMid, fontFamily: "'Lato', sans-serif", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Barranquilla y Zona Metropolitana
            </span>
          </div>

          {/* 2. Main headline — orientado a la intención de búsqueda */}
          <h1
            className="font-light leading-tight"
            style={{
              color: white,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.8rem, 8.5vw, 5.5rem)",
              textShadow: "0 2px 24px oklch(0.03 0 0 / 0.95), 0 1px 6px oklch(0.03 0 0 / 0.85)",
              lineHeight: 1.12,
            }}
          >
            Arreglos Fúnebres
            <br />
            <span style={{ color: gold, fontStyle: "italic" }}>
              con Entrega Inmediata
            </span>
          </h1>

          {/* 3+4 glass block: descripción + beneficios */}
          <div style={{
            backgroundColor: "oklch(0.05 0 0 / 0.48)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid oklch(0.72 0.12 80 / 0.15)",
            borderRadius: "1rem",
            padding: "1rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}>
          <p
            style={{
              color: "oklch(0.92 0.01 75)",
              fontFamily: "'Lato', sans-serif",
              fontSize: "clamp(1.05rem, 3vw, 1.2rem)",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Diseñamos arreglos florales elegantes para rendir un homenaje memorable, con entrega rápida en funerarias, iglesias y cementerios de Barranquilla.
          </p>

          {/* 4. Beneficios rápidos — íconos + texto */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {[
              { icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", text: "Más de 20 años de experiencia en arreglos fúnebres" },
              { icon: "M5 12h14M12 5l7 7-7 7", text: "Entrega el mismo día en toda la zona metropolitana" },
              { icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z", text: "Atención personalizada 24/7 vía WhatsApp" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{
                  width: "1.5rem", height: "1.5rem", borderRadius: "50%", flexShrink: 0,
                  backgroundColor: `${goldMid}22`,
                  border: `1px solid ${goldMid}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={goldMid} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </div>
                <span style={{ color: "oklch(0.88 0.01 75)", fontFamily: "'Lato', sans-serif", fontSize: "clamp(1rem, 2.8vw, 1.12rem)", lineHeight: 1.45 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
          </div>{/* end glass block */}

          {/* 5. Prueba social — elegante y discreta */}
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              backgroundColor: glass,
              backdropFilter: "blur(10px)",
              border: `1px solid ${goldMid}33`,
              borderRadius: "0.75rem",
              padding: "0.6rem 1rem",
              alignSelf: "flex-start",
            }}
          >
            <div style={{ display: "flex", gap: "2px" }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#FBBC04" stroke="#FBBC04" strokeWidth="0.5">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              ))}
            </div>
            <span style={{ color: "oklch(0.92 0.01 75)", fontFamily: "'Lato', sans-serif", fontSize: "0.92rem", lineHeight: 1.3 }}>
              <strong style={{ color: gold }}>+2.500 familias</strong> han confiado en nosotros
            </span>
          </div>

          {/* 6. CTAs — WhatsApp con protagonismo */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {/* WhatsApp — botón principal de mayor conversión */}
            <a
              href="https://wa.me/573011621986?text=Hola,%20necesito%20un%20arreglo%20fúnebre%20con%20entrega%20inmediata%20en%20Barranquilla"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                backgroundColor: "#25D366",
                color: "white",
                fontFamily: "'Lato', sans-serif",
                fontSize: "clamp(0.88rem, 2.5vw, 1rem)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "1rem 2rem",
                borderRadius: "9999px",
                boxShadow: "0 4px 20px #25D36655, 0 0 0 0 #25D366",
                transition: "transform 0.2s, box-shadow 0.2s",
                animation: "whatsapp-pulse 2.5s infinite",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 6px 28px #25D36688"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px #25D36655"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Hablar con un Asesor Ahora
            </a>

            {/* Ver arreglos — botón dorado secundario */}
            <button
              onClick={() => navigate("/catalogo")}
              className="btn-gold"
              style={{
                padding: "0.85rem 2rem",
                borderRadius: "9999px",
                fontSize: "clamp(0.82rem, 2.3vw, 0.95rem)",
                letterSpacing: "0.1em",
                width: "100%",
              }}
            >
              Ver Arreglos Disponibles
            </button>
          </div>

        </div>
      </div>

      {/* Bottom golden line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, oklch(0.72 0.12 80 / 0.45), transparent)" }}
      />

      <style>{`
        @keyframes whatsapp-pulse {
          0%, 100% { box-shadow: 0 4px 20px #25D36655, 0 0 0 0 #25D36644; }
          50% { box-shadow: 0 4px 20px #25D36655, 0 0 0 8px #25D36600; }
        }
      `}</style>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";

const REVIEWS = [
  { id: 1, name: "María Fernanda Ospino", rating: 5, date: "hace 2 semanas", text: "Excelente servicio en un momento tan difícil. Las coronas que enviaron para el velorio de mi madre fueron hermosas y llegaron a tiempo. El personal fue muy empático y profesional. Totalmente recomendados.", avatar: "M" },
  { id: 2, name: "Carlos Andrés Barros", rating: 5, date: "hace 1 mes", text: "Pedí un arreglo de altar con solo unas horas de anticipación y cumplieron perfectamente. Flores frescas, presentación impecable. Memoria Floral Deluxe tiene 20 años de experiencia y se nota en cada detalle.", avatar: "C" },
  { id: 3, name: "Luisa Martínez", rating: 5, date: "hace 3 semanas", text: "La corona fúnebre que pedí para el sepelio de mi padre fue exactamente lo que necesitaba. Colores sobrios, flores de primera calidad. El equipo estuvo disponible todo el tiempo. Gracias por acompañarnos.", avatar: "L" },
  { id: 4, name: "Jorge Enrique Ramos", rating: 5, date: "hace 2 meses", text: "Servicio excepcional. Cubrieron la funeraria en Soledad sin ningún problema. Los arreglos llegaron antes de lo pactado y la calidad superó mis expectativas. Sin duda los volvería a contratar.", avatar: "J" },
  { id: 5, name: "Ana Cecilia Díaz", rating: 5, date: "hace 1 semana", text: "En momentos de dolor, encontrar un proveedor confiable es invaluable. Memoria Floral Deluxe respondió con rapidez, amabilidad y profesionalismo. Las flores estaban hermosas y frescas. Muy agradecida.", avatar: "A" },
  { id: 6, name: "Roberto Insignares", rating: 5, date: "hace 3 meses", text: "Llevo años usando sus servicios para diferentes velorios en Barranquilla. Siempre cumplen, siempre con calidad. Son los mejores en arreglos fúnebres del Atlántico. Recomendados al 100%.", avatar: "R" },
];

const gold = "oklch(0.72 0.12 80)";
const INTERVAL = 4000;

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? "#FBBC04" : "none"} stroke="#FBBC04" strokeWidth="1.5">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
  return (
    <div style={{
      backgroundColor: "oklch(1 0 0)",
      border: "1px solid oklch(0.92 0.01 75)",
      boxShadow: "0 2px 12px oklch(0.20 0 0 / 0.06)",
      borderRadius: "1rem",
      padding: "1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      height: "100%",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <div style={{
          width: "2.5rem", height: "2.5rem", borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, oklch(0.62 0.12 80), oklch(0.82 0.14 85))",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "oklch(0 0 0)", fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: "1rem",
        }}>
          {review.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "oklch(0.05 0 0)", fontFamily: "'Lato', sans-serif", fontWeight: 600, fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {review.name}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
            <div style={{ display: "flex", gap: "1px" }}>
              {[1,2,3,4,5].map(i => <StarIcon key={i} filled={i <= review.rating} />)}
            </div>
            <span style={{ color: "oklch(0.60 0 0)", fontFamily: "'Lato', sans-serif", fontSize: "0.78rem" }}>{review.date}</span>
          </div>
        </div>
        <div style={{ flexShrink: 0 }}><GoogleLogo /></div>
      </div>
      <p style={{ color: "oklch(0.42 0 0)", fontFamily: "'Lato', sans-serif", fontSize: "0.9rem", lineHeight: 1.65, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        "{review.text}"
      </p>
    </div>
  );
}

export default function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const update = () => setVisibleCount(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = REVIEWS.length - visibleCount;

  const next = () => setCurrent(c => c >= maxIndex ? 0 : c + 1);
  const prev = () => setCurrent(c => c <= 0 ? maxIndex : c - 1);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(next, INTERVAL);
    return () => clearInterval(t);
  }, [isPaused, maxIndex]);

  const arrowBtn = (onClick: () => void, dir: "left" | "right") => (
    <button
      onClick={onClick}
      aria-label={dir === "left" ? "Anterior" : "Siguiente"}
      style={{
        position: "absolute", [dir]: "-1.25rem", top: "50%", transform: "translateY(-50%)",
        zIndex: 10, width: "2.5rem", height: "2.5rem", borderRadius: "50%",
        backgroundColor: "oklch(1 0 0)", border: "1px solid oklch(0.85 0.01 75)",
        boxShadow: "0 2px 8px oklch(0.20 0 0 / 0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "oklch(0.96 0.01 75)")}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "oklch(1 0 0)")}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {dir === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );

  return (
    <section
      className="py-10 md:py-16 lg:py-20"
      style={{ backgroundColor: "oklch(0.97 0.008 75)" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        <div className="section-divider mb-10" />

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <GoogleLogo />
            <span style={{ color: "oklch(0.45 0 0)", fontFamily: "'Lato', sans-serif", fontSize: "1rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Reseñas de Google
            </span>
          </div>
          <h2 className="font-light mb-3" style={{ color: "oklch(0.22 0 0)", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 6vw, 3.75rem)" }}>
            Lo Que Dicen <br />
            <span style={{ color: gold, fontStyle: "italic" }}>Nuestras Familias</span>
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "0.75rem" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1,2,3,4,5].map(i => <StarIcon key={i} filled={true} />)}
            </div>
            <span style={{ color: "oklch(0.05 0 0)", fontFamily: "'Lato', sans-serif", fontWeight: 600, fontSize: "1.2rem" }}>4.7</span>
            <span style={{ color: "oklch(0.55 0 0)", fontFamily: "'Lato', sans-serif", fontSize: "0.9rem" }}>· +3.468 reseñas</span>
          </div>
        </div>

        {/* Carousel */}
        <div style={{ position: "relative" }}>
          {arrowBtn(prev, "left")}

          <div style={{ overflow: "hidden" }}>
            <div style={{
              display: "flex",
              gap: "1.25rem",
              transform: `translateX(calc(-${current * (100 / visibleCount)}% - ${current * 1.25 / visibleCount}rem))`,
              transition: "transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)",
              alignItems: "stretch",
            }}>
              {REVIEWS.map((review) => (
                <div
                  key={review.id}
                  style={{
                    flexShrink: 0,
                    width: `calc(${100 / visibleCount}% - ${(visibleCount - 1) * 1.25 / visibleCount}rem)`,
                  }}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {arrowBtn(next, "right")}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
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

        <div className="section-divider mt-10" />
      </div>
    </section>
  );
}

import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  price: string | number;
  originalPrice?: string | number | null;
  imageUrl?: string | null;
  isOffer?: boolean;
  section?: string;
}

interface ProductSectionProps {
  subtitle: string;
  title: string;
  description: string;
  products: Product[];
  sectionId: string;
}

export default function ProductSection({ subtitle, title, description, products, sectionId }: ProductSectionProps) {
  const [page, setPage] = useState(0);
  const [, navigate] = useLocation();
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);
  const isDragging = useRef(false);

  // Mobile: 1 card per slide, Desktop: 4 per page
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const itemsPerPage = isMobile ? 2 : 4;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const start = page * itemsPerPage;
  const visible = products.slice(start, start + itemsPerPage);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  // Touch/swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    const diff = startXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    startXRef.current = null;
  };

  // Mouse drag support
  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    isDragging.current = false;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (startXRef.current !== null && Math.abs(e.clientX - startXRef.current) > 5) {
      isDragging.current = true;
    }
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    if (startXRef.current === null) return;
    const diff = startXRef.current - e.clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    startXRef.current = null;
  };

  const ArrowBtn = ({ dir, onClick, disabled }: { dir: "left" | "right"; onClick: () => void; disabled: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Anterior" : "Siguiente"}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [dir === "left" ? "left" : "right"]: "-1.1rem",
        zIndex: 10,
        width: "2.4rem",
        height: "2.4rem",
        borderRadius: "50%",
        backgroundColor: disabled ? "oklch(0.88 0 0)" : "oklch(0.10 0 0)",
        border: `1.5px solid ${disabled ? "oklch(0.80 0 0)" : "oklch(0.72 0.12 80 / 0.6)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
        transition: "background 0.2s, opacity 0.2s, transform 0.15s",
        boxShadow: disabled ? "none" : "0 2px 10px oklch(0 0 0 / 0.25)",
        flexShrink: 0,
      }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scale(1.1)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scale(1)"; }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke={disabled ? "oklch(0.60 0 0)" : "oklch(0.72 0.12 80)"}
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {dir === "left"
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );

  return (
    <section
      id={sectionId}
      className="py-10 md:py-16 lg:py-20"
      style={{ backgroundColor: "oklch(1 0 0)" }}
    >
      <div className="container">
        {/* Divider */}
        <div className="section-divider mb-10" />

        {/* Section header */}
        <div className="text-center mb-6 md:mb-10">
          <p
            className="text-xl md:text-2xl font-light italic mb-1"
            style={{ color: "oklch(0.38 0 0)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            {subtitle}
          </p>
          <h2
            className="font-light"
            style={{ color: "oklch(0.22 0 0)", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 6vw, 3.75rem)" }}
          >
            {title}
          </h2>
        </div>

        {/* Products carousel */}
        {visible.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl font-light italic" style={{ color: "oklch(0.55 0 0)", fontFamily: "'Cormorant Garamond', serif" }}>
              Próximamente disponible...
            </p>
            <p className="text-base mt-2" style={{ color: "oklch(0.65 0 0)", fontFamily: "'Lato', sans-serif" }}>
              Contáctanos para más información
            </p>
          </div>
        ) : (
          <div style={{ position: "relative", padding: "0 1.5rem" }}>
            {/* Left arrow */}
            {totalPages > 1 && (
              <ArrowBtn dir="left" onClick={prev} disabled={page === 0} />
            )}

            {/* Cards track — swipeable */}
            <div
              ref={trackRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                gap: isMobile ? "0.75rem" : "1.25rem",
                userSelect: "none",
                cursor: totalPages > 1 ? "grab" : "default",
              }}
            >
              {visible.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  imageUrl={product.imageUrl}
                  isOffer={product.isOffer}
                  section={product.section}
                />
              ))}
            </div>

            {/* Right arrow */}
            {totalPages > 1 && (
              <ArrowBtn dir="right" onClick={next} disabled={page === totalPages - 1} />
            )}
          </div>
        )}

        {/* Dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Página ${i + 1}`}
                style={{
                  width: i === page ? "1.8rem" : "0.55rem",
                  height: "0.55rem",
                  borderRadius: "9999px",
                  backgroundColor: i === page ? "oklch(0.72 0.12 80)" : "oklch(0.75 0.01 75)",
                  border: "none",
                  cursor: "pointer",
                  transition: "width 0.3s, background 0.3s",
                  padding: 0,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* CTA button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate(`/catalogo?seccion=${sectionId}`)}
            className="btn-gold px-10 py-3.5 rounded-full text-base"
          >
            Ver Catálogo
          </button>
        </div>

        {/* Description */}
        <p
          className="text-center mt-8 text-base font-light max-w-xl mx-auto leading-relaxed"
          style={{ color: "oklch(0.45 0 0)", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
        >
          {description}
        </p>
      </div>
    </section>
  );
}

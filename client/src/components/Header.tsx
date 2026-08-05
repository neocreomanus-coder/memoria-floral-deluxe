import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";

const LOGO_URL = "/manus-storage/logo-memoria-floral_085b0d4e.jpeg";

const NAV_ITEMS = [
  { label: "Por Menos De $200.000", href: "#por_menos_200" },
  { label: "Categorías", href: "#categorias" },
  { label: "Sudarios", href: "#sudarios" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const { count, openCart } = useCart();

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("#")) {
      // If we're not on home, navigate there first
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: "oklch(1 0 0)",
        borderBottom: "1px solid oklch(0.90 0.015 75)",
        boxShadow: "0 2px 16px oklch(0.20 0 0 / 0.07)",
      }}
    >


      {/* Main header */}
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-2.5 md:py-3">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 md:gap-4 flex-shrink-0 group" style={{ textDecoration: "none" }}>
          <div
            className="relative flex-shrink-0 rounded-full overflow-hidden"
            style={{
              width: "46px",
              height: "46px",
              border: "2px solid oklch(0.72 0.12 80)",
              boxShadow: "0 0 0 1px oklch(0.72 0.12 80 / 0.25), 0 3px 12px oklch(0.72 0.12 80 / 0.18)",
            }}
          >
            <img
              src={LOGO_URL}
              alt="Memoria Floral Deluxe"
              className="w-full h-full object-contain"
              style={{ backgroundColor: "oklch(0.98 0.005 75)" }}
            />
          </div>

          {/* Brand name */}
          <div className="flex flex-col justify-center">
            <div
              className="font-light tracking-[0.15em] uppercase leading-none"
              style={{
                color: "oklch(0.08 0 0)",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(0.78rem, 2.5vw, 1.25rem)",
              }}
            >
              Memoria Floral
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="h-px flex-1" style={{ backgroundColor: "oklch(0.72 0.12 80 / 0.5)" }} />
              <span
                className="tracking-[0.35em] uppercase"
                style={{
                  color: "oklch(0.72 0.12 80)",
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.55rem",
                }}
              >
                Deluxe
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: "oklch(0.72 0.12 80 / 0.5)" }} />
            </div>
            <div
              className="hidden sm:block tracking-[0.1em] mt-0.5"
              style={{
                color: "oklch(0.50 0 0)",
                fontFamily: "'Lato', sans-serif",
                fontSize: "0.72rem",
              }}
            >
              Arreglos Fúnebres · Barranquilla
            </div>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="relative text-base font-medium tracking-widest uppercase transition-all group/nav"
              style={{
                color: "oklch(0.32 0 0)",
                fontFamily: "'Lato', sans-serif",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              {item.label}
              <span
                className="absolute bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover/nav:w-full"
                style={{ backgroundColor: "oklch(0.72 0.12 80)" }}
              />
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* WhatsApp — desktop only */}
          <a
            href="https://wa.me/573011621986"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-base"
          >
            <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor">
              <ellipse cx="16" cy="7" rx="4" ry="7" opacity="0.9"/>
              <ellipse cx="16" cy="25" rx="4" ry="7" opacity="0.9"/>
              <ellipse cx="7" cy="16" rx="7" ry="4" opacity="0.9"/>
              <ellipse cx="25" cy="16" rx="7" ry="4" opacity="0.9"/>
              <circle cx="16" cy="16" r="5" fill="oklch(0 0 0)"/>
              <circle cx="16" cy="16" r="3" fill="oklch(0.82 0.14 85)"/>
            </svg>
            WhatsApp
          </a>

          {/* Cart icon — always visible */}
          <button
            onClick={openCart}
            className="relative p-2 rounded-full transition-colors hover:bg-gray-100"
            aria-label="Carrito"
            style={{ color: "oklch(0.28 0 0)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-base font-bold"
                style={{ backgroundColor: "oklch(0.72 0.12 80)", color: "oklch(0 0 0)", fontFamily: "'Lato', sans-serif", fontSize: "0.65rem" }}
              >
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>

          {/* Hamburger — mobile/tablet */}
          <button
            className="lg:hidden p-2 rounded-md transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
            style={{ color: "oklch(0.28 0 0)" }}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="lg:hidden border-t"
          style={{ backgroundColor: "oklch(1 0 0)", borderColor: "oklch(0.90 0.015 75)" }}
        >
          {/* Mobile contact bar */}
          <div
            className="flex items-center justify-between px-4 py-2 text-base"
            style={{ backgroundColor: "oklch(0 0 0)", color: "oklch(0.72 0.02 75)", fontFamily: "'Lato', sans-serif" }}
          >
            <a href="tel:+573011621986" className="flex items-center gap-1.5">
              <span style={{ color: "oklch(0.72 0.12 80)" }}>📞</span>301 162 1986
            </a>
            <span style={{ color: "oklch(0.50 0 0)" }}>|</span>
            <span className="flex items-center gap-1.5">
              <span style={{ color: "oklch(0.72 0.12 80)" }}>🕐</span>L-S: 7AM–6PM
            </span>
          </div>

          <nav className="flex flex-col py-2 px-4 gap-0">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="text-left text-base font-medium tracking-widest uppercase py-3.5 border-b transition-colors hover:opacity-60 flex items-center justify-between"
                style={{
                  color: "oklch(0.28 0 0)",
                  fontFamily: "'Lato', sans-serif",
                  borderColor: "oklch(0.93 0.01 75)",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "0.72rem",
                }}
              >
                {item.label}
                <span style={{ color: "oklch(0.72 0.12 80)", fontSize: "1rem" }}>›</span>
              </button>
            ))}
            <a
              href="https://wa.me/573011621986"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold flex items-center justify-center gap-2 px-4 py-3.5 rounded-full text-base mt-3 mb-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contactar por WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

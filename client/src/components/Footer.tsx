const LOGO_URL = "/manus-storage/logo-memoria-floral_085b0d4e.jpeg";

const CATEGORIES: { label: string; id: string }[] = [
  { label: "Coronas Fúnebres", id: "coronas_funebres" },
  { label: "Sudarios", id: "sudarios" },
  { label: "Rosas Inmortalizadas", id: "rosas_inmortalizadas" },
  { label: "Por Menos de $200.000", id: "por_menos_200" },
];

const darkText = "oklch(0.22 0 0)";
const mediumText = "oklch(0.45 0 0)";
const lightText = "oklch(0.60 0 0)";
const gold = "oklch(0.72 0.12 80)";
const serif = "'Roboto', sans-serif";
const sans = "'Roboto', sans-serif";

export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer style={{ backgroundColor: "oklch(1 0 0)" }}>
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={LOGO_URL}
                alt="Memoria Floral Deluxe"
                className="w-16 h-16 object-contain rounded-full"
                style={{ border: "2px solid " + gold }}
              />
            </div>
            <p style={{ color: gold, fontFamily: serif, fontSize: "1.4rem", fontWeight: 300, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
              Memoria Floral
            </p>
            <p style={{ color: gold, fontFamily: sans, fontSize: "0.75rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
              — Deluxe —
            </p>
            <p style={{ color: mediumText, fontFamily: serif, fontSize: "1.1rem", fontStyle: "italic", lineHeight: 1.7 }}>
              Floristería especializada en arreglos fúnebres en Barranquilla y alrededores.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: gold, fontFamily: serif, fontSize: "1.1rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Categorías
            </h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => scrollTo(cat.id)}
                    style={{ color: darkText, fontFamily: serif, fontSize: "1.05rem", fontWeight: 300, background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", transition: "opacity 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: gold, fontFamily: serif, fontSize: "1.1rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Contacto
            </h4>
            <ul style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/>
                </svg>
                <a href="https://wa.me/573011621986" target="_blank" rel="noopener noreferrer"
                  style={{ color: darkText, fontFamily: serif, fontSize: "1.05rem", fontWeight: 300, textDecoration: "none" }}>
                  301 162 1986
                </a>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span style={{ color: darkText, fontFamily: serif, fontSize: "1.05rem", fontWeight: 300 }}>
                  Barranquilla, Colombia
                </span>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "3px" }}>
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span style={{ color: darkText, fontFamily: serif, fontSize: "1.05rem", fontWeight: 300, lineHeight: 1.6 }}>
                  Lunes a Sábado: 7AM – 6PM<br />Domingos y Festivos: 7AM – 2PM
                </span>
              </li>
            </ul>
          </div>

          {/* Social & Cobertura */}
          <div>
            <h4 style={{ color: gold, fontFamily: serif, fontSize: "1.1rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Síguenos
            </h4>
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.75rem" }}>
              {[
                { href: "https://instagram.com/memoriafloraldeluxe", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                { href: "https://www.facebook.com/share/19MPYTEpSM/?mibextid=wwXIfr", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
              ].map(({ href, icon }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "oklch(0.93 0 0)", color: gold, border: "1px solid oklch(0.72 0.12 80 / 0.3)", transition: "opacity 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  {icon}
                </a>
              ))}
            </div>

            <h4 style={{ color: gold, fontFamily: serif, fontSize: "1.1rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Cobertura
            </h4>
            <p style={{ color: darkText, fontFamily: serif, fontSize: "1.05rem", fontWeight: 300, lineHeight: 1.8 }}>
              Barranquilla · Soledad<br />Malambo · Puerto Colombia<br />Galapa
            </p>
          </div>
        </div>
      </div>

      {/* Métodos de pago */}
      <div style={{ borderTop: "1px solid oklch(0.90 0 0)", padding: "2rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <img
            src="/manus-storage/pasted_file_bEKdAL_image_9557b757.png"
            alt="Métodos de pago aceptados"
            className="w-full"
            style={{ maxWidth: "900px", margin: "0 auto", objectFit: "contain", maxHeight: "280px" }}
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid oklch(0.90 0 0)", padding: "1rem 0" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", textAlign: "center" }}>
          <p style={{ color: lightText, fontFamily: sans, fontSize: "0.78rem", letterSpacing: "0.05em" }}>
            © 2026 Memoria Floral Deluxe. Todos los derechos reservados.
          </p>
          <p style={{ color: mediumText, fontFamily: sans, fontSize: "0.72rem" }}>
            Barranquilla, Colombia
          </p>
          <p style={{ color: mediumText, fontFamily: sans, fontSize: "0.7rem", marginTop: "0.5rem" }}>
            Tienda diseñada por{" "}
            <a href="https://wa.me/573244317594" target="_blank" rel="noopener noreferrer" style={{ color: gold, fontWeight: 600, textDecoration: "none" }}>
              NeoCreoStudios
            </a>
            {" "} •{" "}
            <a href="https://instagram.com/neocreostudio" target="_blank" rel="noopener noreferrer" style={{ color: gold, fontWeight: 600, textDecoration: "none" }}>
              @neocreostudio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

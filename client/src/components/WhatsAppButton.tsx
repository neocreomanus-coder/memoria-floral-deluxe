export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/573011621986?text=Hola,%20me%20interesa%20un%20arreglo%20fúnebre"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
      style={{
        width: "62px",
        height: "62px",
        background:
          "linear-gradient(135deg, oklch(0.62 0.12 80) 0%, oklch(0.82 0.14 85) 50%, oklch(0.62 0.12 80) 100%)",
        backgroundSize: "200% 200%",
        animation: "shimmer 3s linear infinite, goldPulse 2.5s ease-in-out infinite",
        boxShadow: "0 4px 22px oklch(0.72 0.12 80 / 0.55)",
      }}
    >
      {/* Flor dorada con pétalos blancos */}
      <svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pétalos cardinales — blancos */}
        <ellipse cx="32" cy="13" rx="6.5" ry="12" fill="white" opacity="0.95" />
        <ellipse cx="32" cy="51" rx="6.5" ry="12" fill="white" opacity="0.95" />
        <ellipse cx="13" cy="32" rx="12" ry="6.5" fill="white" opacity="0.95" />
        <ellipse cx="51" cy="32" rx="12" ry="6.5" fill="white" opacity="0.95" />
        {/* Pétalos diagonales — blanco suave */}
        <ellipse cx="18" cy="18" rx="6" ry="11" fill="white" opacity="0.78" transform="rotate(-45 18 18)" />
        <ellipse cx="46" cy="18" rx="6" ry="11" fill="white" opacity="0.78" transform="rotate(45 46 18)" />
        <ellipse cx="18" cy="46" rx="6" ry="11" fill="white" opacity="0.78" transform="rotate(45 18 46)" />
        <ellipse cx="46" cy="46" rx="6" ry="11" fill="white" opacity="0.78" transform="rotate(-45 46 46)" />
        {/* Centro oscuro */}
        <circle cx="32" cy="32" r="11" fill="oklch(0 0 0)" />
        {/* Centro dorado */}
        <circle cx="32" cy="32" r="7.5" fill="oklch(0.82 0.14 85)" />
        {/* Punto central blanco */}
        <circle cx="32" cy="32" r="3.5" fill="white" opacity="0.92" />
      </svg>
    </a>
  );
}

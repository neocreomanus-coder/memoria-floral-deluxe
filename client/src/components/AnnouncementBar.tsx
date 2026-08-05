const ITEMS = [
  "✦ Nuestros Precios Son De Fábrica",
  "Somos Los #1 En Arreglos Fúnebres De Barranquilla",
  "✦ Pago Seguro",
];

const SEPARATOR = "          ·          ";

function Segment() {
  return (
    <span style={{ display: "inline-block", flexShrink: 0 }}>
      {ITEMS.map((item, i) => (
        <span key={i}>
          <span>{item}</span>
          <span style={{ opacity: 0.4 }}>{SEPARATOR}</span>
        </span>
      ))}
    </span>
  );
}

export default function AnnouncementBar() {
  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: "oklch(0.05 0 0)",
        color: "oklch(0.72 0.12 80)",
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "0.85rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        textShadow: "0 0 12px oklch(0.72 0.12 80 / 0.5)",
        padding: "0.5rem 0",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          animation: "marquee-scroll 8s linear infinite",
          willChange: "transform",
        }}
      >
        {/* 4 copias para garantizar cobertura continua en cualquier pantalla */}
        <Segment />
        <Segment />
        <Segment />
        <Segment />
      </div>
    </div>
  );
}

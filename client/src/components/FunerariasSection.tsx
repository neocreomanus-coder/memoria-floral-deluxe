import { useState, useEffect } from "react";

const SLIDES = [
  {
    id: 1,
    main: "/manus-storage/funeraria-1_6a78808c.png",
  },
  {
    id: 2,
    main: "/manus-storage/funeraria-2_717cb5d3.png",
  },
  {
    id: 3,
    main: "/manus-storage/funeraria-3_50d982d1.png",
  },
  {
    id: 4,
    main: "/manus-storage/funeraria-4_6ca50cc4.png",
  },
  {
    id: 5,
    main: "/manus-storage/funeraria-5_4c0e275c.png",
  },
  {
    id: 6,
    main: "/manus-storage/funeraria-6_36bae8ad.png",
  },
];

export default function FunerariasSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);

  return (
    <section
      className="py-10 md:py-16 lg:py-20"
      style={{ backgroundColor: "oklch(0.97 0.008 75)" }}
    >
      <div className="container">
        {/* Divider */}
        <div className="section-divider mb-10" />

        {/* Header */}
        <div className="text-center mb-6 md:mb-10">
          <p
            className="text-xl md:text-2xl font-light italic mb-1"
            style={{ color: "oklch(0.38 0 0)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            Nuestras Entregas En
          </p>
          <h2
            className="font-light"
            style={{
              color: "oklch(0.22 0 0)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.8rem, 6vw, 3.75rem)",
            }}
          >
            Funerarias
          </h2>
        </div>

        {/* Carousel — imagen principal única */}
        <div className="mx-auto" style={{ maxWidth: "900px" }}>

          {/* Main image */}
          <div
            className="relative overflow-hidden rounded-xl md:rounded-2xl"
            style={{ aspectRatio: "16/7" }}
          >
            {SLIDES.map((s, i) => (
              <img
                key={s.id}
                src={s.main}
                alt={`Funeraria Barranquilla ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                style={{ opacity: i === current ? 1 : 0 }}
              />
            ))}

            {/* Prev arrow */}
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 text-lg"
              style={{
                backgroundColor: "oklch(1 0 0 / 0.75)",
                color: "oklch(0.22 0 0)",
                backdropFilter: "blur(4px)",
              }}
              aria-label="Anterior"
            >
              ‹
            </button>

            {/* Next arrow */}
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 text-lg"
              style={{
                backgroundColor: "oklch(1 0 0 / 0.75)",
                color: "oklch(0.22 0 0)",
                backdropFilter: "blur(4px)",
              }}
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2 mt-4">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="transition-all duration-300"
                style={{
                  width: i === current ? "22px" : "10px",
                  height: "10px",
                  borderRadius: "5px",
                  backgroundColor:
                    i === current
                      ? "oklch(0.32 0.06 240)"
                      : "oklch(0.32 0.06 240 / 0.28)",
                }}
                aria-label={`Imagen ${i + 1}`}
              />
            ))}
          </div>


        </div>

        {/* Bottom divider */}
        <div className="section-divider mt-10" />
      </div>
    </section>
  );
}

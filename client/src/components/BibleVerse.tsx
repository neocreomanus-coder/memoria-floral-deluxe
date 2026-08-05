export default function BibleVerse() {
  return (
    <section
      className="relative py-14 md:py-20 overflow-hidden"
      style={{ backgroundColor: "oklch(0 0 0)" }}
    >
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 15% 50%, oklch(0.72 0.12 80 / 0.07) 0%, transparent 55%), radial-gradient(ellipse at 85% 50%, oklch(0.72 0.12 80 / 0.05) 0%, transparent 50%)",
        }}
      />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          {/* Top ornament */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px flex-1 max-w-16" style={{ backgroundColor: "oklch(0.72 0.12 80 / 0.4)" }} />
            {/* Cross ornament */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v20M2 12h20" stroke="oklch(0.72 0.12 80)" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="2.5" fill="oklch(0.72 0.12 80 / 0.3)" stroke="oklch(0.72 0.12 80)" strokeWidth="1"/>
            </svg>
            <div className="h-px flex-1 max-w-16" style={{ backgroundColor: "oklch(0.72 0.12 80 / 0.4)" }} />
          </div>

          {/* Reference */}
          <p
            className="tracking-[0.3em] uppercase mb-6"
            style={{
              color: "oklch(0.72 0.12 80)",
              fontFamily: "'Lato', sans-serif",
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            Juan 11 : 25 – 27
          </p>

          {/* Verse text */}
          <blockquote
            className="font-light leading-relaxed italic mb-6"
            style={{
              color: "oklch(0.90 0.015 75)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.15rem, 3.5vw, 1.65rem)",
              lineHeight: 1.75,
            }}
          >
            "Le dijo Jesús: Yo soy la resurrección y la vida; el que cree en mí,
            aunque esté muerto, vivirá. Y todo aquel que vive y cree en mí, no
            morirá eternamente. ¿Crees esto? Le dijo: Sí, Señor; yo he creído
            que tú eres el Cristo, el Hijo de Dios, que has venido al mundo."
          </blockquote>

          {/* Bottom ornament */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px flex-1 max-w-16" style={{ backgroundColor: "oklch(0.72 0.12 80 / 0.4)" }} />
            {/* Floral ornament */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="oklch(0.72 0.12 80 / 0.6)">
              <ellipse cx="12" cy="5" rx="3" ry="5" />
              <ellipse cx="12" cy="19" rx="3" ry="5" />
              <ellipse cx="5" cy="12" rx="5" ry="3" />
              <ellipse cx="19" cy="12" rx="5" ry="3" />
              <circle cx="12" cy="12" r="2.5" fill="oklch(0.72 0.12 80)" />
            </svg>
            <div className="h-px flex-1 max-w-16" style={{ backgroundColor: "oklch(0.72 0.12 80 / 0.4)" }} />
          </div>

        </div>
      </div>
    </section>
  );
}

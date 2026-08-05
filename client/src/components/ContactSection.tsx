export default function ContactSection() {
  return (
    <section id="contacto" className="py-10 md:py-16 lg:py-20" style={{ backgroundColor: "oklch(0.08 0 0)" }}>
      <div className="container">
        <div className="text-center mb-8 md:mb-12">
          <p
            className="text-xl md:text-2xl font-light italic mb-1"
            style={{ color: "oklch(0.72 0.12 80)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            Estamos Para Servirte
          </p>
          <h2
            className="font-light"
            style={{ color: "oklch(0.95 0.015 75)", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
          >
            Contacto
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* WhatsApp */}
          <div className="flex flex-col items-center text-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "oklch(0.72 0.12 80 / 0.15)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="oklch(0.72 0.12 80)">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <p className="text-base tracking-widest uppercase mb-1" style={{ color: "oklch(0.72 0.12 80)", fontFamily: "'Lato', sans-serif" }}>WhatsApp</p>
              <a
                href="https://wa.me/573011621986"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-light hover:opacity-70 transition-opacity"
                style={{ color: "oklch(0.92 0.015 75)", fontFamily: "'Cormorant Garamond', serif" }}
              >
                301 162 1986
              </a>
            </div>
          </div>



          {/* Horarios */}
          <div className="flex flex-col items-center text-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "oklch(0.72 0.12 80 / 0.15)" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="oklch(0.72 0.12 80)" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <p className="text-base tracking-widest uppercase mb-1" style={{ color: "oklch(0.72 0.12 80)", fontFamily: "'Lato', sans-serif" }}>Horarios</p>
              <p className="text-base font-light" style={{ color: "oklch(0.92 0.015 75)", fontFamily: "'Cormorant Garamond', serif" }}>
                L–S: 7AM – 6PM
              </p>
              <p className="text-base font-light" style={{ color: "oklch(0.70 0 0)", fontFamily: "'Cormorant Garamond', serif" }}>
                Dom/Fest: 7AM – 2PM
              </p>
            </div>
          </div>

          {/* Cobertura */}
          <div className="flex flex-col items-center text-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "oklch(0.72 0.12 80 / 0.15)" }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="oklch(0.72 0.12 80)" strokeWidth="1.5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-base tracking-widest uppercase mb-1" style={{ color: "oklch(0.72 0.12 80)", fontFamily: "'Lato', sans-serif" }}>Cobertura</p>
              <p className="text-base font-light" style={{ color: "oklch(0.92 0.015 75)", fontFamily: "'Cormorant Garamond', serif" }}>
                Barranquilla
              </p>
              <p className="text-base font-light leading-relaxed" style={{ color: "oklch(0.70 0 0)", fontFamily: "'Cormorant Garamond', serif" }}>
                Zona Metropolitana
              </p>
            </div>
          </div>
        </div>

        {/* CTA WhatsApp */}
        <div className="flex justify-center mt-8 md:mt-12">
          <a
            href="https://wa.me/573011621986?text=Hola,%20me%20interesa%20un%20arreglo%20fúnebre"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-10 py-4 text-base font-bold tracking-widest uppercase transition-all hover:opacity-80"
            style={{
              backgroundColor: "oklch(0.72 0.12 80)",
              color: "oklch(0.08 0 0)",
              fontFamily: "'Lato', sans-serif",
              borderRadius: "999px",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

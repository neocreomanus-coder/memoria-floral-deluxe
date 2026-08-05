import { trpc } from "@/lib/trpc";

export default function GallerySection() {
  const { data: images = [], isLoading } = trpc.gallery.list.useQuery();

  return (
    <section id="galeria" className="py-16 md:py-20" style={{ backgroundColor: "oklch(0.93 0.015 75)" }}>
      <div className="container">
        <div className="section-divider mb-10" />
        <div className="text-center mb-10">
          <p
            className="text-xl font-light italic mb-1"
            style={{ color: "oklch(0.38 0 0)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            Nuestros Trabajos
          </p>
          <h2
            className="text-4xl md:text-5xl font-light"
            style={{ color: "oklch(0.22 0 0)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            Galería
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="rounded-xl animate-pulse"
                style={{ aspectRatio: i % 3 === 0 ? "1/1.3" : "1/1", backgroundColor: "oklch(0.88 0.02 75)" }}
              />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16">
            <p
              className="text-xl font-light italic"
              style={{ color: "oklch(0.55 0 0)", fontFamily: "'Cormorant Garamond', serif" }}
            >
              Galería en construcción...
            </p>
            <p className="text-base mt-2" style={{ color: "oklch(0.65 0 0)", fontFamily: "'Lato', sans-serif" }}>
              Pronto compartiremos nuestros trabajos
            </p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {images.map((img, i) => (
              <div
                key={img.id}
                className="break-inside-avoid rounded-xl overflow-hidden product-card"
                style={{ marginBottom: "0.75rem" }}
              >
                <img
                  src={img.imageUrl}
                  alt={img.title ?? `Arreglo fúnebre ${i + 1}`}
                  className="w-full object-cover"
                  style={{ display: "block" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

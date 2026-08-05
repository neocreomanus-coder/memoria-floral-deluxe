import { useState } from "react";
import { trpc } from "@/lib/trpc";
import ProductCard from "./ProductCard";

export default function FeaturedCarousel() {
  const { data: products = [], isLoading } = trpc.products.featured.useQuery();
  const [current, setCurrent] = useState(0);

  if (isLoading) {
    return (
      <section className="py-16" style={{ backgroundColor: "oklch(0.955 0.018 75)" }}>
        <div className="container">
          <div className="section-divider mb-10" />
          <div className="text-center mb-10">
            <h2 className="text-4xl font-light" style={{ color: "oklch(0.22 0 0)", fontFamily: "'Cormorant Garamond', serif" }}>
              Productos Destacados
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3]" style={{ backgroundColor: "oklch(0.88 0.02 75)" }} />
                <div className="h-12" style={{ backgroundColor: "oklch(0.32 0.06 240 / 0.3)" }} />
                <div className="h-8" style={{ backgroundColor: "oklch(0.90 0.02 75)" }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  const VISIBLE = 4;
  const total = products.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const visible = Array.from({ length: Math.min(VISIBLE, total) }, (_, i) => products[(current + i) % total]);

  return (
    <section id="destacados" className="py-16 md:py-20" style={{ backgroundColor: "oklch(0.955 0.018 75)" }}>
      <div className="container">
        <div className="section-divider mb-10" />

        <div className="text-center mb-10">
          <h2
            className="text-4xl md:text-5xl font-light"
            style={{ color: "oklch(0.22 0 0)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            Productos Destacados
          </h2>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {visible.map((product, i) => (
              <ProductCard
                key={`${product.id}-${i}`}
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

          {total > VISIBLE && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:opacity-70"
                style={{ borderColor: "oklch(0.32 0.06 240)", color: "oklch(0.32 0.06 240)" }}
              >
                ‹
              </button>
              {Array.from({ length: Math.min(total, 8) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="w-2.5 h-2.5 rounded-full transition-all"
                  style={{
                    backgroundColor: current === i ? "oklch(0.32 0.06 240)" : "oklch(0.32 0.06 240 / 0.3)",
                  }}
                />
              ))}
              <button
                onClick={next}
                className="w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:opacity-70"
                style={{ borderColor: "oklch(0.32 0.06 240)", color: "oklch(0.32 0.06 240)" }}
              >
                ›
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <a
            href="https://wa.me/573011621986"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-3 text-base font-bold tracking-widest uppercase transition-all hover:opacity-80"
            style={{
              backgroundColor: "oklch(0.38 0.12 10)",
              color: "white",
              fontFamily: "'Lato', sans-serif",
              borderRadius: "999px",
            }}
          >
            VER CATÁLOGO COMPLETO
          </a>
        </div>
      </div>
    </section>
  );
}

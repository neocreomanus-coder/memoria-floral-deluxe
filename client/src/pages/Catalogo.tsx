import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const SECTIONS = [
  { id: "all", label: "Todos los Arreglos" },
  { id: "coronas_funebres", label: "Coronas Fúnebres" },
  { id: "sudarios", label: "Sudarios" },
  { id: "rosas_inmortalizadas", label: "Rosas Inmortalizadas" },
  { id: "por_menos_200", label: "Por Menos de $200.000" },
];

function formatPrice(price: string | number) {
  const n = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

export default function Catalogo() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialSection = params.get("seccion") || "all";

  const [activeSection, setActiveSection] = useState(initialSection);
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();

  const { data: products = [], isLoading } = trpc.products.all.useQuery();

  // Update active section when URL param changes
  useEffect(() => {
    const p = new URLSearchParams(search);
    const s = p.get("seccion") || "all";
    setActiveSection(s);
  }, [search]);

  const filtered = products.filter((p) => {
    const matchSection = activeSection === "all" || p.section === activeSection;
    const matchSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSection && matchSearch;
  });

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    if (id === "all") {
      navigate("/catalogo");
    } else {
      navigate(`/catalogo?seccion=${id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(1 0 0)" }}>
      <Header />

      {/* Page hero */}
      <div
        className="py-8 md:py-14 lg:py-20 relative overflow-hidden"
        style={{ backgroundColor: "oklch(0 0 0)" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, oklch(0.72 0.12 80 / 0.4) 0%, transparent 55%), radial-gradient(circle at 80% 30%, oklch(0.38 0.12 10 / 0.3) 0%, transparent 45%)",
          }}
        />
        <div className="container relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12" style={{ backgroundColor: "oklch(0.72 0.12 80 / 0.6)" }} />
            <span
              className="text-base tracking-[0.3em] uppercase"
              style={{ color: "oklch(0.72 0.12 80)", fontFamily: "'Lato', sans-serif" }}
            >
              Memoria Floral Deluxe
            </span>
            <div className="h-px w-12" style={{ backgroundColor: "oklch(0.72 0.12 80 / 0.6)" }} />
          </div>
          <h1
            className="font-light mb-3"
            style={{ color: "oklch(0.97 0.01 75)", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 7vw, 4rem)" }}
          >
            Catálogo de{" "}
            <span style={{ color: "oklch(0.82 0.12 80)", fontStyle: "italic" }}>
              Arreglos Fúnebres
            </span>
          </h1>
          <p
            className="text-base md:text-base lg:text-lg font-light max-w-xl mx-auto"
            style={{ color: "oklch(0.68 0.02 75)", fontFamily: "'Lato', sans-serif" }}
          >
            Flores que expresan amor, respeto y dignidad
          </p>
        </div>
      </div>

      <main className="flex-1 py-10 md:py-14">
        <div className="container">

          {/* Search + filter bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-6 md:mb-10 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="oklch(0.55 0 0)"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Buscar arreglo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-full text-base outline-none transition-all"
                style={{
                  border: "1.5px solid oklch(0.88 0.02 75)",
                  fontFamily: "'Lato', sans-serif",
                  color: "oklch(0.05 0 0)",
                  backgroundColor: "oklch(0.98 0.005 75)",
                }}
              />
            </div>

            {/* Results count */}
            <p
              className="text-base"
              style={{ color: "oklch(0.55 0 0)", fontFamily: "'Lato', sans-serif" }}
            >
              {filtered.length} {filtered.length === 1 ? "arreglo" : "arreglos"} disponibles
            </p>
          </div>

          {/* Section filter pills — horizontal scroll on mobile */}
          <div className="flex gap-2 mb-6 md:mb-10 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSectionChange(s.id)}
                className="px-4 py-2 rounded-full text-base font-medium tracking-wide uppercase transition-all"
                style={{ flexShrink: 0,
                  backgroundColor:
                    activeSection === s.id
                      ? "oklch(0 0 0)"
                      : "oklch(0.96 0.01 75)",
                  color:
                    activeSection === s.id
                      ? "oklch(0.82 0.12 80)"
                      : "oklch(0.38 0 0)",
                  border:
                    activeSection === s.id
                      ? "1.5px solid oklch(0.72 0.12 80 / 0.5)"
                      : "1.5px solid oklch(0.88 0.02 75)",
                  fontFamily: "'Lato', sans-serif",
                  cursor: "pointer",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Products grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square" style={{ backgroundColor: "oklch(0.92 0.01 75)" }} />
                  <div className="p-3 space-y-2">
                    <div className="h-3 rounded" style={{ backgroundColor: "oklch(0.92 0.01 75)" }} />
                    <div className="h-3 w-2/3 rounded" style={{ backgroundColor: "oklch(0.92 0.01 75)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🌸</p>
              <p
                className="text-2xl font-light mb-2"
                style={{ color: "oklch(0.38 0 0)", fontFamily: "'Cormorant Garamond', serif" }}
              >
                {searchQuery
                  ? `Sin resultados para "${searchQuery}"`
                  : "Próximamente disponible"}
              </p>
              <p
                className="text-base mb-8"
                style={{ color: "oklch(0.55 0 0)", fontFamily: "'Lato', sans-serif" }}
              >
                Contáctanos para solicitar un arreglo personalizado
              </p>
              <a
                href="https://wa.me/573011621986?text=Hola,%20quisiera%20información%20sobre%20sus%20arreglos%20fúnebres"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-8 py-3.5 rounded-full text-base"
              >
                Consultar por WhatsApp
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((product) => (
                <CatalogCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

const CATEGORY_IMAGES: Record<string, string> = {
  coronas_funebres: "/manus-storage/cat-coronas_1f5a7d59.jpg",
  sudarios: "/manus-storage/cat-altar_68168df9.jpg",
  rosas_inmortalizadas: "/manus-storage/cat-rosas-inmortalizadas_734fdfc2.png",
};

function CatalogCard({ product }: { product: { id: number; name: string; price: string | number; originalPrice?: string | number | null; imageUrl?: string | null; isOffer?: boolean; section?: string } }) {
  const sectionLabel = SECTIONS.find((s) => s.id === product.section)?.label ?? product.section ?? "";
  const { addItem } = useCart();
  const [, navigate] = useLocation();
  const displayImage = product.imageUrl || (product.section ? CATEGORY_IMAGES[product.section] : null);
  const priceNum = typeof product.price === "string" ? parseFloat(product.price) : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: product.id, name: product.name, price: priceNum, imageUrl: displayImage, section: product.section });
    toast.success(`"${product.name}" agregado al carrito`);
  };

  return (
    <div
      className="product-card rounded-2xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: "oklch(1 0 0)",
        border: "1px solid oklch(0.92 0.01 75)",
        boxShadow: "0 2px 12px oklch(0.20 0 0 / 0.06)",
      }}
    >
      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer"
        onClick={() => { navigate(`/producto/${product.id}`); window.scrollTo({ top: 0, behavior: "instant" }); }}
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "oklch(0.96 0.01 75)" }}
          >
            <span style={{ fontSize: "48px", opacity: 0.3 }}>🌸</span>
          </div>
        )}
        {product.isOffer && (
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-base font-bold"
            style={{
              backgroundColor: "oklch(0.38 0.12 10)",
              color: "white",
              fontFamily: "'Lato', sans-serif",
            }}
          >
            ¡Oferta!
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        {sectionLabel && (
          <span
            className="text-base uppercase tracking-wider"
            style={{ color: "oklch(0.72 0.12 80)", fontFamily: "'Lato', sans-serif" }}
          >
            {sectionLabel}
          </span>
        )}
        <p
          className="text-base font-medium leading-snug"
          style={{ color: "oklch(0.05 0 0)", fontFamily: "'Lato', sans-serif" }}
        >
          {product.name}
        </p>
        <div className="flex flex-col items-start mt-auto pt-1">
          {product.originalPrice && (
            <span
              className="line-through block"
              style={{ color: "oklch(0.60 0 0)", fontFamily: "'Lato', sans-serif", fontSize: "clamp(0.62rem, 3.2vw, 0.82rem)", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}
            >
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span
            className="font-semibold block"
            style={{ color: "oklch(0.28 0 0)", fontFamily: "'Lato', sans-serif", fontSize: "clamp(0.80rem, 4vw, 1rem)", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}
          >
            {formatPrice(product.price)}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className="btn-gold mt-2 rounded-full w-full flex items-center justify-center gap-1.5"
          style={{ padding: "0.45rem 0.5rem", fontSize: "clamp(0.65rem, 2vw, 0.82rem)", fontWeight: 700, lineHeight: 1.3 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Agregar al carrito
        </button>
        <a
          href={`https://wa.me/573011621986?text=Hola,%20me%20interesa%20el%20arreglo:%20${encodeURIComponent(product.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 rounded-full text-center flex items-center justify-center gap-1.5 font-bold transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#25D366", color: "white", fontFamily: "'Lato', sans-serif", padding: "0.45rem 0.5rem", fontSize: "clamp(0.65rem, 2vw, 0.82rem)", lineHeight: 1.3 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Pedir por WhatsApp
        </a>
      </div>
    </div>
  );
}

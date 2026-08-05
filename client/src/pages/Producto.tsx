import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const CINTA_MARCADA_PRICE = 12000;
const TRIPODE_PRICE = 15000;

const SECTION_NAMES: Record<string, string> = {
  coronas_funebres: "Coronas Fúnebres",
  arreglos_altar: "Arreglos de Altar",
  cruces_florales: "Cruces Florales",
  cojines_florales: "Cojines Florales",
  canastas_funebres: "Canastas Fúnebres",
  ramos_funebres: "Ramos Fúnebres",
};

function formatPrice(v: string | number) {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

function StarRating({ rating = 4.8, count = 0 }: { rating?: number; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 24 24"
            fill={i <= Math.floor(rating) ? "#D4A017" : i - 0.5 <= rating ? "url(#half)" : "none"}
            stroke="#D4A017" strokeWidth="1.5">
            <defs>
              <linearGradient id="half"><stop offset="50%" stopColor="#D4A017"/><stop offset="50%" stopColor="none"/></linearGradient>
            </defs>
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
        ))}
      </div>
      <span style={{ color: "#D4A017", fontFamily: "'Lato', sans-serif", fontSize: "1rem", fontWeight: 600 }}>
        {rating}
      </span>
      {count > 0 && (
        <span style={{ color: "oklch(0.55 0 0)", fontFamily: "'Lato', sans-serif", fontSize: "0.85rem" }}>
          ({count} reseñas)
        </span>
      )}
    </div>
  );
}

export default function Producto() {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id ?? "0", 10);
  const [, navigate] = useLocation();
  const { addItem } = useCart();

  const { data: product, isLoading } = trpc.products.byId.useQuery(
    { id: productId },
    { enabled: !!productId }
  );

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [showAdicionales, setShowAdicionales] = useState(false);
  const [selectedAdicionales, setSelectedAdicionales] = useState({ cintaMarcada: false, tripode: false });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
              style={{ borderColor: "oklch(0.72 0.12 80)", borderTopColor: "transparent" }} />
            <p style={{ color: "oklch(0.55 0 0)", fontFamily: "'Lato', sans-serif" }}>Cargando producto...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-center py-20">
          <div>
            <p className="text-5xl mb-4">🌸</p>
            <h2 className="text-2xl font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "oklch(0.05 0 0)" }}>
              Producto no encontrado
            </h2>
            <button onClick={() => navigate("/catalogo")} className="btn-gold px-8 py-3 rounded-full text-base mt-4">
              Ver Catálogo
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Build image gallery
  const extraImgs: string[] = (() => {
    try { return product.extraImages ? JSON.parse(product.extraImages) : []; }
    catch { return []; }
  })();
  const allImages = [product.imageUrl, ...extraImgs].filter(Boolean) as string[];
  if (allImages.length === 0) allImages.push("");

  const includesList: string[] = (() => {
    try { return product.includes ? JSON.parse(product.includes) : []; }
    catch { return []; }
  })();

  const price = parseFloat(String(product.price));
  const originalPrice = product.originalPrice ? parseFloat(String(product.originalPrice)) : null;
  const sectionName = SECTION_NAMES[product.section] ?? product.section;

  const adicionalesPrice = (selectedAdicionales.cintaMarcada ? CINTA_MARCADA_PRICE : 0) + 
                             (selectedAdicionales.tripode ? TRIPODE_PRICE : 0);

  const handleAddToCart = () => {
    const isUnder299k = price < 299000;
    addItem({
      id: product.id,
      name: product.name,
      price,
      imageUrl: product.imageUrl,
      section: product.section,
      ...(isUnder299k && { adicionales: selectedAdicionales, adicionalesPrice }),
    }, qty);
    toast.success(`"${product.name}" agregado al carrito`, {
      description: `${qty} unidad${qty > 1 ? "es" : ""}${adicionalesPrice > 0 ? " con adicionales" : ""}`,
    });
    if (isUnder299k) {
      setShowAdicionales(false);
      setSelectedAdicionales({ cintaMarcada: false, tripode: false });
    }
  };

  const toggleAdicional = (adicional: 'cintaMarcada' | 'tripode') => {
    setSelectedAdicionales(prev => ({
      ...prev,
      [adicional]: !prev[adicional]
    }));
  };

  const handleWhatsApp = () => {
    const msg = `Hola, me interesa el arreglo: *${product.name}* — ${formatPrice(price)} (Cantidad: ${qty})`;
    window.open(`https://wa.me/573011621986?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(1 0 0)" }}>
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-base mb-6" style={{ fontFamily: "'Lato', sans-serif", color: "oklch(0.55 0 0)" }}>
            <button onClick={() => navigate("/")} className="hover:underline">Inicio</button>
            <span>›</span>
            <button onClick={() => navigate(`/catalogo?seccion=${product.section}`)} className="hover:underline">{sectionName}</button>
            <span>›</span>
            <span style={{ color: "oklch(0.28 0 0)" }}>{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* ---- LEFT: Image gallery ---- */}
            <div className="flex flex-col gap-4">
              {/* Main image */}
              <div
                className="relative rounded-2xl overflow-hidden aspect-square"
                style={{ backgroundColor: "oklch(0.97 0.008 75)", border: "1px solid oklch(0.92 0.01 75)" }}
              >
                {allImages[activeImg] ? (
                  <img
                    src={allImages[activeImg]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-400"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span style={{ fontSize: "80px", opacity: 0.2 }}>🌸</span>
                  </div>
                )}
                {product.isOffer && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-base font-bold"
                    style={{ backgroundColor: "oklch(0.38 0.12 10)", color: "white", fontFamily: "'Lato', sans-serif" }}>
                    ¡Oferta!
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all"
                      style={{
                        border: idx === activeImg
                          ? "2.5px solid oklch(0.72 0.12 80)"
                          : "2px solid oklch(0.90 0.01 75)",
                        opacity: idx === activeImg ? 1 : 0.7,
                      }}
                    >
                      {img ? (
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: "oklch(0.96 0.01 75)" }}>
                          <span style={{ fontSize: "24px", opacity: 0.3 }}>🌸</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ---- RIGHT: Product info ---- */}
            <div className="flex flex-col gap-5">
              {/* Section tag */}
              <span
                className="text-base font-medium tracking-widest uppercase"
                style={{ color: "oklch(0.72 0.12 80)", fontFamily: "'Lato', sans-serif" }}
              >
                {sectionName}
              </span>

              {/* Title */}
              <h1
                className="text-3xl md:text-4xl font-semibold leading-tight"
                style={{ color: "oklch(0 0 0)", fontFamily: "'Cormorant Garamond', serif" }}
              >
                {product.name}
              </h1>

              {/* Stars */}
              <StarRating rating={4.8} count={25} />

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span
                  className="text-4xl font-bold"
                  style={{ color: "#D4A017", fontFamily: "'Lato', sans-serif" }}
                >
                  {formatPrice(price)}
                </span>
                {originalPrice && (
                  <span
                    className="text-lg line-through"
                    style={{ color: "oklch(0.65 0 0)", fontFamily: "'Lato', sans-serif" }}
                  >
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              <p
                className="text-base -mt-2"
                style={{ color: "oklch(0.55 0 0)", fontFamily: "'Lato', sans-serif" }}
              >
                Precio incluye empaque premium y tarjeta de dedicatoria
              </p>

              {/* Description */}
              {product.description && (
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "oklch(0.35 0 0)", fontFamily: "'Lato', sans-serif" }}
                >
                  {product.description}
                </p>
              )}

              {/* Includes list */}
              {includesList.length > 0 && (
                <div>
                  <p
                    className="text-base font-bold mb-2 uppercase tracking-wider"
                    style={{ color: "oklch(0.05 0 0)", fontFamily: "'Lato', sans-serif" }}
                  >
                    Incluye:
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {includesList.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-base"
                        style={{ color: "oklch(0.35 0 0)", fontFamily: "'Lato', sans-serif" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Adicionales section for products under 299k */}
              {price < 299000 && (
                <div className="border-t border-b" style={{ borderColor: "oklch(0.92 0.01 75)", paddingTop: "1.25rem", paddingBottom: "1.25rem" }}>
                  <p className="text-base font-semibold mb-3" style={{ color: "oklch(0.72 0.12 80)", fontFamily: "'Lato', sans-serif" }}>
                    Adicionales Disponibles
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAdicionales.cintaMarcada}
                        onChange={() => toggleAdicional('cintaMarcada')}
                        className="w-4 h-4"
                      />
                      <span style={{ fontFamily: "'Lato', sans-serif", color: "oklch(0.35 0 0)" }}>
                        Cinta Marcada <span style={{ color: "oklch(0.72 0.12 80)", fontWeight: 600 }}>+{formatPrice(CINTA_MARCADA_PRICE)}</span>
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAdicionales.tripode}
                        onChange={() => toggleAdicional('tripode')}
                        className="w-4 h-4"
                      />
                      <span style={{ fontFamily: "'Lato', sans-serif", color: "oklch(0.35 0 0)" }}>
                        Trípode <span style={{ color: "oklch(0.72 0.12 80)", fontWeight: 600 }}>+{formatPrice(TRIPODE_PRICE)}</span>
                      </span>
                    </label>
                    {adicionalesPrice > 0 && (
                      <div className="pt-2 mt-2 border-t" style={{ borderColor: "oklch(0.92 0.01 75)" }}>
                        <span style={{ fontFamily: "'Lato', sans-serif", color: "oklch(0.05 0 0)", fontWeight: 600 }}>
                          Total Adicionales: {formatPrice(adicionalesPrice)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Incluye adicionales gratis para productos 300k+ */}
              {price >= 300000 && (
                <div className="p-3 rounded-lg" style={{ backgroundColor: "oklch(0.95 0 0)", borderLeft: "4px solid oklch(0.72 0.12 80)" }}>
                  <p style={{ fontFamily: "'Lato', sans-serif", color: "oklch(0.72 0.12 80)", fontWeight: 600, fontSize: "0.95rem" }}>
                    ✓ Incluye: Tarjeta, Cinta Marcada y Trípode GRATIS
                  </p>
                </div>
              )}

              {/* Quantity selector */}
              <div className="flex items-center gap-4">
                <span
                  className="text-base font-medium"
                  style={{ color: "oklch(0.05 0 0)", fontFamily: "'Lato', sans-serif" }}
                >
                  Cantidad:
                </span>
                <div
                  className="flex items-center rounded-xl overflow-hidden"
                  style={{ border: "1.5px solid oklch(0.85 0.02 75)" }}
                >
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-lg font-medium transition-colors hover:bg-gray-50"
                    style={{ color: "oklch(0.28 0 0)" }}
                  >
                    −
                  </button>
                  <span
                    className="w-12 text-center text-base font-semibold"
                    style={{ color: "oklch(0 0 0)", fontFamily: "'Lato', sans-serif" }}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-lg font-medium transition-colors hover:bg-gray-50"
                    style={{ color: "oklch(0.28 0 0)" }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Agregar al carrito — gold */}
                <button
                  onClick={handleAddToCart}
                  className="btn-gold flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-base"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Agregar al carrito
                </button>

                {/* Pedir por WhatsApp — green */}
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-base font-semibold transition-all hover:opacity-90 active:scale-95"
                  style={{
                    backgroundColor: "#25D366",
                    color: "white",
                    fontFamily: "'Lato', sans-serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Pedir por WhatsApp
                </button>
              </div>

              {/* Trust badges */}
              <div
                className="grid grid-cols-3 gap-3 pt-4 mt-2"
                style={{ borderTop: "1px solid oklch(0.92 0.01 75)" }}
              >
                {[
                  { icon: "🚚", label: "Entrega mismo día" },
                  { icon: "🛡️", label: "Calidad garantizada" },
                  { icon: "🕓", label: "Pide antes 4PM" },
                ].map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-1 text-center">
                    <span className="text-2xl">{b.icon}</span>
                    <span
                      className="text-base"
                      style={{ color: "oklch(0.50 0 0)", fontFamily: "'Lato', sans-serif" }}
                    >
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

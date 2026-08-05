import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  id: number;
  name: string;
  price: number | string;
  originalPrice?: number | string | null;
  imageUrl?: string | null;
  isOffer?: boolean;
  section?: string;
}

function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(num);
}

const CATEGORY_IMAGES: Record<string, string> = {
  coronas_funebres: "/manus-storage/cat-coronas_1f5a7d59.jpg",
  sudarios: "/manus-storage/cat-altar_68168df9.jpg",
  rosas_inmortalizadas: "/manus-storage/cat-rosas-inmortalizadas_734fdfc2.png",
};

const CINTA_MARCADA_PRICE = 12000;
const TRIPODE_PRICE = 15000;

export default function ProductCard({ id, name, price, originalPrice, imageUrl, isOffer, section }: ProductCardProps) {
  const [, navigate] = useLocation();
  const { addItem } = useCart();
  const [showAdicionales, setShowAdicionales] = useState(false);
  const [selectedAdicionales, setSelectedAdicionales] = useState({ cintaMarcada: false, tripode: false });

  const priceNum = typeof price === "string" ? parseFloat(price) : price;
  const displayImage = imageUrl || (section ? CATEGORY_IMAGES[section] : null);
  
  // Determinar si el producto es menor a 299.000
  const isUnder299k = priceNum < 299000;
  // Determinar si el producto es 300.000 o más
  const is300kOrMore = priceNum >= 300000;

  // Calcular precio de adicionales seleccionados
  const adicionalesPrice = (selectedAdicionales.cintaMarcada ? CINTA_MARCADA_PRICE : 0) + 
                           (selectedAdicionales.tripode ? TRIPODE_PRICE : 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isUnder299k && showAdicionales) {
      // Agregar con adicionales opcionales
      addItem({ 
        id, 
        name, 
        price: priceNum, 
        imageUrl: displayImage, 
        section,
        adicionales: selectedAdicionales,
        adicionalesPrice
      });
      toast.success(`"${name}" agregado al carrito${adicionalesPrice > 0 ? ` con adicionales` : ""}`);
      setShowAdicionales(false);
      setSelectedAdicionales({ cintaMarcada: false, tripode: false });
    } else {
      // Agregar sin adicionales
      addItem({ id, name, price: priceNum, imageUrl: displayImage, section });
      toast.success(`"${name}" agregado al carrito`);
    }
  };

  const handleCardClick = () => {
    navigate(`/producto/${id}`);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const toggleAdicional = (adicional: 'cintaMarcada' | 'tripode') => {
    setSelectedAdicionales(prev => ({
      ...prev,
      [adicional]: !prev[adicional]
    }));
  };

  return (
    <div
      className="product-card relative flex flex-col rounded-xl overflow-hidden cursor-pointer group"
      style={{
        backgroundColor: "oklch(1 0 0)",
        border: "1px solid oklch(0.92 0.01 75)",
        boxShadow: "0 2px 8px oklch(0.20 0 0 / 0.05)",
      }}
      onClick={handleCardClick}
    >
      {/* Offer badge */}
      {isOffer && (
        <div
          className="absolute top-2 left-2 z-10 flex items-center justify-center text-center animate-flower-pulse"
          style={{
            backgroundColor: "oklch(0.38 0.12 10)",
            color: "white",
            clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            width: "40px",
            height: "40px",
          }}
        >
          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.6rem", fontWeight: 700, lineHeight: 1.2 }}>
            ¡Oferta!
          </span>
        </div>
      )}

      {/* Badge para productos 300k+ */}
      {is300kOrMore && (
        <div
          className="absolute top-2 right-2 z-10 px-2 py-1 rounded-full text-xs font-bold"
          style={{
            backgroundColor: "oklch(0.72 0.12 80)",
            color: "oklch(0 0 0)",
          }}
        >
          ¡INCLUYE ADICIONALES!
        </div>
      )}

      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {displayImage ? (
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const fallback = section ? CATEGORY_IMAGES[section] : null;
              if (fallback && (e.target as HTMLImageElement).src !== fallback) {
                (e.target as HTMLImageElement).src = fallback;
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "oklch(0.95 0.01 75)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="oklch(0.72 0.12 80)" strokeWidth="1.5" opacity={0.3}>
              <path d="M12 2C10.5 2 9 3.5 9 5c0 1.5 1.5 3 3 3s3-1.5 3-3c0-1.5-1.5-3-3-3z"/>
              <path d="M12 8v13M8 12c-2 0-4 1.5-4 3.5S6 19 8 19M16 12c2 0 4 1.5 4 3.5S18 19 16 19"/>
            </svg>
          </div>
        )}
        {/* Hover overlay — hidden on touch */}
        <div
          className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: "oklch(0.10 0 0 / 0.45)" }}
        >
          <span
            className="text-sm font-medium tracking-widest uppercase px-3 py-1.5 rounded-full"
            style={{ backgroundColor: "oklch(0.72 0.12 80)", color: "oklch(0 0 0)", fontFamily: "'Lato', sans-serif" }}
          >
            Ver Detalle
          </span>
        </div>
      </div>

      {/* Label bar */}
      <div className="px-2 py-1.5 text-center" style={{ backgroundColor: "oklch(0.22 0 0)" }}>
        <span
          className="font-light tracking-wide line-clamp-1 block"
          style={{
            color: "white",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(0.78rem, 2.5vw, 1rem)",
          }}
        >
          {name}
        </span>
      </div>

      {/* Price */}
      <div className="px-2 py-1.5 text-center flex flex-col items-center justify-center" style={{ overflow: "visible" }}>
        {originalPrice && (
          <span
            className="line-through block"
            style={{
              color: "oklch(0.60 0 0)",
              fontFamily: "'Lato', sans-serif",
              fontSize: "clamp(0.62rem, 3.2vw, 0.82rem)",
              whiteSpace: "nowrap",
              letterSpacing: "-0.01em",
            }}
          >
            {formatPrice(originalPrice)}
          </span>
        )}
        <span
          className="font-semibold block"
          style={{
            color: "oklch(0.05 0 0)",
            fontFamily: "'Lato', sans-serif",
            fontSize: "clamp(0.80rem, 4vw, 1.05rem)",
            whiteSpace: "nowrap",
            letterSpacing: "-0.01em",
          }}
        >
          {formatPrice(price)}
        </span>
      </div>

      {/* Adicionales info for 300k+ products */}
      {is300kOrMore && (
        <div className="px-2 py-1 text-center text-xs" style={{ backgroundColor: "oklch(0.95 0 0)", color: "oklch(0.72 0.12 80)" }}>
          <span style={{ fontWeight: 600 }}>Incluye: Tarjeta, Cinta Marcada y Trípode</span>
        </div>
      )}

      {/* Adicionales options for under 299k products */}
      {isUnder299k && showAdicionales && (
        <div className="px-2 py-2 border-t" style={{ borderColor: "oklch(0.92 0.01 75)", backgroundColor: "oklch(0.98 0 0)" }}>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer text-xs" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={selectedAdicionales.cintaMarcada}
                onChange={() => toggleAdicional('cintaMarcada')}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4"
              />
              <span style={{ fontFamily: "'Lato', sans-serif" }}>
                Agregar Cinta Marcada <span style={{ color: "oklch(0.72 0.12 80)", fontWeight: 600 }}>+{formatPrice(CINTA_MARCADA_PRICE)}</span>
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={selectedAdicionales.tripode}
                onChange={() => toggleAdicional('tripode')}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4"
              />
              <span style={{ fontFamily: "'Lato', sans-serif" }}>
                Agregar Trípode <span style={{ color: "oklch(0.72 0.12 80)", fontWeight: 600 }}>+{formatPrice(TRIPODE_PRICE)}</span>
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Action buttons — stacked, compact on mobile */}
      <div className="px-2 pb-2 flex flex-col gap-1.5 mt-auto">
        {/* Show adicionales button for under 299k products */}
        {isUnder299k && !showAdicionales && (
          <button
            onClick={(e) => { e.stopPropagation(); setShowAdicionales(true); }}
            className="w-full rounded-full flex items-center justify-center gap-1.5 font-bold transition-all hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: "oklch(0.95 0 0)",
              color: "oklch(0.72 0.12 80)",
              fontFamily: "'Lato', sans-serif",
              padding: "0.45rem 0.5rem",
              fontSize: "clamp(0.65rem, 2vw, 0.78rem)",
              letterSpacing: "0.04em",
              lineHeight: 1.3,
              border: "1px solid oklch(0.72 0.12 80)",
            }}
          >
            <span>+ Agregar Adicionales</span>
          </button>
        )}

        {/* Add to cart */}
        <button
          onClick={(e) => { e.stopPropagation(); handleAddToCart(e); }}
          className="btn-gold w-full rounded-full flex items-center justify-center gap-1.5"
          style={{
            padding: "0.45rem 0.5rem",
            fontSize: "clamp(0.65rem, 2vw, 0.78rem)",
            fontWeight: 700,
            letterSpacing: "0.04em",
            lineHeight: 1.3,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span>Agregar al carrito</span>
        </button>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/573011621986?text=${encodeURIComponent(`Hola, me interesa: ${name} — ${formatPrice(price)}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="w-full rounded-full flex items-center justify-center gap-1.5 font-bold transition-all hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: "#25D366",
            color: "white",
            fontFamily: "'Lato', sans-serif",
            padding: "0.45rem 0.5rem",
            fontSize: "clamp(0.65rem, 2vw, 0.78rem)",
            letterSpacing: "0.04em",
            lineHeight: 1.3,
            textDecoration: "none",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>Pedir por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

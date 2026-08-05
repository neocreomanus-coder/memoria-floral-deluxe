import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

export default function CartDrawer() {
  const { items, count, subtotal, isOpen, closeCart, removeItem, updateQty } = useCart();
  const [, navigate] = useLocation();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          backgroundColor: "oklch(0.10 0 0 / 0.55)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: "min(420px, 100vw)",
          backgroundColor: "oklch(1 0 0)",
          boxShadow: "-8px 0 40px oklch(0.10 0 0 / 0.18)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid oklch(0.92 0.01 75)" }}
        >
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.05 0 0)" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h2
              className="text-base font-semibold"
              style={{ color: "oklch(0 0 0)", fontFamily: "'Lato', sans-serif" }}
            >
              Mi Carrito
            </h2>
            {count > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-base font-bold"
                style={{ backgroundColor: "oklch(0.72 0.12 80)", color: "oklch(0 0 0)", fontFamily: "'Lato', sans-serif" }}
              >
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            style={{ color: "oklch(0.45 0 0)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <span style={{ fontSize: "56px" }}>🌸</span>
              <p
                className="text-lg font-light"
                style={{ color: "oklch(0.45 0 0)", fontFamily: "'Cormorant Garamond', serif" }}
              >
                Tu carrito está vacío
              </p>
              <p
                className="text-base"
                style={{ color: "oklch(0.60 0 0)", fontFamily: "'Lato', sans-serif" }}
              >
                Agrega arreglos fúnebres para continuar
              </p>
              <button
                onClick={() => { closeCart(); navigate("/catalogo"); }}
                className="btn-gold px-6 py-2.5 rounded-full text-base mt-2"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 pb-4"
                  style={{ borderBottom: "1px solid oklch(0.94 0.01 75)" }}
                >
                  {/* Thumbnail */}
                  <div
                    className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: "oklch(0.96 0.01 75)" }}
                  >
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span style={{ fontSize: "28px", opacity: 0.3 }}>🌸</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-base font-medium leading-snug mb-1"
                      style={{ color: "oklch(0.08 0 0)", fontFamily: "'Lato', sans-serif" }}
                    >
                      {item.name}
                    </p>
                    {/* Adicionales */}
                    {item.adicionales && (item.adicionales.cintaMarcada || item.adicionales.tripode) && (
                      <div className="text-xs mb-2" style={{ color: "oklch(0.60 0 0)", fontFamily: "'Lato', sans-serif" }}>
                        {item.adicionales.cintaMarcada && <div>+ Cinta Marcada: {formatPrice(12000)}</div>}
                        {item.adicionales.tripode && <div>+ Trípode: {formatPrice(15000)}</div>}
                      </div>
                    )}
                    <p
                      className="text-base font-bold mb-2"
                      style={{ color: "#D4A017", fontFamily: "'Lato', sans-serif" }}
                    >
                      {formatPrice((item.price + (item.adicionalesPrice || 0)) * item.quantity)}
                    </p>

                    {/* Qty + remove */}
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center rounded-lg overflow-hidden"
                        style={{ border: "1.5px solid oklch(0.88 0.02 75)" }}
                      >
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-base transition-colors hover:bg-gray-50"
                          style={{ color: "oklch(0.35 0 0)" }}
                        >
                          −
                        </button>
                        <span
                          className="w-8 text-center text-base font-semibold"
                          style={{ color: "oklch(0.08 0 0)", fontFamily: "'Lato', sans-serif" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-base transition-colors hover:bg-gray-50"
                          style={{ color: "oklch(0.35 0 0)" }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-base transition-opacity hover:opacity-60"
                        style={{ color: "oklch(0.55 0.08 10)", fontFamily: "'Lato', sans-serif" }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — totals + checkout */}
        {items.length > 0 && (
          <div
            className="px-5 py-5 flex flex-col gap-3"
            style={{ borderTop: "1px solid oklch(0.92 0.01 75)" }}
          >
            <div className="flex justify-between items-center">
              <span style={{ color: "oklch(0.45 0 0)", fontFamily: "'Lato', sans-serif", fontSize: "1rem" }}>
                Subtotal ({count} {count === 1 ? "artículo" : "artículos"})
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: "oklch(0 0 0)", fontFamily: "'Lato', sans-serif" }}
              >
                {formatPrice(subtotal)}
              </span>
            </div>
            <p
              className="text-base text-center"
              style={{ color: "oklch(0.60 0 0)", fontFamily: "'Lato', sans-serif" }}
            >
              Envío calculado en el pago
            </p>
            <button
              onClick={handleCheckout}
              className="btn-gold w-full py-4 rounded-full text-base"
            >
              PROCEDER AL PAGO
            </button>
            <a
              href={`https://wa.me/573011621986?text=${encodeURIComponent("Hola, quisiera hacer un pedido:\n" + items.map(i => `• ${i.name} x${i.quantity} — ${formatPrice(i.price * i.quantity)}`).join("\n") + `\n\nTotal: ${formatPrice(subtotal)}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-base font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: "#25D366", color: "white", fontFamily: "'Lato', sans-serif" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Pedir por WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}

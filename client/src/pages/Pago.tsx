import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

function generateOrderNumber() {
  const prefix = "MFD";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 900 + 100);
  return `${prefix}-${timestamp}-${random}`;
}

type PagoState = {
  total: number;
  orderData: Record<string, unknown>;
};

export default function Pago() {
  const [, navigate] = useLocation();

  // Retrieve order data from sessionStorage (set by Checkout before navigating)
  const [pagoState] = useState<PagoState>(() => {
    try {
      const stored = sessionStorage.getItem("mfd_pago_state");
      if (stored) return JSON.parse(stored);
    } catch {}
    return { total: 0, orderData: {} };
  });

  // Timer: 10 minutes = 600 seconds
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Step: "instructions" | "confirmed"
  const [step, setStep] = useState<"instructions" | "confirmed">("instructions");
  const [orderNumber] = useState(() => generateOrderNumber());

  useEffect(() => {
    if (pagoState.total === 0) {
      navigate("/");
      return;
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setTimerExpired(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timerColor = secondsLeft <= 60 ? "#ef4444" : secondsLeft <= 180 ? "#f59e0b" : "#22c55e";

  const whatsappMsg = encodeURIComponent(
    `Hola Memoria Floral Deluxe! 🌹\n\nAdjunto el comprobante de pago.\n\nNúmero de pedido: *${orderNumber}*\nTotal pagado: *${formatPrice(pagoState.total)}*\n\nPor favor confirmar despacho inmediato. ¡Gracias!`
  );
  const whatsappUrl = `https://wa.me/573011621986?text=${whatsappMsg}`;

  const BOLD_LOGO = "/manus-storage/bold-logo_cd249c0e.png";

  if (timerExpired && step === "instructions") {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: "oklch(0.97 0.005 75)" }}>
          <div className="max-w-md w-full rounded-2xl p-8 text-center" style={{ backgroundColor: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#fee2e2" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "oklch(0.08 0 0)" }}>Tiempo agotado</h2>
            <p className="text-base mb-6" style={{ fontFamily: "'Roboto', sans-serif", color: "oklch(0.45 0 0)" }}>
              El tiempo para completar el pago ha expirado. Por favor regresa al catálogo y vuelve a intentarlo.
            </p>
            <button onClick={() => navigate("/")} className="btn-gold w-full py-3 rounded-full text-base font-semibold">
              Volver al inicio
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-10 px-4" style={{ backgroundColor: "oklch(0.97 0.005 75)" }}>
        <div className="max-w-lg mx-auto flex flex-col gap-6">

          {step === "instructions" && (
            <>
              {/* Timer */}
              <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: "#fff", border: "1px solid oklch(0.90 0.01 75)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                <p className="text-base font-medium mb-1" style={{ fontFamily: "'Roboto', sans-serif", color: "oklch(0.45 0 0)" }}>
                  Tiempo restante para completar el pago
                </p>
                <div className="text-5xl font-bold tabular-nums" style={{ fontFamily: "'Roboto', sans-serif", color: timerColor, letterSpacing: "0.05em" }}>
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>
                <p className="text-base mt-1" style={{ fontFamily: "'Roboto', sans-serif", color: "oklch(0.60 0 0)" }}>
                  Tu pedido está reservado durante este tiempo
                </p>
              </div>

              {/* Total a pagar */}
              <div className="rounded-2xl p-5" style={{ backgroundColor: "#fff", border: "1px solid oklch(0.90 0.01 75)", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-medium" style={{ fontFamily: "'Roboto', sans-serif", color: "oklch(0.50 0 0)" }}>Total a pagar</p>
                    <p className="text-3xl font-bold" style={{ fontFamily: "'Roboto', sans-serif", color: "oklch(0.08 0 0)" }}>{formatPrice(pagoState.total)}</p>
                  </div>
                  <img src={BOLD_LOGO} alt="Bold" className="h-12 rounded-xl object-contain" style={{ maxWidth: "80px" }} />
                </div>
              </div>

              {/* Instrucciones */}
              <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ backgroundColor: "#fff", border: "1px solid oklch(0.90 0.01 75)" }}>
                <h2 className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "oklch(0.08 0 0)" }}>
                  Instrucciones de pago
                </h2>
                {[
                  { num: "1", text: `Haz clic en "Pagar Con Bold" y se abrirá la pasarela de pago.` },
                  { num: "2", text: `Ingresa el valor exacto: ${formatPrice(pagoState.total)}` },
                  { num: "3", text: "Selecciona tu método de pago: Tarjeta, PSE, Nequi o Daviplata." },
                  { num: "4", text: "Completa el pago y toma una captura de pantalla del comprobante." },
                  { num: "5", text: `Regresa a esta página y haz clic en "Ya Realicé el Pago".` },
                ].map(step => (
                  <div key={step.num} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-base font-bold"
                      style={{ background: "linear-gradient(135deg, #e8007a 0%, #7b2ff7 100%)", color: "#fff", fontFamily: "'Roboto', sans-serif" }}>
                      {step.num}
                    </div>
                    <p className="text-base leading-snug pt-0.5" style={{ fontFamily: "'Roboto', sans-serif", color: "oklch(0.20 0 0)" }}>
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Botón Bold oficial */}
              <a
                href="https://checkout.bold.co/payment/LNK_CVAQA4KKSG"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center transition-all"
                style={{ textDecoration: "none" }}
              >
                <img
                  src="/manus-storage/bold-button_f99fc24e.png"
                  alt="Pagar con Bold"
                  className="w-full rounded-full object-contain"
                  style={{ maxHeight: "62px", maxWidth: "320px" }}
                />
              </a>

              {/* Ya pagué */}
              <button
                onClick={() => setStep("confirmed")}
                className="w-full py-4 rounded-full text-base font-semibold border-2 transition-all"
                style={{ borderColor: "oklch(0.72 0.12 80)", color: "oklch(0.45 0.12 80)", backgroundColor: "oklch(0.72 0.12 80 / 0.07)", fontFamily: "'Roboto', sans-serif" }}
              >
                ✓ Ya Realicé el Pago
              </button>

              <p className="text-center text-base" style={{ fontFamily: "'Roboto', sans-serif", color: "oklch(0.60 0 0)" }}>
                ¿Necesitas ayuda?{" "}
                <a href={`https://wa.me/573011621986`} target="_blank" rel="noopener noreferrer"
                  style={{ color: "oklch(0.45 0.12 80)", fontWeight: 600 }}>
                  Escríbenos por WhatsApp
                </a>
              </p>
            </>
          )}

          {step === "confirmed" && (
            <div className="rounded-2xl p-8 text-center flex flex-col gap-5" style={{ backgroundColor: "#fff", border: "1px solid oklch(0.90 0.01 75)", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
              {/* Check animado */}
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "linear-gradient(135deg, #e8007a 0%, #7b2ff7 100%)" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "oklch(0.08 0 0)" }}>
                  ¡Pago Registrado!
                </h2>
                <p className="text-base" style={{ fontFamily: "'Roboto', sans-serif", color: "oklch(0.45 0 0)" }}>
                  Envía tu comprobante para confirmar el despacho inmediato
                </p>
              </div>

              {/* Número de pedido */}
              <div className="rounded-xl px-5 py-4" style={{ backgroundColor: "oklch(0.97 0.005 75)", border: "1.5px dashed oklch(0.85 0.02 75)" }}>
                <p className="text-base font-medium mb-1" style={{ fontFamily: "'Roboto', sans-serif", color: "oklch(0.55 0 0)" }}>
                  Número de Pedido
                </p>
                <p className="text-2xl font-bold tracking-widest" style={{ fontFamily: "'Roboto', sans-serif", color: "oklch(0.08 0 0)", letterSpacing: "0.12em" }}>
                  {orderNumber}
                </p>
                <p className="text-base mt-1" style={{ fontFamily: "'Roboto', sans-serif", color: "oklch(0.55 0 0)" }}>
                  Total: <strong>{formatPrice(pagoState.total)}</strong>
                </p>
              </div>

              {/* Instrucción comprobante */}
              <div className="rounded-xl px-4 py-3 text-left flex gap-3 items-start"
                style={{ backgroundColor: "oklch(0.97 0.005 75)", border: "1px solid oklch(0.90 0.01 75)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7b2ff7" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p className="text-base" style={{ fontFamily: "'Roboto', sans-serif", color: "oklch(0.30 0 0)" }}>
                  Adjunta la captura de pantalla del comprobante de pago al mensaje de WhatsApp para que procesemos tu pedido de inmediato.
                </p>
              </div>

              {/* Botón WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-full text-base font-bold transition-all"
                style={{ backgroundColor: "#25D366", color: "#fff", fontFamily: "'Roboto', sans-serif", textDecoration: "none", boxShadow: "0 4px 20px rgba(37,211,102,0.35)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Enviar Comprobante para Despacho Inmediato
              </a>

              <button
                onClick={() => navigate("/")}
                className="w-full py-3 rounded-full text-base transition-all"
                style={{ border: "1.5px solid oklch(0.88 0.02 75)", color: "oklch(0.45 0 0)", backgroundColor: "transparent", fontFamily: "'Roboto', sans-serif" }}
              >
                Seguir Comprando
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

const TIME_SLOTS = ["8:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "12:00 PM - 2:00 PM", "2:00 PM - 4:00 PM", "4:00 PM - 6:00 PM"];

const CITIES = [
  { label: "Barranquilla", value: "barranquilla", shipping: 15000 },
  { label: "Soledad", value: "soledad", shipping: 25000 },
  { label: "Galapa", value: "galapa", shipping: 25000 },
  { label: "Puerto Colombia", value: "puerto_colombia", shipping: 25000 },
  { label: "Malambo", value: "malambo", shipping: 25000 },
];

const FUNERARIAS = [
  "Los Olivos – Calle 60 #37-87 (El Recreo)",
  "Los Olivos – Av. Murillo #40-8A",
  "Abadía de La Ascensión – Cra. 53 #55-161",
  "La Ascensión – Cra. 52 #72-65 Local 101",
  "Grupo Recordar – Km 5 Vía Puerto Colombia",
  "Jardines del Renacer – Cl. 65B #38B-50",
  "Jardines del Recuerdo – Cl. 53 #50-57",
  "Universal Previsión – Cra. 35 #47-124",
  "Barranquilla Exequial – Cl. 48 #35-23",
  "Exequiales El Paraíso – Cl. 65 #46-18",
  "Preexequiales San Antonio – Cl. 54 #37-31",
  "San José – Cordialidad #22-46",
  "La Luz – Calle 48",
  "La Capilla Funerales – Calle 51",
  "Casa Funeraria Los Andes – Cra. 23 #57-34",
  "Capillas Fe – Cra. 53 #59-55",
  "Funeraria Hispana – Cra. 38 #56-34",
  "Casa de Velación La Candelaria (Soledad) – Cl. 18 #34-49",
  "Otra dirección...",
];

export default function Checkout() {
  const { items, subtotal, count, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [success, setSuccess] = useState(false);

  const [deliveryType, setDeliveryType] = useState<"funeraria" | "direccion">("funeraria");
  const [selectedCity, setSelectedCity] = useState("barranquilla");
  const [selectedFuneraria, setSelectedFuneraria] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [funerariaOpen, setFunerariaOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const shippingCost = CITIES.find(c => c.value === selectedCity)?.shipping ?? 15000;
  const total = subtotal + shippingCost;

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryNeighborhood: "",
    deliveryDate: "",
    deliveryTime: "",
    dedicatoria: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: () => {
      // Guardar estado en sessionStorage para la página de pago
      sessionStorage.setItem("mfd_pago_state", JSON.stringify({
        total,
        orderData: {
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          deliveryAddress: getDeliveryAddress(),
        },
      }));
      clearCart();
      navigate("/pago");
    },
    onError: (e) => {
      toast.error("Error al procesar el pedido: " + e.message);
    },
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = "Nombre requerido";
    if (!form.customerPhone.trim()) e.customerPhone = "Teléfono requerido";
    if (deliveryType === "funeraria" && !selectedFuneraria) e.funeraria = "Selecciona una funeraria";
    if (deliveryType === "funeraria" && selectedFuneraria === "Otra dirección..." && !customAddress.trim()) e.customAddress = "Ingresa la dirección";
    if (deliveryType === "direccion" && !customAddress.trim()) e.customAddress = "Dirección requerida";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const getDeliveryAddress = () => {
    if (deliveryType === "funeraria") {
      return selectedFuneraria === "Otra dirección..." ? customAddress : selectedFuneraria;
    }
    return customAddress;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) { toast.error("El carrito está vacío"); return; }

    const cityLabel = CITIES.find(c => c.value === selectedCity)?.label ?? selectedCity;

    createOrder.mutate({
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerEmail: form.customerEmail,
      deliveryAddress: getDeliveryAddress(),
      deliveryNeighborhood: `${cityLabel}${form.deliveryNeighborhood ? " – " + form.deliveryNeighborhood : ""}`,
      deliveryDate: form.deliveryDate,
      deliveryTime: form.deliveryTime,
      dedicatoria: form.dedicatoria,
      notes: form.notes,
      items: JSON.stringify(items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }))),
      subtotal,
      total,
    });
  };

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  if (success) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(1 0 0)" }}>
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "linear-gradient(135deg, oklch(0.62 0.12 80), oklch(0.82 0.14 85))" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 className="text-3xl font-light mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "oklch(0 0 0)" }}>
              ¡Pedido Recibido!
            </h2>
            <p className="text-base mb-2" style={{ color: "oklch(0.45 0 0)", fontFamily: "'Roboto', sans-serif" }}>
              Gracias por confiar en Memoria Floral Deluxe.
            </p>
            <p className="text-base mb-8" style={{ color: "oklch(0.55 0 0)", fontFamily: "'Roboto', sans-serif" }}>
              Nos pondremos en contacto contigo pronto para confirmar tu pedido y coordinar la entrega.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate("/")} className="btn-gold px-8 py-3.5 rounded-full text-base">
                Volver al Inicio
              </button>
              <button onClick={() => navigate("/catalogo")}
                className="px-8 py-3.5 rounded-full text-base font-medium transition-all hover:opacity-70"
                style={{ border: "1.5px solid oklch(0.85 0.02 75)", color: "oklch(0.35 0 0)", fontFamily: "'Roboto', sans-serif" }}>
                Ver Catálogo
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(1 0 0)" }}>
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 text-center">
          <div>
            <h2 className="text-2xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "oklch(0.05 0 0)" }}>
              Tu carrito está vacío
            </h2>
            <button onClick={() => navigate("/catalogo")} className="btn-gold px-8 py-3.5 rounded-full text-base mt-2">
              Ver Catálogo
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(0.98 0.005 75)" }}>
      <Header />

      {/* Page header */}
      <div className="py-8 md:py-10" style={{ backgroundColor: "oklch(0 0 0)" }}>
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-light text-center"
            style={{ color: "oklch(0.97 0.01 75)", fontFamily: "'Cormorant Garamond', serif" }}>
            Finalizar <span style={{ color: "oklch(0.82 0.12 80)", fontStyle: "italic" }}>Pedido</span>
          </h1>
        </div>
      </div>

      <main className="flex-1 py-10">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ---- LEFT: Form ---- */}
              <div className="lg:col-span-2 flex flex-col gap-6">

                {/* Customer info */}
                <FormSection title="Datos de Contacto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Nombre completo *" error={errors.customerName}>
                      <input value={form.customerName} onChange={e => set("customerName", e.target.value)}
                        placeholder="Ej: María García" className={inputCls(errors.customerName)} style={INPUT_STYLE} />
                    </Field>
                    <Field label="Teléfono / WhatsApp *" error={errors.customerPhone}>
                      <input value={form.customerPhone} onChange={e => set("customerPhone", e.target.value)}
                        placeholder="Ej: 300 123 4567" className={inputCls(errors.customerPhone)} style={INPUT_STYLE} />
                    </Field>
                    <Field label="Correo electrónico (opcional)" className="sm:col-span-2">
                      <input value={form.customerEmail} onChange={e => set("customerEmail", e.target.value)}
                        placeholder="Ej: correo@email.com" className={inputCls()} style={INPUT_STYLE} />
                    </Field>
                  </div>
                </FormSection>

                {/* Delivery info */}
                <FormSection title="Datos de Entrega">
                  <div className="flex flex-col gap-4">

                    {/* Ciudad con costo de envío — dropdown personalizado */}
                    <div>
                      <label className="block text-base font-medium mb-1.5" style={{ color: "oklch(0.38 0 0)", fontFamily: "'Roboto', sans-serif" }}>Ciudad de entrega *</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setCityOpen(o => !o); setFunerariaOpen(false); }}
                          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-base text-left"
                          style={{ border: "1.5px solid oklch(0.88 0.02 75)", fontFamily: "'Roboto', sans-serif", color: "oklch(0.15 0 0)", backgroundColor: "oklch(1 0 0)" }}
                        >
                          <span>{CITIES.find(c => c.value === selectedCity)?.label ?? "Seleccionar ciudad"} — Envío: {formatPrice(CITIES.find(c => c.value === selectedCity)?.shipping ?? 15000)}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: cityOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                        {cityOpen && (
                          <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden" style={{ border: "1.5px solid oklch(0.88 0.02 75)", backgroundColor: "oklch(1 0 0)", boxShadow: "0 8px 24px oklch(0.10 0 0 / 0.12)" }}>
                            {CITIES.map(c => (
                              <button
                                key={c.value}
                                type="button"
                                onClick={() => { setSelectedCity(c.value); setCityOpen(false); }}
                                className="w-full flex items-center justify-between px-4 py-3 text-base text-left transition-colors hover:bg-gray-50"
                                style={{ fontFamily: "'Roboto', sans-serif", color: selectedCity === c.value ? "oklch(0.50 0.12 80)" : "oklch(0.15 0 0)", backgroundColor: selectedCity === c.value ? "oklch(0.72 0.12 80 / 0.08)" : "transparent", borderBottom: "1px solid oklch(0.94 0.01 75)" }}
                              >
                                <span>{c.label}</span>
                                <span style={{ color: "oklch(0.45 0.12 80)", fontWeight: 600 }}>Envío: {formatPrice(c.shipping)}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tipo de entrega */}
                    <div>
                      <p className="text-base font-medium mb-2" style={{ color: "oklch(0.38 0 0)", fontFamily: "'Roboto', sans-serif" }}>
                        Tipo de entrega *
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: "funeraria", label: "Funeraria / Capilla", icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
                          { value: "direccion", label: "Otra dirección", icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10a2 2 0 100-4 2 2 0 000 4z" },
                        ].map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => { setDeliveryType(opt.value as "funeraria" | "direccion"); setSelectedFuneraria(""); setCustomAddress(""); }}
                            className="flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium transition-all"
                            style={{
                              border: `2px solid ${deliveryType === opt.value ? "oklch(0.72 0.12 80)" : "oklch(0.88 0.02 75)"}`,
                              backgroundColor: deliveryType === opt.value ? "oklch(0.72 0.12 80 / 0.08)" : "oklch(1 0 0)",
                              color: deliveryType === opt.value ? "oklch(0.45 0.12 80)" : "oklch(0.45 0 0)",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d={opt.icon}/>
                            </svg>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Funeraria selector — dropdown personalizado */}
                    {deliveryType === "funeraria" && (
                      <div>
                        <label className="block text-base font-medium mb-1.5" style={{ color: "oklch(0.38 0 0)", fontFamily: "'Roboto', sans-serif" }}>Selecciona la funeraria *</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => { setFunerariaOpen(o => !o); setCityOpen(false); }}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-base text-left"
                            style={{ border: `1.5px solid ${errors.funeraria ? "#f87171" : "oklch(0.88 0.02 75)"}`, fontFamily: "'Roboto', sans-serif", color: selectedFuneraria ? "oklch(0.15 0 0)" : "oklch(0.60 0 0)", backgroundColor: "oklch(1 0 0)" }}
                          >
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: "0.5rem" }}>{selectedFuneraria || "-- Seleccionar funeraria --"}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: funerariaOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}><path d="M6 9l6 6 6-6"/></svg>
                          </button>
                          {funerariaOpen && (
                            <div className="absolute z-50 w-full mt-1 rounded-xl overflow-y-auto" style={{ border: "1.5px solid oklch(0.88 0.02 75)", backgroundColor: "oklch(1 0 0)", boxShadow: "0 8px 24px oklch(0.10 0 0 / 0.12)", maxHeight: "260px" }}>
                              {FUNERARIAS.map(f => (
                                <button
                                  key={f}
                                  type="button"
                                  onClick={() => { setSelectedFuneraria(f); setFunerariaOpen(false); if (f !== "Otra dirección...") setCustomAddress(""); }}
                                  className="w-full px-4 py-3 text-base text-left transition-colors hover:bg-gray-50"
                                  style={{ fontFamily: "'Roboto', sans-serif", color: f === "Otra dirección..." ? "oklch(0.50 0.12 80)" : selectedFuneraria === f ? "oklch(0.50 0.12 80)" : "oklch(0.15 0 0)", backgroundColor: selectedFuneraria === f ? "oklch(0.72 0.12 80 / 0.08)" : "transparent", borderBottom: "1px solid oklch(0.94 0.01 75)", fontStyle: f === "Otra dirección..." ? "italic" : "normal" }}
                                >
                                  {f}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {errors.funeraria && <p className="text-base mt-1" style={{ color: "#ef4444", fontFamily: "'Roboto', sans-serif" }}>{errors.funeraria}</p>}
                      </div>
                    )}

                    {/* Dirección personalizada */}
                    {(deliveryType === "direccion" || (deliveryType === "funeraria" && selectedFuneraria === "Otra dirección...")) && (
                      <Field
                        label={deliveryType === "funeraria" ? "Dirección de la funeraria *" : "Dirección de entrega *"}
                        error={errors.customAddress}
                      >
                        <input
                          value={customAddress}
                          onChange={e => setCustomAddress(e.target.value)}
                          placeholder="Ej: Cra 50 #80-25, Barranquilla"
                          className={inputCls(errors.customAddress)}
                          style={INPUT_STYLE}
                        />
                      </Field>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Barrio / Sector (opcional)">
                        <input value={form.deliveryNeighborhood} onChange={e => set("deliveryNeighborhood", e.target.value)}
                          placeholder="Ej: El Prado" className={inputCls()} style={INPUT_STYLE} />
                      </Field>
                      <Field label="Fecha de entrega">
                        <input type="date" value={form.deliveryDate} onChange={e => set("deliveryDate", e.target.value)}
                          min={new Date().toISOString().split("T")[0]} className={inputCls()} style={INPUT_STYLE} />
                      </Field>
                      {/* Horario — dropdown personalizado */}
                      <div className="sm:col-span-2">
                        <label className="block text-base font-medium mb-1.5" style={{ color: "oklch(0.38 0 0)", fontFamily: "'Roboto', sans-serif" }}>Horario preferido</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => { setTimeOpen((o: boolean) => !o); setCityOpen(false); setFunerariaOpen(false); }}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-base text-left"
                            style={{ border: "1.5px solid oklch(0.88 0.02 75)", fontFamily: "'Roboto', sans-serif", color: form.deliveryTime ? "oklch(0.15 0 0)" : "oklch(0.60 0 0)", backgroundColor: "oklch(1 0 0)" }}
                          >
                            <span>{form.deliveryTime || "Seleccionar horario..."}</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: timeOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}><path d="M6 9l6 6 6-6"/></svg>
                          </button>
                          {timeOpen && (
                            <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden" style={{ border: "1.5px solid oklch(0.88 0.02 75)", backgroundColor: "oklch(1 0 0)", boxShadow: "0 8px 24px oklch(0.10 0 0 / 0.12)" }}>
                              {TIME_SLOTS.map(t => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => { set("deliveryTime", t); setTimeOpen(false); }}
                                  className="w-full px-4 py-3 text-base text-left transition-colors hover:bg-gray-50"
                                  style={{ fontFamily: "'Roboto', sans-serif", color: form.deliveryTime === t ? "oklch(0.50 0.12 80)" : "oklch(0.15 0 0)", backgroundColor: form.deliveryTime === t ? "oklch(0.72 0.12 80 / 0.08)" : "transparent", borderBottom: "1px solid oklch(0.94 0.01 75)" }}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </FormSection>

                {/* Dedicatoria */}
                <FormSection title="Tarjeta de Dedicatoria">
                  <Field label="Mensaje para la tarjeta (opcional)">
                    <textarea value={form.dedicatoria} onChange={e => set("dedicatoria", e.target.value)}
                      placeholder="Ej: Con todo nuestro amor y respeto, descansa en paz..."
                      rows={3} className={inputCls() + " resize-none"} style={INPUT_STYLE} />
                  </Field>
                  <p className="text-base mt-1" style={{ color: "oklch(0.60 0 0)", fontFamily: "'Roboto', sans-serif" }}>
                    Incluimos tarjeta de dedicatoria sin costo adicional
                  </p>
                </FormSection>

                {/* Método de pago */}
                <div className="rounded-2xl p-5 md:p-6" style={{ backgroundColor: "oklch(1 0 0)", border: "1px solid oklch(0.90 0.01 75)" }}>
                  <h3 className="text-base font-semibold mb-4"
                    style={{ color: "oklch(0 0 0)", fontFamily: "'Roboto', sans-serif", borderBottom: "1px solid oklch(0.92 0.01 75)", paddingBottom: "0.75rem" }}>
                    Pago Seguro Con Bold
                  </h3>
                  <div className="rounded-xl p-4 flex flex-col gap-4"
                    style={{ backgroundColor: "#fff", border: "1.5px solid oklch(0.90 0.01 75)" }}>
                    {/* Logo Bold */}
                    <div className="flex items-center gap-3">
                      <img src="/manus-storage/bold-logo_cd249c0e.png" alt="Bold" className="h-10 rounded-lg object-contain" style={{ maxWidth: "90px" }} />
                      <div>
                        <p className="text-base font-bold" style={{ color: "oklch(0.08 0 0)", fontFamily: "'Roboto', sans-serif" }}>Pago 100% Seguro</p>
                        <p className="text-base" style={{ color: "oklch(0.50 0 0)", fontFamily: "'Roboto', sans-serif" }}>Procesado por Bold</p>
                      </div>
                    </div>
                    {/* Métodos */}
                    <div className="flex flex-wrap gap-2">
                      {["Tarjeta Débito", "Tarjeta Crédito", "PSE", "Nequi", "Daviplata"].map(m => (
                        <span key={m} className="px-3 py-1 rounded-full text-base font-medium"
                          style={{ backgroundColor: "rgba(123,47,247,0.08)", color: "#4a1080", fontFamily: "'Roboto', sans-serif", border: "1px solid rgba(123,47,247,0.20)" }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <FormSection title="Notas Adicionales">
                  <Field label="Instrucciones especiales (opcional)">
                    <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
                      placeholder="Ej: Preguntar por el señor García al llegar..."
                      rows={2} className={inputCls() + " resize-none"} style={INPUT_STYLE} />
                  </Field>
                </FormSection>
              </div>

              {/* ---- RIGHT: Order summary ---- */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl overflow-hidden"
                  style={{ border: "1px solid oklch(0.90 0.01 75)", backgroundColor: "oklch(1 0 0)" }}>
                  {/* Summary header */}
                  <div className="px-5 py-4" style={{ backgroundColor: "oklch(0 0 0)" }}>
                    <h3 className="text-base font-medium" style={{ color: "oklch(0.97 0.01 75)", fontFamily: "'Roboto', sans-serif" }}>
                      Resumen del Pedido
                    </h3>
                    <p className="text-base mt-0.5" style={{ color: "oklch(0.72 0.12 80)", fontFamily: "'Roboto', sans-serif" }}>
                      {count} {count === 1 ? "artículo" : "artículos"}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="px-5 py-4 flex flex-col gap-3" style={{ borderBottom: "1px solid oklch(0.92 0.01 75)" }}>
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
                          style={{ backgroundColor: "oklch(0.96 0.01 75)" }}>
                          {item.imageUrl
                            ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(0.72 0.12 80)" strokeWidth="1.5"><path d="M12 2C10.5 2 9 3.5 9 5s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zM5 8c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zm14 0c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zm-7 4c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z"/></svg>
                              </div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium leading-snug" style={{ color: "oklch(0.08 0 0)", fontFamily: "'Roboto', sans-serif" }}>
                            {item.name}
                          </p>
                          <p className="text-base mt-0.5" style={{ color: "oklch(0.55 0 0)", fontFamily: "'Roboto', sans-serif" }}>
                            x{item.quantity} · {formatPrice(item.price)}
                          </p>
                        </div>
                        <span className="text-base font-semibold flex-shrink-0"
                          style={{ color: "#D4A017", fontFamily: "'Roboto', sans-serif" }}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="px-5 py-4 flex flex-col gap-2">
                    <div className="flex justify-between text-base" style={{ color: "oklch(0.45 0 0)", fontFamily: "'Roboto', sans-serif" }}>
                      <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-base" style={{ color: "oklch(0.45 0 0)", fontFamily: "'Roboto', sans-serif" }}>
                      <span>Envío ({CITIES.find(c => c.value === selectedCity)?.label})</span>
                      <span style={{ color: "oklch(0.35 0.12 145)", fontWeight: 600 }}>{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2"
                      style={{ borderTop: "2px solid oklch(0.72 0.12 80 / 0.3)", color: "oklch(0 0 0)", fontFamily: "'Roboto', sans-serif" }}>
                      <span>Total</span>
                      <span style={{ color: "#D4A017" }}>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="px-5 pb-5">
                    <button
                      type="submit"
                      disabled={createOrder.isPending}
                      className="btn-gold w-full py-4 rounded-full text-base disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {createOrder.isPending ? "Procesando..." : "PROCEDER AL PAGO"}
                    </button>
                    <p className="text-base text-center mt-3" style={{ color: "oklch(0.60 0 0)", fontFamily: "'Roboto', sans-serif" }}>
                      Te contactaremos para confirmar y coordinar el pago
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// ---- Helpers ----
function inputCls(error?: string) {
  return `w-full px-4 py-2.5 rounded-xl text-base outline-none transition-all ${error ? "border-red-400" : ""}`;
}

const INPUT_STYLE: React.CSSProperties = {
  fontFamily: "'Roboto', sans-serif",
  color: "oklch(0.15 0 0)",
  backgroundColor: "oklch(1 0 0)",
};

const ROBOTO = "'Roboto', sans-serif";

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 md:p-6"
      style={{ backgroundColor: "oklch(1 0 0)", border: "1px solid oklch(0.90 0.01 75)" }}>
      <h3 className="text-base font-semibold mb-4"
        style={{ color: "oklch(0 0 0)", fontFamily: "'Roboto', sans-serif", borderBottom: "1px solid oklch(0.92 0.01 75)", paddingBottom: "0.75rem" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, error, children, className = "" }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-base font-medium mb-1.5"
        style={{ color: "oklch(0.38 0 0)", fontFamily: "'Roboto', sans-serif" }}>
        {label}
      </label>
      <div style={{ border: `1.5px solid ${error ? "#f87171" : "oklch(0.88 0.02 75)"}`, borderRadius: "0.75rem", overflow: "hidden" }}>
        {children}
      </div>
      {error && <p className="text-base mt-1" style={{ color: "#ef4444", fontFamily: "'Roboto', sans-serif" }}>{error}</p>}
    </div>
  );
}

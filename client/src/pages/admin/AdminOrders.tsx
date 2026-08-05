import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import AdminAccounting from "./AdminAccounting";

type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";
type Tab = "orders" | "accounting";

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; color: string }> = {
  pending:   { label: "Pendiente",   bg: "oklch(0.97 0.04 80)",  color: "oklch(0.55 0.12 80)" },
  confirmed: { label: "Despachado",  bg: "oklch(0.96 0.04 200)", color: "oklch(0.45 0.12 200)" },
  delivered: { label: "Entregado",   bg: "oklch(0.95 0.06 145)", color: "oklch(0.40 0.14 145)" },
  cancelled: { label: "Cancelado",   bg: "oklch(0.97 0.04 10)",  color: "oklch(0.50 0.14 10)" },
};

const CARD_BG = "oklch(1 0 0)";
const BORDER = "oklch(0.90 0 0)";
const TEXT_MAIN = "oklch(0.22 0 0)";
const TEXT_MUTED = "oklch(0.55 0 0)";
const GOLD = "oklch(0.72 0.12 80)";

function formatCOP(v: string | number) {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminOrdersWithAccounting() {
  const { data: orders = [], isLoading, refetch } = trpc.admin.orders.list.useQuery();
  const updateStatus = trpc.admin.orders.updateStatus.useMutation({
    onSuccess: () => { toast.success("Estado actualizado"); refetch(); },
    onError: () => toast.error("Error al actualizar estado"),
  });

  const [tab, setTab] = useState<Tab>("orders");
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status as OrderStatus] = (acc[o.status as OrderStatus] ?? 0) + 1;
    return acc;
  }, {} as Record<OrderStatus, number>);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: BORDER }}>
        {(["orders", "accounting"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-3 text-base font-medium transition-all border-b-2"
            style={{
              color: tab === t ? GOLD : TEXT_MUTED,
              borderColor: tab === t ? GOLD : "transparent",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {t === "orders" ? "Pedidos" : "Contabilidad"}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
      {tab === "orders" && (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-light mb-1" style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>Pedidos</h1>
            <p className="text-base" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>Gestiona y actualiza el estado de cada pedido</p>
          </div>

          {/* Status summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.entries(STATUS_CONFIG) as [OrderStatus, typeof STATUS_CONFIG[OrderStatus]][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setFilter(filter === key ? "all" : key)}
                className="rounded-xl p-4 text-left transition-all hover:shadow-md"
                style={{
                  backgroundColor: filter === key ? cfg.bg : CARD_BG,
                  border: `1.5px solid ${filter === key ? cfg.color : BORDER}`,
                }}
              >
                <p className="text-2xl font-light mb-1" style={{ color: cfg.color, fontFamily: "'Roboto', sans-serif" }}>
                  {statusCounts[key] ?? 0}
                </p>
                <p className="text-base tracking-wider uppercase" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>{cfg.label}</p>
              </button>
            ))}
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap">
            {([["all", "Todos"], ...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label])] as [string, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key as OrderStatus | "all")}
                className="px-4 py-1.5 rounded-full text-base font-medium transition-all"
                style={{
                  backgroundColor: filter === key ? GOLD : "oklch(0.93 0 0)",
                  color: filter === key ? "oklch(0 0 0)" : TEXT_MUTED,
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Orders list */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-xl h-24 animate-pulse" style={{ backgroundColor: "oklch(0.93 0 0)" }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl p-12 text-center" style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}>
              <p className="text-base" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>No hay pedidos en esta categoría</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((order) => {
                const cfg = STATUS_CONFIG[order.status as OrderStatus] ?? STATUS_CONFIG.pending;
                const isOpen = expanded === order.id;
                let items: { name: string; quantity: number; price: number }[] = [];
                try { items = JSON.parse(order.items); } catch {}

                return (
                  <div
                    key={order.id}
                    className="rounded-xl overflow-hidden transition-all"
                    style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER}`, boxShadow: "0 1px 4px oklch(0.20 0 0 / 0.06)" }}
                  >
                    {/* Order header row */}
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer select-none"
                      onClick={() => setExpanded(isOpen ? null : order.id)}
                    >
                      {/* Status badge */}
                      <span
                        className="px-3 py-1 rounded-full text-base font-medium flex-shrink-0"
                        style={{ backgroundColor: cfg.bg, color: cfg.color, fontFamily: "'Roboto', sans-serif" }}
                      >
                        {cfg.label}
                      </span>

                      {/* Customer + date */}
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium truncate" style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>
                          {order.customerName}
                        </p>
                        <p className="text-base truncate" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>
                          {order.customerPhone} · {formatDate(order.createdAt)}
                        </p>
                      </div>

                      {/* Total */}
                      <p className="text-base font-medium flex-shrink-0" style={{ color: GOLD, fontFamily: "'Roboto', sans-serif", fontSize: "1rem" }}>
                        {formatCOP(order.total)}
                      </p>

                      {/* Expand arrow */}
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className="flex-shrink-0 transition-transform duration-200"
                        style={{ color: TEXT_MUTED, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>

                    {/* Expanded detail */}
                    {isOpen && (
                      <div className="px-4 pb-4 border-t" style={{ borderColor: BORDER }}>
                        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Left: order info */}
                          <div className="space-y-2">
                            <p className="text-base tracking-widest uppercase mb-2" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>Datos del pedido</p>
                            <InfoRow label="Direccion" value={order.deliveryAddress} />
                            {order.deliveryNeighborhood && <InfoRow label="Barrio" value={order.deliveryNeighborhood} />}
                            {order.deliveryDate && <InfoRow label="Fecha entrega" value={order.deliveryDate} />}
                            {order.deliveryTime && <InfoRow label="Hora" value={order.deliveryTime} />}
                            {order.customerEmail && <InfoRow label="Email" value={order.customerEmail} />}
                            {order.dedicatoria && <InfoRow label="Dedicatoria" value={order.dedicatoria} />}
                            {order.notes && <InfoRow label="Notas" value={order.notes} />}
                          </div>

                          {/* Right: items */}
                          <div>
                            <p className="text-base tracking-widest uppercase mb-2" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>Productos</p>
                            <div className="space-y-1">
                              {items.map((item, i) => (
                                <div key={i} className="flex justify-between text-base">
                                  <span style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>{item.name} x{item.quantity}</span>
                                  <span style={{ color: GOLD, fontFamily: "'Roboto', sans-serif" }}>{formatCOP(item.price * item.quantity)}</span>
                                </div>
                              ))}
                              <div className="flex justify-between text-base font-medium pt-2 border-t" style={{ borderColor: BORDER }}>
                                <span style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>Total</span>
                                <span style={{ color: GOLD, fontFamily: "'Roboto', sans-serif", fontSize: "1rem" }}>{formatCOP(order.total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status actions */}
                        <div className="mt-4 pt-4 border-t" style={{ borderColor: BORDER }}>
                          <p className="text-base tracking-widest uppercase mb-3" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>Cambiar estado</p>
                          <div className="flex gap-2 flex-wrap">
                            {(Object.entries(STATUS_CONFIG) as [OrderStatus, typeof STATUS_CONFIG[OrderStatus]][]).map(([key, s]) => (
                              <button
                                key={key}
                                disabled={order.status === key || updateStatus.isPending}
                                onClick={() => updateStatus.mutate({ id: order.id, status: key })}
                                className="px-4 py-2 rounded-lg text-base font-medium transition-all disabled:opacity-40"
                                style={{
                                  backgroundColor: order.status === key ? s.bg : "oklch(0.93 0 0)",
                                  color: order.status === key ? s.color : TEXT_MUTED,
                                  border: `1px solid ${order.status === key ? s.color : BORDER}`,
                                  fontFamily: "'Roboto', sans-serif",
                                }}
                              >
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Accounting Tab */}
      {tab === "accounting" && <AdminAccounting />}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-base">
      <span className="flex-shrink-0 font-medium" style={{ color: "oklch(0.38 0 0)", fontFamily: "'Roboto', sans-serif", minWidth: "90px" }}>{label}:</span>
      <span style={{ color: "oklch(0.38 0 0)", fontFamily: "'Roboto', sans-serif" }}>{value}</span>
    </div>
  );
}

import { trpc } from "@/lib/trpc";

const CARD_BG = "oklch(1 0 0)";
const BORDER = "oklch(0.90 0 0)";
const TEXT_MAIN = "oklch(0.22 0 0)";
const TEXT_MUTED = "oklch(0.55 0 0)";
const GOLD = "oklch(0.72 0.12 80)";

function formatCOP(value: number) {
  return "$" + value.toLocaleString("es-CO", { maximumFractionDigits: 0 });
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}>
      <p className="text-base tracking-widest uppercase mb-2" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>{label}</p>
      <p className="text-3xl font-light mb-1" style={{ color, fontFamily: "'Roboto', sans-serif" }}>{value}</p>
    </div>
  );
}

export default function AdminAccounting() {
  const { data: accounting, isLoading } = trpc.admin.orders.accounting.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ backgroundColor: "oklch(0.93 0 0)" }} />
          ))}
        </div>
      </div>
    );
  }

  if (!accounting) {
    return (
      <div className="text-center py-10">
        <p style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>No hay datos de contabilidad</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light mb-1" style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>Contabilidad</h1>
        <p className="text-base" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>Resumen de ventas entregadas y canceladas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Entregado"
          value={formatCOP(accounting.totalDelivered)}
          color={GOLD}
        />
        <StatCard
          label="Pedidos Entregados"
          value={String(accounting.deliveredCount)}
          color="oklch(0.50 0.12 200)"
        />
        <StatCard
          label="Total Cancelado"
          value={formatCOP(accounting.totalCancelled)}
          color="oklch(0.45 0.14 145)"
        />
        <StatCard
          label="Pedidos Cancelados"
          value={String(accounting.cancelledCount)}
          color="oklch(0.50 0.14 10)"
        />
      </div>

      {/* Daily Summary */}
      <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}>
        <p className="text-base font-medium mb-4" style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>Resumen por Día</p>
        {Object.keys(accounting.summary).length === 0 ? (
          <p className="text-base text-center py-6" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>Sin datos aún</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {["Fecha", "Pedidos", "Total"].map(h => (
                    <th key={h} className="text-left pb-3 pr-4 text-base tracking-widest uppercase" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(accounting.summary)
                  .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                  .map(([date, data]) => (
                    <tr key={date} style={{ borderBottom: `1px solid oklch(0.93 0 0)` }}>
                      <td className="py-3 pr-4 font-light" style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>{date}</td>
                      <td className="py-3 pr-4" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>{data.count}</td>
                      <td className="py-3 pr-4 font-medium" style={{ color: GOLD, fontFamily: "'Roboto', sans-serif" }}>{formatCOP(data.total)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Delivered Orders */}
      <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}>
        <p className="text-base font-medium mb-4" style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>Últimos Pedidos Entregados</p>
        {accounting.deliveredOrders.length === 0 ? (
          <p className="text-base text-center py-6" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>Sin pedidos entregados aún</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {["Cliente", "Teléfono", "Total", "Fecha"].map(h => (
                    <th key={h} className="text-left pb-3 pr-4 text-base tracking-widest uppercase" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accounting.deliveredOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: `1px solid oklch(0.93 0 0)` }}>
                    <td className="py-3 pr-4 font-light" style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>{order.customerName}</td>
                    <td className="py-3 pr-4" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>{order.customerPhone}</td>
                    <td className="py-3 pr-4 font-medium" style={{ color: GOLD, fontFamily: "'Roboto', sans-serif" }}>{formatCOP(parseFloat(String(order.total)))}</td>
                    <td className="py-3" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>
                      {new Date(order.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

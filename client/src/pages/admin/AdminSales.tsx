import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

function formatCOP(v: string | number) {
  const n = typeof v === "string" ? parseFloat(v) : v;
  if (isNaN(n)) return "$0";
  return "$" + n.toLocaleString("es-CO", { maximumFractionDigits: 0 });
}

export default function AdminSales() {
  const utils = trpc.useUtils();
  const { data: sales = [], isLoading } = trpc.admin.sales.list.useQuery();
  const { data: products = [] } = trpc.admin.products.list.useQuery();
  const createMutation = trpc.admin.sales.create.useMutation({
    onSuccess: () => {
      utils.admin.sales.list.invalidate();
      utils.admin.sales.summary.invalidate();
      utils.admin.sales.weeklyChart.invalidate();
      utils.admin.sales.monthlyChart.invalidate();
      toast.success("Venta registrada");
      setForm({ productId: "", productName: "", quantity: "1", unitPrice: "", notes: "", saleDate: "" });
    },
    onError: () => toast.error("Error al registrar venta"),
  });

  const [form, setForm] = useState({
    productId: "",
    productName: "",
    quantity: "1",
    unitPrice: "",
    notes: "",
    saleDate: "",
  });

  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id === "") {
      setForm(f => ({ ...f, productId: "", productName: "", unitPrice: "" }));
      return;
    }
    const product = products.find(p => String(p.id) === id);
    if (product) {
      setForm(f => ({
        ...f,
        productId: id,
        productName: product.name,
        unitPrice: String(product.price),
      }));
    }
  };

  const total = parseFloat(form.quantity || "0") * parseFloat(form.unitPrice || "0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productName || !form.unitPrice) { toast.error("Completa los campos requeridos"); return; }
    createMutation.mutate({
      productId: form.productId ? parseInt(form.productId) : undefined,
      productName: form.productName,
      quantity: parseInt(form.quantity) || 1,
      unitPrice: parseFloat(form.unitPrice),
      notes: form.notes || undefined,
      saleDate: form.saleDate || undefined,
    });
  };

  const inputStyle = {
    backgroundColor: "oklch(0.05 0 0)",
    border: "1px solid oklch(0.28 0 0)",
    color: "oklch(0.92 0.015 75)",
    borderRadius: "8px",
    padding: "10px 12px",
    fontFamily: "'Roboto', sans-serif",
    fontSize: "14px",
    width: "100%",
  };

  const labelStyle = {
    color: "oklch(0.55 0 0)",
    fontFamily: "'Roboto', sans-serif",
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    marginBottom: "6px",
    display: "block",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light" style={{ color: "oklch(0.92 0.015 75)", fontFamily: "'Roboto', sans-serif" }}>Registro de Ventas</h1>
        <p className="text-base" style={{ color: "oklch(0.45 0 0)", fontFamily: "'Roboto', sans-serif" }}>{sales.length} ventas registradas</p>
      </div>

      {/* Form */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: "oklch(0.08 0 0)" }}>
        <p className="text-base font-medium mb-4" style={{ color: "oklch(0.72 0.12 80)", fontFamily: "'Roboto', sans-serif" }}>Nueva Venta</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Seleccionar Producto</label>
              <select style={inputStyle} value={form.productId} onChange={handleProductSelect}>
                <option value="">— Seleccionar del catálogo —</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} · {formatCOP(p.price)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Nombre del Producto *</label>
              <input
                style={inputStyle}
                value={form.productName}
                onChange={e => setForm(f => ({ ...f, productName: e.target.value }))}
                required
                placeholder="O escribe el nombre manualmente"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label style={labelStyle}>Cantidad *</label>
              <input
                style={inputStyle}
                type="number"
                min="1"
                value={form.quantity}
                onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Precio Unit. (COP) *</label>
              <input
                style={inputStyle}
                type="number"
                value={form.unitPrice}
                onChange={e => setForm(f => ({ ...f, unitPrice: e.target.value }))}
                required
                placeholder="195000"
              />
            </div>
            <div>
              <label style={labelStyle}>Total</label>
              <div
                className="flex items-center"
                style={{ ...inputStyle, backgroundColor: "oklch(0.05 0 0)", color: "oklch(0.72 0.12 80)", fontWeight: "600" }}
              >
                {formatCOP(isNaN(total) ? 0 : total)}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Fecha</label>
              <input
                style={inputStyle}
                type="datetime-local"
                value={form.saleDate}
                onChange={e => setForm(f => ({ ...f, saleDate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Notas (opcional)</label>
            <input
              style={inputStyle}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Cliente, funeraria, observaciones..."
            />
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-8 py-3 rounded-full text-base font-medium tracking-wider uppercase transition-all hover:opacity-80"
            style={{ backgroundColor: "oklch(0.72 0.12 80)", color: "oklch(0 0 0)", fontFamily: "'Roboto', sans-serif" }}
          >
            {createMutation.isPending ? "Registrando..." : "Registrar Venta"}
          </button>
        </form>
      </div>

      {/* Sales table */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: "oklch(0.08 0 0)" }}>
        <p className="text-base font-medium mb-4" style={{ color: "oklch(0.92 0.015 75)", fontFamily: "'Roboto', sans-serif" }}>Historial de Ventas</p>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-12 rounded-xl animate-pulse" style={{ backgroundColor: "oklch(0.05 0 0)" }} />)}
          </div>
        ) : sales.length === 0 ? (
          <p className="text-center py-10 text-base" style={{ color: "oklch(0.45 0 0)", fontFamily: "'Roboto', sans-serif" }}>No hay ventas registradas aún</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(0.05 0 0)" }}>
                  {["Producto", "Cant.", "Precio Unit.", "Total", "Notas", "Fecha"].map(h => (
                    <th key={h} className="text-left pb-3 pr-4 text-base tracking-widest uppercase whitespace-nowrap" style={{ color: "oklch(0.45 0 0)", fontFamily: "'Roboto', sans-serif" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale.id} style={{ borderBottom: "1px solid oklch(0.20 0 0 / 0.5)" }}>
                    <td className="py-3 pr-4 font-light max-w-[160px] truncate" style={{ color: "oklch(0.80 0 0)", fontFamily: "'Roboto', sans-serif" }}>{sale.productName}</td>
                    <td className="py-3 pr-4 text-center" style={{ color: "oklch(0.65 0 0)", fontFamily: "'Roboto', sans-serif" }}>{sale.quantity}</td>
                    <td className="py-3 pr-4 whitespace-nowrap" style={{ color: "oklch(0.65 0 0)", fontFamily: "'Roboto', sans-serif" }}>{formatCOP(String(sale.unitPrice))}</td>
                    <td className="py-3 pr-4 font-semibold whitespace-nowrap" style={{ color: "oklch(0.72 0.12 80)", fontFamily: "'Roboto', sans-serif" }}>{formatCOP(String(sale.totalPrice))}</td>
                    <td className="py-3 pr-4 max-w-[120px] truncate" style={{ color: "oklch(0.45 0 0)", fontFamily: "'Roboto', sans-serif" }}>{sale.notes ?? "—"}</td>
                    <td className="py-3 whitespace-nowrap" style={{ color: "oklch(0.45 0 0)", fontFamily: "'Roboto', sans-serif" }}>
                      {new Date(sale.saleDate).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit" })}
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

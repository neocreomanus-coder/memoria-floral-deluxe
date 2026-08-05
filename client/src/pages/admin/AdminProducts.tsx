import { trpc } from "@/lib/trpc";
import { useState, useRef } from "react";
import { toast } from "sonner";

const SECTIONS = [
  { value: "coronas_funebres", label: "Coronas Fúnebres" },
  { value: "sudarios", label: "Sudarios" },
  { value: "rosas_inmortalizadas", label: "Rosas Inmortalizadas" },
  { value: "por_menos_200", label: "Por Menos de $200.000" },
];

type Section = (typeof SECTIONS)[number]["value"];

interface ProductForm {
  name: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
  section: Section;
  description: string;
  isEnabled: boolean;
  isOffer: boolean;
  isFeatured: boolean;
  sortOrder: string;
}

const EMPTY_FORM: ProductForm = {
  name: "", price: "", originalPrice: "", imageUrl: "",
  section: "coronas_funebres", description: "",
  isEnabled: true, isOffer: false, isFeatured: false, sortOrder: "0",
};

const CARD = "oklch(1 0 0)";
const BORDER = "oklch(0.90 0 0)";
const TEXT_MAIN = "oklch(0.22 0 0)";
const TEXT_MUTED = "oklch(0.55 0 0)";
const GOLD = "oklch(0.72 0.12 80)";
const BG_INPUT = "oklch(0.97 0.005 250)";

function formatCOP(v: string | number) {
  const n = typeof v === "string" ? parseFloat(v) : v;
  if (isNaN(n)) return "$0";
  return "$" + n.toLocaleString("es-CO", { maximumFractionDigits: 0 });
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      className="w-10 h-5 rounded-full relative cursor-pointer transition-all flex-shrink-0"
      style={{ backgroundColor: checked ? GOLD : "oklch(0.82 0 0)" }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
        style={{ backgroundColor: "white", left: checked ? "22px" : "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
      />
    </div>
  );
}

export default function AdminProducts() {
  const utils = trpc.useUtils();
  const { data: products = [], isLoading } = trpc.admin.products.list.useQuery();
  const createMutation = trpc.admin.products.create.useMutation({ onSuccess: () => { utils.admin.products.list.invalidate(); toast.success("Producto creado"); setShowForm(false); setForm(EMPTY_FORM); } });
  const updateMutation = trpc.admin.products.update.useMutation({ onSuccess: () => { utils.admin.products.list.invalidate(); toast.success("Producto actualizado"); setShowForm(false); setEditId(null); setForm(EMPTY_FORM); } });
  const deleteMutation = trpc.admin.products.delete.useMutation({ onSuccess: () => { utils.admin.products.list.invalidate(); toast.success("Producto eliminado"); } });
  const toggleMutation = trpc.admin.products.toggleEnabled.useMutation({ onSuccess: () => utils.admin.products.list.invalidate() });
  const uploadMutation = trpc.admin.uploadImage.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [filterSection, setFilterSection] = useState<string>("all");
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = filterSection === "all" ? products : products.filter(p => p.section === filterSection);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = (ev.target?.result as string).split(",")[1];
        const result = await uploadMutation.mutateAsync({ base64, filename: file.name, mimeType: file.type });
        setForm(f => ({ ...f, imageUrl: result.url }));
        toast.success("Imagen subida");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Error al subir imagen");
      setUploading(false);
    }
  };

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (p: typeof products[0]) => {
    setForm({
      name: p.name, price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : "",
      imageUrl: p.imageUrl ?? "", section: p.section as Section,
      description: p.description ?? "", isEnabled: p.isEnabled,
      isOffer: p.isOffer, isFeatured: p.isFeatured, sortOrder: String(p.sortOrder),
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name, price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      imageUrl: form.imageUrl || undefined,
      section: form.section as "coronas_funebres" | "sudarios" | "rosas_inmortalizadas" | "por_menos_200",
      description: form.description || undefined,
      isEnabled: form.isEnabled, isOffer: form.isOffer,
      isFeatured: form.isFeatured, sortOrder: parseInt(form.sortOrder) || 0,
    };
    if (editId !== null) updateMutation.mutate({ id: editId, data });
    else createMutation.mutate(data);
  };

  const inputCls = "w-full px-3 py-2.5 rounded-lg text-base outline-none transition-all focus:ring-2";
  const inputSt = { backgroundColor: BG_INPUT, border: `1px solid ${BORDER}`, color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" };
  const labelSt = { color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" as const, display: "block", marginBottom: "5px", fontWeight: 600 };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-light" style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>Productos</h1>
          <p className="text-base" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>{products.length} producto{products.length !== 1 ? "s" : ""} en total</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 rounded-full text-base font-medium tracking-wider uppercase transition-all hover:opacity-85 active:scale-95"
          style={{ backgroundColor: GOLD, color: "oklch(0 0 0)", fontFamily: "'Roboto', sans-serif", boxShadow: `0 2px 12px ${GOLD}55` }}
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[{ value: "all", label: "Todos" }, ...SECTIONS].map(s => (
          <button
            key={s.value}
            onClick={() => setFilterSection(s.value)}
            className="px-3 py-1.5 rounded-full text-base font-medium transition-all"
            style={{
              backgroundColor: filterSection === s.value ? GOLD : "oklch(0.94 0 0)",
              color: filterSection === s.value ? "oklch(0 0 0)" : TEXT_MUTED,
              fontFamily: "'Roboto', sans-serif",
              border: `1px solid ${filterSection === s.value ? GOLD : BORDER}`,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
          <div className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col" style={{ backgroundColor: CARD, maxHeight: "92vh" }}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: BORDER }}>
              <h2 className="text-xl font-light" style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>
                {editId !== null ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); }}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-gray-100"
                style={{ color: TEXT_MUTED }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label style={labelSt}>Nombre *</label>
                <input className={inputCls} style={inputSt} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Ej: Corona Blanca Esmeralda" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelSt}>Precio (COP) *</label>
                  <input className={inputCls} style={inputSt} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required placeholder="195000" />
                </div>
                <div>
                  <label style={labelSt}>Precio Original</label>
                  <input className={inputCls} style={inputSt} type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} placeholder="220000" />
                </div>
              </div>

              <div>
                <label style={labelSt}>Sección *</label>
                <select className={inputCls} style={inputSt} value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value as Section }))}>
                  {SECTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              <div>
                <label style={labelSt}>Imagen del Producto</label>
                <div className="flex gap-2 items-center">
                  <input className={inputCls} style={{ ...inputSt, flex: 1 }} value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="URL o sube un archivo" />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex-shrink-0 px-3 py-2.5 rounded-lg text-base font-medium transition-all hover:opacity-80 flex items-center gap-1.5"
                    style={{ backgroundColor: "oklch(0.94 0 0)", color: TEXT_MAIN, border: `1px solid ${BORDER}`, fontFamily: "'Roboto', sans-serif" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {uploading ? "Subiendo..." : "Subir"}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
                {form.imageUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={form.imageUrl.startsWith("/") ? form.imageUrl : form.imageUrl}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-lg"
                      style={{ border: `1px solid ${BORDER}` }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div>
                      <p className="text-base font-medium" style={{ color: "oklch(0.40 0.14 145)", fontFamily: "'Roboto', sans-serif" }}>Imagen subida correctamente</p>
                      <p className="text-base mt-0.5 break-all" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{form.imageUrl.split("/").pop()}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label style={labelSt}>Descripción</label>
                <textarea className={inputCls} style={{ ...inputSt, minHeight: "72px", resize: "vertical" }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción del arreglo..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelSt}>Orden</label>
                  <input className={inputCls} style={inputSt} type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))} />
                </div>
                <div className="space-y-2.5 pt-5">
                  {[
                    { key: "isEnabled", label: "Habilitado" },
                    { key: "isOffer", label: "Oferta" },
                    { key: "isFeatured", label: "Destacado" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                      <Toggle
                        checked={!!form[key as keyof ProductForm]}
                        onChange={() => setForm(f => ({ ...f, [key]: !f[key as keyof ProductForm] }))}
                      />
                      <span style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif", fontSize: "13px" }}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1 pb-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 py-3 rounded-full text-base font-medium tracking-wider uppercase transition-all hover:opacity-85 disabled:opacity-50"
                  style={{ backgroundColor: GOLD, color: "oklch(0 0 0)", fontFamily: "'Roboto', sans-serif" }}
                >
                  {createMutation.isPending || updateMutation.isPending ? "Guardando..." : editId !== null ? "Actualizar" : "Crear Producto"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_FORM); }}
                  className="px-5 py-3 rounded-full text-base font-medium transition-all hover:bg-gray-100"
                  style={{ border: `1px solid ${BORDER}`, color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl animate-pulse" style={{ backgroundColor: "oklch(0.94 0 0)" }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
          <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "oklch(0.94 0 0)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={TEXT_MUTED} strokeWidth="1.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          </div>
          <p className="text-base font-light mb-1" style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>No hay productos en esta sección</p>
          <button onClick={openCreate} className="text-base underline mt-1" style={{ color: GOLD, fontFamily: "'Roboto', sans-serif" }}>Crear el primero</button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(product => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{
                backgroundColor: CARD,
                border: `1px solid ${BORDER}`,
                opacity: product.isEnabled ? 1 : 0.55,
                boxShadow: "0 1px 3px oklch(0.20 0 0 / 0.05)"
              }}
            >
              {/* Image */}
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: "oklch(0.94 0 0)", border: `1px solid ${BORDER}` }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={TEXT_MUTED} strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-medium text-base truncate" style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>{product.name}</p>
                  {product.isOffer && (
                    <span className="text-base px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "oklch(0.97 0.04 10)", color: "oklch(0.50 0.14 10)", fontFamily: "'Roboto', sans-serif", fontSize: "10px" }}>Oferta</span>
                  )}
                  {product.isFeatured && (
                    <span className="text-base px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "oklch(0.97 0.04 80)", color: "oklch(0.55 0.12 80)", fontFamily: "'Roboto', sans-serif", fontSize: "10px" }}>Destacado</span>
                  )}
                </div>
                <p className="text-base mt-0.5" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>
                  {SECTIONS.find(s => s.value === product.section)?.label} · <span style={{ color: GOLD, fontWeight: 600 }}>{formatCOP(product.price)}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Toggle
                  checked={product.isEnabled}
                  onChange={() => toggleMutation.mutate({ id: product.id, isEnabled: !product.isEnabled })}
                />
                <button
                  onClick={() => openEdit(product)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-gray-100"
                  style={{ color: "oklch(0.45 0.12 200)" }}
                  title="Editar"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
                <button
                  onClick={() => { if (confirm("¿Eliminar este producto?")) deleteMutation.mutate({ id: product.id }); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-red-50"
                  style={{ color: "oklch(0.55 0.15 10)" }}
                  title="Eliminar"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

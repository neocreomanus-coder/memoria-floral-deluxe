import { trpc } from "@/lib/trpc";
import { useState, useRef } from "react";
import { toast } from "sonner";

export default function AdminGallery() {
  const utils = trpc.useUtils();
  const { data: images = [], isLoading } = trpc.admin.gallery.list.useQuery();
  const createMutation = trpc.admin.gallery.create.useMutation({
    onSuccess: () => { utils.admin.gallery.list.invalidate(); toast.success("Imagen agregada"); setForm({ imageUrl: "", title: "", sortOrder: "0" }); },
  });
  const deleteMutation = trpc.admin.gallery.delete.useMutation({
    onSuccess: () => { utils.admin.gallery.list.invalidate(); toast.success("Imagen eliminada"); },
  });
  const uploadMutation = trpc.admin.uploadImage.useMutation();

  const [form, setForm] = useState({ imageUrl: "", title: "", sortOrder: "0" });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl) { toast.error("Sube o ingresa una URL de imagen"); return; }
    createMutation.mutate({ imageUrl: form.imageUrl, title: form.title || undefined, sortOrder: parseInt(form.sortOrder) || 0 });
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
        <h1 className="text-3xl font-light" style={{ color: "oklch(0.92 0.015 75)", fontFamily: "'Roboto', sans-serif" }}>Galería</h1>
        <p className="text-base" style={{ color: "oklch(0.45 0 0)", fontFamily: "'Roboto', sans-serif" }}>{images.length} imágenes en la galería</p>
      </div>

      {/* Upload form */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: "oklch(0.08 0 0)" }}>
        <p className="text-base font-medium mb-4" style={{ color: "oklch(0.72 0.12 80)", fontFamily: "'Roboto', sans-serif" }}>Agregar Imagen</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={labelStyle}>Imagen *</label>
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <input style={inputStyle} value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="URL de imagen o sube un archivo" />
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2.5 rounded-lg text-base font-medium transition-all hover:opacity-80 whitespace-nowrap"
                style={{ backgroundColor: "oklch(0.28 0 0)", color: "oklch(0.72 0.12 80)", fontFamily: "'Roboto', sans-serif" }}
              >
                {uploading ? "Subiendo..." : "📁 Subir"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            {form.imageUrl && (
              <img src={form.imageUrl} alt="Preview" className="mt-2 h-28 w-28 object-cover rounded-xl" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Título (opcional)</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Descripción de la imagen" />
            </div>
            <div>
              <label style={labelStyle}>Orden</label>
              <input style={inputStyle} type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))} />
            </div>
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-8 py-3 rounded-full text-base font-medium tracking-wider uppercase transition-all hover:opacity-80"
            style={{ backgroundColor: "oklch(0.72 0.12 80)", color: "oklch(0 0 0)", fontFamily: "'Roboto', sans-serif" }}
          >
            {createMutation.isPending ? "Agregando..." : "Agregar a Galería"}
          </button>
        </form>
      </div>

      {/* Gallery grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square rounded-xl animate-pulse" style={{ backgroundColor: "oklch(0.08 0 0)" }} />)}
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: "oklch(0.08 0 0)" }}>
          <p className="text-4xl mb-3">🖼️</p>
          <p className="text-lg font-light" style={{ color: "oklch(0.55 0 0)", fontFamily: "'Roboto', sans-serif" }}>La galería está vacía</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map(img => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden" style={{ aspectRatio: "1/1" }}>
              <img src={img.imageUrl} alt={img.title ?? ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <button
                  onClick={() => { if (confirm("¿Eliminar esta imagen?")) deleteMutation.mutate({ id: img.id }); }}
                  className="p-2.5 rounded-full transition-all hover:scale-110"
                  style={{ backgroundColor: "oklch(0.38 0.12 10)", color: "white" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
                </button>
              </div>
              {img.title && (
                <div className="absolute bottom-0 left-0 right-0 p-2" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                  <p className="text-base truncate" style={{ color: "white", fontFamily: "'Roboto', sans-serif" }}>{img.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

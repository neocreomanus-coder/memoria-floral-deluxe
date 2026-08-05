import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminLogin from "./admin/AdminLogin";
import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";

const LOGO_URL = "/manus-storage/logo-memoria-floral_085b0d4e.jpeg";

type Tab = "products" | "orders";

// SVG icons — no emojis
function IconProducts() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function IconOrders() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}

const NAV_ITEMS: { id: Tab; label: string; Icon: () => React.ReactElement }[] = [
  { id: "products", label: "Productos", Icon: IconProducts },
  { id: "orders", label: "Pedidos", Icon: IconOrders },
];

const BG = "oklch(0.97 0.005 250)";
const SIDEBAR_BG = "oklch(1 0 0)";
const SIDEBAR_BORDER = "oklch(0.90 0 0)";
const TEXT_MAIN = "oklch(0.22 0 0)";
const TEXT_MUTED = "oklch(0.55 0 0)";
const GOLD = "oklch(0.72 0.12 80)";

export default function Admin() {
  const [, navigate] = useLocation();
  const { isAuthenticated, adminUsername, logout } = useAdminAuth();
  const [tab, setTab] = useState<Tab>("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    navigate("/admin-login");
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (false) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: BG }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: GOLD }} />
      </div>
    );
  }

  // Show login page if not authenticated
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: BG }}>
      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ backgroundColor: "rgba(0,0,0,0.25)" }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ backgroundColor: SIDEBAR_BG, borderRight: `1px solid ${SIDEBAR_BORDER}` }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b" style={{ borderColor: SIDEBAR_BORDER }}>
          <img src={LOGO_URL} alt="Logo" className="w-10 h-10 rounded-full object-contain" style={{ border: `1px solid ${GOLD}` }} />
          <div>
          <p className="text-base font-light tracking-wider" style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>Memoria Floral</p>
          <p className="text-base" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>Panel Admin</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all text-left"
              style={{
                backgroundColor: tab === id ? "oklch(0.72 0.12 80 / 0.10)" : "transparent",
                color: tab === id ? GOLD : TEXT_MUTED,
                fontFamily: "'Roboto', sans-serif",
                borderLeft: tab === id ? `3px solid ${GOLD}` : "3px solid transparent",
              }}
            >
              <Icon />
              {label}
            </button>
          ))}
        </nav>

        {/* User & logout */}
        <div className="p-4 border-t" style={{ borderColor: SIDEBAR_BORDER }}>
          <p className="text-base mb-3 truncate" style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>Admin: {adminUsername}</p>
          <div className="flex gap-2">
            <a href="/" className="flex-1 py-2 rounded-lg text-base text-center transition-all hover:opacity-70" style={{ backgroundColor: "oklch(0.93 0 0)", color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}>
              Sitio
            </a>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 rounded-lg text-base transition-all hover:opacity-70"
              style={{ backgroundColor: "oklch(0.95 0.03 10)", color: "oklch(0.45 0.14 10)", fontFamily: "'Roboto', sans-serif" }}
            >
              Salir
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="flex items-center justify-between px-4 py-3 border-b lg:hidden" style={{ backgroundColor: SIDEBAR_BG, borderColor: SIDEBAR_BORDER }}>
          <button onClick={() => setSidebarOpen(true)} style={{ color: TEXT_MAIN }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          </button>
          <p className="text-base font-light" style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}>
            {NAV_ITEMS.find(n => n.id === tab)?.label}
          </p>
          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          {tab === "products" && <AdminProducts />}
          {tab === "orders" && <AdminOrders />}
        </main>
      </div>
    </div>
  );
}

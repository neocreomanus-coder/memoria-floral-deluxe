import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useState } from "react";
import { useLocation } from "wouter";

const LOGO_URL = "/manus-storage/logo-memoria-floral_085b0d4e.jpeg";

const BG = "oklch(0.97 0.005 250)";
const CARD_BG = "oklch(1 0 0)";
const BORDER = "oklch(0.90 0 0)";
const TEXT_MAIN = "oklch(0.22 0 0)";
const TEXT_MUTED = "oklch(0.55 0 0)";
const GOLD = "oklch(0.72 0.12 80)";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAdminAuth();
  const [, navigate] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate("/admin");
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: BG }}>
      <div className="w-full max-w-sm rounded-2xl p-8 shadow-lg" style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}>
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={LOGO_URL} 
            alt="Logo Memoria Floral Deluxe" 
            className="w-24 h-24 rounded-full object-contain" 
            style={{ border: `2px solid ${GOLD}` }} 
          />
        </div>

        {/* Title */}
        <h1 
          className="text-3xl font-light text-center mb-2 tracking-wide" 
          style={{ color: TEXT_MAIN, fontFamily: "'Roboto', sans-serif" }}
        >
          Panel Administrativo
        </h1>

        {/* Subtitle */}
        <p 
          className="text-base text-center mb-8" 
          style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}
        >
          Gestión de productos y pedidos
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border"
              style={{ borderColor: BORDER, fontFamily: "'Roboto', sans-serif" }}
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border"
              style={{ borderColor: BORDER, fontFamily: "'Roboto', sans-serif" }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: "oklch(0.95 0.1 20)", color: "oklch(0.4 0.1 20)" }}>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-full text-base font-medium tracking-widest uppercase transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: GOLD, color: "oklch(0 0 0)", fontFamily: "'Roboto', sans-serif" }}
          >
            INGRESAR
          </button>
        </form>

        {/* Footer info */}
        <p 
          className="text-xs text-center mt-8" 
          style={{ color: TEXT_MUTED, fontFamily: "'Roboto', sans-serif" }}
        >
          Solo administradores autorizados pueden acceder a este panel.
        </p>
      </div>
    </div>
  );
}

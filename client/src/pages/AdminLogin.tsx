import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular delay de autenticación
    setTimeout(() => {
      if (login(username, password)) {
        toast.success("¡Bienvenido al panel administrativo!");
        navigate("/admin");
      } else {
        toast.error("Usuario o contraseña incorrectos");
        setPassword("");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "oklch(1 0 0)" }}>
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div
          className="w-full max-w-md rounded-2xl p-8 shadow-lg"
          style={{
            backgroundColor: "oklch(1 0 0)",
            border: "1px solid oklch(0.92 0.01 75)",
          }}
        >
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-semibold mb-2"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "oklch(0.05 0 0)",
              }}
            >
              Panel Administrativo
            </h1>
            <p
              className="text-sm"
              style={{
                fontFamily: "'Lato', sans-serif",
                color: "oklch(0.55 0 0)",
              }}
            >
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1.5"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  color: "oklch(0.05 0 0)",
                }}
              >
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{
                  borderColor: "oklch(0.85 0.02 75)",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "1rem",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "oklch(0.72 0.12 80)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px oklch(0.72 0.12 80 / 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "oklch(0.85 0.02 75)";
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1.5"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  color: "oklch(0.05 0 0)",
                }}
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{
                  borderColor: "oklch(0.85 0.02 75)",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: "1rem",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "oklch(0.72 0.12 80)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "oklch(0.85 0.02 75)";
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full btn-gold py-2.5 rounded-lg font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "1rem",
                letterSpacing: "0.05em",
              }}
            >
              {isLoading ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "currentColor" }}
                  />
                  Ingresando...
                </>
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 3H9a6 6 0 0 0 0 12h.25" />
                    <path d="M15.25 16H9a6 6 0 0 1 0-12" />
                  </svg>
                  Ingresar
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

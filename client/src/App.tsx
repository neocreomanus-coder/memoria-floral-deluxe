import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import CartDrawer from "./components/CartDrawer";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Catalogo from "./pages/Catalogo";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Pago from "./pages/Pago";
import Producto from "./pages/Producto";

// Scroll to top on every route change
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/pago" component={Pago} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin" component={Admin} />
        <Route path="/catalogo" component={Catalogo} />
        <Route path="/producto/:id" component={Producto} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <AdminAuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <CartDrawer />
            </TooltipProvider>
          </AdminAuthProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

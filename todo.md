# Memoria Floral Deluxe — TODO

## Base de datos y backend
- [x] Esquema: tabla products (nombre, precio, imagen, sección, categoría, habilitado, oferta, precioOriginal)
- [x] Esquema: tabla sales (productId, productName, quantity, price, date, notes)
- [x] Esquema: tabla gallery (imageUrl, title, order)
- [x] Migración SQL aplicada
- [x] Helpers en server/db.ts para products, sales, gallery
- [x] Routers tRPC: products CRUD, sales CRUD, gallery CRUD
- [x] Subida de imágenes a S3 desde admin
- [x] Protección de rutas admin con verificación de rol

## Frontend público
- [x] Estilos globales: paleta de colores Pablo Rossi (beige/crema, azul oscuro, burdeos), tipografías
- [x] Barra de anuncio superior animada (cobertura Barranquilla)
- [x] Header con logo Memoria Floral Deluxe + navegación responsive
- [x] Hero section con fondo oscuro y CTA
- [x] Sección: Coronas Fúnebres (layout cards idéntico a Pablo Rossi)
- [x] Sección: Arreglos de Altar
- [x] Sección: Cruces Florales
- [x] Sección: Cojines Florales
- [x] Sección: Canastas Fúnebres
- [x] Sección: Ramos Fúnebres
- [x] Carrusel de productos destacados
- [x] Filtro por categoría/sección
- [x] Galería tipo mosaico
- [x] Sección de contacto (WhatsApp, email, horarios, cobertura Barranquilla)
- [x] Footer (logo, categorías, contacto, redes sociales)
- [x] Botón flotante de WhatsApp

## Panel administrativo
- [x] Ruta /admin protegida por rol
- [x] Dashboard con métricas: ventas diarias, semanales, mensuales (gráficas Recharts)
- [x] Gestión de productos: crear, editar, eliminar
- [x] Subida de imágenes en formulario de producto
- [x] Toggle habilitado/deshabilitado por producto
- [x] Asignación de sección y categoría a producto
- [x] Registro manual de ventas (producto, cantidad, precio, fecha)
- [x] Tabla de ventas recientes

## Calidad
- [x] Diseño 100% responsive mobile-first
- [x] Tests vitest para routers principales (17/17 passing)
- [x] Checkpoint final

## Nuevas funcionalidades
- [x] Sección "Nuestras Entregas En Funerarias" con carrusel de imágenes y botón "VER MÁS..."

## Mejoras visuales y funcionales (ronda 2)
- [x] Fondo principal cambiar a blanco puro
- [x] Hero: imagen de fondo alusiva a arreglos fúnebres + texto de condolencias + 20 años de experiencia
- [x] Botones dorados con efecto brillante y animación de movimiento
- [x] Botón "Conocer Más" → redirigir al catálogo de esa categoría
- [x] Página de catálogo completo con filtros por sección
- [x] Header premium: logo y nombre más elegante
- [x] Ícono WhatsApp flotante: flor dorada con blanca (SVG personalizado)
- [x] Sección de reseñas Google debajo de Funerarias (estilo Pablo Rossi)

## Producto, Carrito y Checkout (ronda 3)
- [x] Fotos reales generadas para 6 categorías fúnebres
- [x] Página de producto individual estilo Pablo Rossi (galería, cantidad, botones)
- [x] Carrito lateral (drawer) con estado global y contador en header
- [x] Página de checkout con formulario y resumen del pedido
- [x] Integrar "Agregar al carrito" en catálogo y secciones
- [x] Fotos de categorías asignadas como fallback en ProductCard

## Admin Panel Updates (Current)
- [x] Crear página de Login dedicada para el panel admin
- [x] Eliminar Dashboard y sus referencias
- [x] Actualizar navegación del admin (solo Productos y Pedidos)
- [x] Verificar protección de rutas y flujo de autenticación

## Contabilidad de Pedidos (Current)
- [x] Crear procedimiento tRPC para obtener datos de contabilidad de pedidos entregados
- [x] Crear componente AdminAccounting.tsx con resumen de ventas entregadas
- [x] Agregar tab de Contabilidad en AdminOrders.tsx
- [x] Mostrar totales, ganancias y análisis por período

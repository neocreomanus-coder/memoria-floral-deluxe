# ============================================================================
# Build Stage - Compilar la aplicación
# ============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache python3 make g++

# Instalar pnpm versión específica
RUN npm install -g pnpm@10.4.1

# Copiar package files
COPY package.json ./
COPY pnpm-lock.yaml ./

# Copiar patches ANTES de pnpm install
COPY patches ./patches

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Compilar la aplicación
RUN pnpm run build

# ============================================================================
# Production Stage - Imagen final
# ============================================================================
FROM node:22-alpine

WORKDIR /app

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

# Instalar pnpm versión específica
RUN npm install -g pnpm@10.4.1

# Copiar package files desde builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Copiar patches para producción (por si se necesitan)
COPY --from=builder /app/patches ./patches

# Instalar solo dependencias de producción
RUN pnpm install --frozen-lockfile --prod

# Copiar código compilado desde builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/drizzle ./drizzle

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Usar dumb-init para ejecutar el proceso
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar la aplicación - archivo correcto de producción
CMD ["node", "dist/index.js"]

EXPOSE 3000

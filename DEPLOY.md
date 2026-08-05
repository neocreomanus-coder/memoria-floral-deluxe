# Guía de Despliegue - Memoria Floral Deluxe (Versión Independiente)

**Versión**: 2.0.0 (Independiente de Manus/Forge)  
**Última actualización**: 2026-08-04  
**Estado**: Completamente desacoplado de Manus/Forge

---

## Descripción General

Este proyecto es una tienda de flores completamente independiente que utiliza:
- **Backend**: Node.js + Express + tRPC
- **Frontend**: React 19 + Tailwind CSS
- **Base de datos**: MySQL 8.0 (externa, no incluida)
- **Almacenamiento**: AWS S3 / Cloudflare R2 (S3-compatible)
- **Autenticación**: Login local para administradores

**No depende de ningún servicio de Manus o Forge.**

---

## Requisitos Previos

### Servidor VPS Linux
- **SO Recomendado**: Ubuntu 22.04 LTS o superior
- **Recursos Mínimos**: 2 vCPU, 4GB RAM, 20GB SSD
- **Acceso**: SSH con permisos de sudo

### Dependencias Externas Requeridas
1. **MySQL 8.0** - Base de datos (debe existir previamente)
2. **Docker y Docker Compose** - Para ejecutar la aplicación
3. **AWS S3 o Cloudflare R2** - Para almacenamiento de imágenes

### Instalar Docker y Docker Compose

```bash
# Actualizar paquetes
sudo apt-get update && sudo apt-get upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario actual al grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version
```

---

## Pasos de Despliegue

### Paso 1: Preparar el Servidor

```bash
# Crear directorio para la aplicación
mkdir -p /opt/memoria-floral
cd /opt/memoria-floral

# Descargar código (opción 1: Git)
git clone <tu-repositorio> .

# O descargar ZIP (opción 2)
# wget https://tu-url/memoria-floral-deluxe.zip
# unzip memoria-floral-deluxe.zip
```

### Paso 2: Preparar Base de Datos MySQL

**La base de datos MySQL debe existir previamente en tu servidor o en un servidor remoto.**

```bash
# Conectar a MySQL
mysql -h <host> -u <usuario> -p

# Crear base de datos
CREATE DATABASE memoria_floral_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Crear usuario (si no existe)
CREATE USER 'memoria_user'@'%' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON memoria_floral_db.* TO 'memoria_user'@'%';
FLUSH PRIVILEGES;

# Salir
EXIT;
```

### Paso 3: Configurar AWS S3 / Cloudflare R2

#### Opción A: AWS S3

1. Crear bucket en AWS S3
2. Obtener credenciales (Access Key ID, Secret Access Key)
3. Crear política de acceso público (opcional, si quieres URLs públicas)

#### Opción B: Cloudflare R2

1. Crear bucket en Cloudflare R2
2. Obtener credenciales (Access Key ID, Secret Access Key)
3. Copiar endpoint URL (ej: https://account-id.r2.cloudflarestorage.com)

### Paso 4: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus valores
nano .env
```

**Variables críticas a configurar:**

```bash
# Database - Conexión a MySQL existente
DATABASE_URL=mysql://memoria_user:tu_password_seguro@db.example.com:3306/memoria_floral_db

# Authentication
JWT_SECRET=tu-clave-secreta-muy-larga-y-aleatoria

# Server
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# AWS S3 / Cloudflare R2
S3_REGION=us-east-1                    # Para AWS
S3_ACCESS_KEY_ID=tu-access-key
S3_SECRET_ACCESS_KEY=tu-secret-key
S3_BUCKET_NAME=tu-bucket-name
S3_ENDPOINT=                           # Dejar vacío para AWS, o usar endpoint de R2
S3_PUBLIC_URL=https://cdn.example.com  # Opcional, URL pública para archivos

# Application
VITE_APP_TITLE=Memoria Floral Deluxe
VITE_APP_LOGO=https://tu-bucket.s3.amazonaws.com/logo.png

# Admin (cambiar en producción)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Paso 5: Crear Directorios Necesarios

```bash
# Crear directorio para logs
mkdir -p logs

# Asignar permisos
chmod 755 logs
```

### Paso 6: Ejecutar Migraciones de Base de Datos

**IMPORTANTE**: Las migraciones se ejecutan manualmente, no automáticamente.

```bash
# Construir imagen Docker
docker-compose build

# Ejecutar migraciones
docker-compose run --rm app pnpm drizzle-kit migrate

# Verificar que las tablas fueron creadas
mysql -h <host> -u memoria_user -p memoria_floral_db -e "SHOW TABLES;"
```

### Paso 7: Iniciar la Aplicación

```bash
# Iniciar contenedores en background
docker-compose up -d

# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f app
```

### Paso 8: Verificar Instalación

```bash
# Esperar 30 segundos para que la app inicie
sleep 30

# Verificar que la aplicación está corriendo
curl http://localhost:3000

# Verificar logs de errores
docker-compose logs app | grep -i error
```

---

## Nginx Reverse Proxy (Recomendado para Producción)

### Instalar Nginx

```bash
sudo apt-get install -y nginx
```

### Crear Configuración

```bash
sudo nano /etc/nginx/sites-available/memoria-floral
```

**Contenido:**

```nginx
upstream app {
    server localhost:3000;
}

server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    access_log /var/log/nginx/memoria-floral-access.log;
    error_log /var/log/nginx/memoria-floral-error.log;

    location / {
        proxy_pass http://app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
    gzip_min_length 1000;
}
```

### Habilitar y Configurar SSL

```bash
# Crear enlace simbólico
sudo ln -s /etc/nginx/sites-available/memoria-floral /etc/nginx/sites-enabled/

# Instalar Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot certonly --nginx -d tu-dominio.com -d www.tu-dominio.com

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

---

## Comandos Útiles

### Actualizar la Aplicación

```bash
# Detener contenedores
docker-compose down

# Descargar código actualizado
git pull

# Reconstruir imagen
docker-compose build

# Ejecutar migraciones (si hay cambios de BD)
docker-compose run --rm app pnpm drizzle-kit migrate

# Iniciar contenedores
docker-compose up -d

# Verificar logs
docker-compose logs -f app
```

### Backup de Base de Datos

```bash
# Crear backup
mysqldump -h <host> -u memoria_user -p memoria_floral_db > backup-$(date +%Y%m%d-%H%M%S).sql

# Restaurar desde backup
mysql -h <host> -u memoria_user -p memoria_floral_db < backup-20240101-120000.sql
```

### Monitorear

```bash
# Logs de la aplicación
docker-compose logs -f app

# Últimas 100 líneas
docker-compose logs --tail=100 app

# Recursos
docker stats

# Estado de contenedores
docker-compose ps
```

### Reiniciar

```bash
# Reiniciar todo
docker-compose restart

# Reiniciar solo la app
docker-compose restart app
```

### Detener

```bash
# Detener contenedores (mantiene volúmenes)
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener y eliminar todo (incluyendo volúmenes - ¡CUIDADO!)
docker-compose down -v
```

---

## Troubleshooting

### Problema: Aplicación no inicia

```bash
# Ver logs detallados
docker-compose logs app

# Verificar variables de entorno
cat .env

# Reconstruir imagen
docker-compose build --no-cache
docker-compose up -d
```

### Problema: No puede conectar a BD

```bash
# Verificar conexión a MySQL
mysql -h <host> -u memoria_user -p -e "SELECT 1;"

# Verificar DATABASE_URL en .env
grep DATABASE_URL .env

# Verificar que la BD existe
mysql -h <host> -u memoria_user -p -e "SHOW DATABASES;"
```

### Problema: Migraciones fallan

```bash
# Verificar migraciones pendientes
docker-compose run --rm app pnpm drizzle-kit generate

# Ver archivos de migración
ls -la drizzle/migrations/

# Ejecutar migraciones nuevamente
docker-compose run --rm app pnpm drizzle-kit migrate
```

### Problema: Almacenamiento S3 no funciona

```bash
# Verificar credenciales en .env
grep S3_ .env

# Verificar que el bucket existe
aws s3 ls s3://tu-bucket-name/ --profile default

# Para Cloudflare R2, verificar endpoint
echo $S3_ENDPOINT
```

### Problema: Puerto 3000 en uso

```bash
# Cambiar puerto en .env
nano .env
# Cambiar APP_PORT=3001

# O matar el proceso que usa el puerto
sudo lsof -i :3000
sudo kill -9 <PID>
```

---

## Seguridad en Producción

### 1. Cambiar Credenciales por Defecto

```bash
# Editar .env y cambiar:
# - ADMIN_USERNAME y ADMIN_PASSWORD
# - JWT_SECRET (generar nueva clave)
# - S3_ACCESS_KEY_ID y S3_SECRET_ACCESS_KEY

nano .env

# Reiniciar aplicación
docker-compose restart app
```

### 2. Habilitar Firewall

```bash
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 3. Configurar Backups Automáticos

```bash
# Crear script de backup
cat > /opt/memoria-floral/backup.sh << 'BACKUP'
#!/bin/bash
BACKUP_DIR="/opt/memoria-floral/backups"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
mysqldump -h <host> -u memoria_user -p<password> memoria_floral_db > $BACKUP_DIR/backup-$TIMESTAMP.sql
# Mantener solo últimos 7 días
find $BACKUP_DIR -name "backup-*.sql" -mtime +7 -delete
BACKUP

chmod +x /opt/memoria-floral/backup.sh

# Agregar a crontab para ejecutar diariamente a las 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/memoria-floral/backup.sh") | crontab -
```

### 4. Monitoreo de Recursos

```bash
# Ver uso de recursos
docker stats

# Configurar alertas (opcional)
# Usar herramientas como Prometheus, Grafana, o Datadog
```

---

## Mantenimiento Regular

### Diario
- Revisar logs de errores: `docker-compose logs app | grep -i error`
- Verificar estado de contenedores: `docker-compose ps`

### Semanal
- Crear backup manual
- Revisar uso de disco: `df -h`
- Revisar uso de S3: `aws s3 ls s3://tu-bucket-name/ --recursive --summarize`

### Mensual
- Actualizar dependencias: `pnpm update`
- Revisar logs de seguridad
- Verificar certificados SSL: `certbot certificates`

---

## Variables de Entorno Completas

```bash
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Authentication
JWT_SECRET=tu-clave-secreta

# Server
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# AWS S3 / Cloudflare R2
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=tu-access-key
S3_SECRET_ACCESS_KEY=tu-secret-key
S3_BUCKET_NAME=tu-bucket
S3_ENDPOINT=                    # Para R2: https://account.r2.cloudflarestorage.com
S3_PUBLIC_URL=                  # Opcional: https://cdn.example.com

# Application
VITE_APP_TITLE=Memoria Floral Deluxe
VITE_APP_LOGO=https://...

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

---

## Recursos Útiles

- **Docker**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Nginx**: https://nginx.org/
- **Let's Encrypt**: https://letsencrypt.org/
- **AWS S3**: https://docs.aws.amazon.com/s3/
- **Cloudflare R2**: https://developers.cloudflare.com/r2/

---

## Soporte

Para problemas o preguntas:
1. Revisar la sección Troubleshooting
2. Revisar logs: `docker-compose logs app`
3. Verificar variables de entorno: `cat .env`
4. Verificar conectividad a BD: `mysql -h <host> -u <user> -p`

---

**Fin de la Guía de Despliegue**

# Docker Setup - Licitaciones Tracker

Este proyecto incluye una configuración completa de Docker para la base de datos PostgreSQL.

## Requisitos

- Docker
- Docker Compose

## Inicio Rápido

### 1. Configurar variables de entorno

Copia el archivo de ejemplo y ajusta las credenciales si es necesario:

```bash
cp .env.example .env
```

### 2. Iniciar la base de datos

```bash
docker-compose up -d
```

Este comando iniciará:
- **PostgreSQL** en el puerto `5432`
- **pgAdmin** en el puerto `5050` (opcional, para administración visual)

### 3. Verificar que los contenedores están corriendo

```bash
docker-compose ps
```

### 4. Ver los logs

```bash
# Logs de PostgreSQL
docker-compose logs -f postgres

# Logs de todos los servicios
docker-compose logs -f
```

## Acceso a los Servicios

### PostgreSQL

- **Host**: `localhost`
- **Puerto**: `5432`
- **Usuario**: `licitaciones_user` (configurable en `.env`)
- **Contraseña**: `licitaciones_password` (configurable en `.env`)
- **Base de datos**: `licitaciones_tracker`

**Conexión desde la aplicación:**
```
DATABASE_URL=postgresql://licitaciones_user:licitaciones_password@localhost:5432/licitaciones_tracker
```

### pgAdmin (Interfaz Web)

1. Abre tu navegador en: http://localhost:5050
2. Inicia sesión con:
   - **Email**: `admin@licitaciones.local` (configurable en `.env`)
   - **Contraseña**: `admin` (configurable en `.env`)

3. Agrega un nuevo servidor:
   - **Name**: Licitaciones DB
   - **Host**: `postgres` (nombre del servicio en Docker)
   - **Port**: `5432`
   - **Username**: `licitaciones_user`
   - **Password**: `licitaciones_password`

## Comandos Útiles

### Detener los contenedores

```bash
docker-compose stop
```

### Iniciar contenedores detenidos

```bash
docker-compose start
```

### Detener y eliminar los contenedores

```bash
docker-compose down
```

### Eliminar contenedores Y datos (⚠️ cuidado, borra la base de datos)

```bash
docker-compose down -v
```

### Reconstruir los contenedores

```bash
docker-compose up -d --build
```

### Conectarse a PostgreSQL desde la terminal

```bash
docker-compose exec postgres psql -U licitaciones_user -d licitaciones_tracker
```

### Ejecutar un backup de la base de datos

```bash
docker-compose exec postgres pg_dump -U licitaciones_user licitaciones_tracker > backup.sql
```

### Restaurar desde un backup

```bash
cat backup.sql | docker-compose exec -T postgres psql -U licitaciones_user -d licitaciones_tracker
```

## Estructura de Archivos

```
.
├── docker-compose.yml       # Configuración de servicios Docker
├── .env                      # Variables de entorno (no subir a Git)
├── .env.example             # Plantilla de variables de entorno
├── .dockerignore            # Archivos a ignorar en builds Docker
└── init-db/                 # Scripts de inicialización de DB
    └── init.sql             # Script SQL inicial
```

## Desactivar pgAdmin (opcional)

Si no necesitas la interfaz gráfica de pgAdmin, puedes comentar o eliminar esa sección en `docker-compose.yml`:

```yaml
# Comenta o elimina la sección pgadmin
#  pgadmin:
#    image: dpage/pgadmin4:latest
#    ...
```

Luego reinicia:

```bash
docker-compose down
docker-compose up -d
```

## Solución de Problemas

### El puerto 5432 ya está en uso

Si ya tienes PostgreSQL instalado localmente, puedes cambiar el puerto en `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Cambia 5432 por otro puerto
```

Y actualiza tu `DATABASE_URL`:
```
DATABASE_URL=postgresql://licitaciones_user:licitaciones_password@localhost:5433/licitaciones_tracker
```

### Permisos en Linux/Mac

Si tienes problemas de permisos con los volúmenes:

```bash
sudo chown -R $USER:$USER ./postgres-data
```

## Siguiente Paso: Configurar Prisma (ORM)

Si vas a usar Prisma como ORM, instálalo y configúralo:

```bash
npm install prisma @prisma/client
npx prisma init
```

Luego actualiza tu `DATABASE_URL` en `.env` y crea tus modelos en `prisma/schema.prisma`.

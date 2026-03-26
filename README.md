# Tender Tracker

Tender Tracker es una aplicación web diseñada para buscar, visualizar y hacer seguimiento a licitaciones públicas.

El sistema permite consultar licitaciones, revisar su información relevante y mantener un seguimiento de cambios importantes, como modificaciones de estado, fechas o aparición de nuevos documentos.

Además, la plataforma está preparada para descargar y organizar los archivos asociados a cada licitación, facilitando su análisis y revisión.

El objetivo del proyecto es centralizar la información de licitaciones en una interfaz clara y fácil de usar, permitiendo a los usuarios identificar rápidamente los datos importantes y dar seguimiento al proceso de cada licitación.
## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 20+ 
- Docker y Docker Compose
- npm o pnpm

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd licitaciones-tracker
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` según tus necesidades.

4. **Iniciar la base de datos con Docker**
   ```bash
   docker-compose up -d
   ```

5. **Ejecutar la aplicación en modo desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
   
   Visita [http://localhost:3000](http://localhost:3000)

## 🐳 Base de Datos con Docker

Este proyecto incluye una configuración completa de Docker para PostgreSQL. Para más detalles sobre la configuración y comandos útiles, consulta [docker-README.md](./docker-README.md).

**Comandos básicos:**

```bash
# Iniciar base de datos
docker-compose up -d

# Ver logs
docker-compose logs -f postgres

# Detener base de datos
docker-compose stop

# Eliminar contenedores y datos
docker-compose down -v
```

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea el build de producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 🛠️ Tecnologías

- **Framework**: Next.js 16
- **UI**: React 19, Tailwind CSS
- **Base de datos**: PostgreSQL
- **Contenedores**: Docker
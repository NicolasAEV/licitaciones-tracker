-- Script de inicialización de la base de datos
-- Este script se ejecuta automáticamente cuando se crea el contenedor por primera vez

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsquedas de texto más eficientes

-- Tablas (TypeORM synchronize las crea automáticamente,
-- pero las definimos aquí como respaldo para Docker fresh starts)

-- Tabla de organizaciones sincronizadas desde BuscarComprador
CREATE TABLE IF NOT EXISTS organizations (
  "codigoEmpresa" VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  "isDefault" BOOLEAN DEFAULT FALSE,
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Tabla de licitaciones marcadas para seguimiento
CREATE TABLE IF NOT EXISTS tracked_tenders (
  code VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  "statusCode" INT NOT NULL,
  status VARCHAR NOT NULL,
  type VARCHAR NOT NULL DEFAULT '',
  "codigoEmpresa" VARCHAR NOT NULL REFERENCES organizations("codigoEmpresa"),
  "closeDate" TIMESTAMP,
  "publishDate" TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "trackedAt" TIMESTAMP DEFAULT NOW()
);

-- Tabla de documentos adjuntos de licitaciones
CREATE TABLE IF NOT EXISTS tender_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenderCode" VARCHAR NOT NULL,
  "fileName" VARCHAR NOT NULL,
  "fileType" VARCHAR NOT NULL DEFAULT '',
  description VARCHAR NOT NULL DEFAULT '',
  "fileSize" INT NOT NULL DEFAULT 0,
  "mimeType" VARCHAR NOT NULL DEFAULT 'application/octet-stream',
  "uploadDate" TIMESTAMP,
  "fileContent" BYTEA,
  hash VARCHAR,
  "sourceUrl" VARCHAR NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tender_doc_code ON tender_documents ("tenderCode");
CREATE INDEX IF NOT EXISTS idx_tender_doc_hash ON tender_documents (hash);
CREATE INDEX IF NOT EXISTS idx_org_name_trgm ON organizations USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_org_is_default ON organizations ("isDefault");
CREATE INDEX IF NOT EXISTS idx_tracked_tender_name_trgm ON tracked_tenders USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_tracked_tender_org ON tracked_tenders ("codigoEmpresa");
CREATE INDEX IF NOT EXISTS idx_tracked_tender_status ON tracked_tenders ("statusCode");
CREATE INDEX IF NOT EXISTS idx_tracked_tender_close_date ON tracked_tenders ("closeDate");

SELECT 'Database initialized successfully' AS status;

import { getDataSource } from "@/server/db/data-source";
import { TenderDocumentEntity, TenderDocumentRow } from "@/server/db/entities";
import { TenderDocument } from "@/types";
import { ScrapedDocument, guessMimeType } from "./scraper";

// --- Mappers ---

function mapToFrontend(row: TenderDocumentRow): TenderDocument {
  return {
    id: row.id,
    tenderCode: row.tenderCode,
    fileName: row.fileName,
    fileType: row.fileType,
    description: row.description,
    fileSize: row.fileSize,
    mimeType: row.mimeType,
    uploadDate: row.uploadDate?.toISOString() ?? "",
    hash: row.hash,
    hasContent: row.fileContent !== null && row.fileContent.length > 0,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// --- Public API ---

/**
 * Get all documents for a tender (metadata only, no file content)
 */
export async function getDocumentsByTender(
  tenderCode: string
): Promise<TenderDocument[]> {
  const ds = await getDataSource();
  const repo = ds.getRepository<TenderDocumentRow>(TenderDocumentEntity);

  const rows = await repo.find({
    where: { tenderCode },
    order: { uploadDate: "DESC", fileName: "ASC" },
    select: {
      id: true,
      tenderCode: true,
      fileName: true,
      fileType: true,
      description: true,
      fileSize: true,
      mimeType: true,
      uploadDate: true,
      hash: true,
      sourceUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return rows.map(mapToFrontend);
}

/**
 * Get document content for download
 */
export async function getDocumentContent(
  id: string
): Promise<{ content: Buffer; mimeType: string; fileName: string } | null> {
  const ds = await getDataSource();
  const repo = ds.getRepository<TenderDocumentRow>(TenderDocumentEntity);

  const doc = await repo.findOne({
    where: { id },
    select: {
      fileContent: true,
      mimeType: true,
      fileName: true,
    },
  });

  if (!doc?.fileContent) return null;

  return {
    content: doc.fileContent,
    mimeType: doc.mimeType,
    fileName: doc.fileName,
  };
}

/**
 * Save discovered documents (upsert — skip duplicates by tenderCode + fileName)
 */
export async function saveDocuments(
  scraped: ScrapedDocument[],
  tenderCode: string
): Promise<TenderDocument[]> {
  const ds = await getDataSource();
  const repo = ds.getRepository<TenderDocumentRow>(TenderDocumentEntity);

  // Get existing documents for this tender
  const existing = await repo.find({ where: { tenderCode } });
  const existingNames = new Set(existing.map((d) => d.fileName));

  const newDocs: TenderDocumentRow[] = [];

  for (const doc of scraped) {
    if (existingNames.has(doc.fileName)) continue;

    const row = repo.create({
      tenderCode,
      fileName: doc.fileName,
      fileType: doc.fileType,
      description: doc.description,
      fileSize: doc.fileSize,
      mimeType: guessMimeType(doc.fileName),
      uploadDate: doc.uploadDate ? new Date(doc.uploadDate) : null,
      sourceUrl: doc.sourceUrl,
    });

    newDocs.push(row);
  }

  if (newDocs.length > 0) {
    await repo.save(newDocs);
  }

  // Return all documents (existing + new)
  return getDocumentsByTender(tenderCode);
}

/**
 * Save downloaded file content to a document
 */
export async function saveDocumentContent(
  id: string,
  content: Buffer,
  hash: string
): Promise<void> {
  const ds = await getDataSource();
  const repo = ds.getRepository<TenderDocumentRow>(TenderDocumentEntity);

  // Check for duplicate hash (same file already stored for another doc)
  const duplicate = await repo.findOne({
    where: { hash },
    select: { id: true },
  });

  if (duplicate && duplicate.id !== id) {
    // File already exists — just link the hash without re-storing bytes
    await repo.update(id, { hash });
    return;
  }

  await repo.update(id, { fileContent: content, hash });
}

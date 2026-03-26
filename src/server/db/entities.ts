import { EntitySchema } from "typeorm";

// --- Interfaces ---

export interface Organization {
  codigoEmpresa: string;
  name: string;
  isDefault: boolean;
  updatedAt: Date;
}

export interface TrackedTender {
  code: string;
  name: string;
  statusCode: number;
  status: string;
  type: string;
  codigoEmpresa: string;
  organization?: Organization;
  closeDate: Date | null;
  publishDate: Date | null;
  updatedAt: Date;
  trackedAt: Date;
}

// --- Entity Schemas ---

export const OrganizationEntity = new EntitySchema<Organization>({
  name: "Organization",
  tableName: "organizations",
  columns: {
    codigoEmpresa: { type: "varchar", primary: true },
    name: { type: "varchar" },
    isDefault: { type: "boolean", default: false },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  indices: [
    { name: "idx_org_name_trgm", columns: ["name"] },
    { name: "idx_org_is_default", columns: ["isDefault"] },
  ],
});

export interface TenderDocumentRow {
  id: string;
  tenderCode: string;
  fileName: string;
  fileType: string;
  description: string;
  fileSize: number;
  mimeType: string;
  uploadDate: Date | null;
  fileContent: Buffer | null;
  hash: string | null;
  sourceUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export const TenderDocumentEntity = new EntitySchema<TenderDocumentRow>({
  name: "TenderDocument",
  tableName: "tender_documents",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    tenderCode: { type: "varchar" },
    fileName: { type: "varchar" },
    fileType: { type: "varchar", default: "" },
    description: { type: "varchar", default: "" },
    fileSize: { type: "int", default: 0 },
    mimeType: { type: "varchar", default: "application/octet-stream" },
    uploadDate: { type: "timestamp", nullable: true },
    fileContent: { type: "bytea", nullable: true },
    hash: { type: "varchar", nullable: true },
    sourceUrl: { type: "varchar", default: "" },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  indices: [
    { name: "idx_tender_doc_code", columns: ["tenderCode"] },
    { name: "idx_tender_doc_hash", columns: ["hash"] },
  ],
});

export const TrackedTenderEntity = new EntitySchema<TrackedTender>({
  name: "TrackedTender",
  tableName: "tracked_tenders",
  columns: {
    code: { type: "varchar", primary: true },
    name: { type: "varchar" },
    statusCode: { type: "int" },
    status: { type: "varchar" },
    type: { type: "varchar" },
    codigoEmpresa: { type: "varchar" },
    closeDate: { type: "timestamp", nullable: true },
    publishDate: { type: "timestamp", nullable: true },
    updatedAt: { type: "timestamp", updateDate: true },
    trackedAt: { type: "timestamp", createDate: true },
  },
  relations: {
    organization: {
      type: "many-to-one",
      target: "Organization",
      joinColumn: { name: "codigoEmpresa", referencedColumnName: "codigoEmpresa" },
      nullable: false,
    },
  },
  indices: [
    { name: "idx_tracked_tender_name_trgm", columns: ["name"] },
    { name: "idx_tracked_tender_org", columns: ["codigoEmpresa"] },
    { name: "idx_tracked_tender_status", columns: ["statusCode"] },
    { name: "idx_tracked_tender_close_date", columns: ["closeDate"] },
  ],
});

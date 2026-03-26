import { DataSource } from "typeorm";
import { OrganizationEntity, TrackedTenderEntity, TenderDocumentEntity } from "./entities";

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource?.isInitialized) return dataSource;

  dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [OrganizationEntity, TrackedTenderEntity, TenderDocumentEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  return dataSource;
}

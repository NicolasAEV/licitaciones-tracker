// --- Mercado Público API response types ---

export interface MercadoPublicoResponse {
  Cantidad: number;
  FechaCreacion: string;
  Version: string;
  Listado: MercadoPublicoTender[];
}

export interface MercadoPublicoComprador {
  CodigoOrganismo: string;
  NombreOrganismo: string;
  RutUnidad: string;
  CodigoUnidad: string;
  NombreUnidad: string;
  DireccionUnidad: string;
  ComunaUnidad: string;
  RegionUnidad: string;
  RutUsuario: string;
  CodigoUsuario: string;
  NombreUsuario: string;
  CargoUsuario: string;
}

export interface MercadoPublicoFechas {
  FechaCreacion: string;
  FechaCierre: string;
  FechaInicio: string;
  FechaFinal: string;
  FechaPubRespuestas: string | null;
  FechaActoAperturaTecnica: string | null;
  FechaActoAperturaEconomica: string | null;
  FechaPublicacion: string;
  FechaAdjudicacion: string | null;
  FechaEstimadaAdjudicacion: string | null;
  FechaSoporteFisico: string | null;
  FechaTiempoEvaluacion: string | null;
  FechaEstimadaFirma: string | null;
  FechasUsuario: string | null;
  FechaVisitaTerreno: string | null;
  FechaEntregaAntecedentes: string | null;
}

export interface MercadoPublicoItemAdjudicacion {
  RutProveedor: string;
  NombreProveedor: string;
  CantidadAdjudicada: string;
  MontoUnitario: number;
}

export interface MercadoPublicoItem {
  Correlativo: number;
  CodigoProducto: number;
  CodigoCategoria: string;
  Categoria: string;
  NombreProducto: string;
  Descripcion: string;
  UnidadMedida: string;
  Cantidad: number;
  Adjudicacion: MercadoPublicoItemAdjudicacion | null;
}

export interface MercadoPublicoAdjudicacion {
  Tipo: number;
  Fecha: string | null;
  Numero: string;
  NumeroOferentes: number;
  UrlActa: string;
}

export interface MercadoPublicoOrganismo {
  CodigoEmpresa: string;
  NombreEmpresa: string;
}

export interface MercadoPublicoOrganismosResponse {
  Cantidad: number;
  FechaCreacion: string;
  listaEmpresas: MercadoPublicoOrganismo[];
}

export interface MercadoPublicoTender {
  CodigoExterno: string;
  Nombre: string;
  CodigoEstado: number;
  FechaCierre: string;
  Descripcion: string;
  Estado: string;
  Comprador: MercadoPublicoComprador;
  DiasCierreLicitacion: number;
  Informada: number;
  CodigoTipo: number;
  Tipo: string;
  TipoConvocatoria: number;
  Moneda: string;
  Etapas: number;
  EstadoEtapas: number;
  TomaRazon: number;
  EstadoPublicidadOfertas: number;
  JustificacionPublicidad: string | null;
  Contrato: number;
  Obras: number;
  CantidadReclamos: number;
  Fechas: MercadoPublicoFechas;
  MontoEstimado: number;
  Estimacion: number;
  FuenteFinanciamiento: number;
  VisibilidadMonto: number;
  UnidadTiempo: number;
  Modalidad: number;
  TipoPago: number;
  NombreResponsablePago: string;
  EmailResponsablePago: string;
  NombreResponsableContrato: string;
  EmailResponsableContrato: string;
  FonoResponsableContrato: string;
  DireccionVisita: string | null;
  DireccionEntrega: string | null;
  ProhibicionContratacion: string | null;
  SubContratacion: number;
  TiempoDuracionContrato: number;
  UnidadTiempoDuracionContrato: number;
  TipoDuracionContrato: string;
  JustificacionMontoEstimado: string | null;
  ExtensionPlazo: number;
  EsRenovable: number;
  ValorTiempoRenovacion: number;
  PeriodoTiempoRenovacion: string | null;
  EsBaseTipo: number;
  Items: {
    Cantidad: number;
    Listado: MercadoPublicoItem[];
  };
  Adjudicacion: MercadoPublicoAdjudicacion | null;
}

// --- Frontend types (mapped from API) ---

export interface Tender {
  code: string;
  name: string;
  status: string;
  statusCode: number;
  type: string;
  organization: string;
  organizationCode?: string;
  region: string;
  closeDate: string;
  publishDate: string;
}

export interface TenderDate {
  label: string;
  date: string;
}

export interface TenderDetail extends Tender {
  description: string;
  buyerUnit: string;
  buyerAddress: string;
  buyerCommune: string;
  buyerRut?: string;
  buyerCodigoUnidad?: string;
  buyerUserName?: string;
  buyerUserPosition?: string;
  estimatedAmount?: number | null;
  estimatedAmountJustification?: string | null;
  currency?: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  paymentContactName?: string;
  paymentContactEmail?: string;
  visitAddress?: string | null;
  deliveryAddress?: string | null;
  convocationType?: string;
  stages?: number;
  isWorksProject?: boolean;
  complaints?: number;
  contractDuration?: number;
  contractDurationType?: string;
  isRenewable?: boolean;
  renewalPeriod?: string | null;
  renewalValue?: number;
  subcontracting?: boolean;
  hiringProhibition?: string | null;
  deadlineExtension?: boolean;
  dates: TenderDate[];
  items: TenderItem[];
  adjudication: TenderAdjudication | null;
}

export interface TenderItemAdjudication {
  supplierRut: string;
  supplierName: string;
  awardedQuantity: string;
  unitPrice: number;
}

export interface TenderItem {
  correlative: number;
  productCode: number;
  categoryCode: string;
  category: string;
  productName: string;
  description: string;
  unit: string;
  quantity: number;
  adjudication: TenderItemAdjudication | null;
}

export interface TenderAdjudication {
  type: number;
  date: string | null;
  number: string;
  supplierCount: number;
  actUrl: string;
}

export interface TenderDocument {
  id: string;
  tenderCode: string;
  fileName: string;
  fileType: string;
  description: string;
  fileSize: number;
  mimeType: string;
  uploadDate: string;
  hash: string | null;
  hasContent: boolean;
  createdAt: string;
  updatedAt: string;
}

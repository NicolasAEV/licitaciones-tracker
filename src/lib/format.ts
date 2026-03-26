export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function daysUntil(dateString: string): string {
  const target = new Date(dateString);
  const now = new Date();
  const diff = Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return "Cerrada";
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Mañana";
  return `En ${diff} días`;
}

const tenderTypeLabels: Record<string, string> = {
  L1: "LP < 100 UTM",
  LE: "LP 100–1.000 UTM",
  LP: "LP 1.000–2.000 UTM",
  LQ: "LP 2.000–5.000 UTM",
  LR: "LP > 5.000 UTM",
  E2: "Privada < 100 UTM",
  CO: "Privada 100–1.000 UTM",
  B2: "Privada 1.000–2.000 UTM",
  H2: "Privada 2.000–5.000 UTM",
  I2: "Privada > 5.000 UTM",
  LS: "LP Serv. personales",
};

export function formatTenderType(type: string): string {
  return tenderTypeLabels[type] ?? type;
}

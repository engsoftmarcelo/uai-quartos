export function formatCurrency(value: number, currency: "BRL" = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

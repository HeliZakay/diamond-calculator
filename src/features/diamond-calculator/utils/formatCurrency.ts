export function formatCurrency(
  value: number,
  locale: string = "en-US",
  currency: string = "USD",
  maximumFractionDigits: number = 0
): string {
  if (!Number.isFinite(value)) return "$0";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits,
    }).format(value);
  } catch {
    // Fallback in environments lacking Intl or invalid currency
    const rounded = Math.round(value);
    return `$${rounded.toLocaleString(locale)}`;
  }
}

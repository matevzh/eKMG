/** Display dates as European DD.MM.YYYY. Storage/API stay YYYY-MM-DD. */
export function formatEuDate(iso: string | null | undefined): string {
  if (iso == null || iso === "" || iso === "—") return iso ?? "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return iso;
  return `${m[3]}.${m[2]}.${m[1]}`;
}

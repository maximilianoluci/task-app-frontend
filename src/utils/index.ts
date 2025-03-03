export function formatDate(dateValue: Date | string) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? "-" : date.toLocaleString();
}

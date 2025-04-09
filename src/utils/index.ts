import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";

// Register the plugins
dayjs.extend(utc);
dayjs.extend(localizedFormat);

/**
 * Formats a date value using dayjs
 * @param dateValue Date or string to format
 * @param format Optional custom format (defaults to localized format)
 * @returns Formatted date string or fallback value
 */
export function formatDate(dateValue: Date | string | undefined, format?: string) {
  if (!dateValue) return "-";

  const date = dayjs(dateValue);

  if (!date.isValid()) return "-";

  const localDate = date.isUTC() ? date.local() : date;

  return format ? localDate.format(format) : localDate.format("L LT");
}

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(localizedFormat);

export function formatDate(dateValue: Date | string | undefined, format?: string) {
  if (!dateValue) return "-";

  const date = dayjs(dateValue);

  if (!date.isValid()) return "-";

  const localDate = date.isUTC() ? date.local() : date;

  return format ? localDate.format(format) : localDate.format("L LT");
}

export function toSentenceCase(text: string): string {
  if (!text) return text;

  return text
    .split(/([.!?]\s+)/)
    .map((sentence, index) => {
      if (index % 2 === 0) {
        const trimmed = sentence.trim();
        if (trimmed.length === 0) return sentence;

        return sentence.replace(trimmed.charAt(0), trimmed.charAt(0).toUpperCase());
      } else {
        return sentence;
      }
    })
    .join("");
}

import { format, toZonedTime } from "date-fns-tz";

export const formatDateInTimeZone = (date: Date, timeZone: string): string => {
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { timeZone });
};
import { FORMAT_DATE_OPTIONS } from "@/constants/date";

interface DateFormatterOpts {
  date: string | Date;
  options?: Intl.DateTimeFormatOptions;
  locale?: string;
}

export const dateFormatter = ({
  date,
  options = FORMAT_DATE_OPTIONS,
  locale = "en",
}: DateFormatterOpts) => {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date format.");
  }

  const dateFormat = new Intl.DateTimeFormat(locale, options);
  const formatted = dateFormat.format(parsedDate);

  return formatted;
};

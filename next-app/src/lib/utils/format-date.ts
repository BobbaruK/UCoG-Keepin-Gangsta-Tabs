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

export const turnToDate = (turn: number) => {
  const date = new Date("1 June 1920");

  const actualTurn = turn - 1; // Reduce by 1 because turn 0 here is turn 1 in game
  const turnInDays = actualTurn * 7;
  date.setDate(date.getDate() + turnInDays);

  return date;
};

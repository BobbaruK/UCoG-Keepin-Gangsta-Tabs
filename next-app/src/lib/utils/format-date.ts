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

  /**
   * December 28, 1920 (turn 31) + 7 days (1 turn) = January 4, 1921
   *
   * For some reason in game from turn 31 to turn 32 passes 8 days
   * that give us January 5, 1921
   */
  if (turn >= 32) {
    date.setDate(date.getDate() + 1);
  }

  /**
   * December 24, 1925 (turn 239) + 7 days (1 turn) = December 31, 1925
   *
   * For some reason in game from turn 239 to turn 240 passes 8 days
   * that give us January 1, 1925
   */
  if (turn >= 240) {
    date.setDate(date.getDate() + 1);
  }

  /**
   * December 27, 1928 (turn 448) + 7 days (1 turn) = January 3, 1929
   *
   * For some reason in game from turn 448 to turn 449 passes 8 days
   * that give us January 4, 1929
   */
  if (turn >= 449) {
    date.setDate(date.getDate() + 1);
  }

  /**
   * December 30, 1932 (turn 657) + 7 days (1 turn) = January 6, 1933
   *
   * For some reason in game from turn 657 to turn 658 passes 8 days
   * that give us January 7, 1933
   */
  if (turn >= 658) {
    date.setDate(date.getDate() + 1);
  }

  return date;
};

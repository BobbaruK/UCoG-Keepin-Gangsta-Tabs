import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsIndex,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { PAGINATION_DEFAULT } from "./table";

export const serverSearchParams = () => ({
  twoFactor: parseAsString.withOptions({
    shallow: false,
  }),

  twoFactorFirstTime: parseAsBoolean.withDefault(false).withOptions({
    shallow: false,
  }),

  // Pagination
  pageIndex: parseAsIndex.withDefault(0).withOptions({ shallow: false }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION_DEFAULT)
    .withOptions({ shallow: false }),

  // Searching
  search: parseAsString.withDefault("").withOptions({
    shallow: false,
  }),
  searchBy: parseAsStringEnum(["email", "name"])
    .withDefault("name")
    .withOptions({
      shallow: false,
    }),

  // Sorting
  sortBy: parseAsString.withDefault("createdAt").withOptions({
    shallow: false,
  }),
  sort: parseAsStringEnum(["asc", "desc"]).withDefault("desc").withOptions({
    shallow: false,
  }),

  // Select
  selected: parseAsArrayOf(parseAsString, ";").withDefault([]).withOptions({
    shallow: false,
  }),
});

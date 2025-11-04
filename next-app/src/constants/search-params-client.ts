import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsIndex,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs";
import { TransitionStartFunction } from "react";
import { PAGINATION_DEFAULT } from "./table";

export const clientSearchParams = (
  startTransition: TransitionStartFunction,
) => ({
  twoFactor: parseAsString.withOptions({
    shallow: false,
    startTransition,
  }),
  twoFactorFirstTime: parseAsBoolean.withDefault(false).withOptions({
    shallow: false,
    startTransition,
  }),

  // Pagination
  pageIndex: parseAsIndex.withDefault(0).withOptions({
    shallow: false,
    startTransition,
  }),
  pageSize: parseAsInteger.withDefault(PAGINATION_DEFAULT).withOptions({
    shallow: false,
    startTransition,
  }),

  // Searching
  search: parseAsString.withDefault("").withOptions({
    shallow: false,
    startTransition,
  }),
  searchBy: parseAsStringEnum(["email", "name"])
    .withDefault("name")
    .withOptions({
      shallow: false,
      startTransition,
    }),

  // Sorting
  sortBy: parseAsString.withDefault("createdAt").withOptions({
    shallow: false,
    startTransition,
  }),
  sort: parseAsStringEnum(["asc", "desc"]).withDefault("desc").withOptions({
    shallow: false,
    startTransition,
  }),

  // Select
  selected: parseAsArrayOf(parseAsString, ";").withDefault([]).withOptions({
    shallow: false,
    startTransition,
  }),
});

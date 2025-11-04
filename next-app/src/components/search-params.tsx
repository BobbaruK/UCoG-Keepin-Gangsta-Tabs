import { serverSearchParams } from "@/constants/search-params-server";
import { PAGINATION_URL_KEYS } from "@/constants/table";
import { createLoader } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const searchParamsObj = serverSearchParams();

export const loadSearchParams = createLoader(searchParamsObj, {
  urlKeys: PAGINATION_URL_KEYS,
});

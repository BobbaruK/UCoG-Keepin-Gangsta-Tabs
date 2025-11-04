"use client";

import { clientSearchParams } from "@/constants/search-params-client";
import { PAGINATION_URL_KEYS } from "@/constants/table";
import { useQueryStates } from "nuqs";
import { TransitionStartFunction } from "react";

export function useSearchParams(startTransition: TransitionStartFunction) {
  return useQueryStates(clientSearchParams(startTransition), {
    urlKeys: PAGINATION_URL_KEYS,
  });
}

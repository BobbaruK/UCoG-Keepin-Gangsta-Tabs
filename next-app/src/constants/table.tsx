/**
 * Pagination configuration constants.
 *
 * Defines reusable constants for managing pagination
 * across the application: available page sizes,
 * default page size, and URL query parameter keys.
 *
 * @module pagination
 */

/* -------------------------------------------------------------------------- */
/*                               PAGINATION SIZES                              */
/* -------------------------------------------------------------------------- */

/**
 * List of available options for items per page.
 *
 * Each value represents how many items should be displayed
 * per page in a paginated list.
 *
 * @example
 * // Display options in a select dropdown
 * <select>
 *   {PAGINATION_ARR.map(size => (
 *     <option key={size} value={size}>{size}</option>
 *   ))}
 * </select>
 */
export const PAGINATION_ARR: number[] = [2, 5, 7, 10, 25, 50, 75, 100];

/* -------------------------------------------------------------------------- */
/*                            DEFAULT PAGINATION VALUE                         */
/* -------------------------------------------------------------------------- */

/**
 * Default number of items displayed per page.
 *
 * Must be one of the values included in {@link PAGINATION_ARR}.
 *
 * @example
 * const pageSize = PAGINATION_DEFAULT; // 10 items per page by default
 */
export const PAGINATION_DEFAULT: number = 10;

/* -------------------------------------------------------------------------- */
/*                              PAGINATION URL KEYS                            */
/* -------------------------------------------------------------------------- */

/**
 * Defines the query parameter keys used for pagination.
 *
 * @example
 * // Example URL: ?page=2&perPage=25
 * const { pageIndex, pageSize } = PAGINATION_URL_KEYS;
 * // pageIndex = "page"
 * // pageSize = "perPage"
 */
export const PAGINATION_URL_KEYS = {
  /** The query parameter name for the current page index. */
  pageIndex: "page",
  /** The query parameter name for the number of items per page. */
  pageSize: "perPage",
} as const;

/** Type helper for pagination URL keys */
export type PaginationUrlKeys = typeof PAGINATION_URL_KEYS;

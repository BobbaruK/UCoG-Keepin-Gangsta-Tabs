/**
 *
 * @param {string} string String to format.
 *
 * @example
 * "Ștefănescu - Anca" // stefanescu-anca
 * "Ștefănescu- Anca" // stefanescu-anca
 * "Ștefănescu \t-    Anca" // stefanescu-anca
 * "François Anca" // francois-anca
 * "François  Anca" // francois-anca
 * "François \t\tAnca" // francois-anca
 * "---François Anca---" // francois-anca
 * "François ---Anca" // francois-anca
 */
export const formatString = (string: string) => {
  if (!string) return "";

  const formatted = string
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replaceAll(/\s*-\s*/g, "-") // remove spaces around "-"
    .replaceAll(/\s+/g, "-") // remove spaces
    .replaceAll(/[^a-zA-Z0-9-]/g, "") // remove all special characters
    .replace(/-{2,}/g, "-") // remove multiple dashes
    .replace(/^-+|-+$/g, ""); // remove dashes from the beginning and the end

  return formatted;
};

export const createFormattedSlug = (
  firstName: string,
  lastName: string,
  username: string,
) => {
  const slug = firstName + "-" + lastName + "-" + username;

  return formatString(slug);
};

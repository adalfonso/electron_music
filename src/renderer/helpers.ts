/**
 * Capitalize a string
 *
 * @param str - input string
 *
 * @return capitalized string
 */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

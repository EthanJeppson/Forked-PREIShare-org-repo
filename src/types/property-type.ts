/**
 * Property classification (asset class). Closed list from
 * docs/domain/listing-field-inventory.md: any other spelling, capitalization,
 * or value is invalid.
 */
export type PropertyType =
  | "multifamily"
  | "office"
  | "retail"
  | "industrial"
  | "mixed_use"
  | "land";

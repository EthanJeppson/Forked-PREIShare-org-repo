/**
 * Lifecycle state of a listing. Closed list from docs/domain/listing-field-inventory.md:
 * any other spelling, capitalization, or value is invalid.
 */
export type ListingStatus =
  | "draft"
  | "published"
  | "under_offer"
  | "sold"
  | "archived";

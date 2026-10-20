/**
 * Lifecycle state of a listing. Closed list: any other spelling,
 * capitalization, or value is invalid.
 */
export type ListingStatus =
  | "draft"
  | "active"
  | "under_contract"
  | "closed";

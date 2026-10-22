/**
 * Lifecycle state of a listing. Closed list: any other spelling,
 * capitalization, or value is invalid. "closed" is the one status that
 * also carries a `closedAt` date on InvestorListing.
 */
export type ListingStatus =
  | "draft"
  | "active"
  | "under_contract"
  | "closed";

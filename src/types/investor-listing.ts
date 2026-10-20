import type { Address } from "./address";
import type { FinancialSummary } from "./financial-summary";
import type { ListingStatus } from "./listing-status";
import type { PropertyType } from "./property-type";

/**
 * Core PREIshare investor listing.
 *
 * Source of truth: docs/domain/listing-field-inventory.md.
 *
 * Deferred to later steps (do not add them here):
 * - contacts and ownership (lists)
 */
export interface InvestorListing {
  /** Stable, unique id for this listing; never reused. */
  id: string;

  /** Short name investors see in search results and cards. */
  title: string;

  /** Short plain-text summary of the investment opportunity that every listing carries. */
  summary: string;

  /** Where the listing is in its lifecycle; exactly one value from the closed status list. */
  status: ListingStatus;

  /** Asset class of the property; exactly one value from the closed property-type list. */
  propertyType: PropertyType;

  /** Where the property is; every listing has one, so it is never optional. */
  address: Address;

  /** Money summary including the asking price; may be missing while a listing is still being prepared. */
  financials?: FinancialSummary;

  /** When the listing record was created, as UTC date-time text (e.g. 2026-03-01T10:00:00Z). */
  createdAt: string;

  /** When the listing was last meaningfully edited, as UTC date-time text; never earlier than createdAt. */
  updatedAt: string;
}

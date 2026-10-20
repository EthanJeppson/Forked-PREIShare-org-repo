import type { Address } from "./address";
import type { FinancialSummary } from "./financial-summary";
import type { InvestorContact } from "./investor-contact";
import type { ListingStatus } from "./listing-status";
import type { Ownership } from "./ownership";
import type { PropertyType } from "./property-type";

/**
 * Core PREIshare investor listing.
 *
 * Source of truth: docs/domain/listing-field-inventory.md.
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

  /** People investors can reach about this listing. */
  contacts: InvestorContact[];

  /**
   * Id of the main contact; must equal the `id` of one entry in `contacts`.
   * TypeScript cannot prove that membership, so runtime validation must check it.
   */
  primaryContactId: string;

  /** Who owns the property and how that ownership is described. */
  ownership: Ownership;

  /** When the listing record was created, as UTC date-time text (e.g. 2026-03-01T10:00:00Z). */
  createdAt: string;

  /** When the listing was last meaningfully edited, as UTC date-time text; never earlier than createdAt. */
  updatedAt: string;
}

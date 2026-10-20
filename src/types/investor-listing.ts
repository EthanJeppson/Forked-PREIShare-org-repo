import type { ListingStatus } from "./listing-status";
import type { PropertyType } from "./property-type";

/**
 * Core PREIshare investor listing: scalar (single-value) fields only.
 *
 * Source of truth: docs/domain/listing-field-inventory.md.
 *
 * Deferred to later steps (do not add them here):
 * - address (nested group)
 * - the rest of financials: currency, projectedIrrPercent, capRatePercent (nested group)
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

  /** Listed price in the major currency unit (dollars, not cents); must be greater than zero. */
  askingPrice: number;

  /** When the listing record was created, as UTC date-time text (e.g. 2026-03-01T10:00:00Z). */
  createdAt: string;

  /** When the listing was last meaningfully edited, as UTC date-time text; never earlier than createdAt. */
  updatedAt: string;
}

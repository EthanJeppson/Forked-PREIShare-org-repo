/**
 * Core PREIshare investor listing: scalar (single-value) fields only.
 *
 * Source of truth: docs/domain/listing-field-inventory.md.
 *
 * Deferred to later steps (do not add them here):
 * - status and propertyType (fixed choice lists)
 * - address (nested group)
 * - financials, including askingPrice (nested group)
 * - contacts and ownership (lists)
 */
export interface InvestorListing {
  /** Stable, unique id for this listing; never reused. */
  id: string;

  /** Short name investors see in search results and cards. */
  title: string;

  /**
   * Short investor-facing summary of the opportunity.
   * Optional because a draft or archived listing may not have one yet; it is
   * required once a listing is visible to investors (enforced in a later step
   * when status exists).
   */
  description?: string;

  /** When the listing record was created, as UTC date-time text (e.g. 2026-03-01T10:00:00Z). */
  createdAt: string;

  /** When the listing was last meaningfully edited, as UTC date-time text; never earlier than createdAt. */
  updatedAt: string;
}

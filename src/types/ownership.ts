/** Who owns the property and how that ownership is described. */
export interface Ownership {
  /** Person or entity name shown as the owner. */
  ownerName: string;

  /** Optional plain-text note about splits, trusts, or co-owners. */
  notes?: string;

  /** Percent of the property this owner holds, from 0 to 100, when known. */
  ownershipPercent?: number;
}

/** Money summary for a listing. Always travels together as one group. */
export interface FinancialSummary {
  /** Listed price in the major currency unit (dollars, not cents); must be greater than zero. */
  askingPrice: number;

  /** Currency of the asking price; USD is the only currency for now. */
  currency: "USD";

  /** Projected internal rate of return as a percentage, e.g. 12.5. */
  projectedIrrPercent?: number;

  /** Capitalization rate as a percentage, e.g. 5.8. */
  capRatePercent?: number;
}

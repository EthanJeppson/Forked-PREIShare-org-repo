/** Where the property is. Always travels together as one group. */
export interface Address {
  /** Street number and name. */
  line1: string;

  /** Unit, suite, or floor. */
  line2?: string;

  /** City or town. */
  city: string;

  /** State, province, or region. */
  region: string;

  /** Postal or ZIP code, kept as text so leading zeros survive. */
  postalCode: string;

  /** Country as a two-letter uppercase code, e.g. "US". */
  country: string;
}

/** Why a person is on a listing. Closed list: no free text. */
export type ContactRole = "broker" | "owner_representative" | "property_manager";

/** A person investors can reach about a listing. */
export interface InvestorContact {
  /** Identifier unique within this listing's contact list, so other fields can point at a contact. */
  id: string;

  /** Person or firm name shown to investors. */
  fullName: string;

  /** Why this person is on the listing. */
  role: ContactRole;

  /** Email address investors can write to. */
  email: string;

  /** Phone number; optional because not every contact shares one. */
  phone?: string;
}

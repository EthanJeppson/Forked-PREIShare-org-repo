// INTENTIONAL TYPE ERRORS: this file must NOT typecheck cleanly.
// Each export breaks exactly one rule and is documented in
// docs/type-safety/expected-type-errors.md. Do not "fix" these errors.

import type { InvestorListing } from "../types";

/** Status typo: "availble" is not a ListingStatus. */
export const invalidStatusSpelling: InvestorListing = {
  id: "listing-bad-status",
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-03-01T10:00:00Z",
  title: "Downtown Duplex Offering",
  summary: "Two-unit duplex close to downtown transit.",
  status: "availble",
  propertyType: "multi_family",
  address: {
    line1: "100 Main St",
    city: "Austin",
    region: "TX",
    postalCode: "78701",
    country: "US",
  },
  financials: {
    askingPrice: 450000,
    currency: "USD",
  },
  contacts: [
    {
      id: "contact-101",
      fullName: "Alex Rivera",
      role: "broker",
      email: "alex.rivera@example.com",
    },
  ],
  primaryContactId: "contact-101",
  ownership: {
    ownerName: "Rivera Holdings LLC",
    ownershipPercent: 100,
  },
};

/** Address is missing its required city. */
export const missingAddressCity: InvestorListing = {
  id: "listing-missing-city",
  createdAt: "2026-03-02T10:00:00Z",
  updatedAt: "2026-03-02T10:00:00Z",
  title: "Lakeview Fourplex",
  summary: "Four-unit building with lake views and separate meters.",
  status: "draft",
  propertyType: "multi_family",
  address: {
    line1: "22 Lake Rd",
    region: "TX",
    postalCode: "78702",
    country: "US",
  },
  contacts: [
    {
      id: "contact-102",
      fullName: "Sam Lee",
      role: "owner_representative",
      email: "sam.lee@example.com",
    },
  ],
  primaryContactId: "contact-102",
  ownership: {
    ownerName: "Lee Capital LLC",
  },
};

/** Asking price written as text instead of a number. */
export const priceAsString: InvestorListing = {
  id: "listing-price-string",
  createdAt: "2026-03-03T10:00:00Z",
  updatedAt: "2026-03-03T10:00:00Z",
  title: "Cedar Street Rental Home",
  summary: "Single-family rental with a long-term tenant in place.",
  status: "active",
  propertyType: "single_family",
  address: {
    line1: "9 Cedar St",
    city: "Dallas",
    region: "TX",
    postalCode: "75201",
    country: "US",
  },
  financials: {
    askingPrice: "610000",
    currency: "USD",
  },
  contacts: [
    {
      id: "contact-103",
      fullName: "Jordan Kim",
      role: "broker",
      email: "jordan.kim@example.com",
    },
  ],
  primaryContactId: "contact-103",
  ownership: {
    ownerName: "Kim Investors LLC",
    ownershipPercent: 100,
  },
};

/** No contacts at all, so investors have nobody to reach and primaryContactId points at nothing. */
export const emptyContacts: InvestorListing = {
  id: "listing-no-contacts",
  createdAt: "2026-03-04T10:00:00Z",
  updatedAt: "2026-03-04T10:00:00Z",
  title: "Harbor Commercial Strip",
  summary: "Retail strip with five tenants near the harbor.",
  status: "active",
  propertyType: "commercial",
  address: {
    line1: "300 Harbor Way",
    city: "Corpus Christi",
    region: "TX",
    postalCode: "78401",
    country: "US",
  },
  financials: {
    askingPrice: 1850000,
    currency: "USD",
  },
  contacts: [],
  primaryContactId: "contact-104",
  ownership: {
    ownerName: "Harbor Retail Partners LLC",
    ownershipPercent: 100,
  },
};

/** Contact role "listing_agent" is not a ContactRole. */
export const invalidContactRole: InvestorListing = {
  id: "listing-bad-role",
  createdAt: "2026-03-05T10:00:00Z",
  updatedAt: "2026-03-05T10:00:00Z",
  title: "Pecan Grove Land Parcel",
  summary: "Five-acre parcel with road frontage, zoned agricultural.",
  status: "active",
  propertyType: "land",
  address: {
    line1: "7 Pecan Grove Rd",
    city: "Waco",
    region: "TX",
    postalCode: "76701",
    country: "US",
  },
  financials: {
    askingPrice: 390000,
    currency: "USD",
  },
  contacts: [
    {
      id: "contact-105",
      fullName: "Casey Nguyen",
      role: "listing_agent",
      email: "casey.nguyen@example.com",
    },
  ],
  primaryContactId: "contact-105",
  ownership: {
    ownerName: "Nguyen Land Co",
    ownershipPercent: 100,
  },
};

/** Ownership uses an unknown field name "percentOwned" instead of ownershipPercent. */
export const ownershipWrongFieldName: InvestorListing = {
  id: "listing-bad-ownership",
  createdAt: "2026-03-06T10:00:00Z",
  updatedAt: "2026-03-06T10:00:00Z",
  title: "Maple Court Multi-Family",
  summary: "Twelve-unit garden-style complex with on-site laundry.",
  status: "under_contract",
  propertyType: "multi_family",
  address: {
    line1: "55 Maple Ct",
    city: "Fort Worth",
    region: "TX",
    postalCode: "76102",
    country: "US",
  },
  financials: {
    askingPrice: 2100000,
    currency: "USD",
  },
  contacts: [
    {
      id: "contact-106",
      fullName: "Riley Park",
      role: "broker",
      email: "riley.park@example.com",
    },
  ],
  primaryContactId: "contact-106",
  ownership: {
    ownerName: "Maple Court Holdings LLC",
    percentOwned: 100,
  },
};

/** Closed listing with no closedAt, so nobody knows when the deal closed. */
export const closedWithoutClosedAt: InvestorListing = {
  id: "listing-closed-no-date",
  createdAt: "2025-10-01T10:00:00Z",
  updatedAt: "2026-01-15T10:00:00Z",
  title: "Elm Street Office Condo — Closed",
  summary: "Office condo sold to an owner-user.",
  status: "closed",
  propertyType: "commercial",
  address: {
    line1: "410 Elm St",
    city: "El Paso",
    region: "TX",
    postalCode: "79901",
    country: "US",
  },
  financials: {
    askingPrice: 875000,
    currency: "USD",
  },
  contacts: [
    {
      id: "contact-107",
      fullName: "Taylor Brooks",
      role: "broker",
      email: "taylor.brooks@example.com",
    },
  ],
  primaryContactId: "contact-107",
  ownership: {
    ownerName: "Brooks Office LLC",
    ownershipPercent: 100,
  },
};

/** Active listing that carries a closedAt date, which only closed listings may have. */
export const openWithClosedAt: InvestorListing = {
  id: "listing-open-with-date",
  createdAt: "2026-03-08T10:00:00Z",
  updatedAt: "2026-03-08T10:00:00Z",
  title: "Birch Lane Single-Family Home",
  summary: "Renovated three-bedroom home in a strong rental area.",
  status: "active",
  closedAt: "2026-03-09T10:00:00Z",
  propertyType: "single_family",
  address: {
    line1: "18 Birch Ln",
    city: "Lubbock",
    region: "TX",
    postalCode: "79401",
    country: "US",
  },
  financials: {
    askingPrice: 315000,
    currency: "USD",
  },
  contacts: [
    {
      id: "contact-108",
      fullName: "Jamie Ortiz",
      role: "property_manager",
      email: "jamie.ortiz@example.com",
    },
  ],
  primaryContactId: "contact-108",
  ownership: {
    ownerName: "Ortiz Rentals LLC",
    ownershipPercent: 100,
  },
};

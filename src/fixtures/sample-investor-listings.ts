import type { InvestorListing } from "../types";

/** Active multi-family listing with every nested shape filled in, including optional fields. */
export const sampleActiveListing: InvestorListing = {
  id: "listing-001",
  createdAt: "2026-03-01T10:00:00Z",
  updatedAt: "2026-03-15T16:30:00Z",
  title: "Riverfront Multi-Family — 24 Units",
  summary: "Stabilized 24-unit riverfront property with 96% occupancy and value-add upside on unit interiors.",
  status: "active",
  propertyType: "multi_family",
  address: {
    line1: "1200 River Rd",
    line2: "Suite 100",
    city: "Austin",
    region: "TX",
    postalCode: "78701",
    country: "US",
  },
  financials: {
    askingPrice: 4250000,
    currency: "USD",
    projectedIrrPercent: 14.2,
    capRatePercent: 7.3,
  },
  contacts: [
    {
      id: "contact-001",
      fullName: "Jordan Lee",
      role: "broker",
      email: "jordan.lee@example.com",
      phone: "+1-512-555-0142",
    },
    {
      id: "contact-002",
      fullName: "Priya Natarajan",
      role: "property_manager",
      email: "priya.natarajan@example.com",
    },
  ],
  primaryContactId: "contact-001",
  ownership: {
    ownerName: "PREI Riverfront Holdings LLC",
    ownershipPercent: 100,
  },
};

/** Draft listing still being prepared: no financials yet and only required address lines. */
export const sampleDraftListing: InvestorListing = {
  id: "listing-002",
  createdAt: "2026-04-02T09:15:00Z",
  updatedAt: "2026-04-02T09:15:00Z",
  title: "Draft — Oak Street Single-Family Rental",
  summary: "Three-bedroom rental home near downtown; pricing and projections still being finalized.",
  status: "draft",
  propertyType: "single_family",
  address: {
    line1: "88 Oak St",
    city: "Dallas",
    region: "TX",
    postalCode: "75201",
    country: "US",
  },
  contacts: [
    {
      id: "contact-003",
      fullName: "Morgan Ellis",
      role: "owner_representative",
      email: "morgan.ellis@example.com",
    },
  ],
  primaryContactId: "contact-003",
  ownership: {
    ownerName: "Ellis Family Trust",
  },
};

/** Under-contract commercial listing with a partial ownership stake and notes. */
export const sampleUnderContractListing: InvestorListing = {
  id: "listing-003",
  createdAt: "2026-01-10T14:00:00Z",
  updatedAt: "2026-05-20T11:45:00Z",
  title: "Cedar Commercial Center — Under Contract",
  summary: "Multi-tenant commercial center with long-term anchor lease; buyer currently in due diligence.",
  status: "under_contract",
  propertyType: "commercial",
  address: {
    line1: "4500 Cedar Blvd",
    city: "Houston",
    region: "TX",
    postalCode: "77002",
    country: "US",
  },
  financials: {
    askingPrice: 6100000,
    currency: "USD",
    capRatePercent: 7.5,
  },
  contacts: [
    {
      id: "contact-004",
      fullName: "Sam Rivera",
      role: "broker",
      email: "sam.rivera@example.com",
      phone: "+1-713-555-0187",
    },
  ],
  primaryContactId: "contact-004",
  ownership: {
    ownerName: "PREI Cedar JV",
    notes: "Joint venture; remaining 40% held by a local operating partner.",
    ownershipPercent: 60,
  },
};

/** Closed land listing; the closed status branch requires closedAt. */
export const sampleClosedListing: InvestorListing = {
  id: "listing-004",
  createdAt: "2025-09-05T08:00:00Z",
  updatedAt: "2026-02-28T17:00:00Z",
  title: "Summit Ridge Land Parcel — Closed",
  summary: "Twelve-acre entitled parcel zoned for residential development; sold to a regional builder.",
  status: "closed",
  closedAt: "2026-02-28T17:00:00Z",
  propertyType: "land",
  address: {
    line1: "1 Summit Ridge Rd",
    city: "San Antonio",
    region: "TX",
    postalCode: "78205",
    country: "US",
  },
  financials: {
    askingPrice: 2750000,
    currency: "USD",
    projectedIrrPercent: 18,
  },
  contacts: [
    {
      id: "contact-005",
      fullName: "Alex Chen",
      role: "broker",
      email: "alex.chen@example.com",
    },
  ],
  primaryContactId: "contact-005",
  ownership: {
    ownerName: "PREI Summit LLC",
    ownershipPercent: 100,
  },
};

/** All valid samples, for later UI mocks and typecheck scripts. */
export const sampleInvestorListings: InvestorListing[] = [
  sampleActiveListing,
  sampleDraftListing,
  sampleUnderContractListing,
  sampleClosedListing,
];

import type { ListingStatus, PropertyType } from '../../types'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Mirrors supabase/migrations/20250321000000_property_listings.sql and
// docs/data-model/property-listings-schema.md. Change all three together.
type PropertyListingRow = {
  id: string
  owner_id: string
  title: string
  summary: string
  property_type: PropertyType
  status: ListingStatus
  address_line1: string
  address_line2: string | null
  city: string
  region: string
  postal_code: string
  country: string
  asking_price: number | null
  closed_at: string | null
  created_at: string
  updated_at: string
}

// created_at and updated_at are left out on purpose: the database sets them.
type PropertyListingInsert = {
  id?: string
  owner_id: string
  title: string
  summary: string
  property_type: PropertyType
  status?: ListingStatus
  address_line1: string
  address_line2?: string | null
  city: string
  region: string
  postal_code: string
  country?: string
  asking_price?: number | null
  closed_at?: string | null
}

// id, owner_id and created_at never change after insert, and a trigger rejects
// attempts to; updated_at is set by the trigger.
type PropertyListingUpdate = Partial<
  Omit<PropertyListingRow, 'id' | 'owner_id' | 'created_at' | 'updated_at'>
>

export type Database = {
  public: {
    Tables: {
      property_listings: {
        Row: PropertyListingRow
        Insert: PropertyListingInsert
        Update: PropertyListingUpdate
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

export type PropertyListing = Database['public']['Tables']['property_listings']['Row']
export type PropertyListingNew =
  Database['public']['Tables']['property_listings']['Insert']
export type PropertyListingChanges =
  Database['public']['Tables']['property_listings']['Update']

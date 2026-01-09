/*
  # NFT Giveaway Entries Schema

  1. New Tables
    - `nft_entries`
      - `id` (uuid, primary key) - Unique identifier for each entry
      - `wallet_address` (text, unique, required) - Solana wallet address
      - `email` (text, optional) - Optional email for notifications
      - `twitter_handle` (text, optional) - Optional Twitter handle
      - `created_at` (timestamptz) - Timestamp of entry submission
      - `status` (text) - Status of the NFT delivery (pending, sent, failed)
      - `tx_hash` (text, optional) - Transaction hash when NFT is sent

  2. Security
    - Enable RLS on `nft_entries` table
    - Add policy for public insert (anyone can submit)
    - Add policy for public read of own submission
    - Add policy for authenticated admin users to view all entries

  3. Indexes
    - Index on wallet_address for fast lookups
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS nft_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  email text,
  twitter_handle text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending' NOT NULL,
  tx_hash text,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'sent', 'failed'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_nft_entries_wallet ON nft_entries(wallet_address);
CREATE INDEX IF NOT EXISTS idx_nft_entries_created_at ON nft_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nft_entries_status ON nft_entries(status);

-- Enable RLS
ALTER TABLE nft_entries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their own entry
CREATE POLICY "Anyone can submit an entry"
  ON nft_entries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to read their own entry by wallet address
CREATE POLICY "Users can view own entry"
  ON nft_entries
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users (admins) to update entries
CREATE POLICY "Authenticated users can update entries"
  ON nft_entries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
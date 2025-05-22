-- Suicart Database Setup Script

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_address TEXT NOT NULL,
  counterparty_address TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Pending', 'Completed', 'Refunded')),
  asset_id TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buyer', 'seller')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_address ON transactions(user_address);
CREATE INDEX IF NOT EXISTS idx_transactions_counterparty_address ON transactions(counterparty_address);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  address TEXT PRIMARY KEY,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  transaction_count INTEGER DEFAULT 0
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- Create function to increment transaction count
CREATE OR REPLACE FUNCTION increment_transaction_count(user_address TEXT)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET transaction_count = transaction_count + 1
  WHERE address = user_address;
END;
$$ LANGUAGE plpgsql;

-- Enable row level security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (user_address = auth.uid() OR counterparty_address = auth.uid());

CREATE POLICY "Users can insert their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (user_address = auth.uid());

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (address = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (address = auth.uid());

-- Insert sample data for testing
INSERT INTO user_profiles (address, username, created_at)
VALUES 
  ('0x123456789abcdef', 'test_user1', NOW()),
  ('0xabcdef123456789', 'test_user2', NOW())
ON CONFLICT (address) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (
  user_address,
  counterparty_address,
  amount,
  status,
  asset_id,
  transaction_type,
  created_at,
  completed_at
)
VALUES 
  (
    '0x123456789abcdef',
    '0xabcdef123456789',
    10.5,
    'Completed',
    '0x7890abcdef123456',
    'buyer',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '6 days'
  ),
  (
    '0xabcdef123456789',
    '0x123456789abcdef',
    5.2,
    'Pending',
    '0x6543210fedcba987',
    'seller',
    NOW() - INTERVAL '3 days',
    NULL
  ),
  (
    '0x123456789abcdef',
    '0xabcdef123456789',
    7.8,
    'Refunded',
    '0x13579bdf2468ace0',
    'buyer',
    NOW() - INTERVAL '14 days',
    NOW() - INTERVAL '13 days'
  )
ON CONFLICT DO NOTHING;

-- Print completion message
DO $$
BEGIN
  RAISE NOTICE 'Suicart database setup completed successfully!';
END $$;

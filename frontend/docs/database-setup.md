# Suicart Database Setup Guide

This guide explains how to set up the database schema for the Suicart application using Supabase.

## Prerequisites

- A Supabase account and project
- Access to the Supabase dashboard or SQL editor

## Database Schema Setup

### 1. Transactions Table

Create the `transactions` table to store escrow transaction records:

\`\`\`sql
CREATE TABLE transactions (
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
CREATE INDEX idx_transactions_user_address ON transactions(user_address);
CREATE INDEX idx_transactions_counterparty_address ON transactions(counterparty_address);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
\`\`\`

### 2. User Profiles Table

Create the `user_profiles` table to store user information:

\`\`\`sql
CREATE TABLE user_profiles (
  address TEXT PRIMARY KEY,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  transaction_count INTEGER DEFAULT 0
);

-- Create index for faster queries
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
\`\`\`

### 3. Create Function for Transaction Count

Create a PostgreSQL function to increment the transaction count:

\`\`\`sql
CREATE OR REPLACE FUNCTION increment_transaction_count(user_address TEXT)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles
  SET transaction_count = transaction_count + 1
  WHERE address = user_address;
END;
$$ LANGUAGE plpgsql;
\`\`\`

### 4. Row Level Security (Optional but Recommended)

Set up row-level security to protect your data:

\`\`\`sql
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
\`\`\`

## Connecting to Supabase

### Environment Variables

Set the following environment variables in your application:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

### Setting Up Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the required environment variables
4. Deploy your application to apply the changes

## Testing the Database Connection

You can test your database connection by running:

\`\`\`sql
SELECT * FROM transactions LIMIT 1;
SELECT * FROM user_profiles LIMIT 1;
\`\`\`

## Sample Data Insertion

Insert sample data for testing:

\`\`\`sql
-- Insert a user profile
INSERT INTO user_profiles (address, username, created_at)
VALUES ('0x123456789abcdef', 'test_user', NOW());

-- Insert a sample transaction
INSERT INTO transactions (
  user_address,
  counterparty_address,
  amount,
  status,
  asset_id,
  transaction_type,
  created_at
)
VALUES (
  '0x123456789abcdef',
  '0xabcdef123456789',
  10.5,
  'Pending',
  '0x7890abcdef123456',
  'buyer',
  NOW()
);
\`\`\`

## Database Backup and Maintenance

### Regular Backups

Supabase provides automatic backups. To create a manual backup:

1. Go to your Supabase project dashboard
2. Navigate to Database > Backups
3. Click "Create backup"

### Performance Optimization

Run these periodically to optimize database performance:

\`\`\`sql
-- Analyze tables for better query planning
ANALYZE transactions;
ANALYZE user_profiles;

-- Vacuum tables to reclaim storage
VACUUM FULL transactions;
VACUUM FULL user_profiles;
\`\`\`

## Troubleshooting Common Issues

### Connection Issues

If you're experiencing connection issues:

1. Verify your environment variables are correct
2. Check if your IP is allowed in Supabase network restrictions
3. Ensure you're using the correct keys for authentication

### Query Performance Issues

If your queries are slow:

1. Check that indexes are properly created
2. Analyze your query plans: `EXPLAIN ANALYZE SELECT * FROM transactions WHERE user_address = 'your_address';`
3. Consider adding additional indexes for common query patterns

### Storage Issues

If you're approaching storage limits:

1. Consider cleaning up old or completed transactions
2. Review any large text fields for optimization
3. Upgrade your Supabase plan if necessary

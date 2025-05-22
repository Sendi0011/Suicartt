#!/bin/bash

# Script to deploy the Suicart escrow contract to the Sui blockchain

# Check if Sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo "Sui CLI is not installed. Please install it first."
    echo "Follow the instructions at: https://docs.sui.io/build/install"
    exit 1
fi

# Navigate to the sui directory
cd sui || { echo "sui directory not found"; exit 1; }

# Build the contract
echo "Building the Suicart escrow contract..."
sui move build || { echo "Build failed"; exit 1; }

# Deploy the contract
echo "Deploying the contract to the Sui blockchain..."
RESULT=$(sui client publish --gas-budget 100000000)
echo "$RESULT"

# Extract the package ID from the result
PACKAGE_ID=$(echo "$RESULT" | grep -o "Immutable.*" | grep -o "0x[a-fA-F0-9]\+" | head -1)

if [ -z "$PACKAGE_ID" ]; then
    echo "Failed to extract package ID from deployment result."
    exit 1
fi

echo "Contract deployed successfully!"
echo "Package ID: $PACKAGE_ID"
echo ""
echo "Add this to your environment variables:"
echo "NEXT_PUBLIC_ESCROW_PACKAGE_ID=$PACKAGE_ID"

# Update the Move.toml file with the published address
sed -i "s/published-at = \"0x0\"/published-at = \"$PACKAGE_ID\"/" Move.toml
sed -i "s/escrow = \"0x0\"/escrow = \"$PACKAGE_ID\"/" Move.toml

echo "Move.toml updated with the deployed package ID."
echo ""
echo "Next steps:"
echo "1. Add NEXT_PUBLIC_ESCROW_PACKAGE_ID=$PACKAGE_ID to your .env.local file"
echo "2. Add this environment variable to your Vercel project settings"
echo "3. Redeploy your application"

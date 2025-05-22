# Sui Contract Deployment Guide for Suicart

This guide walks you through deploying the Suicart escrow smart contract to the Sui blockchain.

## Prerequisites

Before you begin, make sure you have:

- [Sui CLI](https://docs.sui.io/build/install) installed
- A Sui wallet with sufficient SUI tokens for deployment
- Git (to clone the repository)
- Node.js 18+ (if you want to interact with the contract via the web app)

## Step 1: Set Up Your Development Environment

### Install Sui CLI

If you haven't already installed the Sui CLI, follow these instructions:

\`\`\`bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui
\`\`\`

Verify the installation:

\`\`\`bash
sui --version
\`\`\`

### Configure Your Sui Environment

Set up your local Sui environment:

\`\`\`bash
sui client
\`\`\`

If this is your first time using Sui CLI, follow the prompts to create or import a wallet.

### Check Your SUI Balance

Make sure you have sufficient SUI tokens for deployment:

\`\`\`bash
sui client gas
\`\`\`

If you're using devnet and need test tokens, use the [Sui faucet](https://faucet.devnet.sui.io/).

## Step 2: Clone and Prepare the Contract

### Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/suicart.git
cd suicart/sui
\`\`\`

### Review the Contract

The main contract file is `sources/escrow.move`. Take a moment to understand the contract functionality:

- Creating escrows
- Depositing assets
- Confirming transactions
- Refunding transactions

## Step 3: Build the Contract

Compile the contract:

\`\`\`bash
sui move build
\`\`\`

This command compiles the Move code and creates compiled artifacts in the `build` directory.

## Step 4: Deploy the Contract

Deploy the contract to the Sui blockchain:

\`\`\`bash
sui client publish --gas-budget 100000000
\`\`\`

> Note: The gas budget might need adjustment depending on the contract size and network conditions.

After successful deployment, you'll see output similar to this:

\`\`\`
----- Transaction Effects -----
Status : Success
Created Objects:
  - ID: 0x<PACKAGE_ID> , Owner: Immutable
  - ID: 0x<ESCROW_MODULE_ID> , Owner: Immutable
  ...
\`\`\`

Take note of the `PACKAGE_ID` - this is your deployed contract's address.

## Step 5: Configure Your Application

After deployment, you need to set the contract package ID in your application:

1. In your `.env.local` file (for local development):
   \`\`\`
   NEXT_PUBLIC_SUI_NETWORK=devnet
   NEXT_PUBLIC_ESCROW_PACKAGE_ID=0x<PACKAGE_ID>
   \`\`\`

2. In your Vercel project settings (for production):
   - Go to Settings → Environment Variables
   - Add `NEXT_PUBLIC_SUI_NETWORK` (devnet, testnet, or mainnet)
   - Add `NEXT_PUBLIC_ESCROW_PACKAGE_ID` with your contract's package ID

## Step 6: Test the Contract

### Using Sui CLI

You can test basic contract functionality using the Sui CLI:

1. Create an escrow transaction:
   \`\`\`bash
   sui client call --function create_escrow --module escrow --package 0x<PACKAGE_ID> --args <AMOUNT> <SELLER_ADDRESS> --gas-budget 10000000
   \`\`\`

2. Check the created escrow:
   \`\`\`bash
   sui client object <ESCROW_ID>
   \`\`\`

### Using the Web Application

After configuring your application with the contract package ID:

1. Connect your wallet to the web application
2. Create a new escrow transaction
3. Verify that the transaction is submitted to the blockchain
4. Check the transaction status in your wallet or a Sui explorer

## Step 7: Network Selection

The Suicart application can work with different Sui networks:

- **Devnet**: For development and testing
- **Testnet**: For staging environments
- **Mainnet**: For production use

Make sure you set the correct network in your environment variables:
\`\`\`
NEXT_PUBLIC_SUI_NETWORK=devnet  # or testnet, or mainnet
\`\`\`

## Troubleshooting

### Transaction Failed

If your transaction fails, check:
- Gas budget might be too low
- Your wallet might not have enough SUI
- Contract parameters might be incorrect

### Contract Not Found

If your application can't find the contract:
- Verify that you're using the correct package ID
- Make sure you're connecting to the same network where you deployed the contract

### Object Not Found

If an object (like an escrow) can't be found:
- Check if you're using the correct object ID
- Verify that the object wasn't deleted in a previous transaction

## Upgrading the Contract

To upgrade the contract:

1. Make your changes to the code
2. Build the contract:
   \`\`\`bash
   sui move build
   \`\`\`

3. Publish the upgraded contract:
   \`\`\`bash
   sui client publish --gas-budget 100000000 --upgrade-capability <UPGRADE_CAP_ID>
   \`\`\`

> Note: Upgrading requires the upgrade capability object that was created during the initial deployment.

## Resources

- [Sui Documentation](https://docs.sui.io/)
- [Move Language Documentation](https://diem.github.io/move/introduction.html)
- [Sui Explorer](https://explorer.sui.io/)

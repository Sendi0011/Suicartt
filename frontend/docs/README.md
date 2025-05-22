# Suicart Documentation

Welcome to the Suicart documentation. This guide provides comprehensive information for deploying, configuring, and using the Suicart escrow platform.

## Table of Contents

- [Contract Deployment](./contract-deployment.md) - How to deploy the Sui blockchain contract
- [Contract Interaction](./contract-interaction.md) - How to interact with the deployed contract
- [Database Setup](./database-setup.md) - Setting up the Supabase database for Suicart

## Project Overview

Suicart is a secure blockchain escrow platform built on the Sui blockchain. It allows buyers and sellers to conduct transactions securely using smart contract-based escrow services.

### Key Features

- Secure escrow using Sui blockchain smart contracts
- User-friendly interface for creating and managing escrows
- Transaction history tracking
- Support for digital asset transfers

## Architecture Overview

### Frontend

- **Framework**: Next.js 14+ with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **3D Visualization**: Three.js

### Backend

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Sui wallet authentication
- **Blockchain**: Sui blockchain with Move smart contracts

### Smart Contract

- **Language**: Move
- **Network**: Sui (devnet, testnet, or mainnet)
- **Main Components**:
  - Asset representation
  - Escrow logic
  - Events for tracking

## Getting Started

1. [Deploy the Sui contract](./contract-deployment.md)
2. [Set up the database](./database-setup.md)
3. Configure the application with the contract and database credentials
4. Start using Suicart!

## Environment Variables

The application requires the following environment variables:

\`\`\`
# Sui Blockchain
NEXT_PUBLIC_SUI_NETWORK=devnet        # devnet, testnet, or mainnet
NEXT_PUBLIC_ESCROW_PACKAGE_ID=0x...   # The deployed contract package ID

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://...  # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...     # Your Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=...         # Your Supabase service role key (for admin operations)
\`\`\`

## Contributing

We welcome contributions! Please see our [contributing guidelines](../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

# Suicart - Secure Blockchain Escrow Platform

![Suicart Logo](https://placeholder.svg?height=100&width=300&text=Suicart)

Suicart is a modern, secure escrow platform built on the Sui blockchain. It provides a trustless environment for digital asset transactions, ensuring safe exchanges between buyers and sellers.

## Features

- **Secure Escrow Service**: Lock funds in smart contracts until transaction conditions are met
- **3D Interactive Interface**: Modern UI with animated 3D elements
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Transaction Management**: Create, monitor, and complete escrow transactions
- **Transaction History**: View and filter past transactions
- **Blockchain Integration**: Direct integration with Sui blockchain

## Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js
- **Smart Contracts**: Sui Move
- **Database**: Supabase (PostgreSQL)

## Prerequisites

- Node.js 18.0.0 or later
- Sui wallet (for blockchain interactions)
- Sui CLI (for contract deployment)
- Supabase account (for database)

## Getting Started

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/suicart.git
   cd suicart
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   \`\`\`
   NEXT_PUBLIC_SUI_NETWORK=devnet
   NEXT_PUBLIC_ESCROW_PACKAGE_ID=your_deployed_package_id
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Documentation

For detailed documentation, please see the [docs directory](./docs):

- [Contract Deployment Guide](./docs/contract-deployment.md)
- [Contract Interaction Guide](./docs/contract-interaction.md)
- [Database Setup Guide](./docs/database-setup.md)
- [Full Documentation](./docs/README.md)

## Project Structure

\`\`\`
suicart/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   ├── create-escrow/      # Escrow creation page
│   ├── dashboard/          # User dashboard
│   ├── transactions/       # Transaction history
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── features.tsx        # Features section
│   ├── how-it-works.tsx    # How it works section
│   ├── sui-wallet-provider.tsx # Wallet provider
│   └── three-d-logo.tsx    # 3D logo component
├── docs/                   # Documentation
├── lib/                    # Utility functions
│   ├── db.ts               # Database client
│   └── sui-client.ts       # Sui blockchain client
├── sui/                    # Sui Move smart contracts
├── public/                 # Static assets
└── README.md               # Project documentation
\`\`\`

## Smart Contract

The escrow smart contract is written in Move for the Sui blockchain. It provides:

- Secure fund locking mechanisms
- Asset deposit functionality
- Transaction confirmation and refund capabilities
- Event emissions for tracking

For contract deployment instructions, see the [Contract Deployment Guide](./docs/contract-deployment.md).

## Database Schema

The application uses Supabase with the following main tables:

- `transactions`: Stores escrow transaction records
- `user_profiles`: Stores user information and statistics

For database setup instructions, see the [Database Setup Guide](./docs/database-setup.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Sui blockchain for providing the infrastructure
- Three.js for 3D rendering capabilities
- shadcn/ui for the component library
- Supabase for the database platform

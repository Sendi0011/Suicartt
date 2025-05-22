# Interacting with Suicart Escrow Contract

This guide explains how to interact with the deployed Suicart escrow contract through different methods.

## Contract Functions Overview

The Suicart escrow contract provides the following main functions:

### `create_escrow`

Creates a new escrow transaction with funds deposited by the buyer.

**Parameters:**
- `amount`: Coin<SUI> - The SUI tokens to be held in escrow
- `seller`: address - The address of the seller

**Returns:**
- `Escrow` - The created escrow object

### `deposit_asset`

Deposits a digital asset into an existing escrow by the seller.

**Parameters:**
- `escrow`: &mut Escrow - The escrow to deposit the asset into
- `asset`: Asset - The digital asset being sold

### `confirm`

Confirms the transaction, releasing funds to the seller and the asset to the buyer.

**Parameters:**
- `escrow`: Escrow - The escrow to confirm

### `refund`

Cancels the escrow, refunding the buyer and returning the asset (if deposited) to the seller.

**Parameters:**
- `escrow`: Escrow - The escrow to refund

### `mint_asset`

Helper function to create a test asset (for development purposes).

**Parameters:**
- `value`: u64 - A value for the asset
- `ctx`: &mut TxContext - Transaction context

**Returns:**
- `Asset` - The created asset

## Interacting via Sui CLI

### Create an Escrow

\`\`\`bash
# First, create some SUI for the escrow
sui client split-coin <COIN_OBJECT_ID> --amounts <AMOUNT> --gas-budget 10000000

# Then create the escrow with the split coin
sui client call \
  --package <PACKAGE_ID> \
  --module escrow \
  --function create_escrow \
  --args <COIN_OBJECT_ID> <SELLER_ADDRESS> \
  --gas-budget 10000000
\`\`\`

### Mint a Test Asset

\`\`\`bash
sui client call \
  --package <PACKAGE_ID> \
  --module escrow \
  --function mint_asset \
  --args <VALUE> \
  --gas-budget 10000000
\`\`\`

### Deposit an Asset

\`\`\`bash
sui client call \
  --package <PACKAGE_ID> \
  --module escrow \
  --function deposit_asset \
  --args <ESCROW_ID> <ASSET_ID> \
  --gas-budget 10000000
\`\`\`

### Confirm an Escrow

\`\`\`bash
sui client call \
  --package <PACKAGE_ID> \
  --module escrow \
  --function confirm \
  --args <ESCROW_ID> \
  --gas-budget 10000000
\`\`\`

### Refund an Escrow

\`\`\`bash
sui client call \
  --package <PACKAGE_ID> \
  --module escrow \
  --function refund \
  --args <ESCROW_ID> \
  --gas-budget 10000000
\`\`\`

## Interacting via JavaScript SDK

You can also interact with the contract using the Sui JavaScript SDK:

\`\`\`javascript
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui.js/client';

// Initialize client
const client = new SuiClient({ url: 'https://fullnode.devnet.sui.io:443' });

// Create an escrow
async function createEscrow(signer, coinObjectId, sellerAddress, amount) {
  const txb = new TransactionBlock();
  
  // Split the coin
  const [coin] = txb.splitCoins(txb.object(coinObjectId), [txb.pure(amount)]);
  
  // Create escrow
  txb.moveCall({
    target: `${packageId}::escrow::create_escrow`,
    arguments: [coin, txb.pure(sellerAddress)],
  });

  return await signer.signAndExecuteTransactionBlock({
    transactionBlock: txb,
    options: {
      showEffects: true,
      showEvents: true,
    },
  });
}
\`\`\`

## Understanding Event Emissions

The contract emits events that can be monitored:

1. `EscrowCreatedEvent` - When a new escrow is created
2. `EscrowConfirmedEvent` - When an escrow is confirmed (completed)
3. `EscrowRefundedEvent` - When an escrow is refunded (cancelled)

You can listen for these events using the Sui SDK:

\`\`\`javascript
async function getEscrowEvents(packageId) {
  const events = await client.queryEvents({
    query: {
      MoveEventType: `${packageId}::escrow::EscrowCreatedEvent`,
    },
  });
  
  return events.data;
}
\`\`\`

## Contract Security Considerations

When interacting with the contract, remember:

1. **Buyer Protection**: Funds are locked in the escrow until either:
   - The buyer confirms receipt of the asset
   - The buyer requests a refund

2. **Seller Protection**: Once the asset is deposited:
   - Seller is guaranteed payment if the buyer confirms
   - Asset is returned if the buyer requests a refund

3. **Authorization Checks**: Only authorized parties can perform specific actions:
   - Only the seller can deposit assets
   - Only the buyer can confirm or refund

4. **Status Tracking**: An escrow can only be in one of three states:
   - Pending: Initial state after creation
   - Completed: After buyer confirmation
   - Refunded: After buyer refund request

## Testing Best Practices

When testing your integration:

1. Start with small amounts
2. Test the full flow (create -> deposit -> confirm)
3. Test the refund flow (create -> deposit -> refund)
4. Test authorization checks (attempt operations with wrong addresses)
5. Verify that events are emitted correctly

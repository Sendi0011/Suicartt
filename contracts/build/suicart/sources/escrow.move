#[allow(lint(coin_field), unused_variable)]
module suicart::escrow {
    use sui::coin::{Self, Coin};
    use sui::event;
    // Removed: use sui::object::UID;
    // Removed: use sui::transfer;
    // Removed: use sui::tx_context::TxContext;

    const EUnauthorized: u64 = 0;

    /// Escrow struct holds coins locked between buyer and seller
    public struct Escrow<phantom T> has key, store {
        id: UID,
        buyer: address,
        seller: address,
        escrowed_coin: Coin<T>,
        escrow_type: u8,
    }

    /// Event emitted when escrow is created
    public struct EscrowCreated has copy, drop {
        buyer: address,
        seller: address,
        amount: u64,
        escrow_type: u8,
    }

    /// Event emitted when escrow is released
    public struct EscrowReleased has copy, drop {
        buyer: address,
        seller: address,
        amount: u64,
    }

    /// Event emitted when escrow is refunded
    public struct EscrowRefunded has copy, drop {
        buyer: address,
        seller: address,
        amount: u64,
    }

    /// Create a new escrow, locking coins
    fun create<T>(
        buyer: address,
        seller: address,
        coins: Coin<T>,
        escrow_type: u8,
        ctx: &mut TxContext,
    ): Escrow<T> {
        let id = object::new(ctx);
        let amount = coin::value(&coins);

        event::emit(EscrowCreated {
            buyer,
            seller,
            amount,
            escrow_type,
        });

        Escrow {
            id,
            buyer,
            seller,
            escrowed_coin: coins,
            escrow_type,
        }
    }

    /// Entry function to create a new escrow and transfer it to the sender
    public entry fun create_entry<T>(
        buyer: address,
        seller: address,
        coins: Coin<T>,
        escrow_type: u8,
        ctx: &mut TxContext,
    ) {
        let escrow = create(buyer, seller, coins, escrow_type, ctx);
        transfer::public_transfer(escrow, tx_context::sender(ctx));
    }

    /// Release escrow coins to the buyer
    public entry fun release<T>(
        escrow: Escrow<T>,
        ctx: &mut TxContext,
    ) {
        assert!(tx_context::sender(ctx) == escrow.buyer || tx_context::sender(ctx) == escrow.seller, EUnauthorized);
        let Escrow { id, buyer, seller, escrowed_coin, escrow_type: _ } = escrow;
        let amount = coin::value(&escrowed_coin);

        // Transfer coins to buyer
        transfer::public_transfer(escrowed_coin, buyer);
        object::delete(id);

        event::emit(EscrowReleased {
            buyer,
            seller,
            amount,
        });
    }

    /// Refund escrow coins to the seller
    public entry fun refund<T>(
        escrow: Escrow<T>,
        ctx: &mut TxContext,
    ) {
        assert!(tx_context::sender(ctx) == escrow.buyer || tx_context::sender(ctx) == escrow.seller, EUnauthorized);
        let Escrow { id, buyer, seller, escrowed_coin, escrow_type: _ } = escrow;
        let amount = coin::value(&escrowed_coin);

        // Transfer coins back to seller
        transfer::public_transfer(escrowed_coin, seller);
        object::delete(id);

        event::emit(EscrowRefunded {
            buyer,
            seller,
            amount,
        });
    }
}
#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, IntoVal, Symbol};

/* ─── Storage keys ─── */ 

#[contracttype]
pub enum DataKey {
  OrderContract,
  Escrow(u64),
  TotalEscrowed,
}

/* ─── Types ─── */

#[contracttype]
#[derive(Clone)]
pub struct EscrowDeposit {
  pub order_id: u64,
  pub buyer: Address,
  pub amount: i128,
  pub is_active: bool,
}

/* ─── Contract ─── */

#[contract]
pub struct EscrowContract;

#[contractimpl]
impl EscrowContract {
  /// Initialize with the authorized order manager contract address.
  pub fn initialize(env: Env, order_contract: Address) {
    env.storage()
      .instance()
      .set(&DataKey::OrderContract, &order_contract);
    env.storage()
      .instance()
      .set(&DataKey::TotalEscrowed, &0i128);
    env.events().publish(("escrow", "initialized"), true);
  }

  /// Buyer deposits funds into the escrow vault for an order.
  pub fn deposit(env: Env, buyer: Address, order_id: u64, amount: i128) {
    buyer.require_auth();

    let deposit = EscrowDeposit {
      order_id,
      buyer: buyer.clone(),
      amount,
      is_active: true,
    };

    env.storage()
      .instance()
      .set(&DataKey::Escrow(order_id), &deposit);

    let total: i128 = env
      .storage()
      .instance()
      .get(&DataKey::TotalEscrowed)
      .unwrap_or(0);
    env.storage()
      .instance()
      .set(&DataKey::TotalEscrowed, &(total + amount));

    env.events()
      .publish(("escrow", "deposited"), (order_id, amount));

    // Call order_contract to mark the order as funded
    let order_contract: Address = env
      .storage()
      .instance()
      .get(&DataKey::OrderContract)
      .unwrap();

    env.invoke_contract::<()>(
      &order_contract,
      &Symbol::new(&env, "mark_funded"),
      (order_id,).into_val(&env),
    );
  }

  /// Release escrowed payment to supplier.
  /// Must only be called by the Order Contract.
  pub fn release_payment(env: Env, order_id: u64, supplier: Address, amount: i128) {
    let order_contract: Address = env
      .storage()
      .instance()
      .get(&DataKey::OrderContract)
      .unwrap();

    // Enforce that only the Order Contract can trigger releases
    order_contract.require_auth();

    let mut deposit: EscrowDeposit = env
      .storage()
      .instance()
      .get(&DataKey::Escrow(order_id))
      .unwrap();

    if !deposit.is_active {
      panic!("Escrow is not active");
    }

    if amount > deposit.amount {
      panic!("Release amount exceeds escrowed balance");
    }

    deposit.is_active = false;
    env.storage()
      .instance()
      .set(&DataKey::Escrow(order_id), &deposit);

    let total: i128 = env
      .storage()
      .instance()
      .get(&DataKey::TotalEscrowed)
      .unwrap_or(0);
    let new_total = if total >= amount { total - amount } else { 0 };
    env.storage()
      .instance()
      .set(&DataKey::TotalEscrowed, &new_total);

    env.events()
      .publish(("escrow", "released"), (order_id, supplier, amount));
  }

  /// Refund remaining escrow to buyer (for cancelled/failed orders).
  /// Must only be called by the Order Contract.
  pub fn refund_payment(env: Env, order_id: u64, buyer: Address) {
    let order_contract: Address = env
      .storage()
      .instance()
      .get(&DataKey::OrderContract)
      .unwrap();

    order_contract.require_auth();

    let mut deposit: EscrowDeposit = env
      .storage()
      .instance()
      .get(&DataKey::Escrow(order_id))
      .unwrap();

    if !deposit.is_active {
      panic!("Escrow is not active");
    }

    let refund_amount = deposit.amount;
    deposit.is_active = false;

    env.storage()
      .instance()
      .set(&DataKey::Escrow(order_id), &deposit);

    let total: i128 = env
      .storage()
      .instance()
      .get(&DataKey::TotalEscrowed)
      .unwrap_or(0);
    let new_total = if total >= refund_amount { total - refund_amount } else { 0 };
    env.storage()
      .instance()
      .set(&DataKey::TotalEscrowed, &new_total);

    env.events()
      .publish(("escrow", "refunded"), (order_id, buyer, refund_amount));
  }

  /* ─── Read functions ─── */

  pub fn get_escrow(env: Env, order_id: u64) -> EscrowDeposit {
    env.storage()
      .instance()
      .get(&DataKey::Escrow(order_id))
      .unwrap()
  }

  pub fn get_total_escrowed(env: Env) -> i128 {
    env.storage()
      .instance()
      .get(&DataKey::TotalEscrowed)
      .unwrap_or(0)
  }
}

mod test;


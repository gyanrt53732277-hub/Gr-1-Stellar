#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, IntoVal, Symbol};

/* ─── Types ─── */

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub enum OrderStatus {
  Created,
  Funded,
  Shipped,
  Delivered,
  InspectedPassed,
  InspectedFailed,
  Refunded,
}

#[contracttype]
#[derive(Clone)]
pub struct Order {
  pub id: u64,
  pub buyer: Address,
  pub supplier: Address,
  pub shipper: Address,
  pub inspector: Address,
  pub amount: i128,
  pub status: OrderStatus,
  pub created_at: u64,
}

/* ─── Storage keys ─── */

#[contracttype]
pub enum DataKey {
  OrderCount,
  Order(u64),
  EscrowContract,
}

/* ─── Contract ─── */

#[contract]
pub struct OrderContract;

#[contractimpl]
impl OrderContract {
  /// Initialize with the authorized escrow vault contract address.
  pub fn initialize(env: Env, escrow_contract: Address) {
    env.storage().instance().set(&DataKey::OrderCount, &0u64);
    env.storage()
      .instance()
      .set(&DataKey::EscrowContract, &escrow_contract);
    env.events().publish(("order_contract", "initialized"), true);
  }

  /// Create a new supply chain order.
  pub fn create_order(
    env: Env,
    buyer: Address,
    supplier: Address,
    shipper: Address,
    inspector: Address,
    amount: i128,
  ) -> u64 {
    buyer.require_auth();

    let count: u64 = env
      .storage()
      .instance()
      .get(&DataKey::OrderCount)
      .unwrap_or(0);
    let order_id = count + 1;

    let order = Order {
      id: order_id,
      buyer,
      supplier,
      shipper,
      inspector,
      amount,
      status: OrderStatus::Created,
      created_at: env.ledger().sequence().into(),
    };

    env.storage()
      .instance()
      .set(&DataKey::Order(order_id), &order);
    env.storage()
      .instance()
      .set(&DataKey::OrderCount, &order_id);

    env.events()
      .publish(("order", "created"), (order_id, amount));

    order_id
  }

  /// Mark the order as funded.
  /// Must only be called by the authorized Escrow Contract.
  pub fn mark_funded(env: Env, order_id: u64) {
    let escrow_contract: Address = env
      .storage()
      .instance()
      .get(&DataKey::EscrowContract)
      .unwrap();

    // Verify authentication from the Escrow Contract
    escrow_contract.require_auth();

    let mut order: Order = env
      .storage()
      .instance()
      .get(&DataKey::Order(order_id))
      .unwrap();

    if order.status != OrderStatus::Created {
      panic!("Order cannot be funded in this state");
    }

    order.status = OrderStatus::Funded;
    env.storage()
      .instance()
      .set(&DataKey::Order(order_id), &order);

    env.events().publish(("order", "funded"), order_id);
  }

  /// Log shipment of goods.
  /// Must be called by the designated shipper.
  pub fn ship_order(env: Env, shipper: Address, order_id: u64) {
    shipper.require_auth();

    let mut order: Order = env
      .storage()
      .instance()
      .get(&DataKey::Order(order_id))
      .unwrap();

    if order.shipper != shipper {
      panic!("Not authorized shipper");
    }
    if order.status != OrderStatus::Funded {
      panic!("Order must be funded to ship");
    }

    order.status = OrderStatus::Shipped;
    env.storage()
      .instance()
      .set(&DataKey::Order(order_id), &order);

    env.events().publish(("order", "shipped"), order_id);
  }

  /// Log delivery of goods.
  /// Must be called by the designated shipper.
  pub fn deliver_order(env: Env, shipper: Address, order_id: u64) {
    shipper.require_auth();

    let mut order: Order = env
      .storage()
      .instance()
      .get(&DataKey::Order(order_id))
      .unwrap();

    if order.shipper != shipper {
      panic!("Not authorized shipper");
    }
    if order.status != OrderStatus::Shipped {
      panic!("Order must be shipped to deliver");
    }

    order.status = OrderStatus::Delivered;
    env.storage()
      .instance()
      .set(&DataKey::Order(order_id), &order);

    env.events().publish(("order", "delivered"), order_id);
  }

  /// Inspect order goods and decide whether to pass or fail quality inspection.
  /// Must be called by the designated inspector.
  pub fn inspect_order(env: Env, inspector: Address, order_id: u64, passed: bool) {
    inspector.require_auth();

    let mut order: Order = env
      .storage()
      .instance()
      .get(&DataKey::Order(order_id))
      .unwrap();

    if order.inspector != inspector {
      panic!("Not authorized inspector");
    }
    if order.status != OrderStatus::Delivered {
      panic!("Order must be delivered before inspection");
    }

    let escrow_contract: Address = env
      .storage()
      .instance()
      .get(&DataKey::EscrowContract)
      .unwrap();

    if passed {
      order.status = OrderStatus::InspectedPassed;

      // Make a cross-contract call to the Escrow contract to release payment to the supplier
      env.invoke_contract::<()>(
        &escrow_contract,
        &Symbol::new(&env, "release_payment"),
        (order_id, order.supplier.clone(), order.amount).into_val(&env),
      );
      env.events().publish(("order", "inspection_passed"), order_id);
    } else {
      order.status = OrderStatus::InspectedFailed;
      env.events().publish(("order", "inspection_failed"), order_id);
    }

    env.storage()
      .instance()
      .set(&DataKey::Order(order_id), &order);
  }

  /// Buyer requests refund for failed/disputed orders.
  pub fn refund_order(env: Env, buyer: Address, order_id: u64) {
    buyer.require_auth();

    let mut order: Order = env
      .storage()
      .instance()
      .get(&DataKey::Order(order_id))
      .unwrap();

    if order.buyer != buyer {
      panic!("Not authorized buyer");
    }
    if order.status != OrderStatus::InspectedFailed {
      panic!("Refund only allowed if order inspection failed");
    }

    let escrow_contract: Address = env
      .storage()
      .instance()
      .get(&DataKey::EscrowContract)
      .unwrap();

    order.status = OrderStatus::Refunded;
    env.storage()
      .instance()
      .set(&DataKey::Order(order_id), &order);

    // Call escrow to return funds to buyer
    env.invoke_contract::<()>(
      &escrow_contract,
      &Symbol::new(&env, "refund_payment"),
      (order_id, buyer.clone()).into_val(&env),
    );

    env.events().publish(("order", "refunded"), order_id);
  }

  /* ─── Read functions ─── */

  pub fn get_order(env: Env, order_id: u64) -> Order {
    env.storage()
      .instance()
      .get(&DataKey::Order(order_id))
      .unwrap()
  }

  pub fn get_order_count(env: Env) -> u64 {
    env.storage()
      .instance()
      .get(&DataKey::OrderCount)
      .unwrap_or(0)
  }
}

mod test;


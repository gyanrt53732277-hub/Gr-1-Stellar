#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[contract]
struct DummyOrderContract;

#[contractimpl]
impl DummyOrderContract {
  pub fn mark_funded(_env: Env, _order_id: u64) {}
}

fn setup_env() -> (Env, Address, Address) {
  let env = Env::default();
  env.mock_all_auths();

  let contract_id = env.register(EscrowContract, ());
  let client = EscrowContractClient::new(&env, &contract_id);

  let order_contract = Address::generate(&env);
  client.initialize(&order_contract);

  (env, contract_id, order_contract)
}

#[test]
fn test_deposit() {
  let (env, contract_id, _order_contract) = setup_env();
  let client = EscrowContractClient::new(&env, &contract_id);
  let buyer = Address::generate(&env);

  let real_dummy_id = env.register(DummyOrderContract, ());
  // Re-initialize client with the real mock contract ID to prevent invoke errors
  client.initialize(&real_dummy_id);

  client.deposit(&buyer, &1, &1000_0000000);

  let deposit = client.get_escrow(&1);
  assert_eq!(deposit.amount, 1000_0000000);
  assert!(deposit.is_active);
  assert_eq!(client.get_total_escrowed(), 1000_0000000);
}


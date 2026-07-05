#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

fn setup_env() -> (Env, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(FinanceContract, ());
    let client = FinanceContractClient::new(&env, &contract_id);
    client.initialize(&10000_0000000); // 10,000 units of initial pool balance

    (env, contract_id)
}

#[test]
fn test_loan_request() {
    let (env, contract_id) = setup_env();
    let client = FinanceContractClient::new(&env, &contract_id);

    let supplier = Address::generate(&env);
    let order_id = 42u64;
    let loan_amount = 1000_0000000;

    let loan_id = client.request_loan(&supplier, &order_id, &loan_amount);

    assert_eq!(loan_id, 1);
    assert_eq!(client.get_loan_count(), 1);

    let loan = client.get_loan(&loan_id);
    assert_eq!(loan.borrower, supplier);
    assert_eq!(loan.order_id, order_id);
    assert_eq!(loan.principal, loan_amount);
    assert_eq!(loan.interest, 50_0000000); // 5% of 1000
    assert_eq!(loan.repaid, false);

    assert_eq!(client.get_pool_balance(), 9000_0000000);
}

#[test]
fn test_loan_repayment() {
    let (env, contract_id) = setup_env();
    let client = FinanceContractClient::new(&env, &contract_id);

    let supplier = Address::generate(&env);
    let order_id = 42u64;
    let loan_amount = 1000_0000000;

    let loan_id = client.request_loan(&supplier, &order_id, &loan_amount);

    client.repay_loan(&supplier, &loan_id);

    let loan = client.get_loan(&loan_id);
    assert_eq!(loan.repaid, true);

    // Initial 10k - 1k loan + 1.05k repayment = 10.05k
    assert_eq!(client.get_pool_balance(), 10050_0000000);
}

#[test]
#[should_panic(expected = "Insufficient pool liquidity")]
fn test_insufficient_liquidity() {
    let (env, contract_id) = setup_env();
    let client = FinanceContractClient::new(&env, &contract_id);

    let supplier = Address::generate(&env);
    client.request_loan(&supplier, &1u64, &20000_0000000);
}

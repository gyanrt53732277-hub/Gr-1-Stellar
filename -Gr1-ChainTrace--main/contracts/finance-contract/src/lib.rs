#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

/* ─── Types ─── */

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct Loan {
    pub id: u64,
    pub borrower: Address,
    pub order_id: u64,
    pub principal: i128,
    pub interest: i128,
    pub repaid: bool,
}

/* ─── Storage keys ─── */

#[contracttype]
pub enum DataKey {
    LoanCount,
    Loan(u64),
    PoolBalance,
}

/* ─── Contract ─── */

#[contract]
pub struct FinanceContract;

#[contractimpl]
impl FinanceContract {
    /// Initialize the finance contract with initial mock pool liquidity.
    pub fn initialize(env: Env, initial_liquidity: i128) {
        env.storage().instance().set(&DataKey::LoanCount, &0u64);
        env.storage().instance().set(&DataKey::PoolBalance, &initial_liquidity);
        env.events().publish(("finance_contract", "initialized"), initial_liquidity);
    }

    /// Request trade financing / factoring.
    /// Suppliers borrow against their locked order escrow.
    pub fn request_loan(env: Env, borrower: Address, order_id: u64, amount: i128) -> u64 {
        borrower.require_auth();

        let pool_balance: i128 = env
            .storage()
            .instance()
            .get(&DataKey::PoolBalance)
            .unwrap_or(0);

        if amount > pool_balance {
            panic!("Insufficient pool liquidity");
        }

        let count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::LoanCount)
            .unwrap_or(0);
        let loan_id = count + 1;

        // Interest rate is fixed at 5% of the principal for simplicity
        let interest = amount * 5 / 100;

        let loan = Loan {
            id: loan_id,
            borrower: borrower.clone(),
            order_id,
            principal: amount,
            interest,
            repaid: false,
        };

        env.storage().instance().set(&DataKey::Loan(loan_id), &loan);
        env.storage().instance().set(&DataKey::LoanCount, &loan_id);
        env.storage().instance().set(&DataKey::PoolBalance, &(pool_balance - amount));

        env.events().publish(("loan", "created"), (loan_id, borrower, amount));

        loan_id
    }

    /// Repay the loan when the escrow completes.
    pub fn repay_loan(env: Env, borrower: Address, loan_id: u64) {
        borrower.require_auth();

        let mut loan: Loan = env
            .storage()
            .instance()
            .get(&DataKey::Loan(loan_id))
            .expect("Loan not found");

        if loan.borrower != borrower {
            panic!("Not authorized borrower");
        }

        if loan.repaid {
            panic!("Loan already repaid");
        }

        loan.repaid = true;
        let repayment_amount = loan.principal + loan.interest;

        let pool_balance: i128 = env
            .storage()
            .instance()
            .get(&DataKey::PoolBalance)
            .unwrap_or(0);

        env.storage().instance().set(&DataKey::Loan(loan_id), &loan);
        env.storage().instance().set(&DataKey::PoolBalance, &(pool_balance + repayment_amount));

        env.events().publish(("loan", "repaid"), (loan_id, borrower, repayment_amount));
    }

    /* ─── Read functions ─── */

    pub fn get_loan(env: Env, loan_id: u64) -> Loan {
        env.storage()
            .instance()
            .get(&DataKey::Loan(loan_id))
            .expect("Loan not found")
    }

    pub fn get_pool_balance(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::PoolBalance)
            .unwrap_or(0)
    }

    pub fn get_loan_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::LoanCount)
            .unwrap_or(0)
    }
}

mod test;

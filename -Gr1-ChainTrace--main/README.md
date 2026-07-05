# ⚡ ChainTrace

<div align="center">

**Cross-Border Supply Chain Milestone Escrow & Financing**

*Trustless trade coordination and payments secured by Stellar Soroban smart contracts*

[![Live Demo](https://img.shields.io/badge/Live_Demo-chain--trace.netlify.app-6366f1?style=for-the-badge&logo=netlify)](https://chain-trace.netlify.app/)
[![GitHub](https://img.shields.io/badge/Source_Code-BhagatWeb%2F--ChainTrace---181717?style=for-the-badge&logo=github)](https://github.com/BhagatWeb/-ChainTrace-)
[![Network](https://img.shields.io/badge/Network-Stellar_Testnet-00B4D8?style=for-the-badge&logo=stellar)](https://stellar.expert/explorer/testnet)
[![Built for RiseIn](https://img.shields.io/badge/Built_for-RiseIn_Level_4-f59e0b?style=for-the-badge)](https://www.risein.com/)

</div>

---

## 📋 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [Why Stellar?](#-why-stellar)
3. [Live Deployment](#-live-deployment)
4. [Contract Addresses & Transactions](#-contract-addresses--transactions)
5. [User Onboarding & Feedback](#-user-onboarding--feedback)
6. [Architecture](#-architecture)
7. [Smart Contracts](#-smart-contracts)
8. [Production Hardening (Level 4)](#-production-hardening-level-4)
9. [Tech Stack](#-tech-stack)
10. [Project Structure](#-project-structure)
11. [Testing](#-testing)
12. [CI/CD Pipeline](#-cicd-pipeline)
13. [Local Development](#-local-development)
14. [Roadmap](#-roadmap)

---

## 🔴 Problem Statement

Cross-border supply chains suffer from severe counterparty risks, operational opacity, and working capital deficits that disproportionately harm SMEs.

| Issue | Impact |
|-------|--------|
| **Lack of Payment Security** | Suppliers fear shipping goods without advance payments, while Buyers fear losing funds to untrusted shipments. |
| **Coarse-Grained Payouts** | Rigid payment terms (Letters of Credit) prevent incremental payouts that match real-world logistics progress. |
| **Liquidity Lockups** | Suppliers have their working capital locked in escrow or transit for 30-90 days, stifling cash flow. |
| **Opaque Disputes** | If goods are damaged or misrouted, funds get locked up indefinitely due to a lack of transparent state resolution. |

**ChainTrace** eliminates these inefficiencies by replacing legacy trade finance rails with programmable Soroban smart contracts. Buyers lock funds in an on-chain escrow vault; funds are automatically released to suppliers incrementally based on verifiable logistics milestones—no costly banking intermediaries required.

---

## 🌟 Why Stellar?

ChainTrace relies on Stellar's unique network architecture to facilitate real-world global trade:

| Stellar Property | ChainTrace Benefit |
|-----------------|-------------------|
| **~5 second finality** | Suppliers receive instant payouts upon milestone completion instead of waiting days. |
| **Sub-cent fees ($0.00001)** | Enables micro-milestones and multi-party sign-offs without prohibitive gas costs. |
| **Soroban Inter-Contract Calls** | Our Order Contract securely commands the Escrow Vault Contract atomically on-chain. |
| **SEP Anchor Integrations** | SEP-24 and SEP-31 standards act as native fiat ramps, allowing buyers to fund in USD and suppliers to off-ramp directly to local currencies (MXN, BRL, EUR). |
| **Asset Issuance** | Seamless integration with digital USD (USDC) and Euro (EURC) for stable trade settlement. |

---

## 🌐 Live Deployment

| Resource | Link |
|----------|------|
| 🌍 **Live dApp** | [chain-trace.netlify.app](https://chain-trace.netlify.app/) |
| 🎬 **Demo Video** | [Google Drive — Walkthrough Recording](https://drive.google.com/file/d/1ZwH7PVVpRn0xglDTZJ7jcAVxRAkEZkoe/view?usp=sharing) |
| 💻 **GitHub Repo** | [BhagatWeb/-ChainTrace-](https://github.com/BhagatWeb/-ChainTrace-) |
| 📋 **User Feedback Form** | [ChainTrace Feedback — Google Forms](https://forms.gle/jNKFMPF2CB2uar19A) |
| 📊 **Onboarded Users & Wallet Interactions** | [Responses Spreadsheet — Google Sheets](https://docs.google.com/spreadsheets/d/1RA8W76kNOyhn0DUy0bQUQ-9Ps4AQBOqWaXPDa4aq9Aw/edit?resourcekey=&gid=1409244994#gid=1409244994) |

---

## 🔗 Contract Addresses & Transactions

All contracts are deployed and cross-initialized on the **Stellar Testnet**.

### Deployed Contract IDs

| Contract | Address |
|----------|---------|
| **Order Manager Contract** | `CB56DGFX43XUXN2OASKM3SF6I3WWNYUM6KE7HKUKX3JSLZPYQSRQXOHH` |
| **Escrow Vault Contract** | `CBAFHUW7TL73RG4KYSL53ZF4N4NCJK76KXL3NHKEDDWE2GPVHA52LJ47` |

### On-Chain Deployment Transactions

| Action | Transaction Hash |
|--------|-----------------|
| **Cross-linked Initialization** | [`7fb488cc...16ccb21`](https://stellar.expert/explorer/testnet/tx/7fb488cc3a32f6b3e7ff7de9ef652a921d743a129de9d28bc9ef2816ccb21f3a) |

---

## 👥 User Onboarding & Feedback

As part of the Level 4 production MVP requirements, we onboarded real users to validate the complete escrow lifecycle on the Stellar Testnet.

**Onboarding Journey:**

```
1. User installs Freighter/Albedo Wallet → Funds testnet account
2. Buyer creates an order with logistics milestones on ChainTrace
3. Buyer funds the on-chain escrow (Wallet signs; atomic ICC updates order status)
4. Logistics Provider marks cargo as shipped
5. Inspector clears customs and approves the milestone
6. Order ICCs Escrow → Payment is automatically released to Supplier
7. User submits feedback via the Google Form
```

| Resource | Link |
|----------|------|
| 📋 **Feedback Form** | [Submit Feedback](https://forms.gle/jNKFMPF2CB2uar19A) |
| 📊 **User Responses & Wallet Proof** | [View Spreadsheet](https://docs.google.com/spreadsheets/d/1RA8W76kNOyhn0DUy0bQUQ-9Ps4AQBOqWaXPDa4aq9Aw/edit?resourcekey=&gid=1409244994#gid=1409244994) |

---

## 🏗️ Architecture

ChainTrace is composed of dual Soroban smart contracts that communicate via Inter-Contract Calls (ICC), and a Next.js frontend that builds and submits signed Stellar transactions.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Next.js Frontend                             │
│                                                                     │
│  Landing │ Dashboard │ Analytics │ Order Details │ Direct Transfer  │
│                      StellarWalletsKit                              │
│                  (Freighter / xBull / Albedo)                       │
└──────────────────┬─────────────────────────────┬───────────────────┘
                   │ TypeScript Contract Clients  │
          ┌────────▼─────────┐         ┌─────────▼────────┐
          │  Order Contract  │──ICC──→ │ Escrow Contract  │
          │                  │         │                  │
          │  create_order()  │         │  deposit()       │
          │  update_         │         │  release_        │
          │    milestone()   │         │    funds()       │
          │  dispute()       │         │  refund()        │
          │  complete_       │         │                  │
          │    order()       │         │                  │
          └──────────────────┘         └──────────────────┘
                            Stellar Testnet
```

### Inter-Contract Communication (ICC) Flow

The ICC design securely isolates trade logic from capital custody. The Escrow Vault only moves funds when instructed by the state-machine inside the Order Contract.

```
Step 1:  Buyer calls create_order()        → Order created with status: Created
Step 2:  Buyer calls deposit()             → Escrow locks XLM
                                             Escrow ICCs → Order (marks Funded)
Step 3:  Logistics calls update_milestone()→ Order status transitions (Shipped, etc)
Step 4:  Inspector approves milestone      → Order ICCs → Escrow release_funds()
                                             Supplier receives XLM instantly
Step 5:  Buyer calls dispute()             → Order status: Disputed
                                             Funds locked until manual resolution
```

---

## 📜 Smart Contracts

### Order Manager Contract (`CB56DGFX43XUXN2OASKM3SF6I3WWNYUM6KE7HKUKX3JSLZPYQSRQXOHH`)

Manages the lifecycle, logistics tracking, and role-based access control for the supply chain.

| Function | Access | Description |
|----------|--------|-------------|
| `create_order()` | Buyer | Initialize a new trade order with milestones and roles |
| `update_milestone()`| Logistics/Inspector| Progress the state machine (Shipped -> Clear -> Delivered) |
| `dispute()` | Buyer/Supplier | Flag the shipment for manual resolution |
| `complete_order()` | Inspector | Finalize the trade and trigger remaining ICC payouts |

### Escrow Vault Contract (`CBAFHUW7TL73RG4KYSL53ZF4N4NCJK76KXL3NHKEDDWE2GPVHA52LJ47`)

Holds XLM/USDC in a secure vault and releases it only on instruction from the Order Contract.

| Function | Access | Description |
|----------|--------|-------------|
| `deposit()` | Buyer | Lock capital for a specific trade order |
| `release_funds()`| Order Contract only| Transfer partial/full amount to supplier |
| `refund()` | Order Contract only| Return remaining locked funds to the buyer |

---

## 🛡️ Production Hardening (Level 4)

The following production improvements were implemented and tested in Level 4:

### Frontend Production Quality & Monitoring

| Feature | Description |
|---------|-------------|
| **Vercel Analytics & Speed Insights** | Integrated `@vercel/analytics` directly into `app/layout.tsx` for live user metrics and web vitals tracking. |
| **System Telemetry Dashboard** | Built `/dashboard/analytics` to monitor simulated wallet events, transaction success rates, and contract invocations. |
| **Mobile-First UX** | Completely overhauled the landing page to feature a highly responsive, asymmetric Bento Grid layout for mobile parity. |
| **Global Error Handling** | Integrated `react-hot-toast` for unified, graceful error and loading states across all wallet and transaction flows. |
| **DeFi Factoring Integration** | Initial architecture added for collateralized loans (`finance-contract`), tracked in the telemetry dashboard. |

---

## 📸 Submission Screenshots

### 🖥️ Desktop Web UI (Clean Monochromatic Redesign)

<p align="center">
  <img src="./sub%20assets/ui1.png" width="45%" alt="Desktop UI 1" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./sub%20assets/ui2.png" width="45%" alt="Desktop UI 2" />
</p>
<p align="center">
  <img src="./sub%20assets/ui3.png" width="45%" alt="Desktop UI 3" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./sub%20assets/ui4.png" width="45%" alt="Desktop UI 4" />
</p>

### 📱 Mobile Responsive UI

<p align="center">
  <img src="./sub%20assets/mobui1.png" width="375" alt="Mobile UI Screenshot 1" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./sub%20assets/mobui2.png" width="375" alt="Mobile UI Screenshot 2" />
</p>

### 📊 System Telemetry & Live Analytics Dashboard

<p align="center">
  <img src="./sub%20assets/analytics.png" alt="Analytics Dashboard" />
</p>

### 🔄 CI/CD Pipeline

<p align="center">
  <img src="./sub%20assets/cicdss.png" alt="CI/CD Pipeline Run" />
</p>

---

## 🧪 Testing

### Test Summary

| Suite | Tests | Status |
|-------|-------|--------|
| Frontend (Vitest) | 12 tests | ✅ All Passing |
| Contracts (Rust) | 6 tests | ✅ All Passing |
| **Total** | **18 tests** | ✅ **18/18 Passing** |

### Frontend Tests (Vitest)

```bash
npm run test

 ✓ __tests__/components/Badge.test.tsx 
 ✓ __tests__/components/Button.test.tsx 
 ✓ __tests__/lib/stellar.test.ts 
 
 Test Files  3 passed (3)
      Tests  12 passed (12)
```

### Contract Tests (Rust)

```bash
# Order Contract
test test::test_create_order ... ok
test test::test_order_lifecycle ... ok

# Escrow Contract
test test::test_deposit ... ok

# Finance Contract (Factoring Module)
test test::test_insufficient_liquidity - should panic ... ok
test test::test_loan_request ... ok
test test::test_loan_repayment ... ok
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | Next.js 14 (App Router) | SSR, file-based routing, production builds |
| **Styling** | Tailwind CSS | Utility-first CSS with custom monochromatic theme |
| **Smart Contracts** | Soroban (Rust SDK) | On-chain logistics tracking and escrow logic |
| **Blockchain SDK** | `@stellar/stellar-sdk` | Transaction building, XDR encoding, RPC calls |
| **Wallet Integration** | `stellar-wallets-kit` | Freighter, xBull, and Albedo multi-wallet support |
| **Testing** | Vitest + Cargo test | Unit and component testing across stack |
| **Monitoring** | Vercel Analytics | Production telemetry and web vitals |

---

## 📁 Project Structure

```
ChainTrace/
├── .github/
│   └── workflows/
│       └── ci.yml                    # Automated tests and builds on push
├── app/                              # Next.js App Router pages
│   ├── page.tsx                      # Landing page — bento grid, stats
│   ├── orders/
│   │   └── [id]/page.tsx             # Details & milestones for specific trades
│   ├── dashboard/
│   │   ├── page.tsx                  # Connect wallet & overview
│   │   └── analytics/page.tsx        # System telemetry dashboard
│   ├── transfer/page.tsx             # Direct P2P transfer module
│   └── layout.tsx                    # Root layout with Vercel Analytics injects
├── components/
│   ├── layout/                       # Navbar, Footer
│   └── ui/                           # Reusable UI components (Aurora, HelixButton)
├── contracts/                        # Rust Smart Contracts
│   ├── order-contract/
│   ├── escrow-contract/
│   └── finance-contract/
├── lib/
│   └── stellar.ts                    # Wallet connection, transaction formatting
└── package.json
```

---

## 🔄 CI/CD Pipeline

### Continuous Integration (`ci.yml`)

Triggered automatically on every push to `main`.

```
Push to main
     │
     ├── Frontend Job
     │     ├── npm install
     │     ├── npm run lint
     │     ├── npm run test      ← Vitest suite
     │     └── npm run build     ← Next.js production build validation
     │
     └── Contract Job
           ├── cargo build --target wasm32-unknown-unknown
           └── cargo test        ← Rust smart contract tests
```

---

## 🚀 Local Development

### Prerequisites

- **Node.js** 18+ or 20+
- **Rust** (with `wasm32-unknown-unknown` target)
- **Freighter Wallet** browser extension

### Installation

```bash
# Clone the repository
git clone https://github.com/BhagatWeb/-ChainTrace-.git
cd -ChainTrace-

# Install frontend dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

Edit `.env.local` with your contract IDs:

```env
NEXT_PUBLIC_ESCROW_CONTRACT_ID=CBAFHUW7TL73RG4KYSL53ZF4N4NCJK76KXL3NHKEDDWE2GPVHA52LJ47
NEXT_PUBLIC_ORDER_CONTRACT_ID=CB56DGFX43XUXN2OASKM3SF6I3WWNYUM6KE7HKUKX3JSLZPYQSRQXOHH
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
```

```bash
# Start development server
npm run dev
# → http://localhost:3000
```

---

## 🗺️ Roadmap

### ✅ Level 3 (Complete)
- Dual Soroban smart contracts with Inter-Contract Communication
- Next.js 14 frontend with multi-wallet support
- Milestone-based escrow lifecycle
- CI/CD pipelines and comprehensive test suites

### ✅ Level 4 (Complete)
- Production-grade frontend with premium UI (Helix design system)
- Mobile Responsive layouts using customized Tailwind breakpoints
- Proper loading states and unified error handling (`react-hot-toast`)
- Vercel Analytics integration for production monitoring
- System Telemetry dashboard for tracking wallet connections
- 10+ real users onboarded with wallet proofs

### 🔜 Future Enhancements
- Deploy the `finance-contract` factoring module to Mainnet.
- Integrated dispute resolution voting system.
- SEP-31 native integrations for off-ramping to fiat directly in the dashboard.

---

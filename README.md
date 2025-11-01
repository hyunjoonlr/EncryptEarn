# EncryptEarn

> A privacy-preserving payroll management system powered by Fully Homomorphic Encryption (FHE) on blockchain

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.27-blue)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-19.1.1-61dafb)](https://reactjs.org/)
[![Hardhat](https://img.shields.io/badge/Built%20with-Hardhat-yellow)](https://hardhat.org/)

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Advantages](#advantages)
- [Problems Solved](#problems-solved)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Smart Contracts](#smart-contracts)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Deployment](#deployment)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
  - [Recording Salary](#recording-salary)
  - [Claiming Salary](#claiming-salary)
  - [Decrypting Balances](#decrypting-balances)
  - [CLI Tasks](#cli-tasks)
- [Testing](#testing)
- [Security Considerations](#security-considerations)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Introduction

**EncryptEarn** is a groundbreaking decentralized payroll management system that leverages **Fully Homomorphic Encryption (FHE)** to provide unprecedented privacy for salary and compensation data on the blockchain. Unlike traditional blockchain applications where all data is publicly visible, EncryptEarn ensures that sensitive payroll information remains completely confidential while maintaining the transparency, immutability, and auditability benefits of blockchain technology.

Built on the Ethereum Sepolia testnet and powered by [Zama's fhEVM](https://www.zama.ai/fhevm), EncryptEarn demonstrates how cutting-edge cryptographic techniques can enable real-world business applications on public blockchains without compromising user privacy.

### What Makes EncryptEarn Unique?

- **Privacy-First**: All salary amounts and token balances are encrypted on-chain using FHE, ensuring only authorized users can decrypt their own data
- **Computation on Encrypted Data**: Smart contracts can perform arithmetic operations (additions, transfers, etc.) directly on encrypted values without decryption
- **Confidential Token Standard**: Implements ERC7984, the emerging standard for confidential tokens with encrypted balances
- **User-Controlled Decryption**: Cryptographic access control ensures only the data owner can decrypt their sensitive information
- **Transparent Yet Private**: Maintains blockchain's auditability while protecting individual financial privacy

---

## Key Features

### Smart Contract Features

#### 1. Confidential Payroll Management
- **Record Salaries**: Store encrypted salary amounts on-chain with cryptographic proof validation
- **Accumulate Earnings**: Automatically accumulate multiple salary payments in encrypted form
- **Claim Mechanism**: Convert pending encrypted salary into confidential USDT tokens
- **View Functions**: Query encrypted salary data with proper access control

#### 2. Confidential Token (ERC7984USDT)
- **Encrypted Balances**: All token balances stored as encrypted 64-bit unsigned integers
- **Confidential Transfers**: Transfer tokens without revealing amounts to anyone except sender and receiver
- **Minting Control**: Only authorized payroll contract can mint tokens
- **Standard Compliance**: Implements ERC7984 confidential token standard

### Frontend Application Features

- **Wallet Integration**: Seamless connection with Ethereum wallets via RainbowKit
- **Salary Recording**: User-friendly interface to encrypt and record salary locally before blockchain submission
- **Salary Claiming**: One-click claiming of pending salary with automatic cUSDT minting
- **Balance Decryption**: Decrypt and view your confidential token balance using your private key
- **Salary Overview**: Decrypt and view both pending and total recorded salary amounts
- **Real-time Updates**: Automatic data refresh when wallet connects or transactions complete
- **Modern UI**: Clean, responsive interface built with React and TypeScript

---

## Advantages

### 1. **Unprecedented Privacy**
Traditional blockchain applications expose all financial data publicly. EncryptEarn uses FHE to encrypt data end-to-end:
- Salary amounts never exposed in plaintext on-chain
- Only authorized users can decrypt their own data
- Even blockchain validators cannot see actual values
- Privacy guarantees backed by cryptography, not just access controls

### 2. **Regulatory Compliance**
Helps organizations comply with data privacy regulations:
- GDPR compliance through data minimization and privacy-by-design
- Financial data protection aligns with banking secrecy requirements
- Audit trails maintained without exposing sensitive details
- Granular access control for compliance reporting

### 3. **Business Adoption**
Removes key barriers to enterprise blockchain adoption:
- Companies can use public blockchains without exposing competitive salary data
- Payroll transparency for employees without public disclosure
- Multi-organization payroll systems become viable
- Enables HR analytics on encrypted data

### 4. **Security Through Cryptography**
Superior to traditional private key or role-based access control:
- Encryption happens client-side before data leaves user's device
- Zero-knowledge proofs validate inputs without revealing values
- Access Control Lists (ACL) enforced cryptographically
- No single point of failure for data access

### 5. **Computational Flexibility**
FHE enables operations on encrypted data:
- Add salaries, transfer tokens without decryption
- Complex business logic on confidential data
- Future support for encrypted deductions, bonuses, calculations
- Preserves privacy throughout entire computation pipeline

### 6. **User Sovereignty**
Users maintain complete control:
- Private keys never leave user's device
- Self-sovereign decryption (no trusted third party required)
- Cannot be forced to reveal data without private key
- Cryptographic guarantees of data ownership

### 7. **Transparency and Auditability**
Privacy without sacrificing blockchain benefits:
- Transaction history immutable and verifiable
- Smart contract logic open source and auditable
- Compliance checks possible with authorized access
- Trust minimization through code transparency

---

## Problems Solved

### Problem 1: **Public Blockchain Privacy Paradox**
**Challenge**: Public blockchains like Ethereum make all data visible to everyone, making them unsuitable for sensitive business applications like payroll.

**Solution**: EncryptEarn uses Fully Homomorphic Encryption to store and process encrypted data on-chain. Salary amounts, balances, and transfers remain encrypted, solving the privacy paradox while maintaining blockchain's transparency benefits.

---

### Problem 2: **Salary Data Exposure**
**Challenge**: Employees and employers need privacy for compensation data. Traditional systems require trusting centralized databases, which can be hacked or misused.

**Solution**: End-to-end encryption ensures salary data is encrypted before leaving the user's device and remains encrypted on-chain. Only the employee with the correct private key can decrypt their salary information, eliminating centralized trust.

---

### Problem 3: **Regulatory Barriers to Blockchain Adoption**
**Challenge**: Regulations like GDPR, CCPA, and financial data protection laws prevent many organizations from using public blockchains due to data exposure concerns.

**Solution**: EncryptEarn provides cryptographic privacy guarantees that align with regulatory requirements. Organizations can leverage blockchain's benefits (immutability, transparency, decentralization) while complying with data privacy laws.

---

### Problem 4: **Limited Enterprise Blockchain Use Cases**
**Challenge**: Private/permissioned blockchains are often used for business applications, sacrificing decentralization and public auditability.

**Solution**: FHE technology enables enterprise-grade applications on public blockchains. Payroll, accounting, and other sensitive business processes can run on Ethereum without data exposure, expanding blockchain's business applications.

---

### Problem 5: **Access Control Vulnerabilities**
**Challenge**: Traditional access control systems (role-based, permission lists) can be bypassed through hacks, insider threats, or vulnerabilities.

**Solution**: Cryptographic access control via FHE and ACLs ensures data can only be accessed by authorized parties, even if the underlying smart contract or blockchain is compromised. Encryption keys, not permissions, determine access.

---

### Problem 6: **Lack of Confidential Token Standards**
**Challenge**: No established standards for tokens with encrypted balances, limiting interoperability and adoption.

**Solution**: EncryptEarn implements ERC7984, an emerging standard for confidential tokens. This provides a blueprint for privacy-preserving DeFi applications and establishes patterns for future development.

---

### Problem 7: **Trust in Payroll Processors**
**Challenge**: Traditional payroll requires trusting third-party processors with sensitive employee and company financial data.

**Solution**: Smart contract-based payroll is trustless and transparent. Anyone can verify the contract logic, no intermediary has access to unencrypted data, and execution is guaranteed by blockchain consensus.

---

### Problem 8: **Complex Privacy Infrastructure**
**Challenge**: Implementing privacy-preserving systems traditionally requires complex zero-knowledge circuits, multi-party computation, or trusted execution environments.

**Solution**: Zama's fhEVM provides a developer-friendly framework for FHE. EncryptEarn demonstrates that privacy-preserving applications can be built with familiar tools (Solidity, React, Hardhat) without specialized cryptography expertise.

---

## Technologies Used

### Blockchain & Smart Contracts

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Solidity** | ^0.8.27 | Smart contract programming language |
| **Hardhat** | Latest | Ethereum development environment |
| **fhEVM (Zama)** | Latest | Fully Homomorphic Encryption library for Solidity |
| **@fhevm/solidity** | ^0.8.0 | FHE operations and encrypted data types |
| **@openzeppelin/confidential-contracts** | ^0.3.0-rc.0 | ERC7984 confidential token implementation |
| **Ethereum Sepolia** | Testnet | Deployment network (Chain ID: 11155111) |
| **Zama Gateway Chain** | Chain ID: 55815 | FHE infrastructure (KMS, relayer, oracle) |

### Frontend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | ^19.1.1 | UI framework |
| **TypeScript** | ~5.8.3 | Type-safe development |
| **Vite** | ^7.1.6 | Build tool and development server |
| **Wagmi** | ^2.17.0 | React hooks for Ethereum |
| **Viem** | ^2.37.6 | TypeScript Ethereum library (read operations) |
| **Ethers.js** | ^6.15.0 | Web3 library (write operations) |
| **RainbowKit** | ^2.2.8 | Wallet connection UI |
| **@zama-fhe/relayer-sdk** | ^0.3.0-2 | Client-side encryption and decryption |
| **TailwindCSS** | ^3.4.17 | Utility-first CSS framework |

### Development & Testing

| Technology | Purpose |
|-----------|---------|
| **Hardhat Deploy** | Deployment management and automation |
| **TypeChain** | Generate TypeScript bindings from ABIs |
| **Mocha & Chai** | Testing framework |
| **ESLint & Prettier** | Code quality and formatting |
| **Solhint** | Solidity linting |
| **@nomicfoundation/hardhat-toolbox** | Hardhat plugin suite |

### Cryptography & Privacy

- **Fully Homomorphic Encryption (FHE)**: Enable computation on encrypted data
- **Zero-Knowledge Proofs**: Validate encrypted inputs without revealing values
- **Access Control Lists (ACL)**: Cryptographic permissions for data decryption
- **EIP-712**: Typed data signing for secure relayer communication
- **TFHE (Torus FHE)**: Fast fully homomorphic encryption library by Zama

---

## Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                              │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  React Application (TypeScript)                                │  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │  │
│  │  │ Salary Recording │  │ Salary Claiming  │  │  Decryption  │ │  │
│  │  │     Component    │  │    Component     │  │  Component   │ │  │
│  │  └──────────────────┘  └──────────────────┘  └──────────────┘ │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                              ↕                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Zama Relayer SDK                                             │   │
│  │  • encrypt(amount) → encrypted input + proof                  │   │
│  │  • decrypt(handle, userKey) → plaintext value                 │   │
│  │  • generateKeypair() → public/private keys                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ↕                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Web3 Libraries (Wagmi + Ethers + RainbowKit)                │   │
│  │  • Wallet connection                                          │   │
│  │  • Transaction signing                                        │   │
│  │  • Smart contract interaction                                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                              ↕
┌──────────────────────────────────────────────────────────────────────┐
│                    ETHEREUM SEPOLIA TESTNET                           │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  ConfidentialPayroll Contract                                  │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │ Functions:                                                │ │  │
│  │  │ • recordSalary(encryptedInput, proof)                    │ │  │
│  │  │   → Validates proof via InputVerifier                    │ │  │
│  │  │   → Stores encrypted euint64 in _salaries mapping        │ │  │
│  │  │   → Grants ACL permissions                               │ │  │
│  │  │                                                           │ │  │
│  │  │ • claimSalary()                                          │ │  │
│  │  │   → Reads pending salary (encrypted)                     │ │  │
│  │  │   → Mints cUSDT with encrypted amount                    │ │  │
│  │  │   → Resets pending to 0                                  │ │  │
│  │  │                                                           │ │  │
│  │  │ • getSalary(address)                                     │ │  │
│  │  │   → Returns (pending, totalRecorded) as euint64          │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                                                                 │  │
│  │  Storage:                                                       │  │
│  │  mapping(address => Salary) _salaries                          │  │
│  │  struct Salary {                                                │  │
│  │    euint64 pending;       // Unclaimed encrypted salary        │  │
│  │    euint64 totalRecorded; // Lifetime encrypted total          │  │
│  │  }                                                              │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                              ↕                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  ERC7984USDT Token Contract (Confidential Token)               │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │ Functions:                                                │ │  │
│  │  │ • mintEncrypted(to, encryptedAmount)                     │ │  │
│  │  │   → Only callable by authorized minter (payroll)         │ │  │
│  │  │   → Adds encrypted amount to balance                     │ │  │
│  │  │                                                           │ │  │
│  │  │ • confidentialTransfer(to, encryptedAmount, proof)       │ │  │
│  │  │   → Validates encrypted input proof                      │ │  │
│  │  │   → Deducts from sender, adds to receiver (encrypted)    │ │  │
│  │  │                                                           │ │  │
│  │  │ • confidentialBalanceOf(address)                         │ │  │
│  │  │   → Returns encrypted balance (euint64)                  │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                                                                 │  │
│  │  Storage:                                                       │  │
│  │  mapping(address => euint64) balances                          │  │
│  │  address public minter (the payroll contract)                  │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                              ↕
┌──────────────────────────────────────────────────────────────────────┐
│              ZAMA FHE INFRASTRUCTURE (Gateway Chain)                  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  InputVerifier Contract                                        │  │
│  │  • Validates zero-knowledge proofs for encrypted inputs        │  │
│  │  • Ensures user actually encrypted the data they claim         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  ACL (Access Control List) Contract                           │  │
│  │  • Manages cryptographic permissions for data decryption      │  │
│  │  • allow(handle, address) grants decryption rights            │  │
│  │  • Enforces who can decrypt which encrypted values            │  │
│  └────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  KMS (Key Management Service)                                 │  │
│  │  • Manages FHE public/private keys                            │  │
│  │  • Re-encrypts data for authorized users                      │  │
│  │  • Handles threshold decryption for authorized access         │  │
│  └────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Relayer Service (https://relayer.testnet.zama.cloud)        │  │
│  │  • Provides encryption/decryption API for clients             │  │
│  │  • Validates EIP-712 signatures                               │  │
│  │  • Coordinates with KMS for re-encryption                     │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Data Flow

#### 1. Recording Salary

```
User inputs salary amount (e.g., 5000 USDT)
         ↓
Relayer SDK encrypts locally: encrypt(5000) → {encryptedData, proof}
         ↓
User signs transaction with encrypted data + proof
         ↓
ConfidentialPayroll.recordSalary(encryptedData, proof)
         ↓
InputVerifier validates proof (user actually encrypted this data)
         ↓
FHE.fromExternal() converts to euint64
         ↓
Contract adds to existing pending: pending = pending + newAmount (homomorphic addition)
         ↓
Contract adds to totalRecorded: totalRecorded = totalRecorded + newAmount
         ↓
ACL.allow(pending, user) - grant user decryption permission
ACL.allow(pending, contract) - grant contract computation permission
         ↓
Encrypted salary stored on-chain (no one can see actual value)
```

#### 2. Claiming Salary

```
User calls claimSalary()
         ↓
Contract reads _salaries[msg.sender].pending (still encrypted)
         ↓
Contract calls cUSDT.mintEncrypted(msg.sender, pending)
         ↓
Token contract adds encrypted amount to user's balance
         ↓
Payroll contract sets pending = 0 (encrypted zero)
         ↓
User's cUSDT balance increases (encrypted), pending salary reset
```

#### 3. Decrypting Balance

```
User requests balance decryption
         ↓
Frontend fetches encrypted balance handle from contract
         ↓
Relayer SDK generates temporary keypair
         ↓
User signs EIP-712 message proving ownership
         ↓
Relayer validates signature and checks ACL permissions
         ↓
KMS re-encrypts balance under user's temporary public key
         ↓
Relayer returns re-encrypted data to client
         ↓
Client decrypts with temporary private key → plaintext balance
         ↓
Display: "Your balance: 5000 cUSDT"
```

---

## Smart Contracts

### ConfidentialPayroll.sol

**Purpose**: Manages encrypted payroll records and salary claims.

**Key Functions**:

```solidity
function recordSalary(
    externalEuint64 memory encryptedAmount,
    bytes calldata inputProof
) public
```
- Records encrypted salary for `msg.sender`
- Validates proof via InputVerifier
- Accumulates into `pending` and `totalRecorded`
- Grants ACL permissions

```solidity
function claimSalary() public
```
- Claims all pending encrypted salary
- Mints equivalent cUSDT tokens
- Resets pending to zero

```solidity
function getSalary(address user) public view returns (euint64, euint64)
```
- Returns `(pending, totalRecorded)` as encrypted values
- Requires ACL permission to decrypt

**Storage**:
```solidity
struct Salary {
    euint64 pending;       // Unclaimed salary
    euint64 totalRecorded; // Lifetime total
}
mapping(address => Salary) private _salaries;
```

---

### ERC7984USDT.sol

**Purpose**: Confidential USDT token with encrypted balances.

**Key Functions**:

```solidity
function mintEncrypted(address to, euint64 amount) public onlyMinter
```
- Mints encrypted token amount
- Only callable by authorized minter (payroll contract)

```solidity
function confidentialTransfer(
    address to,
    externalEuint64 memory encryptedAmount,
    bytes calldata inputProof
) public returns (bool)
```
- Transfers encrypted amount from sender to receiver
- Validates proof and checks sufficient balance
- Both balances remain encrypted

```solidity
function confidentialBalanceOf(address account) public view returns (euint64)
```
- Returns encrypted balance
- Requires ACL permission to decrypt

```solidity
function setMinter(address _minter) public onlyOwner
```
- Sets authorized minter address
- Called during deployment to authorize payroll contract

**Storage**:
```solidity
mapping(address => euint64) private _balances;
address public minter;
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: >= 18.x
- **npm** or **yarn**: Latest version
- **Git**: For cloning the repository
- **MetaMask** or compatible Ethereum wallet

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/EncryptEarn.git
   cd EncryptEarn
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd app
   npm install
   cd ..
   ```

### Configuration

1. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Configure `.env`**:
   ```env
   # Deployment private key (DO NOT commit to version control)
   PRIVATE_KEY=your_private_key_here

   # Infura API key for Sepolia
   INFURA_API_KEY=your_infura_api_key

   # Optional: Etherscan API key for contract verification
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```

3. **Configure frontend** (`app/.env`):
   ```env
   VITE_PAYROLL_ADDRESS=<deployed_payroll_contract_address>
   VITE_TOKEN_ADDRESS=<deployed_token_contract_address>
   ```

### Deployment

#### 1. Compile Contracts

```bash
npx hardhat compile
```

#### 2. Run Tests

```bash
npx hardhat test
```

Expected output:
```
  ConfidentialPayroll
    ✓ Should deploy contracts (1234ms)
    ✓ Should record salary (2345ms)
    ✓ Should accumulate multiple salaries (3456ms)
    ✓ Should claim salary and mint cUSDT (4567ms)
    ✓ Should decrypt salary data (5678ms)
    ✓ Should decrypt cUSDT balance (6789ms)
```

#### 3. Deploy to Sepolia

```bash
npx hardhat deploy --network sepolia
```

Expected output:
```
Deploying contracts with account: 0x...
ERC7984USDT deployed to: 0x...
ConfidentialPayroll deployed to: 0x...
Setting payroll contract as minter...
Deployment complete!
```

#### 4. Update Frontend Config

Copy the deployed contract addresses to `app/.env`:
```env
VITE_PAYROLL_ADDRESS=0x... # ConfidentialPayroll address
VITE_TOKEN_ADDRESS=0x...   # ERC7984USDT address
```

### Running the Application

1. **Start the frontend development server**:
   ```bash
   cd app
   npm run dev
   ```

2. **Open your browser**:
   ```
   http://localhost:5173
   ```

3. **Connect your wallet**:
   - Click "Connect Wallet"
   - Select MetaMask (or your preferred wallet)
   - Switch to Sepolia network if prompted
   - Approve connection

---

## Usage

### Recording Salary

1. **Navigate to the application** in your browser
2. **Connect your wallet** to Sepolia network
3. **Enter salary amount** in the "Record Salary" input field (e.g., `5000`)
4. **Click "Record Salary"**
   - Application encrypts the amount locally using Zama Relayer SDK
   - Generates zero-knowledge proof
   - Prompts wallet to sign transaction
5. **Confirm transaction** in your wallet
6. **Wait for confirmation** (usually 15-30 seconds on Sepolia)
7. **Success**: Your encrypted salary is now recorded on-chain

**Behind the scenes**:
- Amount encrypted to: `euint64(encrypted_data)`
- Stored in: `_salaries[your_address].pending`
- No one (including blockchain validators) can see the actual amount

### Claiming Salary

1. **Click "Claim Salary" button**
2. **Confirm transaction** in your wallet
3. **Wait for confirmation**
4. **Success**: Your pending salary is converted to cUSDT tokens

**What happens**:
- Pending encrypted salary → encrypted cUSDT balance
- Pending salary reset to 0
- cUSDT minted to your address (amount remains encrypted)

### Decrypting Balances

#### Decrypt Salary Information

1. **Click "Decrypt Salary"**
2. **Sign EIP-712 message** in your wallet (no gas fee)
3. **View decrypted values**:
   - Pending Salary: `X.XX USDT`
   - Total Recorded: `Y.YY USDT`

#### Decrypt cUSDT Balance

1. **Click "Decrypt Balance"**
2. **Sign EIP-712 message** in your wallet
3. **View decrypted balance**: `Z.ZZ cUSDT`

**Privacy note**: Decryption happens entirely on your device. Your private key never leaves your browser, and the plaintext value is never transmitted over the network.

### CLI Tasks

EncryptEarn includes Hardhat tasks for command-line interaction:

#### View Contract Addresses

```bash
npx hardhat task:payroll-address --network sepolia
```

#### Record Salary via CLI

```bash
npx hardhat task:record-salary --amount 5000 --network sepolia
```

#### Claim Salary via CLI

```bash
npx hardhat task:claim-salary --network sepolia
```

#### Decrypt Salary via CLI

```bash
npx hardhat task:decrypt-salary --network sepolia
```

#### Decrypt Balance via CLI

```bash
npx hardhat task:decrypt-balance --network sepolia
```

---

## Testing

### Local Testing

Run the full test suite:
```bash
npx hardhat test
```

### Test Coverage

Generate coverage report:
```bash
npx hardhat coverage
```

### Test Structure

Tests are located in `test/ConfidentialPayroll.ts` and cover:

1. **Deployment Tests**
   - Contract initialization
   - Token minter authorization
   - Initial state verification

2. **Salary Recording Tests**
   - Single salary recording
   - Multiple salary accumulation
   - Encrypted input validation
   - ACL permission granting

3. **Salary Claiming Tests**
   - Pending salary claiming
   - cUSDT minting
   - Balance updates
   - Pending reset to zero

4. **Decryption Tests**
   - User decryption of salary data
   - Balance decryption
   - Permission verification

5. **Integration Tests**
   - End-to-end workflow: record → claim → decrypt
   - Multiple users
   - Edge cases (zero amounts, multiple claims)

### Running Specific Tests

```bash
# Run only deployment tests
npx hardhat test --grep "deployment"

# Run only salary recording tests
npx hardhat test --grep "record"

# Run only decryption tests
npx hardhat test --grep "decrypt"
```

---

## Security Considerations

### Smart Contract Security

1. **Access Control**
   - Only authorized minter can mint cUSDT tokens
   - Owner-only functions protected with `onlyOwner` modifier
   - ACL permissions carefully managed

2. **Input Validation**
   - All encrypted inputs validated with zero-knowledge proofs
   - InputVerifier ensures data integrity
   - Protection against malicious encrypted data

3. **Reentrancy Protection**
   - State updates before external calls
   - No reentrancy vulnerabilities in current implementation
   - Consider using OpenZeppelin's `ReentrancyGuard` for future enhancements

4. **Integer Overflow/Underflow**
   - Solidity 0.8.x built-in overflow protection
   - FHE operations maintain encrypted bounds

### Privacy & Cryptography

1. **End-to-End Encryption**
   - Data encrypted client-side before blockchain submission
   - Private keys never leave user's device
   - Decryption happens locally

2. **Zero-Knowledge Proofs**
   - Prove knowledge of encrypted values without revealing them
   - Prevents fake encrypted inputs
   - Validated by InputVerifier contract

3. **Access Control Lists**
   - Cryptographic permissions enforced by KMS
   - Fine-grained control over who can decrypt what
   - Cannot be bypassed even with smart contract vulnerabilities

4. **Key Management**
   - Zama's KMS manages threshold keys
   - Decentralized key generation (testnet)
   - Future: fully decentralized key management

### Known Limitations

1. **Testnet Only**: Currently deployed on Sepolia testnet. Mainnet deployment requires:
   - Full security audit
   - Zama mainnet infrastructure availability
   - Gas optimization

2. **Performance**: FHE operations are computationally expensive:
   - Higher gas costs than plaintext operations
   - Slower execution times
   - Trade-off between privacy and efficiency

3. **Decryption Trust**: Currently relies on Zama's relayer and KMS:
   - Testnet KMS is semi-centralized
   - Mainnet will have improved decentralization
   - Users must trust Zama's infrastructure

4. **Browser Dependency**: Decryption requires browser with Relayer SDK:
   - Cannot decrypt in pure server environments
   - Requires MetaMask or compatible wallet

### Best Practices

1. **Never commit private keys** to version control
2. **Use hardware wallets** for mainnet deployment
3. **Audit smart contracts** before production use
4. **Test thoroughly** on testnet before mainnet
5. **Monitor gas costs** for FHE operations
6. **Keep dependencies updated** for security patches
7. **Use multi-sig wallets** for contract ownership
8. **Implement timelocks** for sensitive operations

---

## Future Roadmap

### Phase 1: Current Features ✅
- [x] Basic confidential payroll recording
- [x] Salary claiming with cUSDT minting
- [x] Client-side encryption/decryption
- [x] React frontend with wallet integration
- [x] Sepolia testnet deployment

### Phase 2: Enhanced Payroll Features
- [ ] Multi-token support (BTC, ETH, DAI, USDC)
- [ ] Scheduled payments (automated recurring salary)
- [ ] Partial claims (claim specific amounts)
- [ ] Salary history with timestamps
- [ ] Bulk payments (employer dashboard)
- [ ] Payment streaming (real-time salary accrual)

### Phase 3: Advanced Privacy Features
- [ ] Confidential deductions (taxes, insurance, retirement)
- [ ] Encrypted bonuses
- [ ] Private salary comparisons (ZK proofs)
- [ ] Confidential payroll analytics
- [ ] Multi-party computation
- [ ] Homomorphic compliance checks

### Phase 4: DeFi Integration
- [ ] Confidential lending (encrypted salary as collateral)
- [ ] Private credit scoring
- [ ] Encrypted yield farming
- [ ] Confidential DEX
- [ ] Privacy-preserving staking
- [ ] Cross-chain confidential bridges

### Phase 5: Enterprise Features
- [ ] Organization dashboard
- [ ] Role-based access control
- [ ] Confidential invoicing
- [ ] Encrypted expense management
- [ ] Compliance reporting
- [ ] HR system integration APIs

### Phase 6: Scalability & Performance
- [ ] Layer 2 deployment
- [ ] Gas optimization
- [ ] Batch processing
- [ ] State channels
- [ ] Rollup integration

### Phase 7: Decentralization & Security
- [ ] Mainnet deployment
- [ ] Professional security audits
- [ ] Bug bounty program
- [ ] Decentralized KMS
- [ ] DAO governance
- [ ] Multi-sig treasury

### Phase 8: User Experience
- [ ] Mobile app (iOS/Android)
- [ ] Browser extension
- [ ] Email notifications
- [ ] Fiat on/off ramps
- [ ] Multi-language support
- [ ] Accessibility improvements

---

## Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. **Report bugs**: Open issues for any bugs you find
2. **Suggest features**: Share ideas for new functionality
3. **Improve documentation**: Fix typos, add examples, clarify explanations
4. **Write tests**: Increase test coverage
5. **Code contributions**: Submit pull requests for bug fixes or features
6. **Review pull requests**: Help review community contributions
7. **Share feedback**: Tell us how you're using EncryptEarn

### Contribution Guidelines

1. **Fork the repository** and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** with clear, descriptive commits:
   ```bash
   git commit -m "Add: encrypted bonus payment feature"
   ```

3. **Test thoroughly**:
   ```bash
   npm test
   npm run lint
   ```

4. **Update documentation** if needed

5. **Submit a pull request** with:
   - Clear description of changes
   - Motivation and context
   - Screenshots (for UI changes)
   - Test results

### Code Style

- **Solidity**: Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- **TypeScript**: Use ESLint and Prettier (configured in project)
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/)
- **Comments**: Document complex logic and FHE operations

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

### Technologies & Frameworks

- **[Zama](https://www.zama.ai/)**: For pioneering fully homomorphic encryption and fhEVM
- **[Ethereum](https://ethereum.org/)**: For the underlying blockchain infrastructure
- **[Hardhat](https://hardhat.org/)**: For excellent smart contract development tools
- **[OpenZeppelin](https://www.openzeppelin.com/)**: For secure smart contract libraries
- **[Rainbow](https://www.rainbow.me/)**: For beautiful wallet connection UI
- **[Viem & Wagmi](https://viem.sh/)**: For modern TypeScript Ethereum libraries

### Inspiration

- **Confidential EVM**: Breakthrough research in on-chain privacy
- **ERC7984**: Emerging standard for confidential tokens
- **Privacy Tech**: Zero-knowledge proofs, MPC, FHE research community
- **DeFi**: Decentralized finance innovation and composability

### Special Thanks

- All contributors who have helped improve this project
- The Ethereum and FHE research communities
- Early testers and feedback providers
- Open-source developers worldwide

---

## Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/EncryptEarn/issues)
- **Documentation**: See [docs/](docs/) folder
- **Zama Community**: [Discord](https://discord.gg/zama)

---

## Disclaimer

**Important Notice**:

1. **Experimental Technology**: EncryptEarn is built on cutting-edge FHE technology that is still under active development. Use at your own risk.

2. **Testnet Only**: Current deployment is on Sepolia testnet. Do NOT use for production payroll with real funds.

3. **Not Financial Advice**: This software is for educational and demonstration purposes. Consult legal and financial professionals before using for actual payroll.

4. **No Warranty**: Provided "as is" without warranty of any kind. See LICENSE for details.

5. **Security Audits**: Smart contracts have NOT been professionally audited. A full security audit is required before mainnet deployment.

6. **Regulatory Compliance**: Users are responsible for compliance with local laws regarding cryptocurrency, payroll, taxes, and data privacy.

7. **Privacy Limitations**: While FHE provides strong privacy guarantees, no system is 100% secure. Understand the threat model before use.

---

<div align="center">

**Built with privacy in mind for a decentralized future**

[Star us on GitHub](https://github.com/yourusername/EncryptEarn) | [Read the Docs](docs/) | [Join Community](https://discord.gg/zama)

</div>

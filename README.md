# 🐚 Shell

**Shell** is a native, zero-jargon security layer and SDK designed to be embedded directly into the transaction signing pipeline of top-tier Solana wallets (like Phantom, Solflare, and Backpack). 

Rather than functioning as a standalone app, Shell is a **feature layer**. It acts as an autonomous background guard inside the user's active wallet—intercepting transactions before they hit the blockchain, scanning for hidden scams, and locking out malicious activity the moment a user steps away.

This repository hosts the **Interactive Shell SDK Sandbox**, allowing wallet engineering teams to simulate attacks and visualize how Shell's security hooks protect user assets natively inside the signing flow.

---

## How It Integrates (The Wallet Architecture)

Shell is built to be modular. Wallet developers can integrate it directly into their existing client-side architecture:

```
[dApp Transaction Request] 
         │
         ▼
 ┌───────────────┐
 │ Wallet Client │
 └───────┬───────┘
         │  (Intercept Hook)
         ▼
 ┌───────────────┐
 │   Shell SDK   │ ───► Heuristic Scanner (Mimic Match & Bad Links)
 └───────┬───────┘ ───► Dynamic User State (Away Mode Check)
         │         ───► Rule Engine (10+ SOL Limit PIN challenge)
         ▼
[User Authorization (Sign/Reject)]
```

### 1. The Signing Pipeline Intercept
Shell plugs into the wallet's transaction pre-flight handler. Every time a dApp requests a signature, Shell decodes the transaction instructions client-side to inspect the destination, amount, and contract interaction details.

### 2. Live Inactivity Detection (Away Mode)
If a user toggles **Away Mode** in their wallet settings, Shell sets a local state flag. Any background signing request (from rogue browser extensions or silent script-injection attacks) is blocked instantly before reaching the user confirmation screen.

### 3. Heuristic & AI Recipient Check
Shell runs local regex-based address matching to detect **Mimic Addresses** (addresses created to match the first and last letters of the user's safe contacts list). For advanced checks, it proxies metadata to a server-side intelligence filter.

### 4. Smart Limits & PIN Escalation
For standard transfers above a set limit (e.g., 10 SOL) to unverified addresses, Shell inserts an extra local PIN authentication step directly into the signing window, stopping "accidental click" drain attacks.

---

## Interactive Developer Sandbox

The React application in this repository serves as a live mock-up of how the Shell feature functions inside a wallet's UI.

### Pre-loaded Simulation Scenarios
Developers can run four representative web3 threat scenarios inside the sandbox:
* **Claim "Free Airdrop" Site**: Simulates clicking a deceptive contract-approval button -> *Outcome: Shell identifies the permission drain and stops the contract call.*
* **Mimic Address Trap**: Simulates sending funds to an address poisoned to look like your sister Alice -> *Outcome: Shell alerts the user of the fake middle-characters and blocks the transfer.*
* **Rogue App Activity**: Simulates a background program initiating a transfer while you are away -> *Outcome: Shell's active Away-Mode blocks the transaction instantly.*
* **Send to Sister Alice**: A normal safe transfer -> *Outcome: Immediate green-light and quick-dispatch.*

---

## Installation & Local Setup

To run the interactive developer sandbox locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/shell.git
   cd shell
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Add your optional GEMINI_API_KEY for advanced AI scanner checks
   ```

4. **Launch development environment:**
   ```bash
   npm run dev
   ```

---

## What Shell Is Not
* **Not another noisy security software:** Shell does not spam you with system logs, memory traces, or clinical terminology.
* **Not a separate security extension:** It is designed specifically to live inside the code of existing non-custodial wallets.

---

## Core Product Principle
> We don't complicate security with tech-speak or scary alerts. Shell provides a clean, elegant, bulletproof shield that acts as a silent native partner. Simple colors, direct outcomes, complete peace of mind.

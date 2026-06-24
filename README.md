# Shell

A modular security SDK built to sit inside the Solana wallet signing pipeline — not alongside it.

Shell intercepts transactions before they reach the blockchain, runs heuristic and on-chain checks on the destination and contract details, and blocks malicious activity silently in the background. It is designed to be embedded directly into wallet clients like Phantom, Solflare, and Backpack — not installed as a separate extension.

This repository contains the **Interactive Shell SDK Sandbox**: a developer environment for simulating attack scenarios and visualizing how Shell's security hooks behave inside a real signing flow.

---

## How it works

```
[dApp Transaction Request]
         │
         ▼
 ┌───────────────┐
 │ Wallet Client │
 └───────┬───────┘
         │  intercept hook
         ▼
 ┌───────────────┐
 │   Shell SDK   │ ──► Heuristic Scanner (mimic addresses, visual lookalikes)
 └───────┬───────┘ ──► Solana RPC (account age, zero-history, program checks)
         │         ──► Dynamic User State (Away Mode)
         │         ──► Rule Engine (PIN escalation above SOL threshold)
         ▼
[User Authorization — Sign / Reject]
```

### Signing pipeline intercept

Shell plugs into the wallet's pre-flight transaction handler. Before any signature request reaches the user, Shell decodes the transaction instructions client-side and inspects the destination address, transfer amount, and contract interaction.

### Away Mode

When a user enables Away Mode, Shell sets a local state flag. Any background signing request — from rogue browser extensions or silent script-injection attacks — is blocked before reaching the confirmation screen. State lives in memory only — nothing is persisted or sent to a server.

### Mimic address detection

Shell runs local heuristic matching against the wallet's contact list to catch **mimic addresses**: addresses engineered to share the first and last characters of a known safe address. A visual normalization filter also catches lookalike character substitutions (e.g. `AiiC` matching `AliC`).

### On-chain verification

Shell queries the Solana mainnet RPC directly to check destination accounts for zero transaction history and program account flags — two signals that don't require any external AI or third-party service.

### PIN escalation

Transfers above a configurable SOL threshold to unverified addresses trigger an inline PIN challenge, inserted directly into the signing window before the transaction can proceed.

---

## Sandbox scenarios

The sandbox ships with four pre-loaded simulations, each wired to the real Shell SDK:

| Scenario | Attack type | Shell response |
|---|---|---|
| Claim "Free Airdrop" | Deceptive contract-approval drain | Identifies permission scope and blocks the call |
| Mimic Address Trap | Poisoned address (matches Alice's first/last chars) | Flags address mismatch, blocks transfer |
| Rogue App Activity | Background transfer while user is Away | Away Mode blocks instantly |
| Send to Sister Alice | Normal transfer to verified contact | Clears immediately |

---

## Setup

```bash
git clone https://github.com/zarkbns/shell.git
cd shell
npm install
npm run dev
```

---

## Architecture

```
src/
└── lib/
    ├── shell.ts          # SDK entry point — ShellSDK class
    ├── heuristics.ts     # Local risk engine + visual normalization
    ├── solanaRpc.ts      # On-chain account verification
    └── awayMode.ts       # In-memory away state controller
server.ts                 # Express + Vite dev server
```

---

## Design scope

Shell is a feature layer, not a standalone product. It has no separate UI surface, no system tray, no notification stream. It runs inside the wallet client and surfaces only when it has something to block or escalate. Wallet engineering teams integrate it into their existing client-side architecture by importing `ShellSDK` and calling `analyzeTransaction()` inside their signing handler.

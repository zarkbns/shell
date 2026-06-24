# Shell

A modular security SDK built to sit inside the Solana wallet signing pipeline — not alongside it.

Shell intercepts transactions before they reach the blockchain, runs heuristic and AI-assisted scans on the destination and contract details, and blocks malicious activity silently in the background. It is designed to be embedded directly into wallet clients like Phantom, Solflare, and Backpack — not installed as a separate extension.

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
 │   Shell SDK   │ ──► Heuristic Scanner (mimic addresses, malicious links)
 └───────┬───────┘ ──► Dynamic User State (Away Mode check)
         │         ──► Rule Engine (PIN escalation above SOL threshold)
         ▼
[User Authorization — Sign / Reject]
```

### Signing pipeline intercept

Shell plugs into the wallet's pre-flight transaction handler. Before any signature request reaches the user, Shell decodes the transaction instructions client-side and inspects the destination address, transfer amount, and contract interaction.

### Away Mode

When a user enables Away Mode, Shell sets a local state flag. Any background signing request — from rogue browser extensions or silent script-injection attacks — is blocked before reaching the confirmation screen.

### Mimic address detection

Shell runs local regex-based matching against the user's contact list to catch **mimic addresses**: addresses engineered to share the first and last characters of a known safe address. Flagged transactions are proxied to a server-side intelligence filter for deeper inspection.

### PIN escalation

Transfers above a configurable SOL threshold to unverified addresses trigger an inline PIN challenge, inserted directly into the signing window before the transaction can proceed.

---

## Sandbox scenarios

The sandbox ships with four pre-loaded simulations:

| Scenario | Attack type | Shell response |
|---|---|---|
| Claim "Free Airdrop" | Deceptive contract-approval drain | Identifies permission scope and blocks the call |
| Mimic Address Trap | Poisoned address (matches Alice's first/last chars) | Flags address mismatch, blocks transfer |
| Rogue App Activity | Background transfer while user is Away | Away Mode blocks instantly |
| Send to Sister Alice | Normal transfer to verified contact | Clears immediately |

---

## Setup

```bash
git clone https://github.com/yourusername/shell.git
cd shell
npm install
cp .env.example .env        # add GEMINI_API_KEY for AI scanner (optional)
npm run dev
```

---

## Design scope

Shell is a feature layer, not a standalone product. It has no separate UI surface, no system tray, no notification stream. It runs inside the wallet client and surfaces only when it has something to block or escalate. Wallet engineering teams integrate it into their existing client-side architecture via the SDK hooks documented in `/docs`.

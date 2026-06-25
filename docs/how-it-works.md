# How Shell works

## The signing pipeline

Every transaction a dApp requests goes through the wallet's signing handler before the user sees a confirmation screen. Shell plugs into this handler as a pre-flight check.

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
 │   Shell SDK   │ ──► Heuristic Scanner
 └───────┬───────┘ ──► Solana RPC Verification
         │         ──► Away Mode Gate
         │         ──► PIN Escalation
         ▼
[User Authorization — Sign / Reject]
```

## Check layers

### Layer 1 — Local heuristics (instant, no network)
Shell first runs the transaction through a local engine that checks:
- Is the destination in the wallet's contact list? → safe
- Does the destination visually match a contact but with substituted characters? → mimic warning
- Is the address length outside valid Solana bounds? → invalid address flag

This layer adds zero latency. It runs entirely in memory.

### Layer 2 — Solana RPC verification (async)
If the local check passes without a definitive result, Shell queries the Solana mainnet RPC:
- Does this address have any on-chain history?
- Is this address a program account rather than a wallet?

A destination with zero history and no on-chain footprint is flagged as unverified.

### Layer 3 — Transaction decoder
For deeper inspection, Shell can deserialize the raw transaction and simulate it against mainnet before signing:
- What programs does this transaction invoke?
- Are any invoked programs outside the known safe list?
- What is the estimated fee?

This catches contract approval drains where the permission scope is buried in instruction data.

### Layer 4 — Away Mode
If the user has enabled Away Mode, all incoming signing requests are blocked instantly before reaching any other check layer. No network calls, no heuristics — immediate rejection.

### Layer 5 — PIN escalation
Transfers above the configured SOL threshold to unverified addresses trigger a PIN challenge inside the signing window before the transaction proceeds.

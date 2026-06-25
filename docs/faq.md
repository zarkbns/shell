# FAQ

## Does Shell add latency to the signing flow?
No measurable impact. Local heuristic checks run in under 1ms. The Solana RPC call is async and only fires when local checks don't produce a definitive result. The signing flow waits for Shell only if a risk signal is detected.

## What is the SDK bundle size?
Shell's core is under 8KB minified. The full bundle adds @solana/web3.js as a peer dependency — wallets already using web3.js add zero overhead.

## Does Shell store or transmit user data?
No. All checks run client-side. Contact lists are passed in at runtime and never stored by the SDK. The Solana RPC query sends only the destination address to the public mainnet endpoint — the same call your wallet already makes to check balances.

## Can Shell produce false positives?
Yes, and by design it errs on the side of caution. A new address with zero on-chain history will trigger a warning on first use. Wallet teams can tune the risk threshold and PIN escalation point via the solThreshold config to match their user base.

## Is Shell open source?
Yes. MIT licensed. Full source at https://github.com/zarkbns/shell

## What happens if the Solana RPC is down?
Shell fails safe. If the RPC call times out or errors, the SDK falls back to local heuristics only and flags the transaction as unverified rather than hard-blocking it. The user is notified but not hard-blocked.

## Can Shell be used outside of Solana wallets?
Currently Shell is built specifically for Solana. The heuristic engine and away mode are chain-agnostic, but the RPC verification and transaction decoder are Solana-specific.

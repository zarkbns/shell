# Overview

Shell is a modular security SDK built to live inside the Solana wallet signing pipeline.

It intercepts transactions before they reach the blockchain, runs heuristic and on-chain checks, and blocks malicious activity silently — without requiring users to install anything extra or change how they use their wallet.

Shell is not a browser extension. It is not a standalone app. It is a feature layer that wallet engineering teams embed directly into their existing client-side architecture.

## Who Shell is for

Shell is built for wallet engineering teams — specifically teams maintaining non-custodial Solana wallets who want to add native transaction security without building and maintaining the threat intelligence layer themselves.

## What Shell protects against

- Mimic address attacks — addresses crafted to look identical to a known contact at first glance
- Contract approval drains — dApps requesting broad token permissions buried inside a signing request
- Background signing attacks — rogue extensions or injected scripts attempting to sign while the user is idle
- Zero-history sweep wallets — fresh addresses created specifically to receive drained funds and disappear

## What Shell does not do

- Shell does not send user data to any server
- Shell does not store contact lists or transaction history
- Shell does not replace the wallet's existing signing UI
- Shell does not require a separate user account or subscription

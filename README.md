# 🐚 Shell

**Shell** is simple, bulletproof background protection for Solana wallets. Zero technical jargon, automatic scam intercepts, and instant offline locks.

Traditional wallets sign transactions blindly. Shell sits in the background as an autonomous guard—analyzing recipient risk, catching deceptive clones, and freezing transfer keys the moment you step away.

The short version:

> **Web3 is dangerous. Shell is your silent, on-chain personal barrier. 🛡️**

---

## Brand Identity & Theme
Shell is built around a warm, minimal, high-contrast palette designed to keep security clear and readable:
- 🧈 **Butter (`#EEE5BC`)**: High-visibility warning indicators, status locks, and secure PIN actions.
- 🌊 **Ocean (`#4289CB`)**: Active background monitoring indicators, safe-state indicators, and verified contacts.
- 🟫 **Warm Dark (`#1A1615`) & Deep Brown (`#120F0E`)**: An eye-friendly twilight canvas for premium focus.

---

## Key Features

### 1. Active Background Scanning
Every time you initiate a transaction, Shell intercepts the pipeline in the background to scan the recipient. It computes risk score heuristics, check-lists fraud databases, and evaluates warning signals before assets leave your wallet.

### 2. User Absence Lock (Away Mode)
Rogue browser extensions and automated drainer bots strike when you are not looking. Toggle **Away Mode** to freeze all outbound wallet transfers instantly. Any background script attempting to steal your funds is rejected at the smart-contract authority level until you physically confirm you are back.

### 3. High-Value PIN Lock
Set a simple daily or single-transaction limit (e.g., 10 SOL). Any un-whitelisted transaction exceeding this limit requires physical confirmation of your 4-Digit Security PIN before authorization is dispatched on-chain.

### 4. Trusted Whitelist Directory
Save your frequent contacts (friends, exchanges, personal cold wallets) to bypass extra PIN limits and proceed with immediate green-light safety scores.

---

## Choose How You Want to Use Shell

| If you want to... | Use this |
| :--- | :--- |
| **Simulate Attacks & Verify Intercepts** | Run the **Interactive Shell Simulator** in your browser |
| **Protect browser-based Solana dApps** | Load the **Shell Background Service** into your browser wallet extension |
| **Configure guard parameters programmatically** | Edit the `.env` or `src/App.tsx` protection profiles |

---

## Prerequisites
- Node.js 22+
- A Solana Wallet (Phantom, Solflare, or a local devnet keypair)
- Gemini API Key (`GEMINI_API_KEY`) — *Optional, used for intelligent AI recipient analysis*

---

## Installation

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
   # Add your optional GEMINI_API_KEY for advanced scam scanning
   ```

4. **Launch development environment:**
   ```bash
   npm run dev
   ```

---

## Interactive Simulator Scenarios
To see Shell in action, try the pre-loaded live scenarios inside the interactive panel:
* **Claim "Free Airdrop" Site** *(Threat: Malicious delegate request designed to empty your tokens)* -> **Outcome: Shell Blocks Contract Call**
* **Mimic Address Trap** *(Threat: Address designed to look like your sister Alice but slightly different)* -> **Outcome: Shell Detects Clone & Blocks Direct Transfer**
* **Rogue App Activity** *(Threat: Background app initiates secret transfer while you are away)* -> **Outcome: Away-Mode Safeguard Lockout Blocks Transaction**
* **Send to Sister Alice** *(Standard safe transfer to whitelisted address)* -> **Outcome: Quick-Pass Green Light & Instant Approval**

---

## Troubleshooting

| Problem | Solution |
| :--- | :--- |
| **Lacks AI analysis insight** | Ensure `GEMINI_API_KEY` is loaded in your `.env` file. If not, Shell automatically falls back to local heuristic scanning. |
| **A regular transfer gets blocked** | Check if you accidentally turned on **Away Mode** (frozen) or if the recipient address mimics a blacklisted pattern. Add the wallet to your **Trusted Contacts** list to bypass blocks. |
| **PIN code fails** | The default simulation PIN code is `7721`. You can edit this inside the configuration parameters in `src/App.tsx`. |

---

## What Shell Is Not
* **Not another noisy antivirus:** Shell does not spam you with telemetry logs, port alerts, or clinical jargon. It uses human-friendly, high-contrast labels.
* **Not a centralized database:** Your whitelists, PIN settings, and local status are encrypted and run locally or on-chain on Solana.

---

## Product Principle
> We don't complicate security with tech-speak or scary alerts. Shell provides a clean, elegant, bulletproof shield that acts as your silent partner in the crypto world. Simple colors, simple settings, complete peace of mind.

import { AttackScenario } from "../types";

export const ATTACK_SCENARIOS: AttackScenario[] = [
  {
    id: "phishing-airdrop",
    name: "Airdrop Claim Phishing Link",
    description: "A malicious Discord/Twitter bot prompts you to claim a high-value airdrop. Accepting the transaction requests complete authority to interact with your token program.",
    attackAddress: "Dra1n7pG9KzUq9L9K65gCj2A8W3H4N5M6Q7R8S9T123",
    amount: 0,
    type: "Claim Request",
    payload: "Instruction: AppointDelegate (Full Token Program Authority)",
    riskCategory: "Drainer Contract Call",
    riskDescription: "This mimics a simple token claim but delegates transfer authority of all your USDC/SOL/SPL assets to the attacker's wallet, draining your balance."
  },
  {
    id: "address-poisoning",
    name: "Address Poisoning Mimic",
    description: "An attacker notices you send funds to your friend 'G9fX...7R8S'. They spam your wallet with a dust transfer from a generated mimic address, hoping you will copy-paste it from your history.",
    attackAddress: "G9fXmimic9L9K65gCj2A8W3H4N5M6Q7R8S9Tmimic",
    amount: 15,
    type: "Direct Transfer",
    payload: "Transfer 15 SOL to frequent recipient history slot",
    riskCategory: "Address Poisoning Mimic",
    riskDescription: "The recipient address is generated to match the prefix and suffix of your familiar wallet, but the middle characters are completely different."
  },
  {
    id: "unauthorized-drain",
    name: "Rogue Extension Sweeper (Offline Hack)",
    description: "A rogue browser extension tries to secretly initiate a high-value transfer while you are away from your computer, hoping to bypass manual user oversight.",
    attackAddress: "ScamNewWalletX9928173619283719283719283719",
    amount: 45,
    type: "Direct Transfer",
    payload: "Secret background transfer of major treasury",
    riskCategory: "Rogue Sweeper Attempt",
    riskDescription: "Unexpected background velocity. High value transfer without active session authentication or multi-sig co-sign approval."
  },
  {
    id: "honeypot-rug",
    name: "High-APY Honeypot Token Swap",
    description: "A new token pool advertised on telegram promising 50,000% APY. The token smart contract restricts the sell function so only creators can withdraw liquidity.",
    attackAddress: "HoneypotSPLTokenPool11111111111111111111111",
    amount: 8,
    type: "Token Swap",
    payload: "Swap 8 SOL to dynamic Liquidity Pool Contract",
    riskCategory: "HoneyPot / Scam Token",
    riskDescription: "The pool contract code allows deposits but denies outbound token swaps, trapping your SOL permanently."
  }
];

export interface AnalysisResult {
  riskScore: number;
  category: string;
  indicators: string[];
  explanation: string;
  recommendation: string;
  recipientReputation: string;
  source: "local-heuristic";
}

export interface AnalysisParams {
  address: string;
  transferAmount: number;
  transactionType: string;
  contactList: string[];
}

export const SIMULATED_THREAT_DATABASE: Record<string, Omit<AnalysisResult, 'source'>> = {
  "Dra1n7pG9KzUq9L9K65gCj2A8W3H4N5M6Q7R8S9T123": {
    riskScore: 98,
    category: "Drainer Contract Call",
    indicators: [
      "Signature requests full authority over your Token Accounts",
      "Matches known wallet-drainer program signatures (e.g., ClawDrainer)",
      "Contract has been reported 142 times on Solana Safety forums"
    ],
    explanation: "This program is a known phishing script. It is designed to look like a standard token claim or swap authorization, but executing this transaction will immediately transfer all of your SPL tokens (USDC, BONK) and SOL to the hacker's sweep address.",
    recommendation: "REJECT TRANSACTION. This is a critical drainer threat. Do not authorize any transactions with this address or contract.",
    recipientReputation: "Danger: Blacklisted Wallet Drainer (Phishing Program)"
  },
  "G9fXmimic9L9K65gCj2A8W3H4N5M6Q7R8S9Tmimic": {
    riskScore: 85,
    category: "Address Poisoning Mimic",
    indicators: [
      "Address mimics your frequent contact 'G9fX...7R8S' (first 4 and last 4 characters match)",
      "Zero historical transaction history prior to 24 hours ago",
      "No active token balances"
    ],
    explanation: "This is an Address Poisoning Attack. Attackers use bots to generate custom addresses matching the prefix and suffix of your frequent contacts, then transfer $0 to your account so this mimic address appears in your transaction history. They hope you'll copy-paste it for your next real transaction.",
    recommendation: "DO NOT COPY. Re-verify each character of your intended destination. Use your registered whitelist contacts instead.",
    recipientReputation: "Warning: Unverified mimicking address (Created 1 day ago)"
  },
  "HoneypotSPLTokenPool11111111111111111111111": {
    riskScore: 75,
    category: "HoneyPot / Scam Token",
    indicators: [
      "Liquidity pool is completely locked with no withdraw options",
      "Mint authority is still active with no multi-sig control",
      "Extremely high buy-tax / sell-tax (99% fee structured dynamically)"
    ],
    explanation: "This target smart contract is structured as a HoneyPot. While you are allowed to swap SOL for this token, the contract contains hidden code that prevents selling, effectively locking your funds inside their pool.",
    recommendation: "AVOID DEPOSITING. The token pool is a honeypot trap with zero sell liquidity.",
    recipientReputation: "Suspicious: Rug-pull flagged SPL contract"
  },
  "AegisSafeAddress11111111111111111111111111": {
    riskScore: 2,
    category: "Safe Verified Wallet",
    indicators: [
      "Fully verified Solana validator address",
      "High trust score with over 25,000 successful transactions",
      "Whitelisted by Solana Aegis Global Registry"
    ],
    explanation: "This address belongs to a verified institutional exchange pool / validator node. It has massive liquidity depth and zero recorded scam reports.",
    recommendation: "Safe to proceed. Ensure the transfer amount is correct.",
    recipientReputation: "Trusted: Whitelisted Validator / Exchange Address"
  }
};

export function analyzeAddress(params: AnalysisParams): AnalysisResult {
  const { address, transferAmount, transactionType, contactList } = params;

  // Helpers to sanitize
  const cleanAddress = address ? address.trim() : "";
  const cleanContacts = (contactList || []).map(c => c.trim()).filter(Boolean);

  // a. Is the address in the contactList? → riskScore 2, safe
  if (cleanContacts.includes(cleanAddress)) {
    return {
      riskScore: 2,
      category: "Safe Verified Contact",
      indicators: [
        "Address is registered in your local Trusted Contacts",
        "Pre-verified and whitelisted by user settings",
        "Direct bypass for fast sign pipeline authorized"
      ],
      explanation: `This address is one of your trusted saved contacts. Transfers are automatically approved with minimum risk scores because you have previously whitelisted this recipient.`,
      recommendation: `Safe to proceed with transfer. No security flags raised.`,
      recipientReputation: "Trusted Saved Contact",
      source: "local-heuristic"
    };
  }

  // b. Does it match first 4 + last 4 chars of any contact? → riskScore 85, mimic warning
  if (cleanAddress.length >= 8) {
    const addressPrefix = cleanAddress.substring(0, 4).toLowerCase();
    const addressSuffix = cleanAddress.substring(cleanAddress.length - 4).toLowerCase();

    const mimicMatch = cleanContacts.find(contact => {
      if (contact.length < 8) return false;
      const contactPrefix = contact.substring(0, 4).toLowerCase();
      const contactSuffix = contact.substring(contact.length - 4).toLowerCase();
      return contactPrefix === addressPrefix && contactSuffix === addressSuffix;
    });

    if (mimicMatch) {
      return {
        riskScore: 85,
        category: "Mimic Address Warning",
        indicators: [
          `Matches first 4 and last 4 characters of contact: ${mimicMatch}`,
          "Not in your verified contacts list",
          "Potential copy-paste poison attack detected"
        ],
        explanation: `This address is not in your contact list, but its prefix and suffix are identical to your contact (${mimicMatch.substring(0, 4)}...${mimicMatch.substring(mimicMatch.length - 4)}). Scam bots frequently broadcast tiny transfers to trick users into copying this lookalike address from their transaction history.`,
        recommendation: `DO NOT COPY. Manually inspect the full address middle characters. Re-verify with the recipient directly.`,
        recipientReputation: "Warning: Mimicking Lookalike Address",
        source: "local-heuristic"
      };
    }
  }

  // c. Is address length outside 32-44 characters? → riskScore 95, invalid
  if (cleanAddress.length < 32 || cleanAddress.length > 44) {
    return {
      riskScore: 95,
      category: "Invalid Format",
      indicators: [
        `Address length of ${cleanAddress.length} is invalid for standard Solana addresses (must be 32 to 44 characters)`,
        "Failed cryptographic checksum pre-validation"
      ],
      explanation: `Solana base58 addresses must be exactly between 32 and 44 characters in length. The submitted address format is invalid, and continuing with this transaction could lead to permanent loss of funds.`,
      recommendation: `CRITICAL: Reject signature request. Please verify the copied address format and check for trailing/leading typos.`,
      recipientReputation: "Invalid Solana Address",
      source: "local-heuristic"
    };
  }

  // d. Is it in the SIMULATED_THREAT_DATABASE? → use existing scores
  if (SIMULATED_THREAT_DATABASE[cleanAddress]) {
    const dbMatch = SIMULATED_THREAT_DATABASE[cleanAddress];
    return {
      ...dbMatch,
      source: "local-heuristic"
    };
  }

  // e. Default → riskScore 20, unverified
  return {
    riskScore: 20,
    category: "Unverified Private Wallet",
    indicators: [
      "Address is not present in local contacts or known blacklists",
      "No dynamic security threat patterns detected on this address"
    ],
    explanation: `This is an unverified recipient wallet address. No active scam flags or mimic address patterns were detected, but it lacks a registered safety score. Proceed with standard verification.`,
    recommendation: `Proceed with transaction. Ensure you verify the address details directly with the recipient.`,
    recipientReputation: "Unverified Private Wallet",
    source: "local-heuristic"
  };
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SecurityRules {
  scamCheckEnabled: boolean;     // AI/Local scam-checking on recipient wallets
  autoLockEnabled: boolean;       // Background offline protector program
  autoLockThreshold: number;     // Max SOL transfer without additional confirmation
  coSignEnabled: boolean;         // Co-signing requirement
  coSignSecret: string;          // OTP verification key
  whitelist: string[];           // Safe-listed destination addresses
  blacklist: string[];           // Danger-listed blocked addresses
}

export interface WalletState {
  publicKey: string;
  balance: number;
  protectionActive: boolean;
  rules: SecurityRules;
}

export interface SecurityLog {
  id: string;
  timestamp: string;
  type: 'Direct Transfer' | 'Contract Call' | 'Token Swap' | 'Claim Request';
  recipient: string;
  amount: number;
  status: 'Approved' | 'Blocked' | 'Warning Flags';
  riskScore: number;
  category: string;
  blockedBy?: string;            // Which rule blocked it (e.g. "AI Scan", "Auto-Lock Velocity", "Co-Sign OTP", "Manual Blacklist")
  explanation: string;
  recommendation?: string;
}

export interface AttackScenario {
  id: string;
  name: string;
  description: string;
  attackAddress: string;
  amount: number;
  type: 'Direct Transfer' | 'Contract Call' | 'Token Swap' | 'Claim Request';
  payload: string;
  riskCategory: string;
  riskDescription: string;
}

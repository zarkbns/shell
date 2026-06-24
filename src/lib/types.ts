export interface ShellConfig {
  contactList: string[];
  solThreshold: number;
}

export interface AnalysisResult {
  blocked: boolean;
  requiresPIN: boolean;
  riskScore: number;
  reason?: string;
  indicators: string[];
  recommendation: string;
  source: string;
  category?: string;
  explanation?: string;
  recipientReputation?: string;
  details?: any;
}

export interface DecodedTransaction {
  instructions: { programId: string; accounts: string[]; dataLength: number }[];
  simulationLogs: string[];
  estimatedFee: number | null;
  containsUnknownPrograms: boolean;
  warning: string | null;
}

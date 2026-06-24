import { isAwayModeActive, setAwayMode } from "./awayMode";
import { analyzeAddress, AnalysisResult } from "./heuristics";
import { decodeTransaction } from "./transactionDecoder";

export interface ShellSDKConfig {
  contactList: string[];
  solThreshold: number;
}

export interface ShellTransactionAnalysis {
  blocked: boolean;
  reason?: string;
  requiresPIN?: boolean;
  riskScore: number;
  details?: AnalysisResult;
}

export class ShellSDK {
  private contactList: string[] = [];
  private solThreshold: number = 10;

  init(config: ShellSDKConfig): void {
    this.contactList = config.contactList || [];
    this.solThreshold = config.solThreshold !== undefined ? config.solThreshold : 10;
  }

  async decodeAndAnalyze(params: {
    serializedTransaction: string;
    encoding: "base64" | "base58";
    transferAmount: number;
    contactList: string[];
  }) {
    // Set the contactList so that analyzeTransaction can access it
    this.contactList = params.contactList || [];

    const transactionResult = await decodeTransaction({
      serializedTransaction: params.serializedTransaction,
      encoding: params.encoding
    });

    // Extract the destination address from instructions[0].accounts[1] safely
    const address = transactionResult.instructions?.[0]?.accounts?.[1] || "";

    const analysisResult = await this.analyzeTransaction({
      address,
      transferAmount: params.transferAmount,
      transactionType: "Direct Transfer" // Defaulting transaction type for analyzed target
    });

    return {
      ...transactionResult,
      ...analysisResult
    };
  }

  async analyzeTransaction(params: {
    address: string;
    transferAmount: number;
    transactionType: string;
  }): Promise<ShellTransactionAnalysis> {
    if (isAwayModeActive()) {
      return {
        blocked: true,
        reason: "Away Mode is active",
        riskScore: 100
      };
    }

    const result = await analyzeAddress({
      address: params.address,
      transferAmount: params.transferAmount,
      transactionType: params.transactionType,
      contactList: this.contactList
    });

    if (result.riskScore >= 85) {
      return {
        blocked: true,
        reason: result.explanation,
        riskScore: result.riskScore,
        details: result
      };
    }

    if (params.transferAmount > this.solThreshold && result.riskScore > 20) {
      return {
        blocked: false,
        requiresPIN: true,
        riskScore: result.riskScore,
        details: result
      };
    }

    return {
      blocked: false,
      requiresPIN: false,
      riskScore: result.riskScore,
      details: result
    };
  }

  setAwayMode(active: boolean): void {
    setAwayMode(active);
  }

  getAwayModeStatus(): boolean {
    return isAwayModeActive();
  }
}

const defaultInstance = new ShellSDK();
export default defaultInstance;

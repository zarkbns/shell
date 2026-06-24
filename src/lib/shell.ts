import { isAwayModeActive, setAwayMode } from "./awayMode";
import { analyzeAddress } from "./heuristics";
import { decodeTransaction } from "./transactionDecoder";
import { ShellConfig, AnalysisResult } from "./types";

export class ShellSDK {
  private contactList: string[] = [];
  private solThreshold: number = 10;

  init(config: ShellConfig): void {
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
  }): Promise<AnalysisResult> {
    if (isAwayModeActive()) {
      return {
        blocked: true,
        requiresPIN: false,
        riskScore: 100,
        reason: "Away Mode is active",
        indicators: ["Away Mode is active"],
        recommendation: "Turn Away Mode off in the top status bar when you are ready to make transfers.",
        source: "local-heuristic",
        category: "Blocked: Device Locked (Away Mode)",
        explanation: "Away Mode is active",
        recipientReputation: "Blocked"
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
        requiresPIN: false,
        riskScore: result.riskScore,
        reason: result.explanation,
        indicators: result.indicators,
        recommendation: result.recommendation,
        source: result.source,
        category: result.category,
        explanation: result.explanation,
        recipientReputation: result.recipientReputation,
        details: result
      };
    }

    if (params.transferAmount > this.solThreshold && result.riskScore > 20) {
      return {
        blocked: false,
        requiresPIN: true,
        riskScore: result.riskScore,
        reason: result.explanation,
        indicators: result.indicators,
        recommendation: result.recommendation,
        source: result.source,
        category: result.category,
        explanation: result.explanation,
        recipientReputation: result.recipientReputation,
        details: result
      };
    }

    return {
      blocked: false,
      requiresPIN: false,
      riskScore: result.riskScore,
      reason: result.explanation,
      indicators: result.indicators,
      recommendation: result.recommendation,
      source: result.source,
      category: result.category,
      explanation: result.explanation,
      recipientReputation: result.recipientReputation,
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

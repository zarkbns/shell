import { Transaction, Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

export interface DecodedInstruction {
  programId: string;
  accounts: string[];
  dataLength: number;
}

export interface DecodedTransactionResult {
  instructions: DecodedInstruction[];
  simulationLogs: string[];
  estimatedFee: number | null;
  containsUnknownPrograms: boolean;
  warning: string | null;
}

const KNOWN_SAFE_PROGRAMS = new Set([
  "11111111111111111111111111111111", // System Program
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", // SPL Token
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJe1bRS" // Associated Token
]);

export async function decodeTransaction(params: {
  serializedTransaction: string;
  encoding: "base64" | "base58";
}): Promise<DecodedTransactionResult> {
  const { serializedTransaction, encoding } = params;
  let warning: string | null = null;
  let instructions: DecodedInstruction[] = [];
  let simulationLogs: string[] = [];
  let estimatedFee: number | null = null;
  let containsUnknownPrograms = false;

  try {
    // 1. Deserialize the transaction
    let txBuffer: Buffer;
    if (encoding === "base64") {
      txBuffer = Buffer.from(serializedTransaction, "base64");
    } else {
      txBuffer = Buffer.from(bs58.decode(serializedTransaction));
    }

    const transaction = Transaction.from(txBuffer);

    // Map instructions
    instructions = transaction.instructions.map((inst) => {
      const progId = inst.programId.toBase58();
      if (!KNOWN_SAFE_PROGRAMS.has(progId)) {
        containsUnknownPrograms = true;
      }
      return {
        programId: progId,
        accounts: inst.keys.map((k) => k.pubkey.toBase58()),
        dataLength: inst.data ? inst.data.length : 0
      };
    });

    // 2. Connect to Solana Mainnet RPC
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

    // 3. Simulate the transaction
    try {
      const simulation = await connection.simulateTransaction(transaction);
      if (simulation.value.logs) {
        simulationLogs = simulation.value.logs;
      }
      if (simulation.value.err) {
        warning = `Simulation returned error: ${JSON.stringify(simulation.value.err)}`;
      }
    } catch (simErr: any) {
      warning = `Simulation failed: ${simErr instanceof Error ? simErr.message : String(simErr)}`;
    }

    // 4. Estimate fee
    try {
      const feeResult = await connection.getFeeForMessage(transaction.compileMessage());
      if (feeResult && feeResult.value !== null) {
        estimatedFee = feeResult.value;
      }
    } catch (feeErr) {
      // Ignore fee estimation failure, leave as null
    }

    return {
      instructions,
      simulationLogs,
      estimatedFee,
      containsUnknownPrograms,
      warning
    };

  } catch (err: any) {
    return {
      instructions: [],
      simulationLogs: [],
      estimatedFee: null,
      containsUnknownPrograms: false,
      warning: `Failed to decode transaction: ${err instanceof Error ? err.message : String(err)}`
    };
  }
}

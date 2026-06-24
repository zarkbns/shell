# Shell SDK Integration Guide

## 1. Installation

```bash
npm install shell-sdk
```

## 2. Basic Setup

Initialize the SDK instance during your wallet startup or configuration load:

```typescript
import { ShellSDK } from "shell-sdk";

ShellSDK.init({
  contactList: [
    "AliceSisterVerifiedWallet7R8S",
    "BobVerifiedWallet2Y9P"
  ],
  solThreshold: 10
});
```

## 3. Intercepting a Transaction

Implement the interceptor directly in your wallet's pre-signing transaction handler.

### Before Shell SDK Integration

```typescript
async function signTransaction(tx: Transaction): Promise<string> {
  // Directly sign and dispatch without safety checks
  const signedTx = await wallet.sign(tx);
  const signature = await connection.sendRawTransaction(signedTx.serialize());
  return signature;
}
```

### After Shell SDK Integration

```typescript
import { ShellSDK } from "shell-sdk";

async function signTransaction(tx: Transaction): Promise<string> {
  const recipientAddress = tx.instructions[0]?.keys[1]?.pubkey.toBase58() || "";
  const transferAmount = 15; // Extract transfer amount from instruction data

  // Pre-signing protection check
  const analysis = await ShellSDK.analyzeTransaction({
    address: recipientAddress,
    transferAmount: transferAmount,
    transactionType: "Direct Transfer"
  });

  if (analysis.blocked) {
    throw new Error(`Transaction Blocked: ${analysis.reason}`);
  }

  if (analysis.requiresPIN) {
    const verified = await triggerPinModal();
    if (!verified) {
      throw new Error("PIN verification failed");
    }
  }

  // Safe to sign
  const signedTx = await wallet.sign(tx);
  const signature = await connection.sendRawTransaction(signedTx.serialize());
  return signature;
}
```

## 4. Handling the Result

Structure your security handler UI depending on the analysis flags:

```typescript
const analysis = await ShellSDK.analyzeTransaction({
  address: "Dr4x..evil1",
  transferAmount: 0,
  transactionType: "Contract Approval"
});

if (analysis.blocked) {
  // 1. REJECT AND SHOW REASON
  showBlockerModal({
    title: analysis.category || "Blocked: High-Risk Action",
    description: analysis.reason || "High-risk indicator detected.",
    recommendation: analysis.recommendation
  });
  return;
}

if (analysis.requiresPIN) {
  // 2. TRIGGER PIN UI
  const pinInput = await showPinEntryScreen();
  const pinValid = await verifyPin(pinInput);
  if (!pinValid) {
    showError("Incorrect PIN.");
    return;
  }
}

// 3. PROCEED TO SIGN
await signAndSend();
```

## 5. Away Mode

Lock out transactions instantly when the user sets their device status to away:

```typescript
// Enable Away Mode
ShellSDK.setAwayMode(true);

// Read current status
const isLocked = ShellSDK.getAwayModeStatus();
```

## 6. Full Transaction Decode

For deep transaction simulation, fee estimation, and unknown program checks:

```typescript
const result = await ShellSDK.decodeAndAnalyze({
  serializedTransaction: "base64_or_base58_encoded_string",
  encoding: "base64",
  transferAmount: 12.0,
  contactList: ["AliceSisterVerifiedWallet7R8S"]
});

console.log("Instructions:", result.instructions);
console.log("Simulation Logs:", result.simulationLogs);
console.log("Contains Unknown Programs:", result.containsUnknownPrograms);
console.log("Blocked Status:", result.blocked);
```

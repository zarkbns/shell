# API Reference

## ShellSDK

The main SDK class. Import and use the default instance.

```typescript
import ShellSDK from '@shellxyz/sdk'
```

---

### ShellSDK.init(config)

Initialize Shell with wallet context. Call once when the wallet client loads.

Parameters:

| Name | Type | Description |
|---|---|---|
| contactList | string[] | Array of verified wallet addresses from the user's contact list |
| solThreshold | number | SOL amount above which unverified transfers trigger PIN escalation |

Example:
```typescript
ShellSDK.init({
  contactList: wallet.getSavedAddresses(),
  solThreshold: 10
})
```

---

### ShellSDK.analyzeTransaction(params)

Run a full security analysis on an incoming transaction. Call this inside the wallet's pre-signing handler.

Parameters:

| Name | Type | Description |
|---|---|---|
| address | string | Destination address |
| transferAmount | number | Transfer amount in SOL |
| transactionType | string | "Direct Transfer" or "Contract Approval" |

Returns: Promise<AnalysisResult>

| Field | Type | Description |
|---|---|---|
| blocked | boolean | Whether Shell is blocking this transaction |
| requiresPIN | boolean | Whether a PIN challenge should be triggered |
| riskScore | number | Risk score 0-100 |
| reason | string? | Reason for block if blocked |
| indicators | string[] | List of risk signals detected |
| recommendation | string | Suggested action |

Example:
```typescript
const result = await ShellSDK.analyzeTransaction({
  address: tx.destination,
  transferAmount: tx.amount,
  transactionType: 'Direct Transfer'
})

if (result.blocked) return wallet.reject(result.reason)
if (result.requiresPIN) return wallet.triggerPIN()
```

---

### ShellSDK.decodeAndAnalyze(params)

Deserialize and simulate a raw transaction, then run full analysis on the decoded destination.

Parameters:

| Name | Type | Description |
|---|---|---|
| serializedTransaction | string | Raw transaction in base64 or base58 |
| encoding | "base64" or "base58" | Encoding format of the serialized transaction |
| transferAmount | number | Transfer amount in SOL |
| contactList | string[] | Verified addresses to check against |

Returns: Promise<DecodedTransaction & AnalysisResult>

Example:
```typescript
const decoded = await ShellSDK.decodeAndAnalyze({
  serializedTransaction: tx.serialized,
  encoding: 'base64',
  transferAmount: tx.amount,
  contactList: wallet.contacts
})

if (decoded.containsUnknownPrograms) {
  wallet.showWarning(decoded.warning)
}
```

---

### ShellSDK.setAwayMode(active)

Enable or disable Away Mode. When active, all incoming signing requests are blocked instantly.

```typescript
ShellSDK.setAwayMode(true)   // user goes idle
ShellSDK.setAwayMode(false)  // user returns
```

---

### ShellSDK.getAwayModeStatus()

Returns the current Away Mode state as a boolean.

```typescript
const isAway = ShellSDK.getAwayModeStatus()
```

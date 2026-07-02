import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import shell from "./src/lib/shell";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
});

// API Endpoint to perform safety check on receiving address
app.post("/api/analyze-address", async (req, res) => {
  const { address, transferAmount, transactionType, contactList } = req.body;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Address is required and must be a string." });
  }

  // Initialize the Shell SDK with the parameters for this request context
  shell.init({
    contactList: Array.isArray(contactList) ? contactList : [],
    solThreshold: 10
  });

  const parsedAmount = typeof transferAmount === 'number' ? transferAmount : parseFloat(transferAmount) || 0;
  const analysisResult = await shell.analyzeTransaction({
    address,
    transferAmount: parsedAmount,
    transactionType: transactionType || "Direct Transfer"
  });

  const details = analysisResult.details || {
    riskScore: analysisResult.riskScore,
    category: "Blocked: Device Locked (Away Mode)",
    indicators: ["Away Mode is active"],
    explanation: analysisResult.reason || "Away Mode is active",
    recommendation: "Turn Away Mode off in the top status bar when you are ready to make transfers.",
    recipientReputation: "Blocked"
  };

  return res.json({
    success: true,
    analysis: {
      blocked: analysisResult.blocked,
      requiresPIN: analysisResult.requiresPIN,
      riskScore: details.riskScore,
      category: details.category,
      indicators: details.indicators,
      explanation: details.explanation,
      recommendation: details.recommendation,
      recipientReputation: details.recipientReputation
    },
    source: "local-heuristic"
  });
});

app.get("/api/away-mode/activate", (req, res) => {
  shell.setAwayMode(true);
  res.json({ success: true, active: shell.getAwayModeStatus() });
});

app.get("/api/away-mode/deactivate", (req, res) => {
  shell.setAwayMode(false);
  res.json({ success: true, active: shell.getAwayModeStatus() });
});

app.get("/api/away-mode/status", (req, res) => {
  res.json({ success: true, active: shell.getAwayModeStatus() });
});

// New endpoint for Solana transaction decoding and analysis
app.post("/api/decode-transaction", async (req, res) => {
  const { serializedTransaction, encoding, transferAmount, contactList } = req.body;

  if (!serializedTransaction || typeof serializedTransaction !== "string") {
    return res.status(400).json({ error: "serializedTransaction is required and must be a string." });
  }

  const enc = encoding === "base58" ? "base58" : "base64";
  const amount = typeof transferAmount === "number" ? transferAmount : parseFloat(transferAmount) || 0;
  const contacts = Array.isArray(contactList) ? contactList : [];

  try {
    const result = await shell.decodeAndAnalyze({
      serializedTransaction,
      encoding: enc,
      transferAmount: amount,
      contactList: contacts
    });

    return res.json({
      success: true,
      ...result
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

// Configure Vite or Static Files
async function configureViteAndStatic() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite dev server integrating as middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Production static files serving configuration...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Shell background protector server running on http://0.0.0.0:${PORT}`);
  });
}

configureViteAndStatic().catch((err) => {
  console.error("Failed to start server:", err);
});

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { analyzeAddress } from "./src/lib/heuristics";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Endpoint to perform safety check on receiving address
app.post("/api/analyze-address", async (req, res) => {
  const { address, transferAmount, transactionType, contactList } = req.body;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Address is required and must be a string." });
  }

  const result = analyzeAddress({
    address,
    transferAmount: typeof transferAmount === 'number' ? transferAmount : parseFloat(transferAmount) || 0,
    transactionType: transactionType || "Direct Transfer",
    contactList: Array.isArray(contactList) ? contactList : []
  });

  return res.json({
    success: true,
    analysis: {
      riskScore: result.riskScore,
      category: result.category,
      indicators: result.indicators,
      explanation: result.explanation,
      recommendation: result.recommendation,
      recipientReputation: result.recipientReputation
    },
    source: result.source
  });
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

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { menu } from "./menu.js";
import { processChat } from "./aiService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── GET /api/menu ────────────────────────────────────────────────────────────
app.get("/api/menu", (req, res) => {
  res.json({ success: true, data: menu });
});

// ─── POST /api/chat ───────────────────────────────────────────────────────────
// Body: { message: string, cart: CartEntry[], history: Message[] }
// CartEntry: { item: MenuItem, quantity: number }
// Message: { role: "user"|"assistant", content: string }
app.post("/api/chat", async (req, res) => {
  const { message, cart = [], history = [] } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ success: false, error: "message is required" });
  }
if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({
      success: false,
      error: "OPENROUTER_API_KEY not configured on server",
    });
  }
  try {
    const result = await processChat(message, cart, history);

    res.json({
      success: true,
      data: {
        message: result.message,
        actions: result.actions,
        // Return the raw assistant message so client can append it to history
        assistantMessage: result.assistantMessage,
      },
    });
  } catch (err) {
    console.error("[/api/chat] error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to process AI response",
      detail: err.message,
    });
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🍜 Zen Fusion Bistro backend running on http://localhost:${PORT}`);
});

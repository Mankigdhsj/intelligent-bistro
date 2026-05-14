import { menu } from "./menu.js";

const menuSummary = menu.items
  .map(
    (item) =>
      `- ${item.name} (id: "${item.id}", category: ${item.category}, price: $${item.price.toFixed(2)}, spicy: ${item.spicy})`
  )
  .join("\n");

function buildSystemPrompt(cart) {
  const cartSummary =
    cart.length === 0
      ? "The cart is currently empty."
      : cart
          .map(
            (entry) =>
              `- ${entry.item.name} x${entry.quantity} ($${(entry.item.price * entry.quantity).toFixed(2)})`
          )
          .join("\n");

  return `You are Hana, a warm and knowledgeable AI assistant for "Zen Fusion Bistro" — an upscale Asian fusion restaurant.
Your job is to help guests browse the menu and manage their order through natural conversation.

## MENU
${menuSummary}

## CURRENT CART
${cartSummary}

## YOUR TASK
Respond to the guest's message naturally and helpfully. You MUST always respond with a single valid JSON object (no markdown, no code fences, just raw JSON) in this exact format:

{
  "message": "Your conversational response here — warm, concise, helpful.",
  "actions": []
}

The "actions" array contains zero or more cart operations:

ADD_ITEM: { "type": "ADD_ITEM", "itemId": "<id from menu>", "quantity": <number> }
REMOVE_ITEM: { "type": "REMOVE_ITEM", "itemId": "<id>" }
UPDATE_QUANTITY: { "type": "UPDATE_QUANTITY", "itemId": "<id>", "quantity": <number> }
CLEAR_CART: { "type": "CLEAR_CART" }

## RULES
- Only use item IDs from the menu above. Never invent item IDs.
- If a guest asks for something not on the menu, suggest the closest available alternative.
- If ambiguous quantity, default to 1.
- Be concise — 1-3 sentences max in "message".
- Always emit valid JSON. Never include anything outside the JSON object.
- When confirming additions, mention the item name and price naturally.
- Occasionally suggest complementary items.`;
}

export async function processChat(userMessage, cart, conversationHistory) {
  const systemPrompt = buildSystemPrompt(cart);

  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    })),
    { role: "user", content: userMessage },
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3001",
      "X-Title": "Zen Fusion Bistro",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter error: ${error}`);
  }

  const data = await response.json();
  const rawText = data.choices[0].message.content;

  const cleaned = rawText.replace(/```json|```/gi, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = {
      message: "I'm sorry, I didn't quite catch that. Could you try rephrasing?",
      actions: [],
    };
  }

  return {
    message: parsed.message ?? "",
    actions: Array.isArray(parsed.actions) ? parsed.actions : [],
    assistantMessage: rawText,
  };
}
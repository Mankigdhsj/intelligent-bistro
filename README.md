# 🍜 Zen Fusion Bistro — Intelligent Bistro

> AI-powered restaurant ordering app built with React Native, Expo, and Node.js — featuring Hana, a conversational AI assistant that manages your cart through natural language.

Built as part of the **Viridien AI Full Stack Engineering Internship** challenge.

---

## 📱 Demo!
[React Native](https://img.shields.io/badge/React%20Native-Expo-blue?style=flat-square&logo=expo)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=flat-square&logo=node.js)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-purple?style=flat-square)
![Voice](https://img.shields.io/badge/Voice-Web%20Speech%20API-red?style=flat-square)
---

## 
✨ Features

🍽 Menu Browsing — 26 items across 6 categories with dietary tags and spicy indicators
🤖 AI Assistant (Hana) — Conversational AI powered by Google Gemini 1.5 Flash
🎤 Voice Input — Speak your order via Web Speech API, auto-sends to Hana
🛒 Smart Cart — Add, remove, update quantities via UI buttons AND AI/voice
💬 Structured JSON Actions — AI returns ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART
🎨 Premium Dark UI — Obsidian + gold luxury aesthetic with NativeWind
⚡ Multi-turn Conversations — Full conversation history sent to AI for context


🏗 Architecture
┌─────────────────────────────────────────────────────┐
│                  React Native App                    │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Menu    │  │  AI Chat     │  │     Cart      │  │
│  │  Screen  │  │  Screen      │  │    Screen     │  │
│  └──────────┘  └──────┬───────┘  └───────────────┘  │
│                       │  🎤 Voice / ⌨️ Text          │
│              ┌────────▼────────┐                     │
│              │  Zustand Store  │                     │
│              │ (cart+chat+menu)│                     │
│              └────────┬────────┘                     │
└───────────────────────┼─────────────────────────────┘
                        │ POST /api/chat
                        ▼
┌─────────────────────────────────────────────────────┐
│              Node.js Express Backend                 │
│                                                      │
│  • Builds system prompt with menu + cart context     │
│  • Sends to Google Gemini 1.5 Flash                  │
│  • Parses structured JSON response                   │
│                                                      │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              Google Gemini 1.5 Flash                 │
│                                                      │
│  Returns: { message, actions[] }                     │
│                                                      │
└─────────────────────────────────────────────────────┘

🤖 AI Cart Actions
json{
  "message": "Two Spicy Tuna Rolls coming right up! That'll be $30.00.",
  "actions": [
    { "type": "ADD_ITEM", "itemId": "spicy-tuna-roll", "quantity": 2 }
  ]
}
ActionDescriptionADD_ITEMAdd item with quantityREMOVE_ITEMRemove item from cartUPDATE_QUANTITYSet exact quantityCLEAR_CARTClear entire cart

🎤 Voice Ordering
Click the 🎤 mic button in the chat screen, speak your order naturally:

"Add two spicy tuna rolls and a matcha latte"

Hana transcribes, processes, and updates your cart automatically — no typing needed.

🏗 Tech Stack
LayerTechnologyFrontendReact Native + Expo SDK 51NavigationExpo Router (file-based)StateZustandStylingNativeWind (Tailwind for RN)BackendNode.js + ExpressAIGoogle Gemini 1.5 FlashVoiceWeb Speech API (Chrome)

📁 Project Structure
intelligent-bistro/
├── frontend/
│   ├── app/
│   │   ├── index.jsx        # Menu screen — browse + filter + add to cart
│   │   ├── chat.jsx         # AI chat — voice input + Hana responses
│   │   ├── cart.jsx         # Cart — quantity controls + checkout
│   │   └── _layout.jsx      # Tab navigation
│   ├── store/
│   │   └── index.js         # Zustand stores (cart, menu, chat)
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── index.js         # Express server + API routes
│   │   ├── aiService.js     # Gemini integration + prompt engineering
│   │   └── menu.js          # 26-item Asian fusion menu
│   ├── .env.example
│   └── package.json
│
└── README.md

## 👤 Author

Manju Bhargavi Gadiparthi 
[manjugadiparthi@gmail.com] | [Mankigdhsj]



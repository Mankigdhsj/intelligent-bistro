# 🍜 Zen Fusion Bistro — Intelligent Bistro

> AI-powered restaurant ordering app built with React Native, Expo, and Node.js — featuring Hana, a conversational AI assistant that manages your cart through natural language.

Built as part of the **Viridien AI Full Stack Engineering Internship** challenge.

---

## 📱 Demo

![Zen Fusion Bistro](https://img.shields.io/badge/React%20Native-Expo-blue?style=flat-square&logo=expo)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=flat-square&logo=node.js)
![AI](https://img.shields.io/badge/AI-OpenRouter%20LLM-purple?style=flat-square)

---

## ✨ Features

- 🍽 **Menu Browsing** — Full restaurant menu with categories, dietary tags (vegan, gluten-free, spicy), and prices
- 🤖 **AI Assistant (Hana)** — Conversational AI that understands natural language orders
- 🛒 **Smart Cart Management** — Add, remove, update quantities via both UI and AI
- 💬 **Structured JSON Actions** — AI returns structured cart operations (ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART)
- 📱 **Cross-platform** — Works on Android, iOS, and Web
- 🎨 **Polished Dark UI** — Premium obsidian + gold design aesthetic

---

## 🏗 Tech Stack

### Frontend
- **React Native** with **Expo** (SDK 51)
- **Expo Router** — file-based navigation
- **Zustand** — state management (cart, menu, chat stores)
- **expo-linear-gradient** — UI gradients
- **react-native-svg** — custom SVG icons
- **expo-haptics** — tactile feedback on native

### Backend
- **Node.js** with **Express**
- **OpenRouter API** — LLM inference (meta-llama/llama-3.1-8b-instruct)
- **dotenv** — environment configuration
- **cors** — cross-origin support

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Expo CLI
- Android Studio (for Android builds) or Expo Go

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/intelligent-bistro.git
cd intelligent-bistro
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
PORT=3001
```

Get a free API key at **https://openrouter.ai**

Start the backend:
```bash
node src/index.js
```

Backend runs at `http://localhost:3001`

### 3. Frontend Setup
```bash
cd frontend
npm install
npx expo start --web
```

Open `http://localhost:8081` in your browser.

### 4. Android Build (Development Build)
```bash
cd frontend
npx expo run:android
```

> Requires Java JDK 17 and Android SDK

---

## 🤖 AI Architecture

### How Hana Works

1. User sends a natural language message (e.g. *"Add 2 spicy tuna rolls"*)
2. Frontend sends message + current cart + conversation history to `/api/chat`
3. Backend builds a system prompt with the full menu and cart context
4. LLM returns structured JSON:

```json
{
  "message": "I've added 2 Spicy Tuna Rolls to your cart — that's $30.00. Would you like anything else?",
  "actions": [
    { "type": "ADD_ITEM", "itemId": "spicy-tuna-roll", "quantity": 2 }
  ]
}
```

5. Frontend applies cart actions and displays the response

### Supported Actions
| Action | Description |
|--------|-------------|
| `ADD_ITEM` | Add item to cart with quantity |
| `REMOVE_ITEM` | Remove item from cart |
| `UPDATE_QUANTITY` | Update item quantity |
| `CLEAR_CART` | Clear entire cart |

---

## 📁 Project Structure

```
intelligent-bistro/
├── frontend/
│   ├── app/
│   │   ├── index.jsx        # Menu screen
│   │   ├── chat.jsx         # AI chat screen
│   │   ├── cart.jsx         # Cart screen
│   │   └── _layout.jsx      # Tab navigation
│   ├── store/
│   │   └── index.js         # Zustand stores (cart, menu, chat)
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── index.js         # Express server + API routes
│   │   ├── aiService.js     # LLM integration + prompt engineering
│   │   └── menu.js          # Menu data
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### `GET /api/menu`
Returns the full restaurant menu with categories and items.

### `POST /api/chat`
Processes a natural language message and returns AI response with cart actions.

**Request:**
```json
{
  "message": "Add 2 spicy tuna rolls",
  "cart": [],
  "history": []
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "I've added 2 Spicy Tuna Rolls ($30.00) to your cart!",
    "actions": [
      { "type": "ADD_ITEM", "itemId": "spicy-tuna-roll", "quantity": 2 }
    ],
    "assistantMessage": "..."
  }
}
```

### `GET /api/health`
Health check endpoint.

---

## 🛠 AI Tools Used

This project was built using **Claude (Anthropic)** as the primary AI coding assistant:
- Designed prompt engineering for structured JSON cart actions
- Architected Zustand state management
- Debugged Android Gradle build issues
- Iterated on UI components and dark theme design
- Replaced icon libraries with custom SVG components

---

## 📋 Requirements Met

| Requirement | Status |
|-------------|--------|
| React Native + Expo | ✅ |
| Node.js REST API | ✅ |
| Conversational AI cart management | ✅ |
| Structured JSON responses | ✅ |
| Add/Remove/Modify cart items | ✅ |
| Visual excellence | ✅ |
| AI coding tools used | ✅ Claude |

---

## 👤 Author

Manju Bhargavi Gadiparthi 
[manjugadiparthi@gmail.comx] | [Mankigdhsj]



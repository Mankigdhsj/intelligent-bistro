import { create } from "zustand";

// ─── Types ─────────────────────────────────────────────────────────────────
// CartEntry: { item: MenuItem, quantity: number }
// ChatMessage: { id: string, role: "user"|"assistant"|"system", content: string, timestamp: Date }
// Action: { type: "ADD_ITEM"|"REMOVE_ITEM"|"UPDATE_QUANTITY"|"CLEAR_CART", itemId?: string, quantity?: number }

// ─── API Base ──────────────────────────────────────────────────────────────
const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001";

// ─── Cart Store ────────────────────────────────────────────────────────────
export const useCartStore = create((set, get) => ({
  items: [], // CartEntry[]

  addItem: (item, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((e) => e.item.id === item.id);
      if (existing) {
        return {
          items: state.items.map((e) =>
            e.item.id === item.id
              ? { ...e, quantity: e.quantity + quantity }
              : e
          ),
        };
      }
      return { items: [...state.items, { item, quantity }] };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({ items: state.items.filter((e) => e.item.id !== itemId) }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((e) =>
        e.item.id === itemId ? { ...e, quantity } : e
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  applyActions: (actions, menuItems) => {
    actions.forEach((action) => {
      switch (action.type) {
        case "ADD_ITEM": {
          const item = menuItems.find((m) => m.id === action.itemId);
          if (item) get().addItem(item, action.quantity ?? 1);
          break;
        }
        case "REMOVE_ITEM":
          get().removeItem(action.itemId);
          break;
        case "UPDATE_QUANTITY":
          get().updateQuantity(action.itemId, action.quantity ?? 1);
          break;
        case "CLEAR_CART":
          get().clearCart();
          break;
      }
    });
  },

  get total() {
    return get().items.reduce(
      (sum, e) => sum + e.item.price * e.quantity,
      0
    );
  },

  get itemCount() {
    return get().items.reduce((sum, e) => sum + e.quantity, 0);
  },
}));

// ─── Menu Store ────────────────────────────────────────────────────────────
export const useMenuStore = create((set) => ({
  items: [],
  categories: [],
  loading: false,
  error: null,

  fetchMenu: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/api/menu`);
      const json = await res.json();
      set({
        items: json.data.items,
        categories: json.data.categories,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));

// ─── Chat Store ────────────────────────────────────────────────────────────
let msgCounter = 0;
const uid = () => `msg_${++msgCounter}_${Date.now()}`;

export const useChatStore = create((set, get) => ({
  messages: [
    {
      id: uid(),
      role: "assistant",
      content:
        "Irasshaimase! 🍜 Welcome to Zen Fusion Bistro. I'm Hana, your AI host. I can take your order, suggest dishes, or answer any questions about our menu. What are you in the mood for today?",
      timestamp: new Date(),
    },
  ],
  history: [], // For Claude API - { role, content }[]
  loading: false,

  sendMessage: async (userText, cartItems, menuItems, isVoice = false) => {
    const userMsg = {
      id: uid(),
      role: "user",
      content: userText,
      timestamp: new Date(),
       isVoice,
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      loading: true,
    }));

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          cart: cartItems,
          history: get().history,
        }),
      });

      const json = await res.json();

      if (!json.success) throw new Error(json.error);

      const { message, actions, assistantMessage } = json.data;

      // Apply cart actions
      if (actions.length > 0) {
        useCartStore.getState().applyActions(actions, menuItems);
      }

      const assistantMsg = {
        id: uid(),
        role: "assistant",
        content: message,
        timestamp: new Date(),
        actions,
      };

      set((state) => ({
        messages: [...state.messages, assistantMsg],
        loading: false,
        // Append to conversation history for context
        history: [
          ...state.history,
          { role: "user", content: userText },
          { role: "assistant", content: assistantMessage },
        ].slice(-20), // keep last 20 messages to avoid token overflow
      }));
    } catch (err) {
      const errMsg = {
        id: uid(),
        role: "assistant",
        content:
          "I'm having a moment of zen... and can't connect right now. Please try again! 🙏",
        timestamp: new Date(),
        error: true,
      };
      set((state) => ({
        messages: [...state.messages, errMsg],
        loading: false,
      }));
    }
  },
}));

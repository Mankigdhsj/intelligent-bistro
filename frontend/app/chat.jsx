import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
   StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
const Haptics = {
  impactAsync: (...args) => Platform.OS !== "web" 
    ? require("expo-haptics").impactAsync(...args) 
    : Promise.resolve(),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium" },
};
import { useChatStore, useCartStore, useMenuStore } from "../store";

const C = {
  obsidian: "#0A0A0F",
  obsidianLight: "#12121A",
  obsidianCard: "#1A1A26",
  obsidianBorder: "#2A2A3E",
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  jade: "#4ECDC4",
  textPrimary: "#F0EDE8",
  textSecondary: "#8A8A9A",
  textMuted: "#4A4A6A",
};

const SUGGESTIONS = [
  "What's popular today?",
  "Add 2 spicy tuna rolls",
  "Something vegan please",
  "Clear my cart",
  "What pairs well with sake?",
  "Show me your ramen",
];

function ActionChip({ action }) {
  const label = {
    ADD_ITEM: `✚ Added`,
    REMOVE_ITEM: `✕ Removed`,
    UPDATE_QUANTITY: `↻ Updated`,
    CLEAR_CART: `🗑 Cart cleared`,
  }[action.type] || action.type;

  return (
    <View style={styles.actionChip}>
      <Text style={styles.actionChipText}>{label}</Text>
    </View>
  );
}

function ChatBubble({ message }) {
  const isUser = message.role === "user";
  const isError = message.error;

  return (
    <View style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowAI]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🍜</Text>
        </View>
      )}
      <View style={{ maxWidth: "78%", gap: 4 }}>
        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleAI,
            isError && { borderColor: "rgba(232,69,69,0.3)", borderWidth: 1 },
          ]}
        >
          <Text
            style={[
              styles.bubbleText,
              isUser ? styles.bubbleTextUser : styles.bubbleTextAI,
            ]}
          >
            {message.content}
          </Text>
        </View>

        {/* Action chips */}
        {message.actions && message.actions.length > 0 && (
          <View style={styles.actionRow}>
            {message.actions.map((a, i) => (
              <ActionChip key={i} action={a} />
            ))}
          </View>
        )}

        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
}

function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();

    animate(dot1, 0);
    animate(dot2, 160);
    animate(dot3, 320);
  }, []);

  const dotStyle = (anim) => ({
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.jade,
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -4],
        }),
      },
    ],
  });

  return (
    <View style={styles.bubbleRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>🍜</Text>
      </View>
      <View style={[styles.bubble, styles.bubbleAI, { paddingVertical: 14 }]}>
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <Animated.View style={dotStyle(dot1)} />
          <Animated.View style={dotStyle(dot2)} />
          <Animated.View style={dotStyle(dot3)} />
        </View>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { messages, loading, sendMessage } = useChatStore();
  const { items: cartItems } = useCartStore();
  const { items: menuItems } = useMenuStore();
  const [input, setInput] = useState("");
  const flatRef = useRef(null);

  useEffect(() => {
    if (flatRef.current && messages.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInput("");
    await sendMessage(text, cartItems, menuItems);
  };

  const handleSuggestion = (s) => {
    setInput(s);
  };

  const cartTotal = cartItems.reduce((s, e) => s + e.item.price * e.quantity, 0);
  const cartCount = cartItems.reduce((s, e) => s + e.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>AI ASSISTANT</Text>
          <Text style={styles.headerTitle}>Hana</Text>
        </View>
        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>
              {cartCount} item{cartCount !== 1 ? "s" : ""} · ${cartTotal.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {/* Messages */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ChatBubble message={item} />}
        ListFooterComponent={loading ? <TypingIndicator /> : null}
      />

      {/* Suggestion chips */}
      {messages.length <= 2 && !loading && (
        <View style={styles.suggestionsWrap}>
          <FlatList
            horizontal
            data={SUGGESTIONS}
            keyExtractor={(s) => s}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestion}
                onPress={() => handleSuggestion(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Input bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask Hana anything…"
            placeholderTextColor={C.textMuted}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                !input.trim() || loading
                  ? [C.obsidianBorder, C.obsidianBorder]
                  : [C.goldLight, C.gold]
              }
              style={styles.sendBtn}
            >
              {loading ? (
                <ActivityIndicator color={C.textSecondary} size="small" />
              ) : (
                <Ionicons
                  name="arrow-up"
                  size={20}
                  color={!input.trim() ? C.textMuted : C.obsidian}
                />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.obsidian },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.obsidianBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerSub: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    color: C.jade,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: -0.5,
  },
  cartBadge: {
    backgroundColor: "rgba(201,168,76,0.15)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(201,168,76,0.3)",
  },
  cartBadgeText: { fontSize: 12, fontWeight: "700", color: C.gold },

  messageList: { padding: 16, gap: 12, paddingBottom: 8 },

  bubbleRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  bubbleRowUser: { justifyContent: "flex-end" },
  bubbleRowAI: { justifyContent: "flex-start" },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.obsidianCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.obsidianBorder,
    alignSelf: "flex-end",
  },
  avatarText: { fontSize: 16 },

  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "100%",
  },
  bubbleUser: {
    backgroundColor: C.gold,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: C.obsidianCard,
    borderWidth: 1,
    borderColor: C.obsidianBorder,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextUser: { color: C.obsidian, fontWeight: "600" },
  bubbleTextAI: { color: C.textPrimary },

  actionRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  actionChip: {
    backgroundColor: "rgba(78,205,196,0.12)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(78,205,196,0.25)",
  },
  actionChipText: { fontSize: 11, color: C.jade, fontWeight: "600" },

  timestamp: { fontSize: 10, color: C.textMuted, marginLeft: 4 },

  suggestionsWrap: { paddingVertical: 10 },
  suggestion: {
    backgroundColor: C.obsidianCard,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: C.obsidianBorder,
  },
  suggestionText: { fontSize: 13, color: C.textSecondary },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: C.obsidianBorder,
    backgroundColor: C.obsidianLight,
  },
  input: {
    flex: 1,
    backgroundColor: C.obsidianCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.obsidianBorder,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: C.textPrimary,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
});

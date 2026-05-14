import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCartStore } from "../store";
import { router } from "expo-router";

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
  spicy: "#E84545",
};

const TAX_RATE = 0.0825; // 8.25% Texas

function CartItem({ entry, onAdd, onRemove, onDelete }) {
  return (
    <View style={styles.cartItem}>
      <Text style={styles.itemEmoji}>{entry.item.emoji}</Text>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{entry.item.name}</Text>
        <Text style={styles.itemPrice}>
          ${(entry.item.price * entry.quantity).toFixed(2)}{" "}
          {entry.quantity > 1 && (
            <Text style={styles.unitPrice}>
              (${entry.item.price.toFixed(2)} each)
            </Text>
          )}
        </Text>
      </View>

      <View style={styles.qtyControls}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => onRemove(entry.item.id)}>
          <Ionicons
            name={entry.quantity === 1 ? "trash-outline" : "remove"}
            size={16}
            color={entry.quantity === 1 ? C.spicy : C.textSecondary}
          />
        </TouchableOpacity>
        <Text style={styles.qty}>{entry.quantity}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => onAdd(entry.item)}>
          <Ionicons name="add" size={16} color={C.gold} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EmptyCart() {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyEmoji}>🛒</Text>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Browse the menu or ask Hana to build your order
      </Text>
      <TouchableOpacity
        style={styles.emptyBtn}
        onPress={() => router.push("/")}
      >
        <Text style={styles.emptyBtnText}>Browse Menu</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.emptyBtn, { backgroundColor: "transparent", borderColor: C.jade }]}
        onPress={() => router.push("/chat")}
      >
        <Text style={[styles.emptyBtnText, { color: C.jade }]}>
          Ask Hana
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CartScreen() {
  const { items, addItem, removeItem, updateQuantity, clearCart } = useCartStore();

  const subtotal = items.reduce((s, e) => s + e.item.price * e.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handleClear = () => {
    Alert.alert("Clear Cart", "Remove all items from your cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          clearCart();
        },
      },
    ]);
  };

  const handleCheckout = () => {
    Alert.alert(
      "Order Placed! 🎉",
      `Your order of $${total.toFixed(2)} has been sent to the kitchen. Estimated wait: 20-25 minutes.`,
      [
        {
          text: "Wonderful!",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            clearCart();
          },
        },
      ]
    );
  };

  if (items.length === 0) return <EmptyCart />;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>YOUR ORDER</Text>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>
        <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Clear all</Text>
        </TouchableOpacity>
      </View>

      {/* Items */}
      <FlatList
        data={items}
        keyExtractor={(e) => e.item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: entry }) => (
          <CartItem
            entry={entry}
            onAdd={(item) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              addItem(item, 1);
            }}
            onRemove={(id) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              const current = items.find((e) => e.item.id === id);
              if (current && current.quantity > 1) {
                updateQuantity(id, current.quantity - 1);
              } else {
                removeItem(id);
              }
            }}
          />
        )}
        ListFooterComponent={
          <View style={styles.divider}>
            <Text style={styles.dividerText}>
              ✦ {items.length} item type{items.length !== 1 ? "s" : ""}
            </Text>
          </View>
        }
      />

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax (8.25%)</Text>
          <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity onPress={handleCheckout} activeOpacity={0.85}>
          <LinearGradient
            colors={[C.goldLight, C.gold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkoutBtn}
          >
            <Ionicons name="checkmark-circle" size={20} color={C.obsidian} />
            <Text style={styles.checkoutText}>Place Order · ${total.toFixed(2)}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.chatBtn}
          onPress={() => router.push("/chat")}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={C.jade} />
          <Text style={styles.chatBtnText}>Edit via Hana AI</Text>
        </TouchableOpacity>
      </View>
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
    color: C.gold,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: C.textPrimary,
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(232,69,69,0.3)",
  },
  clearBtnText: { fontSize: 13, color: C.spicy, fontWeight: "600" },

  listContent: { padding: 16, gap: 8 },

  cartItem: {
    backgroundColor: C.obsidianCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.obsidianBorder,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  itemEmoji: { fontSize: 28 },
  itemInfo: { flex: 1 },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 3,
  },
  itemPrice: { fontSize: 15, fontWeight: "800", color: C.gold },
  unitPrice: { fontSize: 11, fontWeight: "400", color: C.textSecondary },

  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.obsidianLight,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: C.obsidianCard,
  },
  qty: {
    fontSize: 15,
    fontWeight: "800",
    color: C.textPrimary,
    minWidth: 20,
    textAlign: "center",
  },

  divider: {
    alignItems: "center",
    paddingVertical: 12,
  },
  dividerText: { fontSize: 12, color: C.textMuted, letterSpacing: 2 },

  summary: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: C.obsidianBorder,
    backgroundColor: C.obsidianLight,
    gap: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 14, color: C.textSecondary },
  summaryValue: { fontSize: 14, color: C.textPrimary, fontWeight: "600" },
  totalRow: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.obsidianBorder,
  },
  totalLabel: { fontSize: 17, fontWeight: "800", color: C.textPrimary },
  totalValue: { fontSize: 20, fontWeight: "900", color: C.gold },

  checkoutBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "800",
    color: C.obsidian,
    letterSpacing: -0.3,
  },

  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  chatBtnText: { fontSize: 13, color: C.jade, fontWeight: "600" },

  // Empty state
  emptyWrap: {
    flex: 1,
    backgroundColor: C.obsidian,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 12,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 8 },
  emptyTitle: { fontSize: 22, fontWeight: "800", color: C.textPrimary },
  emptySubtitle: {
    fontSize: 14,
    color: C.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBtn: {
    backgroundColor: C.gold,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "transparent",
    width: "100%",
    alignItems: "center",
  },
  emptyBtnText: { fontSize: 15, fontWeight: "700", color: C.obsidian },
});

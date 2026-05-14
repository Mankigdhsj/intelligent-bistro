import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useMenuStore, useCartStore } from "../store";

const { width } = Dimensions.get("window");

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

function CategoryPill({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.pill,
          active
            ? { backgroundColor: C.gold, borderColor: C.gold }
            : { backgroundColor: "transparent", borderColor: C.obsidianBorder },
        ]}
      >
        <Text
          style={[
            styles.pillText,
            { color: active ? C.obsidian : C.textSecondary },
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function MenuCard({ item, onAdd, cartQuantity }) {
  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAdd(item);
  };

  return (
    <View style={styles.card}>
      {/* Emoji / visual */}
      <View style={styles.cardEmoji}>
        <Text style={styles.emojiText}>{item.emoji}</Text>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.name}
          </Text>
          {item.spicy && (
            <View style={styles.spicyBadge}>
              <Text style={styles.spicyText}>🌶</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Tags */}
        <View style={styles.tagRow}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>

          {cartQuantity > 0 ? (
            <View style={styles.quantityBadge}>
              <Text style={styles.quantityText}>×{cartQuantity} in cart</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <LinearGradient
              colors={[C.goldLight, C.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.addBtnInner}
            >
              <Ionicons name="add" size={20} color={C.obsidian} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function MenuScreen() {
  const { items, categories, loading, fetchMenu } = useMenuStore();
  const { addItem, items: cartItems } = useCartStore();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchMenu();
  }, []);

  const allCategories = ["All", ...categories];

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  const getCartQty = useCallback(
    (itemId) => {
      const entry = cartItems.find((e) => e.item.id === itemId);
      return entry ? entry.quantity : 0;
    },
    [cartItems]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSub}>Asian Fusion</Text>
        <Text style={styles.headerTitle}>Zen Fusion Bistro</Text>
        <Text style={styles.headerTagline}>Where East meets extraordinary</Text>
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillRow}
      >
        {allCategories.map((cat) => (
          <CategoryPill
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onPress={() => setActiveCategory(cat)}
          />
        ))}
      </ScrollView>

      {/* Menu Items */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator color={C.gold} size="large" />
          <Text style={styles.loadingText}>Loading menu…</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MenuCard
              item={item}
              onAdd={addItem}
              cartQuantity={getCartQty(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.obsidian },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.obsidianBorder,
  },
  headerSub: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    color: C.gold,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: C.textPrimary,
    letterSpacing: -0.5,
  },
  headerTagline: {
    fontSize: 13,
    color: C.textSecondary,
    marginTop: 2,
    fontStyle: "italic",
  },

  pillRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },

  card: {
    backgroundColor: C.obsidianCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.obsidianBorder,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 4,
  },
  cardEmoji: {
    width: 80,
    backgroundColor: C.obsidianLight,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiText: { fontSize: 32 },

  cardContent: {
    flex: 1,
    padding: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  cardName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: C.textPrimary,
    letterSpacing: -0.2,
  },
  spicyBadge: {
    backgroundColor: "rgba(232,69,69,0.15)",
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  spicyText: { fontSize: 11 },

  cardDesc: {
    fontSize: 12,
    color: C.textSecondary,
    lineHeight: 17,
    marginBottom: 6,
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "rgba(78,205,196,0.12)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 10,
    color: C.jade,
    fontWeight: "600",
  },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: C.gold,
    flex: 1,
  },
  quantityBadge: {
    backgroundColor: "rgba(201,168,76,0.15)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  quantityText: {
    fontSize: 11,
    color: C.gold,
    fontWeight: "600",
  },
  addBtn: { borderRadius: 12, overflow: "hidden" },
  addBtnInner: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: { color: C.textSecondary, fontSize: 14 },
});

import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { useCartStore } from "../store";

const COLORS = {
  obsidian: "#0A0A0F",
  obsidianLight: "#12121A",
  obsidianBorder: "#2A2A3E",
  gold: "#C9A84C",
  textSecondary: "#8A8A9A",
};

function CartTabIcon({ focused }) {
  const items = useCartStore((s) => s.items);
  const count = items.reduce((sum, e) => sum + e.quantity, 0);
  return (
    <View style={{ position: "relative" }}>
      <Text style={{ fontSize: 22 }}>🛍</Text>
      {count > 0 && (
        <View style={{
          position: "absolute", top: -6, right: -8,
          backgroundColor: COLORS.gold, borderRadius: 8,
          minWidth: 16, height: 16, alignItems: "center",
          justifyContent: "center", paddingHorizontal: 3,
        }}>
          <Text style={{ color: COLORS.obsidian, fontSize: 9, fontWeight: "800" }}>
            {count > 99 ? "99+" : count}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.obsidianLight,
          borderTopColor: COLORS.obsidianBorder,
          borderTopWidth: 1,
          paddingBottom: 8, paddingTop: 8, height: 68,
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600", marginTop: 2 },
      }}>
        <Tabs.Screen name="index" options={{
          title: "Menu",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>🍽</Text>
          ),
        }} />
        <Tabs.Screen name="chat" options={{
          title: "AI Order",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22 }}>💬</Text>
          ),
        }} />
        <Tabs.Screen name="cart" options={{
          title: "Cart",
          tabBarIcon: CartTabIcon,
        }} />
      </Tabs>
    </>
  );
}
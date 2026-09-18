import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./src/screens/HomeScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import CartScreen from "./src/screens/CartScreen";

type Screen = "home" | "favorites" | "cart";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <SafeAreaProvider>
      {screen === "home" && (
        <HomeScreen
          onOpenFavorites={() => setScreen("favorites")}
          onOpenCart={() => setScreen("cart")}
        />
      )}

      {screen === "favorites" && (
        <FavoritesScreen onBack={() => setScreen("home")} />
      )}

      {screen === "cart" && <CartScreen onBack={() => setScreen("home")} />}
    </SafeAreaProvider>
  );
}

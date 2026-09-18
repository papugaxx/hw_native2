import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface Product {
  id: string;
  title: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  image: string;
  categoryId?: string;
}

interface Favorite {
  id: string;
  productId: string;
}

interface FavoritesScreenProps {
  onBack: () => void;
}

export default function FavoritesScreen({
  onBack,
}: FavoritesScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);

      const productsResponse = await fetch(
        `${API_BASE_URL}/products`,
      );

      const favoritesResponse = await fetch(
        `${API_BASE_URL}/favorites`,
      );

      const allProducts: Product[] =
        await productsResponse.json();

      const favorites: Favorite[] =
        await favoritesResponse.json();

      const favoriteProducts = allProducts.filter((product) =>
        favorites.some(
          (favorite) =>
            String(favorite.productId) === String(product.id),
        ),
      );

      setProducts(favoriteProducts);
    } catch (error) {
      console.log("Помилка:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId: string) => {
    try {
      // Знаходимо запис у favorites
      const response = await fetch(
        `${API_BASE_URL}/favorites?productId=${productId}`,
      );

      const favorites: Favorite[] = await response.json();

      if (favorites.length === 0) {
        return;
      }

      // Видаляємо по справжньому id запису favorites
      await fetch(
        `${API_BASE_URL}/favorites/${favorites[0].id}`,
        {
          method: "DELETE",
        },
      );

      // Прибираємо товар зі сторінки
      setProducts(
        products.filter(
          (product) => product.id !== productId,
        ),
      );
    } catch (error) {
      console.log("Помилка видалення:", error);
    }
  };

  const theme = {
    bg: isDarkMode ? "#121212" : "#FFFFFF",
    cardBg: isDarkMode ? "#1E1E1E" : "#FAFAFA",
    textPrimary: isDarkMode ? "#FFFFFF" : "#212121",
    textSecondary: isDarkMode ? "#A0A0A0" : "#757575",
    inputBg: isDarkMode ? "#2C2C2C" : "#F5F5F5",
    border: isDarkMode ? "#2C2C2C" : "#F0F0F0",
    bannerBg: isDarkMode ? "#1B382B" : "#E8F5E9",
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.bg },
      ]}
    >
      <StatusBar
        barStyle={
          isDarkMode ? "light-content" : "dark-content"
        }
        backgroundColor={theme.bg}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={28}
                color="#2E7D32"
              />
            </TouchableOpacity>

            <View>
              <Text
                style={[
                  styles.greetingTitle,
                  { color: theme.textPrimary },
                ]}
              >
                Обране ❤️
              </Text>

              <Text
                style={[
                  styles.greetingSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Товари, які ви зберегли
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <View style={styles.themeToggleContainer}>
              <Ionicons
                name={isDarkMode ? "moon" : "sunny"}
                size={20}
                color={
                  isDarkMode ? "#FFD54F" : "#FFA000"
                }
              />

              <Switch
                value={isDarkMode}
                onValueChange={(value) =>
                  setIsDarkMode(value)
                }
                trackColor={{
                  false: "#E0E0E0",
                  true: "#2E7D32",
                }}
                thumbColor={
                  isDarkMode ? "#FFFFFF" : "#F4F3F4"
                }
              />
            </View>

            <TouchableOpacity
              style={[
                styles.notificationButton,
                { backgroundColor: theme.inputBg },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={theme.textPrimary}
              />

              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.favoriteBanner,
            { backgroundColor: theme.bannerBg },
          ]}
        >
          <View style={styles.bannerHeart}>
            <Ionicons
              name="heart"
              size={28}
              color="#E53935"
            />
          </View>

          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>
              У вас {products.length} улюблених товарів
            </Text>

            <Text style={styles.bannerSubtitle}>
              Збережіть ще більше корисних і смачних
              продуктів!
            </Text>
          </View>

          <Text style={styles.apple}>🍎</Text>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator
              size="large"
              color="#2E7D32"
            />

            <Text
              style={[
                styles.loadingText,
                { color: theme.textSecondary },
              ]}
            >
              Завантаження...
            </Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="heart-outline"
              size={50}
              color="#2E7D32"
            />

            <Text
              style={[
                styles.emptyTitle,
                { color: theme.textPrimary },
              ]}
            >
              Обраних товарів немає
            </Text>

            <Text
              style={[
                styles.emptyText,
                { color: theme.textSecondary },
              ]}
            >
              Натисніть на сердечко біля товару
            </Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {products.map((product) => (
              <View
                key={product.id}
                style={[
                  styles.productCard,
                  {
                    backgroundColor: theme.cardBg,
                    borderColor: theme.border,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() =>
                    removeFavorite(product.id)
                  }
                >
                  <Ionicons
                    name="heart"
                    size={21}
                    color="#E53935"
                  />
                </TouchableOpacity>

                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="contain"
                />

                <Text
                  style={[
                    styles.productTitle,
                    { color: theme.textPrimary },
                  ]}
                  numberOfLines={1}
                >
                  {product.title}
                </Text>

                <Text
                  style={[
                    styles.productPrice,
                    { color: theme.textPrimary },
                  ]}
                >
                  {product.price}{" "}
                  <Text
                    style={[
                      styles.productUnit,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {product.unit}
                  </Text>
                </Text>

                <View style={styles.productFooter}>
                  <View style={styles.ratingContainer}>
                    <Ionicons
                      name="star"
                      size={14}
                      color="#FFB300"
                    />

                    <Text
                      style={[
                        styles.ratingText,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {product.rating}{" "}
                      <Text style={styles.reviewsText}>
                        ({product.reviews})
                      </Text>
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.addButton}
                  >
                    <Ionicons
                      name="cart-outline"
                      size={16}
                      color="#FFFFFF"
                    />

                    <Text style={styles.addButtonText}>
                      Додати
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // Header - стилі майже 1 в 1 з HomeScreen
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    marginRight: 8,
  },

  greetingTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  greetingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  themeToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#E53935",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },

  // Зелений блок
  favoriteBanner: {
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  bannerHeart: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#D5F0DA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  bannerTextContainer: {
    flex: 1,
  },

  bannerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1B5E20",
  },

  bannerSubtitle: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 4,
  },

  apple: {
    fontSize: 40,
    marginLeft: 8,
  },

  centerContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },

  loadingText: {
    marginTop: 10,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },

  emptyText: {
    fontSize: 14,
    marginTop: 5,
  },

  // Ті самі картки, що й на HomeScreen
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },

  productCard: {
    width: "48%",
    borderRadius: 16,
    padding: 12,
    position: "relative",
    borderWidth: 1,
  },

  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },

  productImage: {
    width: "100%",
    height: 90,
    marginVertical: 8,
  },

  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },

  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  productUnit: {
    fontSize: 12,
    fontWeight: "normal",
  },

  productFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  ratingText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 2,
  },

  reviewsText: {
    fontSize: 11,
    color: "#9E9E9E",
    fontWeight: "normal",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E7D32",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },
});
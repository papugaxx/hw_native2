import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface CartScreenProps {
  onBack: () => void;
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  unit: string;
  quantity: number;
  step: number;
  image: string;
}

const INITIAL_ITEMS: CartItem[] = [
  {
    id: "bread",
    title: "Хліб бородинський",
    price: 28,
    unit: "₴/шт",
    quantity: 2,
    step: 1,
    image: "https://cdn-icons-png.flaticon.com/512/3014/3014288.png",
  },
  {
    id: "tomatoes",
    title: "Яблука Айдаред",
    price: 35,
    unit: "₴/кг",
    quantity: 1.5,
    step: 0.5,
    image: "https://cdn-icons-png.flaticon.com/512/1202/1202125.png",
  },
  {
    id: "milk",
    title: "Молоко Селянське",
    price: 42,
    unit: "₴/л",
    quantity: 1,
    step: 1,
    image: "https://cdn-icons-png.flaticon.com/512/2983/2983788.png",
  },
];

export default function CartScreen({ onBack }: CartScreenProps) {
  const { width } = useWindowDimensions();
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [promo, setPromo] = useState("");

  const isPhone = width < 600;
  const isWide = width >= 900;
  const showSideSummary = width >= 700;

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) => item.title.toLowerCase().includes(query));
  }, [items, search]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const changeQuantity = (id: string, direction: 1 | -1) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const next = Math.max(item.step, item.quantity + item.step * direction);

        return {
          ...item,
          quantity: Number(next.toFixed(1)),
        };
      }),
    );
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const formatQuantity = (value: number) =>
    Number.isInteger(value) ? String(value) : value.toFixed(1);

  const formatMoney = (value: number) => `${value.toFixed(2)} ₴`;

  const renderSummary = () => (
    <View style={[styles.summary, !showSideSummary && styles.summaryPhone]}>
      <Text style={styles.summaryTitle}>Підсумок</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Сума товарів:</Text>
        <Text style={styles.summaryValue}>{formatMoney(total)}</Text>
      </View>

      <View style={[styles.summaryRow, styles.summaryRowTop]}>
        <Text style={styles.summaryLabel}>Доставка:</Text>
        <Text style={styles.deliveryText}>
          {total >= 300 ? "Безкоштовна" : "Безкоштовна\n(від 300 ₴)"}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Всього:</Text>
        <Text style={styles.totalValue}>{formatMoney(total)}</Text>
      </View>

      <View style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <Text style={styles.addressTitle}>Адреса доставки:</Text>
          <Ionicons name="pencil-outline" size={20} color="#23965B" />
        </View>
        <Text style={styles.addressText}>
          вул. Тираспольська, 12,{"\n"}Одеса
        </Text>
      </View>

      <TouchableOpacity style={styles.orderButton} activeOpacity={0.8}>
        <Text style={styles.orderButtonText}>Оформити замовлення</Text>
        <Ionicons name="arrow-forward" size={23} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>Кошик, Андрій 👋</Text>
              <Text style={styles.headerSubtitle}>
                Перевірте ваше замовлення та оформіть доставку!
              </Text>
            </View>

            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={24} color="#212121" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>1</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={21} color="#9E9E9E" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Пошук товарів..."
              placeholderTextColor="#9E9E9E"
              style={styles.searchInput}
            />
          </View>

          <Text style={styles.pageTitle}>Огляд кошика</Text>

          <View
            style={[
              styles.mainContent,
              showSideSummary && styles.mainContentRow,
            ]}
          >
            <View
              style={[
                styles.productsColumn,
                showSideSummary && styles.productsColumnWithSummary,
              ]}
            >
              <View style={styles.productsHeader}>
                <Text style={styles.productsTitle}>
                  Товари у кошику ({items.length})
                </Text>
                {!isPhone && <Text style={styles.moreText}>Більше ›</Text>}
              </View>

              {visibleItems.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="cart-outline" size={46} color="#9E9E9E" />
                  <Text style={styles.emptyText}>Товари не знайдено</Text>
                </View>
              ) : (
                <View style={styles.cardsGrid}>
                  {visibleItems.map((item) => (
                    <View
                      key={item.id}
                      style={[
                        styles.productCard,
                        isPhone
                          ? styles.cardOneColumn
                          : isWide
                            ? styles.cardThreeColumns
                            : styles.cardTwoColumns,
                        isPhone && styles.productCardPhone,
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => toggleFavorite(item.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={favorites.has(item.id) ? "heart" : "heart-outline"}
                          size={24}
                          color={favorites.has(item.id) ? "#E53935" : "#9E9E9E"}
                        />
                      </TouchableOpacity>

                      <Image
                        source={{ uri: item.image }}
                        resizeMode="contain"
                        style={[
                          styles.productImage,
                          isPhone && styles.productImagePhone,
                        ]}
                      />

                      <View style={[styles.cardInfo, isPhone && styles.cardInfoPhone]}>
                        <Text style={styles.productName} numberOfLines={2}>
                          {item.title}
                        </Text>

                        <Text style={styles.productPrice}>
                          {item.price} {item.unit}
                        </Text>

                        <View style={styles.controlsRow}>
                          <View style={styles.quantityControl}>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() => changeQuantity(item.id, -1)}
                            >
                              <Text style={styles.minusText}>−</Text>
                            </TouchableOpacity>

                            <Text style={styles.quantityText}>
                              {formatQuantity(item.quantity)}
                              {item.step === 0.5 ? " кг" : ""}
                            </Text>

                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={() => changeQuantity(item.id, 1)}
                            >
                              <Text style={styles.plusText}>+</Text>
                            </TouchableOpacity>
                          </View>

                          <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeItem(item.id)}
                          >
                            <Ionicons name="close" size={22} color="#424242" />
                          </TouchableOpacity>
                        </View>

                        {!isPhone && (
                          <View style={styles.subtotalRow}>
                            <Text style={styles.subtotalLabel}>Субтотал:</Text>
                            <Text style={styles.subtotalValue}>
                              {formatMoney(item.price * item.quantity)}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {renderSummary()}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "800",
    color: "#111111",
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    color: "#555555",
  },
  notificationButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    right: 1,
    top: 0,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: "#E74C3C",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  searchBox: {
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F4F5F8",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#212121",
    paddingVertical: 0,
  },
  pageTitle: {
    fontSize: 27,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 10,
  },
  mainContent: {
    width: "100%",
  },
  mainContentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  productsColumn: {
    width: "100%",
  },
  productsColumnWithSummary: {
    flex: 1,
    width: "auto",
  },
  productsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  productsTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#191919",
  },
  moreText: {
    color: "#23965B",
    fontSize: 13,
    fontWeight: "700",
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "stretch",
    rowGap: 14,
  },
  productCard: {
    minHeight: 288,
    borderWidth: 1,
    borderColor: "#ECECEC",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    padding: 12,
    position: "relative",
    shadowColor: "#000000",
    shadowOpacity: 0.07,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardOneColumn: {
    width: "100%",
  },
  cardTwoColumns: {
    width: "48%",
  },
  cardThreeColumns: {
    width: "32%",
  },
  productCardPhone: {
    minHeight: 165,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 3,
  },
  productImage: {
    width: "100%",
    height: 120,
    marginTop: 10,
    marginBottom: 8,
  },
  productImagePhone: {
    width: "38%",
    height: 120,
    marginTop: 0,
    marginBottom: 0,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardInfoPhone: {
    justifyContent: "center",
    paddingRight: 4,
  },
  productName: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "800",
    color: "#202020",
    paddingRight: 20,
  },
  productPrice: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: "800",
    color: "#181818",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  quantityControl: {
    flex: 1,
    height: 39,
    borderRadius: 10,
    backgroundColor: "#F5F6F8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  quantityButton: {
    width: 31,
    height: 31,
    alignItems: "center",
    justifyContent: "center",
  },
  minusText: {
    fontSize: 24,
    lineHeight: 26,
    color: "#B7B7B7",
  },
  plusText: {
    fontSize: 24,
    lineHeight: 26,
    color: "#23965B",
    fontWeight: "500",
  },
  quantityText: {
    color: "#1B1B1B",
    fontSize: 16,
    fontWeight: "700",
  },
  removeButton: {
    width: 40,
    height: 39,
    borderRadius: 10,
    backgroundColor: "#F5F6F8",
    alignItems: "center",
    justifyContent: "center",
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  subtotalLabel: {
    fontSize: 12,
    color: "#5A5A5A",
  },
  subtotalValue: {
    fontSize: 12,
    color: "#1F1F1F",
    fontWeight: "700",
  },
  promoTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 9,
  },
  promoInput: {
    height: 45,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#212121",
  },
  summary: {
    width: "29%",
    minWidth: 235,
    borderLeftWidth: 1,
    borderLeftColor: "#F0F0F0",
    paddingLeft: 16,
    paddingBottom: 10,
  },
  summaryPhone: {
    width: "100%",
    minWidth: 0,
    borderLeftWidth: 0,
    paddingLeft: 0,
    marginTop: 22,
  },
  summaryTitle: {
    fontSize: 23,
    lineHeight: 28,
    fontWeight: "800",
    color: "#151515",
    marginBottom: 13,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  summaryRowTop: {
    marginTop: 9,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
  },
  summaryValue: {
    fontSize: 14,
    color: "#222222",
    fontWeight: "700",
    textAlign: "right",
  },
  deliveryText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
    color: "#222222",
    fontWeight: "600",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginVertical: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1D1D1D",
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "900",
    color: "#1D1D1D",
  },
  addressCard: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  addressTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#202020",
  },
  addressText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#474747",
  },
  orderButton: {
    marginTop: 18,
    minHeight: 55,
    borderRadius: 13,
    backgroundColor: "#23965B",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderButtonText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "800",
  },
  emptyBox: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 8,
    color: "#777777",
    fontSize: 14,
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 66,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  navText: {
    fontSize: 10,
    color: "#7A7A7A",
  },
  navTextActive: {
    fontSize: 10,
    color: "#23965B",
    fontWeight: "700",
  },
});

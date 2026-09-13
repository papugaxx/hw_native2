import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CategoryType from "../types/CategoryType";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_CATEGORY_API_BASE_URL ||
  process.env.EXPO_PUBLIC_API_BASE_URL;

export default function CategoryScreen() {
  const URL = `${API_BASE_URL}/categories`;

  const [category, setCategory] = useState<CategoryType>({
    name: "",
    image: "",
    color: "",
  });

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);

      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error("Не вдалося завантажити категорії");
      }

      const data: CategoryType[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.log("Помилка завантаження категорій:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async () => {
    if (!category.name.trim()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: category.name.trim(),
          image: category.image.trim(),
          color: category.color.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Не вдалося додати категорію");
      }

      const createdCategory: CategoryType = await response.json();

      // Одразу показуємо нову категорію на екрані,
      // не чекаючи перезавантаження компонента.
      setCategories((currentCategories) => [
        ...currentCategories,
        createdCategory,
      ]);

      // Очищаємо поля після успішного додавання.
      setCategory({
        name: "",
        image: "",
        color: "",
      });
    } catch (error) {
      console.log("Помилка додавання категорії:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Category Screen</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter title"
        value={category.name}
        onChangeText={(text) =>
          setCategory((current) => ({ ...current, name: text }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Enter image URL"
        value={category.image}
        onChangeText={(text) =>
          setCategory((current) => ({ ...current, image: text }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Enter color"
        value={category.color}
        onChangeText={(text) =>
          setCategory((current) => ({ ...current, color: text }))
        }
      />

      <View style={styles.button}>
        <Button
          title={loading ? "Adding..." : "Add Category"}
          onPress={addCategory}
          disabled={loading}
        />
      </View>

      <Text style={styles.listTitle}>Categories</Text>

      {loadingCategories ? (
        <ActivityIndicator size="small" />
      ) : (
        <FlatList
          data={categories}
          horizontal
          keyExtractor={(item, index) =>
            item.id !== undefined ? String(item.id) : `${item.name}-${index}`
          }
          contentContainerStyle={styles.list}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View
                style={[
                  styles.imageContainer,
                  {
                    backgroundColor: item.color || "#E8F5E9",
                  },
                ]}
              >
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.placeholderText}>🛒</Text>
                )}
              </View>

              <Text style={styles.categoryName} numberOfLines={2}>
                {item.name}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Категорій поки немає</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    width: "100%",
  },
  button: {
    marginVertical: 8,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
  },
  list: {
    paddingBottom: 20,
    paddingRight: 4,
  },
  card: {
    alignItems: "center",
    width: 72,
    marginRight: 16,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  image: {
    width: 40,
    height: 40,
  },
  placeholderText: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 14,
    color: "#212121",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
});

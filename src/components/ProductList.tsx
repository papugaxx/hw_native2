import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useProductStore } from "../store/useProductStore";

const ProductList = () => {
  const products = useProductStore((state) => state.products);
  const removeProduct = useProductStore((state) => state.removeProduct);

  return (
    <View style={styles.container}>
      {products.map((product) => (
        <View key={product.id} style={styles.product}>
          <View>
            <Text style={styles.title}>{product.title}</Text>
            <Text>{product.price} $</Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => removeProduct(product.id)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
  },
  product: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 6,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  deleteText: {
    color: "#ffffff",
  },
});

export default ProductList;

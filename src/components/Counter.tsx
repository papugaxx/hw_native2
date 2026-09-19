import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { useCounterStore } from "../store/useCounterStore";

const Counter = () => {
    const counter = useCounterStore((state) => state.count);
    const increment = useCounterStore((state) => state.increment);
    const decrement = useCounterStore((state) => state.decrement);
    const reset = useCounterStore((state) => state.reset);

    return (
        <View style={styles.container}>
            <Text style={styles.counterText}>{counter}</Text>

            <TouchableOpacity
                onPress={() => increment(5)}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Increment</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => decrement(5)}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Decrement</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={reset}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        justifyContent: "center" as const,
        alignItems: "center" as const,
    },

    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#a032cf",
        borderRadius: 5,
    },

    buttonText: {
        color: "#ffffff",
        fontSize: 16,
    },

    counterText: {
        fontSize: 24,
        fontWeight: "bold" as const,
    },
};

export default Counter;
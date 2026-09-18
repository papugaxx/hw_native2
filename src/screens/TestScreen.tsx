import { View, Dimensions, Text, useWindowDimensions, StyleSheet} from "react-native";
const cl = console.log;
export const TestScreen = () => {
    const { width, height } = useWindowDimensions();
    cl("width: ", width, "height: ", height);
    return (
        <View style={styles.container}>
            <Text style={styles.text}>TestScreen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#c732cc",
        justifyContent: "center", 
    },
    text: {
        textAlign: "center", 
        fontSize: 24,
        fontWeight: "bold",
        color: "#ffffff",
    },
});

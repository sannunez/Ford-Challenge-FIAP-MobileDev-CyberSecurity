import {View, Text, Pressable, StyleSheet} from "react-native";


interface CardProps {
    id: number;
    make: string;
    model: string;
    trim: string;
    type: string;
    year: number;
    onPress: () => void;
}

export default function SavedCard({make, model, trim, type, year, onPress,}: CardProps) {
    return (
        <View style={styles.container}>

            <View>
                <Text style={styles.title}>
                    {make} {model}
                </Text>

                <Text style={styles.text}>
                    {trim}
                </Text>

                <Text style={styles.text}>
                    {type}
                </Text>

                <Text style={styles.text}>
                    {year}
                </Text>
            </View>

            <Pressable
                style={styles.button}
                onPress={onPress}
            >
                <Text style={styles.buttonText}>
                    SABER MAIS
                </Text>
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#222",
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
    },

    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    text: {
        color: "#ccc",
        marginTop: 4,
    },

    button: {
        marginTop: 12,
        backgroundColor: "#0E63EE",
        padding: 10,
        borderRadius: 8,
    },

    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
});
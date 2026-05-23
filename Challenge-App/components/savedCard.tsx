import {View, Text, Pressable, StyleSheet, Image,} from "react-native";
import { memo } from "react";
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from "@expo-google-fonts/montserrat";

import { useSavedCars } from "../context/SavedCarsProvider";

interface CardProps {
    id: number;
    make: string;
    model: string;
    trim: string;
    type: string;
    year: number;

    onPress: () => void;
}


function SavedCard({id, make, model, trim, type, year, onPress,}: CardProps) {
    const [fontsLoaded] = useFonts({
            Montserrat_400Regular,
            Montserrat_700Bold
        });

    const {
        removeCar,
        isSaved,
    } = useSavedCars();

    return (

        <View style={styles.container}>

            <View>

                <Text style={styles.title}>
                    {make} {model}
                </Text>

                <Text style={styles.text}>
                    <Text style={styles.innerText}>VERSÃO: </Text> {trim}
                </Text>

                <Text style={styles.text}>
                    <Text style={styles.innerText}>TIPO: </Text> {type}
                </Text>

                <Text style={styles.text}>
                    <Text style={styles.innerText}>ANO: </Text>{year}
                </Text>

            </View>

            <View style={styles.actions}>

                <Pressable
                    style={styles.button}
                    onPress={onPress}
                >
                    <Text style={styles.buttonText}>
                        SABER MAIS
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() =>
                        removeCar(id)
                    }
                >

                    <Image
                        source={
                            isSaved(id)
                                ? require(
                                    "../assets/save-fill.png"
                                )
                                : require(
                                    "../assets/save.png"
                                )
                        }

                        style={{
                            width: 24,
                            height: 24,
                        }}

                        resizeMode="contain"
                    />

                </Pressable>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#2e2d2d",
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
    },

    title: {
        color: "#fff",
        fontSize: 18,
        fontFamily: 'Montserrat_700Bold'
    },

    text: {
        color: "#ccc",
        marginTop: 4,
        fontFamily: 'Montserrat_400Regular'
    },

    actions: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 12,
    },

    button: {
        backgroundColor: "#0E63EE",
        padding: 10,
        borderRadius: 8,
        
    },

    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontFamily: 'Montserrat_700Bold'
    },

    innerText: {
        fontFamily: 'Montserrat_700Bold'
    }
});

export default memo(SavedCard);
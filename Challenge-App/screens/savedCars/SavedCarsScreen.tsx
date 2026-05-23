import { View, FlatList, Text } from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../../types/navigation";
import { useFonts, Montserrat_700Bold } from "@expo-google-fonts/montserrat";

import SavedCard from "../../components/savedCard";

import { useSavedCars } from "../../context/SavedCarsProvider";
import { useCar } from "../../context/CarProvider";


type SavedNav =BottomTabNavigationProp<TabParamList,"Saved">;

type Props = {
    navigation: SavedNav;
};

export default function SavedCarsScreen({navigation}: Props) {

    const [fontsLoaded] = useFonts({
        Montserrat_700Bold
    });

    const { savedCars } =
        useSavedCars();

    const { setSelectedCarId } =
        useCar();

    if (!fontsLoaded) {
        return null;
    }

    if (savedCars.length === 0) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                }}
            >

            <Text
                style={{
                    color: "#fff",
                    fontSize: 18,
                    fontFamily:
                        "Montserrat_700Bold",
                    textAlign: "center",
                }}
            >
                Nenhum veículo salvo
            </Text>

            <Text
                style={{
                    color: "#888",
                    marginTop: 10,
                    textAlign: "center",
                    fontFamily:
                        "Montserrat_400Regular",
                }}
            >
                Favorite picapes na tela de
                veículos para encontrá-las aqui.
            </Text>

            </View>
        );
    }

    return (

        <View
            style={{
                flex: 1,
                padding: 16,
            }}
        >

            <Text
                style={{
                    fontFamily: "Montserrat_700Bold",
                    fontSize: 28,
                    color: "#fff",
                    textDecorationLine:"underline",
                    marginTop: 15,
                    marginBottom: 20,
                }}
            >
                Favoritados
            </Text>

            <FlatList
                data={savedCars}

                keyExtractor={(item) =>
                    item.id.toString()
                }

                renderItem={({ item }) => (

                    <SavedCard
                        id={item.id}
                        make={item.make}
                        model={item.model}
                        trim={item.trim}
                        type={item.type}
                        year={item.year}

                        onPress={() => {

                            setSelectedCarId(
                                item.id
                            );

                            navigation.navigate(
                                "Details"
                            );
                        }}
                    />
                )}
            />

        </View>
    );
}
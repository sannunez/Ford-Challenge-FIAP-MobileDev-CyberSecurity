import { View, FlatList } from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../../types/navigation";

import SavedCard from "../../components/savedCard";

import { useSavedCars } from "../../context/SavedCarsProvider";
import { useCar } from "../../context/CarProvider";

type SavedNav =
    BottomTabNavigationProp<
        TabParamList,
        "Saved"
    >;

type Props = {
    navigation: SavedNav;
};

export default function SavedCarsScreen({
    navigation,
}: Props) {

    const { savedCars } =
        useSavedCars();

    const { setSelectedCarId } =
        useCar();

    return (
        <View
            style={{
                flex: 1,
                padding: 16,
            }}
        >

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
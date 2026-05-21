import { View, Text, Pressable, StyleSheet, FlatList, Image, Linking } from 'react-native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { getCarTruck } from '../../hooks/getCarTruckData';
import { TabParamList } from '../../types/navigation';
import { useCar } from '../../context/CarProvider';
import { useState } from 'react';

import {useFonts,Montserrat_700Bold,Montserrat_400Regular} from '@expo-google-fonts/montserrat';

import TruckCard from '../../components/truckCard';

import { CarTruckDTO } from '../../interface/CarTruckDTO';

type CarListNav =
    BottomTabNavigationProp<TabParamList, "Cars">;

type Props = {
    navigation: CarListNav;
};

export default function CarList({ navigation }: Props) {

    const [filter, setFilter] = useState("");

    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, error} = getCarTruck(filter);

    const { setSelectedCarId } = useCar();

    const carros =
        data?.pages.flatMap(page => page.data) ?? [];

    const [open, setOpen] = useState(false);

    const makes = {
        Chevrolet: {
            filter: "make=Chevrolet",
            logo: require("../../assets/chevroletLogo.png")
        },

        Ford: {
            filter: "make=Ford",
            logo: require("../../assets/fordLogo.png")
        },

        GMC: {
            filter: "make=GMC",
            logo: require("../../assets/gmcLogo.png")
        },

        Honda: {
            filter: "make=Honda",
            logo: require("../../assets/hondaLogo.png")
        },

        Jeep: {
            filter: "make=Jeep",
            logo: require("../../assets/jeepLogo.png")
        },

        Nissan: {
            filter: "make=Nissan",
            logo: require("../../assets/nissanLogo.png")
        },

        Ram: {
            filter: "make=Ram",
            logo: require("../../assets/RAMLogo.png")
        },

        Toyota: {
            filter: "make=Toyota",
            logo: require("../../assets/toyotaLogo.png")
        }
    };

    const renderCar = ({item}: {item: CarTruckDTO}) => (

        <TruckCard
            make={item.make}
            model={item.model}
            trim={item.trim}
            type={item.type}
            year={item.year}
            onPress={() => {

                setSelectedCarId(item.id);

                navigation.navigate("Details");
            }}
        />
    );

    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_700Bold
    });

    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <Text style={{ color: '#888', fontSize: 14, fontFamily: 'Montserrat_400Regular' }}>
                    Não foi possível carregar os veículos.
                </Text>
            </View>
        );
    }

    if (!fontsLoaded) {
        return null;
    }

    return (

        <View style={styles.container}>

            <Pressable
                onPress={() => setOpen(!open)}
            >
                <Text
                    style={{
                        color: "#fff",
                        marginTop: 20,
                        fontFamily: 'Montserrat_700Bold',
                        textDecorationLine: 'underline',
                        fontSize: 16
                    }}
                >
                    PROCURAR POR MARCAS
                </Text>
            </Pressable>

            {open && (
                <View style={styles.options}>
                    {Object.entries(makes).map(([label, value]) => (
                        <Pressable
                            key={label}
                            onPress={() =>
                                setFilter(value.filter)
                            }
                            style={[
                                styles.checkbox,
                                {
                                    opacity:
                                        filter === value.filter
                                            ? 1
                                            : 0.3
                                }
                            ]}
                        >
                            <Image
                                source={value.logo}
                                style={{
                                    width: 30,
                                    height: 30
                                }}
                            />
                        </Pressable>
                    ))}

                </View>

            )}

            <View style={styles.carOptions}>
                <FlatList
                    data={carros}
                    contentContainerStyle={{
                        gap: 20
                    }}

                    keyExtractor={(item) =>
                        item.id.toString()
                    }

                    renderItem={renderCar}
                    removeClippedSubviews
                    initialNumToRender={5}
                    windowSize={5}
                    maxToRenderPerBatch={5}
                    onEndReached={() => {
                        if (
                            hasNextPage &&
                            !isFetchingNextPage
                        ) {
                            fetchNextPage();
                        }
                    }}

                    onEndReachedThreshold={0.5}

                    ListFooterComponent={

                        isFetchingNextPage
                            ? (
                                <Text
                                    style={{
                                        color: "#fff",
                                        textAlign: "center",
                                        marginVertical: 20,
                                        fontFamily:
                                            'Montserrat_700Bold'
                                    }}
                                >
                                    Carregando...
                                </Text>
                            )
                            : null
                    }
                />
            </View>

            <View
                style={{
                    marginTop: 10,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Text
                    style={{
                        fontFamily:'Montserrat_400Regular',
                        fontSize: 12,
                        color: '#FFF'
                    }}
                >
                    CONFIRA O LANÇAMENTO
                    DA NOVA RANGER RAPTOR
                </Text>

            </View>

            <Pressable
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}

                onPress={() =>
                    Linking.openURL(
                        "https://www.youtube.com/watch?v=3nW3UoOxV3k"
                    )
                }
            >

                <Image
                    source={
                        require("../../assets/RangerRaptorTrailer.gif")
                    }

                    style={{
                        width: 310,
                        height: 170,
                        borderRadius: 5,
                    }}
                />

            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        marginTop: 10
    },
    carOptions: {
        display: 'flex',
        height: 500,
        alignItems: "center",
        marginVertical: 10
    },
    checkbox: {
        width: 70,
        alignItems: 'center'
    },
    options: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        justifyContent: 'center',
        width: 360
    }
});
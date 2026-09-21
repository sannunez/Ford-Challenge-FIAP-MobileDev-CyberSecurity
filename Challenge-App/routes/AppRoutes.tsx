import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import { BlurView } from "expo-blur";

import { TabParamList } from "../types/navigation";

import CarList from "../screens/carList/carList";
import Details from "../screens/details/detailsScreen";
import ReleaseScreen from "../screens/ReleaseScreen/ReleaseScreen";
import SavedCarsScreen from "../screens/savedCars/SavedCarsScreen";
import { colors, fonts } from "../theme";

const Tab = createBottomTabNavigator<TabParamList>();

const icons = {
    Releases: {
        active: require("../assets/release-active.png"),
        inactive: require("../assets/release.png"),
    },

    Cars: {
        active: require("../assets/carList-active.png"),
        inactive: require("../assets/carList.png"),
    },

    Details: {
        active: require("../assets/settings-active.png"),
        inactive: require("../assets/settings.png"),
    },

    Saved: {
        active: require("../assets/saved-active.png"),
        inactive: require("../assets/saved.png"),
    }
};

export default function AppRoutes() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarStyle: {
                        position: "absolute",
                        height: 72,
                        paddingTop: 8,
                        paddingBottom: 8,
                        backgroundColor: "transparent",
                        borderTopColor: colors.glassBorder,
                    },
                    tabBarBackground: () => (
                        <BlurView
                            intensity={70}
                            tint="systemChromeMaterialDark"
                            experimentalBlurMethod="dimezisBlurView"
                            style={{ flex: 1, backgroundColor: "rgba(2, 11, 24, 0.76)" }}
                        />
                    ),
                    tabBarActiveTintColor: colors.brightBlue,
                    tabBarInactiveTintColor: colors.textMuted,
                    tabBarLabelStyle: {
                        fontFamily: fonts.semibold,
                        fontSize: 10,
                    },
                    tabBarHideOnKeyboard: true,
                    sceneStyle: {
                        backgroundColor: colors.navy950,
                    },

                    tabBarIcon: ({ focused }) => {
                        const icon =
                            icons[
                                route.name as keyof typeof icons
                            ][focused ? "active" : "inactive"];

                        return (
                            <Image
                                source={icon}
                                style={{
                                    width: 24,
                                    height: 24,
                                }}
                                resizeMode="contain"
                            />
                        );
                    },
                })}
            >
                <Tab.Screen
                    name="Releases"
                    component={ReleaseScreen}
                    options={{ title: "Lançamento" }}
                />

                <Tab.Screen
                    name="Cars"
                    component={CarList}
                    options={{ title: "Veículos" }}
                />

                <Tab.Screen
                    name="Details"
                    component={Details}
                    options={{ title: "Detalhes" }}
                />

                <Tab.Screen
                    name="Saved"
                    component={SavedCarsScreen}
                    options={{ title: "Salvos" }}
                />

            </Tab.Navigator>
        </NavigationContainer>
    );
}

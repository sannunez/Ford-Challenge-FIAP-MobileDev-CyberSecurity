import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";

import { TabParamList } from "../types/navigation";

import CarList from "../screens/carList/carList";
import Details from "../screens/details/detailsScreen";
import ReleaseScreen from "../screens/ReleaseScreen/ReleaseScreen";

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
};

export default function AppRoutes() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,

                    tabBarStyle: {
                        backgroundColor: "#171818",
                        borderTopColor: "#252525",
                    },

                    tabBarActiveTintColor: "#056aee",

                    tabBarInactiveTintColor: "#777",

                    sceneStyle: {
                        backgroundColor: "#1d1f1f",
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
                />

                <Tab.Screen
                    name="Cars"
                    component={CarList}
                />

                <Tab.Screen
                    name="Details"
                    component={Details}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
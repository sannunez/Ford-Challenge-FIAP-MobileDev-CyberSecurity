import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

import AppRoutes from "./routes/AppRoutes";
import { CarProvider } from "./context/CarProvider";
import { SavedCarsProvider } from "./context/SavedCarsProvider";
import { initializeAuth } from "./services/authService";
import AppBackground from "./components/AppBackground";
import { colors } from "./theme";

const queryClient = new QueryClient();

export default function App() {
    const [authReady, setAuthReady] = useState(false);
    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
    });

    useEffect(() => {
        initializeAuth().finally(() => setAuthReady(true));
    }, []);

    if (!authReady || !fontsLoaded) {
        return (
            <AppBackground>
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.brightBlue} />
                </View>
            </AppBackground>
        );
    }

    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <SavedCarsProvider>
                    <CarProvider>
                        <AppRoutes />
                    </CarProvider>
                </SavedCarsProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});

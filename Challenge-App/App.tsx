import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppRoutes from "./routes/AppRoutes";
import { CarProvider } from "./context/CarProvider";
import { SavedCarsProvider } from "./context/SavedCarsProvider";
import { initializeAuth } from "./services/authService";

const queryClient = new QueryClient();

export default function App() {
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        initializeAuth().finally(() => setAuthReady(true));
    }, []);

    if (!authReady) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator color="#fff" />
            </View>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <SavedCarsProvider>
                <CarProvider>
                    <AppRoutes />
                </CarProvider>
            </SavedCarsProvider>
        </QueryClientProvider>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        backgroundColor: "#252525",
        alignItems: "center",
        justifyContent: "center",
    },
});

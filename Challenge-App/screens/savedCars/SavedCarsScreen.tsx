import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import AppBackground from "../../components/AppBackground";
import GlassCard from "../../components/GlassCard";
import SavedCard from "../../components/savedCard";
import { useCar } from "../../context/CarProvider";
import { useSavedCars } from "../../context/SavedCarsProvider";
import { colors, fonts, spacing } from "../../theme";
import type { TabParamList } from "../../types/navigation";

type SavedNav = BottomTabNavigationProp<TabParamList, "Saved">;
type Props = { navigation: SavedNav };

export default function SavedCarsScreen({ navigation }: Props) {
    const { savedCars } = useSavedCars();
    const { setSelectedCarId } = useCar();

    return (
        <AppBackground>
            <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
                <FlatList
                    data={savedCars}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <SavedCard
                            {...item}
                            onPress={() => {
                                setSelectedCarId(item.id);
                                navigation.navigate("Details");
                            }}
                        />
                    )}
                    ListHeaderComponent={
                        <View style={styles.header}>
                            <Text style={styles.eyebrow}>SUA SELEÇÃO</Text>
                            <Text style={styles.title}>Veículos salvos</Text>
                            <Text style={styles.subtitle}>
                                Mantenha os modelos mais relevantes por perto para consultar suas especificações.
                            </Text>
                        </View>
                    }
                    ListEmptyComponent={
                        <GlassCard contentStyle={styles.emptyContent}>
                            <Text style={styles.emptyTitle}>Sua lista está vazia</Text>
                            <Text style={styles.emptyText}>
                                Toque no ícone de salvar em um veículo para adicioná-lo aqui.
                            </Text>
                        </GlassCard>
                    }
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    listContent: {
        width: "100%",
        maxWidth: 720,
        flexGrow: 1,
        alignSelf: "center",
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: 112,
    },
    header: { 
        marginBottom: spacing.lg 
    },
    eyebrow: { 
        color: colors.brightBlue, 
        fontFamily: fonts.semibold, 
        fontSize: 11 
    },
    title: { 
        color: colors.text, 
        fontFamily: fonts.bold, 
        fontSize: 30, 
        marginTop: spacing.xs 
    },
    subtitle: { 
        color: colors.textMuted, 
        fontFamily: fonts.regular, 
        fontSize: 14, 
        lineHeight: 21, 
        marginTop: spacing.sm, 
        maxWidth: 520 
    },
    separator: { height: spacing.md },
    emptyContent: { 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: 190, 
        padding: spacing.lg 
    },
    emptyTitle: { 
        color: colors.text, 
        fontFamily: fonts.bold, 
        fontSize: 19, 
        textAlign: "center" 
    },
    emptyText: { 
        color: colors.textMuted, 
        fontFamily: fonts.regular, 
        fontSize: 13, 
        lineHeight: 20, 
        textAlign: "center", 
        marginTop: spacing.sm, 
        maxWidth: 360 
    },
});

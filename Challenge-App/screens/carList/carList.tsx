import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Linking,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import AppBackground from "../../components/AppBackground";
import GlassCard from "../../components/GlassCard";
import TruckCard from "../../components/truckCard";
import { useCar } from "../../context/CarProvider";
import { getCarTruck } from "../../hooks/getCarTruckData";
import type { CarTruckDTO } from "../../interface/CarTruckDTO";
import { colors, fonts, radius, spacing } from "../../theme";
import type { TabParamList } from "../../types/navigation";

type CarListNav = BottomTabNavigationProp<TabParamList, "Cars">;
type Props = { navigation: CarListNav };

const makes = [
    { label: "Chevrolet", filter: "make=Chevrolet", logo: require("../../assets/chevroletLogo.png") },
    { label: "Ford", filter: "make=Ford", logo: require("../../assets/fordLogo.png") },
    { label: "GMC", filter: "make=GMC", logo: require("../../assets/gmcLogo.png") },
    { label: "Honda", filter: "make=Honda", logo: require("../../assets/hondaLogo.png") },
    { label: "Jeep", filter: "make=Jeep", logo: require("../../assets/jeepLogo.png") },
    { label: "Nissan", filter: "make=Nissan", logo: require("../../assets/nissanLogo.png") },
    { label: "Ram", filter: "make=Ram", logo: require("../../assets/RAMLogo.png") },
    { label: "Toyota", filter: "make=Toyota", logo: require("../../assets/toyotaLogo.png") },
];

export default function CarList({ navigation }: Props) {
    const [filter, setFilter] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
        refetch,
    } = getCarTruck(filter);
    const { setSelectedCarId } = useCar();
    const cars = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

    const openDetails = useCallback((id: number) => {
        setSelectedCarId(id);
        navigation.navigate("Details");
    }, [navigation, setSelectedCarId]);

    const renderCar = useCallback(({ item }: { item: CarTruckDTO }) => (
        <TruckCard {...item} onPress={openDetails} />
    ), [openDetails]);

    const keyExtractor = useCallback((item: CarTruckDTO) => item.id.toString(), []);

    const filters = (
        <View style={styles.filtersArea}>
            <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: filtersOpen }}
                onPress={() => setFiltersOpen((current) => !current)}
                style={({ pressed }) => [styles.filterToggle, pressed && styles.pressed]}
            >
                <View>
                    <Text style={styles.filterLabel}>Fabricante</Text>
                    <Text style={styles.filterValue}>
                        {makes.find((make) => make.filter === filter)?.label ?? "Todas as marcas"}
                    </Text>
                </View>
                <Text style={styles.chevron}>{filtersOpen ? "−" : "+"}</Text>
            </Pressable>

            {filtersOpen && (
                <GlassCard style={styles.filterPanel} contentStyle={styles.filterGrid}>
                    <Pressable
                        onPress={() => setFilter("")}
                        style={[styles.brandOption, !filter && styles.brandOptionActive]}
                    >
                        <Text style={[styles.allBrands, !filter && styles.brandTextActive]}>Todas</Text>
                    </Pressable>
                    {makes.map((make) => {
                        const active = filter === make.filter;
                        return (
                            <Pressable
                                accessibilityLabel={`Filtrar por ${make.label}`}
                                key={make.label}
                                onPress={() => setFilter(make.filter)}
                                style={[styles.brandOption, active && styles.brandOptionActive]}
                            >
                                <Image source={make.logo} style={styles.brandLogo} resizeMode="contain" />
                            </Pressable>
                        );
                    })}
                </GlassCard>
            )}

        </View>
    );

    const trailer = (
        <Pressable
            accessibilityRole="link"
            onPress={() => Linking.openURL("https://www.youtube.com/watch?v=3nW3UoOxV3k")}
            style={({ pressed }) => [styles.trailerCard, pressed && styles.pressed]}
        >
            <Image
                source={require("../../assets/RangerRaptorTrailer.png")}
                style={styles.trailerImage}
                resizeMode="cover"
            />
            <View style={styles.trailerOverlay} />
            <View style={styles.trailerContent}>
                <Text style={styles.footerEyebrow}>DESTAQUE FORD</Text>
                <Text style={styles.footerTitle}>Nova Ranger Raptor</Text>
                <Text style={styles.playText}>Assistir ao trailer</Text>
            </View>
        </Pressable>
    );

    return (
        <AppBackground>
            <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
                <View style={styles.screenContent}>
                    <View>
                        <Text style={styles.eyebrow}>INTELIGÊNCIA COMPETITIVA</Text>
                        <Text style={styles.title}>Radar de picapes</Text>
                        <Text style={styles.subtitle}>
                            Explore modelos, versões e especificações do mercado em um só lugar.
                        </Text>
                    </View>

                    {filters}

                    <View style={styles.sectionHeading}>
                        <Text style={styles.sectionTitle}>Mercado</Text>
                        <Text style={styles.resultCount}>{cars.length} veículos carregados</Text>
                    </View>

                    <View style={styles.listFrame}>
                        <FlatList
                            data={cars}
                            keyExtractor={keyExtractor}
                            renderItem={renderCar}
                            ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.brightBlue} style={styles.loader} /> : null}
                            ListEmptyComponent={
                                <GlassCard blur={false} contentStyle={styles.emptyState}>
                                    {isLoading ? (
                                        <ActivityIndicator size="large" color={colors.brightBlue} />
                                    ) : (
                                        <>
                                            <Text style={styles.emptyTitle}>Não foi possível exibir os veículos</Text>
                                            <Text style={styles.emptyText}>
                                                {error ? "Verifique a conexão com a API e tente novamente." : "Nenhum resultado para este filtro."}
                                            </Text>
                                            {error && (
                                                <Pressable onPress={() => refetch()} style={styles.retryButton}>
                                                    <Text style={styles.retryText}>Tentar novamente</Text>
                                                </Pressable>
                                            )}
                                        </>
                                    )}
                                </GlassCard>
                            }
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                            contentContainerStyle={styles.listContent}
                            showsVerticalScrollIndicator={false}
                            onEndReached={() => {
                                if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                            }}
                            onEndReachedThreshold={0.4}
                            removeClippedSubviews={Platform.OS === "android"}
                            initialNumToRender={3}
                            maxToRenderPerBatch={3}
                            updateCellsBatchingPeriod={80}
                            windowSize={5}
                        />
                    </View>

                    {trailer}
                </View>
            </SafeAreaView>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    screenContent: {
        flex: 1,
        width: "100%",
        maxWidth: 720,
        alignSelf: "center",
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: 82,
    },
    listContent: {
        flexGrow: 1,
        padding: spacing.sm,
    },
    eyebrow: { color: colors.brightBlue, fontFamily: fonts.semibold, fontSize: 11 },
    title: { color: colors.text, fontFamily: fonts.bold, fontSize: 30, marginTop: spacing.xs },
    subtitle: {
        color: colors.textMuted,
        fontFamily: fonts.regular,
        fontSize: 14,
        lineHeight: 21,
        marginTop: spacing.sm,
        maxWidth: 520,
    },
    filterToggle: {
        minHeight: 64,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: spacing.lg,
        paddingHorizontal: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        backgroundColor: "rgba(7, 32, 59, 0.68)",
    },
    filterLabel: { color: colors.textMuted, fontFamily: fonts.medium, fontSize: 10, textTransform: "uppercase" },
    filterValue: { color: colors.text, fontFamily: fonts.semibold, fontSize: 15, marginTop: 2 },
    chevron: { color: colors.brightBlue, fontFamily: fonts.regular, fontSize: 26 },
    filtersArea: { position: "relative", zIndex: 20 },
    filterPanel: {
        position: "absolute",
        top: 70,
        left: 0,
        right: 0,
        zIndex: 30,
        elevation: 16,
    },
    filterGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, padding: spacing.md },
    brandOption: {
        width: 58,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: "rgba(185, 225, 255, 0.10)",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
    },
    brandOptionActive: { borderColor: colors.brightBlue, backgroundColor: "rgba(57, 168, 255, 0.18)" },
    brandLogo: { width: 34, height: 28 },
    allBrands: { color: colors.textMuted, fontFamily: fonts.semibold, fontSize: 10 },
    brandTextActive: { color: colors.text },
    sectionHeading: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: spacing.md,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    sectionTitle: { color: colors.text, fontFamily: fonts.bold, fontSize: 20 },
    resultCount: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 10, textAlign: "right" },
    listFrame: {
        flex: 1,
        minHeight: 110,
        overflow: "hidden",
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        backgroundColor: "rgba(3, 18, 35, 0.42)",
    },
    separator: { height: spacing.md },
    emptyState: { alignItems: "center", padding: spacing.lg },
    emptyTitle: { color: colors.text, fontFamily: fonts.semibold, fontSize: 16, textAlign: "center" },
    emptyText: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, textAlign: "center", marginTop: spacing.sm },
    retryButton: { marginTop: spacing.md, borderRadius: radius.md, backgroundColor: colors.fordBlue, paddingHorizontal: spacing.md, paddingVertical: 12 },
    retryText: { color: colors.white, fontFamily: fonts.semibold, fontSize: 13 },
    loader: { marginVertical: spacing.md },
    footerEyebrow: { color: colors.brightBlue, fontFamily: fonts.semibold, fontSize: 10 },
    footerTitle: { color: colors.text, fontFamily: fonts.bold, fontSize: 17, marginTop: 2 },
    trailerCard: {
        overflow: "hidden",
        height: 180,
        marginTop: spacing.sm,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        backgroundColor: colors.navy900,
    },
    trailerImage: { width: "100%", height: "60%" },
    trailerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(2, 11, 24, 0.56)" },
    trailerContent: { flex: 1, justifyContent: "center", paddingHorizontal: spacing.md },
    playText: { color: colors.ice, fontFamily: fonts.semibold, fontSize: 11, marginTop: spacing.xs },
    pressed: { opacity: 0.72 },
});

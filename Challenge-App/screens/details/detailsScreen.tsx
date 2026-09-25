import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppBackground from "../../components/AppBackground";
import GlassCard from "../../components/GlassCard";
import { useCar } from "../../context/CarProvider";
import { getCarDetails } from "../../hooks/getCarDetail";
import { colors, fonts, radius, spacing } from "../../theme";

type DetailValue = string | number | string[] | null | undefined;

function formatValue(value: DetailValue, suffix = "") {
    if (value === null || value === undefined || value === "") return "Não informado";
    if (Array.isArray(value)) return value.length ? value.join(", ") : "Não informado";
    return `${value}${suffix}`;
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={[styles.detailValue, value === "Não informado" && styles.unavailable]}>{value}</Text>
        </View>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <GlassCard style={styles.sectionCard} contentStyle={styles.sectionContent}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionMarker} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            {children}
        </GlassCard>
    );
}

export default function Details() {
    const { selectedCarId } = useCar();
    const { data, isLoading, error, refetch } = getCarDetails(selectedCarId!);

    const price = data?.preco
        ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD" }).format(data.preco)
        : "Não informado";

    if (!selectedCarId) {
        return (
            <AppBackground>
                <SafeAreaView style={styles.centered} edges={["top", "left", "right"]}>
                    <Text style={styles.emptyDetailsText}>
                        Escolha um veículo para ver os detalhes.
                    </Text>
                </SafeAreaView>
            </AppBackground>
        );
    }

    if (isLoading) {
        return (
            <AppBackground>
                <SafeAreaView style={styles.centered} edges={["top", "left", "right"]}>
                    <Text style={styles.loadingText}>Carregando especificações...</Text>
                </SafeAreaView>
            </AppBackground>
        );
    }

    if (error) {
        return (
            <AppBackground>
                <SafeAreaView style={styles.centered} edges={["top", "left", "right"]}>
                    <GlassCard style={styles.messageCard} contentStyle={styles.messageContent}>
                        <Text style={styles.messageTitle}>Detalhes indisponíveis</Text>
                        <Text style={styles.messageText}>Não foi possível consultar este veículo agora.</Text>
                        <Pressable onPress={() => refetch()} style={styles.retryButton}>
                            <Text style={styles.retryText}>Tentar novamente</Text>
                        </Pressable>
                    </GlassCard>
                </SafeAreaView>
            </AppBackground>
        );
    }

    return (
        <AppBackground>
            <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.eyebrow}>FICHA TÉCNICA</Text>
                    <Text style={styles.vehicleTitle}>{data?.make} {data?.model}</Text>
                    <View style={styles.badges}>
                        <View style={styles.badge}><Text style={styles.badgeText}>{formatValue(data?.year)}</Text></View>
                        <View style={styles.badge}><Text style={styles.badgeText}>{formatValue(data?.type)}</Text></View>
                    </View>
                    <Text style={styles.trim}>{formatValue(data?.trim)}</Text>

                    <Section title="Desempenho">
                        <DetailRow label="Motor" value={formatValue(data?.motor)} />
                        <DetailRow label="Potência" value={formatValue(data?.potencia, " hp")} />
                        <DetailRow label="Torque" value={formatValue(data?.torqueMax, " lb-ft")} />
                        <DetailRow label="0 a 100 km/h" value={formatValue(data?.zeroACem, " s")} />
                    </Section>

                    <Section title="Mecânica">
                        <DetailRow label="Transmissão" value={formatValue(data?.transmissao)} />
                        <DetailRow label="Tração" value={formatValue(data?.tracao)} />
                        <DetailRow label="Amortecedores" value={formatValue(data?.amortecedores)} />
                    </Section>

                    <Section title="Configurações">
                        <DetailRow label="Modos de condução" value={formatValue(data?.modosConducao)} />
                        <DetailRow label="Modos de volante" value={formatValue(data?.modosVolante)} />
                        <DetailRow label="Modos de escapamento" value={formatValue(data?.modosEscapamento)} />
                        <DetailRow label="Modos de amortecedor" value={formatValue(data?.modosAmortecedor)} />
                    </Section>

                    <Section title="Equipamentos e valor">
                        <DetailRow label="Faróis" value={formatValue(data?.farois)} />
                        <DetailRow label="Rodas e pneus" value={formatValue(data?.rodasPneus)} />
                        <DetailRow label="Preço sugerido" value={price} />
                    </Section>
                </ScrollView>
            </SafeAreaView>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.md,
        paddingBottom: 72,
    },
    scrollContent: {
        width: "100%",
        maxWidth: 720,
        alignSelf: "center",
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: 112,
    },
    eyebrow: { 
        color: colors.brightBlue, 
        fontFamily: fonts.semibold, 
        fontSize: 11 
    },
    vehicleTitle: { 
        color: colors.text, 
        fontFamily: fonts.bold, 
        fontSize: 28, 
        marginTop: spacing.xs 
    },
    trim: { 
        color: colors.textMuted, 
        fontFamily: fonts.regular, 
        fontSize: 14, 
        lineHeight: 21, 
        marginTop: spacing.sm 
    },
    badges: { 
        flexDirection: "row", 
        flexWrap: "wrap", 
        gap: spacing.sm, 
        marginTop: spacing.md 
    },
    badge: { 
        borderRadius: radius.sm, 
        borderWidth: 1, 
        borderColor: colors.glassBorder, 
        backgroundColor: "rgba(57, 168, 255, 0.12)", 
        paddingHorizontal: spacing.sm, 
        paddingVertical: spacing.xs 
    },
    badgeText: { 
        color: colors.ice, 
        fontFamily: fonts.semibold, 
        fontSize: 11 
    },
    sectionCard: { marginTop: spacing.md },
    sectionContent: { padding: spacing.md },
    sectionHeader: { 
        flexDirection: "row", 
        alignItems: "center", 
        gap: spacing.sm, 
        marginBottom: spacing.xs 
    },
    sectionMarker: { 
        width: 3, 
        height: 18, 
        borderRadius: 2, 
        backgroundColor: colors.brightBlue 
    },
    sectionTitle: { 
        color: colors.text, 
        fontFamily: fonts.bold, 
        fontSize: 17 
    },
    detailRow: { 
        paddingVertical: 12, 
        borderBottomWidth: StyleSheet.hairlineWidth, 
        borderBottomColor: colors.glassBorder 
    },
    detailLabel: { 
        color: colors.textMuted, 
        fontFamily: fonts.medium, 
        fontSize: 10, 
        textTransform: "uppercase" },
    detailValue: { 
        color: colors.text, 
        fontFamily: fonts.medium, 
        fontSize: 14, 
        lineHeight: 20, 
        marginTop: 4 
    },
    unavailable: { 
        color: colors.textMuted, 
        fontFamily: fonts.regular 
    },
    messageCard: { 
        width: "100%", 
        maxWidth: 520 
    },
    messageContent: { 
        alignItems: "center", 
        padding: spacing.lg 
    },
    messageEyebrow: { 
        color: colors.brightBlue, 
        fontFamily: fonts.semibold, 
        fontSize: 10 },
    messageTitle: { 
        color: colors.text, 
        fontFamily: fonts.bold, 
        fontSize: 21, 
        textAlign: "center", 
        marginTop: spacing.xs 
    },
    messageText: { 
        color: colors.textMuted, 
        fontFamily: fonts.regular, 
        fontSize: 13, 
        lineHeight: 20, 
        textAlign: "center", 
        marginTop: spacing.sm 
    },
    loadingText: { 
        color: colors.text, 
        fontFamily: fonts.medium, 
        fontSize: 14 },
    emptyDetailsText: {
        color: colors.textMuted,
        fontFamily: fonts.medium,
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center",
    },
    retryButton: { 
        marginTop: spacing.md, 
        borderRadius: radius.md, 
        backgroundColor: colors.fordBlue, 
        paddingHorizontal: spacing.md, 
        paddingVertical: 12 
    },
    retryText: { 
        color: colors.white, 
        fontFamily: fonts.semibold, 
        fontSize: 13 },
});

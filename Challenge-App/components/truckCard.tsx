import { memo } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { useSavedCars } from "../context/SavedCarsProvider";
import { colors, fonts, radius, spacing } from "../theme";
import GlassCard from "./GlassCard";

interface CardProps {
    id: number;
    make: string;
    model: string;
    trim: string;
    type: string;
    year: number;
    onPress: (id: number) => void;
}

function TruckCard({ id, make, model, trim, type, year, onPress }: CardProps) {
    const { saveCar, removeCar, isSaved } = useSavedCars();
    const saved = isSaved(id);

    function toggleSaved() {
        if (saved) {
            removeCar(id);
            return;
        }

        saveCar({ id, make, model, trim, type, year });
    }

    return (
        <GlassCard blur={false} style={styles.card} contentStyle={styles.content}>
            <View style={styles.accent} />
            <View style={styles.heading}>
                <View style={styles.titleGroup}>
                    <Text style={styles.make}>{make}</Text>
                    <Text style={styles.model} numberOfLines={2}>{model}</Text>
                </View>
                <View style={styles.yearBadge}>
                    <Text style={styles.year}>{year}</Text>
                </View>
            </View>

            <View style={styles.metadata}>
                <Text style={styles.metaLabel}>Versão</Text>
                <Text style={styles.metaValue} numberOfLines={2}>{trim || "Não informada"}</Text>
                <View style={styles.divider} />
                <Text style={styles.metaLabel}>Categoria</Text>
                <Text style={styles.metaValue}>{type || "Picape"}</Text>
            </View>

            <View style={styles.actions}>
                <Pressable
                    accessibilityRole="button"
                    onPress={() => onPress(id)}
                    style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
                >
                    <Text style={styles.primaryButtonText}>Ver especificações</Text>
                </Pressable>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={saved ? "Remover dos salvos" : "Salvar veículo"}
                    onPress={toggleSaved}
                    style={({ pressed }) => [styles.saveButton, saved && styles.saveButtonActive, pressed && styles.pressed]}
                >
                    <Image
                        source={saved ? require("../assets/save-fill.png") : require("../assets/save.png")}
                        style={styles.saveIcon}
                        resizeMode="contain"
                    />
                </Pressable>
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    card: { width: "100%" },
    content: { padding: spacing.md },
    accent: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: 3,
        backgroundColor: colors.brightBlue,
    },
    heading: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: spacing.md,
    },
    titleGroup: { flex: 1, minWidth: 0 },
    make: {
        color: colors.brightBlue,
        fontFamily: fonts.semibold,
        fontSize: 11,
        textTransform: "uppercase",
    },
    model: {
        color: colors.text,
        fontFamily: fonts.bold,
        fontSize: 21,
        marginTop: 3,
    },
    yearBadge: {
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        backgroundColor: "rgba(57, 168, 255, 0.12)",
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
    },
    year: { color: colors.ice, fontFamily: fonts.semibold, fontSize: 12 },
    metadata: {
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.glassBorder,
    },
    metaLabel: {
        color: colors.textMuted,
        fontFamily: fonts.medium,
        fontSize: 10,
        textTransform: "uppercase",
    },
    metaValue: {
        color: colors.text,
        fontFamily: fonts.medium,
        fontSize: 13,
        marginTop: 2,
    },
    divider: { height: spacing.sm },
    actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
    primaryButton: {
        flex: 1,
        minHeight: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius.md,
        backgroundColor: colors.fordBlue,
        paddingHorizontal: spacing.md,
    },
    primaryButtonText: { color: colors.white, fontFamily: fonts.semibold, fontSize: 13 },
    saveButton: {
        width: 46,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        backgroundColor: "rgba(255, 255, 255, 0.06)",
    },
    saveButtonActive: {
        borderColor: "rgba(57, 168, 255, 0.62)",
        backgroundColor: "rgba(57, 168, 255, 0.15)",
    },
    saveIcon: { width: 22, height: 22 },
    pressed: { opacity: 0.72 },
});

export default memo(TruckCard);

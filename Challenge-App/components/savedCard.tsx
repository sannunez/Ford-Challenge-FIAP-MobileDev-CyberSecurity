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
    onPress: () => void;
}

function SavedCard({ id, make, model, trim, type, year, onPress }: CardProps) {
    const { removeCar } = useSavedCars();

    return (
        <GlassCard blur={false} style={styles.card} contentStyle={styles.content}>
            <View style={styles.heading}>
                <View style={styles.titleGroup}>
                    <Text style={styles.make}>{make}</Text>
                    <Text style={styles.title} numberOfLines={2}>{model}</Text>
                </View>
                <Text style={styles.year}>{year}</Text>
            </View>
            <Text style={styles.description} numberOfLines={2}>
                {trim || "Versão não informada"} · {type || "Picape"}
            </Text>
            <View style={styles.actions}>
                <Pressable
                    accessibilityRole="button"
                    onPress={onPress}
                    style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
                >
                    <Text style={styles.primaryButtonText}>Ver especificações</Text>
                </Pressable>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Remover dos salvos"
                    onPress={() => removeCar(id)}
                    style={({ pressed }) => [styles.removeButton, pressed && styles.pressed]}
                >
                    <Image source={require("../assets/save-fill.png")} style={styles.icon} resizeMode="contain" />
                </Pressable>
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    card: { width: "100%" },
    content: { padding: spacing.md },
    heading: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: spacing.md,
    },
    titleGroup: { flex: 1 },
    make: {
        color: colors.brightBlue,
        fontFamily: fonts.semibold,
        fontSize: 11,
        textTransform: "uppercase",
    },
    title: { 
        color: colors.text, 
        fontFamily: fonts.bold, 
        fontSize: 19, 
        marginTop: 2 
    },
    year: { 
        color: colors.ice, 
        fontFamily: fonts.semibold, 
        fontSize: 12, 
        paddingTop: 2 
    },
    description: {
        color: colors.textMuted,
        fontFamily: fonts.regular,
        fontSize: 13,
        lineHeight: 19,
        marginTop: spacing.sm,
    },
    actions: { 
        flexDirection: "row", 
        gap: spacing.sm, 
        marginTop: spacing.md 
    },
    primaryButton: {
        flex: 1,
        minHeight: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius.md,
        backgroundColor: colors.fordBlue,
        paddingHorizontal: spacing.md,
    },
    primaryButtonText: { 
        color: colors.white, 
        fontFamily: fonts.semibold, 
        fontSize: 13 
    },
    removeButton: {
        width: 46,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        backgroundColor: "rgba(57, 168, 255, 0.12)",
    },
    icon: { 
        width: 22, 
        height: 22 
    },
    pressed: { opacity: 0.72 },
});

export default memo(SavedCard);

import { useEffect, useRef } from "react";
import { Animated, Image, Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppBackground from "../../components/AppBackground";
import GlassCard from "../../components/GlassCard";
import { colors, fonts, spacing } from "../../theme";

export default function ReleaseScreen() {
    const { width } = useWindowDimensions();
    const fade = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(24)).current;
    const contentWidth = Math.min(width - spacing.md * 2, 688);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: Platform.OS !== "web" }),
            Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: Platform.OS !== "web" }),
        ]).start();
    }, [fade, translateY]);

    return (
        <AppBackground>
            <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Animated.View style={{ opacity: fade, transform: [{ translateY }] }}>
                        <Text style={styles.eyebrow}>NOVIDADE FORD</Text>
                        <Text style={styles.title}>Ranger Raptor 2026</Text>
                        <Text style={styles.subtitle}>
                            Performance extrema, tecnologia e capacidade off-road em uma picape feita para ir além.
                        </Text>

                        <Image
                            source={require("../../assets/ReleaseFlier.png")}
                            style={[styles.hero, { height: contentWidth }]}
                            resizeMode="contain"
                        />

                        <GlassCard style={styles.highlightCard} contentStyle={styles.highlightContent}>
                            <Text style={styles.highlightTitle}>O monstro das trilhas está chegando</Text>
                            <Image
                                source={require("../../assets/flierComplements.png")}
                                style={[styles.complements, { height: contentWidth / 4.86 }]}
                                resizeMode="contain"
                            />
                        </GlassCard>

                        <View style={styles.sectionHeading}>
                            <Text style={styles.sectionEyebrow}>VISÃO GERAL</Text>
                            <Text style={styles.sectionTitle}>Principais especificações</Text>
                        </View>
                        <GlassCard contentStyle={styles.tableFrame}>
                            <Image
                                source={require("../../assets/Tabela.png")}
                                style={[styles.table, { height: contentWidth * (1769 / 1448) }]}
                                resizeMode="contain"
                            />
                        </GlassCard>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
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
    title: { 
        color: colors.text, 
        fontFamily: fonts.bold, 
        fontSize: 30, 
        marginTop: spacing.xs 
    },
    subtitle: { 
        color: colors.textMuted, 
        fontFamily: fonts.regular, 
        fontSize: 14, lineHeight: 21, 
        marginTop: spacing.sm, 
        maxWidth: 520 
    },
    hero: { 
        width: "100%", 
        marginTop: spacing.md 
    },
    highlightCard: { marginTop: spacing.sm },
    highlightContent: { padding: spacing.md },
    highlightTitle: { 
        color: colors.text, 
        fontFamily: fonts.bold, 
        fontSize: 17, 
        textAlign: "center" 
    },
    complements: { 
        width: "100%", 
        marginTop: spacing.md 
    },
    sectionHeading: { 
        marginTop: spacing.xl, 
        marginBottom: spacing.md 
    },
    sectionEyebrow: { 
        color: colors.brightBlue, 
        fontFamily: fonts.semibold, 
        fontSize: 10 
    },
    sectionTitle: { 
        color: colors.text, 
        fontFamily: fonts.bold, 
        fontSize: 20, 
        marginTop: 3 
    },
    tableFrame: { padding: spacing.sm },
    table: { width: "100%" },
});

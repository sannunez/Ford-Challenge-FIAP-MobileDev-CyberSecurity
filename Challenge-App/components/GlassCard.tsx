import type { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { colors, glassShadow, radius } from "../theme";

type GlassCardProps = PropsWithChildren<{
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    blur?: boolean;
}>;

export default function GlassCard({ children, style, contentStyle, blur = true }: GlassCardProps) {
    return (
        <View style={[styles.shell, glassShadow, style]}>
            {blur && (
                <BlurView
                    intensity={38}
                    tint="systemThinMaterialDark"
                    experimentalBlurMethod="dimezisBlurView"
                    style={StyleSheet.absoluteFill}
                />
            )}
            <LinearGradient
                colors={[colors.glassHighlight, colors.glass, "rgba(3, 18, 35, 0.64)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.shine} />
            <View style={[styles.content, contentStyle]}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    shell: {
        overflow: "hidden",
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        backgroundColor: colors.glassStrong,
    },
    shine: {
        pointerEvents: "none",
        position: "absolute",
        top: 0,
        left: 18,
        right: 18,
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.35)",
    },
    content: {
        flex: 1,
    },
});

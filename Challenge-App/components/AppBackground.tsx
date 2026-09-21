import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "../theme";

export default function AppBackground({ children }: PropsWithChildren) {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.navy950, colors.navy900, colors.navy800]}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFill}
            />
            <LinearGradient
                colors={["rgba(11, 110, 243, 0.30)", "rgba(11, 110, 243, 0)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.topLight}
            />
            <View style={styles.lineOne} />
            <View style={styles.lineTwo} />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.navy950,
    },
    topLight: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "44%",
    },
    lineOne: {
        position: "absolute",
        top: "18%",
        left: -80,
        width: "145%",
        height: 1,
        backgroundColor: "rgba(116, 190, 255, 0.12)",
        transform: [{ rotate: "-12deg" }],
    },
    lineTwo: {
        position: "absolute",
        top: "62%",
        left: -100,
        width: "150%",
        height: 1,
        backgroundColor: "rgba(116, 190, 255, 0.08)",
        transform: [{ rotate: "10deg" }],
    },
});

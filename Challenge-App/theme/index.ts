export const colors = {
    navy950: "#020B18",
    navy900: "#06182C",
    navy800: "#0A2848",
    navy700: "#103B67",
    fordBlue: "#0B6EF3",
    brightBlue: "#39A8FF",
    ice: "#DDF1FF",
    white: "#FFFFFF",
    text: "#F6FAFF",
    textMuted: "#9CB4CA",
    glass: "rgba(12, 43, 75, 0.54)",
    glassStrong: "rgba(7, 28, 52, 0.78)",
    glassBorder: "rgba(185, 225, 255, 0.22)",
    glassHighlight: "rgba(255, 255, 255, 0.10)",
    success: "#55D6A5",
    warning: "#FFCA72",
    danger: "#FF7A8A",
} as const;

export const spacing = {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
} as const;

export const radius = {
    sm: 6,
    md: 8,
    lg: 12,
} as const;

export const fonts = {
    regular: "Montserrat_400Regular",
    medium: "Montserrat_500Medium",
    semibold: "Montserrat_600SemiBold",
    bold: "Montserrat_700Bold",
} as const;

export const glassShadow: ViewStyle = Platform.select<ViewStyle>({
    web: {
        boxShadow: "0 12px 18px rgba(0, 0, 0, 0.30)",
    },
    default: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 18,
        elevation: 8,
    },
}) ?? {};
import { Platform, type ViewStyle } from "react-native";

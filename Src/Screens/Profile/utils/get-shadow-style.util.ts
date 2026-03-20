import { Platform } from "react-native";

// Función getShadowStyle para sombras consistentes
export const getShadowStyle = (elevation) => {
    if (Platform.OS === 'android') {
        return {
            elevation: Math.min(elevation, 8), // Límite máximo en Android
        };
    }
    return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: elevation / 2 },
        shadowOpacity: 0.1 + (elevation * 0.02),
        shadowRadius: elevation,
    };
};
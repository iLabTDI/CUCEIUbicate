import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, Text, View } from "react-native";
import { SCREEN_DIMENSIONS } from "../constants/screen-dimentions";

const { isTablet } = SCREEN_DIMENSIONS;

// Componente para cards de información
export const InfoCard = ({ icon, title, value, color }) => (
    <View style={styles.infoCard}>
        <View style={[styles.infoIcon, { backgroundColor: color }]}>
            <FontAwesomeIcon icon={icon} size={16} color="#FFFFFF" />
        </View>
        <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>{title}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    // Info Cards
    infoCard: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: isTablet ? 12 : 11,
        color: "#6b7280",
        marginBottom: 2,
    },
    infoValue: {
        fontSize: isTablet ? 16 : 14,
        fontWeight: "600",
        color: "#1f2937",
    },
});
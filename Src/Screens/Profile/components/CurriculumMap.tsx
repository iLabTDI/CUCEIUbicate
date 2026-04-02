import { faBookOpen, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native-animatable";
import { degreeNames } from "../data/degree-names.data";
import { extractCareerCode } from "../utils/extract-career-code.util";
import { SCREEN_DIMENSIONS } from "../constants/screen-dimentions";

const { isTablet } = SCREEN_DIMENSIONS;

interface Props {
    degree_code: string;
    onPress?: () => void;
}

export const CurriculumMap = ({ degree_code, onPress }: Props) => {
    return (
        <View style={styles.section}>
            <TouchableOpacity
                style={styles.curriculumCard}
                onPress={onPress}
                activeOpacity={0.9}
            >
                <LinearGradient colors={["#1e40af", "#3b82f6"]} style={styles.curriculumGradient}>
                    <View style={styles.curriculumContent}>
                        <View style={styles.curriculumIcon}>
                            <FontAwesomeIcon icon={faBookOpen} size={24} color="#FFFFFF" />
                        </View>
                        <View style={styles.curriculumText}>
                            <Text style={styles.curriculumTitle}>Malla Curricular</Text>
                            <Text style={styles.curriculumSubtitle}>
                                {(() => {
                                    const careerCode = extractCareerCode(degree_code);
                                    return degreeNames[careerCode] || degree_code;
                                })()}
                            </Text>
                            <Text style={styles.curriculumDescription}>
                                Ver plan de estudios completo
                            </Text>
                        </View>
                        <FontAwesomeIcon icon={faChevronRight} size={20} color="#FFFFFF" />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    // Sections
    section: {
        marginBottom: 20,
    },
    // Curriculum Card
    curriculumCard: {
        borderRadius: 16,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    curriculumGradient: {
        padding: 20,
    },
    curriculumContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    curriculumIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    curriculumText: {
        flex: 1,
    },
    curriculumTitle: {
        fontSize: isTablet ? 18 : 16,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    curriculumSubtitle: {
        fontSize: isTablet ? 14 : 12,
        color: "#FFFFFF",
        opacity: 0.9,
        marginBottom: 2,
    },
    curriculumDescription: {
        fontSize: isTablet ? 12 : 11,
        color: "#FFFFFF",
        opacity: 0.8,
    },

});
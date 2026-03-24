
import { faBuilding, faCalendarAlt, faGraduationCap, faUniversity } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { SCREEN_DIMENSIONS } from '../constants/screen-dimentions';

const { isTablet } = SCREEN_DIMENSIONS;

export const UniversityInfoCard = () => {
    return (
        <View style={styles.universityCard}>
            <View style={styles.universityHeader}>
                <View style={styles.universityLogoContainer}>
                    <FontAwesomeIcon icon={faGraduationCap} size={24} color="#FFFFFF" />
                </View>
                <View style={styles.universityInfo}>
                    <Text style={styles.universityName}>Universidad de Guadalajara</Text>
                    <Text style={styles.centerName}>Centro Universitario de Ciencias Exactas e Ingenierías</Text>
                </View>
            </View>

            <View style={styles.universityStats}>
                <View style={styles.universityStatItem}>
                    <View style={styles.statIconContainer}>
                        <FontAwesomeIcon icon={faBuilding} size={16} color="#1e40af" />
                    </View>
                    <View style={styles.statInfoContainer}>
                        <Text style={styles.statValueNew}>CUCEI</Text>
                        <Text style={styles.statLabelNew}>Centro Universitario</Text>
                    </View>
                </View>

                <View style={styles.universityStatItem}>
                    <View style={styles.statIconContainer}>
                        <FontAwesomeIcon icon={faUniversity} size={16} color="#1e40af" />
                    </View>
                    <View style={styles.statInfoContainer}>
                        <Text style={styles.statValueNew}>UDG</Text>
                        <Text style={styles.statLabelNew}>Universidad</Text>
                    </View>
                </View>

                <View style={styles.universityStatItem}>
                    <View style={styles.statIconContainer}>
                        <FontAwesomeIcon icon={faCalendarAlt} size={16} color="#1e40af" />
                    </View>
                    <View style={styles.statInfoContainer}>
                        <Text style={styles.statValueNew}>2026</Text>
                        <Text style={styles.statLabelNew}>Ciclo Escolar</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    // University Card
    universityCard: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        marginTop: 10,
    },
    universityHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    universityLogoContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    universityInfo: {
        flex: 1,
    },
    universityName: {
        fontSize: isTablet ? 18 : 16,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    centerName: {
        fontSize: isTablet ? 12 : 11,
        color: "#FFFFFF",
        opacity: 0.9,
        lineHeight: 16,
    },
    universityStats: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    universityStatItem: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginHorizontal: 5,
    },
    statIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    statInfoContainer: {
        flex: 1,
    },
    statValueNew: {
        fontSize: isTablet ? 14 : 12,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    statLabelNew: {
        fontSize: isTablet ? 10 : 9,
        color: "#FFFFFF",
        opacity: 0.8,
    },
});
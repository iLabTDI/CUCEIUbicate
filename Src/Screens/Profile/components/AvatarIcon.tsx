import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { SCREEN_DIMENSIONS } from '../constants/screen-dimentions'

const { ICON_SIZE } = SCREEN_DIMENSIONS;

interface Props {
    icon: {
        id: string;
        uri: string;
    };
    selectedIcon: string | null;
    handleAvatarChange: (uri: string) => void;
}

export const AvatarIcon = ({ icon, selectedIcon, handleAvatarChange }: Props) => {
    return (
        <TouchableOpacity
            onPress={() => handleAvatarChange(icon.uri)}
            style={[
                styles.iconButton,
                selectedIcon === icon.uri && styles.selectedIconButton,
            ]}
            activeOpacity={0.7}
        >
            <View style={styles.iconImageContainer}>
                <Image
                    source={icon.uri}
                    style={[
                        styles.iconImage,
                        selectedIcon === icon.uri && styles.selectedIconImage,
                    ]}
                />
                {selectedIcon === icon.uri && (
                    <View style={styles.selectedBadge}>
                        <FontAwesomeIcon icon={faCheckCircle} size={14} color="#10b981" />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    iconGrid: {
        paddingVertical: 20,
        justifyContent: "center",
    },
    iconButton: {
        margin: 8,
        borderRadius: ICON_SIZE / 2,
        overflow: "hidden",
        width: ICON_SIZE,
        height: ICON_SIZE,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        borderWidth: 2,
        borderColor: "#e5e7eb",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    selectedIconButton: {
        borderColor: "#10b981",
        backgroundColor: "#ecfdf5",
        elevation: 4,
        shadowOpacity: 0.15,
    },
    iconImageContainer: {
        position: "relative",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    iconImage: {
        width: ICON_SIZE - 8,
        height: ICON_SIZE - 8,
        borderRadius: (ICON_SIZE - 8) / 2,
    },
    selectedIconImage: {
        borderWidth: 2,
        borderColor: "#10b981",
    },
    selectedBadge: {
        position: "absolute",
        bottom: 2,
        right: 2,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 2,
        elevation: 2,
    },
});

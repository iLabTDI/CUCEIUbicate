import { faCamera, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react'
import { FlatList, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { animalIcons } from '../Data_iconos_mallas';
import { AvatarIcon } from './AvatarIcon';
import { SCREEN_DIMENSIONS } from '../constants/screen-dimentions';

const { isTablet, SCREEN_HEIGHT } = SCREEN_DIMENSIONS;

interface Props {
    onClose: () => void;
    isVisible: boolean;
    onAvatarChange: (uri: string) => void;
    selectedAvatar: string | null;
}

export const SelectAvatarModal = ({ onClose, isVisible, onAvatarChange, selectedAvatar }: Props) => {

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.avatarModal}>
                    {/* Header del Modal */}
                    <View style={styles.modalHeader}>
                        <View style={styles.modalHeaderContent}>
                            <View style={styles.modalIconContainer}>
                                <FontAwesomeIcon icon={faCamera} size={24} color="#1e40af" />
                            </View>
                            <View style={styles.modalHeaderText}>
                                <Text style={styles.modalTitle}>Selecciona tu Avatar</Text>
                                <Text style={styles.modalSubtitle}>Elige tu imagen de perfil favorita</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={onClose}
                        >
                            <FontAwesomeIcon icon={faTimes} size={20} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Contenido del Modal */}
                    <View style={styles.modalContent}>
                        <FlatList
                            data={animalIcons}
                            renderItem={({ item }) => (
                                <AvatarIcon
                                    icon={item}
                                    selectedIcon={selectedAvatar}
                                    handleAvatarChange={onAvatarChange}
                                />
                            )}
                            keyExtractor={(item) => item.id}
                            numColumns={4}
                            contentContainerStyle={styles.iconGrid}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>

                    {/* Footer del Modal */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={onClose}
                        >
                            <Text style={styles.modalCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // Modal Overlay
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingHorizontal: 20,
    },

    // Avatar Modal
    avatarModal: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        width: "100%",
        maxWidth: 400,
        height: "55%",
        maxHeight: SCREEN_HEIGHT,
        paddingBottom: Platform.OS === "ios" ? 20 : 15,
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
    },
    modalHeaderContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    modalIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#eff6ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    modalHeaderText: {
        flex: 1,
    },
    modalTitle: {
        fontSize: isTablet ? 20 : 18,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 2,
    },
    modalSubtitle: {
        fontSize: isTablet ? 14 : 13,
        color: "#6b7280",
    },
    modalCloseButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    modalFooter: {
        paddingHorizontal: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#f3f4f6",
    },
    modalCancelButton: {
        backgroundColor: "#f3f4f6",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    modalCancelText: {
        fontSize: isTablet ? 16 : 14,
        fontWeight: "600",
        color: "#6b7280",
    },
    iconGrid: {
        paddingVertical: 20,
        justifyContent: "center",
    },
});
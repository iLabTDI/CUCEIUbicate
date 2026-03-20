import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { LinearGradient } from "expo-linear-gradient";
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { extractCareerCode } from "../utils/extract-career-code.util";
import { degreeNames } from "../data/degree-names.data";
import { faBookOpen, faImage, faTimes } from "@fortawesome/free-solid-svg-icons";
import { careerImages } from "../Data_iconos_mallas";
import ImageZoom, { type ImageZoomProps } from "react-native-image-pan-zoom";
import { getShadowStyle } from "../utils/get-shadow-style.util";
import React from "react";
import { SCREEN_DIMENSIONS } from "../constants/screen-dimentions";

const { isTablet, SCREEN_WIDTH, SCREEN_HEIGHT } = SCREEN_DIMENSIONS;

interface Props {
    isCurriculumModalVisible: boolean;
    onClose: () => void;
    degree_code: string;
}

const ImageZoomWithChildren = ImageZoom as React.ComponentType<
    ImageZoomProps & { children?: React.ReactNode }
>;

export const CurriculumMapModal = ({ isCurriculumModalVisible, onClose, degree_code }: Props) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isCurriculumModalVisible}
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={styles.curriculumModalOverlay}>
                <View style={styles.curriculumModalContent}>
                    {/* Header Mejorado */}
                    <LinearGradient
                        colors={['#1e40af', '#3b82f6']}
                        style={styles.curriculumModalHeader}
                    >
                        <View style={styles.curriculumModalHeaderLeft}>
                            <View style={styles.curriculumHeaderIconContainer}>
                                <FontAwesomeIcon icon={faBookOpen} size={22} color="#FFFFFF" />
                            </View>
                            <View style={styles.curriculumHeaderTextContainer}>
                                <Text style={styles.curriculumModalTitle}>Malla Curricular</Text>
                                <Text style={styles.curriculumModalSubtitle}>
                                    {(() => {
                                        const careerCode = extractCareerCode(degree_code);
                                        return degreeNames[careerCode] || degree_code;
                                    })()}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.curriculumModalCloseButton}
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <FontAwesomeIcon icon={faTimes} size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </LinearGradient>

                    {/* Contenedor de Imagen Optimizado */}
                    <View style={styles.curriculumImageContainer}>
                        {(() => {
                            const careerCode = extractCareerCode(degree_code);
                            return careerImages[careerCode] ? (
                                <View style={styles.imageZoomWrapper}>
                                    <ImageZoomWithChildren
                                        cropWidth={SCREEN_WIDTH * 0.95}
                                        cropHeight={SCREEN_HEIGHT * 0.75}
                                        imageWidth={SCREEN_WIDTH * 0.95}
                                        imageHeight={SCREEN_HEIGHT * 0.75}
                                        enableSwipeDown={true}
                                        onSwipeDown={onClose}
                                        minScale={0.5}
                                        maxScale={4}
                                        enableCenterFocus={true}
                                        doubleClickInterval={250}
                                        enableDoubleClickZoom={true}
                                        pinchToZoom={true}
                                        panToMove={true}
                                        clickDistance={10}

                                    >
                                        <Image
                                            source={careerImages[careerCode]}
                                            style={styles.curriculumImage}
                                            resizeMode="contain"
                                            fadeDuration={300}
                                        />
                                    </ImageZoomWithChildren>

                                    {/* Indicador de Zoom */}
                                    <View style={styles.zoomIndicator}>
                                        <FontAwesomeIcon icon={faImage} size={14} color="#6b7280" />
                                        <Text style={styles.zoomIndicatorText}>
                                            Pellizca para hacer zoom
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.noImageContainer}>
                                    <View style={styles.noImageIconContainer}>
                                        <FontAwesomeIcon icon={faImage} size={64} color="#d1d5db" />
                                    </View>
                                    <Text style={styles.noImageTitle}>
                                        Malla curricular no disponible
                                    </Text>
                                    <Text style={styles.noImageSubtext}>
                                        Esta carrera aún no tiene malla curricular disponible en el sistema
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.noImageButton}
                                        onPress={onClose}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.noImageButtonText}>Entendido</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })()}
                    </View>

                    {/* Footer con Acciones */}
                    {(() => {
                        const careerCode = extractCareerCode(degree_code);
                        return careerImages[careerCode] && (
                            <View style={styles.curriculumModalFooter}>
                                <View style={styles.footerActions}>
                                    <TouchableOpacity
                                        style={styles.footerActionButton}
                                        activeOpacity={0.8}
                                    >
                                        <FontAwesomeIcon icon={faBookOpen} size={16} color="#3b82f6" />
                                        <Text style={styles.footerActionText}>Detalles</Text>
                                    </TouchableOpacity>

                                    <View style={styles.footerDivider} />

                                    <TouchableOpacity
                                        style={styles.footerCloseButton}
                                        onPress={onClose}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.footerCloseText}>Cerrar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })()}
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    // Curriculum Modal - COMPLETAMENTE REDISEÑADO Y HERMOSO
    curriculumModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Platform.OS === 'android' ? 8 : 12,
        paddingVertical: Platform.OS === 'android' ? 20 : 30,
    },

    curriculumModalContent: {
        width: '100%',
        height: Platform.OS === 'android' ? '92%' : '90%',
        maxWidth: isTablet ? 800 : SCREEN_WIDTH * 0.95,
        borderRadius: Platform.OS === 'android' ? 16 : 20,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        ...getShadowStyle(15),
    },

    // Header Hermoso con Gradiente
    curriculumModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Platform.OS === 'android' ? 18 : 20,
        paddingVertical: Platform.OS === 'android' ? 16 : 18,
        paddingTop: Platform.OS === 'ios' ? 50 : 25,
        minHeight: Platform.OS === 'android' ? 70 : 75,
    },

    curriculumModalHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    curriculumHeaderIconContainer: {
        width: Platform.OS === 'android' ? 44 : 48,
        height: Platform.OS === 'android' ? 44 : 48,
        borderRadius: Platform.OS === 'android' ? 22 : 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },

    curriculumHeaderTextContainer: {
        flex: 1,
    },

    curriculumModalTitle: {
        fontSize: Platform.OS === 'android' ? (isTablet ? 18 : 16) : (isTablet ? 20 : 18),
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    curriculumModalSubtitle: {
        fontSize: Platform.OS === 'android' ? (isTablet ? 12 : 11) : (isTablet ? 14 : 12),
        color: '#FFFFFF',
        opacity: 0.9,
        fontWeight: '500',
    },

    curriculumModalCloseButton: {
        width: Platform.OS === 'android' ? 40 : 44,
        height: Platform.OS === 'android' ? 40 : 44,
        borderRadius: Platform.OS === 'android' ? 20 : 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        ...getShadowStyle(3),
    },

    // Contenedor de Imagen Optimizado
    curriculumImageContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
        position: 'relative',
    },

    imageZoomWrapper: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#FFFFFF',
    },

    curriculumImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
    },

    // Indicador de Zoom
    zoomIndicator: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        marginHorizontal: 40,
        paddingVertical: Platform.OS === 'android' ? 8 : 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        ...getShadowStyle(4),
    },

    zoomIndicatorText: {
        color: '#FFFFFF',
        fontSize: Platform.OS === 'android' ? 12 : 13,
        marginLeft: 6,
        fontWeight: '500',
    },

    // Estado Sin Imagen Mejorado
    noImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingHorizontal: 40,
    },

    noImageIconContainer: {
        width: Platform.OS === 'android' ? 100 : 120,
        height: Platform.OS === 'android' ? 100 : 120,
        borderRadius: Platform.OS === 'android' ? 50 : 60,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#e5e7eb',
        ...getShadowStyle(2),
    },

    noImageTitle: {
        fontSize: Platform.OS === 'android' ? (isTablet ? 18 : 16) : (isTablet ? 20 : 18),
        fontWeight: 'bold',
        color: '#374151',
        textAlign: 'center',
        marginBottom: 8,
    },

    noImageSubtext: {
        fontSize: Platform.OS === 'android' ? (isTablet ? 14 : 13) : (isTablet ? 16 : 14),
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: Platform.OS === 'android' ? 18 : 20,
        marginBottom: 24,
    },

    noImageButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        ...getShadowStyle(3),
    },

    noImageButtonText: {
        color: '#FFFFFF',
        fontSize: Platform.OS === 'android' ? 14 : 15,
        fontWeight: '600',
    },

    // Footer con Acciones
    curriculumModalFooter: {
        backgroundColor: '#f8fafc',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingHorizontal: Platform.OS === 'android' ? 18 : 20,
        paddingVertical: Platform.OS === 'android' ? 14 : 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    },

    footerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    footerActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#dbeafe',
        ...getShadowStyle(1),
    },

    footerActionText: {
        color: '#3b82f6',
        fontSize: Platform.OS === 'android' ? 13 : 14,
        fontWeight: '600',
        marginLeft: 6,
    },

    footerDivider: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e7eb',
        marginHorizontal: 16,
    },

    footerCloseButton: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        ...getShadowStyle(1),
    },

    footerCloseText: {
        color: '#6b7280',
        fontSize: Platform.OS === 'android' ? 13 : 14,
        fontWeight: '600',
    },
})
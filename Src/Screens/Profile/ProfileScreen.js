import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSignOutAlt,
  faUser,
  faIdCard,
  faGraduationCap,
  faEnvelope,
  faTimes,
  faCamera,
  faImage,
  faBookOpen,
  faChevronRight,
  faBuilding,
  faUniversity,
  faCalendarAlt,
  faCheckCircle,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import ImageZoom from "react-native-image-pan-zoom";
import { animalIcons, careerImages } from "./Data_iconos_mallas";
import { clearSession } from "../../auth/SessionManager";
import defaultAvatar from "../../assets/images/usuario.png";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const ICON_SIZE = SCREEN_WIDTH * 0.15;
const isTablet = SCREEN_WIDTH >= 768;

// Función getShadowStyle para sombras consistentes
const getShadowStyle = (elevation) => {
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

const degreeNames = {
  ICIV: "Ingeniería Civil",
  IGFO: "Ingeniería en Fotónica",
  INBI: "Ingeniería Biomédica",
  INCE: "Ingeniería en Comunicaciones y Electrónica",
  INCO: "Ingeniería en Computación",
  INDU: "Ingeniería Industrial",
  INFO: "Ingeniería en Informática",
  INME: "Ingeniería Mecánica Eléctrica",
  INQU: "Ingeniería Química",
  INRO: "Ingeniería en Robótica",
  ITOG: "Ingeniería en Topografía Geomática",
  LCMA: "Licenciatura en Ciencia de Materiales",
  "LIAB/LINA": "Ingeniería en Alimentos y Biotecnología",
  LIFI: "Licenciatura en Física",
  LIMA: "Licenciatura en Matemáticas",
  LOGT: "Ingeniería en Logística y Transporte",
  LQFB: "Licenciatura en Químico Farmacéutico Biólogo",
  LQUI: "Licenciatura en Química",
};

// Componente para cards de información
const InfoCard = ({ icon, title, value, color }) => (
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

export const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  const userData = Array.isArray(user) ? user[0] : user;

  // Función para extraer el código de carrera del string completo
  const extractCareerCode = (degreeString) => {
    if (!degreeString) return null;
    
    // Si ya es solo el código (4-5 letras mayúsculas), devolverlo tal como está
    if (/^[A-Z]{3,5}$/.test(degreeString.trim())) {
      return degreeString.trim();
    }
    
    // Si contiene un string largo, extraer el código del final
    const match = degreeString.match(/\b([A-Z]{3,5})\b$/);
    return match ? match[1] : null;
  };

  const [selectedIcon, setSelectedIcon] = useState(userData.avatar || defaultAvatar);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [isCurriculumModalVisible, setCurriculumModalVisible] = useState(false);
  const [loadingIcons, setLoadingIcons] = useState(true);
  const [loadedIcons, setLoadedIcons] = useState({});

  useEffect(() => {
    loadSelectedIcon();
    const timerId = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    // Cargar iconos inmediatamente sin delay
    const iconsWithDelay = animalIcons.reduce((acc, icon) => {
      acc[icon.id] = true;
      return acc;
    }, {});
    setLoadedIcons(iconsWithDelay);
    setLoadingIcons(false);
  }, []);

  const loadSelectedIcon = async () => {
    try {
      const savedIcon = await AsyncStorage.getItem("selectedIcon");
      if (savedIcon) setSelectedIcon(JSON.parse(savedIcon));
    } catch (error) {
      console.error("Error loading selected icon:", error);
    }
  };

  const saveSelectedIcon = async (icon) => {
    try {
      await AsyncStorage.setItem("selectedIcon", JSON.stringify(icon));
    } catch (error) {
      console.error("Error saving selected icon:", error);
    }
  };

  const handleAvatarChange = (newAvatar) => {
    setSelectedIcon(newAvatar);
    saveSelectedIcon(newAvatar);
    setAvatarModalVisible(false);
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, cerrar sesión", onPress: confirmLogout },
      ]
    );
  };

  const confirmLogout = () => {
    clearSession();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const renderIcon = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleAvatarChange(item.uri)}
        style={[
          styles.iconButton,
          selectedIcon === item.uri && styles.selectedIconButton,
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.iconImageContainer}>
          <Image
            source={item.uri}
            style={[
              styles.iconImage,
              selectedIcon === item.uri && styles.selectedIconImage,
            ]}
          />
          {selectedIcon === item.uri && (
            <View style={styles.selectedBadge}>
              <FontAwesomeIcon icon={faCheckCircle} size={14} color="#10b981" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient colors={["#1e40af", "#3b82f6", "#60a5fa"]} style={styles.header}>
          <View style={styles.headerContent}>
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <Image source={selectedIcon} style={styles.avatar} />
                <TouchableOpacity
                  style={styles.editAvatarButton}
                  onPress={() => setAvatarModalVisible(true)}
                  activeOpacity={0.8}
                >
                  <FontAwesomeIcon icon={faCamera} size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {userData.name} {userData.lastnames}
                </Text>
                <Text style={styles.userUsername}>@{userData.username}</Text>
                
                <View style={styles.statusBadge}>
                  <FontAwesomeIcon icon={faCheckCircle} size={14} color="#10b981" />
                  <Text style={styles.statusText}>Activo</Text>
                </View>
              </View>
            </View>

            {/* University Info Card */}
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
                    <Text style={styles.statValueNew}>2025</Text>
                    <Text style={styles.statLabelNew}>Ciclo Escolar</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          {/* Información Personal */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <FontAwesomeIcon icon={faUser} size={20} color="#1e40af" />
              <Text style={styles.sectionTitle}>Mi Información</Text>
            </View>
            
            <View style={styles.card}>
              <InfoCard
                icon={faUser}
                title="Nombre de Usuario"
                value={`@${userData.username}`}
                color="#3b82f6"
              />
              <InfoCard
                icon={faIdCard}
                title="Código Estudiantil"
                value={userData.code}
                color="#6366f1"
              />
              <InfoCard
                icon={faGraduationCap}
                title="Programa Académico"
                value={degreeNames[userData.degree_code] || userData.degree_code}
                color="#8b5cf6"
              />
              <InfoCard
                icon={faEnvelope}
                title="Correo Institucional"
                value={userData.email}
                color="#06b6d4"
              />
            </View>
          </View>

          {/* Malla Curricular */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.curriculumCard}
              onPress={() => setCurriculumModalVisible(true)}
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
                        const careerCode = extractCareerCode(userData.degree_code);
                        return degreeNames[careerCode] || userData.degree_code;
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

          {/* Botón de Logout */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <FontAwesomeIcon icon={faSignOutAlt} size={20} color="#dc2626" />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal para selección de avatar */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isAvatarModalVisible}
        onRequestClose={() => setAvatarModalVisible(false)}
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
                onPress={() => setAvatarModalVisible(false)}
              >
                <FontAwesomeIcon icon={faTimes} size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Contenido del Modal */}
            <View style={styles.modalContent}>
              <FlatList
                data={animalIcons}
                renderItem={renderIcon}
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
                onPress={() => setAvatarModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para Malla Curricular - SÚPER MEJORADO */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCurriculumModalVisible}
        onRequestClose={() => setCurriculumModalVisible(false)}
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
                      const careerCode = extractCareerCode(userData.degree_code);
                      return degreeNames[careerCode] || userData.degree_code;
                    })()}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.curriculumModalCloseButton}
                onPress={() => setCurriculumModalVisible(false)}
                activeOpacity={0.8}
              >
                <FontAwesomeIcon icon={faTimes} size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>

            {/* Contenedor de Imagen Optimizado */}
            <View style={styles.curriculumImageContainer}>
              {(() => {
                const careerCode = extractCareerCode(userData.degree_code);
                return careerImages[careerCode] ? (
                  <View style={styles.imageZoomWrapper}>
                    <ImageZoom
                      cropWidth={SCREEN_WIDTH * 0.95}
                      cropHeight={SCREEN_HEIGHT * 0.75}
                      imageWidth={SCREEN_WIDTH * 0.95}
                      imageHeight={SCREEN_HEIGHT * 0.75}
                      enableSwipeDown={true}
                      onSwipeDown={() => setCurriculumModalVisible(false)}
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
                    </ImageZoom>
                    
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
                      onPress={() => setCurriculumModalVisible(false)}
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
              const careerCode = extractCareerCode(userData.degree_code);
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
                      onPress={() => setCurriculumModalVisible(false)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    flex: 1,
  },

  // Header
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
  },

  // Avatar Section
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: isTablet ? 120 : 100,
    height: isTablet ? 120 : 100,
    borderRadius: isTablet ? 60 : 50,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3b82f6",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  // User Info
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 5,
  },
  userUsername: {
    fontSize: isTablet ? 16 : 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 5,
  },

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

  // Content
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginLeft: 10,
  },

  // Cards
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

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

  // Logout Button
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
    elevation: 2,
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: "600",
    color: "#dc2626",
    marginLeft: 8,
  },

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

  // Icon Grid
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
});

export default ProfileScreen;
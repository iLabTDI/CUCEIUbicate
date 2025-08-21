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
                  <Text style={styles.statusText}>A</Text>
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

          {/* Fecha Actual */}
          <View style={styles.section}>
            <View style={styles.card}>
              <View style={styles.dateCard}>
                <View style={styles.dateIconContainer}>
                  <FontAwesomeIcon icon={faCalendar} size={20} color="#3b82f6" />
                </View>
                <View style={styles.dateContent}>
                  <Text style={styles.dateTitle}>Fecha Actual</Text>
                  <Text style={styles.dateText}>
                    {currentDate.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>
            </View>
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

      {/* Modal para selección de avatar - MEJORADO */}
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

      {/* Modal para Malla Curricular */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCurriculumModalVisible}
        onRequestClose={() => setCurriculumModalVisible(false)}
      >
        <View style={styles.curriculumModalOverlay}>
          <View style={styles.curriculumModalContent}>
            <View style={styles.curriculumModalHeader}>
              <View style={styles.curriculumModalHeaderLeft}>
                <FontAwesomeIcon icon={faBookOpen} size={20} color="#1e40af" />
                <Text style={styles.curriculumModalTitle}>Malla Curricular</Text>
              </View>
              <TouchableOpacity
                style={styles.curriculumModalCloseButton}
                onPress={() => setCurriculumModalVisible(false)}
              >
                <FontAwesomeIcon icon={faTimes} size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.curriculumImageContainer}>
              <ImageZoom
                cropWidth={SCREEN_WIDTH * 0.9}
                cropHeight={SCREEN_HEIGHT * 0.7}
                imageWidth={SCREEN_WIDTH * 0.9}
                imageHeight={SCREEN_HEIGHT * 0.7}
                enableSwipeDown={true}
                onSwipeDown={() => setCurriculumModalVisible(false)}
                minScale={0.8}
                maxScale={3}
                enableCenterFocus={true}
              >
                {(() => {
                  const careerCode = extractCareerCode(userData.degree_code);
                  return careerImages[careerCode] ? (
                    <Image
                      source={careerImages[careerCode]}
                      style={styles.curriculumImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.noImageContainer}>
                      <FontAwesomeIcon icon={faImage} size={48} color="#9ca3af" />
                      <Text style={styles.noImageText}>
                        Malla curricular no disponible
                      </Text>
                      <Text style={styles.noImageSubtext}>
                        Esta carrera aún no tiene malla curricular disponible
                      </Text>
                    </View>
                  );
                })()}
              </ImageZoom>
            </View>
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

  // University Card - NUEVO Y MEJORADO
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

  // Date Card
  dateCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  dateContent: {
    flex: 1,
  },
  dateTitle: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  dateText: {
    fontSize: isTablet ? 16 : 14,
    color: "#6b7280",
    textTransform: "capitalize",
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

  // Modal Overlay - CENTRADO
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
  },

  // Avatar Modal - COMPLETAMENTE REDISEÑADO Y CENTRADO
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

  // Loading
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: isTablet ? 16 : 14,
    color: "#6b7280",
    marginTop: 10,
    textAlign: "center",
  },

  // Icon Grid - LIMPIO
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

  // Curriculum Modal
  curriculumModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  curriculumModalContent: {
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.9,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  curriculumModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  curriculumModalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  curriculumModalTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginLeft: 10,
  },
  curriculumModalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  curriculumImageContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  curriculumImage: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  noImageText: {
    fontSize: isTablet ? 16 : 14,
    color: "#6b7280",
    marginTop: 10,
    textAlign: "center",
  },
  noImageSubtext: {
    fontSize: isTablet ? 12 : 11,
    color: "#9ca3af",
    marginTop: 5,
    textAlign: "center",
  },
});

export default ProfileScreen;

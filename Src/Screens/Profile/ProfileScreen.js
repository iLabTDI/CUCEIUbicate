import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
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
  faCamera,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { clearSession } from "../../auth/SessionManager";
import defaultAvatar from "../../assets/images/usuario.png";
import { CurriculumMapModal } from "./components/CurriculumMapModal";
import { CurriculumMap } from "./components/CurriculumMap";
import { InfoCard } from "./components/InfoCard";
import { degreeNames } from "./data/degree-names.data";
import { UniversityInfoCard } from "./components/UniversityInfoCard";
import { SelectAvatarModal } from "./components/SelectAvatarModal";
import { SCREEN_DIMENSIONS } from "./constants/screen-dimentions";

const { isTablet } = SCREEN_DIMENSIONS;

export const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  const userData = Array.isArray(user) ? user[0] : user;

  // ✨ LOG PARA DEBUG - Ver qué datos llegan al ProfileScreen
  console.log('📊 ProfileScreen - user desde route.params:', user);
  console.log('📊 ProfileScreen - userData procesado:', userData);
  console.log('📊 ProfileScreen - código específico:', userData?.code || userData?.user_code || userData?.codigo || userData?.int_user_code);

  // ✨ FUNCIÓN HELPER PARA OBTENER EL CÓDIGO
  const getUserCode = (userData) => {
    return userData?.code ||
      userData?.user_code ||
      userData?.codigo ||
      userData?.int_user_code ||
      userData?.id ||
      'Sin código';
  };

  const [selectedIcon, setSelectedIcon] = useState(userData.avatar || defaultAvatar);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [isCurriculumModalVisible, setCurriculumModalVisible] = useState(false);

  useEffect(() => {
    loadSelectedIcon();
    const timerId = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timerId);
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
            {userData.userType !== "externo" && userData.userType && (<UniversityInfoCard />)}
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
              {userData.userType && (
                <InfoCard
                  icon={faUser}
                  title="Tipo de Usuario"
                  value={userData.userType.charAt(0).toUpperCase() + userData.userType.slice(1)}
                  color="#2563eb"
                />
              )}
              {userData.userType !== "externo" && userData.userCode !== "" && (
                <InfoCard
                  icon={faIdCard}
                  title="Código Estudiante/Academico"
                  value={getUserCode(userData)} // ✨ USAR LA FUNCIÓN HELPER
                  color="#6366f1"
                />
              )}

              {userData.userType === "estudiante" && (
                <InfoCard
                  icon={faGraduationCap}
                  title="Programa Académico"
                  value={degreeNames[userData.degree_code] || userData.degree_code}
                  color="#8b5cf6"
                />
              )}
              <InfoCard
                icon={faEnvelope}
                title="Correo Institucional"
                value={userData.email}
                color="#06b6d4"
              />
            </View>
          </View>

          {/* Malla Curricular */}
          {userData.userType === "estudiante" && (
            <CurriculumMap
              degree_code={userData.degree_code}
              onPress={() => setCurriculumModalVisible(true)}
            />
          )}

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
      <SelectAvatarModal
        isVisible={isAvatarModalVisible}
        onClose={() => setAvatarModalVisible(false)}
        onAvatarChange={handleAvatarChange}
        selectedAvatar={selectedIcon}
      />

      {/* Modal para Malla Curricular */}
      {userData.userType === "estudiante" && (
        <CurriculumMapModal
          degree_code={userData.degree_code}
          isCurriculumModalVisible={isCurriculumModalVisible}
          onClose={() => setCurriculumModalVisible(false)}

        />
      )}
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
});

export default ProfileScreen;
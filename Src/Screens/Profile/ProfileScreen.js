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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSignOutAlt,
  faEdit,
  faCalendarDay,
  faCheckCircle,
  faUser,
  faIdCard,
  faGraduationCap,
  faEnvelope,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import ImageZoom from "react-native-image-pan-zoom";
import { animalIcons, careerImages } from "./Data_iconos_mallas";
import { clearSession } from "../../auth/SessionManager";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const ICON_SIZE = SCREEN_WIDTH * 0.15;
const GRID_PADDING = 16;

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

const InfoItem = ({ icon, title, value }) => (
  <View style={styles.infoItem}>
    <LinearGradient
      colors={["#0b34b0", "#267bee"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.infoIconContainer}
    >
      <FontAwesomeIcon icon={icon} size={20} color="#FFFFFF" />
    </LinearGradient>
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

  const [selectedIcon, setSelectedIcon] = useState(userData.avatar);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCurriculumModalVisible, setCurriculumModalVisible] = useState(false);
  const [loadingIcons, setLoadingIcons] = useState(true);
  const [loadedIcons, setLoadedIcons] = useState({});
  const imageZoomRef = useRef(null);

  useEffect(() => {
    loadSelectedIcon();
    const timerId = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const iconsWithDelay = animalIcons.reduce((acc, icon) => {
        acc[icon.id] = true;
        return acc;
      }, {});
      setLoadedIcons(iconsWithDelay);
    }, 2000);

    return () => clearTimeout(timer);
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
    setModalVisible(false);
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

  const renderIcon = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleAvatarChange(item.uri)}
      style={[
        styles.iconButton,
        selectedIcon === item.uri && styles.selectedIconButton,
      ]}
    >
      {loadedIcons[item.id] ? (
        <Image
          source={item.uri}
          style={[
            styles.iconImage,
            selectedIcon === item.uri && styles.selectedIconImage,
          ]}
        />
      ) : (
        <ActivityIndicator size={16} color="#0b34b0" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#0b34b0", "#267bee"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Animatable.View animation="fadeIn" duration={1000} style={styles.avatarContainer}>
          <Image source={selectedIcon} style={styles.avatar} />
          <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
            <FontAwesomeIcon icon={faEdit} size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.userInfo}>
          <Text style={styles.name}>{userData.name} {userData.lastnames}</Text>
          <Text style={styles.username}>@{userData.username}</Text>
          <View style={styles.statusIndicator}>
            <FontAwesomeIcon icon={faCheckCircle} size={16} color="#4CAF50" />
            <Text style={styles.statusText}>Activo</Text>
          </View>
        </Animatable.View>
      </LinearGradient>

      <Animatable.View animation="fadeInUp" duration={1000} delay={300} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Información del Perfil</Text>
        </View>
        <View style={styles.cardContent}>
          <InfoItem icon={faUser} title="Usuario" value={`@${userData.username}`} />
          <InfoItem icon={faIdCard} title="Código" value={userData.code} />
          <InfoItem 
            icon={faGraduationCap} 
            title="Carrera" 
            value={degreeNames[userData.degree_code] || userData.degree_code} 
          />
          <InfoItem icon={faEnvelope} title="Correo" value={userData.email} />
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={1000} delay={600} style={styles.card}>
        <View style={styles.cardHeader}>
          <FontAwesomeIcon icon={faCalendarDay} size={20} color="#0b34b0" />
          <Text style={styles.cardTitle}>Fecha Actual</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.dateText}>
            {currentDate.toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={1000} delay={800} style={styles.card}>
        <TouchableOpacity 
          style={styles.curriculumButton}
          onPress={() => setCurriculumModalVisible(true)}
        >
          <LinearGradient
            colors={["#0b34b0", "#267bee"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.curriculumGradient}
          >
            <FontAwesomeIcon icon={faGraduationCap} size={20} color="#FFFFFF" />
            <Text style={styles.curriculumText}>Ver Malla Curricular</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" duration={1000} delay={900}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={["#fb0c06", "#fb0c06"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutGradient}
          >
            <FontAwesomeIcon icon={faSignOutAlt} size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>

      {/* Avatar Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View 
            animation="zoomIn" 
            duration={300} 
            style={styles.modalView}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona un Avatar</Text>
            </View>
           
              <FlatList
                data={animalIcons}
                renderItem={renderIcon}
                keyExtractor={(item) => item.id}
                numColumns={4}
                contentContainerStyle={styles.iconGrid}
              />
     
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Modal>

      {/* Curriculum Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCurriculumModalVisible}
        onRequestClose={() => setCurriculumModalVisible(false)}
      >
        <View style={styles.curriculumModalOverlay}>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setCurriculumModalVisible(false)}
          >
            <FontAwesomeIcon icon={faTimes} size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <ImageZoom
            ref={imageZoomRef}
            cropWidth={SCREEN_WIDTH}
            cropHeight={SCREEN_HEIGHT}
            imageWidth={SCREEN_WIDTH}
            imageHeight={SCREEN_HEIGHT}
            enableSwipeDown={true}
            onSwipeDown={() => setCurriculumModalVisible(false)}
            minScale={1}
            maxScale={3}
          >
            <Image
              source={careerImages[userData.degree_code]}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </ImageZoom>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  userInfo: {
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
    textAlign: "center",
  },
  username: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 10,
  },
  statusText: {
    marginLeft: 5,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    margin: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0b34b0",
    marginLeft: 10,
  },
  cardContent: {
    padding: 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoIconContainer: {
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
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  dateText: {
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  curriculumButton: {
    margin: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  curriculumGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  curriculumText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  logoutButton: {
    margin: 15,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 30,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0b34b0",
    textAlign: "center",
  },
  modalSpinner: {
    marginTop: 20,
  },
  iconGrid: {
    alignItems: 'center',
  },
  iconButton: {
    margin: GRID_PADDING / 2,
    borderRadius: ICON_SIZE / 2,
    overflow: 'hidden',
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  selectedIconButton: {
    backgroundColor: '#4CAF50',
  },
  iconImage: {
    width: ICON_SIZE - 4,
    height: ICON_SIZE - 4,
    borderRadius: (ICON_SIZE - 4) / 2,
    borderWidth: 2,
    borderColor: '#0b34b0',
  },
  selectedIconImage: {
    borderColor: '#FFFFFF',
    borderWidth: 2, 
  },
  curriculumModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModalButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#0b34b0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProfileScreen;
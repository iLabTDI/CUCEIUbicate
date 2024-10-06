import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRoute, useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimes,
  faSignOutAlt,
  faEdit,
  faCalendarDay,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearSession } from "../../auth/SessionManager";
import { animalIcons, careerImages } from "./Data_iconos_mallas";
import ImageZoom from "react-native-image-pan-zoom";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const ProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params;
  const userData = Array.isArray(user) ? user[0] : user;

  const [isModalVisible, setModalVisible] = useState(false);
  const [isCurriculumModalVisible, setCurriculumModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(userData.avatar);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const imageZoomRef = useRef(null);

  useEffect(() => {
    // Carga el ícono seleccionado del almacenamiento local al cargar la pantalla
    loadSelectedIcon();
    // Establece un temporizador para actualizar la fecha cada minuto
    const timerId = setTimeout(() => setCurrentDate(new Date()), 1000 * 60);
    return () => clearTimeout(timerId);
  }, [currentDate]);

  // Carga el ícono seleccionado almacenado localmente
  const loadSelectedIcon = async () => {
    try {
      const savedIcon = await AsyncStorage.getItem("selectedIcon");
      if (savedIcon) {
        setSelectedIcon(JSON.parse(savedIcon));
      }
    } catch (error) {
      console.error("Error loading selected icon:", error);
    }
  };

  // Guarda el ícono seleccionado en el almacenamiento local
  const saveSelectedIcon = async (icon) => {
    try {
      await AsyncStorage.setItem("selectedIcon", JSON.stringify(icon));
    } catch (error) {
      console.error("Error saving selected icon:", error);
    }
  };

  // Alterna la visibilidad de los modales (expansión y currículum)
  const toggleModal = (modalName) => {
    switch (modalName) {
      case 'expand':
        setIsExpanded(!isExpanded);
        break;
      case 'curriculum':
        setCurriculumModalVisible(!isCurriculumModalVisible);
        break;
      default:
        break;
    }
  };

  // Maneja el cambio del avatar y guarda el nuevo ícono seleccionado
  const handleAvatarChange = (newAvatar) => {
    setSelectedIcon(newAvatar);
    saveSelectedIcon(newAvatar);
    setModalVisible(false);
  };

  // Muestra un mensaje de alerta para confirmar el cierre de sesión
  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, cerrar sesión",
          onPress: confirmLogout,
        },
      ]
    );
  };

  // Confirma el cierre de sesión y redirige a la pantalla de login
  const confirmLogout = () => {
    clearSession();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GestureHandlerRootView style={styles.gestureHandlerRoot}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Información del Perfil</Text>
          </View>
          <View style={styles.content}>
            {/* Contenedor del avatar del usuario */}
            <View style={styles.avatarContainer}>
              <Image source={selectedIcon} style={styles.avatar} />
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.editIcon}>
                <FontAwesomeIcon icon={faEdit} size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            {/* Información básica del usuario */}
            <Text style={styles.name}>
              {userData.name} {userData.lastnames}
            </Text>
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Usuario: </Text>@{userData.username}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Código: </Text>
                {userData.code}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Carrera: </Text>
                {userData.degree_code}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.bold}>Correo: </Text>
                {userData.email}
              </Text>
            </View>

            {/* Contenedor para la fecha y hora actual */}
            <View style={styles.calendarContainer}>
              <FontAwesomeIcon icon={faCalendarDay} size={20} color="#0b34b0" />
              <Text style={styles.dateText}>
                {currentDate.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            {/* Botón para cerrar sesión */}
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}>
              <FontAwesomeIcon icon={faSignOutAlt} size={16} color="#FFFFFF" />
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón para mostrar u ocultar la malla curricular */}
        <TouchableOpacity onPress={() => toggleModal('expand')} style={styles.expandButton}>
          <Text style={styles.expandButtonText}>
            {isExpanded
              ? "Ocultar Malla Curricular ▲"
              : "Mostrar Malla Curricular ▼"}
          </Text>
        </TouchableOpacity>

        {/* Contenido expandido con la imagen de la malla curricular */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            <TouchableOpacity onPress={() => toggleModal('curriculum')} style={styles.curriculumImageContainer}>
              <Image
                source={careerImages[userData.degree_code]}
                style={styles.curriculumImage}
                resizeMode="contain"
              />
              <View style={styles.zoomIconContainer}>
                <FontAwesomeIcon icon={faSearch} size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Modal para seleccionar un nuevo icono de avatar */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Selecciona un icono</Text>
              <FlatList
                data={animalIcons}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleAvatarChange(item.uri)}
                    style={styles.iconButton}>
                    <Image source={item.uri} style={styles.iconImage} />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                numColumns={4}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para mostrar la malla curricular en detalle con zoom */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isCurriculumModalVisible}
          onRequestClose={() => toggleModal('curriculum')}
        >
          <View style={styles.curriculumModalOverlay}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => toggleModal('curriculum')}
              accessibilityLabel="Cerrar modal de malla curricular"
              accessible={true}
            >
              <FontAwesomeIcon icon={faTimes} size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <ImageZoom
              ref={imageZoomRef}
              cropWidth={windowWidth}
              cropHeight={windowHeight}
              imageWidth={windowWidth}
              imageHeight={windowHeight}
              enableSwipeDown={true}
              onSwipeDown={() => toggleModal('curriculum')}
              minScale={1}
              maxScale={3}
              useNativeDriver={true}
            >
              <Image
                source={careerImages[userData.degree_code]}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </ImageZoom>
          </View>
        </Modal>
      </GestureHandlerRootView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  gestureHandlerRoot: {
    flex: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  header: {
    backgroundColor: "#0b34b0",
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#0b34b0",
  },
  editIcon: {
    position: "absolute",
    right: -5,
    bottom: -8,
    backgroundColor: "#0b34b0",
    borderRadius: 15,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0b34b0",
  },
  infoContainer: {
    width: "100%",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333333",
  },
  bold: {
    fontWeight: "bold",
    color: "#0b34b0",
  },
  expandButton: {
    backgroundColor: "#0b34b0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  expandButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  expandedContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
  },
  curriculumImageContainer: {
    position: 'relative',
    width: windowWidth - 70,
    height: (windowWidth - 70) * 0.75,
    maxHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  curriculumImage: {
    width: '100%',
    height: '100%',
  },
  zoomIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0b34b0",
  },
  iconButton: {
    margin: 8,
  },
  iconImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#0b34b0",
    borderRadius: 10,
    padding: 10,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  curriculumModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeModalButton: {
    position: "absolute",
    width: 40,
    height: 40,
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 123, 255, 0.7)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  modalImage: {
    width: windowWidth,
    height: windowHeight,
  },
  calendarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#0b34b0",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fb0c06",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
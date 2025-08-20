import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated,
  ActivityIndicator,
  Easing,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { validar_codigo, validar_usuario } from "../Api/validaciones";
import { get_degrees } from "../Api/consultas";
import { alta_usuario } from "../Api/altaUsuario";
import LottieView from "lottie-react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faUser,
  faEnvelope,
  faIdCard,
  faGraduationCap,
  faChevronDown,
  faLaptopCode,
  faFlask,
  faCog,
  faIndustry,
  faCalculator,
  faMicrochip,
  faNetworkWired,
  faAtom,
  faRobot,
  faBuilding,
  faStethoscope,
  faMapMarkedAlt,
  faTruck,
  faUtensils,
  faBroadcastTower,
  faDesktop,
  faServer,
  faCogs,
  faBomb,
  faLightbulb,
  faUserDoctor,
  faAppleAlt,
  faSquareRootVariable,
  faBriefcaseMedical,
  faRadiation,
  faFaceGrimace,
  faPersonHarassing,
  faMedkit,
  faHouseChimneyMedical,
} from "@fortawesome/free-solid-svg-icons";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

// Array de iconos en el orden de las carreras proporcionadas
const careerIconsOrder = [
  faIndustry, // Ingeniería Industrial INDU
  faIndustry, // Ingeniería Industrial INDU
  faLightbulb, // Ingeniería en Fotonica
  faUserDoctor, // Medicina
  faBroadcastTower, // Electrónica INCE
  faDesktop, // Ingeniería en Computación INCO
  faIndustry, // Ingeniería Industrial INDU
  faServer, // Ingeniería en Informática INFO
  faCogs, // Ingeniería Mecánica Eléctrica INME
  faFlask, // Ingeniería Química INQU
  faRobot, // Ingeniería en Robótica INRO
  faMapMarkedAlt, // Ingeniería en Topografía Geomática
  faAppleAlt, // Alimentos
  faRadiation, // Ingeniería en Informática INFO
  faSquareRootVariable, // Ingeniería Química INQU
  faTruck, // Ingeniería en Robótica INRO
  faFlask, // Ingeniería en Topografía Geomática
];

// Expresión regular que permite únicamente letras (con acentos, ñ) y espacios
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

export const CompleteProfile = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [Codigo, setCodigo] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("");

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [CodigoError, setCodigoError] = useState(false);
  const [careerOptions, setCareerOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [bgAnim] = useState(new Animated.Value(0));
  const [floatingAnim] = useState(new Animated.Value(0));

  const navigation = useNavigation();
  const route = useRoute();
  const { mail, pass } = route.params;
  const correo = mail;
  const contraseña = pass;

  // El código debe tener exactamente 9 dígitos
  const CODE_LENGTH = 9;

  useEffect(() => {
    const fetchDegrees = async () => {
      const degrees = await get_degrees();
      setCareerOptions(degrees);
    };
    fetchDegrees();

    // Inicializar animaciones como en RegisterScreen
    Animated.loop(
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: false,
      })
    ).start();

    // Animación flotante
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const validateForm = () => {
    let valid = true;
    // Validar que el nombre no esté vacío y solo contenga letras y espacios
    if (!name.trim() || !NAME_REGEX.test(name)) {
      setNameError(true);
      valid = false;
    } else {
      setNameError(false);
    }
    // Validar que el apellido no esté vacío y solo contenga letras y espacios
    if (!lastName.trim() || !NAME_REGEX.test(lastName)) {
      setLastNameError(true);
      valid = false;
    } else {
      setLastNameError(false);
    }
    // Validar que el código tenga exactamente 9 dígitos
    if (Codigo.length !== CODE_LENGTH) {
      setCodigoError(true);
      valid = false;
    } else {
      setCodigoError(false);
    }
    // Validar que se haya seleccionado una carrera
    if (!selectedCareer) {
      alert("Seleccione una carrera.");
      valid = false;
    }
    return valid;
  };

  const handleCompleteProfile = async () => {
    setIsLoading(true);

    // Verificar campos vacíos y validaciones
    if (!validateForm()) {
      setIsLoading(false);
      shakeForm();
      return;
    }

    try {
      const usuarioValido = await validar_usuario(username);
      if (!usuarioValido) {
        setUsernameError(true);
        setIsLoading(false);
        shakeForm();
        return;
      }

      const codigoValido = await validar_codigo(Codigo);
      if (!codigoValido) {
        setCodigoError(true);
        setIsLoading(false);
        shakeForm();
        return;
      }

      await alta_usuario(
        Codigo,
        correo,
        contraseña,
        selectedCareer,
        name,
        lastName,
        username
      );

      setIsProfileComplete(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error al completar el perfil:", error);
      setIsLoading(false);
      shakeForm();
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (isProfileComplete) {
      const timer = setTimeout(() => {
        navigation.navigate("Login");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isProfileComplete, navigation]);

  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Gradiente animado de fondo como en RegisterScreen
  const bgColor = bgAnim.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: ["#e8f2ff", "#f0f6ff", "#e3e9fa", "#f4f8ff"],
  });

  const floatingTransform = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <>
      {!isProfileComplete ? (
        <>
          {/* Fondo animado con gradiente dinámico */}
          <Animated.View
            style={[styles.animatedBg, { backgroundColor: bgColor }]}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <Animated.View
                style={[
                  styles.formWrapper,
                  {
                    transform: [
                      { translateX: shakeAnimation },
                      { translateY: floatingTransform },
                    ],
                  },
                ]}>
                <Text style={styles.title}>Completa tu perfil</Text>
                <Text style={styles.subtitle}>¡Ya casi terminamos! 🎯</Text>

                <View style={styles.lottieOverlayContainer}>
                  <LottieView
                    source={require("../assets/animations/completeProfile.json")}
                    autoPlay
                    loop
                    style={styles.animation}
                  />
                </View>

                <View style={styles.formContainer}>
                  {/* Campo Nombre */}
                  <View
                    style={[
                      styles.inputContainer,
                      nameError && styles.inputContainerError,
                    ]}>
                    <FontAwesomeIcon
                      icon={faUser}
                      style={
                        nameError ? styles.inputIconError : styles.inputIconBlue
                      }
                      size={22}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre"
                      placeholderTextColor="#a8b2c8"
                      value={name}
                      onChangeText={(text) => {
                        setName(text);
                        if (!text.trim() || !NAME_REGEX.test(text)) {
                          setNameError(true);
                        } else {
                          setNameError(false);
                        }
                      }}
                      selectionColor="#0b34b0"
                    />
                  </View>
                  {nameError && (
                    <Animated.View style={styles.errorContainer}>
                      <Text style={styles.errorText}>
                        {!name.trim()
                          ? "Campo requerido"
                          : "Solo se permiten letras y espacios"}
                      </Text>
                    </Animated.View>
                  )}

                  {/* Campo Apellidos */}
                  <View
                    style={[
                      styles.inputContainer,
                      lastNameError && styles.inputContainerError,
                    ]}>
                    <FontAwesomeIcon
                      icon={faUser}
                      style={
                        lastNameError
                          ? styles.inputIconError
                          : styles.inputIconBlue
                      }
                      size={22}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Apellidos"
                      placeholderTextColor="#a8b2c8"
                      value={lastName}
                      onChangeText={(text) => {
                        setLastName(text);
                        if (!text.trim() || !NAME_REGEX.test(text)) {
                          setLastNameError(true);
                        } else {
                          setLastNameError(false);
                        }
                      }}
                      selectionColor="#0b34b0"
                    />
                  </View>
                  {lastNameError && (
                    <Animated.View style={styles.errorContainer}>
                      <Text style={styles.errorText}>
                        {!lastName.trim()
                          ? "Campo requerido"
                          : "Solo se permiten letras y espacios"}
                      </Text>
                    </Animated.View>
                  )}

                  {/* Campo Nombre de Usuario */}
                  <View
                    style={[
                      styles.inputContainer,
                      usernameError && styles.inputContainerError,
                    ]}>
                    <FontAwesomeIcon
                      icon={faUser}
                      style={
                        usernameError
                          ? styles.inputIconError
                          : styles.inputIconBlue
                      }
                      size={22}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre de Usuario"
                      placeholderTextColor="#a8b2c8"
                      maxLength={20}
                      value={username}
                      onChangeText={(text) => {
                        setUsername(text);
                        setUsernameError(false);
                      }}
                      selectionColor="#0b34b0"
                    />
                  </View>
                  {usernameError && (
                    <Animated.View style={styles.errorContainer}>
                      <Text style={styles.errorText}>
                        {!username
                          ? "Campo requerido"
                          : "Este usuario ya ha sido registrado"}
                      </Text>
                    </Animated.View>
                  )}

                  {/* Campo Código de Estudiante */}
                  <View
                    style={[
                      styles.inputContainer,
                      CodigoError && styles.inputContainerError,
                    ]}>
                    <FontAwesomeIcon
                      icon={faIdCard}
                      style={
                        CodigoError
                          ? styles.inputIconError
                          : styles.inputIconBlue
                      }
                      size={22}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Código de estudiante (9 dígitos)"
                      placeholderTextColor="#a8b2c8"
                      value={Codigo}
                      maxLength={9}
                      keyboardType="number-pad"
                      onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, "");
                        setCodigo(numericText);
                        setCodigoError(false);
                      }}
                      selectionColor="#0b34b0"
                    />
                  </View>
                  {CodigoError && (
                    <Animated.View style={styles.errorContainer}>
                      <Text style={styles.errorText}>
                        {!Codigo
                          ? "Campo requerido"
                          : "El código debe tener exactamente 9 dígitos"}
                      </Text>
                    </Animated.View>
                  )}

                  {/* Selector de Carrera */}
                  <TouchableOpacity
                    style={styles.pickerContainer}
                    onPress={toggleModal}>
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      style={styles.inputIconBlue}
                      size={22}
                    />
                    <Text style={styles.pickerText}>
                      {selectedCareer || "Seleccione una carrera"}
                    </Text>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      style={styles.pickerIcon}
                      size={20}
                    />
                  </TouchableOpacity>

                  {/* Botón para Continuar con gradiente */}
                  <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonLoading]}
                    onPress={handleCompleteProfile}
                    disabled={isLoading}
                    activeOpacity={0.85}>
                    <View style={styles.buttonGradient}>
                      {isLoading ? (
                        <ActivityIndicator size={28} color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Terminar</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      ) : (
        <Animated.View
          style={[styles.completedContainer, { opacity: fadeAnim }]}>
          <LottieView
            source={require("../assets/animations/Confetti-2.json")}
            autoPlay
            loop={false}
            style={styles.confetti}
          />
          <View style={styles.completedContent}>
            <Text style={styles.profileCompleteText}>¡PERFIL COMPLETADO!</Text>
            <Text style={styles.welcomeText}>Bienvenido, @{username}</Text>
            <Image
              source={require("../../assets/images/cucei.png")}
              style={styles.logo}
            />
          </View>
        </Animated.View>
      )}

      {/* Modal para seleccionar carrera con diseño mejorado */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccione una carrera</Text>
            <ScrollView style={styles.careerOptionsContainer}>
              {careerOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.careerOption}
                  onPress={() => {
                    setSelectedCareer(option);
                    toggleModal();
                  }}>
                  <FontAwesomeIcon
                    icon={careerIconsOrder[index] || faGraduationCap}
                    style={styles.careerIcon}
                    size={20}
                  />
                  <Text style={styles.careerOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Fondo y overlay
  animatedBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },

  // Container principal
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 10,
  },

  // Wrapper del formulario
  formWrapper: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxWidth: 480,
  },

  // Títulos
  title: {
    fontSize: isTablet ? 38 : 32,
    fontWeight: "800",
    color: "#0b34b0",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 1.5,
    textShadowColor: "rgba(11, 52, 176, 0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: isTablet ? 18 : 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "500",
  },

  // Contenedor de Lottie
  lottieOverlayContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
    height: isTablet ? 200 : 160,
  },
  animation: {
    width: isTablet ? 320 : 240,
    height: isTablet ? 320 : 240,
    alignSelf: "center",
    zIndex: 2,
  },

  // Contenedor del formulario
  formContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 28,
    padding: isTablet ? 40 : 32,
    alignItems: "center",
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
    borderWidth: 1,
    borderColor: "rgba(208, 216, 246, 0.6)",
    backdropFilter: "blur(10px)",
  },

  // Inputs
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    paddingHorizontal: 6,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#e5e9f5",
    height: isTablet ? 68 : 58,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  inputContainerError: {
    borderColor: "#ff6b6b",
    backgroundColor: "rgba(255, 240, 240, 0.9)",
    shadowColor: "#ff6b6b",
  },
  input: {
    flex: 1,
    fontSize: isTablet ? 18 : 16,
    color: "#2d3748",
    fontWeight: "500",
    letterSpacing: 0.3,
    paddingVertical: 12,
    paddingRight: 12,
    marginLeft: 8,
  },

  // Picker container (selector de carrera)
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    paddingHorizontal: 6,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#e5e9f5",
    height: isTablet ? 68 : 58,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  pickerText: {
    flex: 1,
    fontSize: isTablet ? 18 : 16,
    color: "#2d3748",
    fontWeight: "500",
    letterSpacing: 0.3,
    paddingVertical: 12,
    paddingRight: 12,
    marginLeft: 8,
  },
  pickerIcon: {
    color: "#7a89a8",
    marginRight: 8,
  },

  // Iconos
  inputIconBlue: {
    color: "#0b34b0",
    marginLeft: 8,
    marginRight: 4,
    alignSelf: "center",
  },
  inputIconError: {
    color: "#ff6b6b",
    marginLeft: 8,
    marginRight: 4,
    alignSelf: "center",
  },

  // Botón
  button: {
    borderRadius: 20,
    width: "100%",
    height: isTablet ? 68 : 58,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    backgroundColor: "#0b34b0",
    borderRadius: 20,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLoading: {
    shadowOpacity: 0.15,
  },
  buttonText: {
    color: "white",
    fontSize: isTablet ? 20 : 18,
    fontWeight: "700",
    letterSpacing: 1.2,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Error
  errorContainer: {
    marginBottom: 8,
    width: "100%",
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: isTablet ? 13 : 12,
    fontWeight: "400",
    textAlign: "left",
    letterSpacing: 0.2,
    marginTop: 2,
    marginBottom: 2,
  },

  // Pantalla de perfil completado
  completedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  completedContent: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  profileCompleteText: {
    fontSize: isTablet ? width * 0.05 : width * 0.08,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0b34b0",
    marginBottom: height * 0.02,
  },
  welcomeText: {
    fontSize: isTablet ? width * 0.04 : width * 0.06,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.04,
    color: "#333",
  },
  logo: {
    width: isTablet ? width * 0.4 : width * 0.6,
    height: isTablet ? width * 0.4 : width * 0.6,
    resizeMode: "contain",
  },
  confetti: {
    position: "absolute",
    width: width,
    height: height,
    zIndex: 1,
  },

  // Modal mejorado
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(8px)",
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 32,
    padding: 40,
    width: isTablet ? width * 0.7 : width * 0.9,
    maxHeight: height * 0.8,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 25,
    borderWidth: 1,
    borderColor: "rgba(208, 216, 246, 0.8)",
  },
  modalTitle: {
    fontSize: isTablet ? 26 : 22,
    color: "#0b34b0",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1.2,
  },
  careerOptionsContainer: {
    maxHeight: height * 0.5,
  },
  careerOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e9f5",
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  careerIcon: {
    marginRight: 16,
    color: "#0b34b0",
  },
  careerOptionText: {
    fontSize: isTablet ? 16 : 14,
    color: "#2d3748",
    fontWeight: "500",
    flex: 1,
  },
  closeButton: {
    backgroundColor: "#0b34b0",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: isTablet ? 18 : 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
});

export default CompleteProfile;

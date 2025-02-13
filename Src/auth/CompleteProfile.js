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
} from "@fortawesome/free-solid-svg-icons";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

// Array de iconos en el orden de las carreras proporcionadas
const careerIconsOrder = [
  faBuilding,         // 1. Ingeniería Civil
  faAtom,             // 2. Ingeniería en Fotónica
  faStethoscope,      // 3. Ingeniería Biomédica
  faNetworkWired,     // 4. Ingeniería en Comunicaciones y Electrónica
  faLaptopCode,       // 5. Ingeniería en Computación
  faIndustry,         // 6. Ingeniería Industrial
  faLaptopCode,       // 7. Ingeniería en Informática
  faCog,              // 8. Ingeniería Mecánica Eléctrica
  faFlask,            // 9. Ingeniería Química
  faRobot,            // 10. Ingeniería en Robótica
  faMapMarkedAlt,     // 11. Ingeniería en Topografía Geomática
  faFlask,            // 12. Licenciatura en Ciencia de Materiales
  faUtensils,         // 13. Ingeniería en Alimentos y Biotecnología
  faAtom,             // 14. Licenciatura en Física
  faCalculator,       // 15. Licenciatura en Matemáticas
  faTruck,            // 16. Ingeniería en Logística y Transporte
  faFlask,            // 17. Licenciatura en Químico Farmacéutico Biólogo
  faFlask,            // 18. Licenciatura en Química
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
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {!isProfileComplete ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollViewContent}>
            <Animated.View 
              style={[styles.container, { transform: [{ translateX: shakeAnimation }] }]}>
              <Text style={styles.title}>Completa tu Perfil</Text>
              <LottieView
                source={require("../assets/animations/completeProfile.json")}
                autoPlay
                loop={true}
                style={styles.animation}
              />
              <View style={styles.formContainer}>
                {/* Campo Nombre */}
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faUser} style={styles.inputIcon} size={isTablet ? 24 : 20} />
                  <TextInput
                    style={[styles.input, nameError && styles.errorInput]}
                    placeholder="Nombre"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (!text.trim() || !NAME_REGEX.test(text)) {
                        setNameError(true);
                      } else {
                        setNameError(false);
                      }
                    }}
                  />
                </View>
                {nameError && (
                  <Text style={styles.errorText}>
                    {!name.trim() ? "Campo requerido" : "Solo se permiten letras y espacios"}
                  </Text>
                )}

                {/* Campo Apellidos */}
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faUser} style={styles.inputIcon} size={isTablet ? 24 : 20} />
                  <TextInput
                    style={[styles.input, lastNameError && styles.errorInput]}
                    placeholder="Apellidos"
                    placeholderTextColor="#999"
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      if (!text.trim() || !NAME_REGEX.test(text)) {
                        setLastNameError(true);
                      } else {
                        setLastNameError(false);
                      }
                    }}
                  />
                </View>
                {lastNameError && (
                  <Text style={styles.errorText}>
                    {!lastName.trim() ? "Campo requerido" : "Solo se permiten letras y espacios"}
                  </Text>
                )}

                {/* Campo Nombre de Usuario */}
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faUser} style={styles.inputIcon} size={isTablet ? 24 : 20} />
                  <TextInput
                    style={[styles.input, usernameError && styles.errorInput]}
                    placeholder="Nombre de Usuario"
                    placeholderTextColor="#999"
                    maxLength={20}
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      setUsernameError(false);
                    }}
                  />
                </View>
                {usernameError && (
                  <Text style={styles.errorText}>
                    {!username ? "Campo requerido" : "Este usuario ya ha sido registrado"}
                  </Text>
                )}

                {/* Campo Código de Estudiante (9 dígitos) */}
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faIdCard} style={styles.inputIcon} size={isTablet ? 24 : 20} />
                  <TextInput
                    style={[styles.input, CodigoError && styles.errorInput]}
                    placeholder="Código de estudiante (9 dígitos)"
                    placeholderTextColor="#999"
                    value={Codigo}
                    maxLength={9}
                    keyboardType="number-pad"
                    onChangeText={(text) => {
                      const numericText = text.replace(/[^0-9]/g, '');
                      setCodigo(numericText);
                      setCodigoError(false);
                    }}
                  />
                </View>
                {CodigoError && (
                  <Text style={styles.errorText}>
                    {!Codigo ? "Campo requerido" : "El código debe tener exactamente 9 dígitos"}
                  </Text>
                )}

                {/* Selector de Carrera */}
                <TouchableOpacity style={styles.pickerContainer} onPress={toggleModal}>
                  <FontAwesomeIcon icon={faGraduationCap} style={styles.inputIcon} size={isTablet ? 24 : 20} />
                  <Text style={styles.pickerText}>
                    {selectedCareer || "Seleccione una carrera"}
                  </Text>
                  <FontAwesomeIcon icon={faChevronDown} style={styles.pickerIcon} size={isTablet ? 24 : 20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleCompleteProfile} disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator size={isTablet ? 32 : 24} color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Terminar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <Animated.View style={[styles.completedContainer, { opacity: fadeAnim }]}>
          <LottieView
            source={require("../assets/animations/Confetti-2.json")}
            autoPlay
            loop={false}
            style={styles.confetti}
          />
          <View style={styles.completedContent}>
            <Text style={styles.profileCompleteText}>¡PERFIL COMPLETADO!</Text>
            <Text style={styles.welcomeText}>Bienvenido, @{username}</Text>
            <Image source={require("../../assets/images/cucei.png")} style={styles.logo} />
          </View>
        </Animated.View>
      )}

      {/* Modal para seleccionar carrera */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={toggleModal}>
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
                    size={isTablet ? 24 : 20}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: isTablet ? width * 0.1 : width * 0.05,
  },
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: isTablet ? width * 0.05 : width * 0.08,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    color: "#0b34b0",
  },
  animation: {
    width: isTablet ? width * 0.4 : width * 0.6,
    height: isTablet ? width * 0.3 : width * 0.4,
    marginBottom: height * 0.02,
  },
  formContainer: {
    width: "100%",
    maxWidth: isTablet ? 600 : 400,
    backgroundColor: "white",
    borderRadius: 15,
    padding: isTablet ? width * 0.04 : width * 0.05,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: height * 0.015,
    paddingHorizontal: isTablet ? width * 0.02 : width * 0.03,
  },
  inputIcon: {
    marginRight: isTablet ? width * 0.015 : width * 0.02,
    color: "#0b34b0",
  },
  input: {
    flex: 1,
    paddingVertical: isTablet ? height * 0.02 : height * 0.015,
    fontSize: isTablet ? width * 0.02 : width * 0.04,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: isTablet ? width * 0.02 : width * 0.035,
    marginBottom: height * 0.01,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: height * 0.015,
    paddingHorizontal: isTablet ? width * 0.02 : width * 0.03,
    paddingVertical: isTablet ? height * 0.02 : height * 0.015,
  },
  pickerText: {
    flex: 1,
    fontSize: isTablet ? width * 0.02 : width * 0.04,
    color: "#333",
  },
  pickerIcon: {
    color: "#0b34b0",
  },
  button: {
    backgroundColor: "#0b34b0",
    borderRadius: 10,
    paddingVertical: isTablet ? height * 0.025 : height * 0.02,
    alignItems: "center",
    marginTop: height * 0.02,
  },
  buttonText: {
    color: "white",
    fontSize: isTablet ? width * 0.025 : width * 0.04,
    fontWeight: "bold",
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: isTablet ? width * 0.04 : width * 0.05,
    width: isTablet ? width * 0.7 : width * 0.9,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: isTablet ? width * 0.04 : width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    textAlign: "center",
    color: "#0b34b0",
  },
  careerOptionsContainer: {
    maxHeight: height * 0.5,
  },
  careerOption: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: isTablet ? height * 0.025 : height * 0.02,
    flexDirection: "row",
    alignItems: "center",
  },
  careerIcon: {
    marginRight: isTablet ? width * 0.02 : width * 0.03,
    color: "#0b34b0",
  },
  careerOptionText: {
    fontSize: isTablet ? width * 0.025 : width * 0.04,
  },
  closeButton: {
    backgroundColor: "#0b34b0",
    borderRadius: 10,
    paddingVertical: isTablet ? height * 0.02 : height * 0.015,
    alignItems: "center",
    marginTop: height * 0.02,
  },
  closeButtonText: {
    color: "white",
    fontSize: isTablet ? width * 0.025 : width * 0.04,
    fontWeight: "bold",
  },
});

export default CompleteProfile;

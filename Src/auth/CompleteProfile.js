import React, { useState, useEffect } from "react";
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
} from "@fortawesome/free-solid-svg-icons";

const { width, height } = Dimensions.get("window");

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
  const [fadeAnim] = useState(new Animated.Value(0));

  const navigation = useNavigation();
  const route = useRoute();
  const { mail, pass } = route.params;
  const correo = mail;
  const contraseña = pass;

  useEffect(() => {
    const fetchDegrees = async () => {
      const degrees = await get_degrees();
      setCareerOptions(degrees);
    };
    fetchDegrees();
  }, []);

  const handleCompleteProfile = async () => {
    setIsLoading(true);

    if (!name || !lastName || !username || !Codigo || !selectedCareer) {
      setNameError(!name);
      setLastNameError(!lastName);
      setUsernameError(!username);
      setCodigoError(!Codigo);
      setIsLoading(false);
      return;
    }

    try {
      const usuarioValido = await validar_usuario(username);
      if (!usuarioValido) {
        setUsernameError(true);
        setIsLoading(false);
        return;
      }

      const codigoValido = await validar_codigo(Codigo);
      if (!codigoValido) {
        setCodigoError(true);
        setIsLoading(false);
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
    } finally {
      setIsLoading(false);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      {!isProfileComplete ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
              <Text style={styles.title}>Completa tu Perfil</Text>
              <LottieView
                source={require("../assets/animations/completeProfile.json")}
                autoPlay
                loop={true}
                style={styles.animation}
              />
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faUser} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, nameError && styles.errorInput]}
                    placeholder="Nombre"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      setNameError(false);
                    }}
                  />
                </View>
                {nameError && (
                  <Text style={styles.errorText}>Campo requerido</Text>
                )}

                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faUser} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, lastNameError && styles.errorInput]}
                    placeholder="Apellidos"
                    placeholderTextColor="#999"
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      setLastNameError(false);
                    }}
                  />
                </View>
                {lastNameError && (
                  <Text style={styles.errorText}>Campo requerido</Text>
                )}

                <View style={styles.inputContainer}>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    style={styles.inputIcon}
                  />
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
                    Este usuario ya ha sido registrado
                  </Text>
                )}

                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faIdCard} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, CodigoError && styles.errorInput]}
                    placeholder="Código de estudiante"
                    placeholderTextColor="#999"
                    value={Codigo}
                    maxLength={10}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const numericText = text.replace(/[^0-9]/g, '');
                      setCodigo(numericText);
                      setCodigoError(false);
                    }}
                  />
                </View>
                {CodigoError && (
                  <Text style={styles.errorText}>
                    Este código ya ha sido registrado
                  </Text>
                )}

                <TouchableOpacity
                  style={styles.pickerContainer}
                  onPress={toggleModal}>
                  <FontAwesomeIcon
                    icon={faGraduationCap}
                    style={styles.inputIcon}
                  />
                  <Text style={styles.pickerText}>
                    {selectedCareer || "Seleccione una carrera"}
                  </Text>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    style={styles.pickerIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCompleteProfile}
                  disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Terminar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
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
            <Text style={styles.profileCompleteText}>
              ¡PERFIL COMPLETADO!
            </Text>
            <Text style={styles.welcomeText}>Bienvenido, @{username}</Text>
            <Image
              source={require("../../assets/images/cucei.png")}
              style={styles.logo}
            />
          </View>
        </Animated.View>
      )}

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
                    setSelectedCareer(option.slice(-4));
                    toggleModal();
                  }}>
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
    padding: width * 0.05,
  },
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    color: "#0b34b0",
  },
  animation: {
    width: width * 0.6,
    height: width * 0.4,
    marginBottom: height * 0.02,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: width * 0.05,
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
    paddingHorizontal: width * 0.03,
  },
  inputIcon: {
    marginRight: width * 0.02,
    color: "#0b34b0",
  },
  input: {
    flex: 1,
    paddingVertical: height * 0.015,
    fontSize: width * 0.04,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: width * 0.035,
    marginBottom: height * 0.01,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.015,
  },
  pickerText: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#333",
  },
  pickerIcon: {
    color: "#0b34b0",
  },
  button: {
    backgroundColor: "#0b34b0",
    borderRadius: 10,
    paddingVertical: height * 0.02,
    alignItems: "center",
    marginTop: height * 0.02,
  },
  buttonText: {
    color: "white",
    fontSize: width * 0.04,
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
    fontSize: width * 0.08,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0b34b0",
    marginBottom: height * 0.02,
  },
  welcomeText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: height * 0.04,
    color: "#333",
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
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
    padding: width * 0.05,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: width * 0.06,
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
    paddingVertical: height * 0.02,
  },
  careerOptionText: {
    fontSize: width * 0.04,
  },
  closeButton: {
    backgroundColor: "#0b34b0",
    borderRadius: 10,
    paddingVertical: height * 0.015,
    alignItems: "center",
    marginTop: height * 0.02,
  },
  closeButtonText: {
    color: "white",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
});

export default CompleteProfile;
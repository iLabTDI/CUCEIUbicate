import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import successAnimation from "../assets/animations/complete.json";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { login } from "../Api/login";
import { LinearGradient } from "expo-linear-gradient";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [showIncorrectMessage, setShowIncorrectMessage] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginTest = async () => {
    setShowError(false);
    setShowIncorrectMessage(false);

    if (!username || !password) {
      setShowError(true);
      return;
    }

    setIsLoading(true);

    const { isMatch, userData } = await login(username, password);

    setIsLoading(false);

    if (isMatch) {
      setShowSuccessAnimation(true);
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        setShowSuccessAnimation(false);
        navigation.navigate("Principal Home", { user: userData[0] });
      }, 2000);
    } else {
      setShowIncorrectMessage(true);
    }
  };

  const handleRegister = () => {
    navigation.navigate("Registro");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#DBE2EF", "#F5F7F8"]} style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 10} // Ajuste para iOS
        >
          <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Image
                source={require("../../assets/images/Logo_Cucei.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.loginBox}>
                <View style={styles.iconCircle}>
                  <Image
                    source={require("../assets/images/usuario.png")}
                    style={styles.userImage}
                  />
                </View>
                <Text style={styles.title}>Iniciar Sesión</Text>
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faEnvelope} style={styles.iconStyle} />
                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#999"
                    onChangeText={setUsername}
                    value={username}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faLock} style={styles.iconStyle} />
                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#999"
                    onChangeText={setPassword}
                    value={password}
                  />
                  <TouchableOpacity onPress={togglePasswordVisibility}>
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      style={styles.eyeIcon}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
                {showError && (
                  <Text style={styles.errorText}>
                    Por favor, completa ambos campos.
                  </Text>
                )}
                {showIncorrectMessage && (
                  <Text style={styles.errorText}>
                    Correo o Contraseña incorrectos.
                  </Text>
                )}
                <TouchableOpacity
                  onPress={handleLoginTest}
                  style={styles.loginButton}
                  disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={styles.registerText}>
                    ¿No tienes cuenta? ¡Regístrate!
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          {showSuccessAnimation && (
            <LottieView
              source={successAnimation}
              autoPlay
              loop={false}
              style={styles.animation}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  scrollViewContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  logo: {
    width: 400,
    height: 200,
    marginBottom: 20,
  },
  loginBox: {
    width: windowWidth * 0.85,
    padding: windowWidth * 0.06,
    borderRadius: windowWidth * 0.05,
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconCircle: {
    backgroundColor: "#f0f0f0",
    borderRadius: windowWidth * 0.1,
    width: windowWidth * 0.2,
    height: windowWidth * 0.2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -windowWidth * 0.1,
    marginBottom: windowWidth * 0.03,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userImage: {
    width: windowWidth * 0.12,
    height: windowWidth * 0.12,
  },
  title: {
    fontSize: windowWidth * 0.055,
    fontWeight: "bold",
    color: "#0b34b0",
    marginBottom: windowWidth * 0.04,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: windowWidth * 0.02,
    paddingHorizontal: windowWidth * 0.03,
    marginBottom: windowWidth * 0.03,
    width: "100%",
  },
  iconStyle: {
    color: "#999",
    marginRight: windowWidth * 0.02,
  },
  input: {
    flex: 1,
    fontSize: windowWidth * 0.04,
    paddingVertical: windowWidth * 0.025,
  },
  eyeIcon: {
    color: "#999",
  },
  loginButton: {
    backgroundColor: "#0b34b0",
    borderRadius: windowWidth * 0.02,
    paddingVertical: windowWidth * 0.035,
    width: "100%",
    alignItems: "center",
    marginTop: windowWidth * 0.02,
  },
  buttonText: {
    color: "white",
    fontSize: windowWidth * 0.04,
    fontWeight: "bold",
  },
  registerText: {
    marginTop: windowWidth * 0.04,
    fontSize: windowWidth * 0.035,
    color: "#0b34b0",
  },
  errorText: {
    color: "red",
    fontSize: windowWidth * 0.035,
    marginBottom: windowWidth * 0.02,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  animation: {
    width: windowWidth * 0.6,
    height: windowWidth * 0.6,
  },
});

export default LoginScreen;

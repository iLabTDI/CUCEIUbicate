import React, { useState, useEffect, useRef } from "react";
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
  Animated,
  Keyboard,
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
  faUser,
  faPhone,
  faIdCard,
  faChevronLeft,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { login } from "../Api/login";
import { setSession, getSession } from "./SessionManager";
import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

export const LoginScreen = () => {
  const navigation = useNavigation();

  // Estado para alternar entre modo "Iniciar Sesión" y "Modo Invitado"
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    phone: "",
    id: "",
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [isFocused, setIsFocused] = useState({});

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkExistingSession();
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardStatus(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardStatus(false);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const checkExistingSession = async () => {
    const session = await getSession();
    if (session) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Principal Home", params: { user: session } }],
      });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setShowError(false);
  };

  const handleLogin = async () => {
    setShowError(false);
    setErrorMessage("");

    if (isGuestMode) {
      // Validaciones para modo invitado
      if (!formData.fullName || !formData.phone || !formData.id) {
        setErrorMessage("Por favor, completa todos los campos.");
        setShowError(true);
        shakeForm();
        return;
      }
      if (!validatePhone(formData.phone)) {
        setErrorMessage("Ingresa un número de teléfono válido (10 dígitos).");
        setShowError(true);
        shakeForm();
        return;
      }
      setIsLoading(true);
      try {
        const guestData = {
          name: formData.fullName,
          phone: formData.phone,
          id: formData.id,
          isGuest: true,
        };
        await setSession(guestData);
        showSuccessAndNavigate(guestData);
      } catch (error) {
        setErrorMessage("Error en modo invitado. Intenta de nuevo.");
        setShowError(true);
        shakeForm();
      } finally {
        setIsLoading(false);
      }
    } else {
      // Validaciones para login normal
      if (!formData.username || !formData.password) {
        setErrorMessage("Por favor, completa todos los campos.");
        setShowError(true);
        shakeForm();
        return;
      }
      if (!validateEmail(formData.username)) {
        setErrorMessage("Ingresa un correo electrónico válido.");
        setShowError(true);
        shakeForm();
        return;
      }
      setIsLoading(true);
      try {
        const result = await login(formData.username, formData.password);
        if (result && result.isMatch && result.userData) {
          await setSession(result.userData);
          showSuccessAndNavigate(result.userData);
        } else {
          setErrorMessage("Correo o contraseña incorrectos.");
          setShowError(true);
          shakeForm();
        }
      } catch (error) {
        setErrorMessage("Error al iniciar sesión. Intenta de nuevo.");
        setShowError(true);
        shakeForm();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const showSuccessAndNavigate = (userData) => {
    setShowSuccessAnimation(true);
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      setShowSuccessAnimation(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Principal Home", params: { user: userData } }],
      });
    }, 2000);
  };

  const handleRegister = () => {
    navigation.navigate("Registro");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

  const toggleMode = () => {
    setIsGuestMode(!isGuestMode);
    setShowError(false);
    setErrorMessage("");
    setFormData({
      username: "",
      password: "",
      fullName: "",
      id: "",
    });
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const renderInput = (
    icon,
    placeholder,
    field,
    keyboardType = "default",
    secure = false
  ) => (
    <Animatable.View
      animation="fadeInUp"
      duration={800}
      delay={field === "username" ? 300 : field === "password" ? 400 : 500}
      style={[
        styles.inputContainer,
        isFocused[field] && styles.inputContainerFocused,
      ]}>
      <FontAwesomeIcon
        icon={icon}
        style={[styles.inputIcon, isFocused[field] && styles.inputIconFocused]}
        size={20}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={formData[field]}
        onChangeText={(text) => handleInputChange(field, text)}
        keyboardType={keyboardType}
        secureTextEntry={secure && !showPassword}
        autoCapitalize="none"
        onFocus={() => setIsFocused((prev) => ({ ...prev, [field]: true }))}
        onBlur={() => setIsFocused((prev) => ({ ...prev, [field]: false }))}
      />
      {field === "password" && (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.passwordToggle}>
          <FontAwesomeIcon
            icon={showPassword ? faEye : faEyeSlash}
            size={20}
            color={isFocused.password ? "#0b34b0" : "#999"}
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Fondo neutro en lugar de gradiente */}
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            contentContainerStyle={[
              styles.scrollViewContent,
              keyboardStatus && styles.scrollViewContentKeyboard,
            ]}
            showsVerticalScrollIndicator={false}>
            <Animated.View
              style={[
                styles.formContainer,
                {
                  transform: [{ translateX: shakeAnimation }],
                  opacity: fadeAnim,
                },
              ]}>
              <Animatable.View
                animation="fadeInDown"
                duration={1200}
                delay={300}>
                <Image
                  source={require("../../assets/images/Logo_Cucei.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </Animatable.View>

              <Animatable.View
                animation="fadeInUp"
                duration={1200}
                delay={600}
                style={styles.loginBox}>
                <View style={styles.iconCircle}>
                  <Image
                    source={require("../assets/images/usuario.png")}
                    style={styles.userImage}
                  />
                </View>

                <Text style={styles.title}>
                  {isGuestMode ? "Modo Invitado" : "Iniciar Sesión"}
                </Text>
                <Text style={styles.subtitle}>
                  {isGuestMode
                    ? "Ingresa tus datos para continuar"
                    : "Ingresa tus credenciales para continuar"}
                </Text>

                {isGuestMode ? (
                  <>
                    {renderInput(faUser, "Nombre Completo", "fullName")}
                    {renderInput(faPhone, "Teléfono", "phone", "phone-pad")}
                    {renderInput(faIdCard, "Identificación", "id", "default")}
                  </>
                ) : (
                  <>
                    {renderInput(
                      faEnvelope,
                      "Correo electrónico",
                      "username",
                      "email-address"
                    )}
                    {renderInput(
                      faLock,
                      "Contraseña",
                      "password",
                      "default",
                      true
                    )}
                  </>
                )}

                {showError && (
                  <Animatable.View
                    animation="fadeIn"
                    duration={300}
                    style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </Animatable.View>
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>
                      {isGuestMode
                        ? "Continuar como Invitado"
                        : "Iniciar Sesión"}
                    </Text>
                  )}
                </TouchableOpacity>

                {!isGuestMode && (
                  <TouchableOpacity
                    onPress={handleRegister}
                    style={styles.registerButton}
                    activeOpacity={0.7}>
                    <Text style={styles.registerText}>
                      ¿No tienes cuenta?{" "}
                      <Text style={styles.registerTextBold}>¡Regístrate!</Text>
                    </Text>
                  </TouchableOpacity>
                )}

                {/*<TouchableOpacity onPress={toggleMode} style={styles.modeToggleButton} activeOpacity={0.7}>
                  <Text style={styles.modeToggleText}>
                      {isGuestMode 
                        ? '¿Ya tienes cuenta? Inicia sesión'
                        : '¿No tienes cuenta? Ingresa como invitado'
                      }
                  </Text>
                </TouchableOpacity>*/}
              </Animatable.View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}}>
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
    backgroundColor: "#f4f4f4",
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  scrollViewContentKeyboard: {
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: isTablet ? 450 : 320,
    height: isTablet ? 220 : 160,
    marginBottom: 30,
  },
  loginBox: {
    width: isTablet ? "70%" : "100%",
    maxWidth: 500,
    backgroundColor: "white",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconCircle: {
    width: isTablet ? 120 : 80,
    height: isTablet ? 120 : 80,
    borderRadius: isTablet ? 60 : 40,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userImage: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
  },
  title: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: "bold",
    color: "#0b34b0",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: isTablet ? 18 : 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e9ecef",
    height: isTablet ? 60 : 50,
  },
  inputContainerFocused: {
    borderColor: "#0b34b0",
    backgroundColor: "#fff",
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  inputIcon: {
    color: "#999",
    marginRight: 10,
  },
  inputIconFocused: {
    color: "#0b34b0",
  },
  input: {
    flex: 1,
    fontSize: isTablet ? 18 : 16,
    color: "#333",
  },
  passwordToggle: {
    padding: 10,
  },
  errorContainer: {
    backgroundColor: "#fff3f3",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
  },
  errorText: {
    color: "#ff3b30",
    textAlign: "center",
    fontSize: isTablet ? 16 : 14,
  },
  button: {
    backgroundColor: "#0b34b0",
    borderRadius: 12,
    width: "100%",
    height: isTablet ? 60 : 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: "white",
    fontSize: isTablet ? 20 : 16,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 20,
    padding: 10,
  },
  registerText: {
    color: "#666",
    fontSize: isTablet ? 18 : 14,
    textAlign: "center",
  },
  registerTextBold: {
    color: "#0b34b0",
    fontWeight: "bold",
  },
  modeToggleButton: {
    marginTop: 15,
    padding: 10,
  },
  modeToggleText: {
    color: "#0b34b0",
    fontSize: isTablet ? 16 : 14,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 250,
    height: 250,
  },
});

export default LoginScreen;

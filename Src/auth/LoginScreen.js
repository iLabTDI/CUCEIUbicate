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
  Easing,
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
  const loginBoxAnim = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkExistingSession();
    // Animación de entrada para el loginBox
    Animated.spring(loginBoxAnim, {
      toValue: 1,
      friction: 7,
      tension: 60,
      useNativeDriver: true,
    }).start();
    // Animación infinita para el fondo
    Animated.loop(
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
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
        return;
      }
      if (!validatePhone(formData.phone)) {
        setErrorMessage("Ingresa un número de teléfono válido (10 dígitos).");
        setShowError(true);
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
        setShowSuccessAnimation(true);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          setShowSuccessAnimation(false);
          navigation.reset({
            index: 0,
            routes: [{ name: "Principal Home", params: { user: guestData } }],
          });
        }, 2000);
      } catch (error) {
        setErrorMessage("Error en modo invitado. Intenta de nuevo.");
        setShowError(true);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Validaciones para login normal
    if (!formData.username || !formData.password) {
      setErrorMessage("Por favor, completa todos los campos.");
      setShowError(true);
      return;
    }
    if (!validateEmail(formData.username)) {
      setErrorMessage("Ingresa un correo electrónico válido.");
      setShowError(true);
      return;
    }
    setIsLoading(true);
    try {
      const result = await login(formData.username, formData.password);
      if (result && result.isMatch && result.userData) {
        await setSession(result.userData);
        setShowSuccessAnimation(true);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          setShowSuccessAnimation(false);
          navigation.reset({
            index: 0,
            routes: [{ name: "Principal Home", params: { user: result.userData } }],
          });
        }, 2000);
      } else {
        setErrorMessage("Correo o contraseña incorrectos.");
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage("Error al iniciar sesión. Intenta de nuevo.");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollViewContent}
            alwaysBounceVertical={false}
          >
            <Animated.View style={[styles.formContainer, { transform: [{ translateX: shakeAnimation }] }]}> 
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
                    <View style={styles.inputContainer}>
                      <FontAwesomeIcon icon={faUser} style={[styles.inputIcon, isFocused.fullName && styles.inputIconFocused]} size={20} />
                      <TextInput
                        style={styles.input}
                        placeholder="Nombre Completo"
                        placeholderTextColor="#999"
                        value={formData.fullName}
                        onChangeText={text => handleInputChange('fullName', text)}
                        onFocus={() => setIsFocused(prev => ({ ...prev, fullName: true }))}
                        onBlur={() => setIsFocused(prev => ({ ...prev, fullName: false }))}
                        autoCapitalize="words"
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <FontAwesomeIcon icon={faPhone} style={[styles.inputIcon, isFocused.phone && styles.inputIconFocused]} size={20} />
                      <TextInput
                        style={styles.input}
                        placeholder="Teléfono"
                        placeholderTextColor="#999"
                        value={formData.phone}
                        onChangeText={text => handleInputChange('phone', text)}
                        keyboardType="phone-pad"
                        onFocus={() => setIsFocused(prev => ({ ...prev, phone: true }))}
                        onBlur={() => setIsFocused(prev => ({ ...prev, phone: false }))}
                        maxLength={10}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <FontAwesomeIcon icon={faIdCard} style={[styles.inputIcon, isFocused.id && styles.inputIconFocused]} size={20} />
                      <TextInput
                        style={styles.input}
                        placeholder="Identificación"
                        placeholderTextColor="#999"
                        value={formData.id}
                        onChangeText={text => handleInputChange('id', text)}
                        onFocus={() => setIsFocused(prev => ({ ...prev, id: true }))}
                        onBlur={() => setIsFocused(prev => ({ ...prev, id: false }))}
                        autoCapitalize="characters"
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.inputContainer}>
                      <FontAwesomeIcon icon={faEnvelope} style={[styles.inputIcon, isFocused.username && styles.inputIconFocused]} size={20} />
                      <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        placeholderTextColor="#999"
                        value={formData.username}
                        onChangeText={text => handleInputChange('username', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onFocus={() => setIsFocused(prev => ({ ...prev, username: true }))}
                        onBlur={() => setIsFocused(prev => ({ ...prev, username: false }))}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <FontAwesomeIcon icon={faLock} style={[styles.inputIcon, isFocused.password && styles.inputIconFocused]} size={20} />
                      <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        placeholderTextColor="#999"
                        value={formData.password}
                        onChangeText={text => handleInputChange('password', text)}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
                        onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
                      />
                      <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size={20} color={isFocused.password ? "#0b34b0" : "#999"} />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                {showError && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>
                      {isGuestMode ? "Continuar como Invitado" : "Iniciar Sesión"}
                    </Text>
                  )}
                </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
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
                {!isGuestMode && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Registro')}
                    style={styles.registerButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.registerText}>
                      ¿No tienes cuenta? <Text style={styles.registerTextBold}>¡Regístrate!</Text>
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  animatedBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    // Gradiente vertical suave (simulado con dos colores)
    backgroundColor: "#e3e9fa",
  },
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
    paddingTop: 10,
    paddingBottom: 10,
  },
  logo: {
    width: isTablet ? 450 : 320,
    height: isTablet ? 220 : 160,
    marginBottom: 18,
    marginTop: 10,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  loginBox: {
    width: isTablet ? "70%" : "100%",
    maxWidth: 500,
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: 32,
    padding: isTablet ? 40 : 28,
    alignItems: "center",
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.13,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1.5,
    borderColor: "#d0d8f6",
  },
  iconCircle: {
    width: isTablet ? 130 : 90,
    height: isTablet ? 130 : 90,
    borderRadius: isTablet ? 65 : 45,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -60,
    marginBottom: 18,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#e9ecef",
  },
  userImage: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },
  title: {
    fontSize: isTablet ? 36 : 28,
    fontWeight: "bold",
    color: "#0b34b0",
    marginBottom: 6,
    textAlign: "center",
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: isTablet ? 20 : 16,
    color: "#666",
    marginBottom: 28,
    textAlign: "center",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 18,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "#d0d8f6",
    height: isTablet ? 64 : 54,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
    transitionProperty: "border-color, box-shadow",
    transitionDuration: "0.2s",
  },
  inputContainerFocused: {
    borderColor: "#0b34b0",
    backgroundColor: "#f4f8ff",
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    color: "#999",
    marginRight: 14,
    fontSize: isTablet ? 26 : 22,
    transitionProperty: "color",
    transitionDuration: "0.2s",
  },
  inputIconFocused: {
    color: "#0b34b0",
  },
  input: {
    flex: 1,
    fontSize: isTablet ? 20 : 17,
    color: "#222",
    fontWeight: "500",
    letterSpacing: 0.2,
    backgroundColor: "transparent",
    paddingVertical: 10,
  },
  passwordToggle: {
    padding: 10,
  },
  errorContainer: {
    backgroundColor: "#fff3f3",
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ffb3b3",
    shadowColor: "#ff3b30",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  errorText: {
    color: "#ff3b30",
    textAlign: "center",
    fontSize: isTablet ? 17 : 15,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#0b34b0",
    borderRadius: 16,
    width: "100%",
    height: isTablet ? 64 : 54,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#0b34b0",
    transitionProperty: "background-color, box-shadow",
    transitionDuration: "0.2s",
  },
  buttonText: {
    color: "white",
    fontSize: isTablet ? 22 : 18,
    fontWeight: "bold",
    letterSpacing: 1.1,
  },
  registerButton: {
    marginTop: 24,
    padding: 12,
  },
  registerText: {
    color: "#666",
    fontSize: isTablet ? 19 : 15,
    textAlign: "center",
    fontWeight: "500",
  },
  registerTextBold: {
    color: "#0b34b0",
    fontWeight: "bold",
    fontSize: isTablet ? 19 : 15,
  },
  modeToggleButton: {
    marginTop: 18,
    padding: 12,
  },
  modeToggleText: {
    color: "#0b34b0",
    fontSize: isTablet ? 17 : 15,
    textAlign: "center",
    fontWeight: "500",
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

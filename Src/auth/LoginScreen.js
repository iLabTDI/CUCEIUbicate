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

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

export const LoginScreen = () => {
  // Shake global: activa cuando showError es true
  useEffect(() => {
    if (showError) {
      shakeForm();
    }
  }, [showError]);
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

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const loginBoxAnim = useRef(new Animated.Value(0)).current;
  const [bgAnim] = useState(new Animated.Value(0));
  const [floatingAnim] = useState(new Animated.Value(0));
  const logoPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulseAnim, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoPulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  useEffect(() => {
    checkExistingSession();
    // Animación de entrada para el loginBox
    Animated.spring(loginBoxAnim, {
      toValue: 1,
      friction: 7,
      tension: 60,
      useNativeDriver: true,
    }).start();

    // Animación del fondo como en RegisterScreen
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
            routes: [
              { name: "Principal Home", params: { user: result.userData } },
            ],
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

  // Función de shake mejorada
  const shakeForm = () => {
    shakeAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 16,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -16,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 12,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -12,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Gradiente animado de fondo como en RegisterScreen
  const bgColor = bgAnim.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: ["#e8f2ff", "#f0f6ff", "#e3e9fa", "#f4f8ff"],
  });

  // const floatingTransform = floatingAnim.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0, -8],
  // });

  return (
    <>
      {/* Fondo animado con gradiente dinámico */}
      <Animated.View
        style={[styles.animatedBg, { backgroundColor: bgColor }]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.formWrapper,
              // {
              //   transform: [
              //     { translateX: shakeAnimation },
              //     { translateY: floatingTransform },
              //   ],
              // },
            ]}>
            {/* Logo con fondo circular, gradiente y animación de pulso */}
            <Animated.View
              style={[
                styles.logoCircle,
                {
                  shadowColor: "#0b34b0",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.22,
                  shadowRadius: 24,
                  elevation: 16,
                },
              ]}>
              <Image
                source={require("../../assets/images/Logo_Cucei.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              {/* Brillo decorativo */}
              <View style={styles.logoGlow} />
            </Animated.View>

            <View style={styles.formContainer}>
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
                  {/* Modo Invitado - Campo Nombre Completo */}
                  <View style={styles.inputContainer}>
                    <FontAwesomeIcon
                      icon={faUser}
                      style={styles.inputIconBlue}
                      size={22}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre Completo"
                      placeholderTextColor="#a8b2c8"
                      value={formData.fullName}
                      onChangeText={(text) =>
                        handleInputChange("fullName", text)
                      }
                      autoCapitalize="words"
                      selectionColor="#0b34b0"
                    />
                  </View>

                  {/* Modo Invitado - Campo Teléfono */}
                  <View style={styles.inputContainer}>
                    <FontAwesomeIcon
                      icon={faPhone}
                      style={styles.inputIconBlue}
                      size={22}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Teléfono"
                      placeholderTextColor="#a8b2c8"
                      value={formData.phone}
                      onChangeText={(text) => handleInputChange("phone", text)}
                      keyboardType="phone-pad"
                      maxLength={10}
                      selectionColor="#0b34b0"
                    />
                  </View>

                  {/* Modo Invitado - Campo Identificación */}
                  <View style={styles.inputContainer}>
                    <FontAwesomeIcon
                      icon={faIdCard}
                      style={styles.inputIconBlue}
                      size={22}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Identificación"
                      placeholderTextColor="#a8b2c8"
                      value={formData.id}
                      onChangeText={(text) => handleInputChange("id", text)}
                      autoCapitalize="characters"
                      selectionColor="#0b34b0"
                    />
                  </View>
                </>
              ) : (
                <>
                  {/* Login Normal - Campo Email */}
                  <View style={styles.inputContainer}>
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      style={styles.inputIconBlue}
                      size={22}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Correo electrónico"
                      placeholderTextColor="#a8b2c8"
                      value={formData.username}
                      onChangeText={(text) =>
                        handleInputChange("username", text)
                      }
                      keyboardType="email-address"
                      autoCapitalize="none"
                      selectionColor="#0b34b0"
                    />
                  </View>

                  {/* Login Normal - Campo Contraseña */}
                  <View style={styles.inputContainer}>
                    <FontAwesomeIcon
                      icon={faLock}
                      style={styles.inputIconBlue}
                      size={22}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Contraseña"
                      placeholderTextColor="#a8b2c8"
                      value={formData.password}
                      onChangeText={(text) =>
                        handleInputChange("password", text)
                      }
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      selectionColor="#0b34b0"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIconContainer}>
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        size={20}
                        color="#7a89a8"
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Mensaje de error mejorado */}
              {showError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* Botón principal con gradiente */}
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonLoading]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.85}>
                <View style={styles.buttonGradient}>
                  {isLoading ? (
                    <ActivityIndicator size={28} color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>
                      {isGuestMode
                        ? "Continuar como Invitado"
                        : "Iniciar Sesión"}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Botón de registro */}
              {!isGuestMode && (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Registro")}
                  style={styles.registerButton}
                  activeOpacity={0.7}>
                  <Text style={styles.registerText}>
                    ¿No tienes cuenta?{" "}
                    <Text style={styles.registerTextBold}>¡Regístrate!</Text>
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de éxito mejorado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContentWrapper}>
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
    </>
  );
};

const styles = StyleSheet.create({
  // Fondo animado
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
    paddingVertical: 10,
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

  // Logo
  logo: {
    width: isTablet ? 400 : 280,
    height: isTablet ? 200 : 140,
    marginBottom: 20,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
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

  // Círculo del icono
  iconCircle: {
    width: isTablet ? 120 : 80,
    height: isTablet ? 120 : 80,
    borderRadius: isTablet ? 60 : 40,
    backgroundColor: "rgba(11, 52, 176, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
    marginBottom: 20,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    // elevation: 6,
    borderWidth: 2,
    borderColor: "rgba(208, 216, 246, 0.3)",
  },
  userImage: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
  },

  // Títulos
  title: {
    fontSize: isTablet ? 32 : 26,
    fontWeight: "800",
    color: "#0b34b0",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 1.2,
    textShadowColor: "rgba(11, 52, 176, 0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: isTablet ? 16 : 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "500",
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
    height: isTablet ? 64 : 54,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  input: {
    flex: 1,
    fontSize: isTablet ? 16 : 14,
    color: "#2d3748",
    fontWeight: "500",
    letterSpacing: 0.3,
    paddingVertical: 12,
    paddingRight: 12,
    marginLeft: 8,
  },
  eyeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(122, 137, 168, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  // Iconos
  inputIconBlue: {
    color: "#0b34b0",
    marginLeft: 8,
    marginRight: 4,
    alignSelf: "center",
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
    textAlign: "center",
    letterSpacing: 0.2,
    marginTop: 2,
    marginBottom: 2,
  },

  // Botón principal
  button: {
    borderRadius: 20,
    width: "100%",
    height: isTablet ? 64 : 54,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    overflow: "hidden",
    marginTop: 8,
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
    fontSize: isTablet ? 18 : 16,
    fontWeight: "700",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Botón de registro
  registerButton: {
    marginTop: 20,
    padding: 12,
  },
  registerText: {
    color: "#6b7280",
    fontSize: isTablet ? 16 : 14,
    textAlign: "center",
    fontWeight: "500",
  },
  registerTextBold: {
    color: "#0b34b0",
    fontWeight: "700",
  },

  // Modal mejorado
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(8px)",
  },
  modalContentWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 20,
  },
  animation: {
    width: 220,
    height: 220,
  },
});
export default LoginScreen;

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
  faCheckCircle,
  faUser,
  faPhone,
  faIdCard,
  faChevronLeft,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { login } from "../Api/login"; // ✨ ASEGÚRATE DE IMPORTAR EL .ts CORRECTO
import { setSession, getSession } from "./SessionManager";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

export const LoginScreen = () => {
  const navigation = useNavigation();

  // ✨ MODO INVITADO - COMENTADO (descomenta cuando lo necesites)
  // const [isGuestMode, setIsGuestMode] = useState(false);

  // ✨ DATOS DEL FORMULARIO - SIN MODO INVITADO
  const [formData, setFormData] = useState({
    // Para login normal:
    username: "",
    password: "",
    // ✨ CAMPOS DE MODO INVITADO - COMENTADOS
    // fullName: "",    // Nombre completo del invitado
    // phone: "",       // Teléfono del invitado (10 dígitos)
    // id: "",          // Identificación del invitado
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

  // Shake global: activa cuando showError es true
  useEffect(() => {
    if (showError) {
      shakeForm();
    }
  }, [showError]);

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
    // ✨ CARGAR EMAIL GUARDADO SI EXISTE
    loadSavedEmail();
    
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

  // ✨ FUNCIÓN PARA CARGAR EMAIL GUARDADO
  const loadSavedEmail = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem("@saved_email");
      if (savedEmail) {
        console.log('📧 Email cargado automáticamente:', savedEmail);
        setFormData(prev => ({
          ...prev,
          username: savedEmail
        }));
        // ✨ LIMPIAR EL EMAIL GUARDADO DESPUÉS DE USARLO
        await AsyncStorage.removeItem("@saved_email");
      }
    } catch (error) {
      console.error('Error cargando email guardado:', error);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ✨ VALIDACIÓN PARA TELÉFONO - COMENTADA (solo para modo invitado)
  // const validatePhone = (phone) => {
  //   const phoneRegex = /^[0-9]{10}$/; // Exactamente 10 dígitos
  //   return phoneRegex.test(phone);
  // };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setShowError(false);
  };

  // ✨ FUNCIÓN PRINCIPAL DE LOGIN CON DEBUG SÚPER DETALLADO
  const handleLogin = async () => {
    console.log('🔍 === INICIANDO PROCESO DE LOGIN ===');
    console.log('📅 Timestamp:', new Date().toLocaleString());
    console.log('🌍 Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
    setShowError(false);
    setErrorMessage("");

    // ✨ LOGIN NORMAL (siempre activo)
    if (!formData.username || !formData.password) {
      console.log('❌ Campos vacíos detectados');
      setErrorMessage("Por favor, completa todos los campos.");
      setShowError(true);
      return;
    }

    if (!validateEmail(formData.username)) {
      console.log('❌ Email inválido:', formData.username);
      setErrorMessage("Ingresa un correo electrónico válido.");
      setShowError(true);
      return;
    }

    console.log('📧 === DATOS DE LOGIN COMPLETOS ===');
    console.log('Email exacto:', `"${formData.username}"`);
    console.log('Email length:', formData.username.length);
    console.log('Email trim:', `"${formData.username.trim()}"`);
    console.log('Password length:', formData.password.length);
    console.log('Password chars preview:', formData.password.split('').map(c => c.charCodeAt(0)).slice(0, 5));
    
    setIsLoading(true);
    
    try {
      console.log('🚀 Llamando función login con parámetros exactos...');
      const result = await login(formData.username.trim(), formData.password);
      
      console.log("🔍 === RESULTADO COMPLETO DEL LOGIN ===");
      console.log("📊 Tipo de resultado:", typeof result);
      console.log("📊 Resultado completo:", result);
      console.log("📊 isMatch:", result?.isMatch);
      console.log("📊 isMatch tipo:", typeof result?.isMatch);
      console.log("📊 userData existe:", !!result?.userData);
      console.log("📊 userData tipo:", typeof result?.userData);
      
      if (result?.userData) {
        console.log("👤 === USERDATA COMPLETO ===");
        Object.keys(result.userData).forEach(key => {
          console.log(`${key}:`, result.userData[key], `(${typeof result.userData[key]})`);
        });
      }

      if (result && result.isMatch === true && result.userData) {
        console.log("✅ === LOGIN SÚPER EXITOSO ===");
        console.log("👤 Usuario logueado:", result.userData.username);
        console.log("📧 Email confirmado:", result.userData.email);
        console.log("🏷️ Nombre completo:", result.userData.name, result.userData.lastnames);
        console.log("🎓 Código estudiantil:", result.userData.code);
        
        // ✨ GUARDAR SESIÓN PRIMERO
        console.log("💾 === GUARDANDO SESIÓN ===");
        await setSession(result.userData);
        console.log("💾 === SESIÓN GUARDADA CORRECTAMENTE ===");
        
        // ✨ MOSTRAR ANIMACIÓN DE ÉXITO
        setShowSuccessAnimation(true);
        setModalVisible(true);
        
        setTimeout(() => {
          setModalVisible(false);
          setShowSuccessAnimation(false);
          console.log("🏠 === NAVEGANDO AL HOME ===");
          
          // ✨ NAVEGACIÓN CORREGIDA
          navigation.reset({
            index: 0,
            routes: [
              { name: "Principal Home", params: { user: result.userData } },
            ],
          });
        }, 3000);
      } else {
        console.log("❌ === LOGIN FALLIDO ===");
        console.log("🔍 Análisis súper detallado del fallo:");
        console.log("- Resultado existe:", !!result);
        console.log("- Resultado tipo:", typeof result);
        console.log("- isMatch value:", result?.isMatch);
        console.log("- isMatch type:", typeof result?.isMatch);
        console.log("- isMatch === true:", result?.isMatch === true);
        console.log("- userData exists:", !!result?.userData);
        console.log("- userData type:", typeof result?.userData);
        console.log("- Condición completa:", result && result.isMatch === true && result.userData);
        
        setErrorMessage("Correo o contraseña incorrectos.");
        setShowError(true);
      }
    } catch (error) {
      console.error("🚨 === ERROR EN HANDLELOGIN ===");
      console.error("Error completo:", error);
      console.error("Error type:", typeof error);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      console.error("Error name:", error?.name);
      
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
              {
                transform: [
                  { translateX: shakeAnimation },
                ],
              },
            ]}>
            {/* ✨ LOGO CON IMAGEN CUCEI.PNG CORRECTA */}
            <Animated.View
              style={[
                styles.logoCircle,
                {
                  shadowColor: "#0b34b0",
                  shadowOffset: { width: 0, height: 12 },
                  shadowOpacity: 0.22,
                  shadowRadius: 24,
                  elevation: 16,
                  transform: [{ scale: logoPulseAnim }],
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

              <Text style={styles.title}>Iniciar Sesión</Text>
              <Text style={styles.subtitle}>
                {/* ✨ MENSAJE PERSONALIZADO SI HAY EMAIL PRE-CARGADO */}
                {formData.username ? 
                  "Solo ingresa tu contraseña para continuar" : 
                  "Ingresa tus credenciales para continuar"
                }
              </Text>

              {/* ✨ CAMPO EMAIL CON INDICADOR VISUAL SI ESTÁ PRE-CARGADO */}
              <View style={[
                styles.inputContainer,
                formData.username && styles.inputContainerPreFilled
              ]}>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={[
                    styles.inputIconBlue,
                    formData.username && styles.inputIconSuccess
                  ]}
                  size={22}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico"
                  placeholderTextColor="#a8b2c8"
                  value={formData.username}
                  onChangeText={(text) => handleInputChange("username", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor="#0b34b0"
                />
                {formData.username && (
                  <View style={styles.preFilledIndicator}>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      style={styles.checkIcon}
                      size={20}
                    />
                  </View>
                )}
              </View>

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
                  onChangeText={(text) => handleInputChange("password", text)}
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

              {/* Mensaje de error mejorado */}
              {showError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* ✨ BOTÓN PRINCIPAL CON TEXTO DINÁMICO */}
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
                      {formData.username ? "Iniciar Sesión" : "Iniciar Sesión"}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Registro")}
                style={styles.registerButton}
                activeOpacity={0.7}>
                <Text style={styles.registerText}>
                  ¿No tienes cuenta?{" "}
                  <Text style={styles.registerTextBold}>¡Regístrate!</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ✨ MODAL CON DISEÑO SÚPER HERMOSO Y RESPONSIVO */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContentWrapper}>
            
            <View style={styles.modalMainContent}>
              
              {/* ✨ LOGO CON IMAGEN CUCEI.PNG CORRECTA */}
              <View style={styles.modalLogoMain}>
                <View style={styles.modalLogoOuterGlow} />
                <View style={styles.modalLogoMiddleGlow} />
                <View style={styles.modalLogoInnerGlow} />
                <Image
                  source={require("../../assets/images/Logo_Cucei.png")}
                  style={styles.modalLogoImage}
                  resizeMode="contain"
                />
              </View>
              
              {/* ✨ ANIMACIÓN LOTTIE CON GLOW HERMOSO */}
              {showSuccessAnimation && (
                <View style={styles.modalLottieContainer}>
                  <View style={styles.modalLottieGlow} />
                  <LottieView
                    source={require("../assets/animations/Map_loading.json")}
                    autoPlay
                    loop={false}
                    style={styles.modalLottie}
                  />
                </View>
              )}
              
              {/* ✨ TEXTO SÚPER ELEGANTE */}
              <View style={styles.modalTextCentered}>
                <Text style={styles.modalTitleCentered}>¡Bienvenido!</Text>
                <Text style={styles.modalSubtitleCentered}>Preparando tu experiencia...</Text>
              </View>
              
            </View>
            
          </View>
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

  // ✨ MODAL SÚPER ELEGANTE Y RESPONSIVO
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backdropFilter: "blur(15px)",
  },
  
  modalContentWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: Platform.OS === 'android' ? 28 : 32,
    padding: Platform.OS === 'android' 
      ? (isTablet ? 30 : 25) 
      : (isTablet ? 35 : 30),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 35,
    elevation: 25,
    borderWidth: 1,
    borderColor: "rgba(208, 216, 246, 0.8)",
    width: '100%',
    maxWidth: Platform.OS === 'android' 
      ? (isTablet ? 480 : 340) 
      : (isTablet ? 500 : 360),
    minHeight: Platform.OS === 'android' 
      ? (isTablet ? 380 : 320) 
      : (isTablet ? 400 : 350),
  },
  
  // ✨ CONTENEDOR PRINCIPAL CENTRADO
  modalMainContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  
  // ✨ LOGO DEL MODAL CON TRIPLE GLOW HERMOSO
  modalLogoMain: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'android' 
      ? (isTablet ? 25 : 20) 
      : (isTablet ? 30 : 25),
    position: 'relative',
  },
  
  modalLogoOuterGlow: {
    position: 'absolute',
    width: Platform.OS === 'android' 
      ? (isTablet ? 180 : 140) 
      : (isTablet ? 200 : 160),
    height: Platform.OS === 'android' 
      ? (isTablet ? 125 : 95) 
      : (isTablet ? 140 : 110),
    borderRadius: Platform.OS === 'android' 
      ? (isTablet ? 90 : 70) 
      : (isTablet ? 100 : 80),
    backgroundColor: 'rgba(11, 52, 176, 0.04)',
    zIndex: 1,
  },
  
  modalLogoMiddleGlow: {
    position: 'absolute',
    width: Platform.OS === 'android' 
      ? (isTablet ? 150 : 115) 
      : (isTablet ? 170 : 130),
    height: Platform.OS === 'android' 
      ? (isTablet ? 105 : 80) 
      : (isTablet ? 115 : 90),
    borderRadius: Platform.OS === 'android' 
      ? (isTablet ? 75 : 57.5) 
      : (isTablet ? 85 : 65),
    backgroundColor: 'rgba(11, 52, 176, 0.06)',
    zIndex: 2,
  },
  
  modalLogoInnerGlow: {
    position: 'absolute',
    width: Platform.OS === 'android' 
      ? (isTablet ? 120 : 95) 
      : (isTablet ? 140 : 110),
    height: Platform.OS === 'android' 
      ? (isTablet ? 85 : 65) 
      : (isTablet ? 95 : 75),
    borderRadius: Platform.OS === 'android' 
      ? (isTablet ? 60 : 47.5) 
      : (isTablet ? 70 : 55),
    backgroundColor: 'rgba(11, 52, 176, 0.08)',
    zIndex: 3,
  },
  
  modalLogoImage: {
    width: Platform.OS === 'android' 
      ? (isTablet ? 110 : 85) 
      : (isTablet ? 130 : 100),
    height: Platform.OS === 'android' 
      ? (isTablet ? 75 : 60) 
      : (isTablet ? 90 : 70),
    opacity: 0.95,
    zIndex: 4,
  },
  
  // ✨ CONTENEDOR LOTTIE CON GLOW
  modalLottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'android' 
      ? (isTablet ? 20 : 15) 
      : (isTablet ? 25 : 20),
    position: 'relative',
  },
  
  modalLottieGlow: {
    position: 'absolute',
    width: Platform.OS === 'android' 
      ? (isTablet ? 200 : 160) 
      : (isTablet ? 220 : 180),
    height: Platform.OS === 'android' 
      ? (isTablet ? 200 : 160) 
      : (isTablet ? 220 : 180),
    borderRadius: Platform.OS === 'android' 
      ? (isTablet ? 100 : 80) 
      : (isTablet ? 110 : 90),
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    zIndex: 1,
  },
  
  modalLottie: {
    width: Platform.OS === 'android' 
      ? (isTablet ? 160 : 120) 
      : (isTablet ? 180 : 140),
    height: Platform.OS === 'android' 
      ? (isTablet ? 160 : 120) 
      : (isTablet ? 180 : 140),
    zIndex: 2,
  },
  
  // ✨ TEXTO SÚPER ELEGANTE Y CENTRADO
  modalTextCentered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  
  modalTitleCentered: {
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 22 : 18) 
      : (isTablet ? 24 : 20),
    fontWeight: "800",
    color: "#0b34b0",
    textAlign: "center",
    letterSpacing: Platform.OS === 'android' ? 0.8 : 1,
    marginBottom: 8,
    lineHeight: Platform.OS === 'android' 
      ? (isTablet ? 28 : 24) 
      : (isTablet ? 30 : 26),
    textShadowColor: 'rgba(11, 52, 176, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  
  modalSubtitleCentered: {
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 15 : 13) 
      : (isTablet ? 16 : 14),
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
    letterSpacing: 0.5,
    opacity: 0.8,
    lineHeight: Platform.OS === 'android' 
      ? (isTablet ? 20 : 18) 
      : (isTablet ? 22 : 19),
  },

  // ✨ ESTILOS PARA EMAIL PRE-CARGADO
  inputContainerPreFilled: {
    borderColor: "#52c41a",
    backgroundColor: "rgba(240, 255, 240, 0.9)",
    shadowColor: "#52c41a",
    shadowOpacity: 0.1,
  },

  inputIconSuccess: {
    color: "#52c41a",
  },

  preFilledIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(82, 196, 26, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  checkIcon: {
    color: "#52c41a",
  },
});
export default LoginScreen;
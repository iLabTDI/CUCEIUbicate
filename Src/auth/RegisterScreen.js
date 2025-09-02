"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  ActivityIndicator,
  Easing,
  Modal,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import LottieView from "lottie-react-native"
import { validar_correo } from "../Api/validaciones"
import successAnimation from "../assets/animations/complete.json"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faEye,
  faEyeSlash,
  faEnvelope,
  faLock,
  faCheckCircle,
  faTimesCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons"

const { width } = Dimensions.get("window")
const isTablet = width >= 768

// Función para sombras optimizadas según plataforma
const getShadowStyle = (elevation, color = "#000", opacity = 0.1) => {
  if (Platform.OS === 'android') {
    return {
      elevation: Math.min(elevation, 6), // Limitamos elevation en Android
      shadowColor: color,
    };
  } else {
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: elevation / 2 },
      shadowOpacity: opacity,
      shadowRadius: elevation,
    };
  }
};

export const RegisterScreen = () => {
  const navigation = useNavigation()
  const scrollViewRef = useRef(null)

  // Estados
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [shakeAnimation] = useState(new Animated.Value(0))
  const [bgAnim] = useState(new Animated.Value(0))
  const [floatingAnim] = useState(new Animated.Value(0))
  const [sparkleAnims] = useState([...Array(8)].map(() => new Animated.Value(0)))

  // Lista de dominios permitidos
  const allowedDomains = ["alumnos.udg.mx", "gmail.com"]

  // Regex para correo y contraseña
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,-_<>?¿¡!])(?=.{8,})/

  // Inicializar animaciones
  useEffect(() => {
    // Animación del fondo
    Animated.loop(
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: false,
      })
    ).start()

    // Animación flotante
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
      ])
    ).start( )
  }, [])

  // Alternar visibilidad de contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Funciones de validación directamente aquí
  const validateEmail = (email) => {
    if (!email) {
      return { isValid: false, message: 'El email es requerido' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Formato de email inválido' };
    }
    return { isValid: true };
  };

  const validatePassword = (password) => {
    if (!password) {
      return { isValid: false, message: 'La contraseña es requerida' };
    }
    if (password.length < 6) {
      return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }
    if (password.length > 50) {
      return { isValid: false, message: 'La contraseña no puede tener más de 50 caracteres' };
    }
    return { isValid: true };
  };

  // Función principal para validar y navegar
  const handleRegister = async () => {
    setEmailError(false)
    setPasswordError(false)
    setErrorMsg("")
    setIsLoading(true)

    try {
      // Validar campos vacíos
      if (!email || !password || !confirmPassword) {
        setErrorMsg("Por favor, completa todos los campos")
        shakeForm()
        throw new Error("Campos incompletos")
      }

      // Validar email usando las nuevas utilidades
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        setEmailError(true)
        setErrorMsg(emailValidation.message)
        shakeForm()
        throw new Error("Email no válido")
      }

      // Verificar dominio permitido
      if (!allowedDomains.includes(email.split("@")[1])) {
        setEmailError(true)
        setErrorMsg("Usa tu correo institucional (@alumnos.udg.mx)")
        shakeForm()
        throw new Error("Dominio no permitido")
      }

      // Validar contraseña usando las nuevas utilidades
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setPasswordError(true)
        setErrorMsg(passwordValidation.message)
        shakeForm()
        throw new Error("Contraseña no válida")
      }

      // Validar confirmación de contraseña
      if (password !== confirmPassword) {
        setPasswordError(true)
        setErrorMsg("Las contraseñas no coinciden")
        shakeForm()
        throw new Error("Las contraseñas no coinciden")
      }

      // Validar si el correo ya existe en la base
      const correoValido = await validar_correo(email)
      if (!correoValido) {
        setEmailError(true)
        setErrorMsg("Este correo electrónico ya se ha registrado")
        shakeForm()
        throw new Error("Correo ya registrado")
      }

      // Si todo está bien, mostrar animación de éxito y navegar
      setShowSuccessAnimation(true)
      setModalVisible(true)
      setTimeout(() => {
        setModalVisible(false)
        setShowSuccessAnimation(false)
        navigation.navigate("Completar Perfil", { mail: email, pass: password })
      }, 2500)
    } catch (error) {
      // Se omiten logs en consola
    } finally {
      setIsLoading(false)
    }
  }

  // Animación de "shake" para el formulario
  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start()
  }

  const handleFocus = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }

  // Gradiente animado de fondo
  const bgColor = bgAnim.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: ["#e8f2ff", "#f0f6ff", "#e3e9fa", "#f4f8ff"],
  })

  // const floatingTransform = floatingAnim.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0, -8],
  // })

  return (
    <>
      {/* Fondo animado con gradiente dinámico */}
      <Animated.View style={[styles.animatedBg, { backgroundColor: bgColor }]} />
    
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.formWrapper, 
              // { 
              //   transform: [
              //     { translateX: shakeAnimation },
              //     { translateY: floatingTransform }
              //   ] 
              // }
            ]}
          > 
            <Text style={styles.title}>Registra tu cuenta</Text>
            <Text style={styles.subtitle}>Únete a la comunidad CUCEI</Text>
            
            <View style={styles.lottieOverlayContainer}>
              {/* <View style={styles.lottieOverlay} /> */}
              <LottieView
                source={require("../assets/animations/register.json")}
                autoPlay
                loop
                style={styles.animation}
              />
            </View>
            
            <View style={styles.formContainer}>
              {/* Input de Correo con icono limpio */}
              <View style={[styles.inputContainer, emailError && styles.inputContainerError]}>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={emailError ? styles.inputIconError : styles.inputIconBlue}
                  size={22}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Correo institucional"
                  placeholderTextColor="#a8b2c8"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={handleFocus}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  selectionColor="#0b34b0"
                />
                {email.length > 0 && (
                  <>
                    {emailRegex.test(email) && allowedDomains.includes(email.split("@")[1]) ? (
                      <Animated.View style={styles.validIconWrapper}>
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          style={styles.inputIconValid}
                          size={22}
                        />
                      </Animated.View>
                    ) : (
                      <Animated.View style={styles.validIconWrapper}>
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          style={styles.inputIconError}
                          size={22}
                        />
                      </Animated.View>
                    )}
                  </>
                )}
              </View>
              <View style={[styles.inputContainer, passwordError && styles.inputContainerError]}>
                <FontAwesomeIcon
                  icon={faLock}
                  style={passwordError ? styles.inputIconError : styles.inputIconBlue}
                  size={22}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña segura"
                  placeholderTextColor="#a8b2c8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={handleFocus}
                  autoCapitalize="none"
                  selectionColor="#0b34b0"
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
                  <FontAwesomeIcon 
                    icon={showPassword ? faEyeSlash : faEye} 
                    size={20} 
                    color="#7a89a8" 
                  />
                </TouchableOpacity>
              </View>

              {/* Input de Confirmar Contraseña con icono limpio */}
              <View style={[styles.inputContainer, passwordError && styles.inputContainerError]}>
                <FontAwesomeIcon
                  icon={faLock}
                  style={passwordError ? styles.inputIconError : styles.inputIconBlue}
                  size={22}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar contraseña"
                  placeholderTextColor="#a8b2c8"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={handleFocus}
                  autoCapitalize="none"
                  selectionColor="#0b34b0"
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
                  <FontAwesomeIcon 
                    icon={showPassword ? faEyeSlash : faEye} 
                    size={20} 
                    color="#7a89a8" 
                  />
                </TouchableOpacity>
              </View>

              {/* Texto de requisitos de contraseña mejorado */}
              <View style={styles.hintContainer}>
                <Text style={styles.passwordHint}>
                  <Text style={styles.hintTitle}>Requisitos: </Text>
                  8+ caracteres, 1 mayúscula, 1 número y 1 símbolo
                </Text>
              </View>

              {/* Botón para Continuar con gradiente */}
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonLoading]}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <View style={styles.buttonGradient}>
                  {isLoading ? (
                    <ActivityIndicator size={28} color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Continuar</Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Mensaje de error mejorado */}
              {errorMsg ? (
                <Animated.View style={styles.errorContainer}>
                  <FontAwesomeIcon icon={faTimesCircle} size={16} color="#ff4d4f" />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </Animated.View>
              ) : null}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de paso completado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBlurBg}>
          <Animated.View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Icono bonito de check */}
              <FontAwesomeIcon icon={faCheckCircle} size={64} color="#52c41a" style={{ marginBottom: 18 }} />
              <Text style={styles.modalTitle}>Primer paso completado</Text>
              <Text style={styles.modalSubtitle}>Ahora completa tu perfil</Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  )
}

/* Estilos modernos y hermosos */
const styles = StyleSheet.create({
  // Fondo y overlay
  animatedBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  particlesOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  sparkle: {
    position: "absolute",
    opacity: 0.6,
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
    // paddingTop: 20,
    paddingBottom: 30,
    maxWidth: 480,
  },

  // Títulos optimizados para Android
  title: {
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 30 : 26) 
      : (isTablet ? 38 : 32),
    fontWeight: "800",
    color: "#0b34b0",
    marginBottom: Platform.OS === 'android' ? 6 : 8,
    textAlign: "center",
    letterSpacing: Platform.OS === 'android' ? 1.0 : 1.5,
    ...(Platform.OS === 'ios' && {
      textShadowColor: "rgba(11, 52, 176, 0.1)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    }),
  },
  subtitle: {
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 16 : 15) 
      : (isTablet ? 18 : 16),
    color: "#6b7280",
    textAlign: "center",
    marginBottom: Platform.OS === 'android' ? 18 : 24,
    fontWeight: "500",
  },

  // Contenedor de Lottie optimizado para Android
  lottieOverlayContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'android' ? 16 : 20,
    position: 'relative',
    height: Platform.OS === 'android' 
      ? (isTablet ? 140 : 120) 
      : (isTablet ? 200 : 160),
  },
  lottieOverlay: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -0.5 * (isTablet ? 320 : 240) }],
    width: isTablet ? 320 : 240,
    height: isTablet ? 320 : 240,
    backgroundColor: 'rgba(11, 52, 176, 0.08)',
    borderRadius: 160,
    zIndex: 1,
  },
  animation: {
    width: Platform.OS === 'android' 
      ? (isTablet ? 240 : 180) 
      : (isTablet ? 320 : 240),
    height: Platform.OS === 'android' 
      ? (isTablet ? 240 : 180) 
      : (isTablet ? 320 : 240),
    alignSelf: "center",
    zIndex: 2,
  },

  // Contenedor del formulario optimizado para Android
  formContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: Platform.OS === 'android' ? 20 : 28,
    paddingVertical: Platform.OS === 'android' 
      ? (isTablet ? 28 : 24) 
      : (isTablet ? 40 : 32),
    paddingHorizontal: Platform.OS === 'android' 
      ? (isTablet ? 36 : 28) 
      : (isTablet ? 40 : 32),
    alignItems: "center",
    ...getShadowStyle(Platform.OS === 'android' ? 4 : 8, "#0b34b0", 0.12),
    borderWidth: Platform.OS === 'android' ? 0.5 : 1,
    borderColor: "rgba(208, 216, 246, 0.4)",
  },

  // Inputs optimizados y más estirados para Android
  inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: Platform.OS === 'android' ? 16 : 20,
  paddingHorizontal: Platform.OS === 'android' ? 4 : 6,
  marginBottom: Platform.OS === 'android' ? 16 : 20,
  borderWidth: Platform.OS === 'android' ? 1 : 2,
  borderColor: Platform.OS === 'android' ? "rgba(229, 233, 245, 0.8)" : "#e5e9f5",
  height: Platform.OS === 'android' 
    ? (isTablet ? 52 : 48) 
    : (isTablet ? 68 : 58),
  ...getShadowStyle(Platform.OS === 'android' ? 2 : 4, "#0b34b0", 0.06),
  width: "100%",
  overflow: 'hidden',
  position: 'relative',
  },
  inputContainerError: {
    borderColor: "#ff6b6b",
    backgroundColor: "rgba(255, 240, 240, 0.9)",
    ...getShadowStyle(Platform.OS === 'android' ? 1 : 2, "#ff6b6b", 0.1),
  },
  iconWrapper: {
    width: Platform.OS === 'android' ? 40 : 50,
    height: Platform.OS === 'android' ? 40 : 50,
    borderRadius: Platform.OS === 'android' ? 12 : 15,
    backgroundColor: "rgba(11, 52, 176, 0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Platform.OS === 'android' ? 10 : 12,
  },
  input: {
    flex: 1,
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 16 : 15) 
      : (isTablet ? 18 : 16),
    color: "#2d3748",
    fontWeight: "500",
    letterSpacing: Platform.OS === 'android' ? 0.2 : 0.3,
    paddingVertical: Platform.OS === 'android' ? 8 : 12,
    paddingRight: Platform.OS === 'android' ? 8 : 12,
    marginLeft: Platform.OS === 'android' ? 6 : 8,
  },
  validIconWrapper: {
    width: Platform.OS === 'android' ? 32 : 40,
    height: Platform.OS === 'android' ? 32 : 40,
    borderRadius: Platform.OS === 'android' ? 10 : 12,
    backgroundColor: "rgba(82, 196, 26, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Platform.OS === 'android' ? 6 : 8,
  },
  eyeIconContainer: {
    width: Platform.OS === 'android' ? 36 : 44,
    height: Platform.OS === 'android' ? 36 : 44,
    borderRadius: Platform.OS === 'android' ? 10 : 12,
    backgroundColor: "rgba(122, 137, 168, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Platform.OS === 'android' ? 6 : 8,
  },

  // Iconos
  inputIconBlue: {
    color: "#0b34b0",
    marginLeft: 8,
    marginRight: 4,
    alignSelf: 'center',
  },
  inputIconValid: {
    color: "#52c41a",
    alignSelf: 'center',
  },
  inputIconError: {
    color: "#ff6b6b",
    marginLeft: 8,
    marginRight: 4,
    alignSelf: 'center',
  },

  // Hint de contraseña optimizado para Android
  hintContainer: {
    backgroundColor: "rgba(11, 52, 176, 0.04)",
    borderRadius: Platform.OS === 'android' ? 12 : 16,
    padding: Platform.OS === 'android' ? 12 : 16,
    marginBottom: Platform.OS === 'android' ? 18 : 24,
    width: "100%",
    borderWidth: Platform.OS === 'android' ? 0.5 : 1,
    borderColor: "rgba(11, 52, 176, 0.1)",
  },
  passwordHint: {
    fontSize: Platform.OS === 'android' ? 13 : 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: Platform.OS === 'android' ? 18 : 20,
  },
  hintTitle: {
    color: "#0b34b0",
    fontWeight: "700",
  },

  // Botón optimizado para Android
  button: {
    borderRadius: Platform.OS === 'android' ? 16 : 20,
    width: "100%",
    height: Platform.OS === 'android' 
      ? (isTablet ? 52 : 48) 
      : (isTablet ? 68 : 58),
    ...getShadowStyle(Platform.OS === 'android' ? 3 : 6, "#0b34b0", 0.2),
    overflow: 'hidden',
  },
  buttonGradient: {
    backgroundColor: "#0b34b0",
    borderRadius: Platform.OS === 'android' ? 16 : 20,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLoading: {
    opacity: Platform.OS === 'android' ? 0.8 : 0.9,
  },
  buttonText: {
    color: "white",
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 17 : 16) 
      : (isTablet ? 20 : 18),
    fontWeight: "700",
    letterSpacing: Platform.OS === 'android' ? 0.8 : 1.2,
    ...(Platform.OS === 'ios' && {
      textShadowColor: "rgba(0, 0, 0, 0.15)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    }),
  },

  // Error optimizado para Android
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Platform.OS === 'android' ? 6 : 8,
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 14 : 13) 
      : (isTablet ? 15 : 14),
    fontWeight: "500",
    marginLeft: 6,
    flex: 1,
    letterSpacing: Platform.OS === 'android' ? 0.3 : 0.5,
  },

  // Modal optimizado para Android
  modalBlurBg: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: "blur(8px)",
  },
  modalContainer: {
    marginHorizontal: 32,
    borderRadius: 32,
    overflow: "hidden",
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 32,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#0b34b0',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 25,
    borderWidth: 1,
    borderColor: 'rgba(208, 216, 246, 0.8)',
  },
  modalAnimation: {
    width: isTablet ? 160 : 120,
    height: isTablet ? 160 : 120,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: isTablet ? 26 : 22,
    color: '#0b34b0',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1.2,
  },
  modalSubtitle: {
    fontSize: isTablet ? 16 : 14,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },
});
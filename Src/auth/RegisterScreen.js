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
} from "@fortawesome/free-solid-svg-icons"

const { width } = Dimensions.get("window")
const isTablet = width >= 768

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

      // Validar correo y dominio
      if (!emailRegex.test(email) || !allowedDomains.includes(email.split("@")[1])) {
        setEmailError(true)
        setErrorMsg("Correo electrónico no válido")
        shakeForm()
        throw new Error("Correo no válido")
      }

      // Validar contraseña con regex
      if (!passwordRegex.test(password)) {
        setPasswordError(true)
        setErrorMsg("La contraseña no es válida.")
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
                  placeholder="Correo electrónico institucional"
                  placeholderTextColor="#a8b2c8"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={handleFocus}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  selectionColor="#0b34b0"
                />
                {emailRegex.test(email) && allowedDomains.includes(email.split("@")[1]) && (
                  <Animated.View style={styles.validIconWrapper}>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      style={styles.inputIconValid}
                      size={22}
                    />
                  </Animated.View>
                )}
              </View>

              {/* Input de Contraseña con icono limpio */}
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
              <Text style={styles.modalTitle}>✔️ Primer paso completado</Text>
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
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
    height: isTablet ? 200 : 160,
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
  overflow: 'hidden',
  position: 'relative',
  },
  inputContainerError: {
    borderColor: "#ff6b6b",
    backgroundColor: "rgba(255, 240, 240, 0.9)",
    shadowColor: "#ff6b6b",
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "rgba(11, 52, 176, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
  validIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(82, 196, 26, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
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

  // Hint de contraseña
  hintContainer: {
    backgroundColor: "rgba(11, 52, 176, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    width: "100%",
  },
  passwordHint: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
  hintTitle: {
    color: "#0b34b0",
    fontWeight: "700",
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
    overflow: 'hidden',
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
  flexDirection: "row",
  alignItems: "center",
  marginTop: 8,
  },
  errorText: {
  color: "#ff4d4f",
  fontSize: isTablet ? 15 : 14,
  fontWeight: "600",
  marginLeft: 6,
  flex: 1,
  letterSpacing: 0.5,
  fontWeight: "500",
  marginLeft: 6,
  flex: 1,
  },

  // Modal
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

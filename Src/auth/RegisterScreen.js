"use client"

import { useState, useRef } from "react"
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

const { width, height } = Dimensions.get("window")
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

  // Lista de dominios permitidos
  const allowedDomains = ["alumnos.udg.mx", "gmail.com"]

  // Regex para correo y contraseña
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  // Requiere: 1 mayúscula, 1 dígito, 1 símbolo y mínimo 8 caracteres
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,-_<>?¿¡!])(?=.{8,})/

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
      }, 2000)
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

  // Gradiente animado de fondo (simulado con interpolación de color)
  const bgColor = bgAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["#e3e9fa", "#f4f4f4", "#e3e9fa"],
  });

  // Animación infinita para el fondo
  useState(() => {
    Animated.loop(
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  return (
    <>
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
        >
          <Animated.View style={[styles.formWrapper, { transform: [{ translateX: shakeAnimation }] }]}> 
            <Text style={styles.title}>Registra tu cuenta</Text>
            <View style={styles.lottieOverlayContainer}>
              <View style={styles.lottieOverlay} />
              <LottieView
                source={require("../assets/animations/register.json")}
                autoPlay
                loop
                style={styles.animation}
              />
            </View>
            <View style={styles.formContainer}>
              {/* Input de Correo */}
              <View style={[styles.inputContainer, emailError && styles.inputContainerError]}>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={styles.inputIconBlue}
                  size={20}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={handleFocus}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {emailRegex.test(email) && allowedDomains.includes(email.split("@")[1]) && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    style={styles.inputIconValid}
                    size={20}
                  />
                )}
              </View>
              {/* Input de Contraseña */}
              <View style={[styles.inputContainer, passwordError && styles.inputContainerError]}>
                <FontAwesomeIcon
                  icon={faLock}
                  style={styles.inputIconBlue}
                  size={20}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={handleFocus}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size={20} color="#999" />
                </TouchableOpacity>
              </View>
              {/* Input de Confirmar Contraseña */}
              <View style={[styles.inputContainer, passwordError && styles.inputContainerError]}>
                <FontAwesomeIcon
                  icon={faLock}
                  style={styles.inputIconBlue}
                  size={20}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar contraseña"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={handleFocus}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size={20} color="#999" />
                </TouchableOpacity>
              </View>
              {/* Texto de requisitos de contraseña */}
              <Text style={styles.passwordHint}>
                Debe incluir 8 caracteres, 1 mayúscula, 1 número y 1 símbolo
              </Text>
              {/* Botón para Continuar */}
              <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size={24} color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Continuar</Text>
                )}
              </TouchableOpacity>
              {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Modal de éxito con Lottie */}
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
    </>
  )
}

/* Estilos, inspirados en el login */
const styles = StyleSheet.create({
  lottieOverlayContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
    height: isTablet ? 220 : 180,
  },
  lottieOverlay: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -0.5 * (isTablet ? 350 : 260) }],
    width: isTablet ? 350 : 260,
    height: isTablet ? 350 : 260,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 120,
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  formWrapper: {
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
  },
  animatedBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: "#e3e9fa",
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
  formWrapper: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    maxWidth: 500,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0b34b0",
    marginBottom: 18,
    textAlign: "center",
    letterSpacing: 1.2,
  },
  animation: {
    width: isTablet ? 350 : 260,
    height: isTablet ? 350 : 260,
    alignSelf: "center",
    marginVertical: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
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
    width: "100%",
  },
  inputContainerError: {
    borderColor: "#ff4d4f",
    backgroundColor: "#fff3f3",
  },
  inputIcon: {
    marginRight: 14,
  },
  inputIconBlue: {
    color: "#0b34b0",
  },
  inputIconValid: {
    color: "#52c41a",
  },
  inputIconError: {
    color: "#ff4d4f",
  },
  input: {
    flex: 1,
    fontSize: isTablet ? 20 : 17,
    color: "#222",
    fontWeight: "500",
    letterSpacing: 0.2,
    backgroundColor: "transparent",
    paddingVertical: 10,
    marginRight: 10,
    paddingLeft: 10,
  },
  eyeIconContainer: {
    padding: 10,
  },
  passwordHint: {
    alignSelf: "flex-start",
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
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
  errorText: {
    color: "#ff4d4f",
    textAlign: "center",
    marginTop: 15,
    fontSize: isTablet ? 18 : 16,
    fontWeight: "500",
  },
});

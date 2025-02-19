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
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import LottieView from "lottie-react-native"
import { validar_correo } from "../Api/validaciones"
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

  // Animación de "shake" para el formulario en caso de error
  const [shakeAnimation] = useState(new Animated.Value(0))

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
        setErrorMsg("La contraseña debe incluir al menos 8 caracteres, 1 mayúscula, 1 número y 1 símbolo.")
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

      // Si todo está bien, navegamos a la siguiente pantalla
      navigation.navigate("Completar Perfil", { mail: email, pass: password })
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

  return (
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

          <LottieView
            source={require("../assets/animations/register.json")}
            autoPlay
            loop
            style={styles.animation}
          />

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
  )
}

/* Estilos, inspirados en el login */
const styles = StyleSheet.create({
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0b34b0",
    marginBottom: 30,
    textAlign: "center",
  },
  animation: {
    width: width * 0.55,
    height: width * 0.55,
    // marginBottom: 30,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
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
    width: "100%",
  },
  inputContainerError: {
    borderColor: "#ff4d4f",
  },
  inputIcon: {
    marginRight: 10,
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
    fontSize: isTablet ? 18 : 16,
    color: "#000",
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
  errorText: {
    color: "#ff4d4f",
    textAlign: "center",
    marginTop: 15,
    fontSize: isTablet ? 18 : 16,
    fontWeight: "500",
  },
})

export default RegisterScreen

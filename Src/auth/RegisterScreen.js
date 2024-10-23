// Importamos las dependencias necesarias
import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { alta_usuario } from "../Api/altaUsuario";
import { validar_correo } from "../Api/validaciones";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { 
  faEye, 
  faEyeSlash, 
  faEnvelope, 
  faLock, 
  faCheckCircle, 
  faTimesCircle 
} from "@fortawesome/free-solid-svg-icons";

// Obtenemos las dimensiones de la pantalla para un diseño responsivo
const { width, height } = Dimensions.get('window');

export const RegisterScreen = () => {
  // Estados para manejar los inputs del formulario y el control de la UI
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [Isloading, setIsLoading] = useState(false);

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Dominios de correo permitidos y patrones regex para validación
  const allowedDomains = [
    "alumnos.udg.mx",
    "gmail.com",
    "hotmail.com",
    "outlook.com",
  ];
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // Hook para la navegación
  const navigation = useNavigation();

  // Efecto para calcular la fortaleza de la contraseña
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength++; // Verifica la longitud
    if (password.match(/[A-Z]/)) strength++; // Verifica mayúsculas
    if (password.match(/[a-z]/)) strength++; // Verifica minúsculas
    if (password.match(/[0-9]/)) strength++; // Verifica números
    if (password.match(/[^A-Za-z0-9]/)) strength++; // Verifica caracteres especiales
    setPasswordStrength(strength);
  }, [password]);

   // Función para manejar el registro
   const handleRegister = async () => {
    // Reiniciamos los estados de error
    setEmailError(false);
    setPasswordError(false);
    setErrorMsg("");
    setIsLoading(true);  // Iniciamos la carga

    try {
      // Verificamos que todos los campos estén llenos
      if (!email || !password || !confirmPassword) {
        setErrorMsg("Por favor, completa todos los campos");
        shakeForm();
        throw new Error("Campos incompletos");
      }

      // Validamos el formato del correo y el dominio
      if (
        !emailRegex.test(email) ||
        !allowedDomains.includes(email.split("@")[1])
      ) {
        setEmailError(true);
        setErrorMsg("Correo electrónico no válido");
        shakeForm();
        throw new Error("Correo no válido");
      }

      // Validamos el formato de la contraseña
      if (!passwordRegex.test(password)) {
        setPasswordError(true);
        setErrorMsg(
          "La contraseña debe tener al menos 8 caracteres, incluyendo al menos 1 letra y 1 número."
        );
        shakeForm();
        throw new Error("Contraseña no válida");
      }

      // Verificamos que las contraseñas coincidan
      if (password !== confirmPassword) {
        setPasswordError(true);
        setErrorMsg("Las contraseñas no coinciden");
        shakeForm();
        throw new Error("Las contraseñas no coinciden");
      }

      // Verificamos si el correo ya está registrado
      const correoValido = await validar_correo(email);
      if (!correoValido) {
        setEmailError(true);
        setErrorMsg("Este correo electrónico ya se ha registrado");
        shakeForm();
        throw new Error("Correo ya registrado");
      }

      // Si todas las validaciones pasan, navegamos a la siguiente pantalla
      navigation.navigate("Completar Perfil", { mail: email, pass: password });
    } catch (error) {
      // console.error(error.message);
    } finally {
      setIsLoading(false);  // Detenemos la carga
    }
  };

  // Función para animar el formulario cuando hay un error
  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  // Renderizamos el componente
  return (
    // KeyboardAvoidingView para manejar la aparición del teclado
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.KeyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      {/* ScrollView para permitir el desplazamiento si el contenido excede la altura de la pantalla */}
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollViewContent}>
        {/* Contenedor animado para el efecto de sacudida */}
        <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnimation }] }]}>
          {/* Título de la pantalla de registro */}
          <Text style={styles.title}>Registra tu cuenta</Text>
          
          {/* Animación Lottie para mejorar el atractivo visual */}
          <LottieView
            source={require("../assets/animations/register.json")}
            autoPlay
            loop={true}
            style={styles.animation}
          />
          
          {/* Contenedor del formulario */}
          <View style={styles.formContainer}>
            {/* Campo de entrada para el correo electrónico */}
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faEnvelope} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, emailError && styles.inputError]}
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
                autoCompleteType="email"
                keyboardType="email-address"
              />
              {/* Mostramos un ícono de verificación o error basado en la validez del correo */}
              {email && (
                <FontAwesomeIcon
                  icon={emailError ? faTimesCircle : faCheckCircle}
                  style={[styles.inputIcon, { color: emailError ? 'red' : 'green' }]}
                />
              )}
            </View>

            {/* Campo de entrada para la contraseña */}
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faLock} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, passwordError && styles.inputError]}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={(text) => setPassword(text)}
              />
              {/* Botón para alternar la visibilidad de la contraseña */}
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordToggle}>
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Indicador de fortaleza de la contraseña */}
            <View style={styles.passwordStrengthContainer}>
              {[...Array(5)].map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.passwordStrengthBar,
                    index < passwordStrength && styles.passwordStrengthBarFilled
                  ]}
                />
              ))}
            </View>

            {/* Campo de entrada para confirmar la contraseña */}
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faLock} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, passwordError && styles.inputError]}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#999"
                value={confirmPassword}
                secureTextEntry={!showPassword}
                onChangeText={(text) => setConfirmPassword(text)}
              />
              {/* Botón para alternar la visibilidad de la contraseña */}
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordToggle}>
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {/* Botón de envío */}

            <TouchableOpacity
                  style={styles.button}
                  onPress={handleRegister}
                  disabled={Isloading}
                >
                  {Isloading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Continuar</Text>
                  )}
                </TouchableOpacity>
            {/* <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity> */}

            {/* Mostrar mensaje de error si existe */}
            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Estilos para el componente
const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Fondo gris claro para toda la pantalla
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.05, // Padding vertical basado en la altura de la pantalla
  },
  container: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: width * 0.05, // Padding horizontal basado en el ancho de la pantalla
  },
  title: {
    fontSize: width * 0.08, // Tamaño de fuente relativo al ancho de la pantalla
    fontWeight: "bold",
    color: "#0b34b0", // Color azul profundo para el título
    marginBottom: height * 0.04,
    textAlign: "center",
    marginTop: height * -0.07,  
  },
  animation: {
    width: width * 0.5, // Tamaño de la animación relativo al ancho de la pantalla
    height: width * 0.5,
    marginBottom: height * 0.02,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: width * 0.05,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Para sombra en Android
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: width * 0.03,
  },
  inputIcon: {
    marginRight: width * 0.02,
    color: "#0b34b0", // Color azul profundo para los íconos
  },
  input: {
    flex: 1,
    paddingVertical: height * 0.015,
    fontSize: width * 0.04,
    color: "#333",
  },
  inputError: {
    borderColor: "red", // Borde rojo para inputs con error
  },
  passwordToggle: {
    padding: width * 0.02,
  },
  button: {
    backgroundColor: "#0b34b0", // Color azul profundo para el botón
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: height * 0.02,
    fontSize: width * 0.035,
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  passwordStrengthBar: {
    flex: 1,
    height: 5,
    backgroundColor: '#ddd', // Gris claro para barras de fortaleza no llenas
    marginHorizontal: 2,
    borderRadius: 2,
  },
  passwordStrengthBarFilled: {
    backgroundColor: '#0b34b0', // Azul profundo para barras de fortaleza llenas
  },
});

export default RegisterScreen;
import React, { useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { alta_usuario } from "../Api/altaUsuario";
import { validar_correo } from "../Api/validaciones";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

const { width, height } = Dimensions.get('window');

export const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const allowedDomains = [
    "alumnos.udg.mx",
    "gmail.com",
    "hotmail.com",
    "outlook.com",
  ];
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

  const navigation = useNavigation();

  const handleRegister = async () => {
    setEmailError(false);
    setPasswordError(false);
    setErrorMsg("");

    if (!email || !password || !confirmPassword) {
      setEmailError(true);
      setPasswordError(true);
      setErrorMsg("Por favor, completa todos los campos");
      return;
    }

    if (
      !emailRegex.test(email) ||
      !allowedDomains.includes(email.split("@")[1])
    ) {
      setEmailError(true);
      setErrorMsg("Correo electrónico no válido");
      return;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(true);
      setErrorMsg(
        "La contraseña debe tener al menos 8 caracteres, incluyendo al menos 1 número y 1 letra mayúscula."
      );
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(true);
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }

    const correoValido = await validar_correo(email);
    if (!correoValido) {
      setEmailError(true);
      setErrorMsg("Este correo electrónico ya se ha registrado");
      return;
    }

    navigation.navigate("Completar Perfil", { mail: email, pass: password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.KeyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Registra tu cuenta</Text>
          <LottieView
            source={require("../assets/animations/register.json")}
            autoPlay
            loop={true}
            style={styles.animation}
          />
          <View style={styles.formContainer}>
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
            </View>

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
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordToggle}>
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

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
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordToggle}>
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: height * 0.05,
  },
  container: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#0b34b0",
    marginBottom: height * 0.04,
    textAlign: "center",
    marginTop: height * -0.07,  
  },
  animation: {
    width: width * 0.5,
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
    elevation: 5,
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
    color: "#0b34b0",
  },
  input: {
    flex: 1,
    paddingVertical: height * 0.015,
    fontSize: width * 0.04,
    color: "#333",
  },
  inputError: {
    borderColor: "red",
  },
  passwordToggle: {
    padding: width * 0.02,
  },
  button: {
    backgroundColor: "#0b34b0",
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
});

export default RegisterScreen;
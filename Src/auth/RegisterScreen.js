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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { alta_usuario } from "../Api/altaUsuario";
import { validar_correo } from "../Api/validaciones";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
          <Text style={styles.successText}>Registra tu cuenta!</Text>
          <LottieView
            source={require("../assets/animations/register.json")}
            autoPlay
            loop={true}
            style={{ width: 200, height: 200, zIndex: 1 }}
          />
          <View style={styles.loginBox}>
            <View>
              <Text style={[styles.label, emailError && { color: "red" }]}>
                Correo Electrónico:
              </Text>
              <TextInput
                style={[styles.input, emailError && { borderColor: "red" }]}
                placeholder="alumno@cucei.com"
                placeholderTextColor="gray"
                value={email}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
                autoCompleteType="email"
                keyboardType="email-address"
              />

              <Text style={[styles.label, passwordError && { color: "red" }]}>
                Contraseña:
              </Text>
              <View
                style={[
                  styles.passwordInputContainer,
                  passwordError && { borderColor: "red" },
                ]}
              >
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor="gray"
                  value={password}
                  secureTextEntry={!showPassword}
                  onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.passwordToggle}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, passwordError && { color: "red" }]}>
                Confirmar Contraseña:
              </Text>
              <View
                style={[
                  styles.passwordInputContainer,
                  passwordError && { borderColor: "red" },
                ]}
              >
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirma tu contraseña"
                  placeholderTextColor="gray"
                  value={confirmPassword}
                  secureTextEntry={!showPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.passwordToggle}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.customButton}
                onPress={handleRegister}
              >
                <Text style={styles.buttonText}>Continuar</Text>
              </TouchableOpacity>

              {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E4EDF9",
    width: "100%",
    marginTop: 100,
  },
  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#E4EDF9",
    width: "100%",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginBox: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    marginBottom: 70,
  },
  iconCircle: {
    backgroundColor: "white",
    borderRadius: 60,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 2,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  passwordToggle: {
    padding: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    paddingTop: 15,
    fontSize: 15,
  },
  customButton: {
    marginTop: 15,
    backgroundColor: "#0b34b0",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  successText: {
    marginTop: -80,
    fontSize: 35,
    fontWeight: "bold",
    padding: 5,
  },
});

export default RegisterScreen;

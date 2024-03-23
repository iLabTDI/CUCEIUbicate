import React, { useState } from "react";
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
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import successAnimation from "../assets/animations/complete.json";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { login } from "../backend/login";

export const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [showIncorrectMessage, setShowIncorrectMessage] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const users = [
    { username: "yair", password: "admin" },
    { username: "admin", password: "admin" },
    { username: "Admin", password: "Admin" },
    { username: "ADMIN", password: "ADMIN" },
  ];

  const handleLogin = () => {
    setShowError(false);
    setShowIncorrectMessage(false);

    setTimeout(() => {
      const adminUsername = username;
      const adminPassword = password;

      if (!adminUsername || !adminPassword) {
        setShowError(true);
        setShowIncorrectMessage(false);
        return;
      }

      const isAdmin = users.some(
        (user) =>
          user.username === adminUsername && user.password === adminPassword
      );
      if (isAdmin) {
        setShowSuccessAnimation(true);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          setShowSuccessAnimation(false);
          navigation.navigate("Principal Home");
        }, 2000);
      } else {
        setShowError(true);
        setShowIncorrectMessage(true);
      }
    }, 3000);
  };

  const handleLoginTest = async () => {
    setShowError(false);
    setShowIncorrectMessage(false);

    const adminUsername = username;
    const adminPassword = password;

    if (!adminUsername || !adminPassword) {
      setShowError(true);
      setShowIncorrectMessage(false);
      return;
    }

    const isAdmin = await login(adminUsername, adminPassword);

    if (isAdmin) {
      setShowSuccessAnimation(true);
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        setShowSuccessAnimation(false);
        navigation.navigate("Principal Home");
      }, 2000);
    } else {
      setShowError(true);
      setShowIncorrectMessage(true);
    }
  };

  const handleRegister = () => {
    navigation.navigate("Registro");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.container}>
        <Image
          source={require("../assets/images/Logo_Cucei.png")}
          style={styles.logo}
        />
        <View style={styles.iconCircle}>
          <Icon
            name="user-circle-o"
            size={windowWidth * 0.2} // Ajusta el tamaño del icono
            color="#0b34b0"
          />
        </View>

        <View style={styles.loginBox}>
          <Text>Correo electrónico:</Text>
          <View style={[styles.inputContainer, (showError || showIncorrectMessage) && { borderColor: 'red' }]}>
            <FontAwesomeIcon icon={faEnvelope} style={[styles.iconStyle, (showError || showIncorrectMessage) && { color: 'red' }]} />
            <TextInput
              style={styles.input}
              placeholder="alumno@Cucei.com"
              placeholderTextColor="black"
              onChangeText={(text) => setUsername(text)}
            />
          </View>
          <Text style={styles.label}>Contraseña:</Text>
          <View style={[styles.inputContainer, (showError || showIncorrectMessage) && { borderColor: 'red' }]}>
            <FontAwesomeIcon icon={faLock} style={[styles.iconStyle, (showError || showIncorrectMessage) && { color: 'red' }]} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={!showPassword}
              placeholderTextColor="black"
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleLoginTest} style={styles.loginButton}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerText}>¿No tienes cuenta? ¡Regístrate!</Text>
          </TouchableOpacity>
          {showError && (
            <Text style={styles.errorText}>
              Por favor, completa ambos campos.
            </Text>
          )}
          {showIncorrectMessage && (
            <Text style={styles.errorText}>
              Correo o Contraseña incorrectos.
            </Text>
          )}
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
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
      </View>
    </KeyboardAvoidingView>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4EDF9',
    width: '100%'
  },
  loginBox: {
    width: windowWidth * 0.83,
    padding: windowWidth * 0.08,
    borderRadius: windowWidth * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    backgroundColor: 'white',
  },
  label: {
    fontSize: windowWidth * 0.04,
    marginTop: windowWidth * 0.02,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: windowWidth * 0.003,
    borderRadius: windowWidth * 0.02,
    padding: windowWidth * 0.015,
    marginTop: windowWidth * 0.02,
    marginBottom: windowWidth * 0.03,
  },
  iconStyle: {
    marginRight: windowWidth * 0.02,
  },
  input: {
    fontSize: windowWidth * 0.035,
    flex: 1,
    padding: windowWidth * 0.015,
    borderWidth: 0,
  },
  loginButton: {
    backgroundColor: '#0b34b0',
    borderRadius: windowWidth * 0.03,
    paddingVertical: windowWidth * 0.03,
    marginTop: windowWidth * 0.03,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: windowWidth * 0.04,
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: windowWidth * 0.03,
    fontSize: windowWidth * 0.04,
    color: '#0b34b0',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    paddingTop: windowWidth * 0.045,
  },
  iconCircle: {
    backgroundColor: 'white',
    borderRadius: windowWidth * 0.2, 
    width: windowWidth * 0.2, 
    height: windowWidth * 0.2, 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -windowWidth * 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: windowWidth * 0.02 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },
  logo: {
    marginTop: -windowHeight * 0.1,
    marginBottom: windowHeight * 0.05,
    width: windowWidth * 0.8,
    height: windowHeight * 0.2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  animation: {
    width: windowWidth * 0.6,
    height: windowWidth * 0.6,
  },
  eyeIcon: {
    fontSize: 24, 
    color: '#000',
  },
});
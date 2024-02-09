import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import successAnimation from "../assets/animations/complete.json";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [showIncorrectMessage, setShowIncorrectMessage] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleRegister = () => {
    navigation.navigate("Registro");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo2.png")}
        style={styles.logo}
      />
      <View style={styles.iconCircle}>
        <Icon
          name="user-circle-o"
          size={85}
          color="#0b34b0"
          style={styles.icon}
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
            placeholder="**************"
            secureTextEntry
            placeholderTextColor="black"
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4EDF9',
  },
  loginBox: {
    width: '85%',
    height: 'auto',
    backgroundColor: 'white',
    padding: 35,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginTop: 10,
    marginBottom: 15,
  },
  iconStyle: {
    marginRight: 8,
  },
  input: {
    fontSize: 15,
    flex: 1,
    padding: 7,
    borderColor: 'black', 
    borderWidth: 0, 
  },
  loginButton: {
    backgroundColor: '#0b34b0',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0b34b0',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    paddingTop: 15,
  },
  iconCircle: {
    backgroundColor: 'white',
    borderRadius: 60,
    width: 85,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },
  logo: {
    marginTop: -150,
    marginBottom: 50,
    width: 400,
    height: 200,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  animation: {
    width: 300,
    height: 300,
  },
});

// Importamos las dependencias necesarias
import React, { useState, useEffect, useRef } from 'react';
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
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import successAnimation from '../assets/animations/complete.json';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { login } from '../Api/login';
import { LinearGradient } from 'expo-linear-gradient';
import { setSession, getSession } from './SessionManager';

// Obtenemos las dimensiones de la pantalla para un diseño responsivo
const { width, height } = Dimensions.get('window');

export const LoginScreen = () => {
  // Hook de navegación para manejar la navegación entre pantallas
  const navigation = useNavigation();

  // Estados para manejar los inputs y la lógica de la pantalla
  const [username, setUsername] = useState(''); // Estado para el correo electrónico
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [showError, setShowError] = useState(false); // Estado para mostrar error general
  const [showIncorrectMessage, setShowIncorrectMessage] = useState(false); // Estado para mostrar mensaje de credenciales incorrectas
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false); // Estado para mostrar animación de éxito
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar el indicador de carga

  // Referencias para las animaciones
  const shakeAnimation = useRef(new Animated.Value(0)).current; // Animación de sacudida para errores

  // Efecto para verificar si existe una sesión activa al cargar la pantalla
  useEffect(() => {
    checkExistingSession();
  }, []);

  // Función para verificar si existe una sesión activa
  const checkExistingSession = async () => {
    const session = await getSession();
    if (session) {
      // Si existe una sesión, navegamos directamente a la pantalla principal
      navigation.reset({
        index: 0,
        routes: [{ name: 'Principal Home', params: { user: session } }],
      });
    }
  };

  // Función para manejar el proceso de inicio de sesión
  const handleLoginTest = async () => {
    setShowError(false);
    setShowIncorrectMessage(false);
  
    // Validación de campos vacíos
    if (!username || !password) {
      setShowError(true);
      shakeForm(); // Animación de sacudida si hay error
      return;
    }
  
    setIsLoading(true); // Iniciamos el indicador de carga
  
    // Llamada a la API de login
    const result = await login(username, password);
    setIsLoading(false); // Detenemos el indicador de carga
  
    if (result && result.isMatch && result.userData) {
      const userData = result.userData;
  
      try {
        // Guardamos la sesión del usuario
        await setSession(userData);
  
        // Mostramos la animación de éxito
        setShowSuccessAnimation(true);
        setModalVisible(true);
  
        // Después de 2 segundos, cerramos el modal y navegamos a la pantalla principal
        setTimeout(() => {
          setModalVisible(false);
          setShowSuccessAnimation(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Principal Home', params: { user: userData } }],
          });
        }, 2000);
      } catch (error) {
        console.error('Error al serializar los datos:', error);
      }
    } else {
      // Si las credenciales son incorrectas, mostramos el mensaje de error
      setShowIncorrectMessage(true);
      shakeForm(); // Animación de sacudida si las credenciales son incorrectas
    }
  };
  
  // Función para navegar a la pantalla de registro
  const handleRegister = () => {
    navigation.navigate('Registro');
  };

  // Función para alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Función para animar la sacudida del formulario en caso de error
  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#DBE2EF', '#F5F7F8']} style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollViewContent}>
            <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnimation }] }]}>
              <Image
                source={require('../../assets/images/Logo_Cucei.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.loginBox}>
                <View style={styles.iconCircle}>
                  <Image
                    source={require('../assets/images/usuario.png')}
                    style={styles.userImage}
                  />
                </View>
                <Text style={styles.title}>Iniciar Sesión</Text>
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faEnvelope} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#999"
                    onChangeText={setUsername}
                    value={username}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faLock} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#999"
                    onChangeText={setPassword}
                    value={password}
                  />
                  <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordToggle}>
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      size={20}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
                {showError && (
                  <Text style={styles.errorText}>
                    Por favor, completa todos los campos.
                  </Text>
                )}
                {showIncorrectMessage && (
                  <Text style={styles.errorText}>
                    Correo o Contraseña incorrectos.
                  </Text>
                )}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleLoginTest}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size={24} color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRegister}>
                  <Text style={styles.registerText}>
                    ¿No tienes cuenta? ¡Regístrate!
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>

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
    </SafeAreaView>
  );
};

// Estilos para el componente
const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Ocupa todo el espacio disponible
  },
  container: {
    flex: 1, // Ocupa todo el espacio disponible
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.05, // Padding vertical basado en la altura de la pantalla
  },
  logo: {
    width: width * 0.8, // 80% del ancho de la pantalla
    height: height * 0.2, // 20% de la altura de la pantalla
    marginBottom: height * 0.03, // 3% de la altura de la pantalla
  },
  loginBox: {
    padding: width * 0.06, // 6% del ancho de la pantalla
    width: width * 0.85, // 85% del ancho de la pantalla
    maxWidth: 400, // Máximo ancho de 400px
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconCircle: {
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    width: width * 0.2, // 20% del ancho de la pantalla
    height: width * 0.2, // 20% del ancho de la pantalla
    maxWidth: 100,
    maxHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -width * 0.1, // -10% del ancho de la pantalla
    marginBottom: height * 0.02, // 2% de la altura de la pantalla
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userImage: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: width * 0.06, 
    fontWeight: 'bold',
    color: '#0b34b0',
    marginBottom: height * 0.02,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02, 
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: width * 0.03, 
  },
  inputIcon: {
    marginRight: width * 0.02, 
    color: '#0b34b0',
  },
  input: {
    flex: 1,
    paddingVertical: height * 0.015, 
    fontSize: width * 0.04, 
    color: '#333',
  },
  passwordToggle: {
    padding: width * 0.02, 
  },
  button: {
    backgroundColor: '#0b34b0',
    borderRadius: 10,
    paddingVertical: height * 0.02, 
    alignItems: 'center',
    marginTop: height * 0.02, 
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.04, 
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: height * 0.02, 
    fontSize: width * 0.035, 
    color: '#0b34b0',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: height * 0.02, 
    fontSize: width * 0.035, 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  animation: {
    width: width * 0.6, 
    height: width * 0.6, 
  },
});

export default LoginScreen;
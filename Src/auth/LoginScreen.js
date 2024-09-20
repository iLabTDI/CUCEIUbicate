import React, { useState, useEffect } from 'react';
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

const { width, height } = Dimensions.get('window');

export const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [showIncorrectMessage, setShowIncorrectMessage] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkExistingSession(); // checa si existe una session activa
  }, []);

  const checkExistingSession = async () => { //si existe una sesion activa lo redirige a la pagina principal
    const session = await getSession();
    if (session) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Principal Home', params: { user: session } }],
      });
    }
  };

  const handleLoginTest = async () => {
    setShowError(false);
    setShowIncorrectMessage(false);
  
    if (!username || !password) {
      setShowError(true);
      return;
    }
  
    setIsLoading(true);
  
    const result = await login(username, password);
    setIsLoading(false);
  
    // console.log("Resultado del login:", result); 
  
    //manejo de errores y verificaciones de la respuesta
    if (!result) {
      console.log("Error: No se obtuvo resultado del login.");
    } else if (!result.isMatch) {
      console.log("Error: El login no coincide.");
    } else if (!result.userData || result.userData.length === 0) {
      console.log("Error: No hay datos de usuario en la respuesta.");
    }
  
    if (result && result.isMatch && result.userData) {
      const userData = result.userData;
      // console.log("Datos de usuario recibidos:", userData);
  
      try {
        const serializedData = JSON.stringify(userData);
        // console.log('Datos serializados correctamente:', serializedData);
  
        await setSession(userData);
  
        setShowSuccessAnimation(true);
        setModalVisible(true);
  
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
      setShowIncorrectMessage(true);
    }
  };
  
  

  const handleRegister = () => {
    navigation.navigate('Registro');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#DBE2EF', '#F5F7F8']} style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 10}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
                <FontAwesomeIcon icon={faEnvelope} style={styles.iconStyle} />
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
                <FontAwesomeIcon icon={faLock} style={styles.iconStyle} />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999"
                  onChangeText={setPassword}
                  value={password}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    style={styles.eyeIcon}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
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
              <TouchableOpacity
                onPress={handleLoginTest}
                style={styles.loginButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.05,
  },
  logo: {
    width: width * 0.8,
    height: height * 0.2,
    marginBottom: height * 0.03,
  },
  loginBox: {
    padding: width * 0.06,
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconCircle: {
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    width: width * 0.2,
    height: width * 0.2,
    maxWidth: 100,
    maxHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -width * 0.1,
    marginBottom: height * 0.02,
    shadowColor: '#000',
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.02,
    width: '100%',
  },
  iconStyle: {
    color: '#0b34b0',
    marginRight: width * 0.02,
  },
  input: {
    flex: 1,
    fontSize: width * 0.04,
    paddingVertical: height * 0.015,
  },
  eyeIcon: {
    color: '#999',
  },
  loginButton: {
    backgroundColor: '#0b34b0',
    borderRadius: 10,
    paddingVertical: height * 0.02,
    width: '100%',
    alignItems: 'center',
    marginTop: height * 0.02,
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
    fontSize: width * 0.035,
    marginBottom: height * 0.01,
    textAlign: 'center',
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
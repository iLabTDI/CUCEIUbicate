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

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768; // Consideramos tablet si el ancho es 768 o mayor

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

  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
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
      shakeForm();
      return;
    }
  
    setIsLoading(true);
  
    const result = await login(username, password);
    setIsLoading(false);
  
    if (result && result.isMatch && result.userData) {
      const userData = result.userData;
  
      try {
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
      shakeForm();
    }
  };
  
  const handleRegister = () => {
    navigation.navigate('Registro');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
          <ScrollView 
            keyboardShouldPersistTaps="handled" 
            contentContainerStyle={styles.scrollViewContent}
            alwaysBounceVertical={false}
          >
            <Animated.View style={[styles.formContainer, { transform: [{ translateX: shakeAnimation }] }]}>
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
                  <FontAwesomeIcon icon={faEnvelope} style={styles.inputIcon} size={isTablet ? 24 : 20} />
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
                  <FontAwesomeIcon icon={faLock} style={styles.inputIcon} size={isTablet ? 24 : 20} />
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
                      size={isTablet ? 24 : 20}
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
                    <ActivityIndicator size={isTablet ? 32 : 24} color="#fff" />
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
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: isTablet ? width * 0.8 : width * 0.8,
    height: isTablet ? height * 0.21 : height * 0.2,
    marginBottom: height * 0.03,
  },
  loginBox: {
    padding: isTablet ? width * 0.04 : width * 0.06,
    width: isTablet ? width * 0.6 : width * 0.85,
    maxWidth: isTablet ? 600 : 400,
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
    width: isTablet ? width * 0.12 : width * 0.2,
    height: isTablet ? width * 0.12 : width * 0.2,
    maxWidth: isTablet ? 120 : 100,
    maxHeight: isTablet ? 120 : 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: isTablet ? -width * 0.06 : -width * 0.1,
    marginBottom: height * 0.02,
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
    fontSize: isTablet ? width * 0.04 : width * 0.06,
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
    width: '100%',
  },
  inputIcon: {
    marginRight: width * 0.02,
    color: '#0b34b0',
  },
  input: {
    flex: 1,
    paddingVertical: isTablet ? height * 0.02 : height * 0.015,
    fontSize: isTablet ? width * 0.025 : width * 0.04,
    color: '#333',
  },
  passwordToggle: {
    padding: width * 0.02,
  },
  button: {
    backgroundColor: '#0b34b0',
    borderRadius: 10,
    paddingVertical: isTablet ? height * 0.025 : height * 0.02,
    alignItems: 'center',
    marginTop: height * 0.02,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: isTablet ? width * 0.025 : width * 0.04,
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: height * 0.02,
    fontSize: isTablet ? width * 0.02 : width * 0.035,
    color: '#0b34b0',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: height * 0.02,
    fontSize: isTablet ? width * 0.02 : width * 0.035,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  animation: {
    width: isTablet ? width * 0.3 : width * 0.6,
    height: isTablet ? width * 0.3 : width * 0.6,
  },
});

export default LoginScreen;
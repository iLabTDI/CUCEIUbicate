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
  TouchableWithoutFeedback
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

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768; // Consideramos tablet si el ancho es 768 o mayor

export const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [mayusTextColor, setmayusTextColor] = useState('red');
  const [noCharsColor, setnoCharsColor] = useState('red');
  const [simbolTextColor, setsimbolTextColor] = useState('red');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const allowedDomains = [
    "alumnos.udg.mx",
    "gmail.com",
  ];
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&.,-_<>?¿¡!]])(?=.{8,})/; //^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/


  const navigation = useNavigation();

  useEffect(() => {
    if (password.length >= 8) {
      setnoCharsColor('green')
    } else
      setnoCharsColor("red")

    if (password.match(/[A-Z]/)) {
      setmayusTextColor('green')
    } else {
      setmayusTextColor('red')
    }

    if (password.match(/[@$!%*?&.,-_<>?¿¡!H]/)) {
      setsimbolTextColor('green')
    } else {
      setsimbolTextColor('red')
    }
  }, [password]);

  const handleRegister = async () => {
    setEmailError(false);
    setPasswordError(false);
    setErrorMsg("");
    setIsLoading(true);

    try {
      if (!email || !password || !confirmPassword) {
        setErrorMsg("Por favor, completa todos los campos");
        shakeForm();
        throw new Error("Campos incompletos");
      }

      if (
        !emailRegex.test(email) ||
        !allowedDomains.includes(email.split("@")[1])
      ) {
        setEmailError(true);
        setErrorMsg("Correo electrónico no válido");
        shakeForm();
        throw new Error("Correo no válido");
      }

      if (!passwordRegex.test(password)) {
        setPasswordError(true);
        setErrorMsg(
          "La contraseña debe tener al menos 8 caracteres, incluyendo al menos 1 letra y 1 número."
        );
        shakeForm();
        throw new Error("Contraseña no válida");
      }

      if (password !== confirmPassword) {
        setPasswordError(true);
        setErrorMsg("Las contraseñas no coinciden");
        shakeForm();
        throw new Error("Las contraseñas no coinciden");
      }

      const correoValido = await validar_correo(email);
      if (!correoValido) {
        setEmailError(true);
        setErrorMsg("Este correo electrónico ya se ha registrado");
        shakeForm();
        throw new Error("Correo ya registrado");
      }

      navigation.navigate("Completar Perfil", { mail: email, pass: password });
    } catch (error) {
      // console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const handleInputClick = () => {
    setInputVisible(true);
  };

  const handleOutsideClick = () => {
    console.log("Prueba click fuera");
    setInputVisible(false);
    setShowPassword(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.KeyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollViewContent}
        alwaysBounceVertical={false}
      >
        <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnimation }] }]}>
          <Text style={styles.title}>Registra tu cuenta</Text>

          <LottieView
            source={require("../assets/animations/register.json")}
            autoPlay
            loop={true}
            style={styles.animation}
          />

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faEnvelope} style={styles.inputIcon} size={isTablet ? 24 : 20} />
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
              {email && (
                <FontAwesomeIcon
                  icon={emailError ? faTimesCircle : faCheckCircle}
                  style={[styles.inputIcon, { color: emailError ? 'red' : 'green' }]}
                  size={isTablet ? 24 : 20}
                />
              )}
            </View>

            <TouchableWithoutFeedback onPress={handleOutsideClick}>
              <View style={styles.container}>
                <View style={styles.inputContainer}>
                  <FontAwesomeIcon icon={faLock} style={styles.inputIcon} size={24} />
                  <TextInput
                    style={[styles.input, passwordError && styles.inputError]}
                    placeholder="Contraseña"
                    placeholderTextColor="#999"
                    value={password}
                    secureTextEntry={!showPassword}
                    onChangeText={(text) => setPassword(text)}
                    autoCapitalize="none"
                    onFocus={handleInputClick}
                    onBlur={handleOutsideClick}
                  />
                  <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordToggle}>
                    <FontAwesomeIcon
                      icon={showPassword ? faEye : faEyeSlash}
                      size={24}
                      color="#999"
                    />
                  </TouchableOpacity>
                </View>
                {inputVisible && (
                    <View style={styles.horizontalLabels}>
                        <Text style={[styles.mayusLabel, { color: mayusTextColor }]}>Mayuscula</Text>
                        <Text style={[styles.simbolLabel, { color: simbolTextColor }]}>Simbolo</Text>
                        <Text style={[styles.noChars, { color: noCharsColor }]}>8 caracteres o más</Text>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>

            {/* <View style={styles.passwordStrengthContainer}>
              {[...Array(5)].map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.passwordStrengthBar,
                    index < passwordStrength && styles.passwordStrengthBarFilled
                  ]}
                />
              ))}
            </View> */}

            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faLock} style={styles.inputIcon} size={isTablet ? 24 : 20} />
              <TextInput
                style={[styles.input, passwordError && styles.inputError]}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#999"
                value={confirmPassword}
                secureTextEntry={!showPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordToggle}>
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  size={isTablet ? 24 : 20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size={isTablet ? 32 : 24} color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Continuar</Text>
              )}
            </TouchableOpacity>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          </View>
        </Animated.View>
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
    paddingHorizontal: isTablet ? width * 0.1 : width * 0.05,
  },
  title: {
    fontSize: isTablet ? width * 0.05 : width * 0.08,
    fontWeight: "bold",
    color: "#0b34b0",
    marginBottom: height * 0.04,
    textAlign: "center",
    marginTop: height * -0.08,
  },
  animation: {
    width: isTablet ? width * 0.4 : width * 0.5,
    height: isTablet ? width * 0.3 : width * 0.5,
    marginBottom: height * 0.02,
  },
  formContainer: {
    width: "100%",
    maxWidth: isTablet ? 600 : 400,
    backgroundColor: "white",
    borderRadius: 20,
    padding: isTablet ? width * 0.04 : width * 0.05,
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
    paddingHorizontal: isTablet ? width * 0.02 : width * 0.03,
  },
  inputIcon: {
    marginRight: isTablet ? width * 0.015 : width * 0.02,
    color: "#0b34b0",
  },
  input: {
    flex: 1,
    paddingVertical: isTablet ? height * 0.02 : height * 0.015,
    fontSize: isTablet ? width * 0.02 : width * 0.04,
    color: "#333",
  },
  inputError: {
    borderColor: "red",
  },
  passwordToggle: {
    padding: isTablet ? width * 0.015 : width * 0.02,
  },
  button: {
    backgroundColor: "#0b34b0",
    borderRadius: 10,
    paddingVertical: isTablet ? height * 0.025 : height * 0.02,
    alignItems: "center",
    marginTop: height * 0.02,
  },
  buttonText: {
    color: "white",
    fontSize: isTablet ? width * 0.025 : width * 0.04,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: height * 0.02,
    fontSize: isTablet ? width * 0.02 : width * 0.035,
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  passwordStrengthBar: {
    flex: 1,
    height: isTablet ? 8 : 5,
    backgroundColor: '#ddd',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  passwordStrengthBarFilled: {
    backgroundColor: '#0b34b0',
  },
  revealLabels: {
    marginLeft: '-65',
    height: 80,
    alignSelf: 'center',    
    alignItems: "center",
  },
  horizontalLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  passLabelView: {
    color: 'gray',
  },
  mayusLabel: {
    marginLeft: '-80',
    flexBasis: '33%'
  },
  simbolLabel: {
    marginLeft: '-80',
    flexBasis: '33%'
  },
  noChars: {
    marginLeft: '-80',
    flexBasis: '33%'
  },
});

export default RegisterScreen;
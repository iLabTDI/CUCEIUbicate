import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated,
  ActivityIndicator,
  Easing,
} from "react-native";
import LottieView from "lottie-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import { validar_codigo, validar_usuario } from "../Api/validaciones";
import { get_degrees } from "../Api/consultas";
import { alta_usuario } from "../Api/altaUsuario"
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  faUser,
  faEnvelope,
  faIdCard,
  faGraduationCap,
  faChevronDown,
  faLaptopCode,
  faFlask,
  faCog,
  faIndustry,
  faCalculator,
  faMicrochip,
  faNetworkWired,
  faAtom,
  faRobot,
  faBuilding,
  faStethoscope,
  faMapMarkedAlt,
  faTruck,
  faUtensils,
  faBroadcastTower,
  faDesktop,
  faServer,
  faCogs,
  faBomb,
  faLightbulb,
  faUserDoctor,
  faAppleAlt,
  faSquareRootVariable,
  faBriefcaseMedical,
  faRadiation,
  faFaceGrimace,
  faPersonHarassing,
  faMedkit,
  faHouseChimneyMedical,
} from "@fortawesome/free-solid-svg-icons";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

// Función para sombras optimizadas según plataforma
const getShadowStyle = (elevation, color = "#000", opacity = 0.1) => {
  if (Platform.OS === 'android') {
    return {
      elevation: Math.min(elevation, 6), // Limitamos elevation en Android
      shadowColor: color,
    };
  } else {
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: elevation / 2 },
      shadowOpacity: opacity,
      shadowRadius: elevation,
    };
  }
};

// Array de iconos en el orden de las carreras proporcionadas
const careerIconsOrder = [
  faUserDoctor, // Medicina
  faIndustry, // Ingeniería Industrial INDU
  faAppleAlt, // Alimentos
  faDesktop, // Ingeniería en Computación INCO
  faBroadcastTower, // Electrónica INCE
  faLightbulb, // Ingeniería en Fotonica
  faServer, // Ingeniería en Informática INFO
  faTruck, // Ingeniería en Robótica INRO
  faRobot, // Ingeniería en Robótica INRO
  faMapMarkedAlt, // Ingeniería en Topografía Geomática
  faIndustry, // Ingeniería Industrial INDU
  faCogs, // Ingeniería Mecánica Eléctrica INME
  faFlask, // Ingeniería Química INQU
  faIndustry, // Ingeniería Industrial INDU
  faRadiation, // Ingeniería en Informática INFO
  faSquareRootVariable, // Ingeniería Química INQU
  faFlask, // Ingeniería en Topografía Geomática
  faUserDoctor, // MedQuimico farmacobiologo
];

// Expresión regular que permite únicamente letras (con acentos, ñ) y espacios
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

export const CompleteProfile = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [Codigo, setCodigo] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("");

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [CodigoError, setCodigoError] = useState(false);
  const [careerOptions, setCareerOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [bgAnim] = useState(new Animated.Value(0));
  const [floatingAnim] = useState(new Animated.Value(0));

  const navigation = useNavigation();
  const route = useRoute();
  const { mail, pass } = route.params;
  const correo = mail;
  const contraseña = pass;

  // El código debe tener exactamente 9 dígitos
  const CODE_LENGTH = 9;

  useEffect(() => {
    const fetchDegrees = async () => {
      const degrees = await get_degrees();
      setCareerOptions(degrees);
    };
    fetchDegrees();

    // Inicializar animaciones como en RegisterScreen
    Animated.loop(
      Animated.timing(bgAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: false,
      })
    ).start();

    // Animación flotante
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Función de validación de username directamente aquí
  const validateUsername = (username) => {
    if (!username) {
      return { isValid: false, message: 'El nombre de usuario es requerido' };
    }
    if (username.length < 3) {
      return { isValid: false, message: 'El nombre de usuario debe tener al menos 3 caracteres' };
    }
    if (username.length > 30) {
      return { isValid: false, message: 'El nombre de usuario no puede tener más de 30 caracteres' };
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      return { isValid: false, message: 'El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos' };
    }
    return { isValid: true };
  };

  const validateForm = () => {
    let valid = true;
    
    // Validar que el nombre no esté vacío y solo contenga letras y espacios
    if (!name.trim() || !NAME_REGEX.test(name)) {
      setNameError(true);
      valid = false;
    } else {
      setNameError(false);
    }
    
    // Validar que el apellido no esté vacío y solo contenga letras y espacios
    if (!lastName.trim() || !NAME_REGEX.test(lastName)) {
      setLastNameError(true);
      valid = false;
    } else {
      setLastNameError(false);
    }
    
    // Validar username usando las utilidades
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      setUsernameError(true);
      valid = false;
    } else {
      setUsernameError(false);
    }
    
    // Validar que el código tenga exactamente 9 dígitos
    if (Codigo.length !== CODE_LENGTH) {
      setCodigoError(true);
      valid = false;
    } else {
      setCodigoError(false);
    }
    
    // Validar que se haya seleccionado una carrera
    if (!selectedCareer) {
      alert("Seleccione una carrera.");
      valid = false;
    }
    
    return valid;
  };

  const handleCompleteProfile = async () => {
    setIsLoading(true);

    // Verificar campos vacíos y validaciones
    if (!validateForm()) {
      setIsLoading(false);
      shakeForm();
      return;
    }

    try {
      const usuarioValido = await validar_usuario(username);
      if (!usuarioValido) {
        setUsernameError(true);
        setIsLoading(false);
        shakeForm();
        return;
      }

      const codigoValido = await validar_codigo(Codigo);
      if (!codigoValido) {
        setCodigoError(true);
        setIsLoading(false);
        shakeForm();
        return;
      }

      await alta_usuario(
        Codigo,
        correo,
        contraseña,
        selectedCareer,
        name,
        lastName,
        username
      );

      // ✨ GUARDAR EMAIL PARA AUTO-LOGIN
      try {
        await AsyncStorage.setItem("@saved_email", correo);
        console.log('💾 Email guardado para auto-login:', correo);
      } catch (error) {
        console.error('Error guardando email:', error);
      }

      setIsProfileComplete(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Error al completar el perfil:", error);
      setIsLoading(false);
      shakeForm();
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (isProfileComplete) {
      const timer = setTimeout(() => {
        navigation.navigate("Login");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isProfileComplete, navigation]);

  const shakeForm = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Gradiente animado de fondo como en RegisterScreen
  const bgColor = bgAnim.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: ["#e8f2ff", "#f0f6ff", "#e3e9fa", "#f4f8ff"],
  });

  return (
    <>
      {!isProfileComplete ? (
        <>
          {/* Fondo animado con gradiente dinámico */}
          <Animated.View
            style={[styles.animatedBg, { backgroundColor: bgColor }]}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <Animated.View
                style={[
                  styles.formWrapper,
                  {
                    transform: [
                      { translateX: shakeAnimation },
                    ],
                  },
                ]}>
                <Text style={styles.title}>Completa tu perfil</Text>
                <Text style={styles.subtitle}>¡Ya casi terminamos! 🎯</Text>

                <View style={styles.lottieOverlayContainer}>
                  <LottieView
                    source={require("../assets/animations/completeProfile.json")}
                    autoPlay
                    loop
                    style={styles.animation}
                  />
                </View>

                <View style={styles.formContainer}>
                  {/* Campo Nombre */}
                  <View
                    style={[
                      styles.inputContainer,
                      nameError && styles.inputContainerError,
                    ]}>
                    <FontAwesomeIcon
                      icon={faUser}
                      style={
                        nameError ? styles.inputIconError : styles.inputIconBlue
                      }
                      size={22}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre"
                      placeholderTextColor="#a8b2c8"
                      value={name}
                      onChangeText={(text) => {
                        setName(text);
                        if (!text.trim() || !NAME_REGEX.test(text)) {
                          setNameError(true);
                        } else {
                          setNameError(false);
                        }
                      }}
                      selectionColor="#0b34b0"
                    />
                  </View>
                  {nameError && (
                    <Animated.View style={styles.errorContainer}>
                      <Text style={styles.errorText}>
                        {!name.trim()
                          ? "Campo requerido"
                          : "Solo se permiten letras y espacios"}
                      </Text>
                    </Animated.View>
                  )}

                  {/* Campo Apellidos */}
                  <View
                    style={[
                      styles.inputContainer,
                      lastNameError && styles.inputContainerError,
                    ]}>
                    <FontAwesomeIcon
                      icon={faUser}
                      style={
                        lastNameError
                          ? styles.inputIconError
                          : styles.inputIconBlue
                      }
                      size={22}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Apellidos"
                      placeholderTextColor="#a8b2c8"
                      value={lastName}
                      onChangeText={(text) => {
                        setLastName(text);
                        if (!text.trim() || !NAME_REGEX.test(text)) {
                          setLastNameError(true);
                        } else {
                          setLastNameError(false);
                        }
                      }}
                      selectionColor="#0b34b0"
                    />
                  </View>
                  {lastNameError && (
                    <Animated.View style={styles.errorContainer}>
                      <Text style={styles.errorText}>
                        {!lastName.trim()
                          ? "Campo requerido"
                          : "Solo se permiten letras y espacios"}
                      </Text>
                    </Animated.View>
                  )}

                  {/* Campo Nombre de Usuario */}
                  <View
                    style={[
                      styles.inputContainer,
                      usernameError && styles.inputContainerError,
                    ]}>
                    <FontAwesomeIcon
                      icon={faUser}
                      style={
                        usernameError
                          ? styles.inputIconError
                          : styles.inputIconBlue
                      }
                      size={22}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre de Usuario"
                      placeholderTextColor="#a8b2c8"
                      maxLength={20}
                      value={username}
                      onChangeText={(text) => {
                        setUsername(text);
                        setUsernameError(false);
                      }}
                      selectionColor="#0b34b0"
                    />
                  </View>
                  {usernameError && (
                    <Animated.View style={styles.errorContainer}>
                      <Text style={styles.errorText}>
                        {!username
                          ? "Campo requerido"
                          : "Este usuario ya ha sido registrado"}
                      </Text>
                    </Animated.View>
                  )}

                  {/* Campo Código de Estudiante */}
                  <View
                    style={[
                      styles.inputContainer,
                      CodigoError && styles.inputContainerError,
                    ]}>
                    <FontAwesomeIcon
                      icon={faIdCard}
                      style={
                        CodigoError
                          ? styles.inputIconError
                          : styles.inputIconBlue
                      }
                      size={22}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Código (9 dígitos)"
                      placeholderTextColor="#a8b2c8"
                      value={Codigo}
                      maxLength={9}
                      keyboardType="number-pad"
                      onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, "");
                        setCodigo(numericText);
                        setCodigoError(false);
                      }}
                      selectionColor="#0b34b0"
                    />
                  </View>
                  {CodigoError && (
                    <Animated.View style={styles.errorContainer}>
                      <Text style={styles.errorText}>
                        {!Codigo
                          ? "Campo requerido"
                          : "El código debe tener exactamente 9 dígitos"}
                      </Text>
                    </Animated.View>
                  )}

                  {/* Selector de Carrera */}
                  <TouchableOpacity
                    style={styles.pickerContainer}
                    onPress={toggleModal}>
                    <FontAwesomeIcon
                      icon={faGraduationCap}
                      style={styles.inputIconBlue}
                      size={22}
                    />
                    <Text style={styles.pickerText}>
                      {selectedCareer 
                        ? careerOptions.find(career => career.code === selectedCareer)?.name || "Seleccione una carrera"
                        : "Seleccione una carrera"}
                    </Text>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      style={styles.pickerIcon}
                      size={20}
                    />
                  </TouchableOpacity>

                  {/* Botón para Continuar con gradiente */}
                  <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonLoading]}
                    onPress={handleCompleteProfile}
                    disabled={isLoading}
                    activeOpacity={0.85}>
                    <View style={styles.buttonGradient}>
                      {isLoading ? (
                        <ActivityIndicator size={28} color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Terminar</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      ) : (
        <Animated.View
          style={[styles.completedContainer, { opacity: fadeAnim }]}>
          
          {/* Confetis mágicos */}
          <LottieView
            source={require("../assets/animations/Confetti-2.json")}
            autoPlay
            loop={false}
            style={styles.confetti}
          />
          
          {/* Gradiente de fondo hermoso */}
          <Animated.View style={styles.gradientBackground} />
          
          {/* Contenido principal con diseño espectacular */}
          <View style={styles.completedContent}>
            
            {/* Círculo decorativo con animación */}
            {/* <Animated.View 
              style={[
                styles.decorativeCircle,
                {
                  transform: [{
                    scale: floatingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1.05]
                    })
                  }]
                }
              ]}
            />
             */}
            {/* Título principal súper hermoso */}
            <View style={styles.titleContainer}>
              <Text style={styles.profileCompleteTitle}>¡PERFIL</Text>
              <Text style={styles.profileCompleteSubtitle}>COMPLETADO!</Text>
              <View style={styles.titleUnderline} />
            </View>
            
            {/* Logo con contenedor elegante y efectos súper hermosos */}
            <Animated.View 
              style={[
                styles.logoContainer,
                {
                  transform: [{
                    scale: floatingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.98, 1.02]
                    })
                  }],
                  opacity: fadeAnim
                }
              ]}
            >
              <View style={styles.logoGlow} />
              <Image
                source={require("../../assets/images/cucei.png")}
                style={styles.logo}
              />
            </Animated.View>
            
            {/* Mensaje de bienvenida súper lindo y elegante */}
            <Animated.View 
              style={[
                styles.welcomeContainer,
                {
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0]
                    })
                  }],
                  opacity: fadeAnim
                }
              ]}
            >
              <Text style={styles.welcomeText}>
                ¡Bienvenido a CUCEI Ubicate!
              </Text>
              <Text style={styles.welcomeSubtext}>
                Hola @{username}, tu perfil ha sido configurado exitosamente.
              </Text>
            </Animated.View>
            
            
            {/* Elementos flotantes súper lindos */}
            <Animated.View 
              style={[
                styles.floatingElement,
                styles.floatingElement1,
                {
                  transform: [{
                    translateY: floatingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-5, 5]
                    })
                  }]
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.floatingElement,
                styles.floatingElement2,
                {
                  transform: [{
                    translateY: floatingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [8, -8]
                    })
                  }]
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.floatingElement,
                styles.floatingElement3,
                {
                  transform: [{
                    translateY: floatingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-4, 4]
                    })
                  }]
                }
              ]} 
            />
            <Animated.View 
              style={[
                styles.floatingElement,
                styles.floatingElement4,
                {
                  transform: [{
                    translateY: floatingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [6, -6]
                    })
                  }]
                }
              ]} 
            />
            
          </View>
        </Animated.View>
      )}

      {/* Modal para seleccionar carrera con diseño mejorado */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccione una carrera</Text>
            <ScrollView style={styles.careerOptionsContainer}>
                            {careerOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.careerOption}
                  onPress={() => {
                    setSelectedCareer(option.code); // Solo guardar el código
                    toggleModal();
                  }}>
                  <FontAwesomeIcon
                    icon={careerIconsOrder[index] || faGraduationCap}
                    style={styles.careerIcon}
                    size={20}
                  />
                  <Text style={styles.careerOptionText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Fondo y overlay
  animatedBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },

  // Container principal
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 10,
  },

  // Wrapper del formulario
  formWrapper: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxWidth: 480,
  },

  // Títulos optimizados para Android
  title: {
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 30 : 26) 
      : (isTablet ? 38 : 32),
    fontWeight: "800",
    color: "#0b34b0",
    marginBottom: Platform.OS === 'android' ? 6 : 8,
    textAlign: "center",
    letterSpacing: Platform.OS === 'android' ? 1.0 : 1.5,
    ...(Platform.OS === 'ios' && {
      textShadowColor: "rgba(11, 52, 176, 0.1)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    }),
  },
  subtitle: {
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 16 : 15) 
      : (isTablet ? 18 : 16),
    color: "#6b7280",
    textAlign: "center",
    marginBottom: Platform.OS === 'android' ? 18 : 24,
    fontWeight: "500",
  },

  // Contenedor de Lottie optimizado para Android
  lottieOverlayContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Platform.OS === 'android' ? 16 : 20,
    position: "relative",
    height: Platform.OS === 'android' 
      ? (isTablet ? 140 : 120) 
      : (isTablet ? 200 : 160),
  },
  animation: {
    width: Platform.OS === 'android' 
      ? (isTablet ? 240 : 180) 
      : (isTablet ? 320 : 240),
    height: Platform.OS === 'android' 
      ? (isTablet ? 240 : 180) 
      : (isTablet ? 320 : 240),
    alignSelf: "center",
    zIndex: 2,
  },

  // Contenedor del formulario optimizado para Android
  formContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: Platform.OS === 'android' ? 20 : 28,
    paddingVertical: Platform.OS === 'android' 
      ? (isTablet ? 28 : 24) 
      : (isTablet ? 40 : 32),
    paddingHorizontal: Platform.OS === 'android' 
      ? (isTablet ? 36 : 28) 
      : (isTablet ? 40 : 32),
    alignItems: "center",
    ...getShadowStyle(Platform.OS === 'android' ? 4 : 8, "#0b34b0", 0.12),
    borderWidth: Platform.OS === 'android' ? 0.5 : 1,
    borderColor: "rgba(208, 216, 246, 0.4)",
  },

  // Inputs optimizados y más estirados para Android
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: Platform.OS === 'android' ? 16 : 20,
    paddingHorizontal: Platform.OS === 'android' ? 4 : 6,
    marginBottom: Platform.OS === 'android' ? 16 : 20,
    borderWidth: Platform.OS === 'android' ? 1 : 2,
    borderColor: Platform.OS === 'android' ? "rgba(229, 233, 245, 0.8)" : "#e5e9f5",
    height: Platform.OS === 'android' 
      ? (isTablet ? 52 : 48) 
      : (isTablet ? 68 : 58),
    ...getShadowStyle(Platform.OS === 'android' ? 2 : 4, "#0b34b0", 0.06),
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  inputContainerError: {
    borderColor: "#ff6b6b",
    backgroundColor: "rgba(255, 240, 240, 0.9)",
    ...getShadowStyle(Platform.OS === 'android' ? 1 : 2, "#ff6b6b", 0.1),
  },
  input: {
    flex: 1,
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 16 : 15) 
      : (isTablet ? 18 : 16),
    color: "#2d3748",
    fontWeight: "500",
    letterSpacing: Platform.OS === 'android' ? 0.2 : 0.3,
    paddingVertical: Platform.OS === 'android' ? 8 : 12,
    paddingRight: Platform.OS === 'android' ? 8 : 12,
    marginLeft: Platform.OS === 'android' ? 6 : 8,
  },

  // Picker container optimizado para Android (selector de carrera)
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: Platform.OS === 'android' ? 16 : 20,
    paddingHorizontal: Platform.OS === 'android' ? 4 : 6,
    marginBottom: Platform.OS === 'android' ? 16 : 20,
    borderWidth: Platform.OS === 'android' ? 1 : 2,
    borderColor: Platform.OS === 'android' ? "rgba(229, 233, 245, 0.8)" : "#e5e9f5",
    height: Platform.OS === 'android' 
      ? (isTablet ? 52 : 48) 
      : (isTablet ? 68 : 58),
    ...getShadowStyle(Platform.OS === 'android' ? 2 : 4, "#0b34b0", 0.06),
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  pickerText: {
    flex: 1,
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 16 : 15) 
      : (isTablet ? 18 : 16),
    color: "#2d3748",
    fontWeight: "500",
    letterSpacing: Platform.OS === 'android' ? 0.2 : 0.3,
    paddingVertical: Platform.OS === 'android' ? 8 : 12,
    paddingRight: Platform.OS === 'android' ? 8 : 12,
    marginLeft: Platform.OS === 'android' ? 6 : 8,
  },
  pickerIcon: {
    color: "#7a89a8",
    marginRight: Platform.OS === 'android' ? 6 : 8,
  },

  // Iconos
  inputIconBlue: {
    color: "#0b34b0",
    marginLeft: 8,
    marginRight: 4,
    alignSelf: "center",
  },
  inputIconError: {
    color: "#ff6b6b",
    marginLeft: 8,
    marginRight: 4,
    alignSelf: "center",
  },

  // Botón optimizado para Android
  button: {
    borderRadius: Platform.OS === 'android' ? 16 : 20,
    width: "100%",
    height: Platform.OS === 'android' 
      ? (isTablet ? 52 : 48) 
      : (isTablet ? 68 : 58),
    ...getShadowStyle(Platform.OS === 'android' ? 3 : 6, "#0b34b0", 0.2),
    overflow: "hidden",
  },
  buttonGradient: {
    backgroundColor: "#0b34b0",
    borderRadius: Platform.OS === 'android' ? 16 : 20,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLoading: {
    opacity: Platform.OS === 'android' ? 0.8 : 0.9,
  },
  buttonText: {
    color: "white",
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 17 : 16) 
      : (isTablet ? 20 : 18),
    fontWeight: "700",
    letterSpacing: Platform.OS === 'android' ? 0.8 : 1.2,
    ...(Platform.OS === 'ios' && {
      textShadowColor: "rgba(0, 0, 0, 0.15)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    }),
  },

  // Error optimizado para Android
  errorContainer: {
    marginBottom: Platform.OS === 'android' ? 6 : 8,
    width: "100%",
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 12 : 11) 
      : (isTablet ? 13 : 12),
    fontWeight: "400",
    textAlign: "left",
    letterSpacing: Platform.OS === 'android' ? 0.1 : 0.2,
    marginTop: 2,
    marginBottom: 2,
  },

  // Pantalla de perfil completado - SÚPER ULTRA LINDA
  completedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8faff",
    position: 'relative',
    overflow: 'hidden',
  },
  
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    opacity: 0.05,
  },
  
  completedContent: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    paddingHorizontal: Platform.OS === 'android' ? 20 : 24,
    maxWidth: isTablet ? width * 0.8 : width * 0.9,
  },
  
  decorativeCircle: {
    position: 'absolute',
    width: Platform.OS === 'android' 
      ? (isTablet ? width * 0.7 : width * 0.8) 
      : (isTablet ? width * 0.75 : width * 0.85),
    height: Platform.OS === 'android' 
      ? (isTablet ? width * 0.7 : width * 0.8) 
      : (isTablet ? width * 0.75 : width * 0.85),
    borderRadius: Platform.OS === 'android' 
      ? (isTablet ? width * 0.35 : width * 0.4) 
      : (isTablet ? width * 0.375 : width * 0.425),
    backgroundColor: 'rgba(11, 52, 176, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(11, 52, 176, 0.1)',
    top: '20%',
    ...getShadowStyle(Platform.OS === 'android' ? 3 : 8, "#0b34b0", 0.08),
  },
  
  titleContainer: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 30 : 40,
    zIndex: 3,
  },
  
  profileCompleteTitle: {
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? width * 0.08 : width * 0.12) 
      : (isTablet ? width * 0.09 : width * 0.13),
    fontWeight: "900",
    color: "#0b34b0",
    textAlign: "center",
    letterSpacing: Platform.OS === 'android' ? 2 : 3,
    marginBottom: Platform.OS === 'android' ? 4 : 8,
    ...(Platform.OS === 'ios' && {
      textShadowColor: "rgba(11, 52, 176, 0.2)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
    }),
  },
  
  profileCompleteSubtitle: {
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? width * 0.06 : width * 0.09) 
      : (isTablet ? width * 0.065 : width * 0.095),
    fontWeight: "800",
    color: "#4a90e2",
    textAlign: "center",
    letterSpacing: Platform.OS === 'android' ? 1.5 : 2,
    marginBottom: Platform.OS === 'android' ? 12 : 16,
  },
  
  logoContainer: {

    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 25 : 35,
    zIndex: 3,
  },
  
  logo: {
    width: Platform.OS === 'android' 
      ? (isTablet ? width * 0.30 : width * 0.45) 
      : (isTablet ? width * 0.4 : width * 0.5),
    height: Platform.OS === 'android' 
      ? (isTablet ? width * 0.35 : width * 0.45) 
      : (isTablet ? width * 0.4 : width * 0.5),
    resizeMode: "contain",
    opacity: 0.95,
    ...getShadowStyle(Platform.OS === 'android' ? 4 : 10, "#0b34b0", 0.15),
  },
  
  // logoGlow: {
  //   position: 'absolute',
  //   width: Platform.OS === 'android' 
  //     ? (isTablet ? width * 0.4 : width * 0.5) 
  //     : (isTablet ? width * 0.45 : width * 0.55),
  //   height: Platform.OS === 'android' 
  //     ? (isTablet ? width * 0.4 : width * 0.5) 
  //     : (isTablet ? width * 0.45 : width * 0.55),
  //   borderRadius: Platform.OS === 'android' 
  //     ? (isTablet ? width * 0.2 : width * 0.25) 
  //     : (isTablet ? width * 0.225 : width * 0.275),
  //   backgroundColor: 'rgba(11, 52, 176, 0.08)',
  //   zIndex: 1,
  // },
  
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 20 : 30,
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
    zIndex: 3,
  },
  
  welcomeText: {
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? width * 0.05 : width * 0.07) 
      : (isTablet ? width * 0.055 : width * 0.075),
    fontWeight: "700",
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: Platform.OS === 'android' ? 8 : 12,
    lineHeight: Platform.OS === 'android' 
      ? (isTablet ? width * 0.065 : width * 0.085) 
      : (isTablet ? width * 0.07 : width * 0.09),
  },
  
  welcomeSubtext: {
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? width * 0.035 : width * 0.045) 
      : (isTablet ? width * 0.04 : width * 0.05),
    fontWeight: "500",
    textAlign: "center",
    color: "#7f8c8d",
    lineHeight: Platform.OS === 'android' 
      ? (isTablet ? width * 0.05 : width * 0.065) 
      : (isTablet ? width * 0.055 : width * 0.07),
    marginBottom: Platform.OS === 'android' ? 4 : 8,
  },
  
    successIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? 20 : 30,
    marginBottom: Platform.OS === 'android' ? 15 : 20,
    zIndex: 3,
  },
  
  successIcon: {
    marginHorizontal: Platform.OS === 'android' ? 8 : 12,
    padding: Platform.OS === 'android' ? 10 : 12,
    borderRadius: Platform.OS === 'android' ? 25 : 30,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.3)',
    ...getShadowStyle(Platform.OS === 'android' ? 2 : 6, "#4caf50", 0.2),
  },
  
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  
  confettiAnimation: {
    width: width,
    height: height,
    opacity: Platform.OS === 'android' ? 0.7 : 0.9,
  },
  
  floatingElement: {
    position: 'absolute',
    zIndex: 1,
  },
  
  floatingElement1: {
    top: '15%',
    left: '10%',
    width: Platform.OS === 'android' ? 30 : 40,
    height: Platform.OS === 'android' ? 30 : 40,
    borderRadius: Platform.OS === 'android' ? 15 : 20,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    ...getShadowStyle(Platform.OS === 'android' ? 1 : 3, "#ffc107", 0.3),
  },
  
  floatingElement2: {
    top: '25%',
    right: '15%',
    width: Platform.OS === 'android' ? 20 : 25,
    height: Platform.OS === 'android' ? 20 : 25,
    borderRadius: Platform.OS === 'android' ? 10 : 12.5,
    backgroundColor: 'rgba(233, 30, 99, 0.2)',
    ...getShadowStyle(Platform.OS === 'android' ? 1 : 3, "#e91e63", 0.3),
  },
  
  floatingElement3: {
    bottom: '30%',
    left: '20%',
    width: Platform.OS === 'android' ? 25 : 35,
    height: Platform.OS === 'android' ? 25 : 35,
    borderRadius: Platform.OS === 'android' ? 12.5 : 17.5,
    backgroundColor: 'rgba(156, 39, 176, 0.2)',
    ...getShadowStyle(Platform.OS === 'android' ? 1 : 3, "#9c27b0", 0.3),
  },
  
  floatingElement4: {
    bottom: '20%',
    right: '10%',
    width: Platform.OS === 'android' ? 35 : 45,
    height: Platform.OS === 'android' ? 35 : 45,
    borderRadius: Platform.OS === 'android' ? 17.5 : 22.5,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    ...getShadowStyle(Platform.OS === 'android' ? 1 : 3, "#2196f3", 0.3),
  },
  
  // Confetti optimizado para Android
  confetti: {
    position: "absolute",
    width: width,
    height: height,
    zIndex: 1,
    // En Android hacemos el confetti un poco más sutil
    opacity: Platform.OS === 'android' ? 0.9 : 1,
  },

  // Modal mejorado y optimizado para Android
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: Platform.OS === 'android' ? 24 : 32,
    padding: Platform.OS === 'android' 
      ? (isTablet ? 32 : 28) 
      : 40,
    width: Platform.OS === 'android' 
      ? (isTablet ? width * 0.75 : width * 0.92) 
      : (isTablet ? width * 0.7 : width * 0.9),
    maxHeight: height * 0.8,
    ...getShadowStyle(Platform.OS === 'android' ? 6 : 10, "#0b34b0", 0.2),
    borderWidth: Platform.OS === 'android' ? 0.5 : 1,
    borderColor: "rgba(208, 216, 246, 0.6)",
  },
  modalTitle: {
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 24 : 20) 
      : (isTablet ? 26 : 22),
    color: "#0b34b0",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: Platform.OS === 'android' ? 16 : 20,
    letterSpacing: Platform.OS === 'android' ? 1.0 : 1.2,
  },
  careerOptionsContainer: {
    maxHeight: height * 0.5,
  },
  careerOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: Platform.OS === 'android' ? 12 : 16,
    padding: Platform.OS === 'android' ? 12 : 16,
    marginBottom: Platform.OS === 'android' ? 8 : 12,
    borderWidth: Platform.OS === 'android' ? 0.5 : 1,
    borderColor: Platform.OS === 'android' ? "rgba(229, 233, 245, 0.8)" : "#e5e9f5",
    ...getShadowStyle(Platform.OS === 'android' ? 1 : 2, "#0b34b0", 0.04),
  },
  careerIcon: {
    marginRight: Platform.OS === 'android' ? 12 : 16,
    color: "#0b34b0",
  },
  careerOptionText: {
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 15 : 13) 
      : (isTablet ? 16 : 14),
    color: "#2d3748",
    fontWeight: "500",
    flex: 1,
    letterSpacing: Platform.OS === 'android' ? 0.2 : 0.3,
  },
  closeButton: {
    backgroundColor: "#0b34b0",
    borderRadius: Platform.OS === 'android' ? 16 : 20,
    paddingVertical: Platform.OS === 'android' ? 14 : 16,
    alignItems: "center",
    marginTop: Platform.OS === 'android' ? 16 : 20,
    ...getShadowStyle(Platform.OS === 'android' ? 3 : 5, "#0b34b0", 0.2),
  },
  closeButtonText: {
    color: "white",
    fontSize: Platform.OS === 'android' 
      ? (isTablet ? 16 : 15) 
      : (isTablet ? 18 : 16),
    fontWeight: "700",
    letterSpacing: Platform.OS === 'android' ? 0.8 : 1,
  },
});

export default CompleteProfile;

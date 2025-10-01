import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Dimensions,
  StatusBar,
  TextInput,
  FlatList,
  Image,
  Animated,
  Modal,
  Linking,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import { FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import LottieView from "lottie-react-native";
import * as Clipboard from "expo-clipboard";
import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

// --------------------------------------------------------------------------------
// Configuración de la API
// --------------------------------------------------------------------------------
const API_URL =
  "https://api.stack-ai.com/inference/v0/run/1640c9fb-aa6e-42d3-aa7b-589fb81ea0a0/679133f2b623c3637afc299f";
const HEADERS = {
  Authorization: "Bearer ae8b0a56-1901-4909-8994-1def1cadc51b",
  "Content-Type": "application/json",
};

const { width, height } = Dimensions.get("window");
const isAndroid = Platform.OS === "android";

// --------------------------------------------------------------------------------
// Función para formatear tiempo
// --------------------------------------------------------------------------------
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// --------------------------------------------------------------------------------
// Componente para la animación de escritura súper diferente
// --------------------------------------------------------------------------------
const TypingAnimation = () => {
  const [animation] = useState(new Animated.Value(0));
  const [waveAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animación de puntos ondulante
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();

    // Animación de onda de fondo
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingWrapper}>
        <LinearGradient
          colors={["#1E3A8A", "#3B82F6", "#60A5FA"]}
          style={styles.typingBubble}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.typingContentLeft}>
            <View style={styles.botAvatarSmall}>
              <Image 
                source={require("../ChatBot/images/bot.png")} 
                style={styles.botImageSmall} 
              />
              <Animated.View 
                style={[
                  styles.avatarRing,
                  {
                    transform: [{
                      rotate: waveAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      })
                    }]
                  }
                ]} 
              />
            </View>
            
            <View style={styles.typingDotsArea}>
              {[0, 1, 2].map((index) => (
                <Animated.View 
                  key={index}
                  style={[
                    styles.typingDot, 
                    { 
                      opacity: animation.interpolate({
                        inputRange: [0, 0.25, 0.5, 0.75, 1],
                        outputRange: [0.3, index === 0 ? 1 : 0.3, index === 1 ? 1 : 0.3, index === 2 ? 1 : 0.3, 0.3],
                        extrapolate: 'clamp',
                      }),
                      transform: [{
                        translateY: animation.interpolate({
                          inputRange: [0, 0.25, 0.5, 0.75, 1],
                          outputRange: [0, index === 0 ? -8 : 0, index === 1 ? -8 : 0, index === 2 ? -8 : 0, 0],
                          extrapolate: 'clamp',
                        })
                      }]
                    }
                  ]} 
                />
              ))}
            </View>
          </View>
          
          {/* <Text style={styles.typingLabel}>Escribiendo</Text> */}
        </LinearGradient>
      </View>
    </View>
  );
};

// --------------------------------------------------------------------------------
// Función para consultar la API
// --------------------------------------------------------------------------------
async function query(user_input) {
  const payload = {
    user_id: "1234", // ID de usuario hardcodeado
    "in-0": user_input,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Error al comunicarse con la API");
    }

    const responseData = await response.json();
    const rawResponse =
      responseData.outputs?.["out-0"] ||
      "No se recibió una respuesta válida en el campo 'out-0'.";

    return rawResponse.slice(0, 5000);
  } catch (e) {
    return `Error al comunicarse con la API: ${e.message}`;
  }
}

// --------------------------------------------------------------------------------
// Función para procesar la respuesta (eliminar contenido no deseado)
// --------------------------------------------------------------------------------
function processResponse(response) {
  response = response.replace(/\[\^.*?\]/g, "");
  response = response.replace(/<citations>.*?<\/citations>/gs, "");
  response = response.replace(/\n\s*\n/g, "\n");
  return response.trim();
}

// --------------------------------------------------------------------------------
// Función para detectar saludos
// --------------------------------------------------------------------------------
const isGreeting = (message) => {
  const greetings = [
    "hola",
    "hello",
    "hi",
    "hey",
    "buenos días",
    "buenas tardes",
    "buenas noches",
  ];
  return greetings.some((greeting) => message.toLowerCase().includes(greeting));
};

// --------------------------------------------------------------------------------
// Función para generar respuestas a saludos
// --------------------------------------------------------------------------------
const getGreetingResponse = () => {
  const responses = [
    "¡Hola! ¿Cómo estás? ¿En qué puedo ayudarte hoy?",
    "¡Bienvenido! ¿Qué puedo hacer por ti?",
    "¡Hola! Estoy aquí para ayudarte. ¿Qué necesitas?",
    "¡Saludos! ¿Tienes alguna pregunta sobre CUCEI?",
    "¡Hola! ¿En qué puedo asistirte hoy?",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

// --------------------------------------------------------------------------------
// Componente principal: Chatbot
// --------------------------------------------------------------------------------
export const Chatbot = () => {
  const isFocused = useIsFocused(); // Sólo activa el temporizador si el Chatbot está enfocado
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showInactivityModal, setShowInactivityModal] = useState(false);
  const flatListRef = useRef();
  const lottieRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const deleteTimerRef = useRef(null);

  useEffect(() => {
    loadMessages();
    checkFirstVisit();
    return () => {
      clearTimeout(inactivityTimerRef.current);
      clearTimeout(deleteTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      resetInactivityTimer();
    } else {
      clearTimeout(inactivityTimerRef.current);
      clearTimeout(deleteTimerRef.current);
    }
  }, [messages, isFocused]);

  // --------------------------------------------------------------------------------
  // Verificar primera visita
  // --------------------------------------------------------------------------------
  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem("hasVisitedNewChatbot");
      if (hasVisited === null) {
        setShowWelcome(true);
      } else {
        setShowWelcome(false);
      }
    } catch (error) {
      // No se muestra error
    }
  };

  // --------------------------------------------------------------------------------
  // Cargar mensajes guardados
  // --------------------------------------------------------------------------------
  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem("chatMessages");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        const welcomeMessage = {
          _id: Date.now().toString(),
          text: "¡Hola! Soy el bot asistente de CUCEI. Estoy aquí para ayudarte con cualquier duda que tengas sobre el campus, horarios, eventos y más. ¿En qué puedo asistirte hoy?",
          createdAt: new Date().toISOString(),
          user: {
            _id: 2,
            name: "Chatbot",
            avatar: require("../ChatBot/images/bot.png"),
          },
        };
        setMessages([welcomeMessage]);
        saveMessages([welcomeMessage]);
      }
    } catch (error) {
      // No se muestra error
    }
  };

  // --------------------------------------------------------------------------------
  // Guardar mensajes
  // --------------------------------------------------------------------------------
  const saveMessages = async (messagesToSave) => {
    try {
      await AsyncStorage.setItem(
        "chatMessages",
        JSON.stringify(messagesToSave)
      );
    } catch (error) {
      // No se muestra error
    }
  };

  // --------------------------------------------------------------------------------
  // Manejar el envío de mensajes
  // --------------------------------------------------------------------------------
  const onSend = useCallback(async () => {
    if (inputMessage.trim() === "") return;

    const newMessage = {
      _id: `${Date.now()}-${Math.random()}`,
      text: inputMessage,
      createdAt: new Date().toISOString(),
      user: { _id: 1, name: "Usuario" },
    };

    setMessages((prevMessages) => [newMessage, ...prevMessages]);
    setInputMessage("");
    setIsTyping(true);

    try {
      if (isGreeting(inputMessage)) {
        addBotMessage(getGreetingResponse());
      } else {
        const responseFromAPI = await query(inputMessage);
        const processedResponse = processResponse(responseFromAPI);
        addBotMessage(processedResponse);
      }
    } catch (error) {
      addBotMessage(
        "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo más tarde."
      );
    } finally {
      setIsTyping(false);
    }
  }, [inputMessage]);

  // --------------------------------------------------------------------------------
  // Agregar mensaje del bot
  // --------------------------------------------------------------------------------
  const addBotMessage = (text) => {
    const botMessage = {
      _id: `${Date.now()}-${Math.random()}`,
      text,
      createdAt: new Date().toISOString(),
      user: {
        _id: 2,
        name: "Chatbot",
        avatar: require("../ChatBot/images/bot.png"),
      },
    };
    setMessages((prevMessages) => {
      const updatedMessages = [botMessage, ...prevMessages];
      saveMessages(updatedMessages);
      return updatedMessages;
    });
  };

  // --------------------------------------------------------------------------------
  // Renderizar mensaje completamente rediseñado
  // --------------------------------------------------------------------------------
  const renderMessage = ({ item, index }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={index * 50}
      duration={400}
      style={styles.messageContainer}
    >
      {item.user._id === 1 ? (
        // Mensaje del usuario - Diseño moderno
        <View style={styles.userMessageWrapper}>
          <LinearGradient
            colors={["#1E40AF", "#3B82F6"]}
            style={styles.userMessageBubble}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.userMessageText}>
              {renderTextWithLinks(item.text)}
            </Text>
            <View style={styles.messageInfo}>
              <Text style={styles.messageTime}>
                {formatTime(item.createdAt)}
              </Text>
              <View style={styles.messageStatus}>
                <FontAwesome name="check-circle" size={14} color="#E8F4FD" />
              </View>
            </View>
          </LinearGradient>
          <View style={styles.messageTail} />
        </View>
      ) : (
        // Mensaje del bot - Diseño card moderno
        <View style={styles.botMessageWrapper}>
          <View style={styles.botAvatarContainer}>
            <LinearGradient
              colors={["#3B82F6", "#1E40AF"]}
              style={styles.botAvatarBg}
            >
              <Image source={item.user.avatar} style={styles.botAvatar} />
            </LinearGradient>
            <View style={styles.onlineDot} />
          </View>
          
          <View style={styles.botMessageCard}>
            <LinearGradient
              colors={["#ffffff", "#fafbff"]}
              style={styles.botMessageBubble}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.botMessageHeader}>
                <Text style={styles.botName}>Asistente CUCEI</Text>
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => copyToClipboard(item.text)}
                >
                  <FontAwesome name="copy" size={12} color="#3B82F6" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.botMessageText}>
                {renderTextWithLinks(item.text)}
              </Text>
              
              <Text style={styles.botMessageTime}>
                {formatTime(item.createdAt)}
              </Text>
            </LinearGradient>
          </View>
        </View>
      )}
    </Animatable.View>
  );

  // --------------------------------------------------------------------------------
  // Renderizar texto con enlaces clicables
  // --------------------------------------------------------------------------------
  const renderTextWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <Text
            key={index}
            style={styles.link}
            onPress={() => Linking.openURL(part)}>
            {part}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  // --------------------------------------------------------------------------------
  // Copiar texto al portapapeles
  // --------------------------------------------------------------------------------
  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copiado", "El mensaje ha sido copiado al portapapeles");
  };

  // --------------------------------------------------------------------------------
  // Manejar cierre de bienvenida
  // --------------------------------------------------------------------------------
  const handleCloseWelcome = async () => {
    setShowWelcome(false);
    try {
      await AsyncStorage.setItem("hasVisitedNewChatbot", "true");
    } catch (error) {
      // No se muestra error
    }
  };

  // --------------------------------------------------------------------------------
  // Reiniciar temporizador de inactividad (sólo se activa si el Chatbot está enfocado)
  // --------------------------------------------------------------------------------
  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimerRef.current);
    clearTimeout(deleteTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      setShowInactivityModal(true);
    }, 2 * 60 * 1000); // 2 minutos
    deleteTimerRef.current = setTimeout(() => {
      deleteConversation();
    }, 3 * 60 * 1000); // 3 minutos
  };

  // --------------------------------------------------------------------------------
  // Eliminar conversación (este método elimina todos los mensajes)
  // --------------------------------------------------------------------------------
  const deleteConversation = async () => {
    const welcomeMessage = messages.find(
      (message) =>
        message.user._id === 2 &&
        message.text.includes(
          "¡Hola! Soy el bot asistente de CUCEI. Estoy aquí para ayudarte con cualquier duda que tengas sobre el campus, horarios, eventos y más. ¿En qué puedo asistirte hoy?"
        )
    );
    const newMessages = welcomeMessage ? [welcomeMessage] : [];
    setMessages(newMessages);
    await AsyncStorage.setItem("chatMessages", JSON.stringify(newMessages));
    setShowInactivityModal(false);
  };

  if (!isFocused) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />

      {/* Header completamente nuevo y hermoso */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#1E40AF", "#3B82F6", "#60A5FA"]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.headerBotAvatar}>
                <Image 
                  source={require("../ChatBot/images/bot.png")} 
                  style={styles.headerBotImage} 
                />
                <View style={styles.headerOnlineBadge}>
                  <View style={styles.onlinePulse} />
                </View>
              </View>
              
              <View style={styles.headerTextArea}>
                <Text style={styles.headerTitle}>CUCEI Assistant</Text>
                <View style={styles.headerStatus}>
                  <View style={styles.statusDot} />
                  <Text style={styles.headerSubtitle}>Siempre disponible</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity style={styles.headerAction}>
              <LinearGradient
                colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
                style={styles.headerActionBg}
              >
                <FontAwesome name="ellipsis-v" size={16} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {/* Decoración ondulada */}
          <View style={styles.headerWave}>
            <LinearGradient
              colors={["#f8f9ff", "rgba(248, 249, 255, 0.9)"]}
              style={styles.waveShape}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </LinearGradient>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatArea}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 60}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messagesList}
          inverted
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
        
        {isTyping && <TypingAnimation />}
        
        {/* Input súper lindo y elevado para Android */}
        <View style={styles.inputSection}>
          <LinearGradient
            colors={["#ffffff", "#f8fafc", "#e0f2fe"]}
            style={styles.inputBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.messageInput}
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  placeholder="Escribe tu mensaje aquí..."
                  placeholderTextColor="#94A3B8"
                  multiline={true}
                  maxLength={1000}
                  returnKeyType="send"
                  onSubmitEditing={onSend}
                  textAlignVertical="top"
                />
              </View>
              
              <TouchableOpacity
                style={[
                  styles.sendButtonContainer,
                  !inputMessage.trim() && styles.sendDisabled
                ]}
                onPress={onSend}
                disabled={!inputMessage.trim()}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={inputMessage.trim() 
                    ? ["#3B82F6", "#1E40AF", "#1E3A8A"] 
                    : ["#E5E7EB", "#D1D5DB", "#9CA3AF"]
                  }
                  style={styles.sendButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome
                    name="paper-plane"
                    size={16}
                    color={inputMessage.trim() ? "#ffffff" : "#6B7280"}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>

      {/* Modal de bienvenida rediseñado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showWelcome}
        onRequestClose={handleCloseWelcome}
      >
        <BlurView intensity={100} style={styles.modalBackground}>
          <Animatable.View
            animation="bounceInUp"
            duration={800}
            style={styles.welcomeModal}
          >
            <LinearGradient
              colors={["#1E40AF", "#3B82F6", "#60A5FA"]}
              style={styles.modalHeaderGradient}
            >
              <View style={styles.modalIcon}>
                <FontAwesome name="robot" size={32} color="#ffffff" />
              </View>
              <Text style={styles.modalWelcomeTitle}>¡Hola! Soy tu asistente</Text>
              <Text style={styles.modalWelcomeSubtitle}>Estoy aquí para ayudarte</Text>
            </LinearGradient>
            
            <View style={styles.modalBodyContent}>
              <LottieView
                ref={lottieRef}
                source={require("../ChatBot/images/Bot_animation.json")}
                autoPlay
                loop
                style={styles.modalAnimation}
              />
              <Text style={styles.modalDescription}>
                Puedo ayudarte con información sobre CUCEI, horarios, eventos, ubicaciones y mucho más.
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.startChatButton}
              onPress={handleCloseWelcome}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#3B82F6", "#1E40AF"]}
                style={styles.startButtonGradient}
              >
                <FontAwesome name="comments" size={18} color="#ffffff" />
                <Text style={styles.startButtonText}>Comenzar conversación</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        </BlurView>
      </Modal>

      {/* Modal de inactividad rediseñado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showInactivityModal}
        onRequestClose={() => setShowInactivityModal(false)}
      >
        <BlurView intensity={80} style={styles.modalBackground}>
          <Animatable.View
            animation="zoomIn"
            duration={500}
            style={styles.inactivityModal}
          >
            <View style={styles.inactivityIcon}>
              <FontAwesome name="clock-o" size={48} color="#3B82F6" />
            </View>
            
            <Text style={styles.inactivityTitle}>¿Aún estás ahí?</Text>
            <Text style={styles.inactivityMessage}>
              No he recibido mensajes en un tiempo. ¿Quieres mantener nuestra conversación?
            </Text>
            
            <View style={styles.inactivityActions}>
              <TouchableOpacity
                style={styles.keepButton}
                onPress={() => {
                  setShowInactivityModal(false);
                  resetInactivityTimer();
                }}
              >
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  style={styles.keepButtonGradient}
                >
                  <FontAwesome name="check" size={16} color="#ffffff" />
                  <Text style={styles.keepButtonText}>Continuar</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.clearButton}
                onPress={deleteConversation}
              >
                <LinearGradient
                  colors={["#EF4444", "#DC2626"]}
                  style={styles.clearButtonGradient}
                >
                  <FontAwesome name="trash" size={16} color="#ffffff" />
                  <Text style={styles.clearButtonText}>Limpiar chat</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9ff" 
  },
  
  // Header hermoso y bien proporcionado
  headerContainer: {
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    // elevation: 10,
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    // paddingBottom: 10,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerBotAvatar: {
    position: "relative",
    marginRight: 16,
  },
  headerBotImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.9)",
  },
  // headerOnlineBadge: {
  //   position: "absolute",
  //   bottom: -2,
  //   right: -2,
  //   width: 16,
  //   height: 16,
  //   borderRadius: 8,
  //   backgroundColor: "#00E676",
  //   borderWidth: 3,
  //   borderColor: "#ffffff",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // onlinePulse: {
  //   width: 8,
  //   height: 8,
  //   borderRadius: 4,
  //   backgroundColor: "#ffffff",
  // },
  headerTextArea: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  headerStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00E676",
    marginRight: 6,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#E8F4FD",
    fontWeight: "600",
  },
  headerAction: {
    marginLeft: 12,
  },
  headerActionBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  headerWave: {
    height: 16,
    marginTop: -4,
  },
  waveShape: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  
  // Chat area optimizado para Android
  chatArea: { 
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  messagesList: { 
    paddingHorizontal: 16, 
    paddingVertical: 12,
    flexGrow: 1,
  },
  
  // Messages completamente rediseñados en azul
  messageContainer: {
    marginVertical: 6,
  },
  
  // Usuario
  userMessageWrapper: {
    alignSelf: "flex-end",
    maxWidth: "85%",
    position: "relative",
  },
  userMessageBubble: {
    borderRadius: 20,
    borderBottomRightRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  userMessageText: { 
    fontSize: 15,
    lineHeight: 20,
    color: "#ffffff",
    fontWeight: "500",
    marginBottom: 6,
  },
  messageInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  messageTime: {
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
    marginRight: 4,
    fontWeight: "600",
  },
  messageStatus: {
    marginLeft: 3,
  },
  messageTail: {
    position: "absolute",
    bottom: 0,
    right: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderLeftColor: "#1E40AF",
    borderTopWidth: 12,
    borderTopColor: "transparent",
  },
  
  // Bot
  botMessageWrapper: {
    alignSelf: "flex-start",
    flexDirection: "row",
    maxWidth: "88%",
    marginBottom: 4,
  },
  botAvatarContainer: {
    position: "relative",
    marginRight: 10,
    marginTop: 4,
  },
  botAvatarBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  botAvatar: { 
    width: 24, 
    height: 24, 
    borderRadius: 12,
  },
  // onlineDot: {
  //   position: "absolute",
  //   bottom: 89,
  //   right: -1,
  //   width: 12,
  //   height: 12,
  //   borderRadius: 6,
  //   backgroundColor: "#00E676",
  //   borderWidth: 2,
  //   borderColor: "#ffffff",
  // },
  botMessageCard: {
    flex: 1,
  },
  botMessageBubble: {
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#E0E7FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.08)",
  },
  botMessageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  botName: {
    fontSize: 11,
    fontWeight: "700",
    color: "#3B82F6",
    letterSpacing: 0.3,
  },
  copyBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#3B82F615",
    justifyContent: "center",
    alignItems: "center",
  },
  botMessageText: { 
    fontSize: 14,
    lineHeight: 19,
    color: "#2D3748",
    fontWeight: "500",
    marginBottom: 6,
  },
  botMessageTime: {
    fontSize: 9,
    color: "#9CA3AF",
    fontWeight: "600",
    textAlign: "right",
  },
  
  // Typing animation optimizada
  typingContainer: { 
    paddingHorizontal: 16, 
    paddingVertical: 10,
    alignItems: "flex-start" 
  },
  typingWrapper: {
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 120,
  },
  typingContentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  botAvatarSmall: {
    position: "relative",
    marginRight: 10,
  },
  botImageSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  avatarRing: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  typingDotsArea: {
    flexDirection: "row",
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff",
    marginHorizontal: 1.5,
  },
  typingLabel: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
    fontStyle: "italic",
  },
  
  // Input súper lindo y elevado perfectamente para Android
  inputSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === "android" ? 20 : 32,
    backgroundColor: "#f8f9ff",
  },
  inputBackground: {
    borderRadius: 28,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.1)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 60,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 12,
    minHeight: 40,
  },
  messageInput: {
    fontSize: 16,
    color: "#2D3748",
    fontWeight: "500",
    paddingVertical: 8,
    paddingHorizontal: 4,
    textAlignVertical: "top",
    minHeight: 40,
    maxHeight: 120,
    lineHeight: 22,
  },
  sendButtonContainer: {
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendDisabled: {
    opacity: 0.6,
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Modals rediseñados en azul
  modalBackground: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeModal: {
    backgroundColor: "white",
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    width: "100%",
    maxWidth: 340,
  },
  modalHeaderGradient: {
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  modalIcon: {
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  modalWelcomeTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 4,
  },
  modalWelcomeSubtitle: {
    fontSize: 13,
    color: "#E8F4FD",
    textAlign: "center",
    fontWeight: "500",
  },
  modalBodyContent: {
    paddingHorizontal: 24,
    paddingVertical: 18,
    alignItems: "center",
  },
  modalAnimation: { 
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    textAlign: "center",
    color: "#475569",
    lineHeight: 20,
    fontWeight: "500",
  },
  startChatButton: {
    margin: 24,
    marginTop: 12,
  },
  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 22,
  },
  startButtonText: { 
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 8,
  },
  
  // Inactivity modal
  inactivityModal: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 28,
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 12,
    width: "100%",
    maxWidth: 300,
  },
  inactivityIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#3B82F615",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  inactivityTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    color: "#2D3748",
    textAlign: "center",
  },
  inactivityMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 22,
    color: "#64748B",
    lineHeight: 19,
    fontWeight: "500",
  },
  inactivityActions: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  keepButton: {
    flex: 1,
  },
  keepButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  keepButtonText: { 
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 8,
  },
  clearButton: {
    flex: 1,
  },
  clearButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  clearButtonText: { 
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 8,
  },
  
  // Link styles
  link: { 
    color: "#3B82F6", 
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});

export default Chatbot;

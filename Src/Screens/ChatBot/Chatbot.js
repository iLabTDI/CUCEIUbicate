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
          colors={["#667eea", "#764ba2", "#f093fb"]}
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
              {[0, 0.33, 0.66].map((delay, index) => (
                <Animated.View 
                  key={index}
                  style={[
                    styles.typingDot, 
                    { 
                      opacity: animation.interpolate({
                        inputRange: [delay, delay + 0.33, delay + 0.66, 1],
                        outputRange: [0.3, 1, 0.3, 0.3],
                        extrapolate: 'clamp',
                      }),
                      transform: [{
                        translateY: animation.interpolate({
                          inputRange: [delay, delay + 0.33, delay + 0.66, 1],
                          outputRange: [0, -8, 0, 0],
                          extrapolate: 'clamp',
                        })
                      }]
                    }
                  ]} 
                />
              ))}
            </View>
          </View>
          
          <Text style={styles.typingLabel}>Escribiendo</Text>
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
            colors={["#667eea", "#764ba2"]}
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
              colors={["#f093fb", "#f5576c"]}
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
                  <FontAwesome name="copy" size={12} color="#667eea" />
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
          colors={["#667eea", "#764ba2", "#f093fb"]}
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
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messagesList}
          inverted
          showsVerticalScrollIndicator={false}
        />
        
        {isTyping && <TypingAnimation />}
        
        {/* Input completamente rediseñado */}
        <View style={styles.inputSection}>
          <LinearGradient
            colors={["#ffffff", "#f8f9ff"]}
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
                  placeholder="Escribe tu mensaje..."
                  placeholderTextColor="#B0BEC5"
                  multiline
                  maxLength={1000}
                  returnKeyType="send"
                  onSubmitEditing={onSend}
                />
                
                <TouchableOpacity
                  style={styles.attachButton}
                  activeOpacity={0.7}
                >
                  <FontAwesome name="paperclip" size={18} color="#667eea" />
                </TouchableOpacity>
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
                    ? ["#667eea", "#764ba2"] 
                    : ["#E5E7EB", "#D1D5DB"]
                  }
                  style={styles.sendButtonGradient}
                >
                  <FontAwesome
                    name="paper-plane"
                    size={16}
                    color={inputMessage.trim() ? "#ffffff" : "#9CA3AF"}
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
              colors={["#667eea", "#764ba2", "#f093fb"]}
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
                colors={["#667eea", "#764ba2"]}
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
              <FontAwesome name="clock-o" size={48} color="#667eea" />
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
  
  // Header completamente nuevo
  headerContainer: {
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 50 : 45,
    paddingBottom: 25,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerBotAvatar: {
    position: "relative",
    marginRight: 15,
  },
  headerBotImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  headerOnlineBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#00E676",
    borderWidth: 3,
    borderColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  onlinePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
  },
  headerTextArea: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 3,
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
    fontWeight: "500",
  },
  headerAction: {
    marginLeft: 10,
  },
  headerActionBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  headerWave: {
    height: 20,
    marginTop: -5,
  },
  waveShape: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  
  // Chat area
  chatArea: { 
    flex: 1,
    backgroundColor: "#f8f9ff",
  },
  messagesList: { 
    paddingHorizontal: 20, 
    paddingVertical: 15,
  },
  
  // Messages completamente rediseñados
  messageContainer: {
    marginVertical: 8,
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
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  userMessageText: { 
    fontSize: 16,
    lineHeight: 22,
    color: "#ffffff",
    fontWeight: "500",
    marginBottom: 8,
  },
  messageInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  messageTime: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    marginRight: 6,
    fontWeight: "600",
  },
  messageStatus: {
    marginLeft: 4,
  },
  messageTail: {
    position: "absolute",
    bottom: 0,
    right: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderLeftColor: "#764ba2",
    borderTopWidth: 15,
    borderTopColor: "transparent",
  },
  
  // Bot
  botMessageWrapper: {
    alignSelf: "flex-start",
    flexDirection: "row",
    maxWidth: "90%",
    marginBottom: 5,
  },
  botAvatarContainer: {
    position: "relative",
    marginRight: 12,
    marginTop: 5,
  },
  botAvatarBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#f5576c",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  botAvatar: { 
    width: 28, 
    height: 28, 
    borderRadius: 14,
  },
  onlineDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#00E676",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  botMessageCard: {
    flex: 1,
  },
  botMessageBubble: {
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#E0E7FF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.08)",
  },
  botMessageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  botName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#667eea",
    letterSpacing: 0.5,
  },
  copyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#667eea15",
    justifyContent: "center",
    alignItems: "center",
  },
  botMessageText: { 
    fontSize: 15,
    lineHeight: 21,
    color: "#2D3748",
    fontWeight: "500",
    marginBottom: 8,
  },
  botMessageTime: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "600",
    textAlign: "right",
  },
  
  // Typing animation completamente nueva
  typingContainer: { 
    paddingHorizontal: 20, 
    paddingVertical: 12,
    alignItems: "flex-start" 
  },
  typingWrapper: {
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    minWidth: 140,
  },
  typingContentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  botAvatarSmall: {
    position: "relative",
    marginRight: 12,
  },
  botImageSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  avatarRing: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  typingDotsArea: {
    flexDirection: "row",
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    marginHorizontal: 2,
  },
  typingLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "italic",
  },
  
  // Input completamente rediseñado
  inputSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: Platform.OS === "ios" ? 30 : 15,
  },
  inputBackground: {
    borderRadius: 30,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.08)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: "#2D3748",
    fontWeight: "500",
    maxHeight: 100,
    minHeight: 20,
    textAlignVertical: "center",
  },
  attachButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#667eea15",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  sendButtonContainer: {
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Modals rediseñados
  modalBackground: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeModal: {
    backgroundColor: "white",
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 20,
    width: "100%",
    maxWidth: 350,
  },
  modalHeaderGradient: {
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: "center",
  },
  modalIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  modalWelcomeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 5,
  },
  modalWelcomeSubtitle: {
    fontSize: 14,
    color: "#E8F4FD",
    textAlign: "center",
    fontWeight: "500",
  },
  modalBodyContent: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    alignItems: "center",
  },
  modalAnimation: { 
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 15,
    textAlign: "center",
    color: "#475569",
    lineHeight: 22,
    fontWeight: "500",
  },
  startChatButton: {
    margin: 25,
    marginTop: 15,
  },
  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  startButtonText: { 
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 10,
  },
  
  // Inactivity modal
  inactivityModal: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 30,
    alignItems: "center",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    width: "100%",
    maxWidth: 320,
  },
  inactivityIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#667eea15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  inactivityTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    color: "#2D3748",
    textAlign: "center",
  },
  inactivityMessage: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 25,
    color: "#64748B",
    lineHeight: 21,
    fontWeight: "500",
  },
  inactivityActions: {
    flexDirection: "row",
    width: "100%",
  },
  keepButton: {
    flex: 1,
    marginRight: 10,
  },
  keepButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
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
    marginLeft: 10,
  },
  clearButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
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
    color: "#667eea", 
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});

export default Chatbot;

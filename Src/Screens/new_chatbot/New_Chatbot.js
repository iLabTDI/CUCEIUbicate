import React, { useState, useCallback, useEffect, useRef } from "react"
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
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Animatable from "react-native-animatable"
import { FontAwesome } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import LottieView from "lottie-react-native"

// --------------------------------------------------------------------------------
// Configuración de la API
// --------------------------------------------------------------------------------
const API_URL ="https://api.stack-ai.com/inference/v0/run/1640c9fb-aa6e-42d3-aa7b-589fb81ea0a0/679133f2b623c3637afc299f"
const HEADERS = {
  Authorization: "Bearer ae8b0a56-1901-4909-8994-1def1cadc51b",
  "Content-Type": "application/json",
}

const { width, height } = Dimensions.get("window")
const isAndroid = Platform.OS === "android"

// --------------------------------------------------------------------------------
// Componente para la animación de escritura
// --------------------------------------------------------------------------------
const TypingAnimation = () => {
  const [animation] = useState(new Animated.Value(0))

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ).start()
  }, [])

  const dotStyle = (delay) => {
    return {
      opacity: animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 1, 0.3],
        extrapolate: "clamp",
      }),
      transform: [
        {
          scale: animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: "clamp",
          }),
        },
      ],
      marginLeft: 4,
    }
  }

  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <Animated.View style={[styles.typingDot, dotStyle(0)]} />
        <Animated.View style={[styles.typingDot, dotStyle(0.2)]} />
        <Animated.View style={[styles.typingDot, dotStyle(0.4)]} />
      </View>
    </View>
  )
}

// --------------------------------------------------------------------------------
// Función para consultar la API
// --------------------------------------------------------------------------------
async function query(user_input) {
  const payload = {
    user_id: "1234", // ID de usuario hardcodeado
    "in-0": user_input,
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error("Error al comunicarse con la API")
    }

    const responseData = await response.json()
    const rawResponse = responseData.outputs?.["out-0"] || "No se recibió una respuesta válida en el campo 'out-0'."

    // Recortar la respuesta a 5000 caracteres si excede
    return rawResponse.slice(0, 5000)
  } catch (e) {
    return `Error al comunicarse con la API: ${e.message}`
  }
}

// --------------------------------------------------------------------------------
// Función para procesar la respuesta (eliminar contenido no deseado)
// --------------------------------------------------------------------------------
function processResponse(response) {
  response = response.replace(/\[\^.*?\]/g, "")
  response = response.replace(/<citations>.*?<\/citations>/gs, "")
  response = response.replace(/\n\s*\n/g, "\n")
  return response.trim()
}

// --------------------------------------------------------------------------------
// Componente principal: NewChatbot
// --------------------------------------------------------------------------------
export const NewChatbot = () => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const flatListRef = useRef()
  const lottieRef = useRef(null)

  useEffect(() => {
    loadMessages()
    checkFirstVisit()
  }, [])

  // --------------------------------------------------------------------------------
  // Verificar primera visita
  // --------------------------------------------------------------------------------
  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem("hasVisitedNewChatbot")
      if (hasVisited === null) {
        setShowWelcome(true)
      } else {
        setShowWelcome(false)
      }
    } catch (error) {
      console.error("Error checking first visit:", error)
    }
  }

  // --------------------------------------------------------------------------------
  // Cargar mensajes guardados
  // --------------------------------------------------------------------------------
  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem("chatMessages")
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages))
      } else {
        // Agregar mensaje de bienvenida por defecto
        const welcomeMessage = {
          _id: Date.now().toString(),
          text: "¡Hola! Soy tu asistente virtual de CUCEI Ubicate. ¿Cómo puedo ayudarte hoy?",
          createdAt: new Date().toISOString(),
          user: {
            _id: 2,
            name: "Chatbot",
            avatar: require("../ChatBot/images/bot.png"),
          },
        }
        setMessages([welcomeMessage])
        saveMessages([welcomeMessage])
      }
    } catch (error) {
      console.error("Error al cargar mensajes:", error)
    }
  }

  // --------------------------------------------------------------------------------
  // Guardar mensajes
  // --------------------------------------------------------------------------------
  const saveMessages = async (messagesToSave) => {
    try {
      await AsyncStorage.setItem("chatMessages", JSON.stringify(messagesToSave))
    } catch (error) {
      console.error("Error al guardar mensajes:", error)
    }
  }

  // --------------------------------------------------------------------------------
  // Manejar el envío de mensajes
  // --------------------------------------------------------------------------------
  const onSend = useCallback(async () => {
    if (inputMessage.trim() === "") return

    const newMessage = {
      _id: Date.now().toString(),
      text: inputMessage,
      createdAt: new Date().toISOString(),
      user: {
        _id: 1,
        name: "Usuario",
      },
    }

    setMessages((previousMessages) => [newMessage, ...previousMessages])
    setInputMessage("")
    setIsTyping(true)

    try {
      const responseFromAPI = await query(inputMessage)
      const processedResponse = processResponse(responseFromAPI)
      addBotMessage(processedResponse)
    } catch (error) {
      console.error("Error al obtener respuesta de la API:", error)
      addBotMessage("Lo siento, ha ocurrido un error. Por favor, intenta de nuevo más tarde.")
    } finally {
      setIsTyping(false)
    }
  }, [inputMessage])

  // --------------------------------------------------------------------------------
  // Agregar mensaje del bot
  // --------------------------------------------------------------------------------
  const addBotMessage = (text) => {
    const botMessage = {
      _id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
      user: {
        _id: 2,
        name: "Chatbot",
        avatar: require("../ChatBot/images/bot.png"),
      },
    }
    setMessages((previousMessages) => {
      const updatedMessages = [botMessage, ...previousMessages]
      saveMessages(updatedMessages)
      return updatedMessages
    })
  }

  // --------------------------------------------------------------------------------
  // Renderizar un mensaje individual
  // --------------------------------------------------------------------------------
  const renderMessage = ({ item }) => (
    <Animatable.View
      animation="fadeIn"
      duration={500}
      style={[styles.messageBubble, item.user._id === 1 ? styles.userBubble : styles.botBubble]}
    >
      {item.user._id === 2 && <Image source={item.user.avatar} style={styles.avatar} />}
      <View style={styles.messageContent}>
        <Text style={[styles.messageText, item.user._id === 1 ? styles.userMessageText : styles.botMessageText]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </Animatable.View>
  )

  // --------------------------------------------------------------------------------
  // Manejar cierre de bienvenida
  // --------------------------------------------------------------------------------
  const handleCloseWelcome = async () => {
    setShowWelcome(false)
    try {
      await AsyncStorage.setItem("hasVisitedNewChatbot", "true")
    } catch (error) {
      console.error("Error saving visit status:", error)
    }
  }

  // --------------------------------------------------------------------------------
  // Interfaz
  // --------------------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 120}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messageList}
          inverted
        />
        {isTyping && <TypingAnimation />}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Escribe tu mensaje aquí..."
            placeholderTextColor="#999"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled]}
            onPress={onSend}
            disabled={!inputMessage.trim()}
          >
            <FontAwesome name="paper-plane" size={24} color={inputMessage.trim() ? "#4c669f" : "#999"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal animationType="fade" transparent={true} visible={showWelcome} onRequestClose={handleCloseWelcome}>
        <BlurView intensity={100} style={styles.modalContainer}>
          <Animatable.View animation="zoomIn" duration={500} style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Bienvenido a CUCEI Ubicate!</Text>
            <LottieView
              ref={lottieRef}
              source={require("../ChatBot/images/Bot_animation.json")}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
            <Text style={styles.modalText}>
              Este chatbot está diseñado para ayudarte a navegar por el campus de CUCEI. Puedes preguntar sobre
              ubicaciones, horarios, eventos y más.
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseWelcome}>
              <Text style={styles.modalButtonText}>Comenzar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  chatContainer: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "flex-end",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#4c669f",
    maxWidth: "80%",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    maxWidth: "80%",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  botMessageText: {
    color: "#000000",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  typingContainer: {
    padding: 10,
    alignItems: "flex-start",
  },
  typingBubble: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#000000",
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#192f6a",
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#4c669f",
  },
  modalButton: {
    backgroundColor: "#4c669f",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modalButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default NewChatbot


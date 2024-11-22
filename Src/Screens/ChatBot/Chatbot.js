import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  SafeAreaView,
  Dimensions,
  StatusBar,
  TextInput,
  FlatList,
  Image,
  Animated,
  AppState,
} from "react-native";
import LottieView from "lottie-react-native";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import handleGenericAPIRequest from "../ChatBot/api";
import intents from "../ChatBot/intents.json";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

const TypingAnimation = () => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  }, []);

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
    };
  };

  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <Animated.View style={[styles.typingDot, dotStyle(0)]} />
        <Animated.View style={[styles.typingDot, dotStyle(0.2)]} />
        <Animated.View style={[styles.typingDot, dotStyle(0.4)]} />
      </View>
    </View>
  );
};

export const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const lottieRef = useRef(null);
  const flatListRef = useRef();
  const appState = useRef(AppState.currentState);
  const lastActivityTime = useRef(Date.now());
  const navigation = useNavigation();

  useEffect(() => {
    checkFirstVisit();
    loadMessages();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        checkSessionValidity();
      }
      appState.current = nextAppState;
    });

    const activityInterval = setInterval(() => {
      if (Date.now() - lastActivityTime.current > 500000) {
        // 10 minutes
        clearMessages();
      }
    }, 60000); // Check every minute

    return () => {
      subscription.remove();
      clearInterval(activityInterval);
    };
  }, []);

  const checkSessionValidity = async () => {
    const lastActiveTime = await AsyncStorage.getItem("lastActiveTime");
    if (lastActiveTime && Date.now() - parseInt(lastActiveTime) > 500000) {
      clearMessages();
    }
  };

  const updateLastActivityTime = () => {
    lastActivityTime.current = Date.now();
    AsyncStorage.setItem("lastActiveTime", Date.now().toString());
  };

  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem("hasVisitedChatBott");
      if (hasVisited === null) {
        setShowWelcome(true);
      } else {
        setShowWelcome(false);
      }
    } catch (error) {
      console.error("Error checking first visit:", error);
    }
  };

  const loadMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem("chatMessages");
      const lastActiveTime = await AsyncStorage.getItem("lastActiveTime");

      if (savedMessages && lastActiveTime) {
        const parsedMessages = JSON.parse(savedMessages);
        const lastActive = parseInt(lastActiveTime);

        if (Date.now() - lastActive < 500000) {
          // 10 minutes
          setMessages(parsedMessages);
        } else {
          clearMessages();
        }
      } else {
        clearMessages();
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      clearMessages();
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        _id: "1",
        text: "¡Hola! Soy tu asistente virtual de CUCEI Ubicate. ¿Cómo estás? Estoy aquí para asistirte con dudas académicas o cualquier consulta que tengas.",
        createdAt: new Date().toISOString(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: require("./images/bot.png"),
        },
      },
    ]);
    AsyncStorage.removeItem("chatMessages");
  };

  const saveMessages = async (messagesToSave) => {
    try {
      await AsyncStorage.setItem(
        "chatMessages",
        JSON.stringify(messagesToSave)
      );
      updateLastActivityTime();
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  };

  const handleCloseWelcome = async () => {
    setShowWelcome(false);
    try {
      await AsyncStorage.setItem("hasVisitedChatBot", "true");
    } catch (error) {
      console.error("Error saving visit status:", error);
    }
  };

  const onSend = useCallback(async () => {
    if (inputMessage.trim() === "") return;

    const newMessage = {
      _id: Date.now().toString(),
      text: inputMessage,
      createdAt: new Date().toISOString(),
      user: {
        _id: 1,
        name: "Usuario",
      },
    };

    setMessages((previousMessages) => [newMessage, ...previousMessages]);
    setInputMessage("");

    setIsTyping(true);
    const responseFromIntents = getResponseFromIntents(inputMessage);

    if (responseFromIntents) {
      setTimeout(() => {
        addBotMessage(responseFromIntents);
        setIsTyping(false);
      }, 1000);
    } else {
      try {
        const responseFromAPI = await handleGenericAPIRequest(inputMessage);
        addBotMessage(
          responseFromAPI + "\n\nEsta respuesta está fuera del alcance del área académica." ||
            "Lo siento, no entendí eso. ¿Podrías reformular tu pregunta?"
        );
      } catch (error) {
        console.error("Error getting response from API:", error);
        addBotMessage(
          "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo más tarde."
        );
      } finally {
        setIsTyping(false);
      }
    }
  }, [inputMessage]);

  const addBotMessage = (text) => {
    const botMessage = {
      _id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
      user: {
        _id: 2,
        name: "Chatbot",
        avatar: require("./images/bot.png"),
      },
    };
    setMessages((previousMessages) => [botMessage, ...previousMessages]);
    saveMessages([botMessage, ...messages]);
  };

  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  };

  const getResponseFromIntents = (message) => {
    const normalizedMessage = normalizeString(message);

    for (const intent of intents.intents) {
      const normalizedPatterns = intent.patterns.map((pattern) =>
        normalizeString(pattern)
      );

      if (
        normalizedPatterns.some((pattern) =>
          normalizedMessage.includes(pattern)
        )
      ) {
        if (intent.action === "navigateToScreen") {
          navigation.navigate(intent.screen);
          return intent.responses[0];
        } else {
          return intent.responses[0];
        }
      }
    }
    return null;
  };

  const renderMessage = ({ item }) => (
  <Animatable.View
    animation="fadeIn"
    duration={500}
    style={[
      styles.messageBubble,
      item.user._id === 1 ? styles.userBubble : styles.botBubble,
    ]}
  >
    {item.user._id === 2 && (
      <Image source={item.user.avatar} style={styles.avatar} />
    )}
    <View style={styles.messageContent}>
      <Text
        style={[
          styles.messageText,
          item.user._id === 1
            ? styles.userMessageText
            : styles.botMessageText,
        ]}
      >
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
); 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 100}
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
            autoFocus={true}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputMessage.trim() && styles.sendButtonDisabled,
            ]}
            onPress={onSend}
            disabled={!inputMessage.trim()}>
            <FontAwesome
              name="paper-plane"
              size={isTablet ? 30 : 24}
              color={inputMessage.trim() ? "#4c669f" : "#999"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showWelcome}
        onRequestClose={handleCloseWelcome}>
        <BlurView intensity={100} style={styles.modalContainer}>
          <Animatable.View
            animation="zoomIn"
            duration={500}
            style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bienvenido a CUCEIUbicate!</Text>
            <LottieView
              ref={lottieRef}
              source={require("./images/Bot_animation.json")}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
            <Text style={styles.modalText}>
              Este chatbot está diseñado para ayudarte a navegar por el campus
              de CUCEI. Puedes preguntar sobre ubicaciones, horarios, eventos y
              más.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseWelcome}>
              <Text style={styles.modalButtonText}>Comenzar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  chatContainer: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: isTablet ? 25 : 10,
    paddingBottom: isTablet ? 20 : 10,
  },
  messageBubble: {
    padding: isTablet ? 16 : 12,
    borderRadius: isTablet ? 25 : 20,
    marginVertical: isTablet ? 8 : 6,
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
    maxWidth: isTablet ? "30%" : "40%",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    maxWidth: isTablet ? "80%" : "80%",
  },
  avatar: {
    width: isTablet ? 40 : 30,
    height: isTablet ? 40 : 30,
    borderRadius: isTablet ? 20 : 15,
    marginRight: isTablet ? 15 : 10,
  },
  messageContent: {
    flex: 1,
    marginLeft: isTablet ? 10 : 10,
  },
  messageText: {
    fontSize: isTablet ? 15 : 16,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  botMessageText: {
    color: "#000000",
  },
  timestamp: {
    fontSize: isTablet ? 14 : 12,
    color: "#999",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  typingContainer: {
    padding: isTablet ? 15 : 10,
    alignItems: "flex-start",
  },
  typingBubble: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: isTablet ? 25 : 20,
    padding: isTablet ? 15 : 10,
    alignItems: "center",
  },
  typingDot: {
    width: isTablet ? 8 : 6,
    height: isTablet ? 8 : 6,
    borderRadius: isTablet ? 4 : 3,
    backgroundColor: "#000000",
    marginHorizontal: isTablet ? 3 : 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: isTablet ? 15 : 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  input: {
    flex: 1,
    fontSize: isTablet ? 18 : 16,
    maxHeight: isTablet ? 120 : 100,
    paddingHorizontal: isTablet ? 20 : 15,
    paddingVertical: isTablet ? 15 : 10,
    backgroundColor: "#f0f0f0",
    borderRadius: isTablet ? 25 : 20,
  },
  sendButton: {
    marginLeft: isTablet ? 15 : 10,
    padding: isTablet ? 15 : 10,
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
    borderRadius: isTablet ? 30 : 20,
    padding: isTablet ? 30 : 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: isTablet ? width * 0.7 : width * 0.9,
    maxHeight: isTablet ? height * 0.7 : height * 0.8,
  },
  modalTitle: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: "bold",
    marginBottom: isTablet ? 15 : 10,
    color: "#192f6a",
  },
  lottieAnimation: {
    width: isTablet ? 300 : 200,
    height: isTablet ? 300 : 200,
  },
  modalText: {
    fontSize: isTablet ? 20 : 16,
    textAlign: "center",
    marginBottom: isTablet ? 30 : 20,
    color: "#4c669f",
  },
  modalButton: {
    backgroundColor: "#4c669f",
    paddingHorizontal: isTablet ? 40 : 30,
    paddingVertical: isTablet ? 15 : 10,
    borderRadius: isTablet ? 25 : 20,
  },
  modalButtonText: {
    color: "white",
    fontSize: isTablet ? 22 : 18,
    fontWeight: "bold",
  },
});

export default Chatbot;
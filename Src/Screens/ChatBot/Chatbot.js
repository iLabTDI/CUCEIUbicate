import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  ActivityIndicator
} from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar, Composer } from 'react-native-gifted-chat';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';

import handleGenericAPIRequest from '../ChatBot/api';
import intents from '../ChatBot/intents.json';

const { width, height } = Dimensions.get('window');

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState(""); // Nueva variable para el contenido del mensaje
  const lottieRef = useRef();

  useEffect(() => {
    checkFirstVisit();
    setMessages([
      {
        _id: 1,
        text: '¡Hola! Soy tu asistente virtual de CUCEI Ubicarte. ¿En qué puedo ayudarte hoy?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: require('./images/bot.png'),
        },
      },
    ]);
  }, []);

  // Verifica si es la primera visita del usuario usando AsyncStorage
  const checkFirstVisit = async () => {
    try {
      const hasVisited = await AsyncStorage.getItem('hasVisitedChatBot');
      if (hasVisited === null) {
        setShowWelcome(true);
      } else {
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Error checking first visit:', error);
    }
  };

  // Cierra el modal de bienvenida y guarda la visita del usuario
  const handleCloseWelcome = async () => {
    setShowWelcome(false);
    try {
      await AsyncStorage.setItem('hasVisitedChatBot', 'true');
    } catch (error) {
      console.error('Error saving visit status:', error);
    }
  };

  // Maneja el envío de mensajes y la respuesta del bot
  const onSend = useCallback(async () => {
    if (inputMessage.trim() === "") return; // Evita enviar mensajes vacíos

    const newMessages = [
      {
        _id: Math.random().toString(36).substring(7),
        text: inputMessage,
        createdAt: new Date(),
        user: {
          _id: 1,
        },
      },
    ];
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    setInputMessage(""); // Limpia el input después de enviar

    const userMessage = newMessages[0].text;
    
    setIsTyping(true);
    const responseFromIntents = getResponseFromIntents(userMessage);

    if (responseFromIntents) {
      setTimeout(() => {
        addBotMessage(responseFromIntents);
        setIsTyping(false);
      }, 1000);
    } else {
      const responseFromAPI = await handleGenericAPIRequest(userMessage);
      addBotMessage(responseFromAPI || 'Lo siento, no entendí eso. ¿Podrías reformular tu pregunta?');
      setIsTyping(false);
    }
  }, [inputMessage]);

  // Añade el mensaje del bot a la conversación
  const addBotMessage = (text) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, [
      {
        _id: Math.random().toString(36).substring(7),
        text,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: require('./images/bot.png'),
        },
      },
    ]));
  };

  // Busca una respuesta predefinida según la intención del mensaje del usuario
  const getResponseFromIntents = (message) => {
    for (const intent of intents.intents) {
      if (intent.patterns.some((pattern) => message.toLowerCase().includes(pattern))) {
        return intent.responses[Math.floor(Math.random() * intent.responses.length)];
      }
    }
    return null;
  };

  // Personaliza la burbuja de mensajes
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#0084ff',
            borderRadius: 15,
            padding: 5,
          },
          left: {
            backgroundColor: '#f0f0f0',
            borderRadius: 15,
            padding: 5,
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
          left: {
            color: '#000',
          },
        }}
      />
    );
  };

  // Personaliza el botón de envío, asegurando que funcione correctamente
  const renderSend = () => {
    return (
      <TouchableOpacity onPress={onSend} style={styles.sendButton}>
        <FontAwesome name="send" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };

  // Personaliza la barra de entrada de texto (InputToolbar) para que el botón de envío esté alineado con el input
  const renderInputToolbar = (props) => {
    return (
      <View style={styles.inputToolbar}>
        <View style={styles.inputContainer}>
          <FontAwesome name="pencil" size={24} color="#0084ff" style={styles.inputIcon} />
          <Composer
            {...props}
            textInputStyle={styles.composer}
            placeholder="Escribe tu mensaje aquí..."
            text={inputMessage}
            onTextChanged={text => setInputMessage(text)} // Actualiza el estado del inputMessage
          />
          {renderSend()}
        </View>
      </View>
    );
  };

  // Muestra el indicador de "escribiendo" del bot
  const renderFooter = () => {
    if (isTyping) {
      return (
        <View style={styles.typingContainer}>
          <ActivityIndicator size="small" color="#0084ff" />
          <Text style={styles.typingText}>El bot está escribiendo...</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: 1 }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderFooter={renderFooter}
          scrollToBottom
          scrollToBottomComponent={() => (
            <View style={styles.scrollToBottom}>
              <FontAwesome name="angle-double-down" size={24} color="#0b34b0" />
            </View>
          )}
          minInputToolbarHeight={70}
          isTyping={isTyping}
        />
      </KeyboardAvoidingView>

      {/* Modal de bienvenida */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showWelcome}
        onRequestClose={handleCloseWelcome}
      >
        <BlurView intensity={100} style={styles.modalContainer}>
          <Animatable.View 
            animation="zoomIn" 
            duration={500} 
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>Bienvenido a CUCEIUbicate!</Text>
            <LottieView
              ref={lottieRef}
              source={require('./images/Bot_animation.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
            <Text style={styles.modalText}>Soy tu asistente virtual, aquí para guiarte en el campus del CUCEI. ¿Listo para comenzar?</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleCloseWelcome}>
              <Text style={styles.modalButtonText}>Comenzar</Text>
            </TouchableOpacity>
          </Animatable.View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inputToolbar: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  composer: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#0084ff',
    borderRadius: 20,
    padding: 10,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 5,
  },
  typingText: {
    color: '#0084ff',
    marginLeft: 5,
    fontSize: 12,
  },
  scrollToBottom: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 5,
    marginRight: 10,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
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
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#192f6a',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#4c669f',
  },
  modalButton: {
    backgroundColor: '#0b34b0',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Chatbot;

import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import handleGenericAPIRequest from '../ChatBot/api';
import intents from '../ChatBot/intents.json';
import { Image, View, StyleSheet, Text } from 'react-native';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
        },
      },
    ]);
  }, []);

  const handleSend = useCallback(async (newMessages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

    const userMessage = newMessages[0].text;

    // Buscar en el intents.json
    const responseFromIntents = getResponseFromIntents(userMessage);

    if (responseFromIntents) {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          {
            _id: Math.random().toString(36).substring(7),
            text: responseFromIntents,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'Chatbot',
            },
          },
        ])
      );
    } else {
      // Si no encuentra respuesta en intents.json, consulta la API
      const responseFromAPI = await handleGenericAPIRequest(userMessage);

      if (responseFromAPI) {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [
            {
              _id: Math.random().toString(36).substring(7),
              text: responseFromAPI,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'Chatbot',
              },
            },
          ])
        );
      } else {
        // Si no hay respuesta de la API, puedes enviar un mensaje predeterminado
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [
            {
              _id: Math.random().toString(36).substring(7),
              text: 'Lo siento, no entendí eso.',
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'Chatbot',
              },
            },
          ])
        );
      }
    }
  }, []);

  const getResponseFromIntents = (message) => {
    for (const intent of intents.intents) {
      if (intent.patterns.some((pattern) => message.includes(pattern))) {
        const randomResponse = intent.responses[Math.floor(Math.random() * intent.responses.length)];
        return randomResponse;
      }
    }
    return null;
  };

  const renderMessage = (props) => {
    const isUser = props.currentMessage.user._id === 1; // Cambia el ID del usuario según tu lógica

    return (
      <View style={{ alignItems: isUser ? 'flex-end' : 'flex-start', marginVertical: 5 }}>
        <View style={[
          styles.messageBubble,
          { backgroundColor: isUser ? '#97a0a6' : '#76a8cf' } // Color negro para el usuario
        ]}>
          {!isUser && ( // Solo muestra la imagen si es el bot
            <Image 
              source={require('./images/bot.png')} // Ruta de la imagen
              style={styles.botImage}
            />
          )}
          <Text style={styles.messageText}>{props.currentMessage.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <GiftedChat 
      messages={messages} 
      onSend={(messages) => handleSend(messages)} 
      user={{ _id: 1 }} 
      renderMessage={renderMessage} // Usar renderMessage personalizado
    />
  );
};

const styles = StyleSheet.create({
  botImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageBubble: {
    borderRadius: 15,
    padding: 5,
    paddingRight: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    flexDirection: 'row', // Permite que la imagen y el texto se alineen
    alignItems: 'center',
    maxWidth: '80%', // Limita el ancho máximo de la burbuja
  },
  messageText: {
    color: '#FFF', // Color del texto para el mensaje del usuario
    flexWrap: 'wrap', // Permite que el texto se ajuste en varias líneas
    maxWidth: '70%', // Limita el ancho del texto dentro de la burbuja
  },
});

export default Chatbot;

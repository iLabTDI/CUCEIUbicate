import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  AppState,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const { width, height } = Dimensions.get('window');
const REAPPEAR_DELAY = 5 * 60 * 1000; // 5 minutes en minisegundos

export const ChatbotButton = () => {
  const navigation = useNavigation();
  const [showTooltip, setShowTooltip] = useState(true);
  const [showBot, setShowBot] = useState(true);
  const appState = useRef(AppState.currentState);
  const timer = useRef(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange); // Escucha los cambios de estado de la aplicación
    loadBotVisibility();

    return () => {
      subscription.remove(); // Elimina el listener
      if (timer.current) clearTimeout(timer.current); // Limpia el temporizador 
    };
  }, []);

  const handleAppStateChange = (nextAppState) => { 
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') { // Si la aplicación estaba en segundo plano y vuelve a estar activa
      resetBotVisibility();
    }
    appState.current = nextAppState; // Si la aplicación está en primer plano o en segundo plano 
  }; 

  const loadBotVisibility = async () => {
    try {
      const value = await AsyncStorage.getItem('@botVisibility'); // Obtiene el valor de la visibilidad del bot
      if (value !== null) {
        setShowBot(JSON.parse(value));
      }
    } catch (error) {
      console.error('Error loading bot visibility:', error);
    }
  };

  const resetBotVisibility = async () => {
    setShowBot(true);
    setShowTooltip(true);
    await AsyncStorage.removeItem('@botVisibility'); // Elimina el valor de la visibilidad del bot
  };

  const handlePress = () => {
    navigation.navigate('ChatbotScreen'); // Replace with your actual screen name
  };

  const dismissTooltip = () => {
    setShowTooltip(false); // Oculta el tooltip
  };

  const hideBot = async () => {
    setShowBot(false);
    try {
      await AsyncStorage.setItem('@botVisibility', JSON.stringify(false));
      
      // Set a timer to show the bot again after REAPPEAR_DELAY
      timer.current = setTimeout(() => {
        resetBotVisibility(); // Oculta el valor de la visibilidad del bot
      }, REAPPEAR_DELAY);
    } catch (error) {
      console.error('Error saving bot visibility:', error);
    }
  };

  if (!showBot) return null;

  return (
    <View style={styles.container}>
      {showTooltip && (
        <View style={styles.tooltip} >
          <Text style={styles.tooltipText} onPress={handlePress} >¡Hola! ¿Necesitas ayuda?</Text>
          <TouchableOpacity style={styles.closeTooltipButton} onPress={dismissTooltip}>
            <FontAwesomeIcon icon={faTimes} size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePress}>
          <Image
            source={require('../ChatBot/images/bot.png')}
            style={styles.chatbotIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={hideBot}>
          <FontAwesomeIcon icon={faTimes} size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: height * 0.05,
    right: width * 0.05,
    alignItems: 'flex-end',
    zIndex: 0,
  },
  buttonContainer: {
    backgroundColor: '#3498db',
    borderRadius: 30,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: -1,
  },
  chatbotIcon: {
    width: 50,
    height: 50,
  },
  tooltip: {
    backgroundColor: '#34495e',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    maxWidth: width * 0.7,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 20,
  },
  closeTooltipButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 5,
  },
  closeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
});

export default ChatbotButton;
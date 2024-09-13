import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, Modal, FlatList, StyleSheet,
  Animated, PanResponder, Dimensions, ScrollView
} from 'react-native';
import { GestureHandlerRootView, RectButton, PinchGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler';
import { useRoute } from "@react-navigation/native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const animalIcons = [
  { id: '1', uri: require('./Iconos_animales/abeja.png') },
  { id: '2', uri: require('./Iconos_animales/ajolote.png') },
  { id: '3', uri: require('./Iconos_animales/Conejo.png') },
  { id: '4', uri: require('./Iconos_animales/cucaracha.png') },
  { id: '5', uri: require('./Iconos_animales/elefante.png') },
  { id: '6', uri: require('./Iconos_animales/Leon.png') },
  { id: '7', uri: require('./Iconos_animales/tigre.png') },
  { id: '8', uri: require('./Iconos_animales/mono.png') },
];

const careerImages = {
  'INFO': require('./malla_informatica.jpg'),
};

export const ProfileScreen = () => {
  const route = useRoute();
  const { user } = route.params;
  const userData = Array.isArray(user) ? user[0] : user;
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [isCurriculumModalVisible, setCurriculumModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(userData.avatar);
  const [isExpanded, setIsExpanded] = useState(false);

  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: translateX, dy: translateY }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        // No resetting the position to allow persistent panning
      },
    })
  ).current;

  const pinchRef = useRef();
  const doubleTapRef = useRef();

  const handlePinch = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: false }
  );

  const handlePinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // No resetting the scale to allow persistent zoom
    }
  };

  const handleDoubleTap = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: false }),
      Animated.spring(translateX, { toValue: 0, useNativeDriver: false }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: false })
    ]).start();
  };

  useEffect(() => {
    loadSelectedIcon();
  }, []);

  const loadSelectedIcon = async () => {
    try {
      const savedIcon = await AsyncStorage.getItem('selectedIcon');
      if (savedIcon) {
        setSelectedIcon(JSON.parse(savedIcon));
      }
    } catch (error) {
      console.error('Error loading selected icon:', error);
    }
  };

  const saveSelectedIcon = async (icon) => {
    try {
      await AsyncStorage.setItem('selectedIcon', JSON.stringify(icon));
    } catch (error) {
      console.error('Error saving selected icon:', error);
    }
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const toggleCurriculumModal = () => {
    setCurriculumModalVisible(!isCurriculumModalVisible);
  };

  const handleAvatarChange = (newAvatar) => {
    setSelectedIcon(newAvatar);
    saveSelectedIcon(newAvatar);
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GestureHandlerRootView>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Información del Perfil</Text>
          </View>
          <View style={styles.content}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image source={selectedIcon} style={styles.avatar} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditMode(!isEditMode)} style={styles.editIcon}>
                <Text style={styles.editIconText}>✏️</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{userData.name} {userData.lastnames}</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}><Text style={styles.bold}>Usuario: </Text>@{userData.username}</Text>
              <Text style={styles.infoText}><Text style={styles.bold}>Código: </Text>{userData.code}</Text>
              <Text style={styles.infoText}><Text style={styles.bold}>Carrera: </Text>{userData.degree_code}</Text>
              <Text style={styles.infoText}><Text style={styles.bold}>Correo: </Text>{userData.email}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
          <Text style={styles.expandButtonText}>
            {isExpanded ? 'Ocultar Malla Curricular ▲' : 'Mostrar Malla Curricular ▼'}
          </Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <TouchableOpacity onPress={toggleCurriculumModal}>
              <Image
                source={careerImages[userData.degree_code]}
                style={styles.curriculumImage}
              />
            </TouchableOpacity>
          </View>
        )}

        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Selecciona un icono</Text>
              <FlatList
                data={animalIcons}
                renderItem={({ item }) => (
                  <RectButton onPress={() => handleAvatarChange(item.uri)} style={styles.iconButton}>
                    <Image source={item.uri} style={styles.iconImage} />
                  </RectButton>
                )}
                keyExtractor={item => item.id}
                numColumns={4}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isCurriculumModalVisible}
          onRequestClose={toggleCurriculumModal}
        >
          <View style={styles.curriculumModalOverlay}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={toggleCurriculumModal}
            >
              <FontAwesomeIcon icon={faTimes} size={24} color="#fff" />
            </TouchableOpacity>
            <TapGestureHandler
              ref={doubleTapRef}
              numberOfTaps={2}
              onActivated={handleDoubleTap}
            >
              <PinchGestureHandler
                ref={pinchRef}
                onGestureEvent={handlePinch}
                onHandlerStateChange={handlePinchStateChange}
              >
                <Animated.View {...panResponder.panHandlers}>
                  <Animated.Image
                    source={careerImages[userData.degree_code]}
                    style={[
                      styles.expandedCurriculumImage,
                      {
                        transform: [
                          { scale },
                          { translateX },
                          { translateY }
                        ]
                      }
                    ]}
                    resizeMode="contain"
                  />
                </Animated.View>
              </PinchGestureHandler>
            </TapGestureHandler>
          </View>
        </Modal>
      </GestureHandlerRootView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#0b34b0',
    padding: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#0b34b0',
  },
  editIcon: {
    position: 'absolute',
    right: -5,
    bottom: -8,
    backgroundColor: '#0b34b0',
    borderRadius: 15,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconText: {
    fontSize: 18,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0b34b0',
  },
  infoContainer: {
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
    color: '#0b34b0',
  },
  expandButton: {
    backgroundColor: '#0b34b0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  expandButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  expandedContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
  },
  curriculumImage: {
    width: 350,
    height: 300,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0b34b0',
  },
  iconButton: {
    margin: 8,
  },
  iconImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#0b34b0',
    borderRadius: 10,
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  curriculumModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedCurriculumImage: {
    width: windowWidth,
    height: windowHeight,
  },
  closeModalButton: {
    position: 'absolute',
    width: 35,
    height: 35,
    top: 70,
    right: 20,
    zIndex: 1,
  },
});

export default ProfileScreen;
import React, { useState, useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity, Modal, FlatList, StyleSheet,
  Animated, PanResponder, Dimensions, ScrollView
} from 'react-native';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import { useRoute } from "@react-navigation/native";

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
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        setTranslateX(prev => prev + gestureState.dx / scale);
        setTranslateY(prev => prev + gestureState.dy / scale);
      },
      onPanResponderGrant: () => {
        // Inicio del gesto
      },
      onPanResponderRelease: () => {
        // Fin del gesto
      },
    })
  ).current;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const toggleCurriculumModal = () => {
    setCurriculumModalVisible(!isCurriculumModalVisible);
  };

  const handleAvatarChange = (newAvatar) => {
    setSelectedIcon(newAvatar);
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
            <View style={styles.zoomControls}>
              <TouchableOpacity onPress={handleZoomIn} style={styles.zoomButton}>
                <Text style={styles.zoomButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleZoomOut} style={styles.zoomButton}>
                <Text style={styles.zoomButtonText}>-</Text>
              </TouchableOpacity>
            </View>
            <View {...panResponder.panHandlers}>
              <Image
                source={careerImages[userData.degree_code]}
                style={[
                  styles.curriculumImage,
                  {
                    transform: [
                      { scale: scale },
                      { translateX: translateX },
                      { translateY: translateY }
                    ]
                  }
                ]}
              />
            </View>
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
    backgroundColor: '#4a0e4e',
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
    borderColor: '#4a0e4e',
  },
  editIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    backgroundColor: '#4a0e4e',
    borderRadius: 15,
    width: 30,
    height: 30,
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
    color: '#4a0e4e',
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
    color: '#4a0e4e',
  },
  expandButton: {
    backgroundColor: '#4a0e4e',
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
  zoomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  zoomButton: {
    backgroundColor: '#4a0e4e',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  zoomButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  curriculumImage: {
    width: 300,
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
    color: '#4a0e4e',
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
    backgroundColor: '#4a0e4e',
    borderRadius: 10,
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
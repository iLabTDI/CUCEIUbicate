import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { Alert } from 'react-native';

const LoginScreen = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');

  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);

  const users = [
    { username: 'yair', password: 'admin' },
    { username: 'admin', password: 'admin' },
    { username: 'Admin', password: 'Admin' },
    { username: 'ADMIN', password: 'ADMIN' },
    // más usuarios
  ];

  const avatarOptions = [
    { source: require('../assets/Iconos_animales/ajolote.png') },
    { source: require('../assets/Iconos_animales/abeja.png') },
    { source: require('../assets/Iconos_animales/cangrejo.png') },
    { source: require('../assets/Iconos_animales/cucaracha.png') },
    { source: require('../assets/Iconos_animales/Tortuga.png') },
    { source: require('../assets/Iconos_animales/aguila.png') },
    { source: require('../assets/Iconos_animales/Conejo.png') },
    { source: require('../assets/Iconos_animales/coolcat.png') },
    { source: require('../assets/Iconos_animales/elefante.png') },
    { source: require('../assets/Iconos_animales/Leon.png') },
    { source: require('../assets/Iconos_animales/mono.png') },
    { source: require('../assets/Iconos_animales/vaca.png') },
    { source: require('../assets/Iconos_animales/tigre.png') },
    { source: require('../assets/Iconos_animales/oveja.png') },
    { source: require('../assets/Iconos_animales/perro.png') }
  ];

  const colorOptions = [
    // Amarillos     Azules    Morados    Verdes     Rosas     Negros
    '#FFFF00',  '#3498db', '#8A2BE2', '#2ecc71','#FF69B4', '#000000', 
    
    '#FFD700',  '#0074e4', '#9400D3', '#008000','#FF1493', '#111111',
  
    '#FFA500',  '#0056b3', '#6A5ACD', '#00FF00','#FFC0CB', '#333333',
  
    '#FFC300',  '#1e90ff', '#8B008B', '#32CD32','#FF91A4', '#555555',
  ];

  const handleLogin = () => {
    // Obtener el valor ingresado por el usuario en el campo de usuario y contraseña
    const adminUsername = username;
    const adminPassword = password;

    // Comprobar si el usuario y la contraseña coinciden con las credenciales de administrador
    const isAdmin = users.some(user => user.username === adminUsername && user.password === adminPassword);
    if (isAdmin) {
      // Inicio de sesión como administrador
      setLoggedIn(true);
    // } else {
      // // Credenciales incorrectas o no es un administrador
      // Alert.alert(
        // 'Error de Inicio de Sesión',
        // 'Usuario o Contraseña incorrectos.\nPor favor, intenta nuevamente.',
        // {
          // text: 'Aceptar',
        // },
      // );
    }
  };

  const handleLogout = () => {
    // Cerrar sesión al cambiar el estado a "deslogueado"
    setLoggedIn(false);
    setUsername('');
    setPassword('');
    setSelectedAvatar(null);
    setSelectedColor('#FFFFFF');
  };

  const handleMain = () => {
    
  };


  const selectAvatar = (avatarIndex) => {
    setSelectedAvatarIndex(avatarIndex);
  };

  const selectColor = (colorIndex) => {
    setSelectedColorIndex(colorIndex);
  };

  const handleAcceptAvatar = () => {
    // Aplicar los cambios de avatar y color
    if (selectedAvatarIndex !== null && selectedColorIndex !== null) {
      setSelectedAvatar(avatarOptions[selectedAvatarIndex].source);
      setSelectedColor(colorOptions[selectedColorIndex]);
    }

    // Cerrar el modal
    setAvatarModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        {loggedIn ? (
          <View>
            <Text style={styles.welcomeText}>¡Bienvenido, {username}!</Text>
            {selectedAvatar ? (
              <View style={styles.avatarContainer}>
                <View style={[styles.avatarCircle, { backgroundColor: selectedColor }]}>
                  <Image source={selectedAvatar} style={styles.avatar} />
                </View>
              </View>
            ) : null}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#0b34b0" }]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity onPress={() => setAvatarModalVisible(true)}>
              <View style={styles.avatarContainer}>
                {selectedAvatar ? (
                  <View style={[styles.avatarCircle, { backgroundColor: selectedColor }]}>
                    <Image source={selectedAvatar} style={styles.avatar} />
                  </View>
                ) : (
                  <View style={styles.avatarPlaceholder} />
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.label}>Correo Electrónico:</Text>
            <TextInput
              style={styles.input}
              placeholder="alumno@Cucei.com"
              value={username}
              onChangeText={(text) => setUsername(text)}
            />

            <Text style={styles.label}>Contraseña:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese su contraseña"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#0b34b0" }]}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Modal
        visible={avatarModalVisible}
        animationType="slide"
        transparent={true}
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Tu Avatar</Text>
            <View style={styles.avatarGrid}>
              {avatarOptions.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectAvatar(index)}
                  style={styles.avatarOptionContainer}
                >
                  <View style={[
                    styles.avatarCircle,
                    selectedAvatarIndex === index ? { opacity: 0.5 } : null,
                    { backgroundColor: selectedColor }
                  ]}>
                    <Image source={avatar.source} style={styles.avatarOption} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.modalTitle}>Seleccionar Color de Fondo</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectColor(index)}
                  style={styles.colorOptionContainer}
                >
                  <View style={[
                    styles.colorOption,
                    selectedColorIndex === index ? { opacity: 0.5 } : null,
                    { backgroundColor: color }
                  ]}></View>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleAcceptAvatar}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4EDF9', // Color de fondo
  },
  loginBox: {
    width: '80%',
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black', // Color del borde de los campos de texto
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center', // Centrar verticalmente
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: 'lightgray',
    borderRadius: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center', // Centrar verticalmente en la mitad de la pantalla
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingTop: 50, // Establecer una altura máxima del 50% de la pantalla
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  avatarOptionContainer: {
    width: '26%',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarOption: {
    width: 60,
    height: 65,
    borderRadius: 60,
  },
  colorGrid: {
    flexDirection:'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorOptionContainer: {
    width: '16.666%', // 6 colores por fila
    alignItems: 'center',
    marginBottom: 12},
    
    colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  closeButton: {
    backgroundColor: "#0b34b0",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  modalContent: {
    backgroundColor: 'gray',
    width: '99%', // Ancho del modal aumentado
    borderRadius: 15,
    padding: 30,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: "#0b34b0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;

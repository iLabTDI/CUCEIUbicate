import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';
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

  const colorOptions = ['#FF0000', '#3498db', '#2ecc71', '#FFA500', '#FFD700', '#8B4513', '#808080'];

  const handleLogin = () => {
    // Obtener el valor ingresado por el usuario en el campo de usuario y contraseña
    const adminUsername = username;
    const adminPassword = password;

    // Comprobar si el usuario y la contraseña coinciden con las credenciales de administrador
    const isAdmin = users.some(user => user.username === adminUsername && user.password === adminPassword);
    if (isAdmin) {
      // Inicio de sesión como administrador
      setLoggedIn(true);
    } else {
      // Credenciales incorrectas o no es un administrador
      Alert.alert(
        'Error de Inicio de Sesión',
        'Usuario o Contraseña incorrectos.\nPor favor, intenta nuevamente.',
        {
          text: 'Aceptar',
        },
      );

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
                <Image source={selectedAvatar} style={[styles.avatar, { backgroundColor: selectedColor }]} />
              </View>
            ) : null}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "green" }]}
              onPress={handleAcceptAvatar}
            >
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
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
                  <Image source={selectedAvatar} style={[styles.avatar, { backgroundColor: selectedColor }]} />
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
      <Modal visible={avatarModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Tu Avatar</Text>
            <View style={styles.avatarGrid}>
              {avatarOptions.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectAvatar(index)}
                >
                  <Image source={avatar.source} style={[
                    styles.avatarOption,
                    selectedAvatarIndex === index ? { opacity: 0.5 } : null,
                  ]} />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.modalTitle}>Seleccionar Color de Fondo</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectColor(index)}
                >
                  <View style={[
                    styles.colorOption,
                    selectedColorIndex === index ? { opacity: 0.5 } : null,
                    { backgroundColor: color }
                  ]}></View>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.closeButton}>
              <Text style={styles.buttonText} onPress={handleAcceptAvatar}>Aceptar</Text>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'black', // Color del borde del avatar
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
    // paddingTop: 100 // Establecer una altura máxima del 80% de la pantalla
  },

  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderRadius: 5
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  closeButton: {
    backgroundColor: "#0b34b0",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
  },

  modalContent: {
    backgroundColor: 'gray',
    width: '80%',
    borderRadius: 15,
    padding: 15
  },

  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },

  avatarOption: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginHorizontal: 4,
    marginVertical: 10,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 5,
    marginVertical: 10,
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

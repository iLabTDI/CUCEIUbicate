import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const users = [
    { username: 'yair', password: 'admin' },
    { username: 'admin', password: 'admin' },
    { username: 'Admin', password: 'Admin' },
    { username: 'ADMIN', password: 'ADMIN' },
    // más usuarios
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
      navigation.navigate('Inicio'); // Cambia 'Inicio' al nombre de tu pantalla de inicio
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
    // Puedes agregar aquí la lógica para restablecer las selecciones de avatar y color si es necesario
  };

  const handleRegister = () => {
    // Navegar a la pantalla de registro
    navigation.navigate('Registro'); // Cambia 'Registro' al nombre de tu pantalla de registro
  };

  return (
    
    <View style={styles.container}>
    <Image source={require('../assets/logo2.png')} style={styles.logo} />
      <View style={styles.iconCircle}>
        <Icon name="user" size={50} color="#0b34b0" style={styles.icon} />
      </View>
      
      <View style={styles.loginBox}>
        {loggedIn ? (
          <View>
            {/* Contenido para usuario logueado */}
            <Text style={styles.welcomeText}>¡Bienvenido, {username}!</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "green" }]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {/* Contenido para usuario no logueado */}
            <Text style={styles.label}>Correo Electrónico:</Text>
            <TextInput
              style={styles.input}
              placeholder="alumno@Cucei.com"
              onChangeText={text => setUsername(text)}
            />
            <Text style={styles.label}>Contraseña:</Text>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity onPress={handleLogin}>
              <View style={styles.loginButton}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loginBox: {
    width: '80%',
    height: 'auto',
    backgroundColor: 'white',
    padding: 35,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  loginButton: {
    backgroundColor: '#0b34b0',
    borderRadius: 10,
    paddingVertical: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0b34b0',
    textDecorationLine: 'underline', // Establece el texto como un hipervínculo
    textAlign: 'center', // Centra el texto horizontalmente
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  iconCircle: {
    backgroundColor: 'white',
    borderRadius: 60,
    width: 85,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -25, // Ajusta la posición vertical del círculo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1, // Coloca el circulo por encima de otros elementos
  },

  logo: { 
    marginTop: -150,
    marginBottom: 50,
    width: 400,
    height: 200,
  }
  
  
});

export default HomeScreen;
































/*import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    // Navegar a la pantalla de inicio de sesión
    navigation.navigate('Iniciar Sesión');
  };

  const handleRegistration = () => {
    // Navegar a la pantalla de registro
    navigation.navigate('Registro');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo2.png')} style={styles.logo} />
      <Text style={styles.title}>Inicia sesión o regístrate para continuar.</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonBox}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonBox}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegistration}
          >
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E8FA', // Color de fondo
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 60,
  },
  buttonContainer: {
    flexDirection: 'row', // Para alinear los botones en una fila
  },
  buttonBox: {
    backgroundColor: '#0b34b0',
    borderRadius: 10,
    marginHorizontal: 10, // Espacio horizontal entre los botones
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
*/
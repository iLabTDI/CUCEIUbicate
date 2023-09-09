import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de reemplazar 'FontAwesome' por el nombre de la fuente de iconos que estás utilizando
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = () => {
    // Aquí puedes agregar la lógica para registrar al usuario
    // Por ahora, solo marcamos el registro como completo
    setIsRegistered(true);
  };

  const navigation = useNavigation(); // Obtene la propiedad navegación

  const handleCompleteProfile = () => {
    // Aquí puedes redirigir al usuario a la pantalla de "CompleteProfileScreen"
    // Puedes usar la navegación de tu aplicación para hacer esto.
    navigation.navigate('Completar Perfil');
  };

  return (
    <View style={styles.container}>
      {isRegistered ? (
        <View>
          <Text style={styles.registerCompleteText}>Registro exitoso. ¡Bienvenido, {email}! :D</Text>
          <TouchableOpacity style={styles.completeProfileButton} onPress={handleCompleteProfile}>
            <Text style={styles.buttonText}>Completar Perfil</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.label}>Correo Electrónico: </Text>
          <TextInput
            style={styles.input}
            placeholder="alumno@cucei.com"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <Text style={styles.label}>Contraseña:</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Ingresa tu contraseña"
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordToggle}>
              <Icon
                name={showPassword ? 'eye-slash' : 'eye'}
                size={18}
                color="blue" // Puedes personalizar el color del icono aquí
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar Contraseña:</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            secureTextEntry={!showPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />

          <TouchableOpacity style={styles.customButton} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      )}
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
  label: {
    fontSize: 16,
    marginTop: 10,
    width: 200, // Tamaño fijo para las etiquetas
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
    width: 200, // Tamaño fijo para las cajas de texto
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 15,
    width: 200, // Tamaño fijo para el contenedor de contraseña
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  passwordToggle: {
    padding: 10,
  },
  registerCompleteText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  customButton: {
    marginTop: 15,
    backgroundColor: '#0b34b0',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeProfileButton: {
    marginTop: 15,
    backgroundColor: '#0b34b0',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default RegisterScreen;

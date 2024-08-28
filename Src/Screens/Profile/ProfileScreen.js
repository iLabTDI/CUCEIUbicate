// Screens/ProfileScreen.js
import React from 'react';
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, StyleSheet } from 'react-native';

export const ProfileScreen = () => {
  const route = useRoute();
  const { user } = route.params;
  const userData = Array.isArray(user) ? user[0] : user;
  return (
    <View style={styles.container}>
      {/*  consumiendo datos de la bdd aplicar estilos y el front */}
      <Text style={styles.header}>Información del Perfil</Text>
      <Text style={styles.header}>Usuario: @{userData.username}</Text>
      <Text style={styles.header}>Nombre: {userData.name} {userData.lastnames}</Text>
      <Text style={styles.header}>Código de estudiante: {userData.code}</Text>
      <Text style={styles.header}>Carrera: {userData.degree_code}</Text>
      <Text style={styles.header}>Correo: {userData.email}</Text>
      {/* Añadir más detalles del perfil aquí */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});



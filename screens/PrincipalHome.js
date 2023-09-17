import { useRoute } from '@react-navigation/native'; // Importa el hook de ruta
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PrincipalHomeScreen = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const route = useRoute(); // Obtén la instancia de ruta

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Icon name={menuOpen ? 'close' : 'menu'} size={30} color="white" />
        </TouchableOpacity>

        {menuOpen && (
          <View style={styles.menu}>
            {/* Aquí puedes colocar los elementos de tu menú */}
            <Text>Opción 1</Text>
            <Text>Opción 2</Text>
            <Text>Opción 3</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   // marginTop: '10%', // Mueve el componente un 20% desde la parte superior
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'blue',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 150,
    padding: 10,
  },
});

export default PrincipalHomeScreen;

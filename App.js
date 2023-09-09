import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/login';
import RegistrationScreen from './screens/register';
//import CompleteProfileScreen from './complete_profile';

const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle: {
    backgroundColor: '#F5FCFF', // Color de fondo de la barra de navegación
  },
  headerTintColor: '#000', // Color del texto de la barra de navegación
  headerBackTitleVisible: true, // Muestra el boton de regreso con el titulo "SOLO PARA IOS"
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Inicio"
        screenOptions={globalScreenOptions} // Aplica el estilo global a todas las pantallas
      >
        <Stack.Screen
          name="Inicio"
          component={HomeScreen}
          options={{
          title: 'Inicio', // Cambiar el titulo de la barra
          }}
        />
        <Stack.Screen
          name="Iniciar Sesión"
          component={LoginScreen}
          options={{
          title: 'Iniciar Sesión',
          }}
        />
        <Stack.Screen
          name="Registro"
          component={RegistrationScreen}
          options={{
          title: 'Registro',
         }}
      />

      {/*Aqui van las diferentes pantallas restantes*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;


/*
    <Stack.Screen
   name="Completar Perfil"
   component={CompleteProfileScreen}
   options={{
   title: 'Completar Perfil',
  }}
/>
  */
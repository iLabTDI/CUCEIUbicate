import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen'; 
import RegistrationScreen from './screens/registerScreen'; 
import CompleteProfileScreen from './screens/complete_profile'; 
import PrincipalHomeScreen from './screens/PrincipalHome'; 
import RegisterScreen from './screens/registerScreen';
import { View } from 'react-native-animatable';

const Stack = createNativeStackNavigator();

function App() {
  return (

  //   //para editar cada pantalla

  //   <NavigationContainer>
  //   <CompleteProfileScreen/>

  //   <Stack.Navigator initialRouteName="Inicio">
  //     <Stack.Screen
  //      name="Inicio"
  //      component={HomeScreen}
  //       options={{ title: 'Inicio', headerShown: false }}
  //    />
  // </Stack.Navigator>
  // </NavigationContainer>



    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen
          name="Inicio"
          component={HomeScreen}
          options={{ title: 'Inicio', headerShown: false }} // Oculta la barra de navegación
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Iniciar Sesión' }}
        />
        <Stack.Screen
          name="Registro"
          component={RegistrationScreen}
          options={{ title: 'Registro' }}
        />
        <Stack.Screen
          name="Completar Perfil"
          component={CompleteProfileScreen}
          options={{ title: 'Completar Perfil' }}
        />
        <Stack.Screen
          name="Principal Home"
          component={PrincipalHomeScreen}
          options={{
            headerShown: false 
            }
          }
        />
      </Stack.Navigator>
    </NavigationContainer>
   );
 }
export default App;

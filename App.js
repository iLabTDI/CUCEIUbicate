import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomePage } from './Screens/HomePage';
// import { LoginScreen } from './Screens/Components/LoginScreen'; 
// import { RegisterScreen } from './Screens/Components/RegisterScreen'; 
// import { CompleteProfile } from './Screens/Components/CompleteProfile';
// import { View } from 'react-native-animatable';

const Stack = createNativeStackNavigator();

function App() {
  return (

    //para editar cada pantalla

    <NavigationContainer>
     <HomePage/> 
   </NavigationContainer> 

    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Inicio">
    //     <Stack.Screen
    //       name="Inicio"
    //       component={LoginScreen}
    //       options={{ title: 'Inicio', headerShown: false }} // Oculta la barra de navegación
    //     />
    //     <Stack.Screen
    //       name="Login"
    //       component={LoginScreen}
    //       options={{ title: 'Iniciar Sesión' }}
    //     />
    //     <Stack.Screen
    //       name="Registro"
    //       component={RegisterScreen}
    //       options={{ title: 'Registro' }}
    //     />
    //     <Stack.Screen
    //       name="Completar Perfil"
    //       component={CompleteProfile}
    //       options={{ title: 'Completar Perfil' }}
    //     />
    //     <Stack.Screen
    //       name="Principal Home"
    //       component={HomePage}
    //       options={{
    //         headerShown: false 
    //         }
    //       }
    //     />
    //   </Stack.Navigator>
    // </NavigationContainer>
   );
 }
export default App;

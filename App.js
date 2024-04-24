import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./auth/LoginScreen";
import { CompleteProfile } from "./auth/CompleteProfile";
import { RegisterScreen } from "./auth/RegisterScreen";
import { MyDrawer } from "./Components/NavBar";
import { setRandomFallback } from 'bcryptjs';
import { getRandomBase64 } from 'react-native-get-random-values';

const Stack = createNativeStackNavigator();

setRandomFallback(getRandomBase64);

function App() {
  return (
    //para editar cada pantalla

    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>

    // <NavigationContainer>
    //   <Stack.Navigator initialRouteName="Inicio">
    //     <Stack.Screen
    //       name="Inicio"
    //       component={LoginScreen}
    //       options={{ title: "Inicio", headerShown: false }} // Oculta la barra de navegación
    //     />
    //     <Stack.Screen
    //       name="Login"
    //       component={LoginScreen}
    //       options={{ title: "Iniciar Sesión" }}
    //     />
    //     <Stack.Screen
    //       name="Registro"
    //       component={RegisterScreen}
    //       options={{ title: "Registro" }}
    //     />
    //     <Stack.Screen
    //       name="Completar Perfil"
    //       component={CompleteProfile}
    //       options={{ title: "Completar Perfil" }}
    //     />
    //     <Stack.Screen
    //       name="Principal Home"
    //       component={MyDrawer}
    //       options={{
    //         headerShown: false,
    //       }}
    //     />
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
}
export default App;

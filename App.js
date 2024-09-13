import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./Src/auth/LoginScreen";
import { CompleteProfile } from "./Src/auth/CompleteProfile";
import { RegisterScreen } from "./Src/auth/RegisterScreen";
import { MyDrawer } from "./Src/Screens/Home/Components/SearchBarsComponent/MyDrawer";
import { setRandomFallback } from "bcryptjs";
import { getRandomBase64 } from "react-native-get-random-values";
import { StatusBar, Platform } from "react-native";

const Stack = createNativeStackNavigator();

setRandomFallback(getRandomBase64);

function App() {
  return (
    //para editar cada pantalla

  //   <NavigationContainer>
  //        <StatusBar //Barra de estaco dolor negra
  //         backgroundColor="#333"
  //         barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
  //       />
  //   <Stack.Navigator>
      
  //     <Stack.Screen
  //       name="Drawer"
  //       component={MyDrawer}
  //       options={{ headerShown: false }} // Oculta el header del stack si no lo necesitas
  //     />
  //   </Stack.Navigator>
  // </NavigationContainer>
    // <NavigationContainer>
    // <StatusBar //Barra de estaco dolor negra
    //     backgroundColor="#333"
    //     barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
    //   />
    //   <MyDrawer />
    // </NavigationContainer>

    <NavigationContainer>
        <StatusBar //Barra de estaco dolor negra
          backgroundColor="#333"
          barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
        />
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen
          name="Inicio"
          component={LoginScreen}
          options={{ title: "Inicio", headerShown: false }} // Oculta la barra de navegación
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Iniciar Sesión" }}
        />
        <Stack.Screen
          name="Registro"
          component={RegisterScreen}
          options={{ title: "Registro" }}
        />
        <Stack.Screen
          name="Completar Perfil"
          component={CompleteProfile}
          options={{ title: "Completar Perfil" }}
        />
        <Stack.Screen
          name="Principal Home"
          component={MyDrawer}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;

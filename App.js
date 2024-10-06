import React, { useState, useEffect } from "react";
import { StatusBar, Platform, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./Src/auth/LoginScreen";
import { CompleteProfile } from "./Src/auth/CompleteProfile";
import { RegisterScreen } from "./Src/auth/RegisterScreen";
import { MyDrawer } from "./Src/Screens/Home/Components/SearchBarsComponent/MyDrawer";
import { OnboardingScreen } from "./Src/auth/OnboardingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

function App() {
  // Estado para determinar si es el primer lanzamiento de la aplicación
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  // useEffect para cargar el estado del onboarding
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem("@onboarding_completee");
        setIsFirstLaunch(value == null); // Si el valor es null, es el primer lanzamiento
      } catch (error) {
        console.error("Error al verificar el estado de onboarding:", error);
      }
    };
    checkFirstLaunch();
  }, []);

  // Si el estado es null, la aplicación está cargando (muestra una pantalla de carga)
  if (isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* Barra de estado para indicar el estado de la aplicación */}
      <StatusBar
        backgroundColor="#000000"
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
      />
      <Stack.Navigator>
        {/* Mostrar el onboarding solo si es el primer lanzamiento */}
        {isFirstLaunch && (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }} // Ocultar el header en el onboarding
          />
        )}
        {/* Pantalla de Login */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Ocultar el header en la pantalla de login
        />
        {/* Pantalla de Registro */}
        <Stack.Screen
          name="Registro"
          component={RegisterScreen}
          options={{ headerShown: true, title: "Registro" }} // Mostrar header con el título "Registro"
        />
        {/* Pantalla para completar el perfil del usuario */}
        <Stack.Screen
          name="Completar Perfil"
          component={CompleteProfile}
          options={{ headerShown: true, title: "Completar Perfil" }} // Mostrar header con el título "Completar Perfil"
        />
        {/* Pantalla principal */}
        <Stack.Screen
          name="Principal Home"
          component={MyDrawer}
          options={{ headerShown: false }} // Ocultar el header en la pantalla principal
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

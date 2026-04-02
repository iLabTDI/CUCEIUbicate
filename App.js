import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useState, useEffect } from "react";
import { StatusBar, Platform, View, Dimensions, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./Src/auth/LoginScreen";
import { CompleteProfile } from "./Src/auth/CompleteProfile";
import { RegisterScreen } from "./Src/auth/RegisterScreen";
import { MyDrawer } from "./Src/Screens/Home/Components/SearchBarsComponent/MyDrawer";
import { OnboardingScreen } from "./Src/auth/OnboardingScreen";
import { getSession } from "./Src/auth/SessionManager"; 
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from 'react-native';
import { SplashScreen } from "./Src/components/SplashScreen";

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get('window');

LogBox.ignoreLogs([
  "[Reanimated] Reading from `value` during component render. Please ensure that you do not access the `value` property or use `get` method of a shared value while React is rendering a component.",
  "Using Math.random is not cryptographically secure! Use bcrypt.setRandomFallback to set a PRNG."
]);

const originalConsoleWarn = console.warn;
console.warn = (message, ...args) => {
  if (typeof message === 'string' && message.includes('[Reanimated]')) {
    return;
  }
  originalConsoleWarn(message, ...args);
};

LogBox.ignoreLogs(["Reanimated"]);

// ✨ FUNCIÓN PRINCIPAL DE LA APP SIN ERRORES
function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userSession, setUserSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    checkAppState();
  }, []);

  // ✨ FUNCIÓN SÚPER COMPLETA QUE VERIFICA TODO
  const checkAppState = async () => {
    try {
      console.log('🔍 Verificando estado de la app...');
      
      // 1. Verificar onboarding PRIMERO antes que sesión
      const onboardingCompleted = await AsyncStorage.getItem("@onboarding_completed");
      console.log('📱 Onboarding completado:', onboardingCompleted);
      
      // Si es primera vez (onboarding null), mostrar onboarding SIN importar la sesión
      if (onboardingCompleted === null) {
        console.log('🎯 Primera vez - mostrando onboarding');
        setIsFirstLaunch(true);
        setIsLoggedIn(false);
        return; // ✨ SALIR AQUÍ PARA MOSTRAR ONBOARDING
      }
      
      // 2. Solo después verificar sesión si ya completó onboarding
      const session = await getSession();
      console.log('👤 Sesión encontrada:', session ? 'SÍ' : 'NO');
      
      if (session) {
        console.log('✅ Usuario logueado:', session.username || session.name);
        setUserSession(session);
        setIsLoggedIn(true);
        setIsLoginSuccess(true);
        setIsFirstLaunch(false);
      } else {
        console.log('🔐 No hay sesión - ir a login');
        setIsLoggedIn(false);
        setIsFirstLaunch(false);
      }
      
    } catch (error) {
      console.error("🚨 Error verificando estado de la app:", error);
      // En caso de error, asumir primera vez para mostrar onboarding
      setIsFirstLaunch(true);
      setIsLoggedIn(false);
    }
  };

  // ✨ FUNCIÓN PARA MANEJAR CUANDO TERMINA EL SPLASH
  const handleSplashComplete = () => {
    console.log('🎯 Splash completado - ocultando splash screen');
    setShowSplash(false);
    setIsLoading(false);
  };

  // ✨ MOSTRAR SPLASH SCREEN HERMOSO SEPARADO - SIEMPRE PRIMERO
  if (showSplash) {
    return (
      <SplashScreen 
        isLoginSuccess={isLoginSuccess} 
        onAnimationComplete={handleSplashComplete}
      />
    );
  }

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor="#000000"
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
      />
      <View style={[styles.container, { width: width, alignSelf: 'center' }]}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          {/* ✨ FLUJO CORREGIDO - ONBOARDING TIENE MÁXIMA PRIORIDAD */}
          {isFirstLaunch === true ? (
            // 🎯 Primera vez SIEMPRE -> Onboarding (sin importar si tiene sesión)
            <Stack.Group>
              <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Registro"
                component={RegisterScreen}
                options={{ headerShown: true, title: "Registro" }}
              />
              <Stack.Screen
                name="Completar Perfil"
                component={CompleteProfile}
                options={{ headerShown: true, title: "Completar Perfil" }}
              />
              <Stack.Screen
                name="Principal Home"
                component={MyDrawer}
                options={{ headerShown: false }}
              />
            </Stack.Group>
          ) : isLoggedIn === true ? (
            // ✅ Ya vio onboarding Y tiene sesión -> Home directo
            <Stack.Screen
              name="Principal Home"
              component={MyDrawer}
              options={{ headerShown: false }}
              initialParams={{ user: userSession }}
            />
          ) : isLoggedIn === false ? (
            // 🔐 Ya vio onboarding pero NO tiene sesión -> Login
            <Stack.Group>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Registro"
                component={RegisterScreen}
                options={{ headerShown: true, title: "Registro" }}
              />
              <Stack.Screen
                name="Completar Perfil"
                component={CompleteProfile}
                options={{ headerShown: true, title: "Completar Perfil" }}
              />
              <Stack.Screen
                name="Principal Home"
                component={MyDrawer}
                options={{ headerShown: false }}
              />
            </Stack.Group>
          ) : (
            // 🔄 Estado de carga (fallback mientras se determina el estado)
            <Stack.Screen
              name="Loading"
              component={() => <SplashScreen isLoginSuccess={false} onAnimationComplete={() => {}} />}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default App;
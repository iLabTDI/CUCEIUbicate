import React, { useState, useEffect } from "react";
import { StatusBar, Platform, View, ActivityIndicator, Dimensions, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./Src/auth/LoginScreen";
import { CompleteProfile } from "./Src/auth/CompleteProfile";
import { RegisterScreen } from "./Src/auth/RegisterScreen";
import { MyDrawer } from "./Src/Screens/Home/Components/SearchBarsComponent/MyDrawer";
// import { OnboardingScreen } from "./Src/auth/OnboardingScreen";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from 'react-native';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');
  // const MAX_WIDTH = 950; // Define el ancho máximo para limitar el tamaño de la aplicación

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


function App() {
  // const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  // useEffect(() => {
  //   const checkFirstLaunch = async () => {
  //     try {
  //       const value = await AsyncStorage.getItem("@onboarding_completeed");
  //       setIsFirstLaunch(value == null);
  //     } catch (error) {
  //       console.error("Error al verificar el estado de onboarding:", error);
  //     }
  //   };
  //   checkFirstLaunch();
  // }, []);

  // if (isFirstLaunch === null) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size={24} color="#000000" />
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor="#000000"
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
      />
      <View style={[styles.container, { width: width, alignSelf: 'center' }]}>
        <Stack.Navigator>
          {/* {isFirstLaunch && (
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
          )} */}
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
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Fondo negro para los márgenes
  },
});

export default App;

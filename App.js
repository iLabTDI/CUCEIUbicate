import 'react-native-gesture-handler';
import React, { useState, useEffect } from "react";
import { StatusBar, Platform, View, Dimensions, StyleSheet, LogBox } from "react-native";
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

const getInitialRoute = async () => {
  const onboardingDone = await AsyncStorage.getItem("@onboarding_completed");

  if (!onboardingDone) return { route: "Onboarding", user: null };

  const session = await getSession();
  if (session) return { route: "Principal Home", user: session };

  return { route: "Login", user: null };
};

function App() {
  const [initialRoute, setInitialRoute] = useState(null); // null = cargado
  const [initialUser, setInitialUser] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    getInitialRoute().then(({ route, user }) => {
      setInitialRoute(route);
      setInitialUser(user);
      setLoginSuccess(route === "Principal Home");
    })
  }, []);

  if (showSplash) {
    return (
      <SplashScreen
        isLoginSuccess={loginSuccess}
        onAnimationComplete={() => setShowSplash(false)}
      />
    );
  }

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor="#000000"
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
      />
      <View style={styles.container}>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
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
            initialParams={{ user: initialUser }}
          />
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
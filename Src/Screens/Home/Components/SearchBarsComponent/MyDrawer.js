import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMap,
  faUser,
  faBars,
  faRadio,
  faFaceSmile,
  faUserFriends,
  faMedkit,
  faSchool,
  faBookBookmark,
  faNewspaper,
  faFolder,
  faHandsHelping,
  faRobot,
  faSignOutAlt,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { HomePage } from "../../HomePage";
import { Directory } from "../../../community/Directory";
import { Articles } from "../../../community/Articles";
import { CUCEI_radio } from "../../../Education/CUCEI_radio";
import { Facial_recognition } from "../../../ScolarServices/Facial_recognition";
import { Medical_services } from "../../../ScolarServices/Medical_services";
import { Scholarships } from "../../../Education/Scholarships";
import { School_services } from "../../../ScolarServices/School_services";
import { Social_service } from "../../../ScolarServices/Social_service";
import { ProfileScreen } from "../../../Profile/ProfileScreen";
import { CID } from "../../../ScolarServices/CID";
import { Chatbot } from "../../../ChatBot/Chatbot";
import { clearSession } from "../../../../auth/SessionManager";

// Crea el Drawer
const Drawer = createDrawerNavigator();
const { width, height } = Dimensions.get("window");

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, cerrar sesión", onPress: confirmLogout },
      ]
    );
  };

  const confirmLogout = () => {
    // Aquí pones tu lógica de limpiar sesión
    clearSession();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleHelp = () => {
    Alert.alert(
      "Ayuda",
      "Para asistencia, contacta al soporte o visita el centro de ayuda.",
      [{ text: "Entendido" }]
    );
  };

  return (
    <View style={styles.drawerContainer}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
          <Animated.View entering={FadeInDown.duration(800)} style={styles.drawerHeaderContainer}>
            <LinearGradient
              colors={["#0b34b0", "#267bee"]}
              style={styles.drawerHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../../../../assets/images/Logo_Cucei.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.drawerHeaderText}>CUCEI UBICATE</Text>
              <View style={styles.versionContainer}>
                <Text style={styles.versionText}>v1.0.0</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(800)} style={styles.drawerItemsContainer}>
            <DrawerItemList {...props} />
          </Animated.View>
        </DrawerContentScrollView>
      </ScrollView>

      <Animated.View entering={FadeInUp.duration(800).delay(400)} style={styles.bottomContainer}>
        <DrawerItem
          label="Ayuda"
          onPress={handleHelp}
          icon={({ color, size }) => (
            // Ícono más pequeño (size=18), en color azul
            <FontAwesomeIcon icon={faQuestionCircle} size={18} color="#0b34b0" />
          )}
          labelStyle={styles.bottomDrawerLabel}
          style={styles.bottomDrawerItem}
        />
        <View style={styles.separator} />
        <DrawerItem
          label="Cerrar Sesión"
          onPress={handleLogout}
          icon={({ color, size }) => (
            // Ícono más pequeño (size=18), en color rojo
            <FontAwesomeIcon icon={faSignOutAlt} size={18} color="#d32f2f" />
          )}
          labelStyle={[styles.bottomDrawerLabel, styles.logoutLabel]}
          style={styles.bottomDrawerItem}
        />
      </Animated.View>
    </View>
  );
};

const DrawerHeaderButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuIcon} activeOpacity={0.7}>
      <FontAwesomeIcon icon={faBars} size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const HeaderWithIcon = ({ title, icon }) => (
  <View style={styles.header}>
    <FontAwesomeIcon icon={icon} size={24} color="#FFFFFF" />
    <Text style={styles.headerText}>{title}</Text>
  </View>
);

export const MyDrawer = () => {
  const route = useRoute();
  const { user } = route.params;

  return (
    <Drawer.Navigator
      initialRouteName="Mapa"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0b34b0",
          height: Platform.OS === "ios" ? 110 : 100,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        drawerStyle: {
          backgroundColor: "#ffffff",
          width: 280,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
        },
        drawerActiveBackgroundColor: "#e3f2fd",
        drawerActiveTintColor: "#0b34b0",
        drawerInactiveTintColor: "#424242",
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: "500",
          marginLeft: -16,
        },
        drawerItemStyle: {
          borderRadius: 8,
          marginHorizontal: 8,
          marginVertical: 2,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Mapa"
        component={HomePage}
        initialParams={{ user }}
        options={{
          drawerLabel: "Inicio",
          drawerIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faMap} size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={ProfileScreen}
        initialParams={{ user }}
        options={{
          drawerLabel: "Perfil",
          drawerIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faUser} size={size} color={color} />
          ),
          headerShown: true,
          drawerItemStyle: { display: "none" },
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Perfil" icon={faUser} />,
        }}
      />
      <Drawer.Screen
        name="Directorio"
        component={Directory}
        options={{
          drawerLabel: "Directorio",
          drawerIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faBookBookmark} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Directorio" icon={faFolder} />,
        }}
      />
      <Drawer.Screen
        name="Articulos"
        component={Articles}
        options={{
          drawerLabel: "Artículos",
          drawerIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faNewspaper} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Artículos" icon={faNewspaper} />,
        }}
      />
      <Drawer.Screen
        name="Servicio social"
        component={Social_service}
        options={{
          drawerLabel: "Servicio social",
          drawerIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faHandsHelping} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Servicio social" icon={faHandsHelping} />,
        }}
      />
      <Drawer.Screen
        name="Becas"
        component={Scholarships}
        options={{
          drawerLabel: "Becas",
          drawerIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faSchool} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Becas" icon={faSchool} />,
        }}
      />
      <Drawer.Screen
        name="Radio CUCEI"
        component={CUCEI_radio}
        options={{
          drawerLabel: "Radio CUCEI",
          drawerIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faRadio} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Radio CUCEI" icon={faRadio} />,
        }}
      />
      <Drawer.Screen
        name="Reconocimiento facial"
        component={Facial_recognition}
        options={{
          drawerLabel: "Reconocimiento facial",
          drawerIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faFaceSmile} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Reconocimiento facial" icon={faFaceSmile} />,
        }}
      />
      <Drawer.Screen
        name="Servicios escolares"
        component={School_services}
        options={{
          drawerLabel: "Servicios escolares",
          drawerIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faUserFriends} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Servicios escolares" icon={faUserFriends} />,
        }}
      />
      <Drawer.Screen
        name="Servicios médicos"
        component={Medical_services}
        options={{
          drawerLabel: "Servicios médicos",
          drawerIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faMedkit} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Servicios médicos" icon={faMedkit} />,
        }}
      />
      <Drawer.Screen
        name="CID"
        component={CID}
        options={{
          drawerLabel: "CID",
          drawerIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faBookBookmark} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="CID" icon={faBookBookmark} />,
        }}
      />
      <Drawer.Screen
        name="ChatbotScreen"
        component={Chatbot}
        options={{
          drawerLabel: "Chatbot",
          drawerIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faRobot} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Chatbot" icon={faRobot} />,
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  drawerContent: {
    flexGrow: 1,
    paddingTop: 0,
  },
  drawerHeaderContainer: {
    marginBottom: 8,
  },
  drawerHeader: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: 20,
  },
  logoContainer: {
    width: 160,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  drawerHeaderText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
  },
  versionContainer: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
  versionText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  drawerItemsContainer: {
    flex: 1,
    paddingTop: 8,
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingBottom: Platform.OS === "ios" ? 30 : 5,
    marginTop: "auto",
  },
  bottomDrawerItem: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  bottomDrawerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0b34b0",
  },
  logoutLabel: {
    color: "#d32f2f",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 4,
    marginHorizontal: 16,
  },
  menuIcon: {
    padding: 12,
    marginLeft: 8,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
    letterSpacing: 0.5,
  },
});

export default MyDrawer;

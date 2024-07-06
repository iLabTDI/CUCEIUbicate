import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMap,
  faSearch,
  faUser,
  faBell,
  faSignOutAlt,
  faBars,
  faDirections,
  faBook,
  faRadio,
  faFaceSmile,
  faUserFriends,
  faSoccerBall,
  faMedkit,
  faCircle,
  faHandHoldingHand,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { HomePage } from "../Pages/HomePage";
import { Profile } from "../Pages/Profile";
import { Notifications } from "../Pages/Notification";
import { Directory } from "../Pages/Directory";
import { Articles } from "../Pages/Articles";
import { Clubs } from "../Pages/Clubs";
import { CTA } from "../Pages/CTA";
import { CUCEI_radio } from "../Pages/CUCEI_radio";
import { Facial_recognition } from "../Pages/Facial_recognition";
import { Medical_services } from "../Pages/Medical_services";
import { Scholarships } from "../Pages/Scholarships";
import { School_services } from "../Pages/School_services";
import { Social_service } from "../Pages/Social_service";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Logica para cerrar sesión y redirigir a la pantalla de inicio
    navigation.navigate("Inicio");
    console.log("Cerrando sesión...");
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>CUCEI UBICATE</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Cerrar Sesión"
        onPress={handleLogout}
        icon={({ focused, color, size }) => (
          <FontAwesomeIcon icon={faSignOutAlt} size={size} color={color} />
        )}
      />
    </DrawerContentScrollView>
  );
};

const DrawerHeaderButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menu_icon}>
      <FontAwesomeIcon icon={faBars} size={23} color="white" />
    </TouchableOpacity>
  );
};

export const MyDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Mapa"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#512DA8",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Mapa"
        component={HomePage}
        options={{
          drawerLabel: "Inicio",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faMap} size={size} color={color} />
          ),
          headerShown: false, // Deshabilitar el header para la pantalla del mapa
        }}
      />
      <Drawer.Screen
        name="Notificaciones"
        component={Notifications}
        options={{
          drawerLabel: "Notificaciones",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faBell} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />, // Agregar botón de menú en el header
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={Profile}
        options={{
          drawerLabel: "Perfil",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faUser} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />, // Agregar botón de menú en el header
        }}
      />
      <Drawer.Screen
        name="Directorio"
        component={Directory}
        options={{
          drawerLabel: "Directorio",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faDirections} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />, // Agregar botón de menú en el header
        }}
      />
      <Drawer.Screen
        name="Articulos"
        component={Articles}
        options={{
          drawerLabel: "Artículos",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faBook} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />, // Agregar botón de menú en el header
        }}
      />
      <Drawer.Screen
        name="Servicio social"
        component={Social_service}
        options={{
          drawerLabel: "Servicio social",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon
              icon={faHandHoldingHand}
              size={size}
              color={color}
            />
          ),
          headerLeft: () => <DrawerHeaderButton />, // Agregar botón de menú en el header
        }}
      />
      <Drawer.Screen
        name="Becas"
        component={Scholarships}
        options={{
          drawerLabel: "Becas",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faPlane} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />, // Agregar botón de menú en el header
        }}
      />
      <Drawer.Screen
        name="Radio CUCEI"
        component={CUCEI_radio}
        options={{
          drawerLabel: "Radio CUCEI",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faRadio} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />, // Agregar botón de menú en el header
        }}
      />
      <Drawer.Screen
        name="Reconocimiento facial"
        component={Facial_recognition}
        options={{
          drawerLabel: "Reconocimiento facial",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faFaceSmile} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />, // Agregar botón de menú en el header
        }}
      />
      <Drawer.Screen
        name="Servicios escolares"
        component={School_services}
        options={{
          drawerLabel: "Servicios escolares",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faUserFriends} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />, // Agregar botón de menú en el header
        }}
      />
      <Drawer.Screen
        name="Clubes"
        component={Clubs}
        options={{
          drawerLabel: "Clubes",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faSoccerBall} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />, // Agregar botón de menú en el header
        }}
      />
      <Drawer.Screen
        name="Servicios médicos"
        component={Medical_services}
        options={{
          drawerLabel: "Servicios médicos",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faMedkit} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />, // Agregar botón de menú en el header
        }}
      />
      <Drawer.Screen
        name="CTA"
        component={CTA}
        options={{
          drawerLabel: "CTA",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faCircle} size={size} color={color} />
          ),
          headerLeft: () => <DrawerHeaderButton />, // Agregar botón de menú en el header
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: "#512DA8",
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  drawerHeaderText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  menu_icon: {
    paddingLeft: 10,
  },
});

import * as React from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { HomePage } from "../Pages/HomePage";
import { Profile } from "./Profile";
import { Notifications } from "./Notification";
import { useNavigation } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const navigation = useNavigation(); // Obtener la navegacion

  const handleLogout = () => {
    // Aquí debes agregar la lógica para cerrar sesión
    // Por ejemplo, navegar a la pantalla de inicio de sesión

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

export const MyDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Mapa"
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Mapa"
        component={HomePage}
        options={({ navigation }) => ({
          drawerLabel: "Home",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faMap} size={size} color={color} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              style={styles.menu_icon}
              onPress={() => navigation.openDrawer()}>
              <FontAwesomeIcon icon={faBars} size={23} color="white" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              style={styles.search_icon}
              onPress={() => console.log("buscador")}>
              <FontAwesomeIcon icon={faSearch} size={23} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="Notifications"
        component={Notifications}
        options={{
          drawerLabel: "Updates",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faBell} size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerLabel: "Profile",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faUser} size={size} color={color} />
          ),
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
    flex: 1,
    flexDirection: "row",
  },
  drawerHeaderText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  menu_icon: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 60,
    marginLeft: 10,
    marginBottom: 20,
  },
  search_icon: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 60,
    marginBottom: 20,
    marginRight: 10,
  },
});

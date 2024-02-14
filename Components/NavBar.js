import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { HomePage } from "../Pages/HomePage";

function Notifications() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Notifications Screen</Text>
    </View>
  );
}

function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

export const MyDrawer = () => {
  return (
    <Drawer.Navigator initialRouteName="Inicio">
      <Drawer.Screen
        name="Inicio"
        component={HomePage}
        options={({ navigation }) => ({
          drawerLabel: "Home",
          headerLeft: () => (
            <TouchableOpacity
              style={styles.menu_icon}
              onPress={() => navigation.openDrawer()}>
              <FontAwesomeIcon icon={faBars} size={24} color="white" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.search_icon}
            onPress={() => console.log("buscador")}>
              <FontAwesomeIcon icon={faSearch} size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Drawer.Screen
        name="Notifications"
        component={Notifications}
        options={{ drawerLabel: "Updates" }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{ drawerLabel: "Profile" }}
      />
    </Drawer.Navigator>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginRight: 10,
    marginBottom: 20,
  },
});

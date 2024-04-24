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
  faDirections,
  faBook,
  faRadio,
  faFaceSmile,
  faUserFriends,
  faSoccerBall,
  faMedkit,
  faCircle,
  faFlagCheckered,
  faLegal,
  faHandHoldingHand,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";
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
import { useNavigation } from "@react-navigation/native";
import { Header } from "react-native/Libraries/NewAppScreen";
//importar los nuevos componentes (CREARLOS CEN MODO EXPORTACION)



const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const navigation = useNavigation(); // Obtener la navegacion

  const handleLogout = () => {
    // Logica para cerrar sesion y redirigir a la pantalla de inicio
    navigation.navigate("Inicio");
    console.log("Cerrando sesión...");
  };

  return (
    //Estos son los estilos del drawer que se abre
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
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Mapa"
        component={HomePage}
        options={({ navigation }) => ({
          drawerLabel: "Inicio",
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
        name="Notificaciones"
        component={Notifications}
        options={{
          drawerLabel: "Notificaciones",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faBell} size={size} color={color} />
          ),
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
        }}
      />

      <Drawer.Screen
        name="Servicio social"
        component={Social_service}
        options={{
          drawerLabel: "Servicio social",
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesomeIcon icon={faHandHoldingHand} size={size} color={color} />
          ),
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
        }}
      />
      {/* Duplicar lo de arriba para crear una nueva Screen 
          con el nombre y la importacion del componente corrspondiente*/}
      
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

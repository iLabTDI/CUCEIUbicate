import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
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
  faSignOutAlt,
  faBars,
  faRadio,
  faFaceSmile,
  faUserFriends,
  faMedkit,
  faSchool,
  faBookBookmark,
  faNewspaper,
  faHandsAmericanSignLanguageInterpreting,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HomePage } from "../../HomePage";
import { Directory } from "../../../community/Directory";
import { Articles } from "../../../community/Articles";
import { CUCEI_radio } from "../../../Education/CUCEI_radio";
import { Facial_recognition } from "../../../misc/Facial_recognition";
import { Medical_services } from "../../../Services/Medical_services";
import { Scholarships } from "../../../Education/Scholarships";
import { School_services } from "../../../Services/School_services";
import { Social_service } from "../../../Services/Social_service";
import { ProfileScreen } from "../../../Profile/ProfileScreen";
import { LinearGradient } from 'expo-linear-gradient';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.navigate("Inicio");
    console.log("Cerrando sesión...");
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.drawerHeader}
      >
        <Image
          source={require('../../../../../assets/images/Logo_Cucei.png')}
          style={styles.logo}
        />
        <Text style={styles.drawerHeaderText}>CUCEI UBICATE</Text>
      </LinearGradient>
      <View style={styles.drawerItemsContainer}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Cerrar Sesión"
          onPress={handleLogout}
          icon={({ color, size }) => (
            <FontAwesomeIcon icon={faSignOutAlt} size={size} color={color} />
          )}
          labelStyle={styles.drawerItemLabel}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerHeaderButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.openDrawer()}
      style={styles.menuIcon}>
      <FontAwesomeIcon icon={faBars} size={23} color="white" />
    </TouchableOpacity>
  );
};

export const MyDrawer = () => {
  const route = useRoute();
  const { user } = route.params;

  return (
    <Drawer.Navigator
      initialRouteName="Mapa"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#4c669f",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerStyle: {
          backgroundColor: '#f5f5f5',
          width: 280,
        },
        drawerActiveBackgroundColor: '#e0e0e0',
        drawerActiveTintColor: '#4c669f',
        drawerInactiveTintColor: '#333',
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
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
          headerLeft: () => <DrawerHeaderButton />,
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
        }}
      />
      <Drawer.Screen
        name="Servicio social"
        component={Social_service}
        options={{
          drawerLabel: "Servicio social",
          drawerIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faHandsAmericanSignLanguageInterpreting}
              size={size}
              color={color}
            />
          ),
          headerLeft: () => <DrawerHeaderButton />,
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
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 5,
    // borderRadius: 40,

  },
  drawerHeaderText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  drawerItemsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 10,
  },
  drawerItemLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuIcon: {
    paddingLeft: 16,
  },
});
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
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
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
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
import { LinearGradient } from "expo-linear-gradient";
import  Chatbot  from "../../../ChatBot/Chatbot";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  // const navigation = useNavigation();

  // const handleLogout = () => {
  //   navigation.navigate("Inicio");
  //   console.log("Cerrando sesión...");
  // };

  return (
    <ScrollView style={styles.scrollView}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}>
        <LinearGradient
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          style={styles.drawerHeader}>
          <Image
            source={require("../../../../../assets/images/Logo_Cucei.png")}
            style={styles.logo}
          />
          <Text style={styles.drawerHeaderText}>CUCEI UBICATE</Text>
        </LinearGradient>
        <View style={styles.drawerItemsContainer}>
          <DrawerItemList {...props} />
          {/* <DrawerItem
            label="Cerrar Sesión"
            onPress={handleLogout}
            icon={({ color, size }) => (
              <FontAwesomeIcon icon={faSignOutAlt} size={size} color={color} />
            )}
            labelStyle={styles.drawerItemLabel}
          /> */}
        </View>
      </DrawerContentScrollView>
    </ScrollView>
  );
};

const DrawerHeaderButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.openDrawer()}
      style={styles.menuIcon}>
      <FontAwesomeIcon icon={faBars} size={23} color="#FFFFFF" />
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
      initialRouteName="Mapa" // default route
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0b34b0",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerStyle: {
          backgroundColor: "#f5f5f5",
          width: 280,
        },
        drawerActiveBackgroundColor: "#e0e0e0",
        drawerActiveTintColor: "#4c669f",
        drawerInactiveTintColor: "#000000",
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
          drawerItemStyle: { display: 'none' }, //para ocultar la pantalla perfil
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
          headerTitle: () => (
            <HeaderWithIcon title="Directorio" icon={faFolder} />
          ),
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
          headerTitle: () => (
            <HeaderWithIcon title="Artículos" icon={faNewspaper} />
          ), // Header personalizado
        }}
      />
      <Drawer.Screen
        name="Servicio social"
        component={Social_service}
        options={{
          drawerLabel: "Servicio social",
          drawerIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faHandsHelping}
              size={size}
              color={color}
            />
          ),
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => (
            <HeaderWithIcon
              title="Servicio social"
              icon={faHandsHelping}
            />
          ),
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
          headerTitle: () => (
            <HeaderWithIcon title="Radio CUCEI" icon={faRadio} />
          ),
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
          headerTitle: () => (
            <HeaderWithIcon title="Reconocimiento facial" icon={faFaceSmile} />
          ),
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
          headerTitle: () => (
            <HeaderWithIcon title="Servicios escolares" icon={faUserFriends} />
          ),
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
          headerTitle: () => (
            <HeaderWithIcon title="Servicios médicos" icon={faMedkit} />
          ),
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
          headerTitle: () => (
            <HeaderWithIcon title="CID" icon={faBookBookmark} />
          ),
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
          headerTitle: () => (
            <HeaderWithIcon title="Chatbot" icon={faRobot} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
  },
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
  },
  drawerHeaderText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  drawerItemsContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 10,
  },
  drawerItemLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  menuIcon: {
    paddingLeft: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

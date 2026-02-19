import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  Modal,
  Linking,
  Alert,
  StatusBar,
} from "react-native"
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer"
import { useNavigation, useRoute } from "@react-navigation/native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
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
  faEnvelope,
  faTimes,
  faHome,
  faGraduationCap,
  faHeartPulse,
  faComments,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons"
import { LinearGradient } from "expo-linear-gradient"
import Animated, { 
  FadeInDown,
  FadeInUp, 
  FadeInLeft, 
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated"

import { HomePage } from "../../HomePage"
import { Directory } from "../../../community/Directory"
import { Articles } from "../../../community/Articles"
import { CUCEI_radio } from "../../../Education/CUCEI_radio"
import { Facial_recognition } from "../../../ScolarServices/Facial_recognition"
import { Medical_services } from "../../../ScolarServices/Medical_services"
import { Scholarships } from "../../../Education/Scholarships"
import { School_services } from "../../../ScolarServices/School_services"
import { Social_service } from "../../../ScolarServices/Social_service"
import { ProfileScreen } from "../../../Profile/ProfileScreen"
import { CID } from "../../../ScolarServices/CID"
import { Chatbot } from "../../../ChatBot/Chatbot"
import { clearSession } from "../../../../auth/SessionManager"

const { width, height } = Dimensions.get("window")
const isTablet = width >= 768

const Drawer = createDrawerNavigator()

const CustomDrawerContent = (props) => {
  const navigation = useNavigation()
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false)
  const [activeItem, setActiveItem] = useState('Mapa')

  // Organizamos los elementos del drawer en categorías
  const drawerSections = [
    {
      title: "Principal",
      items: [
        { name: "Mapa", label: "Inicio", icon: faHome, description: "Navegar por el campus" },
        { name: "Directorio", label: "Directorio", icon: faFolder, description: "Contactos académicos" },
        { name: "Articulos", label: "Artículos", icon: faNewspaper, description: "Noticias y eventos" },
      ]
    },
    {
      title: "Servicios Académicos",
      items: [
        { name: "Becas", label: "Becas", icon: faGraduationCap, description: "Convocatorias abiertas" },
        { name: "Servicio social", label: "Servicio Social", icon: faHandsHelping, description: "Gestiona tu servicio" },
        { name: "Servicios escolares", label: "Servicios Escolares", icon: faUserFriends, description: "Trámites académicos" },
        { name: "CID", label: "CID", icon: faBookBookmark, description: "Centro de idiomas" },
      ]
    },
    {
      title: "Servicios de Bienestar",
      items: [
        { name: "Servicios médicos", label: "Servicios Médicos", icon: faHeartPulse, description: "Atención médica" },
        { name: "Reconocimiento facial", label: "Acceso Facial", icon: faFaceSmile, description: "Control de acceso" },
      ]
    },
    {
      title: "Entretenimiento",
      items: [
        { name: "Radio CUCEI", label: "Radio CUCEI", icon: faRadio, description: "Escucha en vivo" },
        { name: "ChatbotScreen", label: "Asistente IA", icon: faComments, description: "Chat inteligente" },
      ]
    }
  ]

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión", 
      "¿Estás seguro de que quieres cerrar sesión?", 
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, cerrar sesión", onPress: confirmLogout, style: "destructive" },
      ],
      { cancelable: true }
    )
  }

  const confirmLogout = () => {
    clearSession()
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    })
  }

  const handleHelp = () => {
    setIsHelpModalVisible(true)
  }

  const renderDrawerItem = ({ item, index, sectionIndex }) => {
    const isActive = activeItem === item.name
    
    return (
      <Animated.View
        key={item.name}
        entering={FadeInLeft.delay(sectionIndex * 100 + index * 50)}
        style={[styles.customDrawerItem, isActive && styles.activeDrawerItem]}
      >
        <TouchableOpacity
          onPress={() => {
            setActiveItem(item.name)
            navigation.navigate(item.name)
          }}
          style={styles.drawerItemTouchable}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
            <FontAwesomeIcon 
              icon={item.icon} 
              size={20} 
              color={isActive ? "#FFFFFF" : "#0b34b0"} 
            />
          </View>
          <View style={styles.itemTextContainer}>
            <Text style={[styles.itemLabel, isActive && styles.activeItemLabel]}>
              {item.label}
            </Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
          <FontAwesomeIcon 
            icon={faChevronRight} 
            size={14} 
            color={isActive ? "#0b34b0" : "#94a3b8"} 
          />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const closeHelpModal = () => {
    setIsHelpModalVisible(false)
  }

  const sendEmail = () => {
    Linking.openURL("mailto:ubicatesupp@gmail.com")
    closeHelpModal()
  }

  return (
    <View style={styles.drawerContainer}>
      <StatusBar backgroundColor="#0b34b0" barStyle="light-content" />
      
      {/* Header Premium */}
      <Animated.View entering={FadeInDown.duration(800)} style={styles.drawerHeaderContainer}>
        <LinearGradient
          colors={["#0b34b0", "#1e40af", "#3b82f6"]}
          style={styles.drawerHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../../../../assets/images/Logo_Cucei.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.drawerHeaderText}>CUCEI</Text>
            <Text style={styles.drawerSubHeaderText}>UBÍCATE</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>Beta v1.01</Text>
            </View>
          </View>
          {/* Decorative elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </LinearGradient>
      </Animated.View>

      {/* Contenido del Drawer */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {drawerSections.map((section, sectionIndex) => (
          <Animated.View 
            key={section.title}
            entering={FadeInUp.delay(sectionIndex * 150)}
            style={styles.sectionContainer}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, index) => 
              renderDrawerItem({ item, index, sectionIndex })
            )}
          </Animated.View>
        ))}

        {/* Bottom Actions - Ahora dentro del ScrollView */}
        <Animated.View 
          entering={SlideInRight.delay(800)} 
          style={styles.bottomActionsContainer}
        >
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleHelp}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconContainer}>
              <FontAwesomeIcon icon={faQuestionCircle} size={18} color="#0b34b0" />
            </View>
            <Text style={styles.actionButtonText}>Ayuda y Soporte</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconContainer, styles.logoutIconContainer]}>
              <FontAwesomeIcon icon={faSignOutAlt} size={18} color="#ef4444" />
            </View>
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Modal de Ayuda Premium */}
      <Modal 
        animationType="fade" 
        transparent={true} 
        visible={isHelpModalVisible} 
        onRequestClose={closeHelpModal}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={FadeInDown.duration(300)}
            style={styles.modalContent}
          >
            <LinearGradient
              colors={["#0b34b0", "#1e40af"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalHeader}
            >
              <View style={styles.modalHeaderContent}>
                <FontAwesomeIcon icon={faQuestionCircle} size={28} color="#FFFFFF" />
                <Text style={styles.modalTitle}>¿Necesitas Ayuda?</Text>
              </View>
              <TouchableOpacity onPress={closeHelpModal} style={styles.closeButton}>
                <FontAwesomeIcon icon={faTimes} size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </LinearGradient>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalDescription}>
                Nuestro equipo de soporte está aquí para ayudarte. Puedes contactarnos mediante correo electrónico.
              </Text>
              
              <View style={styles.developerCard}>
                <View style={styles.developerAvatar}>
                  <FontAwesomeIcon icon={faEnvelope} size={32} color="#0b34b0" />
                </View>
                <View style={styles.developerInfo}>
                  <Text style={styles.developerName}>Ubícate Support</Text>
                  <Text style={styles.developerRole}>Equipo de Soporte Técnico</Text>
                </View>
              </View>

              <View style={styles.contactButtons}>
                <TouchableOpacity style={styles.contactButton} onPress={sendEmail}>
                  <FontAwesomeIcon icon={faEnvelope} size={20} color="#FFFFFF" />
                  <Text style={styles.contactButtonText}>Enviar Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  )
}

const DrawerHeaderButton = () => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity 
      onPress={() => navigation.openDrawer()} 
      style={styles.menuIcon} 
      activeOpacity={0.7}
    >
      <View style={styles.menuIconContainer}>
        <FontAwesomeIcon icon={faBars} size={22} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  )
}

const HeaderWithIcon = ({ title, icon }) => (
  <View style={styles.header}>
    <View style={styles.headerIconContainer}>
      <FontAwesomeIcon icon={icon} size={22} color="#FFFFFF" />
    </View>
    <Text style={styles.headerText}>{title}</Text>
  </View>
)

export const MyDrawer = () => {
  const route = useRoute()
  const { user } = route.params

  return (
    <Drawer.Navigator
      initialRouteName="Mapa"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0b34b0",
          height: Platform.OS === "ios" ? 100 : 70,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
          letterSpacing: 0.5,
        },
        drawerStyle: {
          backgroundColor: "#ffffff",
          width: Platform.OS === 'android' ? width * 0.85 : 320,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          elevation: 16,
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        sceneContainerStyle: {
          backgroundColor: '#f8fafc',
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
          drawerIcon: ({ color, size }) => <FontAwesomeIcon icon={faHome} size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={ProfileScreen}
        initialParams={{ user }}
        options={{
          drawerLabel: "Perfil",
          drawerIcon: ({ color, size }) => <FontAwesomeIcon icon={faUser} size={size} color={color} />,
          headerShown: true,
          drawerItemStyle: { display: "none" },
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Mi Perfil" icon={faUser} />,
        }}
      />
      <Drawer.Screen
        name="Directorio"
        component={Directory}
        options={{
          drawerLabel: "Directorio",
          drawerIcon: ({ color, size }) => <FontAwesomeIcon icon={faFolder} size={size} color={color} />,
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Directorio Académico" icon={faFolder} />,
        }}
      />
      <Drawer.Screen
        name="Articulos"
        component={Articles}
        options={{
          drawerLabel: "Artículos",
          drawerIcon: ({ color, size }) => <FontAwesomeIcon icon={faNewspaper} size={size} color={color} />,
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Noticias y Eventos" icon={faNewspaper} />,
        }}
      />
      <Drawer.Screen
        name="Servicio social"
        component={Social_service}
        options={{
          drawerLabel: "Servicio social",
          drawerIcon: ({ color, size }) => <FontAwesomeIcon icon={faHandsHelping} size={size} color={color} />,
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Servicio Social" icon={faHandsHelping} />,
        }}
      />
      <Drawer.Screen
        name="Becas"
        component={Scholarships}
        options={{
          drawerLabel: "Becas",
          drawerIcon: ({ color, size }) => <FontAwesomeIcon icon={faGraduationCap} size={size} color={color} />,
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Becas y Convocatorias" icon={faGraduationCap} />,
        }}
      />
      <Drawer.Screen
        name="Radio CUCEI"
        component={CUCEI_radio}
        options={{
          drawerLabel: "Radio CUCEI",
          drawerIcon: ({ color, size }) => <FontAwesomeIcon icon={faRadio} size={size} color={color} />,
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Radio CUCEI" icon={faRadio} />,
        }}
      />
      <Drawer.Screen
        name="Reconocimiento facial"
        component={Facial_recognition}
        options={{
          drawerLabel: "Reconocimiento facial",
          drawerIcon: ({ color, size }) => <FontAwesomeIcon icon={faFaceSmile} size={size} color={color} />,
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Acceso Facial" icon={faFaceSmile} />,
        }}
      />
      <Drawer.Screen
        name="Servicios escolares"
        component={School_services}
        options={{
          drawerLabel: "Servicios escolares",
          drawerIcon: ({ color, size }) => <FontAwesomeIcon icon={faUserFriends} size={size} color={color} />,
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Servicios Escolares" icon={faUserFriends} />,
        }}
      />
      <Drawer.Screen
        name="Servicios médicos"
        component={Medical_services}
        options={{
          drawerLabel: "Servicios médicos",
          drawerIcon: ({ color, size }) => <FontAwesomeIcon icon={faHeartPulse} size={size} color={color} />,
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Servicios Médicos" icon={faHeartPulse} />,
        }}
      />
      <Drawer.Screen
        name="CID"
        component={CID}
        options={{
          drawerLabel: "CID",
          drawerIcon: ({ color, size }) => <FontAwesomeIcon icon={faBookBookmark} size={size} color={color} />,
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Centro de Idiomas" icon={faBookBookmark} />,
        }}
      />
      <Drawer.Screen
        name="ChatbotScreen"
        component={Chatbot}
        options={{
          drawerLabel: "Chatbot",
          drawerIcon: ({ color, size }) => <FontAwesomeIcon icon={faComments} size={size} color={color} />,
          headerLeft: () => <DrawerHeaderButton />,
          headerTitle: () => <HeaderWithIcon title="Asistente IA" icon={faComments} />,
        }}
      />
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  // Container principal
  drawerContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // Header premium
  drawerHeaderContainer: {
    marginBottom: 0,
  },
  drawerHeader: {
    height: Platform.OS === 'android' ? 200 : 220,
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  logoContainer: {
    width: Platform.OS === 'android' ? 120 : 140,
    height: Platform.OS === 'android' ? 80 : 90,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 8,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  drawerHeaderText: {
    color: "#FFFFFF",
    fontSize: Platform.OS === 'android' ? 26 : 28,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  drawerSubHeaderText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: Platform.OS === 'android' ? 14 : 16,
    fontWeight: "500",
    letterSpacing: 4,
    marginTop: 4,
  },
  versionBadge: {
    position: "absolute",
    // bottom: 16,
    top: Platform.OS === 'android' ? 130 : 150,
    left: Platform.OS === 'android' ? 160 : 140,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  versionText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "600",
  },

  // Elementos decorativos
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  // Contenido del scroll
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },

  // Secciones
  sectionContainer: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
    marginLeft: 4,
  },

  // Items del drawer personalizados
  customDrawerItem: {
    marginVertical: 2,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    overflow: 'hidden',
  },
  activeDrawerItem: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  drawerItemTouchable: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Platform.OS === 'android' ? 14 : 16,
    paddingHorizontal: 16,
    minHeight: Platform.OS === 'android' ? 56 : 60,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activeIconContainer: {
    backgroundColor: "#0b34b0",
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  itemLabel: {
    fontSize: Platform.OS === 'android' ? 15 : 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  activeItemLabel: {
    color: "#0b34b0",
    fontWeight: "700",
  },
  itemDescription: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "400",
  },

  // Acciones del bottom - ahora dentro del scroll
  bottomActionsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#f8fafc",
    marginTop: 12,
    marginHorizontal: 8,
    borderRadius: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 4,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  logoutButton: {
    borderColor: "#fee2e2",
    backgroundColor: "#fef2f2",
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoutIconContainer: {
    backgroundColor: "#fee2e2",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  logoutButtonText: {
    color: "#dc2626",
  },

  // Header del drawer
  menuIcon: {
    marginLeft: 8,
  },
  menuIconContainer: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    flex: 1,
  },
  headerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Modal premium
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
    elevation: 24,
  },
  modalHeader: {
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    padding: 24,
    alignItems: "center",
  },
  modalDescription: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  developerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  developerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e0f2fe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  developerInfo: {
    flex: 1,
  },
  developerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0b34b0",
    marginBottom: 4,
  },
  developerRole: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  contactButtons: {
    width: "100%",
  },
  contactButton: {
    width: "100%",
    backgroundColor: "#0b34b0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#0b34b0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  phoneButton: {
    backgroundColor: "#059669",
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
})

export default MyDrawer


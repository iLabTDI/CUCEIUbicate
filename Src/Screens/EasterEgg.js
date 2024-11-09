import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Animated, 
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
  Modal
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { useNavigation } from "@react-navigation/native";

const teamMembers = [
  { 
    name: 'Yair', 
    role: 'Desarrollador Principal', 
    icon: 'code', 
    description: 'Responsable del desarrollo y diseño de la aplicación...',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=774&q=80',
  },
  { 
    name: 'Montse', 
    role: 'Diseñadora de Mapas', 
    icon: 'map-marked-alt', 
    description: 'Encargada de crear el mapa e imágenes de información...',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=774&q=80',
  },
  { 
    name: 'Natte', 
    role: 'Documentación e Investigación', 
    icon: 'book', 
    description: 'Responsable de documentar y obtener información...',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=761&q=80',
  },
];

const MemberCard = ({ member }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  return (
    <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
      <Animated.View style={[
        styles.memberCard,
        {
          height: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 300]
          })
        }
      ]}>
        <Image source={{ uri: member.image }} style={styles.memberImage} />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberRole}>{member.role}</Text>
          <Animatable.View 
            animation="pulse" 
            iterationCount="infinite" 
            duration={2000} 
            style={styles.iconContainer}
          >
            <FontAwesome5 name={member.icon} size={24} color="#00FFFF" />
          </Animatable.View>
          <Animated.View style={{
            opacity: slideAnim,
            height: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 150]
            }),
            overflow: 'hidden'
          }}>
            <Text style={styles.memberDescription}>{member.description}</Text>
          </Animated.View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const EasterEggModal = ({ visible, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <LottieView
            source={require('../assets/animations/confetti.json')}
            autoPlay
            loop={false}
            style={styles.confettiAnimation}
          />
          <Text style={styles.modalTitle}>¡Felicidades!</Text>
          <Text style={styles.modalText}>Has encontrado el Easter Egg de los creadores</Text>
          <ScrollView style={styles.creatorsContent}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.creatorItem}>
                <Image source={{ uri: member.image }} style={styles.creatorImage} />
                <View style={styles.creatorInfo}>
                  <Text style={styles.creatorName}>{member.name}</Text>
                  <Text style={styles.creatorRole}>{member.role}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome5 name="times" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function EasterEgg() {
  const { height } = useWindowDimensions();
  const [easterEggVisible, setEasterEggVisible] = useState(false);

  useEffect(() => {
    setEasterEggVisible(true); // Mostrar modal al cargar la pantalla
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { height: height * 0.3 }]}>
          <Text style={styles.title}>CUCEI Ubicate</Text>
          <LottieView
            source={require('../assets/animations/Camino.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
          <Text style={styles.subtitle}>Navegación precisa y eficiente para el campus CUCEI</Text>
        </View>
        <View style={styles.teamSection}>
          <Text style={styles.sectionTitle}>Nuestro Equipo</Text>
          {teamMembers.map((member, index) => (
            <MemberCard key={member.name} member={member} index={index} />
          ))}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Mapa")}>
          <Text style={styles.mapLink}>
            ¡Haz clic aquí para ir al Mapa!
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <EasterEggModal
        visible={easterEggVisible}
        onClose={() => setEasterEggVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { flexGrow: 1 },
  header: { justifyContent: 'center', alignItems: 'center', padding: 20 },
  lottieAnimation: { width: 250, height: 150, marginBottom: 10 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#CCCCCC', textAlign: 'center' },
  teamSection: { padding: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  memberCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  memberImage: { width: 100, height: '100%', resizeMode: 'cover' },
  memberInfo: { flex: 1, padding: 15 },
  memberName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  memberRole: { fontSize: 14, color: '#00FFFF', marginBottom: 10 },
  iconContainer: { position: 'absolute', top: 15, right: 15 },
  memberDescription: { fontSize: 14, color: '#CCCCCC', lineHeight: 20 },
  mapLink: { color: '#00FFFF', textAlign: 'center', marginVertical: 20, fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
  modalContent: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, alignItems: 'center', width: '80%' },
  confettiAnimation: { width: 200, height: 200, position: 'absolute', top: -100 },
  modalTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 10, textAlign: 'center' },
  modalText: { fontSize: 18, color: '#CCCCCC', marginBottom: 20, textAlign: 'center' },
  creatorsContent: { maxHeight: 200, width: '100%' },
  creatorItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  creatorImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  creatorInfo: { flex: 1 },
  creatorName: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  creatorRole: { fontSize: 14, color: '#00FFFF' },
  closeButton: { position: 'absolute', top: 10, right: 10 },
});

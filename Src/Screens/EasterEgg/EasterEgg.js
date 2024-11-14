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
  Modal,
  Easing,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { useNavigation } from "@react-navigation/native";
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const teamMembers = [
  { 
    name: 'Yair', 
    role: 'Desarrollador Principal', 
    icon: 'code', 
    description: 'Responsable del desarrollo y diseño de la aplicación. Experto en React Native y arquitectura de software.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=774&q=80',
    color: '#FF6B6B',
  },
  { 
    name: 'Natte', 
    role: 'Documentación e Investigación', 
    icon: 'book', 
    description: 'Responsable de documentar y obtener información. Experta en UX Writing y gestión de conocimiento.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=761&q=80',
    color: '#45B7D1',
  },
  { 
    name: 'Montse', 
    role: 'Diseñadora de Mapas', 
    icon: 'map-marked-alt', 
    description: 'Encargada de crear el mapa e imágenes de información. Especialista en GIS y diseño de interfaces.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=774&q=80',
    color: '#4ECDC4',
  },
];

const MemberCard = ({ member, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const imageScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(imageScaleAnim, {
        toValue: isExpanded ? 1.2 : 1,
        friction: 5,
        useNativeDriver: true,
      })
    ]).start();
  }, [isExpanded]);

  const cardHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [120, 300]
  });

  const rotateIcon = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <Animated.View style={[styles.memberCard, { height: cardHeight }]}>
      <LinearGradient
        colors={[member.color, `${member.color}80`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.cardContent}>
          <Animated.Image 
            source={{ uri: member.image }} 
            style={[
              styles.memberImage, 
              { transform: [{ scale: imageScaleAnim }] }
            ]} 
          />
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberRole}>{member.role}</Text>
            <Animatable.View 
              animation="pulse" 
              iterationCount="infinite" 
              duration={2000} 
              style={styles.iconContainer}
            >
              <FontAwesome5 name={member.icon} size={24} color="#FFFFFF" />
            </Animatable.View>
          </View>
          <Animated.View style={[styles.expandIcon, { transform: [{ rotate: rotateIcon }] }]}>
            <FontAwesome5 name="chevron-down" size={16} color="#FFFFFF" />
          </Animated.View>
        </TouchableOpacity>
        <Animated.View style={[styles.expandedContent, { opacity: expandAnim }]}>
          <Text style={styles.memberDescription}>{member.description}</Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
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
      <BlurView intensity={100} style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <LottieView
            source={require('../../assets/animations/confetti.json')}
            autoPlay
            loop={false}
            style={styles.confettiAnimation}
          />
          <Text style={styles.modalTitle}>¡Felicidades!</Text>
          <Text style={styles.modalText}>Has encontrado el Easter Egg de los creadores</Text>
          <ScrollView style={styles.creatorsContent}>
            {teamMembers.map((member, index) => (
              <Animatable.View 
                key={index} 
                animation="fadeInUp" 
                delay={index * 200}
                style={styles.creatorItem}
              >
                <Image source={{ uri: member.image }} style={styles.creatorImage} />
                <View style={styles.creatorInfo}>
                  <Text style={styles.creatorName}>{member.name}</Text>
                  <Text style={styles.creatorRole}>{member.role}</Text>
                </View>
              </Animatable.View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome5 name="times" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </BlurView>
    </Modal>
  );
};

export default function EasterEgg() {
  const { height } = useWindowDimensions();
  const [easterEggVisible, setEasterEggVisible] = useState(false);
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setEasterEggVisible(true);
  }, []);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [height * 0.3, height * 0.15],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>CUCEI Ubicate</Animated.Text>
        <LottieView
          source={require('../../assets/animations/Camino.json')}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
        <Animated.Text style={[styles.subtitle, { opacity: titleOpacity }]}>
          Navegación precisa y eficiente para el campus CUCEI
        </Animated.Text>
      </Animated.View>
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.teamSection}>
          <Animatable.Text animation="fadeInUp" style={styles.sectionTitle}>Nuestro Equipo</Animatable.Text>
          {teamMembers.map((member, index) => (
            <Animatable.View key={member.name} animation="fadeInUp" delay={index * 200}>
              <MemberCard member={member} index={index} />
            </Animatable.View>
          ))}
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate("Mapa")}
          style={styles.mapLinkContainer}
        >
          <LinearGradient
            colors={['#4CAF50', '#45B649']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.mapLinkGradient}
          >
            <Text style={styles.mapLinkText}>
              ¡Ir al Mapa!
            </Text>
            <FontAwesome5 name="map-marked-alt" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.ScrollView>
      <EasterEggModal
        visible={easterEggVisible}
        onClose={() => setEasterEggVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212' 
  },
  scrollContent: { 
    flexGrow: 1, 
    paddingTop: 20 
  },
  header: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#1E1E1E' 
  },
  lottieAnimation: { 
    width: 250, 
    height: 150, 
    marginBottom: 10 
  },
  title: { 
    fontSize: 36, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#CCCCCC', 
    textAlign: 'center' 
  },
  teamSection: { 
    padding: 20 
  },
  sectionTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(255,255,255,0.1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  memberCard: {
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    flex: 1,
    padding: 15,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  memberInfo: { 
    flex: 1 
  },
  memberName: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#FFFFFF',
    marginBottom: 5,
  },
  memberRole: { 
    fontSize: 16, 
    color: '#FFFFFF', 
    opacity: 0.8,
  },
  iconContainer: { 
    position: 'absolute', 
    top: 0, 
    right: 0 
  },
  expandIcon: {
    marginLeft: 10,
  },
  expandedContent: {
    marginTop: 15,
  },
  memberDescription: { 
    fontSize: 16, 
    color: '#FFFFFF', 
    lineHeight: 24,
    opacity: 0.9,
  },
  mapLinkContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mapLinkGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  mapLinkText: { 
    color: '#FFFFFF', 
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  modalContent: { 
    backgroundColor: '#1E1E1E', 
    borderRadius: 20, 
    padding: 20, 
    alignItems: 'center', 
    width: '80%',
    maxHeight: '80%',
  },
  confettiAnimation: { 
    width: 200, 
    height: 200, 
    position: 'absolute', 
    top: -100 
  },
  modalTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  modalText: { 
    fontSize: 18, 
    color: '#CCCCCC', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  creatorsContent: { 
    maxHeight: 200, 
    width: '100%' 
  },
  creatorItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 10,
  },
  creatorImage: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 10 
  },
  creatorInfo: { 
    flex: 1 
  },
  creatorName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#FFFFFF' 
  },
  creatorRole: { 
    fontSize: 14, 
    color: '#CCCCCC' 
  },
  closeButton: { 
    position: 'absolute', 
    top: 10, 
    right: 10 
  },
});
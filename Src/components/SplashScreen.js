import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  Animated,
  Platform,
} from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get('window');

export const SplashScreen = ({ isLoginSuccess = false, onAnimationComplete }) => {
  // ✨ ANIMACIONES MÁS SUTILES Y ELEGANTES
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const textSlideAnim = useRef(new Animated.Value(20)).current;
  const lottieOpacityAnim = useRef(new Animated.Value(0)).current;
  const glowPulseAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // ✨ SECUENCIA DE ANIMACIONES MÁS SUTIL Y RÁPIDA
    const startAnimations = () => {
      // Fade in general
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Logo aparece con escala suave
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        delay: 300,
        useNativeDriver: true,
      }).start();

      // Escala del contenedor principal
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 70,
        friction: 8,
        delay: 400,
        useNativeDriver: true,
      }).start();

      // Texto desliza hacia arriba
      Animated.timing(textSlideAnim, {
        toValue: 0,
        duration: 600,
        delay: 600,
        useNativeDriver: true,
      }).start();

      // Lottie aparece suavemente
      Animated.timing(lottieOpacityAnim, {
        toValue: 1,
        duration: 400,
        delay: 800,
        useNativeDriver: true,
      }).start();
    };

    // ✨ ANIMACIÓN DE PULSO MUY SUTIL
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulseAnim, {
          toValue: 0.7,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    startAnimations();
    pulseAnimation.start();

    // ✨ TIMING MÁS CORTO - 3 SEGUNDOS
    const timer = setTimeout(() => {
      console.log('🎯 Splash completado - navegando...');
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      pulseAnimation.stop();
    };
  }, [onAnimationComplete]);

  return (
    <>
      <StatusBar
        backgroundColor="#f8faff"
        barStyle="dark-content"
        translucent={false}
      />
      
      <View style={styles.container}>
        
        {/* ✨ SOLO 2 ELEMENTOS DECORATIVOS MINIMALISTAS */}
        <View style={styles.decorativeElement1} />
        <View style={styles.decorativeElement2} />
        
        {/* ✨ CONTENEDOR PRINCIPAL CON ANIMACIONES SUAVES */}
        <Animated.View
          style={[
            styles.mainContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}>
          
          {/* ✨ LOGO CON GLOW SUTIL */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoScaleAnim }],
              },
            ]}>
            
            {/* Glow muy sutil */}
            <Animated.View 
              style={[
                styles.logoGlow,
                { opacity: glowPulseAnim }
              ]} 
            />
            
            {/* ✨ IMAGEN CUCEI.PNG CORRECTA */}
            <Image
              source={require("../../assets/images/cucei.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
          
          {/* ✨ TEXTO PRINCIPAL CON SLIDE SUTIL */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                transform: [{ translateY: textSlideAnim }],
                opacity: fadeAnim,
              },
            ]}>
            <Text style={styles.appName}>CUCEI Ubícate</Text>
            <Text style={styles.tagline}>
              {isLoginSuccess ? "¡Bienvenido de vuelta!" : "Navegando tu futuro"}
            </Text>
          </Animated.View>
          
          {/* ✨ ANIMACIÓN LOTTIE MÁS PEQUEÑA Y SUTIL */}
          <Animated.View
            style={[
              styles.lottieContainer,
              { opacity: lottieOpacityAnim },
            ]}>
            <LottieView
              source={require("../assets/animations/Map_loading.json")}
              autoPlay
              loop={false}
              style={styles.lottieAnimation}
            />
          </Animated.View>
          
          {/* ✨ TEXTO DE CARGA MINIMALISTA */}
          <Animated.View
            style={[
              styles.loadingContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: textSlideAnim }],
              },
            ]}>
            <Text style={styles.loadingText}>
              {isLoginSuccess ? "Preparando tu experiencia..." : "Inicializando..."}
            </Text>
          </Animated.View>
          
        </Animated.View>
        
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // ✨ CONTENEDOR PRINCIPAL LIMPIO
  container: {
    flex: 1,
    backgroundColor: '#f8faff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  
  // ✨ CONTENEDOR PRINCIPAL CENTRADO
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 30,
  },
  
  // ✨ LOGO CON EFECTOS MINIMALISTAS
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.05,
    position: 'relative',
  },
  
  logoGlow: {
    position: 'absolute',
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: width * 0.225,
    backgroundColor: 'rgba(11, 52, 176, 0.06)',
    zIndex: 1,
  },
  
  logo: {
    width: width * 0.4,
    height: width * 0.25,
    zIndex: 2,
  },
  
  // ✨ TEXTO ELEGANTE Y CENTRADO
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.04,
    paddingHorizontal: 20,
  },
  
  appName: {
    fontSize: width * 0.07,
    fontWeight: '800',
    color: '#0b34b0',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 6,
    textShadowColor: 'rgba(11, 52, 176, 0.08)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  
  tagline: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#4a90e2',
    textAlign: 'center',
    letterSpacing: 0.5,
    opacity: 0.9,
    lineHeight: width * 0.05,
  },
  
  // ✨ LOTTIE MÁS PEQUEÑO Y SUTIL
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.03,
  },
  
  lottieAnimation: {
    width: width * 0.25,
    height: width * 0.25,
  },
  
  // ✨ TEXTO DE CARGA SUTIL
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  loadingText: {
    fontSize: width * 0.035,
    fontWeight: '500',
    color: '#64748b',
    letterSpacing: 0.3,
    opacity: 0.8,
    textAlign: 'center',
  },
  
  // ✨ SOLO 2 ELEMENTOS DECORATIVOS MINIMALISTAS
  decorativeElement1: {
    position: 'absolute',
    top: '20%',
    right: '15%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(11, 52, 176, 0.04)',
    zIndex: 0,
  },
  
  decorativeElement2: {
    position: 'absolute',
    bottom: '25%',
    left: '12%',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: 'rgba(74, 144, 226, 0.06)',
    zIndex: 0,
  },
});

export default SplashScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

export const CompleteProfile = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("");
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  const navigation = useNavigation();

  const careerOptions = [
    "Ingeniería Biomédica INBI",
    "Ingeniería Civil ICIV",
    "Ingeniería en Alimentos y Biotecnología LIAB/LINA",
    "Ingeniería en Comunicaciones y Electrónica INCE",
    "Ingeniería en Computación INCO",
    "Ingeniería en Informática INFO",
    "Ingeniería Fotónica IGFO",
    "Ingeniería Industrial INDU",
    "Ingeniería Mecánica Eléctrica INME",
    "Ingeniería Química INQU",
    "Ingeniería en Logística y Transporte LOGT",
    "Ingeniería en Topografía Geomática ITOG",
    "Licenciatura en Ciencia de Materiales LCMA",
    "Licenciatura en Física LIFI",
    "Licenciatura en Matemáticas LIMA",
    "Licenciatura en Química LQUI",
    "Licenciatura en Químico Farmacéutico Biólogo LQFB",
  ];

  const handleCompleteProfile = () => {
    // Realiza la validacion aqui antes de marcar el perfil como completo
    if (!name || !lastName || !username) {
      setNameError(!name);
      setLastNameError(!lastName);
      setUsernameError(!username);
      return;
    }

    // Si pasa la validacion, marca el perfil como completo
    setIsProfileComplete(true);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    if (isProfileComplete) {
      const timer = setTimeout(() => {
        navigation.navigate("Inicio");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isProfileComplete, navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.KeyboardAvoidingView}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {!isProfileComplete && (
            <>
              <Text style={styles.title}>Completa tu Perfil</Text>
              <LottieView
                source={require("../assets/animations/completeProfile.json")}
                autoPlay
                loop={true}
                style={styles.animation}
              />
            </>
          )}

          {isProfileComplete ? (
            <View style={{ marginTop: 130 }}>
              <Text style={styles.profileCompleteText}>PERFIL COMPLETADO.</Text>
              <Text style={styles.profileCompleteText}>
                ¡Bienvenido, @{username}!
              </Text>
              <Image
                source={require("../assets/images/cucei.png")}
                style={styles.logo}
              />
              <LottieView
                source={require("../assets/animations/Confetti-2.json")}
                autoPlay
                loop={true}
                style={{
                  position: "absolute",
                  top: -50,
                  left: -30,
                  width: "110%",
                  height: "150%",
                  zIndex: 1,
                }}
              />
            </View>
          ) : (
            <View style={styles.profileBox}>
              <Text style={styles.label}>Nombre:</Text>
              <TextInput
                style={[styles.input, nameError && styles.errorInput]}
                placeholder="Ingresa tu nombre"
                placeholderTextColor="black"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setNameError(false);
                }}
              />
              {nameError && (
                <Text style={styles.errorText}>Campo requerido</Text>
              )}

              <Text style={styles.label}>Apellidos:</Text>
              <TextInput
                style={[styles.input, lastNameError && styles.errorInput]}
                placeholder="Ingresa tus apellidos"
                placeholderTextColor="black"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  setLastNameError(false);
                }}
              />
              {lastNameError && (
                <Text style={styles.errorText}>Campo requerido</Text>
              )}

              <Text style={styles.label}>Nombre de Usuario:</Text>
              <TextInput
                style={[styles.input, usernameError && styles.errorInput]}
                placeholder="@CUCEI_777"
                placeholderTextColor="black"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setUsernameError(false);
                }}
              />
              {usernameError && (
                <Text style={styles.errorText}>Campo requerido</Text>
              )}

              <Text style={styles.label}>Carrera:</Text>
              <TouchableOpacity style={styles.picker} onPress={toggleModal}>
                <Text>{selectedCareer || "Seleccione una carrera"}</Text>
              </TouchableOpacity>

              <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Seleccione una carrera</Text>
                  <ScrollView style={styles.careerOptionsContainer}>
                    {careerOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.careerOption}
                        onPress={() => {
                          setSelectedCareer(option);
                          toggleModal();
                        }}>
                        <Text>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={toggleModal}>
                    <Text style={styles.buttonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </Modal>

              <TouchableOpacity
                style={styles.button}
                onPress={handleCompleteProfile}>
                <Text style={styles.buttonText}>Terminar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E4EDF9",
    width: "100%",
  },

  KeyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#E4EDF9",
    width: "100%",
  },

  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    paddingTop: 10,
  },
  profileBox: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 60,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  errorInput: {
    borderColor: "red",
  },
  picker: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
    padding: 12,
  },
  profileCompleteText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 50,
  },
  button: {
    backgroundColor: "#0b34b0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  careerOptionsContainer: {
    maxHeight: Dimensions.get("window").height * 0.7,
    padding: 20,
    backgroundColor: "#E4EDF9",
    borderRadius: 10,
  },
  careerOption: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    padding: 15,
    marginVertical: 5,
    backgroundColor: "white",
  },
  closeButton: {
    backgroundColor: "#0b34b0",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  logo: {
    width: 300,
    height: 300,
  },
  errorText: {
    color: "red",
    marginTop: 1,
  },
  animation: {
    width: 300,
    height: 200,
  },
});

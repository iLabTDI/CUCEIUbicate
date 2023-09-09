import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import LottieView from 'lottie-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const CompleteProfileScreen = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);

  const careerOptions = [
    "Seleccione una carrera",
    "Licenciatura en Matemáticas LIMA",
    "Licenciatura en Física LIFI",
    "Licenciatura en Química LQUI",
    "Licenciatura en Químico Farmacéutico Biólogo LQFB",
    "Licenciatura en Ciencia de Materiales LCMA",
    "Ingeniería Química INQU",
    "Ingeniería Civil ICIV",
    "Ingeniería en Topografía Geomática ITOG",
    "Ingeniería en Alimentos y Biotecnología LIAB/LINA",
    "Ingeniería Industrial INDU",
    "Ingeniería Mecánica Eléctrica INME",
    "Ingeniería en Logística y Transporte LOGT",
    "Ingeniería en Informática INFO",
    "Ingeniería Biomédica INBI",
    "Ingeniería en Computación INCO",
    "Ingeniería en Comunicaciones y Electrónica INCE",
    "Ingeniería Fotónica IGFO",
    "Ingeniería Robótica INRO"
  ];

  const handleCompleteProfile = () => {
    // Por ahora, solo marcamos el perfil como completo una vez que se complete su registro
    setIsProfileComplete(true);
      // Activa la animación de confeti
    setIsConfettiVisible(true);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };


  //animacion Json de confeti
  const Animacion = () => (
    <LottieView
       // source={require('./confetti.json')}
        autoPlay
        loop={false}
        style={{ width: 500, height: 500 }}
    />
  );
  

  return (
 
    <View style={styles.container}>
      {isProfileComplete ? (
        <>
          {isConfettiVisible && (
            <ConfettiCannon // Muestra la animación de confeti si isConfettiVisible es true
              count={200} // Cantidad de confeti a mostrar
              origin={{ x: -10, y: 0 }} // Origen de la explosión de confeti
              autoStart={true} // Iniciar la animación automáticamente
              fadeOut={true} // Desvanecer el confeti después de un tiempo
            />
          )}
          <Text style={styles.profileCompleteText}>Perfil completado. ¡Bienvenido, {username}! :D</Text>
        </>
      ) : (
        <View>
          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre"
            value={name}
            onChangeText={(text) => setName(text)}
          />

          <Text style={styles.label}>Apellidos:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tus apellidos"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />

          <Text style={styles.label}>Nombre de Usuario:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre de usuario"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />

          <Text style={styles.label}>Carrera:</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={toggleModal}
          >
            <Text>{selectedCareer || 'Seleccione una carrera'}</Text>
          </TouchableOpacity>
          
          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Seleccione una carrera</Text>
              {careerOptions.map((option, index) => (
                <Pressable
                  key={index}
                  style={styles.careerOption}
                  onPress={() => {
                    setSelectedCareer(option);
                    toggleModal();
                  }}
                >
                  <Text>{option}</Text>
                </Pressable>
              ))}
              <Pressable
                style={styles.closeButton}
                onPress={toggleModal}
              >
                <Text style= {styles.buttonText}>Cerrar</Text>
              </Pressable>
            </View>
          </Modal>

          <TouchableOpacity
            style={styles.button}
            onPress={handleCompleteProfile}
          >
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4EDF9', // Color de fondo
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'purple',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
    width: '80%',
  },
  picker: {
    borderWidth: 1,
    borderColor: 'purple',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
    padding: 10,
    width: '80%',
  },
  profileCompleteText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  careerOption: {
    borderWidth: 1,
    borderColor: '0b34b0',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '50%',
    textAlign: 'center'
  },
  closeButton: {
    backgroundColor: '#0b34b0',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  closeButtonText: {
    textAlign: "center",
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CompleteProfileScreen;







/*import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CompleteProfileScreen = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('');
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  const handleCompleteProfile = () => {
    // Aquí puedes agregar la lógica para completar el perfil del usuario
    // Por ahora, solo marcamos el perfil como completo
    setIsProfileComplete(true);
  };

  return (
    <View style={styles.container}>
      {isProfileComplete ? (
        <Text style={styles.profileCompleteText}>Perfil completado. ¡Bienvenido, {username}! :D</Text>
      ) : (
        <View>
          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre"
            value={name}
            onChangeText={(text) => setName(text)}
          />

          <Text style={styles.label}>Apellidos:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tus apellidos"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />

          <Text style={styles.label}>Nombre de Usuario:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre de usuario"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />

          <Text style={styles.label}>Carrera:</Text>
          <Picker
            selectedValue={selectedCareer}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedCareer(itemValue)}
          >
            <Picker.Item label="Seleccione una carrera" value="" />
            <Picker.Item label="Licenciatura en Matemáticas LIMA" value="LIMA" />
            <Picker.Item label="Licenciatura en Física LIFI" value="LIFI" />
            <Picker.Item label="Licenciatura en Química LQUI" value="LQUI" />
            <Picker.Item label="Licenciatura en Químico Farmacéutico Biólogo LQFB" value="LQFB" />
            <Picker.Item label="Licenciatura en Ciencia de Materiales LCMA" value="LCMA" />
            <Picker.Item label="Ingeniería Química INQU" value="INQU" />
            <Picker.Item label="Ingeniería Civil ICIV" value="ICIV" />
            <Picker.Item label="Ingeniería en Topografía Geomática" value="ITOG" />
            <Picker.Item label="Ingeniería en Alimentos y Biotecnología" value="LIAB/LINA" />
            <Picker.Item label="Ingeniería Industrial INDU" value="INDU" />
            <Picker.Item label="Ingeniería Industrial INDU" value="INME" />
            <Picker.Item label="Ingeniería en Logística y Transporte LOGT" value="LOGT" />
            <Picker.Item label="Ingeniería en Informática INNI" value="INNI" />
            <Picker.Item label="Ingeniería Biomédica INBI" value="INBI" />
            <Picker.Item label="Ingeniería en Computación INCO" value="INCO" />
            <Picker.Item label="Ingeniería en Comunicaciones y Electrónica INCE" value="INCE" />
            <Picker.Item label="Ingeniería Fotónica IGFO" value="IGFO" />
            <Picker.Item label="Ingeniería Robótica INRO" value="INRO " />
           
          </Picker>
          <TouchableOpacity
            style={[styles.button]}
              onPress={handleCompleteProfile}
          >
            <Text style={styles.buttonText}>Aceptar</Text>
          </TouchableOpacity>
          
          
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4EDF9', // Color de fondo
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'purple',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 15,
    width: '80%',
  },
  picker: {
    borderWidth: 1,
    borderColor: 'purple',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
    width: '30%',
  },
  profileCompleteText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: "#0b34b0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    textAlign: "center",
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CompleteProfileScreen;
*/ 
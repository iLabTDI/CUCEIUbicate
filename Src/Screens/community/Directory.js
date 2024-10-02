import * as React from "react";
import { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  ActivityIndicator, 
  Image,
  TouchableOpacity,
  Linking
} from "react-native";
import * as FileSystem from 'expo-file-system';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faBuilding,  
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
} from '@fortawesome/free-solid-svg-icons';
import { ErrorComponent } from "../Components/ErrorComponent";

const { width } = Dimensions.get('window');
// Ruta para almacenar el archivo JSON localmente
const LOCAL_JSON_PATH = `${FileSystem.documentDirectory}directory.json`;
// URL de la API para obtener los datos del directorio
const API_URL = "http://148.202.152.59:8001/";

export const Directory = () => {
  // Estado para almacenar los datos del directorio
  const [jsonData, setJsonData] = useState([]);
  // Estado para controlar la visualización del indicador de carga
  const [loading, setLoading] = useState(true);
  // Estado para manejar y mostrar errores
  const [error, setError] = useState(null);

   // Función para obtener la URL completa de la imagen
   const getImageUrl = (imagePath) => {
    const imageName = imagePath.split('/').pop(); // Extrae el nombre de la imagen
    return `http://148.202.152.59:8001/get-image/${imageName}`;
  };

  // Función para obtener los datos del directorio
  const fetchJsonData = async () => {
    try {
      // Verificar si existe un archivo local
      const fileInfo = await FileSystem.getInfoAsync(LOCAL_JSON_PATH);
      console.log("Información del archivo:", fileInfo);

      // Si existe, borrarlo antes de la nueva descarga
      if (fileInfo.exists) {
        console.log("Borrando archivo existente antes de la descarga...");
        await FileSystem.deleteAsync(LOCAL_JSON_PATH);
      }

      console.log("Iniciando la solicitud a la API...");
      const response = await fetch(API_URL);
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.statusText);
      }

      const data = await response.json();
      
      // Verificar si los datos recibidos son un array
      if (Array.isArray(data)) {
        console.log("Guardando datos en el sistema de archivos local...");
        await FileSystem.writeAsStringAsync(LOCAL_JSON_PATH, JSON.stringify(data));
        setJsonData(data);
        setError(null); // Reiniciar el error si la descarga es exitosa
      } else {
        throw new Error("Los datos de la API no son un array");
      }
    } catch (error) {
      console.error("Error al cargar el JSON:", error);

      // Intentar cargar el archivo existente si hay un error
      const fileInfo = await FileSystem.getInfoAsync(LOCAL_JSON_PATH);
      if (fileInfo.exists) {
        console.log("Cargando datos desde el archivo existente...");
        try {
          const existingData = await FileSystem.readAsStringAsync(LOCAL_JSON_PATH);
          setJsonData(JSON.parse(existingData)); // Establece los datos existentes
          setError(null); // Reiniciar el error si se cargan los datos locales
        } catch (readError) {
          console.error("Error al leer el archivo existente:", readError);
          setError("No se pudo leer el archivo local");
        }
      } else {
        console.log("No hay archivo existente para cargar.");
        setError("Sin conexión a internet");
      }
    } finally {
      console.log("Finalizando el proceso de carga.");
      setLoading(false);
    }
  };

  // Efecto para cargar los datos inicialmente y configurar una actualización periódica
  useEffect(() => {
    console.log("Iniciando la carga inicial de datos...");
    fetchJsonData(); // Carga inicial de datos

    // Configurar una actualización periódica cada 30 días
    const intervalId = setInterval(() => {
      console.log("Actualizando datos de la API...");
      fetchJsonData();
    }, 30 * 24 * 60 * 60 * 1000); // 30 días en milisegundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  // Función para abrir la aplicación de correo electrónico
  const openEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  // Función para abrir la aplicación de teléfono
  const openPhone = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  // Renderizar el indicador de carga si los datos están cargando
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0b34b0" />
        <Text style={styles.loadingText}>Cargando directorio...</Text>
      </View>
    );
  }

  // Renderizar un mensaje de error si ocurrió algún problema
  if (error) {
    return (
      <ErrorComponent
        title="Sin conexión a internet"
        message="No se pudo cargar el directorio. Por favor, verifica tu conexión a internet e intenta nuevamente."
        buttonText="Reintentar"
        onRetry={fetchJsonData} 
      />
    );
  }

  // Renderizar un mensaje si no hay datos disponibles
  if (!jsonData || !Array.isArray(jsonData)) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Datos no disponibles.</Text>
      </View>
    );
  }

  // Renderizar la lista de contactos
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {jsonData.map((contact, index) => (
          <View key={index} style={styles.card}>
            {/* Encabezado de la tarjeta con imagen y nombre */}
            <View style={styles.cardHeader}>
              {/* <FontAwesomeIcon icon={faUser} size={20} color="#fff" /> */}
              <Image
                source={{ uri: getImageUrl(contact.imagen) }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.headerText}>
                <Text style={styles.name}>{contact.nombre}</Text>
                <Text style={styles.position}>{contact.puesto}</Text>
              </View>
            </View>
            {/* Cuerpo de la tarjeta con detalles del contacto */}
            <View style={styles.cardBody}>
              {/* Fila de información: Departamento */}
              <View style={styles.infoRow}>
                <FontAwesomeIcon icon={faBuilding} style={styles.icon} />
                <Text style={styles.infoText}>{contact.departamento}</Text>
              </View>
              {/* Fila de información: Dirección */}
              <View style={styles.infoRow}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon} />
                <Text style={styles.infoText}>{contact.direccion}</Text>
              </View>
              {/* Fila de información: Teléfono (con funcionalidad de llamada) */}
              <TouchableOpacity style={styles.infoRow} onPress={() => openPhone(contact.conmutador)}>
                <FontAwesomeIcon icon={faPhone} style={styles.icon} />
                <Text style={[styles.infoText, styles.linkText]}>{contact.conmutador}</Text>
              </TouchableOpacity>
              {/* Fila de información: Correo electrónico (con funcionalidad de envío de correo) */}
              <TouchableOpacity style={styles.infoRow} onPress={() => openEmail(contact.correo_electronico)}>
                <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
                <Text style={[styles.infoText, styles.linkText]}>{contact.correo_electronico}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// Estilos para el componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Fondo gris claro para mejor contraste
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0b34b0',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0b34b0', // Color de fondo para el encabezado
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  position: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 4,
  },
  cardBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    color: '#0b34b0',
    marginRight: 12,
    width: 20,
    height: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  linkText: {
    color: '#0b34b0',
    textDecorationLine: 'underline',
  },
});

export default Directory;
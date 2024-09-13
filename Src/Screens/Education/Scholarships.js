import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Linking, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions
} from "react-native";
import { getJsons } from "../../Api/fetchJsons";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faExternalLinkAlt, faGraduationCap } from "@fortawesome/free-solid-svg-icons";

const { width, height } = Dimensions.get('window');

export const Scholarships = () => {
  const url = 'http://148.202.152.59:8001/becas';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJsons(url).then(result => {
      if (result) {
        setData(result);
      }
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0b34b0" />
        <Text style={styles.loadingText}>Cargando becas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#0b34b0', '#4c669f']}
        style={styles.header}
      >
        <FontAwesomeIcon icon={faGraduationCap} size={40} color="white" />
        <Text style={styles.headerText}>Becas Disponibles</Text>
      </LinearGradient>
      {data ? (
        data.map((option, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.title}>Convocatoria: {option.convocatoria}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Beneficiados:</Text> {option.beneficiados}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Fecha:</Text> {option.fecha}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Resumen:</Text> {option.resumen}</Text>
            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => Linking.openURL(option.hipervinculo)}
            >
              <Text style={styles.linkButtonText}>Más información</Text>
              <FontAwesomeIcon icon={faExternalLinkAlt} size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No se encontraron becas disponibles.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0b34b0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b34b0',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  linkButtonText: {
    color: 'white',
    fontSize: 16,
    marginRight: 8,
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default Scholarships;
import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Linking, 
  RefreshControl
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faExternalLinkAlt, 
  faBook, 
  faGavel, 
  faListOl, 
  faQuoteRight 
} from '@fortawesome/free-solid-svg-icons';
import { LinearGradient } from 'expo-linear-gradient';
import staticJsonData from '../../../json/articles.json';

export const Articles = () => {
  const [jsonData, setJsonData] = useState(staticJsonData);
  const [refreshing, setRefreshing] = useState(false);

  const loadJson = useCallback(() => {
    setRefreshing(true);
    // Simulamos una carga de datos
    setTimeout(() => {
      setJsonData(staticJsonData);
      setRefreshing(false);
    }, 1000);
  }, []);

  const openExternalLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('Error al abrir el enlace:', err));
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadJson} />
      }
    >
      <LinearGradient
        colors={['#0b34b0', '#0056b3']}
        style={styles.header}
      >
        <FontAwesomeIcon icon={faBook} size={24} color="#fff" />
        <Text style={styles.headerTitle}>{jsonData.section_description.name}</Text>
      </LinearGradient>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesomeIcon icon={faGavel} size={24} color="#0b34b0" />
            <Text style={styles.sectionTitle}>Descripción</Text>
          </View>
          {jsonData.section_description.description.map((desc, index) => (
            <Text key={index} style={styles.descriptionText}>{desc}</Text>
          ))}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => openExternalLink(jsonData.section_description.description[2])}
          >
            <Text style={styles.linkButtonText}>Ver Ley</Text>
            <FontAwesomeIcon icon={faExternalLinkAlt} size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {Object.entries(jsonData.artículos).map(([articuloId, articulo]) => (
          <View key={articuloId} style={styles.card}>
            <View style={styles.cardHeader}>
              <FontAwesomeIcon icon={faListOl} size={24} color="#0b34b0" />
              <Text style={styles.articleTitle}>Artículo {articuloId}</Text>
            </View>
            {articulo.incisos.map((inciso, index) => (
              <View key={index} style={styles.incisoContainer}>
                <FontAwesomeIcon icon={faQuoteRight} size={16} color="#0b34b0" style={styles.incisoIcon} />
                <Text style={styles.articleText}>{inciso}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginLeft: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 10,
  },
  linkButton: {
    backgroundColor: '#0b34b0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  linkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginLeft: 10,
  },
  incisoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  incisoIcon: {
    marginTop: 5,
    marginRight: 10,
  },
  articleText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    flex: 1,
  },
});

export default Articles;
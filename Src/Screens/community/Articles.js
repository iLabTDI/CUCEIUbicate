import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Dimensions } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExternalLinkAlt, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import jsonData from "../../../assets/jsons/articles.json";

const { width } = Dimensions.get('window');

export const Articles = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesomeIcon icon={faBookOpen} size={24} color="#fff" />
        <Text style={styles.headerText}>Directorios</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{jsonData.section_description.name}</Text>
          {jsonData.section_description.description.map((desc, index) => (
            <Text key={index} style={styles.descriptionText}>{desc}</Text>
          ))}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => Linking.openURL(jsonData.section_description.description[2])}
          >
            <Text style={styles.linkButtonText}>Ver Ley</Text>
            <FontAwesomeIcon icon={faExternalLinkAlt} size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        {Object.keys(jsonData.artículos).map((articuloId) => (
          <View key={articuloId} style={styles.card}>
            <Text style={styles.articleTitle}>Artículo {articuloId}</Text>
            {jsonData.artículos[articuloId].incisos.map((inciso, index) => (
              <Text key={index} style={styles.articleText}>{inciso}</Text>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0b34b0',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
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
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginBottom: 15,
  },
  articleText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
});

export default Articles;
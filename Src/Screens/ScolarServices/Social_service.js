import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faHandshake, 
  faChevronRight,
  faUniversity,
  faFileAlt,
  faUsers,
  faLink,
  faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import staticJsonData from '../../../json/social_service.json';

export const Social_service = () => {
  const [jsonData, setJsonData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadJsonFromStorage();
  }, []);

  const loadJsonFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('socialServiceData');
      if (storedData !== null) {
        setJsonData(JSON.parse(storedData));
      } else {
        setJsonData(staticJsonData);
        await AsyncStorage.setItem('socialServiceData', JSON.stringify(staticJsonData));
      }
    } catch (error) {
      console.error('Error loading data from storage:', error);
      setJsonData(staticJsonData);
    }
  };

  const loadJson = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulating an API call or data refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      await AsyncStorage.setItem('socialServiceData', JSON.stringify(staticJsonData));
      setJsonData(staticJsonData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const deletJsData = async () => {
    try {
      await AsyncStorage.removeItem('socialServiceData');
      setJsonData(null);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const getIcon = (sectionId) => {
    const icons = {
      1: faUniversity,
      2: faFileAlt,
      3: faUsers,
      default: faHandshake
    };
    return icons[sectionId] || icons.default;
  };

  const renderListItem = (text, index) => (
    <View key={index} style={styles.listItem}>
      <FontAwesomeIcon icon={faChevronRight} size={14} color="#0056b3" style={styles.listItemIcon} />
      <Text style={styles.listItemText}>{text}</Text>
    </View>
  );

  const renderLink = (url, text) => (
    <TouchableOpacity 
      style={styles.linkContainer} 
      onPress={() => Linking.openURL(url)}
    >
      <FontAwesomeIcon icon={faLink} size={16} color="#0056b3" style={styles.linkIcon} />
      <Text style={styles.linkText}>{text}</Text>
      <FontAwesomeIcon icon={faExternalLinkAlt} size={12} color="#0056b3" style={styles.externalLinkIcon} />
    </TouchableOpacity>
  );

  if (!jsonData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadJson} />
        }
      >
        <LinearGradient
          colors={['#0056b3', '#007bff']}
          style={styles.header}
        >
          <FontAwesomeIcon icon={faHandshake} size={24} color="#fff" />
          <Text style={styles.headerTitle}>Servicio Social</Text>
        </LinearGradient>
        {Object.entries(jsonData.section_description["sub-sections"]).map(([sectionId, section]) => (
          <View key={sectionId} style={styles.card}>
            <View style={styles.sectionHeader}>
              <FontAwesomeIcon icon={getIcon(sectionId)} size={24} color="#0056b3" />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            {section.content && <Text style={styles.content}>{section.content}</Text>}
            {section["listed-elements"] && Object.values(section["listed-elements"]).map((element, index) => renderListItem(element, index))}
            {section["mini-subsections"] && Object.entries(section["mini-subsections"]).map(([subsectionId, subsection]) => (
              <View key={subsectionId} style={styles.miniSubsection}>
                <Text style={styles.miniSubsectionTitle}>{subsection.title}</Text>
                {subsection.content && <Text style={styles.content}>{subsection.content}</Text>}
                {subsection["listed-elements"] && Object.values(subsection["listed-elements"]).map((element, index) => renderListItem(element, index))}
              </View>
            ))}
            {section.links && Object.entries(section.links).map(([linkId, linkData]) => (
              renderLink(linkData.url, linkData.text)
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  card: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0056b3',
    marginLeft: 10,
  },
  content: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  listItemIcon: {
    marginTop: 4,
    marginRight: 10,
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  miniSubsection: {
    marginTop: 15,
    marginLeft: 15,
  },
  miniSubsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 10,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e1e8ed',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  linkIcon: {
    marginRight: 10,
  },
  linkText: {
    fontSize: 16,
    color: '#0056b3',
    flex: 1,
  },
  externalLinkIcon: {
    marginLeft: 5,
  },
});

export default Social_service;
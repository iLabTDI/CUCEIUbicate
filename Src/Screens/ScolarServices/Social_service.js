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
  Dimensions,
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

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

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
      <FontAwesomeIcon icon={faChevronRight} size={isTablet ? 16 : 14} color="#0056b3" style={styles.listItemIcon} />
      <Text style={styles.listItemText}>{text}</Text>
    </View>
  );

  const renderLink = (url, text) => (
    <TouchableOpacity 
      style={styles.linkContainer} 
      onPress={() => Linking.openURL(url)}
    >
      <FontAwesomeIcon icon={faLink} size={isTablet ? 20 : 16} color="#0056b3" style={styles.linkIcon} />
      <Text style={styles.linkText}>{text}</Text>
      <FontAwesomeIcon icon={faExternalLinkAlt} size={isTablet ? 16 : 12} color="#0056b3" style={styles.externalLinkIcon} />
    </TouchableOpacity>
  );

  if (!jsonData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadJson} />
        }
      >
        <LinearGradient
          colors={['#0056b3', '#007bff']}
          style={styles.header}
        >
          <FontAwesomeIcon icon={faHandshake} size={isTablet ? 32 : 24} color="#fff" />
          <Text style={styles.headerTitle}>Servicio Social</Text>
        </LinearGradient>
        {Object.entries(jsonData.section_description["sub-sections"]).map(([sectionId, section]) => (
          <View key={sectionId} style={styles.card}>
            <View style={styles.sectionHeader}>
              <FontAwesomeIcon icon={getIcon(sectionId)} size={isTablet ? 28 : 24} color="#0056b3" />
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
  contentContainer: {
    paddingHorizontal: isTablet ? 24 : 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: isTablet ? 20 : 16,
    color: '#0056b3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 30 : 20,
    borderBottomLeftRadius: isTablet ? 30 : 20,
    borderBottomRightRadius: isTablet ? 30 : 20,
  },
  headerTitle: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: isTablet ? 15 : 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginVertical: isTablet ? 15 : 10,
    padding: isTablet ? 24 : 20,
    borderRadius: isTablet ? 16 : 12,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 20 : 15,
  },
  sectionTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: '#0056b3',
    marginLeft: isTablet ? 15 : 10,
  },
  content: {
    fontSize: isTablet ? 18 : 16,
    color: '#333',
    marginBottom: isTablet ? 15 : 10,
    lineHeight: isTablet ? 28 : 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: isTablet ? 15 : 10,
  },
  listItemIcon: {
    marginTop: isTablet ? 6 : 4,
    marginRight: isTablet ? 15 : 10,
  },
  listItemText: {
    fontSize: isTablet ? 18 : 16,
    color: '#333',
    flex: 1,
  },
  miniSubsection: {
    marginTop: isTablet ? 20 : 15,
    marginLeft: isTablet ? 20 : 15,
  },
  miniSubsectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: isTablet ? 15 : 10,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e1e8ed',
    padding: isTablet ? 15 : 10,
    borderRadius: isTablet ? 12 : 8,
    marginTop: isTablet ? 15 : 10,
  },
  linkIcon: {
    marginRight: isTablet ? 15 : 10,
  },
  linkText: {
    fontSize: isTablet ? 18 : 16,
    color: '#0056b3',
    flex: 1,
  },
  externalLinkIcon: {
    marginLeft: isTablet ? 10 : 5,
  },
});

export default Social_service;
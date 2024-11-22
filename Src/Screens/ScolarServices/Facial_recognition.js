import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faChevronRight, 
  faUserGraduate, 
  faExclamationTriangle,
  faCamera, 
} from '@fortawesome/free-solid-svg-icons';
import staticJsonData from '../../../json/face_access.json';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export const Facial_recognition = () => {
  const [jsonData, setJsonData] = useState(staticJsonData);
  const [refreshing, setRefreshing] = useState(false);

  const loadJson = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => {
      setJsonData(staticJsonData);
      setRefreshing(false);
    }, 1000);
  }, []);

  const renderListItem = (text, index) => (
    <View key={index} style={styles.listItemContainer}>
      <FontAwesomeIcon 
        icon={faChevronRight} 
        size={isTablet ? 18 : 16} 
        color="#0b34b0" 
        style={styles.listItemIcon}
      />
      <Text style={styles.listItem}>{text}</Text>
    </View>
  );

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadJson} />
      }
    >
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <FontAwesomeIcon icon={faCamera} size={isTablet ? 28 : 24} color="#0b34b0" />
            <Text style={styles.title}>{jsonData["section-description"].name}</Text>
          </View>
          <Text style={styles.descriptionText}>
            {jsonData["section-description"].description}
          </Text>
          <View style={styles.listTitleContainer}>
            <FontAwesomeIcon icon={faUserGraduate} size={isTablet ? 24 : 20} color="#0b34b0" />
            <Text style={styles.listTitle}>{jsonData["section-description"].tittle}</Text>
          </View>
          {Object.values(jsonData["section-description"]["listed-elements"]).map((item, index) => renderListItem(item, index))}
          <View style={styles.noteContainer}>
            <FontAwesomeIcon icon={faExclamationTriangle} size={isTablet ? 18 : 16} color="#f39c12" />
            <Text style={styles.noteText}>
              Si tienes problemas, acude a la Coordinación de Seguridad y Protección Universitaria.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingHorizontal: isTablet ? 24 : 16,
  },
  content: {
    paddingVertical: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: isTablet ? 24 : 20,
    marginBottom: 20,
    borderRadius: isTablet ? 12 : 10,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 15 : 10,
  },
  title: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginLeft: isTablet ? 15 : 10,
  },
  descriptionText: {
    fontSize: isTablet ? 18 : 16,
    color: '#333333',
    lineHeight: isTablet ? 28 : 24,
    marginBottom: isTablet ? 20 : 15,
  },
  listTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isTablet ? 15 : 10,
  },
  listTitle: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginLeft: isTablet ? 15 : 10,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: isTablet ? 15 : 10,
  },
  listItemIcon: {
    marginTop: isTablet ? 6 : 4,
    marginRight: isTablet ? 15 : 10,
  },
  listItem: {
    fontSize: isTablet ? 18 : 16,
    color: '#333333',
    lineHeight: isTablet ? 28 : 24,
    flex: 1,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff9c4',
    padding: isTablet ? 15 : 10,
    borderRadius: isTablet ? 8 : 5,
    marginTop: isTablet ? 20 : 15,
  },
  noteText: {
    fontSize: isTablet ? 16 : 14,
    color: '#333333',
    marginLeft: isTablet ? 15 : 10,
    flex: 1,
  },
});

export default Facial_recognition;
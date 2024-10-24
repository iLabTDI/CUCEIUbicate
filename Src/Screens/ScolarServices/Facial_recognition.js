import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faChevronRight, 
  faUserGraduate, 
  faExclamationTriangle,
  faCamera, 
} from '@fortawesome/free-solid-svg-icons';
import staticJsonData from '../../../json/face_access.json';

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
        size={16} 
        color="#0b34b0" 
        style={styles.listItemIcon}
      />
      <Text style={styles.listItem}>{text}</Text>
    </View>
  );

  return (
    <ScrollView 
      style={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadJson} />
      }
    >
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <FontAwesomeIcon icon={faCamera} size={24} color="#0b34b0" />
            <Text style={styles.title}>{jsonData["section-description"].name}</Text>
          </View>
          <Text style={styles.descriptionText}>
            {jsonData["section-description"].description}
          </Text>
          <View style={styles.listTitleContainer}>
            <FontAwesomeIcon icon={faUserGraduate} size={20} color="#0b34b0" />
            <Text style={styles.listTitle}>{jsonData["section-description"].tittle}</Text>
          </View>
          {Object.values(jsonData["section-description"]["listed-elements"]).map((item, index) => renderListItem(item, index))}
          <View style={styles.noteContainer}>
            <FontAwesomeIcon icon={faExclamationTriangle} size={16} color="#f39c12" />
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
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginLeft: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 15,
  },
  listTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginLeft: 10,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  listItemIcon: {
    marginTop: 4,
    marginRight: 10,
  },
  listItem: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    flex: 1,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff9c4',
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  noteText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 10,
    flex: 1,
  },
});

export default Facial_recognition;
import * as React from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLink, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import jsonData from "../../../assets/jsons/social_service.json";

const isURL = (text) => {
  const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
  return urlPattern.test(text);
};

const renderElement = (element, index) => {
  if (Array.isArray(element)) {
    return element.map((item, idx) => renderElement(item, idx));
  } else if (typeof element === 'string') {
    return isURL(element) ? (
      <TouchableOpacity key={index} onPress={() => Linking.openURL(element)} style={styles.linkContainer}>
        <FontAwesomeIcon icon={faLink} size={16} color="#0b34b0" />
        <Text style={styles.link}>{element}</Text>
      </TouchableOpacity>
    ) : (
      <Text key={index} style={styles.text}>{element}</Text>
    );
  } else if (typeof element === 'object') {
    return Object.keys(element).map((key) => renderElement(element[key], key));
  }
  return null;
};

export const Social_service = () => {
  return (
    <ScrollView style={styles.container}>
      {Object.keys(jsonData.section_description["sub-sections"]).map((sectionId) => {
        const section = jsonData.section_description["sub-sections"][sectionId];
        return (
          <View key={sectionId} style={styles.card}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.content && renderElement(section.content)}
            {section["listed-elements"] && Object.keys(section["listed-elements"]).map((elementId) => {
              const element = section["listed-elements"][elementId];
              return (
                <View key={elementId}>
                  {/* <FontAwesomeIcon icon={faChevronRight} size={12} color="#0b34b0" style={styles.listIcon} /> */}
                  {renderElement(element, elementId)}
                </View>
              );
            })}
            {section["mini-subsections"] && Object.keys(section["mini-subsections"]).map((subsectionId) => {
              const subsection = section["mini-subsections"][subsectionId];
              return (
                <View key={subsectionId} style={styles.subsection}>
                  <Text style={styles.subsectionTitle}>{subsection.title}</Text>
                  {subsection.content && renderElement(subsection.content)}
                  {subsection["listed-elements"] && Object.keys(subsection["listed-elements"]).map((elementId) => {
                    const element = subsection["listed-elements"][elementId];
                    return (
                      <View key={elementId} >
                        {/* <FontAwesomeIcon icon={faChevronRight} size={12} color="#0b34b0" style={styles.listIcon} /> */}
                        {renderElement(element, elementId)}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        );
      })}
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
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginBottom: 15,
  },
  subsection: {
    marginTop: 15,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0b34b0',
    marginBottom: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'justify',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  link: {
    flex: 1,
    fontSize: 16,
    color: '#0b34b0',
    textDecorationLine: 'underline',
    marginLeft: 8,
  },
  listItem: {
    // flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    // flexWrap: 'wrap',
  },                      
  listIcon: {
    marginRight: 3,
    marginTop: 5,
  },
});

export default Social_service;
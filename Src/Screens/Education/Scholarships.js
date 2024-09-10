import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import { getJsons } from "../../Api/fetchJsons";

export const Scholarships = () => {
  const url = 'http://148.202.152.59:8001/becas';
  const [data, setData] = useState(null);

  useEffect(() => {
    getJsons(url).then(result => {
      if (result) {
        setData(result); 
      }
    }).catch(error => {
      console.error("Error fetching data:", error);
    });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {data ? (
          data.map((option, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.title}>Convocatoria: {option.convocatoria}</Text>
              <Text style={styles.text}>Beneficiados: {option.beneficiados}</Text>
              <Text style={styles.text}>Fecha: {option.fecha}</Text>
              <Text style={styles.text}>Resumen: {option.resumen}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(option.hipervinculo)}>
                <Text style={styles.link}>Más información</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>Cargando datos...</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  link: {
    fontSize: 16,
    color: 'blue',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
});

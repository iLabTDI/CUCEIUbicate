import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';

const jsonFilePath = `${FileSystem.documentDirectory}cid.json`;
const cidUrl = "http://148.202.152.59:8001/json/cid";

export const CID = () => {
    const [jsonData, setJsonData] = useState(null);
    const [error, setError] = useState(null); // Estado para manejar errores

    const downloadJson = async () => {
        console.log(`Descargando desde ${cidUrl}...`);
        try {
            // Intentamos descargar el nuevo JSON sin eliminar el archivo viejo
            const response = await fetch(cidUrl);
            if (!response.ok) {
                throw new Error(`Error al descargar desde ${cidUrl}`);
            }

            const json = await response.json();

            // Guardamos el nuevo JSON
            await FileSystem.writeAsStringAsync(jsonFilePath, JSON.stringify(json));
            console.log(`Archivo guardado en: ${jsonFilePath}`);
            setJsonData(json); // Establece los datos JSON
            setError(null); // Reinicia el error si la descarga es exitosa

            // No es necesario eliminar el archivo viejo porque ya lo hemos sobrescrito
        } catch (error) {
            console.error("Error al descargar el archivo:", error);
            setError("Sin conexión a internet"); // Establece el mensaje de error

            // Intentamos cargar el archivo existente si está disponible
            const fileInfo = await FileSystem.getInfoAsync(jsonFilePath);
            if (fileInfo.exists) {
                console.log(`Usando archivo existente en: ${jsonFilePath}`);
                try {
                    const json = await FileSystem.readAsStringAsync(jsonFilePath);
                    setJsonData(JSON.parse(json)); // Establece los datos JSON
                    setError(null); // Reinicia el error si se pueden leer los datos locales
                } catch (readError) {
                    console.error("Error al leer el archivo:", readError);
                    setError("No se pudo leer el archivo local");
                }
            } else {
                console.log(`No se pudo descargar y el archivo no existe: ${jsonFilePath}`);
                // Mantiene el mensaje de error existente
            }
        }
    };

    useEffect(() => {
        downloadJson(); // Inicia la descarga y verificación
    }, []);

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!jsonData) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0b34b0" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.title}>{jsonData.section_description.name}</Text>
                    {jsonData.section_description.description.map((desc, index) => (
                        <Text key={index} style={styles.descriptionText}>
                            {desc}
                        </Text>
                    ))}
                </View>
                {Object.keys(jsonData.section_description["sub-sections"]).map((subsectionId) => {
                    const subsection = jsonData.section_description["sub-sections"][subsectionId];
                    return (
                        <View key={subsectionId} style={styles.card}>
                            <Text style={styles.subsectionTitle}>{subsection.title}</Text>
                            {Object.keys(subsection["listed-elements"]).map((elementId) => {
                                const element = subsection["listed-elements"][elementId];
                                return (
                                    <Text key={elementId} style={styles.descriptionText}>
                                        {element}
                                    </Text>
                                );
                            })}
                        </View>
                    );
                })}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0b34b0',
        marginBottom: 10,
    },
    subsectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0b34b0',
        marginTop: 15,
    },
    descriptionText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        marginBottom: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});

export default CID;

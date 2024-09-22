import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CID = () => {
    return (
        <View style={styles.content}>
            <View style={styles.card}>
                <Text style={styles.title}>Biblioteca Central de CUCEI</Text>
                <Text style={styles.descriptionText}>
                    La biblioteca central de CUCEI es un espacio dedicado al estudio y la investigación, 
                    ofreciendo una amplia colección de libros, revistas y recursos digitales para apoyar 
                    a los estudiantes y profesores en sus actividades académicas.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
    descriptionText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
});

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export const DeleteLocalFiles = ({ onFilesDeleted }) => {
  const handleDeleteFiles = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      const webpFiles = files.filter(file => file.endsWith('.webp'));

      if (webpFiles.length === 0) {
        Alert.alert('Información', 'No hay archivos para eliminar.');
        return;
      }

      Alert.alert(
        'Confirmar eliminación',
        `¿Estás seguro de que quieres eliminar ${webpFiles.length} archivos?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Eliminar',
            onPress: async () => {
              for (const file of webpFiles) {
                await FileSystem.deleteAsync(`${FileSystem.documentDirectory}${file}`);
                console.log(`Archivo eliminado: ${file}`);
              }
              Alert.alert('Éxito', 
                'Archivos eliminados correctamente.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      if (onFilesDeleted) {
                        onFilesDeleted();
                      }
                    }
                  }
                ]
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error al eliminar archivos:', error);
      Alert.alert('Error', 'No se pudieron eliminar los archivos.');
    }
  };

  return (
    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteFiles}>
      <FontAwesomeIcon icon={faTrash} size={20} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 20,
  },
});

export default DeleteLocalFiles;
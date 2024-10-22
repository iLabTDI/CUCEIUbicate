import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { supabase } from '../../Api/lib/supabase';
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCloudDownloadAlt,
  faTrashAlt,
  faCheckCircle,
  faExclamationTriangle,
  faFolder,
  faPause,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BATCH_SIZE = 5;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 100;
const CACHE_KEY = 'downloadedFiles';

export const FileManagement = ({ route, navigation }) => {
  const [files, setFiles] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [errorLog, setErrorLog] = useState([]);

  const { startDownloadAutomatically = true } = route.params || {};
  const cancelDownloadRef = useRef(false);

  const checkNetworkConnection = useCallback(async () => {
    try {
      const networkStatus = await Network.getNetworkStateAsync();
      setIsConnected(networkStatus.isConnected);
      return networkStatus.isConnected;
    } catch (error) {
      console.error('Error al verificar la conexión de red:', error);
      setIsConnected(false);
      return false;
    }
  }, []);

  const fetchFileList = useCallback(async () => {
    setIsLoading(true);
    try {
      let allFiles = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase.storage
          .from('route_images')
          .list('route_images', {
            limit: pageSize,
            offset: page * pageSize,
            sortBy: { column: 'name', order: 'asc' },
          });

        if (error) throw error;

        if (data.length === 0) {
          hasMore = false;
        } else {
          allFiles = [...allFiles, ...data];
          page++;
        }
      }

      const cachedFiles = await AsyncStorage.getItem(CACHE_KEY);
      const downloadedFiles = cachedFiles ? JSON.parse(cachedFiles) : {};

      const fileInfos = allFiles
        .filter((file) => file.name.endsWith('.webp'))
        .map((file) => ({
          name: file.name,
          size: file.metadata.size,
          downloaded: !!downloadedFiles[file.name],
        }));

      setFiles(fileInfos);
      setTotalSize(fileInfos.reduce((acc, file) => acc + file.size, 0));
      console.log(`Total de archivos obtenidos: ${fileInfos.length}`);
    } catch (error) {
      console.error('Error al obtener la lista de archivos:', error);
      setErrorLog((prev) => [...prev, { type: 'fetch', message: error.message }]);
      Alert.alert('Error', 'No se pudieron obtener los archivos. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const downloadFile = async (file, retryCount = 0) => {
    if (cancelDownloadRef.current) {
      throw new Error('Descarga cancelada');
    }

    try {
      const { data, error } = await supabase.storage
        .from('route_images')
        .download(`route_images/${file.name}`);

      if (error) throw error;

      const localUri = `${FileSystem.documentDirectory}${file.name}`;
      const base64data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(data);
      });

      await FileSystem.writeAsStringAsync(localUri, base64data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return { ...file, downloaded: true };
    } catch (error) {
      console.error(`Error al descargar ${file.name}:`, error);
      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, INITIAL_RETRY_DELAY * Math.pow(2, retryCount)));
        return downloadFile(file, retryCount + 1);
      } else {
        throw error;
      }
    }
  };

  const downloadBatch = async (batch) => {
    const downloadPromises = batch.map(file => downloadFile(file));
    const results = await Promise.allSettled(downloadPromises);
    
    const successfulDownloads = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
    
    const failedDownloads = results
      .filter(result => result.status === 'rejected')
      .map((result, index) => ({
        file: batch[index],
        error: result.reason
      }));

    setErrorLog(prev => [
      ...prev,
      ...failedDownloads.map(({ file, error }) => ({
        type: 'download',
        file: file.name,
        message: error.message
      }))
    ]);

    return successfulDownloads;
  };

  const downloadFiles = useCallback(async () => {
    if (!isConnected) {
      Alert.alert('Error', 'No hay conexión a internet. Por favor, intenta nuevamente.');
      return;
    }

    setDownloadStatus('downloading');
    cancelDownloadRef.current = false;
    let downloadedSize = 0;
    let updatedFiles = [...files];
    const filesToDownload = files.filter(file => !file.downloaded);
    const totalBatches = Math.ceil(filesToDownload.length / BATCH_SIZE);

    try {
      for (let i = 0; i < totalBatches; i++) {
        if (cancelDownloadRef.current) break;

        setCurrentBatch(i + 1);
        const batch = filesToDownload.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
        const downloadedFiles = await downloadBatch(batch);

        downloadedFiles.forEach(file => {
          const index = updatedFiles.findIndex(f => f.name === file.name);
          if (index !== -1) {
            updatedFiles[index] = file;
            downloadedSize += file.size;
          }
        });

        setFiles(updatedFiles);
        const progress = Math.min((downloadedSize / totalSize) * 100, 100);
        setDownloadProgress(progress);

        // Actualizar caché
        const downloadedFileNames = updatedFiles
          .filter(file => file.downloaded)
          .reduce((acc, file) => ({ ...acc, [file.name]: true }), {});
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(downloadedFileNames));
      }

      if (!cancelDownloadRef.current) {
        setDownloadStatus('completed');
        console.log('Todos los archivos se han descargado correctamente');
        Alert.alert('Éxito', 'Todos los archivos se han descargado correctamente.');
      } else {
        setDownloadStatus('paused');
        console.log('Descarga pausada');
      }
    } catch (error) {
      console.error('Error al descargar archivos:', error);
      setDownloadStatus('error');
      setErrorLog(prev => [...prev, { type: 'general', message: error.message }]);
      Alert.alert('Error', 'Ocurrió un error durante la descarga. Intenta nuevamente.');
    }
  }, [files, isConnected, totalSize]);

  useEffect(() => {
    const initializeComponent = async () => {
      const isNetworkConnected = await checkNetworkConnection();
      if (isNetworkConnected) {
        await fetchFileList();
      } else {
        Alert.alert('Error de conexión', 'No hay conexión a internet. Por favor, verifica tu conexión e intenta nuevamente.');
      }
    };

    initializeComponent();
  }, [checkNetworkConnection, fetchFileList]);

  useEffect(() => {
    if (files.length > 0 && !files.every(f => f.downloaded) && startDownloadAutomatically && downloadStatus === 'idle') {
      downloadFiles();
    } else if (files.every(f => f.downloaded)) {
      setDownloadStatus('completed');
      setDownloadProgress(100);
    }
  }, [files, startDownloadAutomatically, downloadFiles, downloadStatus]);

  const deleteFiles = async () => {
    try {
      for (const file of files) {
        const localUri = `${FileSystem.documentDirectory}${file.name}`;
        await FileSystem.deleteAsync(localUri, { idempotent: true });
      }
      await AsyncStorage.removeItem(CACHE_KEY);
      await fetchFileList();
      setDownloadProgress(0);
      setDownloadStatus('idle');
      setErrorLog([]);
      console.log('Todos los archivos han sido eliminados');
      Alert.alert('Éxito', 'Todos los archivos han sido eliminados.');
    } catch (error) {
      console.error('Error al eliminar archivos:', error);
      setErrorLog(prev => [...prev, { type: 'delete', message: error.message }]);
      Alert.alert('Error', 'Ocurrió un error al eliminar los archivos. Intenta nuevamente.');
    }
  };

  const pauseDownload = () => {
    cancelDownloadRef.current = true;
    setDownloadStatus('paused');
  };

  const resumeDownload = () => {
    cancelDownloadRef.current = false;
    downloadFiles();
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Gestión de Archivos</Text>
          <Text style={styles.description}>Descarga y elimina archivos de rutas</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="#0033A0" style={styles.loader} />
          ) : (
            <>
              <View style={styles.fileInfoContainer}>
                <View style={styles.fileIconContainer}>
                  <FontAwesomeIcon icon={faFolder} size={40} color="#0033A0" />
                  <Text style={styles.fileCount}>{files.length} archivos</Text>
                </View>
                <View style={styles.fileSizeContainer}>
                  <Text style={styles.totalSizeLabel}>Tamaño total:</Text>
                  <Text style={styles.totalSizeValue}>{formatSize(totalSize)}</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${downloadProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>
                  {downloadStatus === 'downloading'
                    ? `${Math.round(downloadProgress)}% (Lote ${currentBatch})`
                    : downloadStatus === 'completed'
                    ? 'Archivos Descargados'
                    : downloadStatus === 'paused'
                    ? 'Descarga Pausada'
                    : 'Listo para descargar'}
                </Text>
              </View>

              {downloadStatus === 'completed' && (
                <View style={styles.statusContainer}>
                  <FontAwesomeIcon icon={faCheckCircle} color="#4CAF50" size={24} />
                  <Text style={[styles.statusText, { color: '#4CAF50' }]}>
                    Todos los archivos están descargados
                  </Text>
                </View>
              )}

              {downloadStatus === 'error' && (
                <View style={styles.statusContainer}>
                  <FontAwesomeIcon icon={faExclamationTriangle} color="#FF5252" size={24} />
                  <Text style={styles.statusText}>
                    Error en la descarga. Intente nuevamente.
                  </Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                {downloadStatus === 'downloading' ? (
                  <TouchableOpacity
                    style={[styles.button, styles.pauseButton]}
                    onPress={pauseDownload}
                  >
                    <FontAwesomeIcon icon={faPause} color="#FFFFFF" size={20} style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Pausar</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      styles.downloadButton,
                      downloadStatus === 'completed' && styles.disabledButton
                    ]}
                    onPress={downloadStatus === 'paused' ? resumeDownload : downloadFiles}
                    disabled={downloadStatus === 'completed'}
                  >
                    <FontAwesomeIcon 
                      icon={downloadStatus === 'paused' ? faPlay : faCloudDownloadAlt} 
                      color="#FFFFFF" 
                      size={20} 
                      style={styles.buttonIcon} 
                    />
                    <Text style={styles.buttonText}>
                      {downloadStatus === 'paused' ? 'Reanudar' : 'Descargar'}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={deleteFiles}
                >
                  <FontAwesomeIcon icon={faTrashAlt} color="#FFFFFF" size={20} style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>

              {errorLog.length > 0 && (
                <View style={styles.errorLogContainer}>
                  <Text style={styles.errorLogTitle}>Registro de Errores:</Text>
                  {errorLog.map((error, index) => (
                    <Text key={index} style={styles.errorLogText}>
                      {error.type === 'download' ? `Error al descargar ${error.file}: ` : ''}
                      {error.message}
                    </Text>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 16,
    paddingTop: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0033A0',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  loader: {
    marginVertical: 20,
  },
  fileInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    padding: 16,
  },
  fileIconContainer: {
    alignItems: 'center',
  },
  fileCount: {
    marginTop: 8,
    fontSize: 16,
    color: '#0033A0',
    fontWeight: 'bold',
  },
  fileSizeContainer: {
    alignItems: 'flex-end',
  },
  totalSizeLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalSizeValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0033A0',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  progressText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#0033A0',
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    width: '48%',
  },
  downloadButton: {
    backgroundColor: '#0033A0',
  },
  pauseButton: {
    backgroundColor: '#FFA000',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorLogContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
  },
  errorLogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 8,
  },
  errorLogText: {
    fontSize: 14,
    color: '#D32F2F',
    marginBottom: 4,
  },
});
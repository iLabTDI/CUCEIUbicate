import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { supabase } from '../../../Api/lib/supabase';
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCloudDownloadAlt,
  faTrashAlt,
  faPause,
  faPlay,
  faGraduationCap,
  faCode,
  faIndustry,
  faFlask,
  faCog,
  faPencilRuler,
  faChartLine,
  faLandmark,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const BATCH_SIZE = 5;
const CACHE_KEY = 'downloadedFiles';
const { width } = Dimensions.get('window');

export const FileManagement = ({ route }) => {
  const [divisions, setDivisions] = useState([]);
  const [divisionData, setDivisionData] = useState({});
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState({});
  const [downloadStatus, setDownloadStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [errorLog, setErrorLog] = useState([]);

  const { user } = route.params;
  const userData = Array.isArray(user) ? user[0] : user;
  const userDivision = userData.degree_code;

  const cancelDownloadRef = useRef({});

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

  const fetchDivisions = useCallback(async () => {
    try {
      const { data, error } = await supabase.storage
        .from('route_images')
        .list('');

      if (error) throw error;

      const divisionFolders = data
        .filter((item) => item.name.startsWith('Rutas_'))
        .map((folder) => folder.name.replace('Rutas_', ''));
      setDivisions(divisionFolders);

      if (userDivision && divisionFolders.includes(userDivision)) {
        setSelectedDivision(userDivision);
      }

      await Promise.all(divisionFolders.map(fetchDivisionData));
    } catch (error) {
      console.error('Error al obtener las divisiones:', error);
      setErrorLog((prev) => [
        ...prev,
        {
          type: 'fetch',
          message: 'Error al obtener las divisiones: ' + error.message,
        },
      ]);
    }
  }, [userDivision]);

  const fetchDivisionData = useCallback(async (division) => {
    try {
      const { data, error } = await supabase.storage
        .from('route_images')
        .list(`Rutas_${division}`, {
          limit: 1000,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (error) throw error;

      const cachedFiles = await AsyncStorage.getItem(CACHE_KEY);
      const downloadedFiles = cachedFiles ? JSON.parse(cachedFiles) : {};

      const fileInfos = data
        .filter((file) => file.name.endsWith('.webp'))
        .map((file) => ({
          name: file.name,
          size: file.metadata.size,
          downloaded: !!downloadedFiles[`Rutas_${division}/${file.name}`],
        }));

      const totalSize = fileInfos.reduce((acc, file) => acc + file.size, 0);
      const downloadedSize = fileInfos
        .filter((file) => file.downloaded)
        .reduce((acc, file) => acc + file.size, 0);

      setDivisionData((prev) => ({
        ...prev,
        [division]: {
          files: fileInfos,
          totalSize,
          downloadedSize,
          fileCount: fileInfos.length,
        },
      }));

      setDownloadProgress((prev) => ({
        ...prev,
        [division]: totalSize > 0 ? (downloadedSize / totalSize) * 100 : 0,
      }));

      setDownloadStatus((prev) => ({
        ...prev,
        [division]: downloadedSize === totalSize && totalSize > 0 ? 'completed' : 'idle',
      }));
    } catch (error) {
      console.error(
        `Error al obtener datos de la división ${division}:`,
        error
      );
      setErrorLog((prev) => [
        ...prev,
        {
          type: 'fetch',
          message: `Error al obtener datos de ${division}: ${error.message}`,
        },
      ]);
    }
  }, []);

  const downloadFiles = useCallback(
    async (division) => {
      if (!isConnected) {
        Alert.alert(
          'Error',
          'No hay conexión a internet. Por favor, intenta nuevamente.'
        );
        return;
      }

      setDownloadStatus((prev) => ({ ...prev, [division]: 'downloading' }));
      cancelDownloadRef.current[division] = false;
      const { files, totalSize } = divisionData[division];
      let downloadedSize = files
        .filter((file) => file.downloaded)
        .reduce((acc, file) => acc + file.size, 0);
      const filesToDownload = files.filter((file) => !file.downloaded);
      const totalBatches = Math.ceil(filesToDownload.length / BATCH_SIZE);

      try {
        for (let i = 0; i < totalBatches; i++) {
          if (cancelDownloadRef.current[division]) break;

          const batch = filesToDownload.slice(
            i * BATCH_SIZE,
            (i + 1) * BATCH_SIZE
          );
          const downloadedFiles = await downloadBatch(batch, division);

          downloadedFiles.forEach((file) => {
            downloadedSize += file.size;
          });

          const progress = totalSize > 0 ? Math.min((downloadedSize / totalSize) * 100, 100) : 0;
          setDownloadProgress((prev) => ({ ...prev, [division]: progress }));

          // Actualizar caché
          const cachedFiles = await AsyncStorage.getItem(CACHE_KEY);
          const downloadedFilesCache = cachedFiles
            ? JSON.parse(cachedFiles)
            : {};
          downloadedFiles.forEach((file) => {
            downloadedFilesCache[`Rutas_${division}/${file.name}`] = true;
          });
          await AsyncStorage.setItem(
            CACHE_KEY,
            JSON.stringify(downloadedFilesCache)
          );
        }

        if (!cancelDownloadRef.current[division]) {
          setDownloadStatus((prev) => ({ ...prev, [division]: downloadedSize === totalSize ? 'completed' : 'idle' }));
          if (downloadedSize === totalSize) {
            Alert.alert(
              'Éxito',
              `Todos los archivos de ${division} se han descargado correctamente.`
            );
          }
        } else {
          setDownloadStatus((prev) => ({ ...prev, [division]: 'paused' }));
        }
      } catch (error) {
        console.error(`Error al descargar archivos de ${division}:`, error);
        setDownloadStatus((prev) => ({ ...prev, [division]: 'error' }));
        setErrorLog((prev) => [
          ...prev,
          {
            type: 'download',
            message: `Error al descargar archivos de ${division}: ${error.message}`,
          },
        ]);
        Alert.alert(
          'Error',
          `Ocurrió un error durante la descarga de ${division}. Intenta nuevamente.`
        );
      }
    },
    [divisionData, isConnected]
  );

  const downloadBatch = async (batch, division) => {
    const downloadPromises = batch.map((file) => downloadFile(file, division));
    const results = await Promise.allSettled(downloadPromises);

    const successfulDownloads = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    const failedDownloads = results
      .filter((result) => result.status === 'rejected')
      .map((result, index) => ({
        file: batch[index],
        error: result.reason,
      }));

    setErrorLog((prev) => [
      ...prev,
      ...failedDownloads.map(({ file, error }) => ({
        type: 'download',
        file: file.name,
        message: error.message,
      })),
    ]);

    return successfulDownloads;
  };

  const downloadFile = async (file, division, retryCount = 0) => {
    if (cancelDownloadRef.current[division]) {
      throw new Error('Descarga cancelada');
    }

    try {
      const { data, error } = await supabase.storage
        .from('route_images')
        .download(`Rutas_${division}/${file.name}`);

      if (error) throw error;
      if (!data) throw new Error('No se pudo obtener el archivo');

      let base64data;
      if (data instanceof Blob) {
        base64data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(data);
        });
      } else if (data instanceof ArrayBuffer) {
        base64data = Buffer.from(data).toString('base64');
      } else {
        throw new Error('Formato de datos no soportado');
      }

      const localUri = `${FileSystem.documentDirectory}${division}_${file.name}`;
      await FileSystem.writeAsStringAsync(localUri, base64data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return { ...file, downloaded: true };
    } catch (error) {
      console.error(`Error al descargar ${file.name}:`, error);
      if (retryCount < 3) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        return downloadFile(file, division, retryCount + 1);
      } else {
        throw error;
      }
    }
  };

  const deleteFiles = async (division) => {
    try {
      const { files } = divisionData[division];
      for (const file of files) {
        const localUri = `${FileSystem.documentDirectory}${division}_${file.name}`;
        await FileSystem.deleteAsync(localUri, { idempotent: true });
      }

      const cachedFiles = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedFiles) {
        const downloadedFiles = JSON.parse(cachedFiles);
        const updatedCache = Object.keys(downloadedFiles).reduce((acc, key) => {
          if (!key.startsWith(`Rutas_${division}/`)) {
            acc[key] = downloadedFiles[key];
          }
          return acc;
        }, {});
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
      }

      await fetchDivisionData(division);
      setDownloadProgress((prev) => ({ ...prev, [division]: 0 }));
      setDownloadStatus((prev) => ({ ...prev, [division]: 'idle' }));
      Alert.alert(
        'Éxito',
        `Todos los archivos de ${division} han sido eliminados.`
      );
    } catch (error) {
      console.error(`Error al eliminar archivos de ${division}:`, error);
      setErrorLog((prev) => [
        ...prev,
        {
          type: 'delete',
          message: `Error al eliminar archivos de ${division}: ${error.message}`,
        },
      ]);
      Alert.alert(
        'Error',
        `Ocurrió un error al eliminar los archivos de ${division}. Intenta nuevamente.`
      );
    }
  };

  const pauseDownload = (division) => {
    cancelDownloadRef.current[division] = true;
    setDownloadStatus((prev) => ({ ...prev, [division]: 'paused' }));
  };

  const resumeDownload = (division) => {
    cancelDownloadRef.current[division] = false;
    downloadFiles(division);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getCareerIcon = (division) => {
    const icons = {
      INNI: faCode,
      IIS: faIndustry,
      IQ: faFlask,
      IMT: faCog,
      IC: faPencilRuler,
      IMA: faChartLine,
      LAE: faLandmark,
      LCPF: faUserTie,
    };
    return icons[division] || faGraduationCap;
  };

  useEffect(() => {
    const initializeComponent = async () => {
      const isNetworkConnected = await checkNetworkConnection();
      if (isNetworkConnected) {
        await fetchDivisions();
      } else {
        Alert.alert(
          'Error de conexión',
          'No hay conexión a internet. Por favor, verifica tu conexión e intenta nuevamente.'
        );
      }
      setIsLoading(false);
    };

    initializeComponent();
  }, [checkNetworkConnection, fetchDivisions]);

  return (
    <SafeAreaView style={styles.container}>
      {/* <LinearGradient colors={['#0033A0', '#00254D']} style={styles.gradient}> */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Gestión de Archivos</Text>
            <Text style={styles.description}>
              Descarga y elimina archivos de rutas por división
            </Text>
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#FFFFFF"
              style={styles.loader}
            />
          ) : (
            <View style={styles.content}>
              {divisions.map((division) => {
                const icon = getCareerIcon(division);
                return (
                  <View key={division} style={styles.divisionCard}>
                    <LinearGradient
                      colors={['#FFFFFF', '#F0F0F0']}
                      style={styles.cardGradient}>
                      <View style={styles.divisionHeader}>
                        <View style={styles.iconContainer}>
                          <FontAwesomeIcon
                            icon={icon}
                            size={24}
                            color="#0033A0"
                          />
                        </View>
                        <Text style={styles.divisionTitle}>{division}</Text>
                      </View>
                      <View style={styles.divisionInfo}>
                        <Text style={styles.infoText}>
                          Archivos: {divisionData[division]?.fileCount || 0}
                        </Text>
                        <Text style={styles.infoText}>
                          Tamaño: {formatSize(divisionData[division]?.totalSize || 0)}
                        </Text>
                      </View>
                      <View style={styles.progressContainer}>
                        <View style={styles.progressBarContainer}>
                          <View
                            style={[
                              styles.progressBar,
                              { width: `${downloadProgress[division] || 0}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.progressText}>
                          {`${Math.round(downloadProgress[division] || 0)}%`}
                        </Text>
                      </View>
                      <View style={styles.buttonContainer}>
                        {downloadStatus[division] === 'downloading' ? (
                          <TouchableOpacity
                            style={[styles.button, styles.pauseButton]}
                            onPress={() => pauseDownload(division)}>
                            <FontAwesomeIcon
                              icon={faPause}
                              color="#FFFFFF"
                              size={16}
                              style={styles.buttonIcon}
                            />
                            <Text style={styles.buttonText}>Pausar</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={[
                              styles.button,
                              styles.downloadButton,
                              downloadStatus[division] === 'completed' &&
                                styles.disabledButton,
                            ]}
                            onPress={() =>
                              downloadStatus[division] === 'paused'
                                ? resumeDownload(division)
                                : downloadFiles(division)
                            }
                            disabled={downloadStatus[division] === 'completed'}>
                            <FontAwesomeIcon
                              icon={
                                downloadStatus[division] === 'paused'
                                  ? faPlay
                                  : faCloudDownloadAlt
                              }
                              color="#FFFFFF"
                              size={16}
                              style={styles.buttonIcon}
                            />
                            <Text style={styles.buttonText}>
                              {downloadStatus[division] === 'paused'
                                ? 'Reanudar'
                                : 'Descargar'}
                            </Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={[styles.button, styles.deleteButton]}
                          onPress={() => deleteFiles(division)}>
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            color="#FFFFFF"
                            size={16}
                            style={styles.buttonIcon}
                          />
                          <Text style={styles.buttonText}>Eliminar</Text>
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0033A0',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#0033A0',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  divisionCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
  },
  divisionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  divisionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0033A0',
  },
  divisionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
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
  loader: {
    marginTop: 20,
  },
});

export default FileManagement;
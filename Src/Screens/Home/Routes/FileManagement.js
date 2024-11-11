import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, StyleSheet, Text, ScrollView, TouchableOpacity, 
  ActivityIndicator, SafeAreaView, Alert, Dimensions,
} from 'react-native';
import { supabase } from '../../../Api/lib/supabase';
import * as FileSystem from 'expo-file-system';
import * as Network from 'expo-network';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faCloudDownloadAlt, faTrashAlt, faPause, faPlay,
  faGraduationCap, faCode, faIndustry, faFlask, faCog,
  faPencilRuler, faChartLine, faLandmark, faBuilding,
  faMicroscope, faAtom, faDatabase, faNetworkWired,
  faRobot, faCalculator, faLeaf, faDna, faVial, faBrain,
} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const BATCH_SIZE = 5;
const CACHE_KEY = 'downloadedFiles';
const { width } = Dimensions.get('window');

const CAREER_INFO = {
  ICIV: { name: 'Ingeniería Civil', icon: faBuilding, color: '#FF5722' },
  IGFO: { name: 'Ingeniería en Fotónica', icon: faCalculator, color: '#9C27B0' },
  INBI: { name: 'Ingeniería Biomédica', icon: faMicroscope, color: '#4CAF50' },
  INCE: { name: 'Ingeniería en Comunicaciones y Electrónica', icon: faAtom, color: '#2196F3' },
  INCO: { name: 'Ingeniería en Computación', icon: faCode, color: '#3F51B5' },
  INDU: { name: 'Ingeniería Industrial', icon: faIndustry, color: '#FF9800' },
  INFO: { name: 'Ingeniería en Informática', icon: faDatabase, color: '#009688' },
  INME: { name: 'Ingeniería Mecánica Eléctrica', icon: faCog, color: '#607D8B' },
  INQU: { name: 'Ingeniería Química', icon: faFlask, color: '#E91E63' },
  INRO: { name: 'Ingeniería en Robótica', icon: faRobot, color: '#795548' },
  ITOG: { name: 'Ingeniería en Topografía Geomática', icon: faNetworkWired, color: '#00BCD4' },
  LCMA: { name: 'Licenciatura en Ciencia de Materiales', icon: faChartLine, color: '#CDDC39' },
  'LIAB/LINA': { name: 'Ingeniería en Alimentos y Biotecnología', icon: faLeaf, color: '#8BC34A' },
  LIFI: { name: 'Licenciatura en Física', icon: faBrain, color: '#673AB7' },
  LIMA: { name: 'Licenciatura en Matemáticas', icon: faPencilRuler, color: '#FFC107' },
  LCGT: { name: 'Ingeniería en Logística y Transporte', icon: faLandmark, color: '#03A9F4' },
  LQFB: { name: 'Licenciatura en Químico Farmacéutico Biólogo', icon: faDna, color: '#F44336' },
  LQUI: { name: 'Licenciatura en Química', icon: faVial, color: '#9C27B0' },
};

const isFileAlreadyDownloaded = async (fileName) => {
  const cachedFiles = await AsyncStorage.getItem(CACHE_KEY);
  const downloadedFiles = cachedFiles ? JSON.parse(cachedFiles) : {};
  return !!downloadedFiles[fileName];
};

export const FileManagement = ({ route }) => {
  const [divisions, setDivisions] = useState([]);
  const [divisionData, setDivisionData] = useState({});
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
      console.log('Network status:', networkStatus.isConnected ? 'Connected' : 'Disconnected');
      return networkStatus.isConnected;
    } catch (error) {
      console.error('Error al verificar la conexión de red:', error);
      setIsConnected(false);
      return false;
    }
  }, []);

  const fetchDivisions = useCallback(async () => {
    try {
      console.log('Fetching divisions...');
      const { data, error } = await supabase.storage
        .from('route_images')
        .list('');

      if (error) throw error;

      let divisionFolders = data
        .filter((item) => item.name.startsWith('Rutas_'))
        .map((folder) => folder.name.replace('Rutas_', ''));

      if (userDivision && divisionFolders.includes(userDivision)) {
        divisionFolders = [
          userDivision,
          ...divisionFolders.filter(div => div !== userDivision)
        ];
      }

      setDivisions(divisionFolders);
      console.log('Divisions fetched:', divisionFolders);

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
  }, [userDivision, fetchDivisionData]);

  const fetchDivisionData = useCallback(async (division) => {
    try {
      console.log(`Fetching data for division: ${division}`);
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

      const { fileInfos, totalSize, downloadedSize, fileCount } = data.reduce((acc, file) => {
        if (file.name.endsWith('.webp')) {
          const fileInfo = {
            name: file.name,
            size: file.metadata.size,
            downloaded: !!downloadedFiles[`Rutas_${division}/${file.name}`],
          };
          acc.fileInfos.push(fileInfo);
          acc.totalSize += fileInfo.size;
          if (fileInfo.downloaded) {
            acc.downloadedSize += fileInfo.size;
          }
          acc.fileCount++;
        }
        return acc;
      }, { fileInfos: [], totalSize: 0, downloadedSize: 0, fileCount: 0 });

      setDivisionData((prev) => ({
        ...prev,
        [division]: { files: fileInfos, totalSize, downloadedSize, fileCount },
      }));

      setDownloadProgress((prev) => ({
        ...prev,
        [division]: totalSize > 0 ? (downloadedSize / totalSize) * 100 : 0,
      }));

      setDownloadStatus((prev) => ({
        ...prev,
        [division]: downloadedSize === totalSize && totalSize > 0 ? 'completed' : 'idle',
      }));

      console.log(`Data fetched for division ${division}:`, { fileCount, totalSize, downloadedSize });
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

      console.log(`Starting download for division: ${division}`);
      setDownloadStatus((prev) => ({ ...prev, [division]: 'downloading' }));
      cancelDownloadRef.current[division] = false;
      const { files, totalSize } = divisionData[division];
      let downloadedSize = files
        .filter((file) => file.downloaded)
        .reduce((acc, file) => acc + file.size, 0);
      const filesToDownload = files.filter((file) => !file.downloaded);
      const batches = [];

      for (let i = 0; i < filesToDownload.length; i += BATCH_SIZE) {
        batches.push(filesToDownload.slice(i, i + BATCH_SIZE));
      }

      try {
        for (const batch of batches) {
          if (cancelDownloadRef.current[division]) break;

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

          console.log(`Batch downloaded for ${division}. Progress: ${progress.toFixed(2)}%`);
        }

        if (!cancelDownloadRef.current[division]) {
          setDownloadStatus((prev) => ({ ...prev, [division]: downloadedSize === totalSize ? 'completed' : 'idle' }));
          if (downloadedSize === totalSize) {
            Alert.alert(
              'Éxito',
              `Todos los archivos de ${division} se han descargado correctamente.`
            );
            console.log(`Download completed for division: ${division}`);
          }
        } else {
          setDownloadStatus((prev) => ({ ...prev, [division]: 'paused' }));
          console.log(`Download paused for division: ${division}`);
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
    console.log(`Downloading batch for division: ${division}. Batch size: ${batch.length}`);
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

    console.log(`Batch download complete. Successful: ${successfulDownloads.length}, Failed: ${failedDownloads.length}`);
    return successfulDownloads;
  };

  const downloadFile = async (file, division, retryCount = 0) => {
    if (cancelDownloadRef.current[division]) {
      throw new Error('Descarga cancelada');
    }

    const fileName = `Rutas_${division}/${file.name}`;
    if (await isFileAlreadyDownloaded(fileName)) {
      console.log(`File ${file.name} is already downloaded. Skipping.`);
      return { ...file, downloaded: true };
    }

    try {
      console.log(`Downloading file: ${file.name}`);
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

      console.log(`File ${file.name} downloaded successfully`);
      return { ...file, downloaded: true };
    } catch (error) {
      console.error(`Error al descargar ${file.name}:`, error);
      if (retryCount < 3) {
        console.log(`Retrying download for ${file.name}. Attempt ${retryCount + 1}`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        return downloadFile(file, division, retryCount + 1);
      } else {
        throw error;
      }
    }
  };

  const deleteFiles = async (division) => {
    try {
      console.log(`Deleting files for division: ${division}`);
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
      console.log(`Files deleted successfully for division: ${division}`);
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
    console.log(`Download paused for division: ${division}`);
  };

  const resumeDownload = (division) => {
    cancelDownloadRef.current[division] = false;
    downloadFiles(division);
    console.log(`Download resumed for division: ${division}`);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Gestión de Archivos</Text>
          <Text style={styles.description}>
            Descarga y elimina archivos de rutas por división
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#3F51B5" style={styles.loader} />
        ) : (
          <View style={styles.content}>
            {divisions.map((division) => {
              const careerInfo = CAREER_INFO[division] || { 
                name: division, 
                icon: faGraduationCap, 
                color: '#757575' 
              };
              const isUserDivision = division === userDivision;
              return (
                <View 
                  key={division} 
                  style={[
                    styles.divisionCard,
                    isUserDivision && styles.userDivisionCard,
                  ]}
                >
                  {isUserDivision && (
                    <View style={styles.userIndicator}>
                      <Text style={styles.userIndicatorText}>Tu carrera</Text>
                    </View>
                  )}
                  <LinearGradient
                    colors={[careerInfo.color, careerInfo.color + '80']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardHeader}
                  >
                    <View style={styles.iconContainer}>
                      <FontAwesomeIcon icon={careerInfo.icon} size={28} color="#FFFFFF" />
                    </View>
                    <View style={styles.headerTextContainer}>
                      <Text style={styles.divisionTitle}>{division}</Text>
                      <Text style={styles.divisionSubtitle}>{careerInfo.name}</Text>
                    </View>
                  </LinearGradient>
                  <View style={styles.cardContent}>
                    <View style={styles.divisionInfo}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Archivos</Text>
                        <Text style={styles.infoValue}>
                          {divisionData[division]?.fileCount || 0}
                        </Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Tamaño Total</Text>
                        <Text style={styles.infoValue}>
                          {formatSize(divisionData[division]?.totalSize || 0)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBarContainer}>
                        <LinearGradient
                          colors={[careerInfo.color, careerInfo.color + '80']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
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
                          style={[styles.button, { backgroundColor: '#FFA000' }]}
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
                            { backgroundColor: careerInfo.color },
                            downloadStatus[division] === 'completed' && styles.disabledButton,
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
                        style={[styles.button, { backgroundColor: '#FF5252' }]}
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
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  divisionCard: {
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  userDivisionCard: {
    borderWidth: 2,
    borderColor: '#3F51B5',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  cardContent: {
    padding: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  divisionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  divisionSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
  },
  divisionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    marginTop: 4,
    fontSize: 14,
    color: '#666666',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  loader: {
    marginTop: 20,
  },
  userIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  userIndicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  titleGradient: {
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default FileManagement;
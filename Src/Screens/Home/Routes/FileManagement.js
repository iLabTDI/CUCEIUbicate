import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Modal,
} from "react-native";
import { supabase } from "../../../Api/lib/supabase";
import * as FileSystem from "expo-file-system";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
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
  faBuilding,
  faMicroscope,
  faAtom,
  faDatabase,
  faNetworkWired,
  faRobot,
  faCalculator,
  faLeaf,
  faDna,
  faVial,
  faBrain,
  faFileDownload,
  faBus,
  faTimes,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteLocalFiles } from "./DeleteLocalFiles";
import { LinearGradient } from "expo-linear-gradient";

const BATCH_SIZE = 10;
const CACHE_KEY = "downloadedFiles";
const { width } = Dimensions.get("window");
// const isTablet = width >= 768;

const CAREER_INFO = {
  ICIV: { name: "Ingeniería Civil", icon: faBuilding, color: "#FF5722" },
  IGFO: {
    name: "Ingeniería en Fotónica",
    icon: faCalculator,
    color: "#9C27B0",
  },
  INBI: { name: "Ingeniería Biomédica", icon: faMicroscope, color: "#4CAF50" },
  INCE: {
    name: "Ingeniería en Comunicaciones y Electrónica",
    icon: faAtom,
    color: "#2196F3",
  },
  INCO: { name: "Ingeniería en Computación", icon: faCode, color: "#009688" },
  INDU: { name: "Ingeniería Industrial", icon: faIndustry, color: "#FF9800" },
  INFO: { name: "Ingeniería en Informática", icon: faCode, color: "#3F51B5" },
  INME: {
    name: "Ingeniería Mecánica Eléctrica",
    icon: faCog,
    color: "#607D8B",
  },
  INQU: { name: "Ingeniería Química", icon: faFlask, color: "#E91E63" },
  INRO: { name: "Ingeniería en Robótica", icon: faRobot, color: "#795548" },
  ITOG: {
    name: "Ingeniería en Topografía Geomática",
    icon: faNetworkWired,
    color: "#00BCD4",
  },
  LCMA: {
    name: "Licenciatura en Ciencia de Materiales",
    icon: faChartLine,
    color: "#CDDC39",
  },
  "LIAB/LINA": {
    name: "Ingeniería en Alimentos y Biotecnología",
    icon: faLeaf,
    color: "#8BC34A",
  },
  LIFI: { name: "Licenciatura en Física", icon: faBrain, color: "#673AB7" },
  LIMA: {
    name: "Licenciatura en Matemáticas",
    icon: faPencilRuler,
    color: "#FFC107",
  },
  LCGT: {
    name: "Ingeniería en Logística y Transporte",
    icon: faLandmark,
    color: "#03A9F4",
  },
  LQFB: {
    name: "Licenciatura en Químico Farmacéutico Biólogo",
    icon: faDna,
    color: "#F44336",
  },
  LQUI: { name: "Licenciatura en Química", icon: faVial, color: "#9C27B0" },
  LOGT: {
    name: "Ingeniería en Logística y Transporte",
    icon: faBus,
    color: "#808080",
  },
};

export const FileManagement = ({ route }) => {
  // Estados para manejar diferentes aspectos del componente
  const [divisions, setDivisions] = useState([]); // Lista de divisiones obtenidas del almacenamiento remoto
  const [divisionData, setDivisionData] = useState({}); // Datos específicos de cada división
  const [downloadProgress, setDownloadProgress] = useState({}); // Progreso de descarga por división
  const [downloadStatus, setDownloadStatus] = useState({}); // Estado general de la descarga (idle, downloading, completed, etc.)
  const [isLoading, setIsLoading] = useState(true); // Indicador de si los datos están cargando
  const [errorLog, setErrorLog] = useState([]); // Registro de errores ocurridos durante las operaciones
  const [showOverlay, setShowOverlay] = useState(true); // Indicador de si se muestra el overlay de ayuda

  // Datos del usuario obtenidos de las props
  const { user } = route.params;
  const userData = Array.isArray(user) ? user[0] : user; // Si el usuario es un arreglo, toma el primer elemento
  const userDivision = userData.degree_code; // División específica del usuario (por ejemplo, su carrera)

  const cancelDownloadRef = useRef({}); // Referencia mutable para manejar la cancelación de descargas por división

  // Función para obtener la lista de divisiones disponibles en el almacenamiento remoto
  const fetchDivisions = useCallback(async () => {
    try {
      console.log("Fetching divisions...");
      const { data, error } = await supabase.storage
        .from("route_images") // Especifica el bucket
        .list(""); // Llama a la raíz del bucket para obtener las carpetas

      if (error) throw error;

      // Filtra carpetas que comienzan con "Rutas_" y remueve este prefijo
      let divisionFolders = data
        .filter((item) => item.name.startsWith("Rutas_"))
        .map((folder) => folder.name.replace("Rutas_", ""));

      // Prioriza la división del usuario si existe en las carpetas
      if (userDivision && divisionFolders.includes(userDivision)) {
        divisionFolders = [
          userDivision,
          ...divisionFolders.filter((div) => div !== userDivision),
        ];
      }

      setDivisions(divisionFolders); // Actualiza el estado con las divisiones obtenidas
      console.log("Divisions fetched:", divisionFolders);

      // Llama a fetchDivisionData para obtener datos específicos de cada división
      await Promise.all(divisionFolders.map(fetchDivisionData));
    } catch (error) {
      console.error("Error al obtener las divisiones:", error);
      setErrorLog((prev) => [
        ...prev,
        {
          type: "fetch",
          message: "Error al obtener las divisiones: " + error.message,
        },
      ]);
    }
  }, [userDivision]);

  // Función para obtener datos específicos de una división (archivos, tamaños, etc.)
  const fetchDivisionData = useCallback(async (division) => {
    try {
      console.log(`Fetching data for division: ${division}`);
      const { data, error } = await supabase.storage
        .from("route_images") // Especifica el bucket
        .list(`Rutas_${division}`, {
          limit: 1000, // Límite de archivos por solicitud
          offset: 0, // Comienza desde el primer archivo
          sortBy: { column: "name", order: "asc" }, // Ordena los archivos alfabéticamente
        });

      if (error) throw error;

      // Obtiene los archivos descargados desde la caché local
      const cachedFiles = await AsyncStorage.getItem(CACHE_KEY);
      const downloadedFiles = cachedFiles ? JSON.parse(cachedFiles) : {};

      // Procesa los datos de los archivos para obtener información como tamaño, nombre, etc.
      const { fileInfos, totalSize, downloadedSize, fileCount } = data.reduce(
        (acc, file) => {
          if (file.name.endsWith(".webp")) {
            const fileKey = `${division}_${file.name}`;
            const fileInfo = {
              name: file.name,
              size: file.metadata.size,
              downloaded: !!downloadedFiles[fileKey], // Verifica si ya está descargado
            };
            acc.fileInfos.push(fileInfo);
            acc.totalSize += fileInfo.size;
            if (fileInfo.downloaded) {
              acc.downloadedSize += fileInfo.size;
            }
            acc.fileCount++;
          }
          return acc;
        },
        { fileInfos: [], totalSize: 0, downloadedSize: 0, fileCount: 0 }
      );

      // Actualiza los datos de la división en el estado
      setDivisionData((prev) => ({
        ...prev,
        [division]: { files: fileInfos, totalSize, downloadedSize, fileCount },
      }));

      // Actualiza el progreso de descarga
      setDownloadProgress((prev) => ({
        ...prev,
        [division]: totalSize > 0 ? (downloadedSize / totalSize) * 100 : 0,
      }));

      // Actualiza el estado de descarga (completado o en espera)
      setDownloadStatus((prev) => ({
        ...prev,
        [division]:
          downloadedSize === totalSize && totalSize > 0 ? "completed" : "idle",
      }));

      console.log(`Data fetched for division ${division}:`, {
        fileCount,
        totalSize,
        downloadedSize,
      });
    } catch (error) {
      console.error(
        `Error al obtener datos de la división ${division}:`,
        error
      );
      setErrorLog((prev) => [
        ...prev,
        {
          type: "fetch",
          message: `Error al obtener datos de ${division}: ${error.message}`,
        },
      ]);
    }
  }, []);

  // Función para descargar archivos de una división específica
  const downloadFiles = useCallback(
    async (division) => {
      console.log(`Iniciando la descarga para la división: ${division}`);
      setDownloadProgress((prev) => ({ ...prev, [division]: 0 })); // Inicializa el progreso
      setDownloadStatus((prev) => ({ ...prev, [division]: "downloading" })); // Cambia el estado a descargando
      cancelDownloadRef.current[division] = false; // Permite cancelar descargas

      // Obtiene archivos de la división y calcula el tamaño descargado
      const { files, totalSize } = divisionData[division];
      let downloadedSize = files
        .filter((file) => file.downloaded)
        .reduce((acc, file) => acc + file.size, 0);
      const filesToDownload = [];

      const cachedFiles = await AsyncStorage.getItem(CACHE_KEY);
      const downloadedFilesCache = cachedFiles ? JSON.parse(cachedFiles) : {};

      // Filtra los archivos que aún no han sido descargados
      for (const file of files) {
        const baseFileName = file.name.substring(file.name.indexOf("_") + 1);
        const globalFileKey = `${baseFileName}`;
        const localUri = `${FileSystem.documentDirectory}${baseFileName}`;
        const fileInfo = await FileSystem.getInfoAsync(localUri);

        if (!fileInfo.exists || !downloadedFilesCache[globalFileKey]) {
          filesToDownload.push(file);
        } else {
          console.log(`El archivo ${file.name} ya está descargado. Se omite.`);
        }
      }

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
            const baseFileName = file.name.substring(
              file.name.indexOf("_") + 1
            );
            const globalFileKey = `${baseFileName}`;
            downloadedFilesCache[globalFileKey] = true;
          });

          const progress =
            totalSize > 0
              ? Math.min((downloadedSize / totalSize) * 100, 100)
              : 0;
          setDownloadProgress((prev) => ({ ...prev, [division]: progress }));

          await AsyncStorage.setItem(
            CACHE_KEY,
            JSON.stringify(downloadedFilesCache)
          );

          console.log(
            `Lote descargado para ${division}. Progreso: ${progress.toFixed(
              2
            )}%`
          );
        }

        if (!cancelDownloadRef.current[division]) {
          setDownloadStatus((prev) => ({
            ...prev,
            [division]: downloadedSize === totalSize ? "completed" : "idle",
          }));
          if (downloadedSize === totalSize) {
            Alert.alert(
              "Éxito",
              `Todos los archivos de ${division} se han descargado correctamente.`
            );
            console.log(`Descarga completada para la división: ${division}`);
          }
        } else {
          setDownloadStatus((prev) => ({ ...prev, [division]: "paused" }));
          console.log(`Descarga pausada para la división: ${division}`);
        }
      } catch (error) {
        console.error(`Error al descargar archivos de ${division}:`, error);
        setDownloadStatus((prev) => ({ ...prev, [division]: "error" }));
        setErrorLog((prev) => [
          ...prev,
          {
            type: "download",
            message: `Error al descargar archivos de ${division}: ${error.message}`,
          },
        ]);
        Alert.alert(
          "Error",
          `Ocurrió un error durante la descarga de ${division}. Intenta nuevamente.`
        );
      }
    },
    [divisionData]
  );

  // Función para manejar la descarga de un lote de archivos
  const downloadBatch = async (batch, division) => {
    console.log(
      `Descargando lote para la división: ${division}. Tamaño del lote: ${batch.length}`
    );
    const downloadPromises = batch.map((file) => downloadFile(file, division));
    const results = await Promise.allSettled(downloadPromises);

    const successfulDownloads = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    const failedDownloads = results
      .filter((result) => result.status === "rejected")
      .map((result, index) => ({
        file: batch[index],
        error: result.reason,
      }));

    setErrorLog((prev) => [
      ...prev,
      ...failedDownloads.map(({ file, error }) => ({
        type: "download",
        file: file.name,
        message: error.message,
      })),
    ]);

    console.log(
      `Lote descargado. Exitosos: ${successfulDownloads.length}, Fallidos: ${failedDownloads.length}`
    );
    return successfulDownloads;
  };

  const downloadFile = async (file, division, retryCount = 0) => {
    if (cancelDownloadRef.current[division]) {
      throw new Error("Descarga cancelada");
    }

    const fileName = `Rutas_${division}/${file.name}`;
    const localUri = `${FileSystem.documentDirectory}${division}_${file.name}`;

    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (fileInfo.exists) {
      console.log(`El archivo ${file.name} ya está descargado. Se omite.`);
      return { ...file, downloaded: true };
    }

    try {
      console.log(`Descargando archivo: ${file.name}`);
      const { data, error } = await supabase.storage
        .from("route_images")
        .download(`Rutas_${division}/${file.name}`);

      if (error) throw error;
      if (!data) throw new Error("No se pudo obtener el archivo");

      let base64data;
      if (data instanceof Blob) {
        base64data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(data);
        });
      } else if (data instanceof ArrayBuffer) {
        base64data = Buffer.from(data).toString("base64");
      } else {
        throw new Error("Formato de datos no soportado");
      }

      await FileSystem.writeAsStringAsync(localUri, base64data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log(`Archivo ${file.name} descargado correctamente`);
      return { ...file, downloaded: true };
    } catch (error) {
      console.error(`Error al descargar ${file.name}:`, error);
      if (retryCount < 3) {
        console.log(
          `Reintentando la descarga de ${file.name}. Intento ${retryCount + 1}`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, retryCount))
        );
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
          if (!key.startsWith(`${division}_`)) {
            acc[key] = downloadedFiles[key];
          }
          return acc;
        }, {});
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
      }

      await fetchDivisionData(division);
      setDownloadProgress((prev) => ({ ...prev, [division]: 0 }));
      setDownloadStatus((prev) => ({ ...prev, [division]: "idle" }));
      Alert.alert(
        "Éxito",
        `Todos los archivos de ${division} han sido eliminados.`
      );
      console.log(`Files deleted successfully for division: ${division}`);
    } catch (error) {
      console.error(`Error al eliminar archivos de ${division}:`, error);
      setErrorLog((prev) => [
        ...prev,
        {
          type: "delete",
          message: `Error al eliminar archivos de ${division}: ${error.message}`,
        },
      ]);
      Alert.alert(
        "Error",
        `Ocurrió un error al eliminar los archivos de ${division}. Intenta nuevamente.`
      );
    }
  };

  const pauseDownload = (division) => {
    cancelDownloadRef.current[division] = true;
    setDownloadStatus((prev) => ({ ...prev, [division]: "paused" }));
    console.log(`Download paused for division: ${division}`);
  };

  const resumeDownload = (division) => {
    cancelDownloadRef.current[division] = false;
    downloadFiles(division);
    console.log(`Download resumed for division: ${division}`);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const downloadAllFiles = async () => {
    try {
      console.log("Downloading all files for all divisions");
      for (const division of divisions) {
        await downloadFiles(division);
      }
      Alert.alert("Éxito", "Todos los archivos han sido descargados.");
    } catch (error) {
      console.error("Error al descargar todos los archivos:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al descargar todos los archivos. Intenta nuevamente."
      );
    }
  };

  useEffect(() => {
    const initializeComponent = async () => {
      await fetchDivisions();
      const filesInfo = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      // console.log("Archivos descargados actualmente:", filesInfo); // Mostrar todos los archivos actualmente descargados
      setIsLoading(false);
    };
    initializeComponent();
  }, [fetchDivisions]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={24} color="#1976D2" style={styles.loader} />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  const removeDuplicateFiles = async () => {
    try {
      console.log("Buscando y eliminando archivos duplicados...");

      // Leer todos los archivos del directorio local
      const filesInfo = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );

      if (!filesInfo || filesInfo.length === 0) {
        console.log("No se encontraron archivos en el directorio.");
        Alert.alert(
          "No se encontraron archivos",
          "No hay archivos para eliminar."
        );
        return;
      }

      console.log("filesInfo:", filesInfo);

      // Mapa para almacenar archivos únicos por su nombre sin el prefijo de la carrera
      const uniqueFiles = {};
      const duplicates = [];

      // Iterar sobre todos los archivos y detectar duplicados
      for (const file of filesInfo) {
        // Eliminar el prefijo (hasta el primer guion bajo)
        const baseName = file.substring(file.indexOf("_") + 1);

        if (uniqueFiles[baseName]) {
          duplicates.push(file); // Si el archivo ya fue encontrado, es un duplicado
        } else {
          uniqueFiles[baseName] = true;
        }
      }

      // Eliminar archivos duplicados
      if (duplicates.length > 0) {
        for (const duplicate of duplicates) {
          const localUri = `${FileSystem.documentDirectory}${duplicate}`;
          await FileSystem.deleteAsync(localUri, { idempotent: true });
          console.log(`Archivo duplicado eliminado: ${duplicate}`);
        }

        Alert.alert(
          "Éxito",
          "Todos los archivos duplicados han sido eliminados."
        );
      } else {
        console.log("No se encontraron archivos duplicados.");
        Alert.alert("Sin duplicados", "No se encontraron archivos duplicados.");
      }
    } catch (error) {
      console.error("Error al eliminar archivos duplicados:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al eliminar los archivos duplicados."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#0D47A1", "#1976D2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon icon={faFileDownload} size={36} color="#FFFFFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Gestión de Archivos</Text>
            <Text style={styles.description}>
              Descarga y elimina archivos de rutas por división
            </Text>
          </View>
        </LinearGradient>

        {isLoading ? (
          <ActivityIndicator size={24} color="#1976D2" style={styles.loader} />
        ) : (
          <View style={styles.content}>
            {divisions.map((division) => {
              const careerInfo = CAREER_INFO[division] || {
                name: division,
                icon: faGraduationCap,
                color: "#757575",
              };
              const isUserDivision = division === userDivision;
              return (
                <View
                  key={division}
                  style={[
                    styles.divisionCard,
                    isUserDivision && styles.userDivisionCard,
                  ]}>
                  {isUserDivision && (
                    <View style={styles.userIndicator}>
                      <Text style={styles.userIndicatorText}>Tu carrera</Text>
                    </View>
                  )}
                  <LinearGradient
                    colors={[careerInfo.color, careerInfo.color + "80"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardHeader}>
                    <View style={styles.iconContainer}>
                      <FontAwesomeIcon
                        icon={careerInfo.icon}
                        size={28}
                        color="#FFFFFF"
                      />
                    </View>
                    <View style={styles.headerTextContainer}>
                      <Text style={styles.divisionTitle}>{division}</Text>
                      <Text style={styles.divisionSubtitle}>
                        {careerInfo.name}
                      </Text>
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
                          colors={[careerInfo.color, careerInfo.color + "80"]}
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
                      {downloadStatus[division] === "downloading" ? (
                        <TouchableOpacity
                          style={[
                            styles.button,
                            { backgroundColor: "#FFA000" },
                          ]}
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
                            downloadStatus[division] === "completed" &&
                              styles.disabledButton,
                          ]}
                          onPress={() =>
                            downloadStatus[division] === "paused"
                              ? resumeDownload(division)
                              : downloadFiles(division)
                          }
                          disabled={downloadStatus[division] === "completed"}>
                          <FontAwesomeIcon
                            icon={
                              downloadStatus[division] === "paused"
                                ? faPlay
                                : faCloudDownloadAlt
                            }
                            color="#FFFFFF"
                            size={16}
                            style={styles.buttonIcon}
                          />
                          <Text style={styles.buttonText}>
                            {downloadStatus[division] === "paused"
                              ? "Reanudar"
                              : "Descargar"}
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: "#D32F2F" }]}
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
            <View style={styles.globalButtonContainer}>
              <TouchableOpacity
                style={[styles.globalButton, { backgroundColor: "#4CAF50" }]}
                onPress={downloadAllFiles}>
                <FontAwesomeIcon
                  icon={faCloudDownloadAlt}
                  color="#FFFFFF"
                  size={16}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Descargar Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.globalButton, { backgroundColor: "#D32F2F" }]}
                onPress={deleteLocalFiles}>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  color="#FFFFFF"
                  size={16}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Eliminar Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.globalButton, { backgroundColor: "#FF9800" }]}
                onPress={removeDuplicateFiles}>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  color="#FFFFFF"
                  size={16}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Eliminar Duplicados</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showOverlay}
        onRequestClose={() => setShowOverlay(false)}>
        <View style={styles.overlayContainer}>
          <View style={styles.overlayContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowOverlay(false)}>
              <FontAwesomeIcon icon={faTimes} size={24} color="#fff" />
            </TouchableOpacity>
            <LinearGradient
              colors={["#0b34b0", "#0056b3"]}
              style={styles.header}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                size={32}
                color="#fff"
                style={styles.headerWarning}
              />
              <Text style={styles.overlayTitle}>Aviso Importante</Text>
            </LinearGradient>
            <View style={styles.separator} />
            <Text style={styles.overlayText}>
              Estamos trabajando en mejorar la gestión de la aplicación para que
              ya no sea necesario descargar archivos. Pronto tendrás una
              experiencia más fluida y eficiente.
            </Text>
            <TouchableOpacity
              style={styles.overlayButton}
              onPress={() => setShowOverlay(false)}>
              <Text style={styles.overlayButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    padding: 24,
    borderRadius: 15,
    marginBottom: 24,
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.84,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  divisionCard: {
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  userDivisionCard: {
    borderWidth: 2,
    borderColor: "#1976D2",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  divisionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  divisionSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 4,
  },
  divisionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoItem: {
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  progressText: {
    marginTop: 4,
    fontSize: 14,
    color: "#666666",
    textAlign: "right",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
  loader: {
    marginTop: 20,
  },
  userIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 60,
    zIndex: 1,
    backgroundColor: "#4CAF50",
  },
  userIndicatorText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  globalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  globalButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "85%",
    paddingBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  overlayTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
    marginHorizontal: 15,
  },
  overlayText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    textAlign: "justify",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "85%",
    paddingBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },

  headerWarning: {
    position: "absolute",
    left: 20,
    // transform: [{ translateY: -16 }],
  },
  overlayTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#e1e8ed",
    marginHorizontal: 15,
  },
  overlayText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    textAlign: "justify",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  overlayButton: {
    backgroundColor: "#0b34b0",
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  overlayButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  overlayButton: {
    backgroundColor: "#0b34b0",
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  overlayButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default FileManagement;

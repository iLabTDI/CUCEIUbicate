import { supabase } from "./lib/supabase";
import RNFS from "react-native-fs";
import { Alert } from "react-native";

// Ruta del archivo de datos de los videos
const videosDataPath = `${RNFS.DocumentDirectoryPath}/Videos_data.js`;
const videosDirectory = `${RNFS.DocumentDirectoryPath}/route_videos`;

// Función para obtener los videos desde la base de datos
export const updateVideosData = async () => {
  try {
    // Consulta los videos de la base de datos
    const { data: videosData, error } = await supabase
      .from('videos')
      .select('video_name, link');

    if (error) {
      console.error('Error al consultar los datos:', error);
      return;
    }

    if (!videosData) {
      console.error('Error: Datos faltantes');
      return;
    }

    // Lee el archivo actual de videos
    const fileExists = await RNFS.exists(videosDataPath);
    const currentFileContent = fileExists ? await RNFS.readFile(videosDataPath, 'utf-8') : '';
    const existingVideoNames = new Set();

    // Extrae los nombres de videos ya registrados
    const matches = currentFileContent.match(/"([^"]+)"\s*:\s*require/g);
    if (matches) {
      matches.forEach(match => {
        const videoName = match.match(/"([^"]+)"/)[1];
        existingVideoNames.add(videoName);
      });
    }

    let newEntries = '';

    // Crea el directorio de videos si no existe
    const directoryExists = await RNFS.exists(videosDirectory);
    if (!directoryExists) {
      await RNFS.mkdir(videosDirectory);
    }

    // Descarga y registra solo los videos que no están en el archivo actual
    for (const video of videosData) {
      if (!existingVideoNames.has(video.video_name)) {
        const videoPath = `${videosDirectory}/${video.video_name.replace(/\s+/g, '_')}.mp4`;

        try {
          // Descarga el video y guárdalo
          const download = await RNFS.downloadFile({
            fromUrl: video.link,
            toFile: videoPath,
          });
          const result = await download.promise;

          if (result.statusCode === 200) {
            console.log(`Video ${video.video_name} descargado en ${videoPath}`);
          } else {
            console.error(`Error al descargar el video ${video.video_name}: Código de estado ${result.statusCode}`);
            continue;
          }

          // Agrega una nueva entrada en el formato del archivo actual
          const relativePath = `./route_videos/${video.video_name.replace(/\s+/g, '_')}.mp4`;
          newEntries += `  "${video.video_name}": require("${relativePath}"),\n`;
          console.log(`Video ${video.video_name} descargado y registrado.`);
        } catch (error) {
          console.error(`Error al descargar el video ${video.video_name}:`, error);
        }
      }
    }

    if (newEntries) {
      // Agrega las nuevas entradas al archivo de datos
      const updatedContent = currentFileContent.replace(
        /};\s*$/,
        `${newEntries}};`
      );
      await RNFS.writeFile(videosDataPath, updatedContent, 'utf-8');
      console.log('Archivo de videos actualizado correctamente.');
    } else {
      console.log('No se encontraron nuevos videos para agregar.');
    }
  } catch (error) {
    console.error('Error al actualizar los videos:', error);
    Alert.alert('Error', 'No se pudo actualizar los videos. Verifica los detalles en la consola.');
  }
};

// Llama a la función para actualizar los videos
updateVideosData();

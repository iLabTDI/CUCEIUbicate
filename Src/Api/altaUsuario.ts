import { supabase } from "./lib/supabase";
import bcrypt from 'react-native-bcrypt';

// Función para encriptar la contraseña de manera síncrona
const hashPassword = (password) => {
  try {
    // Genera el salt (sin promesa)
    const salt = bcrypt.genSaltSync(10);
    
    // Encripta la contraseña utilizando el salt generado (sin promesa)
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    return hashedPassword;
  } catch (error) {
    console.error('Error al generar el hash:', error);
    return null;
  }
};

// Definir los tipos de los parámetros de alta_usuario
export const alta_usuario = async (
  Codigo: string, 
  correo: string, 
  contraseña: string, 
  selectedCareer: string, 
  name: string, 
  lastName: string, 
  username: string
): Promise<void> => {
  try {
    // Llama a la función hashPassword para encriptar la contraseña
    const hashedPassword = hashPassword(contraseña);

    // Verifica que se haya generado el hash correctamente
    if (!hashedPassword) {
      throw new Error('Error al encriptar la contraseña');
    }

    // Inserta los datos en la base de datos con la contraseña encriptada y devuelve los datos insertados
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          code: Codigo,
          email: correo,
          password: hashedPassword,
          degree_code: selectedCareer,
          name: name,
          lastnames: lastName,
          username: username
        }
      ])
      .select();  // Esto indica que deseas que te devuelva los datos insertados

    // Manejo de posibles errores al insertar en la base de datos
    if (error) {
      console.error('Error al insertar usuario en la base de datos:', error);
    } else {
      // console.log('Usuario insertado con éxito:', data);  
      console.log('Usuario insertado con éxito:');  
    }

  } catch (error) {
    console.error('Error en alta_usuario:', error);
  }
};

import { supabase } from "./lib/supabase";
import bcrypt from 'react-native-bcrypt';

// Función para comparar contraseñas de manera síncrona usando bcrypt
const comparePassword = (password, hashedPassword) => {
  try {
    // Comparar la contraseña en texto plano con la contraseña encriptada
    const match = bcrypt.compareSync(password, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    return false;
  }
};

export const login = async (user, contraseña) => {
  try {
    // Consultar el usuario en la base de datos por nombre de usuario o email
    const { data, error } = await supabase
      .from('users')
      .select('*') // Seleccionar toda la información del usuario
      .or(`username.eq.${user}, email.eq.${user}`);

    // Manejo de errores si no se encuentra el usuario
    if (error || data.length === 0) {
      console.error('Usuario no encontrado o error en la consulta:', error);
      return false;
    } else {
      const hashedPassword = data[0].password;

      // Comparar la contraseña ingresada con la contraseña encriptada en la base de datos
      const isMatch = comparePassword(contraseña, hashedPassword); 

      if (isMatch) {
        console.log("Inicio de sesión exitoso:", data);
        return {
          isMatch: true,
          userData: data[0], // Retorna los datos del usuario si coincide la contraseña
        };
      } else {
        console.log("Contraseña incorrecta");
        return {
          isMatch: false,
          userData: null,
        };
      }
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return false;
  }
};

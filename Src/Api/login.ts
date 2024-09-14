import { supabase } from "./lib/supabase";
import { Alert } from 'react-native';
import bcrypt from 'bcryptjs';

// Función para comparar contraseñas
const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    return false;
  }
};

// Función de login
export const login = async (user: string, contraseña: string): Promise<{ isMatch: boolean, userData: any } | false> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${user}, email.eq.${user}`);

    if (error || !data || data.length === 0) {
      return false;
    } else {
      const hashedPassword = data[0].password;
      const isMatch = await comparePassword(contraseña, hashedPassword);

      console.log("log del back", data);
      return {
        isMatch,
        userData: data,
      };
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return false;
  }
};

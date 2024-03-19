import { supabase } from "../lib/supabase";
import { Alert } from 'react-native';
import bcrypt from 'bcryptjs';


const comparePassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error al comparar contraseñas:', error);
    return false;
  }
};

export const login = async (user, contraseña) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('password') // Seleccionar solamente la contraseña encriptada
      .or(`username.eq.${user}, email.eq.${user}`);

    if (error || data.length === 0) {
      return false;
    } else {
      const hashedPassword = data[0].password;
      const isMatch = await comparePassword(contraseña, hashedPassword); 
      return isMatch;
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return false;
  }
};

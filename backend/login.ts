import { supabase } from "../lib/supabase";
import { Alert } from 'react-native';

export const login = async (user, contraseña) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('username')
      .or(`username.eq.${user}, correo.eq.${user}`)
      .eq('password', contraseña);

    if (error || data.length === 0) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return false;
  }
};

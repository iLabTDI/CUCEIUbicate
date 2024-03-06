import { supabase } from "../lib/supabase";
import { Alert } from 'react-native';

export const alta_usuario = async (Codigo, correo, contraseña, selectedCareer, name, lastName, username) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        { 
          codigo: Codigo,
          correo: correo,
          password: contraseña,
          carrera: selectedCareer,
          nombre: name,
          apellidos: lastName,
          username: username
        }
      ]);

    if (error) {

    } else {
  
    }
  } catch (error) {
    
  }
};

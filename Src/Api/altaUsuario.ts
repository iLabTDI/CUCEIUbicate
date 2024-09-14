import { supabase } from "./lib/supabase";
import bcrypt from 'bcryptjs';

// Definir el tipo para las contraseñas (puede ser 'string')
const hashPassword = async (password: string): Promise<string | null> => {
  try {
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error al hashear la contraseña:', error);
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
    const hashedPassword = await hashPassword(contraseña);

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
      ]);

    if (error) {
      console.error('Error al registrar usuario:', error);
    } else {
      console.log('Usuario registrado con éxito:', data);
    }

  } catch (error) {
    console.error('Error en alta_usuario:', error);
  }
};

import { supabase } from "./lib/supabase";
import bcrypt from 'bcryptjs';

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
  
    return null;
  }
};

export const alta_usuario = async (Codigo, correo, contraseña, selectedCareer, name, lastName, username) => {
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
      
  } catch (error) {
  
  }
};

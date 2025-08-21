import { supabase } from "./lib/supabase";

export const get_degrees = async () => {
  try {
    const { data, error } = await supabase
      .from('degrees')
      .select('name, code');

    if (error) {
      console.error('Error al consultar los datos:', error);
      return [];
    }

    if (!data) {
      console.error('Error: Datos faltantes');
      return [];
    }

    // Regresa un array de objetos { name, code }
    return data;
  } catch (error) {
    console.error('Error al consultar los datos:', error);
    return [];
  }
};

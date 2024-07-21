import { supabase } from "./lib/supabase";

export const get_degrees = async () => {
  try {
    const { data: namesData, error } = await supabase
      .from('degrees')
      .select('name');

const { data: codesData, error: codesError } = await supabase
      .from('degrees')
      .select('code');

    if (error || codesError) {
      console.error('Error al consultar los datos:', error || codesError);
      return [];
    }

    if (!namesData || !codesData) {
      console.error('Error: Datos faltantes');
      return [];
    }

    const careerOptions = namesData.map((degree, index) => `${degree.name} ${codesData[index].code}`);
    return careerOptions;
  } catch (error) {
    console.error('Error al consultar los datos:', error);
    return [];
  }
};

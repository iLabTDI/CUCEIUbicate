import { supabase } from "../lib/supabase";

export const get_degrees = async () => {
  try {
    const { data: namesData, namesError } = await supabase
      .from('degrees')
      .select('name');

    const { data: codesData, codesError } = await supabase
      .from('degrees')
      .select('code');

    if (namesError || codesError) {
      console.error('Error al consultar los datos:', namesError || codesError);
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

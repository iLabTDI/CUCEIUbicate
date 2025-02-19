import { supabase } from "./lib/supabase";

export const validar_correo = async (email) => {
  try {

    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email);


    if (data && data.length > 0) {
      return false;
    }else{
      return true;
    }

  } catch (error) {

  }

};

export const validar_codigo = async (codigo) => {
  try {

    const { data, error } = await supabase
      .from('users')
      .select('code')
      .eq('code', codigo);


    if (data && data.length > 0) {
      return false;
    }else{
      return true;
    }

  } catch (error) {

  }

};

export const validar_usuario = async (username) => {
  try {

    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', username);


    if (data && data.length > 0) {
      return false;
    }else{
      return true;
    }

  } catch (error) {

  }

};
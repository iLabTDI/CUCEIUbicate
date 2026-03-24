// Api/validaciones.ts
import { findUserByEmail, findUserByUsername, findUserByCode } from './lib/api';

// true = disponible | false = ya existe
export const validar_correo = async (email: string): Promise<boolean> => {
  try {
    const r = await findUserByEmail(email);

    if (Array.isArray(r) && r.length === 0) {
      return true;
    }

    if (Array.isArray(r) && r.length > 0) {
      return false;
    }

    return true;

  } catch (error) {
    console.error('Error validando correo:', error);
    return true;
  }
};

export const validar_usuario = async (username: string): Promise<boolean> => {
  try {
    const r = await findUserByUsername(username);

    if (Array.isArray(r) && r.length === 0) {
      return true;
    }

    if (Array.isArray(r) && r.length > 0) {
      return false;
    }

    return true;

  } catch (error) {
    console.error('Error validando usuario:', error);
    return true;
  }
};

export const validar_codigo = async (codigo: string | number): Promise<boolean> => {
  try {
    const r = await findUserByCode(codigo);

    if (Array.isArray(r) && r.length === 0) {
      return true;
    }

    if (Array.isArray(r) && r.length > 0) {
      return false;
    }

    return true;

  } catch (error) {
    console.error('Error validando código:', error);
    return true;
  }
};
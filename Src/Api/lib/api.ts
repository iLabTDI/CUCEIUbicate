// Api/api.ts
import { cleanString } from "../utils/cleanString";
import { secureHash } from "../utils/secureHash";
import { DegreeRow } from "./types/DegreeRow";
import { UserRow } from "./types/UserRow";

const BASE = 'https://ilabtdi.com/api_ubicate';
const USE_INDEX_PHP = true; // pon true si usas las URLs con index.php

const url = (p: string) => `${BASE}${USE_INDEX_PHP ? '/index.php' : ''}${p}`;

async function http(path: string, init: RequestInit = {}) {
  console.log(`🚀 Petición HTTP: ${init.method || 'GET'} ${url(path)}`);
  try {
    const res = await fetch(url(path), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...init.headers
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error del servidor:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    const responseText = await res.text();

    if (!responseText.trim()) {
      return null;
    }

    // Limpiar respuesta
    let cleanedResponse = responseText;

    const jsonStartArray = responseText.indexOf('[');
    const jsonStartObject = responseText.indexOf('{');

    let jsonStart = -1;
    if (jsonStartArray !== -1 && jsonStartObject !== -1) {
      jsonStart = Math.min(jsonStartArray, jsonStartObject);
    } else if (jsonStartArray !== -1) {
      jsonStart = jsonStartArray;
    } else if (jsonStartObject !== -1) {
      jsonStart = jsonStartObject;
    }

    if (jsonStart > 0) {
      cleanedResponse = responseText.substring(jsonStart);
    }

    try {
      const jsonData = JSON.parse(cleanedResponse);
      return jsonData;
    } catch (parseError) {
      console.error('Error parseando JSON:', parseError);

      if (cleanedResponse.includes('<html>') || cleanedResponse.includes('<!DOCTYPE')) {
        throw new Error('El servidor devolvió HTML en lugar de JSON. Verifica la URL y el endpoint.');
      }

      throw new Error(`Respuesta no válida del servidor: ${cleanedResponse.substring(0, 100)}...`);
    }

  } catch (error) {
    console.error('Error en petición HTTP:', error);
    throw error;
  }
}

// ---- CARRERAS ----
export const listDegrees = async (): Promise<DegreeRow[]> => {
  try {
    const result = await http('/CUB_degrees?order=var_name&dir=ASC');
    console.log('📊 Resultado de listDegrees:', result);
    // Si no hay resultado o es null, devolver array vacío
    if (!result) return [];

    // Si es un array, devolverlo directamente
    if (Array.isArray(result)) return result;

    // Si es un objeto con propiedad data, usar esa
    if (result.data && Array.isArray(result.data)) return result.data;

    // Si es un objeto con propiedades, convertirlo a array
    if (typeof result === 'object') return [result];

    return [];
  } catch (error) {
    console.error('❌ Error en listDegrees:', error);
    return [];
  }
};

// Buscar usuario por email
export const findUserByEmail = async (email: string): Promise<UserRow[]> => {
  try {
    const cleanEmail = cleanString(email.toLowerCase());
    const encodedEmail = encodeURIComponent(cleanEmail);

    const result = await http(`/CUB_users?var_email=${encodedEmail}`);

    if (!result) return [];
    if (Array.isArray(result)) return result;
    if (result.data && Array.isArray(result.data)) return result.data;
    if (typeof result === 'object') return [result];

    return [];
  } catch (error) {
    console.error('Error buscando usuario por email:', error);
    return [];
  }
};

// Buscar usuario por username
export const findUserByUsername = async (username: string): Promise<UserRow[]> => {
  try {
    const cleanUsername = cleanString(username.toLowerCase());
    const encodedUsername = encodeURIComponent(cleanUsername);

    const result = await http(`/CUB_users?var_username=${encodedUsername}`);

    if (!result) return [];
    if (Array.isArray(result)) return result;
    if (result.data && Array.isArray(result.data)) return result.data;
    if (typeof result === 'object') return [result];

    return [];
  } catch (error) {
    console.error('Error buscando usuario por username:', error);
    return [];
  }
};

// Buscar usuario por código
export const findUserByCode = async (code: string | number): Promise<UserRow[]> => {
  try {
    console.log('🔍 Buscando usuario por código:', code);

    // Convertir a string y limpiar
    const codeString = String(code).replaceAll(/[^\d]/g, ''); // Solo números
    const encodedCode = encodeURIComponent(codeString);

    const result = await http(`/CUB_users?int_user_code=${encodedCode}`);

    if (!result) return [];
    if (Array.isArray(result)) return result;
    if (result.data && Array.isArray(result.data)) return result.data;
    if (typeof result === 'object') return [result];

    return [];
  } catch (error) {
    console.error('❌ Error buscando usuario por código:', error);
    return [];
  }
};

// Buscar usuario por ID (usando PK 'id')
export const findUserById = async (userId: number): Promise<UserRow | null> => {
  try {
    console.log('🔍 Buscando usuario por ID:', userId);
    const result = await http(`/CUB_users/${userId}`); // Usar /{id} para PK

    if (!result) return null;
    if (typeof result === 'object') return result;

    return null;
  } catch (error) {
    console.error('❌ Error buscando usuario por ID:', error);
    return null;
  }
};

// Crear usuario (usado en alta_usuario)
export const createUser = async (userData: any): Promise<any> => {
  try {
    const cleanPayload = {
      int_user_code: Number(userData.int_user_code),
      var_email: cleanString(userData.var_email?.toLowerCase() || ''),
      var_password: userData.var_password,
      var_degree_code: cleanString(userData.var_degree_code?.toUpperCase() || ''),
      var_name: cleanString(userData.var_name || ''),
      var_lastnames: cleanString(userData.var_lastnames || ''),
      var_username: cleanString(userData.var_username?.toLowerCase() || ''),
      var_user_type: cleanString(userData.var_user_type || '')
    };

    console.log('Payload limpio para createUser:', cleanPayload);

    const result = await http('/CUB_users', {
      method: 'POST',
      body: JSON.stringify(cleanPayload)
    });

    return result;
  } catch (error) {
    console.error('Error creando usuario:', error);
    throw error;
  }
};

export type UserType = 'estudiante' | 'academico' | 'externo';
// Insertar nuevo usuario (usado en register)
export const insertUser = async (userData: {
  email: string;
  username: string;
  password: string;
  name: string;
  lastnames: string;
  degree_code: string;
  userType: UserType;
}): Promise<number> => {
  try {
    // ✨ USAR HASH CONSISTENTE AQUÍ TAMBIÉN
    const hashedPassword = secureHash(userData.password);
    console.log('📊 Hash en insertUser:', hashedPassword.substring(0, 20) + '...');

    const payload = {
      var_email: cleanString(userData.email.toLowerCase()),
      var_password: hashedPassword, // ✨ USAR EL HASH CONSISTENTE
      var_degree_code: cleanString(userData.degree_code.toUpperCase()),
      var_name: cleanString(userData.name),
      var_lastnames: cleanString(userData.lastnames),
      var_username: cleanString(userData.username.toLowerCase()),
      var_user_type: cleanString(userData.userType)
    };

    const result = await http('/CUB_users', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (typeof result === 'number') return result;
    if (result?.id) return result.id;
    if (result?.insertId) return result.insertId;

    if (result && (result.success || result.status === 'success')) {
      const newUser = await findUserByUsername(userData.username);
      if (newUser.length > 0 && newUser[0].id) {
        return newUser[0].id;
      }
    }

    throw new Error('No se pudo obtener el ID del usuario insertado');
  } catch (error) {
    console.error('Error insertando usuario:', error);
    throw error;
  }
};

// Actualizar usuario (usar PK 'id')
export const updateUser = async (userId: number, userData: Partial<UserRow>): Promise<boolean> => {
  try {
    console.log('📝 Actualizando usuario:', userId);

    const result = await http(`/CUB_users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });

    console.log('✅ Usuario actualizado, respuesta:', result);

    // Tu PHP devuelve el objeto actualizado si es exitoso
    return result && typeof result === 'object';
  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
    return false;
  }
};

// Actualizar contraseña de usuario
export const updateUserPassword = async (userId: number, newPasswordHash: string): Promise<boolean> => {
  try {
    return await updateUser(userId, { var_password: newPasswordHash });
  } catch (error) {
    console.error('❌ Error actualizando contraseña:', error);
    return false;
  }
};

// Obtener todos los usuarios (para admin)
export const getAllUsers = async (): Promise<UserRow[]> => {
  try {
    console.log('📋 Obteniendo todos los usuarios');
    const result = await http('/CUB_users?order=var_name&dir=ASC');

    if (!result) return [];
    if (Array.isArray(result)) return result;
    if (result.data && Array.isArray(result.data)) return result.data;

    return [];
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error);
    return [];
  }
};

// Eliminar usuario (usar PK 'id')
export const deleteUser = async (userId: number): Promise<boolean> => {
  try {
    console.log('🗑️ Eliminando usuario:', userId);

    const result = await http(`/CUB_users/${userId}`, {
      method: 'DELETE'
    });

    console.log('✅ Usuario eliminado, respuesta:', result);

    return result?.ok === true;
  } catch (error) {
    console.error('❌ Error eliminando usuario:', error);
    return false;
  }
};

// ---- VALIDACIONES ---- (Solo una vez)
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email) {
    return { isValid: false, message: 'El email es requerido' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Formato de email inválido' };
  }

  return { isValid: true };
};

export const validateUsername = (username: string): { isValid: boolean; message?: string } => {
  if (!username) {
    return { isValid: false, message: 'El nombre de usuario es requerido' };
  }

  if (username.length < 3) {
    return { isValid: false, message: 'El nombre de usuario debe tener al menos 3 caracteres' };
  }

  if (username.length > 30) {
    return { isValid: false, message: 'El nombre de usuario no puede tener más de 30 caracteres' };
  }

  if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
    return { isValid: false, message: 'El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos' };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: 'La contraseña es requerida' };
  }

  if (password.length < 6) {
    return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
  }

  if (password.length > 50) {
    return { isValid: false, message: 'La contraseña no puede tener más de 50 caracteres' };
  }

  return { isValid: true };
};
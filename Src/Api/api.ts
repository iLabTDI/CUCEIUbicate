// Api/api.ts
const BASE = 'https://ilabtdi.com/api_ubicate';
const USE_INDEX_PHP = true; // pon true si usas las URLs con index.php

const url = (p: string) => `${BASE}${USE_INDEX_PHP ? '/index.php' : ''}${p}`;

// Función para limpiar strings y evitar problemas de collation
const cleanString = (str: string): string => {
  if (!str) return '';

  // Normalizar y limpiar caracteres especiales
  return str
    .normalize('NFD') // Descomponer caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remover diacríticos (acentos)
    .replace(/[^\w\s@.-]/g, '') // Solo permitir caracteres seguros
    .trim();
};

async function http(path: string, init: RequestInit = {}) {
  try {
    console.log('🌐 Haciendo petición a:', url(path));

    const res = await fetch(url(path), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(init.headers || {})
      },
    });

    console.log('📡 Respuesta status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Error del servidor:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    const responseText = await res.text();
    console.log('📄 Respuesta cruda del servidor:', responseText);

    // Verificar si la respuesta es JSON válido
    if (!responseText.trim()) {
      console.log('⚠️ Respuesta vacía del servidor');
      return null;
    }

    // ✨ LIMPIAR LA RESPUESTA - Remover texto antes del JSON
    let cleanedResponse = responseText;

    // Buscar el primer '[' o '{' que indica el inicio del JSON
    const jsonStartArray = responseText.indexOf('[');
    const jsonStartObject = responseText.indexOf('{');

    let jsonStart = -1;
    if (jsonStartArray !== -1 && jsonStartObject !== -1) {
      // Tomar el que aparezca primero
      jsonStart = Math.min(jsonStartArray, jsonStartObject);
    } else if (jsonStartArray !== -1) {
      jsonStart = jsonStartArray;
    } else if (jsonStartObject !== -1) {
      jsonStart = jsonStartObject;
    }

    if (jsonStart > 0) {
      cleanedResponse = responseText.substring(jsonStart);
      console.log('🧹 Respuesta limpiada:', cleanedResponse);
    }

    // Intentar parsear como JSON
    try {
      const jsonData = JSON.parse(cleanedResponse);
      console.log('✅ JSON parseado correctamente:', jsonData);
      return jsonData;
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError);
      console.error('📄 Texto que no se pudo parsear:', cleanedResponse);

      // Si no es JSON, probablemente es un error HTML del servidor
      if (cleanedResponse.includes('<html>') || cleanedResponse.includes('<!DOCTYPE')) {
        throw new Error('El servidor devolvió HTML en lugar de JSON. Verifica la URL y el endpoint.');
      }

      throw new Error(`Respuesta no válida del servidor: ${cleanedResponse.substring(0, 100)}...`);
    }

  } catch (error) {
    console.error('🚨 Error en petición HTTP:', error);
    throw error;
  }
}

// ---- CARRERAS ----
export type DegreeRow = { var_code: string; var_name: string };
export const listDegrees = async (): Promise<DegreeRow[]> => {
  try {
    const result = await http('/CUB_degrees?order=var_name&dir=ASC');

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

// ---- USUARIOS ----
export type UserRow = {
  int_user_code?: number;
  var_email: string;
  var_username: string;
  var_password: string;
  var_name: string;
  var_lastnames: string;
  var_degree_code: string;
}

// Buscar usuario por email
export const findUserByEmail = async (email: string): Promise<UserRow[]> => {
  try {
    console.log('🔍 Buscando usuario por email:', email);

    // Limpiar y codificar el email
    const cleanEmail = cleanString(email.toLowerCase());
    const encodedEmail = encodeURIComponent(cleanEmail);

    const result = await http(`/CUB_users?var_email=${encodedEmail}`);

    if (!result) return [];
    if (Array.isArray(result)) return result;
    if (result.data && Array.isArray(result.data)) return result.data;
    if (typeof result === 'object') return [result];

    return [];
  } catch (error) {
    console.error('❌ Error buscando usuario por email:', error);
    return [];
  }
};

// Buscar usuario por username
export const findUserByUsername = async (username: string): Promise<UserRow[]> => {
  try {
    console.log('🔍 Buscando usuario por username:', username);

    // Limpiar y normalizar el username
    const cleanUsername = cleanString(username.toLowerCase());
    const encodedUsername = encodeURIComponent(cleanUsername);

    const result = await http(`/CUB_users?var_username=${encodedUsername}`);

    if (!result) return [];
    if (Array.isArray(result)) return result;
    if (result.data && Array.isArray(result.data)) return result.data;
    if (typeof result === 'object') return [result];

    return [];
  } catch (error) {
    console.error('❌ Error buscando usuario por username:', error);
    return [];
  }
};

// Buscar usuario por código
export const findUserByCode = async (code: string | number): Promise<UserRow[]> => {
  try {
    console.log('🔍 Buscando usuario por código:', code);

    // Convertir a string y limpiar
    const codeString = String(code).replace(/[^\d]/g, ''); // Solo números
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

// Buscar usuario por ID
export const findUserById = async (userId: number): Promise<UserRow | null> => {
  try {
    console.log('🔍 Buscando usuario por ID:', userId);
    const result = await http(`/CUB_users?int_user_code=${userId}`);

    if (!result) return null;
    if (Array.isArray(result) && result.length > 0) return result[0];
    if (result.data && Array.isArray(result.data) && result.data.length > 0) return result.data[0];
    if (typeof result === 'object') return result;

    return null;
  } catch (error) {
    console.error('❌ Error buscando usuario por ID:', error);
    return null;
  }
};

// Insertar nuevo usuario
export const insertUser = async (userData: {
  email: string;
  username: string;
  password: string;
  name: string;
  lastnames: string;
  degree_code: string;
}): Promise<number> => {
  try {
    console.log('📝 Insertando nuevo usuario:', userData.username);

    // Limpiar todos los strings antes de enviar
    const payload = {
      var_email: cleanString(userData.email.toLowerCase()),
      var_username: cleanString(userData.username.toLowerCase()),
      var_password: userData.password, // El hash no se limpia
      var_name: cleanString(userData.name),
      var_lastnames: cleanString(userData.lastnames),
      var_degree_code: cleanString(userData.degree_code.toUpperCase())
    };

    const result = await http('/CUB_users', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    console.log('✅ Usuario insertado, respuesta:', result);

    // Si el servidor devuelve el ID directamente
    if (typeof result === 'number') return result;

    // Si el servidor devuelve un objeto con el ID
    if (result && result.int_user_code) return result.int_user_code;
    if (result && result.id) return result.id;
    if (result && result.insertId) return result.insertId;

    // Si el servidor devuelve success, buscar el usuario recién creado
    if (result && (result.success || result.status === 'success')) {
      const newUser = await findUserByUsername(userData.username);
      if (newUser.length > 0 && newUser[0].int_user_code) {
        return newUser[0].int_user_code;
      }
    }

    throw new Error('No se pudo obtener el ID del usuario insertado');
  } catch (error) {
    console.error('❌ Error insertando usuario:', error);
    throw error;
  }
};

// Crear usuario (usado en alta_usuario)
export const createUser = async (userData: any): Promise<any> => {
  try {
    console.log('📝 Creando nuevo usuario:', userData.var_username);

    // Limpiar strings en el payload
    const cleanPayload = {
      ...userData,
      var_email: cleanString(userData.var_email?.toLowerCase() || ''),
      var_username: cleanString(userData.var_username?.toLowerCase() || ''),
      var_name: cleanString(userData.var_name || ''),
      var_lastnames: cleanString(userData.var_lastnames || ''),
      var_degree_code: cleanString(userData.var_degree_code?.toUpperCase() || ''),
      // El int_user_code se mantiene como número
      int_user_code: userData.int_user_code ? Number(userData.int_user_code) : undefined
    };

    // Remover campos undefined
    Object.keys(cleanPayload).forEach(key => {
      if (cleanPayload[key] === undefined) {
        delete cleanPayload[key];
      }
    });

    const result = await http('/CUB_users', {
      method: 'POST',
      body: JSON.stringify(cleanPayload)
    });

    console.log('✅ Usuario creado, respuesta:', result);
    return result;
  } catch (error) {
    console.error('❌ Error creando usuario:', error);
    throw error;
  }
};

// Actualizar usuario
export const updateUser = async (userId: number, userData: Partial<UserRow>): Promise<boolean> => {
  try {
    console.log('📝 Actualizando usuario:', userId);

    const result = await http(`/CUB_users?int_user_code=${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });

    console.log('✅ Usuario actualizado, respuesta:', result);

    return result && (result.success || result.status === 'success' || result.rowsAffected > 0);
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

// Eliminar usuario
export const deleteUser = async (userId: number): Promise<boolean> => {
  try {
    console.log('🗑️ Eliminando usuario:', userId);

    const result = await http(`/CUB_users?int_user_code=${userId}`, {
      method: 'DELETE'
    });

    console.log('✅ Usuario eliminado, respuesta:', result);

    return result && (result.success || result.status === 'success');
  } catch (error) {
    console.error('❌ Error eliminando usuario:', error);
    return false;
  }
};

// ---- VALIDACIONES ----
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

// ---- REGISTRO DE USUARIO ----
export const registerUser = async (userData: {
  email: string;
  username: string;
  password: string;
  name: string;
  lastnames: string;
  degree_code: string;
}): Promise<{ success: boolean; message: string; userId?: number }> => {
  try {
    console.log('🔍 Iniciando registro para usuario:', userData.username);

    // Validar email
    const emailValidation = validateEmail(userData.email);
    if (!emailValidation.isValid) {
      return { success: false, message: emailValidation.message! };
    }

    // Validar username
    const usernameValidation = validateUsername(userData.username);
    if (!usernameValidation.isValid) {
      return { success: false, message: usernameValidation.message! };
    }

    // Validar password
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      return { success: false, message: passwordValidation.message! };
    }

    // Verificar si el email ya existe
    const existingEmail = await findUserByEmail(userData.email);
    if (existingEmail && existingEmail.length > 0) {
      return { success: false, message: 'El email ya está registrado' };
    }

    // Verificar si el username ya existe
    const existingUsername = await findUserByUsername(userData.username);
    if (existingUsername && existingUsername.length > 0) {
      return { success: false, message: 'El nombre de usuario ya está en uso' };
    }

    // Insertar usuario
    const userId = await insertUser(userData);

    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      userId: userId
    };

  } catch (error) {
    console.error('🚨 Error en registro:', error);
    return {
      success: false,
      message: 'Error interno del servidor. Por favor intenta de nuevo.'
    };
  }
};
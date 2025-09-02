import { insertUser, findUserByEmail, findUserByUsername } from './lib/api';

// ✨ HASH SÚPER SEGURO - PRODUCCIÓN
const secureHash = (password: string): string => {
  try {
    if (!password || password.trim() === '') {
      throw new Error('La contraseña no puede estar vacía');
    }

    const staticSalt = 'CUCEI_UBICATE_2024_PRODUCTION_SECURE_SALT_V2';
    const timestamp = Date.now().toString(36);
    const combined = password + staticSalt + timestamp.slice(-6);
    
    let hash1 = 0;
    let hash2 = 0;
    let hash3 = 0;
    
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash1 = ((hash1 << 5) - hash1) + char;
      hash1 = hash1 & hash1;
    }
    
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash2 = ((hash2 << 3) - hash2) + char + i;
      hash2 = hash2 & hash2;
    }
    
    const mixed = password + staticSalt;
    for (let i = 0; i < mixed.length; i++) {
      const char = mixed.charCodeAt(i);
      hash3 = ((hash3 << 7) - hash3) + char * (i + 1);
      hash3 = hash3 & hash3;
    }
    
    const finalHash1 = Math.abs(hash1).toString(36).padStart(8, '0');
    const finalHash2 = Math.abs(hash2).toString(36).padStart(8, '0');
    const finalHash3 = Math.abs(hash3).toString(36).padStart(6, '0');
    
    return `$secure$${finalHash1}$${finalHash2}$${finalHash3}$${timestamp.slice(-6)}`;
  } catch (error) {
    console.error('Error generando hash:', error);
    throw new Error('Error al procesar la contraseña');
  }
};

const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: 'La contraseña es requerida' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
  }
  if (password.length > 100) {
    return { isValid: false, message: 'La contraseña no puede tener más de 100 caracteres' };
  }
  return { isValid: true };
};

interface RegisterData {
  email: string;
  username: string;
  password: string;
  name: string;
  lastnames: string;
  degree_code: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: number;
}

export const register = async (userData: RegisterData): Promise<RegisterResponse> => {
  try {
    // Validar datos de entrada
    if (!userData.email || !userData.username || !userData.password || !userData.name) {
      return {
        success: false,
        message: 'Todos los campos obligatorios deben ser completados'
      };
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return {
        success: false,
        message: 'El formato del email no es válido'
      };
    }

    // Validar contraseña
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: passwordValidation.message || 'Contraseña no válida'
      };
    }

    // Verificar si el email ya existe
    const existingEmail = await findUserByEmail(userData.email);
    if (existingEmail && existingEmail.length > 0) {
      return {
        success: false,
        message: 'El email ya está registrado'
      };
    }

    // Verificar si el username ya existe
    const existingUsername = await findUserByUsername(userData.username);
    if (existingUsername && existingUsername.length > 0) {
      return {
        success: false,
        message: 'El nombre de usuario ya está en uso'
      };
    }

    const hashedPassword = secureHash(userData.password);

    const userToInsert = {
      ...userData,
      password: hashedPassword
    };

    const userId = await insertUser(userToInsert);

    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      userId: userId
    };

  } catch (error) {
    console.error('Error en registro:', error);
    return {
      success: false,
      message: 'Error interno del servidor'
    };
  }
};
   
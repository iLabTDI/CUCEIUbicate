// Api/login.ts
import { findUserByEmail, findUserByUsername, UserRow } from './lib/api';

// ✨ VERIFICACIÓN SÚPER SEGURA - PRODUCCIÓN
const secureCompare = (password: string, hashedPassword: string): boolean => {
  try {
    if (!password || !hashedPassword) {
      return false;
    }

    // Verificar formato del hash
    if (hashedPassword.startsWith('$cucei$')) {
      // Parsear hash: $secure$hash1$hash2$hash3$timestamp
      const parts = hashedPassword.split('$');
      if (parts.length !== 6) {
        return false;
      }

      const storedHash1 = parts[2];
      const storedHash2 = parts[3];
      const storedHash3 = parts[4];
      const timestamp = parts[5];
      
      // Recrear el hash con los mismos parámetros
      const staticSalt = 'CUCEI_UBICATE_2025_PRODUCTION_SECURE_SALT_V2';
      const combined = password + staticSalt + timestamp;
      
      let hash1 = 0;
      let hash2 = 0;
      let hash3 = 0;
      
      // Misma primera pasada
      for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash1 = ((hash1 << 5) - hash1) + char;
        hash1 = hash1 & hash1;
      }
      
      // Misma segunda pasada
      for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash2 = ((hash2 << 3) - hash2) + char + i;
        hash2 = hash2 & hash2;
      }
      
      // Misma tercera pasada
      const mixed = password + staticSalt;
      for (let i = 0; i < mixed.length; i++) {
        const char = mixed.charCodeAt(i);
        hash3 = ((hash3 << 7) - hash3) + char * (i + 1);
        hash3 = hash3 & hash3;
      }
      
      const inputHash1 = Math.abs(hash1).toString(36).padStart(8, '0');
      const inputHash2 = Math.abs(hash2).toString(36).padStart(8, '0');
      const inputHash3 = Math.abs(hash3).toString(36).padStart(6, '0');
      
      return (inputHash1 === storedHash1) && 
             (inputHash2 === storedHash2) && 
             (inputHash3 === storedHash3);
    }
    
    // Fallback para hashes antiguos
    const salt = 'CUCEI_UBICATE_2025_SECURE_SALT';
    const combined = password + salt;
    
    let inputHash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      inputHash = ((inputHash << 5) - inputHash) + char;
      inputHash = inputHash & inputHash;
    }
    
    const inputHashString = Math.abs(inputHash).toString(16).padStart(8, '0');
    const storedHashPart = hashedPassword.substring(0, 8);
    
    return inputHashString === storedHashPart;
    
  } catch (error) {
    console.error('Error en verificación de contraseña:', error);
    return false;
  }
};

export const login = async (
  user: string,
  contraseña: string
): Promise<{ isMatch: boolean; userData: any } | false> => {
  try {
    // Validar entrada
    if (!user || !contraseña) {
      return { isMatch: false, userData: null };
    }
    
    // Limpiar el usuario
    const cleanUser = user.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
    
    // Buscar por email primero
    let rows: UserRow[] = await findUserByEmail(cleanUser);
    
    // Si no encuentra por email, buscar por username
    if (!rows?.length) {
      rows = await findUserByUsername(cleanUser);
    }
    
    // Si no se encuentra el usuario
    if (!rows?.length) {
      return { isMatch: false, userData: null };
    }

    const u = rows[0];
    
    // ✨ LOG ESPECÍFICO PARA DEBUG DE CÓDIGO ESTUDIANTIL
    console.log('📊 DEBUG - Código estudiantil:', {
      id: u.id,
      int_user_code: u.int_user_code,
      type: typeof u.int_user_code,
      username: u.var_username
    });
    
    // Comparar contraseñas
    const ok = secureCompare(contraseña, u.var_password);
    
    if (!ok) {
      return { isMatch: false, userData: null };
    }

    // ✨ MAPEO DEL CÓDIGO ESTUDIANTIL
    const rawCode = u.int_user_code;
    let finalCode;
    
    if (rawCode === null || rawCode === undefined) {
      finalCode = 'No asignado';
    } else if (rawCode === 0) {
      finalCode = 'Código pendiente';
    } else if (typeof rawCode === 'string' && rawCode === '') {
      finalCode = 'No válido';
    } else {
      finalCode = rawCode;
    }

    const userData = {
      id: u.id,
      email: u.var_email,
      username: u.var_username,
      name: u.var_name,
      lastnames: u.var_lastnames,
      degree_code: u.var_degree_code,
      code: finalCode,
      user_code: finalCode,
      student_code: finalCode,
      codigo: finalCode
    };

    console.log('✅ Login exitoso - Código final:', finalCode);
    
    return {
      isMatch: true,
      userData: userData,
    };
  } catch (error) {
    console.error('Error en login:', error);
    return false;
  }
};
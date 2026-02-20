import { findUserByEmail } from './lib/api';

// ✨ FUNCIÓN DE HASH IDÉNTICA A ALTAUSUARIO - EXACTAMENTE LA MISMA
const secureHash = (password) => {
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

// ✨ VERIFICACIÓN ARREGLADA PARA 6 PARTES
const verifyPassword = (inputPassword, storedHash) => {
  try {
    if (!inputPassword || !storedHash) {
      console.log('❌ Datos faltantes para verificación');
      return false;
    }

    // ✨ MÉTODO 1: HASH SEGURO CON $secure$ - ARREGLADO PARA 6 PARTES
    if (storedHash.startsWith('$secure$')) {
      const parts = storedHash.split('$');

      // ✨ AHORA SÍ MANEJA 6 PARTES CORRECTAMENTE
      if (parts.length === 6) {
        // Formato: ["", "secure", "hash1", "hash2", "hash3", "timestamp"]
        const [, , hash1Stored, hash2Stored, hash3Stored, timestampStored] = parts;

        // ✨ RECREAR HASH CON LOS COMPONENTES SEPARADOS
        const staticSalt = 'CUCEI_UBICATE_2024_PRODUCTION_SECURE_SALT_V2';
        const combined = inputPassword + staticSalt + timestampStored;

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

        const mixed = inputPassword + staticSalt;
        for (let i = 0; i < mixed.length; i++) {
          const char = mixed.charCodeAt(i);
          hash3 = ((hash3 << 7) - hash3) + char * (i + 1);
          hash3 = hash3 & hash3;
        }

        const finalHash1 = Math.abs(hash1).toString(36).padStart(8, '0');
        const finalHash2 = Math.abs(hash2).toString(36).padStart(8, '0');
        const finalHash3 = Math.abs(hash3).toString(36).padStart(6, '0');

        const match = finalHash1 === hash1Stored &&
          finalHash2 === hash2Stored &&
          finalHash3 === hash3Stored;

        if (match) {
          return true;
        }
      }
      // ✨ FALLBACK PARA FORMATO DE 5 PARTES (por si acaso)
      else if (parts.length === 5) {
        const [, , hash1Stored, hash2Stored, hash3AndTimestamp] = parts;
        const timestampStored = hash3AndTimestamp.slice(-6);
        const hash3Stored = hash3AndTimestamp.slice(0, -6);

        // Mismo proceso de hash...
        const staticSalt = 'CUCEI_UBICATE_2024_PRODUCTION_SECURE_SALT_V2';
        const combined = inputPassword + staticSalt + timestampStored;

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

        const mixed = inputPassword + staticSalt;
        for (let i = 0; i < mixed.length; i++) {
          const char = mixed.charCodeAt(i);
          hash3 = ((hash3 << 7) - hash3) + char * (i + 1);
          hash3 = hash3 & hash3;
        }

        const finalHash1 = Math.abs(hash1).toString(36).padStart(8, '0');
        const finalHash2 = Math.abs(hash2).toString(36).padStart(8, '0');
        const finalHash3 = Math.abs(hash3).toString(36).padStart(6, '0');

        const match = finalHash1 === hash1Stored &&
          finalHash2 === hash2Stored &&
          finalHash3 === hash3Stored;

        if (match) {
          return true;
        }
      } else {
        console.log('❌ Formato de hash inválido');
      }
    }

    // ✨ MÉTODO 2: COMPARACIÓN DIRECTA
    const directMatch = inputPassword === storedHash;
    if (directMatch) {
      return true;
    }

    // ✨ MÉTODO 3: HASH LEGACY
    try {
      const legacySalt = 'CUCEI_UBICATE_2024_SALT';
      const legacyHash = inputPassword + legacySalt;

      let hashValue = 0;
      for (let i = 0; i < legacyHash.length; i++) {
        const char = legacyHash.charCodeAt(i);
        hashValue = ((hashValue << 5) - hashValue) + char;
        hashValue = hashValue & hashValue;
      }

      const legacyHashString = Math.abs(hashValue).toString(36);

      if (legacyHashString === storedHash) {
        return true;
      }
    } catch (legacyError) {
      console.log('⚠️ Error en hash legacy:', legacyError.message);
    }

    console.log('❌ === NINGÚN MÉTODO FUNCIONÓ - CONTRASEÑA INCORRECTA ===');
    return false;

  } catch (error) {
    console.error('🚨 Error verificando contraseña:', error);
    return false;
  }
};

export const login = async (email, password) => {
  try {
    if (!email || !password) {
      console.log('❌ Email o contraseña faltantes');
      return { isMatch: false, userData: null };
    }

    // Buscar usuario
    const users = await findUserByEmail(email);

    if (!users || users.length === 0) {
      return { isMatch: false, userData: null };
    }

    const user = users[0];

    // ✨ VERIFICAR CONTRASEÑA CON MÉTODO ARREGLADO
    const passwordMatch = verifyPassword(password, user.var_password);

    if (!passwordMatch) {
      return { isMatch: false, userData: null };
    }

    const userData = {
      id: user.id,
      email: user.var_email,
      username: user.var_username,
      name: user.var_name,
      lastnames: user.var_lastnames,
      code: user.int_user_code,
      degree_code: user.var_degree_code,
      user_code: user.int_user_code
    };

    return {
      isMatch: true,
      userData: userData
    };

  } catch (error) {
    console.error('🚨 === ERROR EN LOGIN ===', error);
    return { isMatch: false, userData: null };
  }
};

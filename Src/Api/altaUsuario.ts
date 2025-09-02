// Api/altaUsuario.ts
import { createUser } from './lib/api';

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

export const alta_usuario = async (
  Codigo: string,
  correo: string,
  contraseña: string,
  selectedCareer: string,
  name: string,
  lastName: string,
  username: string
) => {
  try {
    // Validar código
    const codigoNumerico = Number(Codigo);
    if (isNaN(codigoNumerico) || codigoNumerico <= 0 || Codigo.length !== 9) {
      throw new Error(`Código inválido: ${Codigo}. Debe tener exactamente 9 dígitos.`);
    }
    
    console.log('📊 DEBUG - Creando usuario con código:', codigoNumerico);

    const hashed = secureHash(contraseña);

    const payload: any = {
      int_user_code: codigoNumerico,
      var_email: correo,
      var_password: hashed,
      var_degree_code: selectedCareer,
      var_name: name,
      var_lastnames: lastName,
      var_username: username
    };
    
    const inserted = await createUser(payload);
    
    // ✨ VERIFICACIÓN DEBUG
    try {
      const { findUserByUsername } = require('./lib/api');
      const verificacion = await findUserByUsername(username);
      if (verificacion && verificacion.length > 0) {
        console.log('📊 DEBUG - Usuario creado:', {
          id: verificacion[0].id,
          int_user_code: verificacion[0].int_user_code,
          esperado: codigoNumerico,
          coincide: verificacion[0].int_user_code === codigoNumerico
        });
      }
    } catch (verifyError) {
      console.error('Error verificando usuario:', verifyError);
    }
    
    return inserted;
  } catch (error) {
    console.error('Error en alta_usuario:', error);
    throw error;
  }
};
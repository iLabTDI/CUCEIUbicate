import { findUserByEmail, findUserByUsername, UserRow } from './lib/api';

// ✨ FUNCIÓN DE HASH IDÉNTICA A ALTAUSUARIO - EXACTAMENTE LA MISMA
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

// ✨ VERIFICACIÓN SÚPER ARREGLADA - MANEJA 6 PARTES CORRECTAMENTE
const secureCompare = (password: string, hashedPassword: string): boolean => {
  try {
    console.log('🔐 === VERIFICANDO CONTRASEÑA ===');
    console.log('📝 Password ingresado:', password);
    console.log('🗄️ Hash almacenado:', hashedPassword);
    
    if (!password || !hashedPassword) {
      console.log('❌ Datos faltantes');
      return false;
    }

    // ✨ VERIFICACIÓN DE HASH SEGURO $secure$
    if (hashedPassword.startsWith('$secure$')) {
      console.log('🔒 Hash seguro detectado');
      
      const parts = hashedPassword.split('$');
      console.log('📊 Partes del hash:', parts.length);
      
      if (parts.length === 6) {
        // ✨ FORMATO: ["", "secure", "hash1", "hash2", "hash3", "timestamp"]
        const [, , hash1Stored, hash2Stored, hash3Stored, timestampStored] = parts;
        
        console.log('🔍 Componentes:');
        console.log('- Hash1:', hash1Stored);
        console.log('- Hash2:', hash2Stored);
        console.log('- Hash3:', hash3Stored);
        console.log('- Timestamp:', timestampStored);
        
        // ✨ RECREAR HASH CON EL TIMESTAMP ALMACENADO
        const staticSalt = 'CUCEI_UBICATE_2024_PRODUCTION_SECURE_SALT_V2';
        const combined = password + staticSalt + timestampStored;
        
        let hash1 = 0;
        let hash2 = 0;
        let hash3 = 0;
        
        // Primera pasada
        for (let i = 0; i < combined.length; i++) {
          const char = combined.charCodeAt(i);
          hash1 = ((hash1 << 5) - hash1) + char;
          hash1 = hash1 & hash1;
        }
        
        // Segunda pasada
        for (let i = 0; i < combined.length; i++) {
          const char = combined.charCodeAt(i);
          hash2 = ((hash2 << 3) - hash2) + char + i;
          hash2 = hash2 & hash2;
        }
        
        // Tercera pasada
        const mixed = password + staticSalt;
        for (let i = 0; i < mixed.length; i++) {
          const char = mixed.charCodeAt(i);
          hash3 = ((hash3 << 7) - hash3) + char * (i + 1);
          hash3 = hash3 & hash3;
        }
        
        const finalHash1 = Math.abs(hash1).toString(36).padStart(8, '0');
        const finalHash2 = Math.abs(hash2).toString(36).padStart(8, '0');
        const finalHash3 = Math.abs(hash3).toString(36).padStart(6, '0');
        
        console.log('🔍 Comparación:');
        console.log('Hash1:', finalHash1, '=', hash1Stored, '?', finalHash1 === hash1Stored);
        console.log('Hash2:', finalHash2, '=', hash2Stored, '?', finalHash2 === hash2Stored);
        console.log('Hash3:', finalHash3, '=', hash3Stored, '?', finalHash3 === hash3Stored);
        
        const match = finalHash1 === hash1Stored && 
                     finalHash2 === hash2Stored && 
                     finalHash3 === hash3Stored;
        
        console.log('🎯 ¿Coinciden todos los hashes?', match);
        if (match) {
          console.log('✅ === PASSWORD CORRECTA ===');
          return true;
        }
      }
    }
    
    // ✨ FALLBACK: COMPARACIÓN DIRECTA
    console.log('🔓 Intentando comparación directa');
    if (password === hashedPassword) {
      console.log('✅ === PASSWORD CORRECTA (DIRECTA) ===');
      return true;
    }
    
    console.log('❌ === PASSWORD INCORRECTA ===');
    return false;
    
  } catch (error) {
    console.error('🚨 Error verificando contraseña:', error);
    return false;
  }
};

export const login = async (
  user: string,
  contraseña: string
): Promise<{ isMatch: boolean; userData: any } | false> => {
  try {
    console.log('🔍 === INICIANDO LOGIN TYPESCRIPT ARREGLADO ===');
    console.log('📧 Email/User:', user);
    console.log('🔐 Password preview:', contraseña ? `${contraseña.substring(0, 2)}***` : 'N/A');
    
    // Validar entrada
    if (!user || !contraseña) {
      console.log('❌ Usuario o contraseña faltantes');
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
      console.log('❌ No se encontró usuario con ese email/username');
      return { isMatch: false, userData: null };
    }

    const u = rows[0];
    console.log('👤 === USUARIO ENCONTRADO TYPESCRIPT ===');
    console.log('ID:', u.id);
    console.log('Email:', u.var_email);
    console.log('Username:', u.var_username);
    console.log('Name:', u.var_name);
    console.log('Code:', u.int_user_code);
    console.log('Hash formato:', u.var_password?.substring(0, 15) + '...');
    console.log('Hash completo para debug:', u.var_password);
    
    // ✨ LOG ESPECÍFICO PARA DEBUG DE CÓDIGO ESTUDIANTIL
    console.log('📊 DEBUG - Código estudiantil:', {
      id: u.id,
      int_user_code: u.int_user_code,
      type: typeof u.int_user_code,
      username: u.var_username
    });
    
    // ✨ COMPARAR CONTRASEÑAS CON MÉTODO ARREGLADO
    const ok = secureCompare(contraseña, u.var_password);
    
    if (!ok) {
      console.log('❌ === CONTRASEÑA INCORRECTA DESPUÉS DE TODOS LOS MÉTODOS ===');
      return { isMatch: false, userData: null };
    }

    console.log('✅ === LOGIN TYPESCRIPT SÚPER EXITOSO ===');

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

    console.log('📊 === DATOS TYPESCRIPT PARA SESIÓN ===');
    console.log(JSON.stringify(userData, null, 2));
    console.log('✅ Login exitoso - Código final:', finalCode);
    
    return {
      isMatch: true,
      userData: userData,
    };
  } catch (error) {
    console.error('🚨 === ERROR EN LOGIN TYPESCRIPT ===', error);
    return false;
  }
};

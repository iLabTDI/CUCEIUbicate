import { findUserByEmail, findUserByUsername, UserRow } from './lib/api';
import { secureCompare } from './utils/secureCompare';

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
      .replaceAll(/[\u0300-\u036f]/g, '')
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
    console.log('userType:', u.var_user_type);

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
      codigo: finalCode,
      userType: u.var_user_type
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

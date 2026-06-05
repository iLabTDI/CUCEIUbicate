// Api/altaUsuario.ts
import { createUser, UserType } from './lib/api';
import { secureHash } from './utils/secureHash';

interface AltaUsuarioParams {
  code: string;
  email: string;
  password: string;
  selectedCareer: string;
  name: string;
  lastName: string;
  username: string;
  userType: UserType;
}

export const alta_usuario = async ({ code, email, password, selectedCareer, name, lastName, username, userType }: AltaUsuarioParams) => {
  try {
    // Validar código
    const codigoNumerico = Number(code);
    if (userType !== "externo" && (Number.isNaN(codigoNumerico) || codigoNumerico <= 0 || code.length !== 9)) {
      throw new Error(`Código inválido: ${code}. Debe tener exactamente 9 dígitos.`);
    }
    console.log('📊 === CREANDO USUARIO CON HASH CONSISTENTE ===');
    console.log('📊 Código:', codigoNumerico);
    console.log('📊 Email:', email);
    console.log('📊 Password preview:', password.substring(0, 3) + '***');

    // ✨ GENERAR HASH CON LA FUNCIÓwN IDÉNTICA
    const hashed = secureHash(password);
    console.log('📊 Hash generado formato:', hashed.substring(0, 20) + '...');
    console.log('📊 Hash longitud:', hashed.length);
    console.log('📊 Hash partes:', hashed.split('$').length);

    const payload = {
      int_user_code: codigoNumerico,
      var_email: email,
      var_password: hashed,
      var_degree_code: selectedCareer,
      var_name: name,
      var_lastnames: lastName,
      var_username: username,
      var_user_type: userType
    };

    console.log('📊 === PAYLOAD FINAL ===');
    console.log('Password hash final:', payload.var_password);
    console.log('User type final:', payload.var_user_type);

    const inserted = await createUser(payload);

    console.log('✅ === USUARIO CREADO EXITOSAMENTE ===');
    return inserted;
  } catch (error) {
    console.error('🚨 Error en alta_usuario:', error);
    throw error;
  }
};
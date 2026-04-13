import AsyncStorage from "@react-native-async-storage/async-storage";

// ✨ GUARDAR SESIÓN CON LOGS SÚPER DETALLADOS Y VALIDACIÓN
export const setSession = async (userData) => {
  try {
    console.log('💾 === GUARDANDO SESIÓN ===');
    console.log('📊 Datos recibidos tipo:', typeof userData);
    console.log('📊 Datos recibidos:', JSON.stringify(userData, null, 2));

    // Validar que tenemos los datos mínimos necesarios
    if (!userData?.email || !userData.username) {
      throw new Error('Datos de usuario incompletos para guardar sesión');
    }

    const sessionData = JSON.stringify(userData);
    await AsyncStorage.setItem("userSession", sessionData);

    console.log('✅ Sesión guardada exitosamente');
    console.log('🔍 Verificando guardado inmediatamente...');

    // ✨ VERIFICACIÓN INMEDIATA MEJORADA
    const savedData = await AsyncStorage.getItem("userSession");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log('✅ === VERIFICACIÓN EXITOSA ===');
      console.log('👤 Usuario verificado:', parsedData.username);
      console.log('📧 Email verificado:', parsedData.email);
      console.log('🎓 Código verificado:', parsedData.code);
      return true;
    } else {
      console.log('❌ Error - no se pudieron guardar los datos');
      return false;
    }
  } catch (error) {
    console.error("🚨 Error guardando sesión:", error);
    throw error;
  }
};

// ✨ OBTENER SESIÓN CON LOGS SÚPER DETALLADOS
export const getSession = async () => {
  try {
    console.log('🔍 === OBTENIENDO SESIÓN ===');

    const session = await AsyncStorage.getItem("userSession");

    if (session) {
      const userData = JSON.parse(session);
      console.log('✅ === SESIÓN ENCONTRADA ===');
      console.log('👤 Usuario:', userData.username || userData.name);
      console.log('📧 Email:', userData.email);
      console.log('🎓 Código:', userData.code || userData.user_code);
      console.log('📊 Datos completos disponibles:', Object.keys(userData));
      return userData;
    } else {
      console.log('❌ No hay sesión guardada');
      return null;
    }
  } catch (error) {
    console.error("🚨 Error obteniendo sesión:", error);
    return null;
  }
};

// ✨ LIMPIAR SESIÓN CON LOGS MEJORADOS
export const clearSession = async () => {
  try {
    await AsyncStorage.removeItem("userSession");
    console.log("🗑️ Sesión eliminada exitosamente");
  } catch (error) {
    console.error("🚨 Error eliminando sesión:", error);
  }
};

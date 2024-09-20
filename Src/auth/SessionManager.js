import AsyncStorage from "@react-native-async-storage/async-storage";

// 
export const setSession = async (userData) => { 
  try {
    await AsyncStorage.setItem("userSession", JSON.stringify(userData));
  } catch (error) {
    console.error("Error guardar session:", error);
  }
};

//obtiene la sesion del usuario que se logueo en la app 
export const getSession = async () => {
  try {
    const session = await AsyncStorage.getItem("userSession"); //session guardada en el dispositivo
    console.log("Session guardada...", session);
    return session ? JSON.parse(session) : null; 
  } catch (error) {
    console.error("Error al obtener session", error);
    return null;
  }
};

//borra la sesion del usuario que se logueo en la app
export const clearSession = async () => {
  try {
    console.log("Session cerrada...");
    await AsyncStorage.removeItem("userSession"); //borra la session guardada en el dispositivo
  } catch (error) {
    console.error("Error al borrar sesion:", error);
  }
};

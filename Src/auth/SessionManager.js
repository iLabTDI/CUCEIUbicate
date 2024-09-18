import AsyncStorage from "@react-native-async-storage/async-storage";

export const setSession = async (userData) => {
  try {
    await AsyncStorage.setItem("userSession", JSON.stringify(userData));
  } catch (error) {
    console.error("Error guardar session:", error);
  }
};

export const getSession = async () => {
  try {
    const session = await AsyncStorage.getItem("userSession");
    console.log("Session guardada...");
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error("Error al obtener session", error);
    return null;
  }
};

export const clearSession = async () => {
  try {
    console.log("Session cerrada...");
    await AsyncStorage.removeItem("userSession");
  } catch (error) {
    console.error("Error al borrar sesion:", error);
  }
};

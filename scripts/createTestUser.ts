// Script para crear usuario de prueba con datos random
import { alta_usuario } from "../Src/Api/altaUsuario";

const crearUsuarioPrueba = async () => {
  try {
    // Generar datos únicos random
    const randomNum = Math.floor(Math.random() * 900000000) + 100000000; // 9 dígitos
    const carreras = ["INCO", "INFO", "INBI", "ICIV", "INQU", "LIFI", "LIMA"];
    const carreraRandom = carreras[Math.floor(Math.random() * carreras.length)];
    const timestamp = Date.now().toString(36);

    const datos = {
      codigo: randomNum.toString(),
      correo: `test_${timestamp}@gmail.com`,
      password: "Test1234!",
      carrera: carreraRandom,
      nombre: "Test",
      apellido: "Usuario",
      username: `testuser_${timestamp}`,
    };

    console.log("🚀 Creando usuario de prueba con datos random...");
    console.log("📋 Datos:", datos);

    const resultado = await alta_usuario(
      datos.codigo,
      datos.correo,
      datos.password,
      datos.carrera,
      datos.nombre,
      datos.apellido,
      datos.username,
    );

    console.log("✅ Usuario creado exitosamente:", resultado);
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
  }
};

crearUsuarioPrueba();

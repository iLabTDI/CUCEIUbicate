import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  StyleSheet
} from "react-native";

// --------------------------------------------------------------------------------
// Configuración de la API
// --------------------------------------------------------------------------------
const API_URL = "https://api.stack-ai.com/inference/v0/run/aaed654c-4c8c-4da5-a8c5-654a66f205d6/678e9ce9a552023b10e3cbca";
const HEADERS = {
  'Authorization': 'Bearer 30f80baa-f708-456f-a3af-08f7041d1600',
  'Content-Type': 'application/json'
};

// --------------------------------------------------------------------------------
// Función para consultar la API
// --------------------------------------------------------------------------------
async function query(user_id, user_input) {
  const payload = {
    "user_id": user_id,
    "in-0": user_input
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Error al comunicarse con la API");
    }

    const responseData = await response.json();
    const rawResponse = responseData.outputs?.["out-0"] 
      || "No se recibió una respuesta válida en el campo 'out-0'.";

    // Recortar la respuesta a 5000 caracteres si excede
    return rawResponse.slice(0, 5000);

  } catch (e) {
    return `Error al comunicarse con la API: ${e.message}`;
  }
}

// --------------------------------------------------------------------------------
// Función para verificar si el texto contiene comillas o citas
// --------------------------------------------------------------------------------
function isQuoted(text) {
  const regex = /["“”‘’]/;  // Busca cualquier tipo de comillas
  return regex.test(text);
}

// --------------------------------------------------------------------------------
// Función para procesar la respuesta (eliminar contenido no deseado)
// --------------------------------------------------------------------------------
function processResponse(response) {
  // Eliminar citas en formato [^x.x.x]
  response = response.replace(/\[\^.*?\]/g, '');

  // Eliminar bloques <citations>...</citations>
  response = response.replace(/<citations>.*?<\/citations>/gs, '');

  // Eliminar líneas vacías adicionales
  response = response.replace(/\n\s*\n/g, '\n');

  return response.trim();
}

// --------------------------------------------------------------------------------
// Componente principal: ChatbotScreen
// --------------------------------------------------------------------------------
export const New_Chatbot = () => {
  // Estado para el ID de usuario, el input y el historial de mensajes
  const [userId, setUserId] = useState("");
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Maneja el envío de la pregunta / mensaje del usuario
  const handleSend = async () => {
    // 1. Verificar si hay comillas que no están permitidas
    if (isQuoted(userInput)) {
      alert("Error: No se permiten citas en el mensaje.");
      return;
    }

    // 2. Agregar el mensaje del usuario a la lista
    if (userInput.trim()) {
      setMessages((prev) => [
        ...prev,
        { type: "user", text: userInput.trim() }
      ]);
    } else {
      // Si el input está vacío, no hacemos nada
      return;
    }

    // 3. Llamar a la API
    const response = await query(userId, userInput.trim());

    // 4. Procesar la respuesta
    const processedResponse = processResponse(response);

    // 5. Agregar el mensaje del bot al historial
    setMessages((prev) => [
      ...prev,
      { type: "bot", text: processedResponse }
    ]);

    // 6. Limpiar input
    setUserInput("");
  };

  // --------------------------------------------------------------------------------
  // Interfaz
  // --------------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chatbot con Stack-AI</Text>
      
      {/* Campo para el ID de usuario */}
      <Text style={styles.label}>ID de Usuario/Conversación:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUserId}
        value={userId}
        placeholder="Ingresa tu ID"
        placeholderTextColor="#999"
      />

      {/* Área de mensajes */}
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, idx) => (
          <View
            key={idx}
            style={[
              styles.messageBubble,
              msg.type === "user" ? styles.userBubble : styles.botBubble
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Campo de texto para escribir el mensaje */}
      <Text style={styles.label}>Tu mensaje:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUserInput}
        value={userInput}
        placeholder="Escribe tu mensaje..."
        placeholderTextColor="#999"
      />

      {/* Botón para enviar */}
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendButtonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

// --------------------------------------------------------------------------------
// Estilos
// --------------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efefef",
    padding: 16,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333"
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
    marginTop: 10,
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: "#333"
  },
  messagesContainer: {
    flex: 1,
    marginVertical: 10,
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    maxWidth: "80%"
  },
  userBubble: {
    backgroundColor: "#4c669f",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#000"
  },
  sendButton: {
    backgroundColor: "#4c669f",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600"
  },
});

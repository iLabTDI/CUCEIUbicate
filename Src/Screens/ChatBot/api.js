import React from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDVOw6maPjBmhBLtJLNOocQX1Tf7LuGWh0';

const handleGenericAPIRequest = async (message) => {
    console.log("El mensaje enviado es: " + message);

    if (!message.trim()) return null; // No hacer nada si el mensaje está vacío

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    try {
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: message }],
                },
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        let text = await response.text();

        // Limpieza del texto: elimina caracteres no deseados y formatea adecuadamente
        text = text.replace(/\*/g, '') // Eliminar asteriscos
                   .replace(/[_~]/g, '') // Eliminar subrayados, tildes que pueden ser del Markdown
                   .replace(/```[\s\S]*?```/g, '') // Eliminar bloques de código (``` ... ```)
                   .replace(/(^|\s)-(\s)/g, '$1• '); // Reemplazar guiones por viñetas para mejorar la legibilidad

        console.log("La respuesta es: " + text);
        return text;
    } catch (error) {
        console.error("Error sending chat request:", error);
        return "Lo siento, hubo un error al procesar tu solicitud.";
    }
};

export default handleGenericAPIRequest;
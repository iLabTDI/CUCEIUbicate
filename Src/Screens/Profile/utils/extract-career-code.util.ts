import { careerImages } from "../Data_iconos_mallas";

type CarrerCode = keyof typeof careerImages;

// Función para extraer el código de carrera del string completo
export const extractCareerCode = (degree: string): CarrerCode | null => {
    if (!degree) return null;

    // Si ya es solo el código (4-5 letras mayúsculas), devolverlo tal como está
    if (/^[A-Z]{3,5}$/.test(degree.trim())) {
        return degree.trim() as CarrerCode;
    }

    // Si contiene un string largo, extraer el código del final
    const match = new RegExp(/\b([A-Z]{3,5})\b$/).exec(degree);
    return match ? match[1] as CarrerCode : null;
};
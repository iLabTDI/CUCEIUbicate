// Función para limpiar strings y evitar problemas de collation
export const cleanString = (str: string): string => {
    if (!str) return '';

    // Normalizar y limpiar caracteres especiales
    return str
        .normalize('NFD') // Descomponer caracteres acentuados
        .replaceAll(/[\u0300-\u036f]/g, '') // Remover diacríticos (acentos)
        .replaceAll(/[^\w\s@.-]/g, '') // Solo permitir caracteres seguros
        .trim();
};
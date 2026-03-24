import { secureHash } from "./secureHash";

export const secureCompare = (password: string, hashedPassword: string): boolean => {
    try {
        if (!password || !hashedPassword) {
            console.log('❌ Datos faltantes');
            return false;
        }

        if (hashedPassword.startsWith('$secure$')) {
            const parts = hashedPassword.split('$');

            // Validar formato antes de cualquier operación
            if (parts.length !== 6) {
                console.log('❌ Formato de hash inválido');
                return false;
            }

            // FORMATO: ["", "secure", "hash1", "hash2", "hash3", "timestamp"]
            const [, , hash1Stored, hash2Stored, hash3Stored, timestampStored] = parts;

            // Recrear el hash usando el timestamp almacenado
            const recomputedHash = secureHash(password, timestampStored);
            const recomputedParts = recomputedHash.split('$');

            const match =
                hash1Stored === recomputedParts[2] &&
                hash2Stored === recomputedParts[3] &&
                hash3Stored === recomputedParts[4];

            console.log('🎯 ¿Coinciden todos los hashes?', match);
            return match;
        }

        // Fallback: comparación directa (contraseñas sin hashear)
        const directMatch = password === hashedPassword;
        console.log(directMatch ? '✅ Password correcta (directa)' : '❌ Password incorrecta');
        return directMatch;

    } catch (error) {
        console.error('🚨 Error verificando contraseña:', error);
        return false;
    }
};
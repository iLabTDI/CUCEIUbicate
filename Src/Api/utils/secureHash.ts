
export const secureHash = (password: string, existingTimestamp?: string): string => {
    try {
        if (!password || password.trim() === '') {
            throw new Error('La contraseña no puede estar vacía');
        }

        const staticSalt = 'CUCEI_UBICATE_2024_PRODUCTION_SECURE_SALT_V2';

        const timestamp = existingTimestamp ?? Date.now().toString(36).slice(-6);
        const combined = password + staticSalt + timestamp;

        let hash1 = 0;
        let hash2 = 0;
        let hash3 = 0;

        for (let i = 0; i < combined.length; i++) {
            const char = combined.codePointAt(i);
            hash1 = ((hash1 << 5) - hash1) + char;
            hash1 = hash1 & hash1;
        }

        for (let i = 0; i < combined.length; i++) {
            const char = combined.codePointAt(i);
            hash2 = ((hash2 << 3) - hash2) + char + i;
            hash2 = hash2 & hash2;
        }

        const mixed = password + staticSalt;
        for (let i = 0; i < mixed.length; i++) {
            const char = mixed.codePointAt(i);
            hash3 = ((hash3 << 7) - hash3) + char * (i + 1);
            hash3 = hash3 & hash3;
        }

        const finalHash1 = Math.abs(hash1).toString(36).padStart(8, '0');
        const finalHash2 = Math.abs(hash2).toString(36).padStart(8, '0');
        const finalHash3 = Math.abs(hash3).toString(36).padStart(6, '0');

        // ✨ FORMATO CON 6 PARTES - IDÉNTICO A LOGIN
        return `$secure$${finalHash1}$${finalHash2}$${finalHash3}$${timestamp.slice(-6)}`;
    } catch (error) {
        console.error('Error generando hash:', error);
        throw new Error('Error al procesar la contraseña');
    }
};
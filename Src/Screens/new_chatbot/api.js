// Asegúrate de colocar este archivo en la ruta correcta (ej. "./api.js")
// y de que la importación en tu componente sea acorde a esta ubicación.

export async function query(data) {
    try {
      const response = await fetch(
        "https://api.stack-ai.com/inference/v0/run/aaed654c-4c8c-4da5-a8c5-654a66f205d6/678e9ce9a552023b10e3cbca",
        {
          headers: {
            Authorization: "Bearer 5860c90a-caa4-4e57-a2cc-0b5ed485d955",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("API query error:", error);
      throw error;
    }
  }
  
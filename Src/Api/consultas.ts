// Api/consultas.ts
import { listDegrees } from './lib/api';

export const get_degrees = async () => {
  try {
    const rows = await listDegrees();
    // mapea a tu UI ({ name, code })
    return rows.map(r => ({ name: r.var_name, code: r.var_code }));
  } catch (e) {
    console.error('Error al consultar carreras:', e);
    return [];
  }
};

import { listDegrees } from "../Src/Api/lib/api";

const main = async () => {
  const carreras = await listDegrees();
  console.log("📚 Carreras disponibles:");
  carreras.forEach((c) => console.log(`  - ${c.var_code}: ${c.var_name}`));
};

main();

// Definición de los contenidos para el BottomSheet
// Cada edificio tiene su propia estructura de datos con información relevante
export const bottomSheetContents = {
  "Modulo A": {
    name: "Módulo A",
    classrooms: "A-01 ~ A-20",
    "relevant-places": [
      "Auditorio en el segundo piso",
      "Sala de estudios en el primer piso"
    ],
    bathrooms: [
      "W.C Hombres 1er Piso",
      "W.C Mujeres 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_A/PRIMER_PISO.png"),
      require("./Modulos/Modulo_A/SEGUNDO_PISO.png")
    ],
    description: "El Módulo A alberga aulas amplias y es ideal para conferencias y seminarios."
  },
  "Modulo B": {
    name: "Módulo B",
    classrooms: "B-01 ~ B-15",
    "relevant-places": [
      "Espacios administrativos en el primer piso",
      "Sala de profesores en el segundo piso"
    ],
    bathrooms: [
      "W.C Mixto 1er Piso",
      "W.C Mixto 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_B/B_CUCS.png")
    ],
    description: "El Módulo B se destaca por su diseño clásico y su funcionalidad para actividades administrativas."
  },
  "Modulo C": {
    name: "Módulo C",
    classrooms: "C-01 ~ C-18",
    "relevant-places": [
      "Laboratorios de biotecnología en el primer piso",
      "Área de investigación en el tercer piso"
    ],
    bathrooms: [
      "W.C Hombres 2do Piso",
      "W.C Mujeres 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_C/C_CUCS.png")
    ],
    description: "El Módulo C es conocido por albergar laboratorios de ciencia y tecnología."
  },
  "Modulo D": {
    name: "Módulo D",
    classrooms: "D-01 ~ D-25",
    "relevant-places": [
      "Biblioteca en el segundo piso",
      "Sala de conferencias en el tercer piso"
    ],
    bathrooms: [
      "W.C Hombres 1er Piso",
      "W.C Mujeres 1er y 3er Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_D/D.png")
    ],
    description: "El Módulo D ofrece espacios modernos para actividades académicas y administrativas."
  },
  "Modulo E": {
    name: "Módulo E",
    classrooms: "E-01 ~ E-30",
    "relevant-places": [
      "Oficinas de administración en el primer piso",
      "Aulas de cursos especiales en el segundo piso"
    ],
    bathrooms: [
      "W.C Mixto 1er Piso",
      "W.C Mixto 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_E/E_PRIMER_PISO.png"),
      require("./Modulos/Modulo_E/E_SEGUNDO_PISO.png")
    ],
    description: "El Módulo E alberga una variedad de aulas y oficinas administrativas."
  },
  "Modulo F": {
    name: "Módulo F",
    classrooms: "F-01 ~ F-22",
    "relevant-places": [
      "Laboratorios de física en el segundo piso",
      "Laboratorios de química en el tercer piso"
    ],
    bathrooms: [
      "W.C Hombres 1er Piso",
      "W.C Mujeres 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_F/F.png"),
      require("./Modulos/Modulo_F/F_SEGUNDO_PISO.png")
    ],
    description: "El Módulo F es conocido por sus amplios laboratorios de física y química."
  },
  "Modulo G": {
    name: "Módulo G",
    classrooms: "G-01 ~ G-20",
    "relevant-places": [
      "Área de investigación en el primer piso",
      "Aulas equipadas en el segundo piso"
    ],
    bathrooms: [
      "W.C Mixto 1er Piso",
      "W.C Mixto 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_G/G.png")
    ],
    description: "El Módulo G es un edificio moderno que incluye aulas y espacios de investigación."
  },
  "Modulo H": {
    name: "Módulo H",
    classrooms: "H-01 ~ H-28",
    "relevant-places": [
      "Sala de conferencias en el segundo piso",
      "Área de descanso en el primer piso"
    ],
    bathrooms: [
      "W.C Hombres 1er Piso",
      "W.C Mujeres 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_H/H_PRIMER_PISO.png"),
      require("./Modulos/Modulo_H/H_SEGUNDO_PISO.png")
    ],
    description: "El Módulo H destaca por su diseño espacioso y moderno, ideal para conferencias."
  },
  "Modulo I": {
    name: "Módulo I",
    classrooms: "I-01 ~ I-15",
    "relevant-places": [
      "Laboratorio de informática en el segundo piso",
      "Áreas de estudio en el tercer piso"
    ],
    bathrooms: [
      "W.C Mixto 1er Piso",
      "W.C Mixto 3er Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_I/I.png")
    ],
    description: "El Módulo I está diseñado para albergar laboratorios y áreas de estudio grupal."
  },
  "Modulo J": {
    name: "Módulo J",
    classrooms: "J-01 ~ J-24",
    "relevant-places": [
      "Aulas interactivas en el primer piso",
      "Laboratorio de robótica en el segundo piso"
    ],
    bathrooms: [
      "W.C Hombres 1er Piso",
      "W.C Mujeres 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_J/J_PRIMER_PISO.png"),
      require("./Modulos/Modulo_J/J_SEGUNDO_PISO.png")
    ],
    description: "El Módulo J es conocido por sus espacios de enseñanza interactivos."
  },
  "Modulo K": {
    name: "Módulo K",
    classrooms: "K-01 ~ K-12",
    "relevant-places": [
      "Oficinas en el primer piso",
      "Áreas de soporte técnico en el segundo piso"
    ],
    bathrooms: [
      "W.C Mixto 1er Piso",
      "W.C Mixto 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_K/K.png")
    ],
    description: "El Módulo K cuenta con oficinas administrativas y áreas de soporte académico."
  },
  "Modulo L": {
    name: "Módulo L",
    classrooms: "L-01 ~ L-20",
    "relevant-places": [
      "Aulas en el primer piso",
      "Espacios de trabajo colaborativo en el segundo piso"
    ],
    bathrooms: [
      "W.C Hombres 1er Piso",
      "W.C Mujeres 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_L/L.png")
    ],
    description: "El Módulo L ofrece una gran variedad de aulas y espacios de trabajo colaborativo."
  },
  "Modulo M": {
    name: "Módulo M",
    classrooms: "M-01 ~ M-18",
    "relevant-places": [
      "Laboratorio de biotecnología en el primer piso",
      "Laboratorios de electrónica en el segundo piso"
    ],
    bathrooms: [
      "W.C Mixto 1er Piso",
      "W.C Mixto 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_M/M_PRIMER_PISO.png"),
      require("./Modulos/Modulo_M/M_SEGUNDO_PISO.png")
    ],
    description: "El Módulo M es conocido por albergar laboratorios de alta tecnología."
  },
  "Modulo N": {
    name: "Módulo N",
    classrooms: "N-01 ~ N-22",
    "relevant-places": [
      "Aulas en el primer piso",
      "Oficinas de administración en el segundo piso"
    ],
    bathrooms: [
      "W.C Hombres 1er Piso",
      "W.C Mujeres 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_N/N_PRIMER_PISO.png"),
      require("./Modulos/Modulo_N/N_SEGUNDO_PISO.png")
    ],
    description: "El Módulo N cuenta con espacios de enseñanza moderna y oficinas administrativas."
  },
  "Modulo O": {
    name: "Módulo O",
    classrooms: "O-01 ~ O-25",
    "relevant-places": [
      "Aulas de ingeniería en el primer piso",
      "Laboratorios de tecnología en el segundo piso"
    ],
    bathrooms: [
      "W.C Mixto 1er Piso",
      "W.C Mixto 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_O/O_PRIMER_PISO.png"),
      require("./Modulos/Modulo_O/O_SEGUNDO_PISO.png")
    ],
    description: "El Módulo O alberga aulas especializadas para cursos de ingeniería y tecnología."
  },
  "Modulo P": {
    name: "Módulo P",
    classrooms: "P-01 ~ P-16",
    "relevant-places": [
      "Aulas interactivas en el primer piso",
      "Oficinas académicas en el segundo piso"
    ],
    bathrooms: [
      "W.C Hombres 1er Piso",
      "W.C Mujeres 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_P/P.png")
    ],
    description: "El Módulo P ofrece espacios de enseñanza interactivos y oficinas académicas."
  },
  "Modulo Q": {
    name: "Módulo Q",
    classrooms: "Q-01 ~ Q-14",
    "relevant-places": [
      "Laboratorios de investigación en el segundo piso",
      "Áreas de estudio grupal en el primer piso"
    ],
    bathrooms: [
      "W.C Mixto 1er Piso",
      "W.C Mixto 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_Q/Q.png")
    ],
    description: "El Módulo Q es un edificio especializado en investigación científica."
  },
  "Modulo R": {
    name: "Módulo R",
    classrooms: "R-01 ~ R-20",
    "relevant-places": [
      "Aulas de ciencias sociales en el primer piso",
      "Biblioteca de humanidades en el segundo piso"
    ],
    bathrooms: [
      "W.C Hombres 1er Piso",
      "W.C Mujeres 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_R/R.png")
    ],
    description: "El Módulo R es conocido por su enfoque en ciencias sociales y humanidades."
  },
  "Modulo S": {
    name: "Módulo S",
    classrooms: "S-01 ~ S-18",
    "relevant-places": [
      "Laboratorio de informática en el segundo piso",
      "Aulas interactivas en el primer piso"
    ],
    bathrooms: [
      "W.C Mixto 1er Piso",
      "W.C Mixto 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_S/S.png")
    ],
    description: "El Módulo S alberga aulas y laboratorios de alta tecnología."
  },
  "Modulo S2": {
    name: "Módulo S2",
    classrooms: "S2-01 ~ S2-15",
    "relevant-places": [
      "Laboratorio de informática avanzada en el segundo piso",
      "Aulas de proyectos en el primer piso"
    ],
    bathrooms: [
      "W.C Hombres 1er Piso",
      "W.C Mujeres 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_S2/S2.png")
    ],
    description: "El Módulo S2 es una extensión del Módulo S, con enfoque en tecnologías avanzadas."
  },
  "Modulo T": {
    name: "Módulo T",
    classrooms: "T-01 ~ T-22",
    "relevant-places": [
      "Aulas de tecnología en el primer piso",
      "Áreas de práctica técnica en el segundo piso"
    ],
    bathrooms: [
      "W.C Mixto 1er Piso",
      "W.C Mixto 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_T/T.png")
    ],
    description: "El Módulo T se especializa en enseñanza técnica y profesional."
  },
  "Modulo U": {
    name: "Módulo U",
    classrooms: "U-01 ~ U-20",
    "relevant-places": [
      "Laboratorios de investigación avanzada en el segundo piso",
      "Aulas especializadas en el primer piso"
    ],
    bathrooms: [
      "W.C Hombres 1er Piso",
      "W.C Mujeres 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_U/U.png")
    ],
    description: "El Módulo U es conocido por su enfoque en la investigación avanzada."
  },
  "Alfa": {
    name: "Módulo Alfa",
    classrooms: "ALFA-01 ~ ALFA-10",
    "relevant-places": [
      "Laboratorios de investigación avanzada en el segundo piso",
      "Aulas especializadas en el primer piso"
    ],
    bathrooms: [
      "W.C Mixto 1er Piso",
      "W.C Mixto 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_UCT1/UCT1.png")
    ],
    description: "El Módulo Alfa es parte de las Unidades de Cómputo y Telecomunicaciones, enfocado en tecnologías de vanguardia."
  },
  "Beta": {
    name: "Módulo Beta",
    classrooms: "BETA-01 ~ BETA-10",
    "relevant-places": [
      "Centro de datos en el primer piso",
      "Laboratorios de redes en el segundo piso"
    ],
    bathrooms: [
      "W.C Mixto 1er Piso",
      "W.C Mixto 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_UCT2/UCT2.png")
    ],
    description: "El Módulo Beta complementa al Módulo Alfa en las Unidades de Cómputo y Telecomunicaciones, con énfasis en infraestructura de TI."
  },
  "Modulo V": {
    name: "Módulo V",
    classrooms: "V-01 ~ V-18",
    "relevant-places": [
      "Aulas tecnológicas en el primer piso",
      "Laboratorios en el segundo piso"
    ],
    bathrooms: [
      "W.C Hombres 1er Piso",
      "W.C Mujeres 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_V/V.png")
    ],
    description: "El Módulo V cuenta con aulas y laboratorios especializados para cursos de tecnología."
  },
  "Modulo V2": {
    name: "Módulo V2",
    classrooms: "V2-01 ~ V2-15",
    "relevant-places": [
      "Nuevos laboratorios de investigación en el segundo piso",
      "Salas de estudio en el tercer piso"
    ],
    bathrooms: [
      "W.C Mixto 1er Piso",
      "W.C Mixto 3er Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_V2/V2.png")
    ],
    description: "El Módulo V2 es una extensión del Módulo V, con más espacio para investigación."
  },
  "Modulo W": {
    name: "Módulo W",
    classrooms: "W-01 ~ W-30",
    "relevant-places": [
      "Aulas en el primer y segundo piso",
      "Área de estudio grupal en el tercer piso"
    ],
    bathrooms: [
      "W.C Hombres 1er y 3er Piso",
      "W.C Mujeres 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_W/W_PRIMER_PISO.png"),
      require("./Modulos/Modulo_W/W_SEGUNDO_PISO.png"),
      require("./Modulos/Modulo_W/W_TERCER_PISO.png")
    ],
    description: "El Módulo W es un edificio versátil que alberga múltiples aulas y áreas comunes."
  },
  "Modulo X": {
    name: "Modulo X",
    classrooms: "X-01 ~ X-23",
    "relevant-places": [
      "Cubículo X-301",
      "Cubículo X-302"
    ],
    bathrooms: [
      "W.C Hombres 1er y 3er Piso",
      "W.C Mujeres"
    ],
    "images-path": [
      require("./Modulos/Modulo_X/X.png"),
      require("./Modulos/Modulo_X/CONEXION_W-X.png")
    ],
    description: "El Edificio X es un edificio moderno diseñado para albergar aulas y laboratorios de última generación."
  },
  "Modulo Y": {
    name: "Módulo Y",
    classrooms: "Y-01 ~ Y-25",
    "relevant-places": [
      "Laboratorio de informática en el segundo piso",
      "Terraza con vista panorámica en el último piso"
    ],
    bathrooms: [
      "W.C Hombres 1er y 3er Piso",
      "W.C Mujeres 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_Y/Y_FRENTE.png"),
      require("./Modulos/Modulo_Y/Y_PRIMER_PISO.png"),
      require("./Modulos/Modulo_Y/Y_SEGUNDO_PISO.png"),
      require("./Modulos/Modulo_Y/Y_TERCER_PISO.png")
    ],
    description: "El Módulo Y es un edificio moderno diseñado para albergar aulas y laboratorios de última generación."
  },
  "Modulo Z": {
    name: "Módulo Z",
    classrooms: "Z-01 ~ Z-20",
    "relevant-places": [
      "Salas de estudio grupal en el tercer piso",
      "Cafetería en la planta baja"
    ],
    bathrooms: [
      "W.C Mixto Planta Baja",
      "W.C Hombres 2do Piso",
      "W.C Mujeres 3er Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_Z/Z.png"),
      require("./Modulos/Modulo_Z/Z_CHEDRAUI.png")
    ],
    description: "El Módulo Z es conocido por su arquitectura innovadora y sus espacios versátiles para diferentes actividades académicas."
  },
  "Modulo Z1": {
    name: "Módulo Z1",
    classrooms: "Z1-01 ~ Z1-15",
    "relevant-places": [
      "Aulas de cursos avanzados en el primer piso",
      "Áreas de descanso en el segundo piso"
    ],
    bathrooms: [
      "W.C Mixto 1er Piso",
      "W.C Mixto 2do Piso"
    ],
    "images-path": [
      require("./Modulos/Modulo_Z1/Z1.png")
    ],
    description: "El Módulo Z1 cuenta con aulas especializadas para cursos avanzados."
  },
  "Modulo Z2": {
    name: "Módulo Z2",
    classrooms: "Z2-01 ~ Z2-10",
    "relevant-places": [
      "Auditorio en el primer piso",
      "Áreas de trabajo grupal en el segundo piso"
    ],
    bathrooms: [
      "W.C Hombres 1er Piso",
      "W.C Mujeres 1er Piso"
    ],
    "image-path": [
      require("./Modulos/Modulo_Z2/Z2.png")
    ],
    description: "El Módulo Z2 es una extensión del Módulo Z, diseñado para conferencias y eventos académicos."
  }
};
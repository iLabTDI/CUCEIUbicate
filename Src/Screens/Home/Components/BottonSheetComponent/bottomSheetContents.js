// Definición de los contenidos para el BottomSheet
// Cada edificio tiene su propia estructura de datos con información relevante
export const bottomSheetContents = {
  "Modulo A": {
    name: "Módulo A",
    classrooms: "A-01 ~ A-10",
    "relevant-places": [
      "Primer piso: Auditorio Enrique Díaz de León, Unidad de primer contacto, Coordinación de servicios académicos, Coordinación de programas docentes, Coordinación de servicios académicos, Unidad de primer contacto, Coordinación de control escolar (y Unidad de ingreso), Egresados y títulos, Coordinación de investigación..",
      "Segundo piso: Módulo de actividades cullturales y deportivas, Unidad de servicio social, Coordinación de comisiones del consejo del centro, Coordinación de planeación, Coordinación de finanzas, Unidad de Adquisición y suministras, Unidad de difusión, Coordinación personal.. ",
    ],
    bathrooms: [
      "Primer piso: W.C Hombres y W.C Mujeres",
      "Segundo piso: W.C Hombres y W.C Mujeres",
    ],
    "images-path": [
      require("./Modulos/Modulo_A/PRIMER_PISO.png"),
      require("./Modulos/Modulo_A/SEGUNDO_PISO.png"),
    ],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo A/IMG_5.webp"),
    //   require("./Modulos_Fotos/Modulo A/IMG_6.webp"),
    //   require("./Modulos_Fotos/Modulo A/IMG_9775.webp"),
    // ],
    description:
      "El Módulo A conocido anteriormente como Rectoria, contiene gran variedad de salas de coordinación y el Auditorio Enrique Díaz de León. Asimismo, tiene aulas que pertenecen al Proulex donde los alumnos pueden aprender idiomas.",
  },
  "Modulo B": {
    name: "Módulo B",
    classrooms: "B-101 ~ B-105, B-201 ~ B-205",
    "relevant-places": [
      "Primer piso: Coordinación de Extensión y Unidad de Tutorías, Coordinación de Programas Especiales, Coordinación de vinculación, Consultorio.",
      "Segundo piso: Maestría en Ciencias de la Educación Física y Deporte.",
    ],
    bathrooms: ["-"],
    "images-path": [
      require("./Modulos/Modulo_B/B_CUCS.png"),
    ],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo B/1.jpg"),
    // ],
    description:
      "El Módulo B se destaca por impartir clases de carreras relacionadas al CUCS.",
  },
  "Modulo C": {
    name: "Módulo C",
    classrooms: "C-101 ~ C-103, C-201 ~ C-205,     C-301 ~ C-302",
    "relevant-places": [
      "Primer piso: Sociedad de alumnos, Coordinación de Licenciatura en Cultura Física y Deportes.",
      "Segundo piso: -",
      "Tercer piso: Coordinación de Investigación, Laboratorio de Psicología de la Actividad Física, CEDOS I: Biblioteca Especializada en Cultura Física y Deportes.",
    ],
    bathrooms: ["Primer piso: W.C Hombres", "Segundo piso: W.C Mujeres"],
    "images-path": [require("./Modulos/Modulo_C/C_CUCS.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo C/1.png"),
    //   require("./Modulos_Fotos/Modulo C/2.png"),
    // ],
    description:
      "El Módulo C es conocido por albergar laboratorios de ciencia y tecnología.",
  },
  "Modulo D": {
    name: "Módulo D",
    classrooms: "-",
    "relevant-places": [
      "Primer piso: Ciencia y tecnología del plasma, Laboratorio de procesamineto de polímeros, Labpratorio de procesos biotecnológicos, Planta piloto de procesos biotecnológicos.",
      "Segundo piso: Cubículo de académicos, Laboratorio de Química del estado sólido, Laboratorio de electroquímica, Laboratorio de bioinformática y química metabólica.",
      "Tercer piso: Coordinación de investigadores de imgeniería química, Labpratorio de microbiología e inocuidad de alimentos, Laboratorio B, Laboratorio de Morfología.",
    ],
    bathrooms: ["-"],
    "images-path": [require("./Modulos/Modulo_D/D.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo D/1.jpg"),
    // ],
    description:
      "El Módulo D ofrece laboratorios para distintas carreras relacionadas a las ciencias y tencologías, cubículos para académicos y demás.",
  },
  "Modulo E": {
    name: "Módulo E",
    classrooms: "E-01 ~ E-20",
    "relevant-places": [
      "Primer piso: Laboratorio de materiales y nanotecnología, Laboratorio de reología, Coordinación de Lic. Química, Departamento de farmacobiología, Coordinación de Lic. en farmacobiología, Comité de titulación QFB, Laboratorio de Ing. en alimentos, Laboratorio de Ing. y biotecnología de los alimentos.",
      "Segundo piso: Laboratorio de materiales y nanotecnología, Aula de maestría en procesos biotecnológicos, Laboratorio de minerología, Laboratorio de química orgánica, Coordinación en Lic. e Ing. Química.",
    ],
    bathrooms: ["Primer piso: -", "Segundo piso: W.C Hombres y W.C Mujeres."],
    "images-path": [
      require("./Modulos/Modulo_E/E_PRIMER_PISO.png"),
      require("./Modulos/Modulo_E/E_SEGUNDO_PISO.png"),
    ],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo E/1.jpg"),
    //   require("./Modulos_Fotos/Modulo E/2.png"),
    //   require("./Modulos_Fotos/Modulo E/3.png"),
    // ],
    description:
      "El Módulo E alberga una variedad de aulas y oficinas orientadas principalmente a las carreras de Química, Farmacobiología y Biotecnología de los alimentos. También tiene el Auditorio Antonio Rodríguez Sánchez.",
  },
  "Modulo F": {
    name: "Módulo F",
    classrooms: "F-01 ~ F-09",
    "relevant-places": [
      "Primer piso: Aula Prof. J.M. Arreola, Comité de Topografía, Laboratorio de caracterización de polímeros, Laboratorio de biología molecular, Laboratorio de computación aplicada a Ing. Civil y topografía, Laboratorio de inmunología (Docencia), Laboratorio de inmunofarmacobiología, Laboratorio de polímeros, Laboratorio de farmacobiología. ",
      "Segundo piso: Laboratorio de mineralogía, Departamento de química, Laboratorio de espectroscopia, Aula de ingeniería Aurelio Aceves, Microbiología.",
    ],
    bathrooms: ["Primero piso: W.C Mujeres", "Segundo piso: -"],
    "images-path": [
      require("./Modulos/Modulo_F/F.png"),
      require("./Modulos/Modulo_F/F_SEGUNDO_PISO.png"),
    ],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo F/1.jpg"),
    // ],
    description:
      "El Módulo F es conocido por sus laboratorios y salones orientados a las carreras relacionadas a las ciencias.",
  },
  "Modulo G": {
    name: "Módulo G",
    classrooms: "G-02",
    "relevant-places": ["Vista Áerea: Laboratorio de Ingeniería Química."],
    bathrooms: ["-"],
    "images-path": [require("./Modulos/Modulo_G/G.png")],
    description:
      "El Módulo G contiene un laboratorio dedicado a prácticas de Ing. Química.",
  },
  "Modulo H": {
    name: "Módulo H",
    classrooms: "~",
    "relevant-places": [
      "Primer piso: Laboratorio de química clínica, Laboratorio de bacterología (Docencia), Laboratorio de análisis clínicos (Vinculación), Laboratorio de bioquímica, Laboratorio de microbiología industrial, Laboratorio de investigación en leche humana.",
      "Segundo piso: Laboratorio de microbiología sanitaria, Laboratorio de análisis de exteriores, Laboratorio de análisis cuantitativos.",
    ],
    bathrooms: ["-"],
    "images-path": [
      require("./Modulos/Modulo_H/H_PRIMER_PISO.png"),
      require("./Modulos/Modulo_H/H_SEGUNDO_PISO.png"),
    ],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo H/1.jpg"),
    //   require("./Modulos_Fotos/Modulo H/2.jpg"),
    //   require("./Modulos_Fotos/Modulo H/3.jpg"),
    // ],
    description:
      "El Módulo H destaca por ser un módulo lleno de amplios laboratorios.",
  },
  "Modulo I": {
    name: "Módulo I",
    classrooms: "I-01 ~ I-08",
    "relevant-places": ["Primer piso: Salones.", "Segundo piso: Cubículos."],
    bathrooms: ["Primer piso: W.C Mujeres.", "Segundo piso: W.C Hombres."],
    "images-path": [require("./Modulos/Modulo_I/I.png")],
    description:
      "El Módulo I contiene diversas aulas de clase y un elevador en el área.",
  },
  "Modulo J": {
    name: "Módulo J",
    classrooms: "J-01",
    "relevant-places": [
      "Primer piso: Laboratorio de química general.",
      "Segundo piso: Laboratorio de microbiología sanitaria, Laboratorio de química farmacéutica, Coordinación de maestría en sistemas de calidad.",
    ],
    bathrooms: ["-"],
    "images-path": [
      require("./Modulos/Modulo_J/J_PRIMER_PISO.png"),
      require("./Modulos/Modulo_J/J_SEGUNDO_PISO.png"),
    ],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo J/1.jpg"),
    // ],
    description:
      "El Módulo J colinda con los módulos K e I. Tiene laboratorios y la coordinación de maestría en sistemas de calidad.",
  },
  "Modulo K": {
    name: "Módulo K",
    classrooms: "K-01 ~ K-13",
    "relevant-places": ["Salones."],
    bathrooms: ["-"],
    "images-path": [require("./Modulos/Modulo_K/K.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo K/1.jpg"),
    //   require("./Modulos_Fotos/Modulo K/2.jpg"),
    //   require("./Modulos_Fotos/Modulo K/3.jpg"),
    // ],
    description:
      "El Módulo K cuenta con diversas aulas de clase y unas representativas escaleras rojas a sus costados.",
  },
  "Modulo L": {
    name: "Módulo L",
    classrooms: "~",
    "relevant-places": [
      "Vista Áerea: Servicios médicos integrales, Laboratorioi de ingeniería mecánica.",
    ],
    bathrooms: ["-"],
    "images-path": [require("./Modulos/Modulo_L/L.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo L/1.jpg"),
    //   require("./Modulos_Fotos/Modulo L/2.jpg"),
    // ],
    description:
      "El Módulo L ofrece servicios médicos y contiene la división de ciencias básicas. Así mismo, tiene el laboratorio para los estudiantes de Ingeniería mecánica.",
  },
  "Modulo M": {
    name: "Módulo M",
    classrooms: "M-201 ~ M-213",
    "relevant-places": [
      "Primer piso: Laboratorio de neurofisiología y materiales, Laboratorio de instrumentación biomédica, Laboratorio de bioseñales y biomecánica, Laboratorio de ingeniería clínica, Laboratorio de microelectrónica.",
      "Segundo piso: Laboratorio de instrumentación musical. Laboratorio de fibras ópticas y láseres, Laboratorio de conversión de energía y radiometría, CUCEI mobile.",
    ],
    bathrooms: ["Primer piso: -", "Segundo piso: W.C Hombres."],
    "images-path": [
      require("./Modulos/Modulo_M/M_PRIMER_PISO.png"),
      require("./Modulos/Modulo_M/M_SEGUNDO_PISO.png"),
    ],
    description:
      "El Módulo M tiene conexión con el módulo N desde el segundo piso y contiene diversos laboratorios, así como el área de sistemas inteligentes y CUCEI mobile.",
  },
  "Modulo N": {
    name: "Módulo N",
    classrooms: "NL01 ~ NL04, NL09, N214",
    "relevant-places": [
      "Primer piso: Laboratorio de diseño y corte láser CUCEI, Laboratorio de hidráulica, Papeleria, Laboratorios de Hidráulica, División de ingenierías.",
      "Segundo piso: Laboratorio inventores, iLabTDI, Laboratorio de automatización I y II, Laboratorio de comunicaciones básicas, Modulares.",
    ],
    bathrooms: ["-"],
    "images-path": [
      require("./Modulos/Modulo_N/N_PRIMER_PISO.png"),
      require("./Modulos/Modulo_N/N_SEGUNDO_PISO.png"),
    ],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo N/1.jpg"),
    //   require("./Modulos_Fotos/Modulo N/2.jpg"),
    // ],
    description:
      "El Módulo N cuenta con espacios para que los alumnos puedan desarrollar sus proyectos modulares, como laboratorios, aulas y papeleria.",
  },
  "Modulo O": {
    name: "Módulo O",
    classrooms: "~",
    "relevant-places": [
      "Primer piso: Auditorio Antonio Alatorre, Coordinación Ing. Computación, Coordinación Ing. En Telecomunicaciones y electrónica, Coordinación Ing. Informática, Coordinación Ing. Biomédica.",
      "Segundo piso: Coordinación Ing. Industrial, Coordinación Ing. Topografia, Coordinación Ing. Civil, Coordinación Ing. Mecánica electrónica.",
    ],
    bathrooms: ["-"],
    "images-path": [
      require("./Modulos/Modulo_O/O_PRIMER_PISO.png"),
      require("./Modulos/Modulo_O/O_SEGUNDO_PISO.png"),
    ],
    description:
      "En el módulo O se encuentra el auditorio Antonio Alatorre y coordinaciónes de diversas ingenierías.",
  },
  "Modulo P": {
    name: "Módulo P",
    classrooms: "P-01 ~ P-23",
    "relevant-places": [
      "Primer piso: Laboratorio de topografía, Objetos perdidos.",
      "Segundo piso: -",
    ],
    bathrooms: ["Primer piso: W.C Hombres.", "Segundo piso: W.C Mujeres."],
    "images-path": [require("./Modulos/Modulo_P/P.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo P/1.jpg"),
    //   require("./Modulos_Fotos/Modulo P/2.jpg"),
    // ],
    description:
      "El Módulo P ofrece diversas aulas de aprendizaje, un laboratorio para los estudiantes de topografía y un área para los objetos perdidos.",
  },
  "Modulo Q": {
    name: "Módulo Q",
    classrooms: "Q-01 ~ Q-14",
    "relevant-places": ["-"],
    bathrooms: ["-"],
    "images-path": [require("./Modulos/Modulo_Q/Q.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo Q/1.jpg"),
    // ],
    description:
      "El Módulo Q es un edificio lleno de aulas para que los estudiantes puedan tomar sus clases.",
  },
  "Modulo R": {
    name: "Módulo R",
    classrooms: "R-01 ~ R-11",
    "relevant-places": [
      "Primer piso: -",
      "Segundo piso: Laboratorio de robótica V y VI, salones de maestría R7 y R8.",
      "Tercer piso: -",
    ],
    bathrooms: [
      "Primer piso: W.C Hombres.",
      "Segundo piso: W.C Mujeres.",
      "Tercer piso: W.C Hombres.",
    ],
    "images-path": [require("./Modulos/Modulo_R/R.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo R/1.jpg"),
    //   require("./Modulos_Fotos/Modulo R/2.jpg"),
    // ],
    description: "El Módulo R es conocido por sus laboratorios de robótica.",
  },
  "Modulo S": {
    name: "Módulo S",
    classrooms: "S-01 ~ S-04",
    "relevant-places": ["-"],
    bathrooms: [""],
    "images-path": [require("./Modulos/Modulo_S/S.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo S/1.jpg"),
    // ],
    description:
      "El Módulo S alberga cuatro áreas (S01-S04) que conforman el laboratorio de Ing. Industrial.",
  },
  "Modulo S2": {
    name: "Módulo S2",
    classrooms: "S2-01 ~ S2-15",
    "relevant-places": ["Oficinas del S.T.A de UdeG."],
    bathrooms: ["-"],
    "images-path": [require("./Modulos/Modulo_S2/S2.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo S2/1.jpg"),
    // ],
    description:
      "El Módulo S2 es una extensión del Módulo S, con las oficinas del S.T.A de UdeG y una sala de maestros.",
  },
  "Modulo T": {
    name: "Módulo T",
    classrooms: "T-01 ~ T-24",
    "relevant-places": ["-"],
    bathrooms: ["Primer piso: W.C Mujeres."],
    "images-path": [require("./Modulos/Modulo_T/T.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo T/1.jpg"),
    // ],
    description: "El Módulo T contiene aulas de aprendizaje para estudiantes.",
  },
  "Modulo U": {
    name: "Módulo U",
    classrooms: "U-01 ~ U-24",
    "relevant-places": [
      "Primer piso: Papeleria, Cooperativa, Jobs U1 y U2, Oficinas Jobs.",
    ],
    bathrooms: ["Primer piso: W.C Hombres."],
    "images-path": [require("./Modulos/Modulo_U/U.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo U/1.jpg"),
    //   require("./Modulos_Fotos/Modulo U/2.jpg"),
    //   require("./Modulos_Fotos/Modulo U/3.jpg"),
    // ],
    description:
      "El Módulo U es conocido por una papelería y una cooperativa en el primer piso.",
  },
  Alfa: {
    name: "Módulo Alfa",
    classrooms: "UCT LC-01 (Alfa) ~ UCT LC-10 (Alfa)",
    "relevant-places": ["Primer piso: Espacios tecnológicos de apoyo"],
    bathrooms: ["Primer piso: W.C Mujeres y W.C Hombres."],
    "images-path": [require("./Modulos/Modulo_UCT1/UCT1.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/DUCT1 y DUCT2/A1.jpg"),
    // ],
    description:
      "El Módulo Alfa es parte de las Unidades de Cómputo y Telecomunicaciones, enfocado en tecnologías de vanguardia.",
  },
  Beta: {
    name: "Módulo Beta",
    classrooms: "UCT2 LC-01 ~ UCT2 LC-10",
    "relevant-places": ["Primer piso: Espacios tecnológicos."],
    bathrooms: ["Primer piso: W.C Hombres y W.C Mujeres."],
    "images-path": [require("./Modulos/Modulo_UCT2/UCT2.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/DUCT1 y DUCT2/B1.jpg"),
    // ],
    description:
      "El Módulo Beta complementa al Módulo Alfa en las Unidades de Cómputo y Telecomunicaciones, con énfasis en infraestructura de TI.",
  },
  "Modulo V": {
    name: "Módulo V",
    classrooms: "V-01 ~ V-10",
    "relevant-places": [
      "Primer piso: Coordinación Lic, Física, Coordinación Lic. Ciencias de materiales, Sla de audiovisuales, Coordinación Lic. Matemáticas, Aula de posgrados en ciencias hidrometeorologas, Departamento de maestría en matemáticas, Posgrado en hidrometeorología.",
      "Segundo piso: Laboratorio de computación I y II, Responsable cómputo departamento de matemáticas.",
      "Tercer piso: Sala de Lectura (Matemáticas), Cubículos de Matemáticas, Maestría enseñanza en matemáticas, Coordinación maestría II.",
    ],
    bathrooms: [
      "Primer piso: - ",
      "Segundo piso: W.C Mujeres.",
      "Tercer piso: W.C Hombres.",
    ],
    "images-path": [require("./Modulos/Modulo_V/V.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo V/1.jpg"),
    // ],
    description:
      "El Módulo V cuenta con laboratorios y aulas mayormente enfocadas al departamento de matemáticas.",
  },
  "Modulo V2": {
    name: "Módulo V2",
    classrooms: "V2-11 ~ V2-18",
    "relevant-places": [
      "Primer piso: Departamento de matemáticas, Departamento de física, Laboratorio de investigación y desarrollo farmacéutico.",
      "Segundo piso: Laboratorio de investigación u desarrollo farmacáutico.",
    ],
    bathrooms: ["Primer piso: W.C Mujeres, W.C Hombres."],
    "images-path": [require("./Modulos/Modulo_V2/V2.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo V2/1.jpg"),
    //   require("./Modulos_Fotos/Modulo V2/2.jpg"),
    // ],
    description: "El Módulo V2 es una extensión del Módulo V.",
  },
  "Modulo W": {
    name: "Módulo W",
    classrooms: "W-01 ~ W-02, W-Cubiculo 1 y 2",
    "relevant-places": [
      "Primer piso: Asesoría física, Asesoría electrónica, Hospital de computadoras.",
      "Segundo piso: Área de la preparatoria 12.",
      "Tercer piso: Conexión con módulo X.",
    ],
    bathrooms: ["-"],
    "images-path": [
      require("./Modulos/Modulo_W/W_PRIMER_PISO.png"),
      require("./Modulos/Modulo_W/W_SEGUNDO_PISO.png"),
      require("./Modulos/Modulo_W/W_TERCER_PISO.png"),
    ],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo W/1.jpg"),
    //   require("./Modulos_Fotos/Modulo W/2.jpg"),
    // ],
    description:
      "El Módulo W es un edificio versátil que alberga múltiples aulas, un hospital para computadoras y áreas que pertenecen a la preparatoria 12. Tiene una conexión con el módulo X.",
  },
  "Modulo X": {
    name: "Modulo X",
    classrooms: "X-01 ~ X-23",
    "relevant-places": ["Cubículo X-301", "Cubículo X-302"],
    bathrooms: [
      "Primer piso: W.C Hombres.",
      "Segundo piso: W.C Mujeres.",
      "Tercer piso:  W.C Hombres.",
    ],
    "images-path": [
      require("./Modulos/Modulo_X/X.png"),
      require("./Modulos/Modulo_X/CONEXION_W-X.png"),
    ],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo X/1.jpg"),
    // ],
    description:
      "El módulo X es un edificio moderno diseñado para albergar aulas relacionadas a la tecnología.",
  },
  "Modulo Y": {
    name: "Módulo Y",
    classrooms: "Y-LFS1 ~ Y-LFS14",
    "relevant-places": [
      "Frente: Rampas y baños.",
      "Primer piso: Auditorio Nikola Mitshievich, LF3 Microcopia electrónica.",
      "Segundo piso: Laboratorio de farmacéutica P1 y P3, Laboratorio de física LFS6, LFS7 Y LFS9.",
      "Tercer piso: Laboratorio química, Laboratorio de análisis industriales y materiales, cubículos doctores, Coordinación química, Posgrado de ciencias en materiales.",
    ],
    bathrooms: [
      "Frente: W.C Hombres, W.C Mujeres.",
      "Primer piso: W.C Mujeres, W.C Hombres. ",
      "Segundo piso: - ",
      "Tercer piso: W.C Hombres y W.C Mujeres.",
    ],
    "images-path": [
      require("./Modulos/Modulo_Y/Y_FRENTE.png"),
      require("./Modulos/Modulo_Y/Y_PRIMER_PISO.png"),
      require("./Modulos/Modulo_Y/Y_SEGUNDO_PISO.png"),
      require("./Modulos/Modulo_Y/Y_TERCER_PISO.png"),
    ],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo Y/1.jpg"),
    //   require("./Modulos_Fotos/Modulo Y/2.jpg"),
    // ],
    description:
      "El Módulo Y es un edificio que tiene el auditorio Nikola V. Mitskievich, aparte, está diseñado para albergar aulas y laboratorios relacionados mayormente a las carreras de química, física y farmacobiología.",
  },
  "Modulo Z": {
    name: "Módulo Z",
    classrooms: "-",
    "relevant-places": ["Primer piso: Auditorio, Maestría en física."],
    bathrooms: ["Primer piso: W.C Mujeres, W.C Hombres"],
    "images-path": [
      require("./Modulos/Modulo_Z/Z.png"),
      require("./Modulos/Modulo_Z/Z_CHEDRAUI.png"),
    ],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo Z/1.jpg"),
    //   require("./Modulos_Fotos/Modulo Z/2.jpg"),
    // ],
    description:
      "El Módulo Z es uno de los edificios más modernos en el campus, destacando el auditorio y el salón dedicado a la maestría en física.",
  },
  "Modulo Z1": {
    name: "Módulo Z1",
    classrooms: "Z1-06 ~ Z1-07, Z1-13 ~ Z1-15,     Z1-20 ~ Z1-23",
    "relevant-places": ["Bodegas"],
    bathrooms: ["Primer piso: W.C Mujeres y W.C Hombres."],
    "images-path": [require("./Modulos/Modulo_Z1/Z1.png")],
    description:
      "El Módulo Z1 cuenta con aulas para clases y áreas destinadas a ser bodegas.",
  },
  "Modulo Z2": {
    name: "Módulo Z2",
    classrooms: "Z2-01 ~ Z2-05",
    "relevant-places": [
      "Primer piso: Coworking 1,2 y 3.",
      "Segundo piso: - ",
      "Tercer piso: DC MBM MCIA 1,2 y 3.",
    ],
    bathrooms: ["-"],
    "images-path": [require("./Modulos/Modulo_Z2/Z2.png")],
    // "photo-path": [
    //   require("./Modulos_Fotos/Modulo Z/1.jpg"),
    //   require("./Modulos_Fotos/Modulo Z/2.jpg"),
    // ],
    description:
      "El Módulo Z2 es una extensión del Módulo Z, diseñado para coworking y demás.",
  },
  Globo: {
    name: "El Globo",
    classrooms: "Z2-01 ~ Z2-05",
    "relevant-places": [],
    bathrooms: ["-"],
    "images-path": [require("./Modulos/globo/globo.png")],
    description:
      "El Globo está actualmente en construcción y se encuentra inhabilitado. Por el momento no es accesible hasta nuevo aviso.",
  },
  Biblioteca: {
    name: "Biblioteca",
    classrooms: "",
    "relevant-places": [
      "Primer piso: Áreas de coworking 1, 2 y 3.",
      "Segundo piso: Programa de Intercambios y papelería.",
    ],
    bathrooms: ["Primer piso  H & M"],
    "images-path": [
      require("./Modulos/Biblioteca/biblioteca.png"),
      require("./Modulos/Biblioteca/biblioteca1.png"),
    ],
    // "photo-path": [
    //   require("./Modulos_Fotos/Biblioteca/1.jpg"),
    //   require("./Modulos_Fotos/Biblioteca/2.jpg"),
    //   require("./Modulos_Fotos/Biblioteca/3.jpg"),
    //   require("./Modulos_Fotos/Biblioteca/4.jpg"),
    // ],
    description:
      "La Biblioteca CUCEI ofrece espacios de estudio y coworking. En el segundo piso se encuentra el Programa de Intercambios y una papelería para apoyo estudiantil.",
  },
  "Entrada Revolucion": {
    name: "Entrada Revolucion",
    classrooms: "",
    "relevant-places": ["-"],
    bathrooms: ["-"],
    "images-path": [require("./Modulos/Entradas/Entrada-Revolucion1.png")],
    description:
      "La entrada por Revolución es una de las más concurridas por los estudiantes, ya que es la entrada principal al campus.",
  },
  "Entrada Olimpica": {
    name: "Entrada Olimpica",
    classrooms: "",
    "relevant-places": ["-"],
    bathrooms: ["-"],
    "images-path": [
      require("./Modulos/Entradas/Entrada-Olimpica1.png"),
    ],
    description:
      "La entrada por Olimpica es una de las menos concurridas por los estudiantes, ya que es la entrada tracera al campus.",
  },
  "Entrada Boulevard": {
    name: "Entrada Boulevard",
    classrooms: "",
    "relevant-places": ["-"],
    bathrooms: ["-"],
    "images-path": [
      require("./Modulos/Entradas/Entrada-Boulevard1.png"),
    ],
    description:
      "La entrada por Boulevard es una de las mas concurridas por los estudiantes, ya que es la entrada tracera al campus.",
  },
  JOBS: {
    name: "JOBS",
    classrooms: "JOBS 4-8",
    "relevant-places": ["-"],
    bathrooms: ["-"],
    "images-path": [require("./Modulos/Jobs/Jobs1.png")],
    description:
      "Los JOBS son aulas las cuales se imparte el programa de ingles para los estudiantes por la parte de proulex.",
  },
  "JOBS 2": {
    name: "JOBS 2",
    classrooms: "JOBS 1-4",
    "relevant-places": ["-"],
    bathrooms: ["-"],
    "images-path": [require("./Modulos/Jobs/Jobs1.png")],
    description:
      "Los JOBS son aulas las cuales se imparte el programa de ingles para los estudiantes por la parte de proulex.",
  },

  Titanic: {
    name: "Laboratorio industrial",
    classrooms: "",
    "relevant-places": ["-"],
    bathrooms: [""],
    "images-path": [
      require("./Modulos/Titanic/Titanic1.png"),
    ],
    description:
      "El edificio del Titanic es un edificio que cuenta con maquinaria industrial y un estacionamiento en la parte inferior del edificio.",
  },
  Cafebreria: {
    name: "Cafebreria",
    classrooms: "",
    "relevant-places": ["-"],
    bathrooms: [""],
    "images-path": [
      require("./Modulos/Cafebreria/Cafebreria.png"),
    ],
    description:
      "La Cafebreria es un lugar donde los estudiantes pueden comprar alimentos y bebidas ademas de leer libros",
  },
  "Modulo L2": {
    name: "Modulo L2",
    classrooms: "",
    "relevant-places": ["-"],
    bathrooms: [""],
    "images-path": [
      require("./Modulos/Modulo_L/L2.png"),
    ],
    description:
      "El Módulo L2 es un edificio que se encuentra detras del audiotrio Matute remus, en el cual se imparten conferencias y eventos.",
  },
  "Auditorio Matute Remus": {
    name: "Auditorio Matute Remus",
    classrooms: "",
    "relevant-places": ["Se encunetra una estatua del ING Jorge Matute Remus al igual que ina estatua del logo de Cucei"],
    bathrooms: [""],
    "images-path": [
      require("./Modulos/Matute/Audirotio_Matute.png"),
    ],
    description:
      "El Auditorio Matute Remus es un auditorio en el cual se imparten conferencias y eventos.",
  },
  "Matute": {
    name: "Matute",
    classrooms: "",
    "relevant-places": ["-"],
    bathrooms: [""],
    "images-path": [
      require("./Modulos/Matute/Audirotio_Matute.png"),
    ],
    description:
      "Bancas que conectan el auditorio Matute Remus con el modulo L2. Regularmente se utilizan para eventos y conferencias.",
  },
  "Modulo Q2": {
    name: "Modulo Q2",
    classrooms: "",
    "relevant-places": ["-"],
    bathrooms: [""],
    "images-path": [
      require("./Modulos/Modulo_Q/Q2.png"),
    ],
    description:
      "El Módulo Q2 es una instalación que alberga diversos laboratorios especializados del Departamento de Química y la oficina de Seguridad de CUCEI, donde se gestionan trámites administrativos y solicitudes de emprendimiento.",
  },
  "Comida15": {
    name: "Comida",
    classrooms: "",
    "relevant-places": ["Hay varios puestos de comida ademas de un Cafe de Flor de Cordoba"],
    bathrooms: [""],
    "images-path": [
      require("./Modulos/Comida/Comida-Titanic.png"),
    ],
    description:
      "En el area de comida se encuentran varios puestos de comida y un cafe de Flor de Cordoba.",
  },
  "Comida14": {
    name: "Comida",
    classrooms: "",
    "relevant-places": ["Hay varios puestos de comida ademas de un Cafe de Flor de Cordoba"],
    bathrooms: [""],
    "images-path": [
      require("./Modulos/Comida/Comida-Titanic.png"),
    ],
    description:
      "En el area de comida se encuentran varios puestos de comida y un cafe de Flor de Cordoba.",
  },
  "La Flor de Córdoba": {
    name: "La Flor de Córdoba",
    classrooms: "",
    "relevant-places": ["hay lugares y puestos de comida a demas de bancas con sombrilla para poder comer"],
    bathrooms: [""],
    "images-path": [
      require("./Modulos/Comida/Flor_de_Cordoba.png"),
    ],
    description:
      "La Flor de Córdoba es un cafe que se encuentra en el area de comida del campus.",
  },
  "Santander": {
    name: "Santander",
    classrooms: "",
    "relevant-places": ["-"],
    bathrooms: [""],
    "images-path": [
      require("./Modulos/Modulo_N/Santander.png"),
    ],
    description:
      "Santander es un banco que se encuentra debajo del Modulo N en el cual puedes retirar dinero tramitar tarjetas y demas.",
  },
  "CTA": {
    name: "CTA",
    classrooms: "",
    "relevant-places": [
      "Atención a Usuarios",
      "Unidad de Multimedia Instruccional",
      "Soporte a Ambientes Virtuales",
      "Centro de Operaciones de la Red",
      "Área de Mantenimiento y Soporte Técnico",
      "Área de Desarrollo y Bases de Datos",
      "Área de Infraestructura y Servidores",
      "Área de Producción Audiovisual",
      "Oficinas de Coordinación (Módulo Gamma)"
    ],
    bathrooms: [""],
    "images-path": [
      // require("./Modulos/CTA/CTA.png"),
    ],
    description:
      "La Coordinación de Tecnologías para el Aprendizaje (CTA) es la encargada de administrar, controlar y realizar todas las actividades que estén relacionadas con los sistemas tecnológicos para apoyar la enseñanza en este centro universitario, así como para todas aquellas herramientas tecnológicas que apoyen a los administrativos y académicos en la realización de sus labores.",
  },
  "Baños S2": {
    name: "Baños S2",
    classrooms: "",
    "relevant-places": ["-"],
    bathrooms: ["W.C Hombres y W.C Mujeres."],
    "images-path": [
      // require("./Modulos/Modulo_S2/Banos_S2.png"),
    ],
    description:
      "Los baños que se encuentran a lado del Módulo S2, ofreciendo servicios tanto para hombres como para mujeres.",
  },
  "Comedor de maestros": {
    name: "Comedor de maestros",
    classrooms: "",
    "relevant-places": ["-"],
    bathrooms: [""],
    "images-path": [
      // require("./Modulos/Comedor_de_Maestros/Comedor_de_Maestros.png"),
    ],
    description:
      "El comedor de maestros es un espacio dedicado a los docentes para que puedan disfrutar de sus comidas durante el horario de trabajo.",
  }
};

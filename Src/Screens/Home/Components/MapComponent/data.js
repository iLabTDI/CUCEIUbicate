export const points = [  //Los points son los puntos o id de cada edificio, representados por un touchopacity
    {
      id: "Modulo X",
      name: "Modulo X",
      aliase: ["modulo x", "Edificio X", "edificio x"],
      left: 309,
      top: 505,
      width: 84,
      height: 20,
      rotate:-3,
    },
    {
      id:  "Modulo Z",
      name: "Modulo Z",
      aliases: ["modulo z", "Edificio Z", "edificio z"],
      left: 240,
      top: 653,
      height: 43,
      width: 18,
      rotate: 5,
    },
    {
      id: "Modulo W",
      name: "Modulo W",
      aliases: ["Módulo Doble V", "MW"],
      left: 314,
      top: 534,
      height: 16,
      width: 83,
      rotate: -2,
    },
    {
      id: "Modulo V2",
      name: "Modulo V2",
      aliases: ["Edificio V2", "MW"],
      left: 414,
      top: 524,
      height: 19,
      width: 90,
      rotate: -2,
    },

    {
      id: "Modulo U",
      name: "Modulo U",
      aliases: ["Edificio U", "MW"], //variables de busqueda
      left: 527,
      top: 524,
      height: 19,
      width: 95,
      rotate: -2,
    },

    {
      id: "Modulo T",
      name: "Modulo T",
      aliases: ["Edificio T", "papeleria", "MW"],
      left: 525,
      top: 556,
      height: 14,
      width: 100,
      rotate: 0,
    },

    {
      id: "Globo",
      name: "Globo",
      aliases: ["Globo", "MW"],
      left: 64,
      top: 854,
      height: 50,
      width: 90,
      rotate: -2,
    },
    
  ];
////////////////////////////////////////////////////////////////
export const routes = {
  'Modulo X': {
    'Modulo Z': [
      { x: 290, y: 510 },  
      { x: 309, y: 516 },  
      { x: 290, y: 518 },  
      { x: 290, y: 546 },  
      { x: 290, y: 585 },  
      { x: 294, y: 602 },  
      { x: 248, y: 625 },  
      { x: 242, y: 649 },  
      { x: 241, y: 676 },  
      { x: 236, y: 674 },  
    ],
    'Modulo W': [
      { x: 289, y: 510 },  
      { x: 291, y: 520 }   
    ],
    'Modulo V2': [
      { x: 268, y: 509 },  
      { x: 268, y: 515 },  
      { x: 322, y: 513 },  
      { x: 323, y: 535 },  
      { x: 374, y: 536 },  
      { x: 373, y: 529 }   
    ]
  },
  'Modulo Z': {
    'Modulo X': [
      { x: 236, y: 674 },  
      { x: 241, y: 676 },  
      { x: 242, y: 649 },  
      { x: 248, y: 625 },  
      { x: 294, y: 602 },  
      { x: 290, y: 585 },  
      { x: 290, y: 546 },  
      { x: 290, y: 518 },  
      { x: 309, y: 516 },  
      { x: 309, y: 510 }   
    ]
  }
};

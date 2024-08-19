export const points = [
  {
    id: "point1",
    name: "Punto 1",
    left: 200,
    top: 300,
    width: 90,
    height: 20,
  },
  {
    id: "Modulo X",
    name: "Modulo X",
    left: 265,
    top: 488,
    width: 90,
    height: 20,
  },
  {
    id: "Modulo Z",
    name: "Modulo Z",
    left: 187,
    top: 649,
    height: 45,
    width: 18,
    transform: [{ rotate: "5deg" }],
  },
  {
    id: "Modulo W",
    name: "Modulo W",
    left: 267,
    top: 520,
    height: 16,
    width: 90,
    transform: [{ rotate: "10deg" }],
  },
  {
    id: "Modulo V2",
    name: "Modulo V2",
    left: 320,  // Ajuste en el left
    top: 510,
    height: 20,
    width: 90,
  },
];

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

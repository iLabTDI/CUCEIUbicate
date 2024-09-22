// utils/astar.js

class Node {
    constructor(x, y, walkable = true) {
      this.x = x;
      this.y = y;
      this.walkable = walkable;
      this.g = 0;
      this.h = 0;
      this.f = 0;
      this.parent = null;
    }
  }
  
  function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
  
  export function aStar(start, goal, grid) {
    const openSet = [];
    const closedSet = new Set();
    
    openSet.push(start);
    
    while (openSet.length > 0) {
      let current = openSet[0];
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < current.f) {
          current = openSet[i];
        }
      }
      
      if (current.x === goal.x && current.y === goal.y) {
        let path = [];
        while (current) {
          path.push({ x: current.x, y: current.y });
          current = current.parent;
        }
        return path.reverse();
      }
      
      openSet.splice(openSet.indexOf(current), 1);
      closedSet.add(current);
      
      const neighbors = [
        { x: current.x - 1, y: current.y },
        { x: current.x + 1, y: current.y },
        { x: current.x, y: current.y - 1 },
        { x: current.x, y: current.y + 1 },
      ];
      
      for (let neighbor of neighbors) {
        if (neighbor.x < 0 || neighbor.x >= grid.length || neighbor.y < 0 || neighbor.y >= grid[0].length) {
          continue;
        }
        
        const node = grid[neighbor.x][neighbor.y];
        
        if (!node.walkable || closedSet.has(node)) {
          continue;
        }
        
        const gScore = current.g + 1;
        let inOpenSet = openSet.includes(node);
        
        if (!inOpenSet || gScore < node.g) {
          node.parent = current;
          node.g = gScore;
          node.h = heuristic(node, goal);
          node.f = node.g + node.h;
          
          if (!inOpenSet) {
            openSet.push(node);
          }
        }
      }
    }
    
    return null; // No path found
  }
  
  export function createGrid(width, height, obstacles) {
    const grid = [];
    for (let x = 0; x < width; x++) {
      grid[x] = [];
      for (let y = 0; y < height; y++) {
        grid[x][y] = new Node(x, y);
      }
    }
    
    for (let obstacle of obstacles) {
      const { left, top, width, height } = obstacle;
      for (let x = left; x < left + width; x++) {
        for (let y = top; y < top + height; y++) {
          if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
            grid[x][y].walkable = false;
          }
        }
      }
    }
    
    return grid;
  }


  // utils/aStar.js

// ... (mantén las clases y funciones existentes)

export function createNavigationGraph(routes) {
  const graph = {};

  Object.keys(routes).forEach(start => {
    graph[start] = {};
    Object.keys(routes[start]).forEach(end => {
      const path = routes[start][end];
      const distance = path.reduce((acc, curr, index, arr) => {
        if (index === 0) return 0;
        const prev = arr[index - 1];
        return acc + Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
      }, 0);
      graph[start][end] = distance;
      
      // Añadir la ruta inversa si no existe
      if (!graph[end]) {
        graph[end] = {};
      }
      if (!graph[end][start]) {
        graph[end][start] = distance;
      }
    });
  });

  return graph;
}

export function findShortestPath(graph, start, end) {
  const costs = {};
  const parents = {};
  const processed = new Set();

  Object.keys(graph).forEach(node => {
    costs[node] = node === start ? 0 : Infinity;
    parents[node] = null;
  });

  let node = findLowestCostNode(costs, processed);

  while (node) {
    const cost = costs[node];
    const neighbors = graph[node];
    Object.keys(neighbors).forEach(neighbor => {
      const newCost = cost + neighbors[neighbor];
      if (newCost < costs[neighbor]) {
        costs[neighbor] = newCost;
        parents[neighbor] = node;
      }
    });
    processed.add(node);
    node = findLowestCostNode(costs, processed);
  }

  if (parents[end] === null) {
    return null; // No hay ruta
  }

  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = parents[current];
  }

  return path;
}

function findLowestCostNode(costs, processed) {
  return Object.keys(costs).reduce((lowest, node) => {
    if (lowest === null || costs[node] < costs[lowest]) {
      if (!processed.has(node)) {
        lowest = node;
      }
    }
    return lowest;
  }, null);
}
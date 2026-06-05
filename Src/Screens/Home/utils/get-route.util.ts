import { edges } from "../Components/MapComponent/data/edges";
import { nodes, type Node } from "../Components/MapComponent/data/nodes";

interface Route {
    coordinates: number[][];
}

type Graph = Map<string, { neighborId: string; weight: number }[]>;

// Min-Heap
class MinHeap {
    private heap: { id: string; score: number }[] = [];

    get size() {
        return this.heap.length;
    }

    push(id: string, score: number) {
        this.heap.push({ id, score });
        this.bubbleUp(this.heap.length - 1);
    }

    pop(): string | undefined {
        if (this.heap.length === 0) return undefined;
        const top = this.heap[0].id;
        const last = this.heap.pop();
        if (this.heap.length > 0 && last !== undefined) {
            this.heap[0] = last;
            this.sinkDown(0);
        }
        return top;
    }

    private bubbleUp(i: number) {
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (this.heap[parent].score <= this.heap[i].score) break;
            [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
            i = parent;
        }
    }

    private sinkDown(i: number) {
        const n = this.heap.length;
        while (true) {
            let smallest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            if (left < n && this.heap[left].score < this.heap[smallest].score) smallest = left;
            if (right < n && this.heap[right].score < this.heap[smallest].score) smallest = right;
            if (smallest === i) break;
            [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
            i = smallest;
        }
    }
}

// Grafo 
const nodeMap = new Map<string, Node>(nodes.map((n) => [n.id, n]));

const buildGraph = (): Graph => {
    const graph: Graph = new Map();
    for (const edge of edges) {
        if (!graph.has(edge.source)) graph.set(edge.source, []);
        if (!graph.has(edge.target)) graph.set(edge.target, []);
        graph?.get(edge.source)?.push({ neighborId: edge.target, weight: edge.weight ?? 0 });
        graph?.get(edge.target)?.push({ neighborId: edge.source, weight: edge.weight ?? 0 });
    }
    return graph;
};

// Se inicializan una sola vez al importar el módulo, no en cada llamada
const graph = buildGraph();

// Heurística 
const heuristic = (a: Node, b: Node): number => {
    return Math.hypot(a.x - b.x, a.y - b.y);
};

// A*
export const getRoute = (startNodeId: string, endNodeId: string): Route | null => {
    const startNode = nodeMap.get(startNodeId);
    const endNode = nodeMap.get(endNodeId);
    if (!startNode || !endNode) return null;

    const openHeap = new MinHeap();
    openHeap.push(startNodeId, 0);

    const cameFrom = new Map<string, string>();

    const gScore = new Map<string, number>();
    gScore.set(startNodeId, 0);

    // Nodos ya procesados — evita reprocesar nodos con mejor score ya confirmado
    const closed = new Set<string>();

    while (openHeap.size > 0) {
        const current = openHeap.pop();
        if (current === undefined) break;

        if (current === endNodeId) {
            // Reconstruir path
            const path: string[] = [];
            let node: string | undefined = current;
            while (node !== undefined) {
                path.unshift(node);
                node = cameFrom.get(node);
            }
            return {
                coordinates: path.flatMap((id) => {
                    const n = nodeMap.get(id);
                    return n ? [[n.x, n.y]] : [];
                }),
            };
        }

        if (closed.has(current)) continue;
        closed.add(current);

        for (const { neighborId, weight } of graph.get(current) ?? []) {
            if (closed.has(neighborId)) continue;

            const tentativeG = (gScore.get(current) ?? Infinity) + weight;

            if (tentativeG < (gScore.get(neighborId) ?? Infinity)) {
                cameFrom.set(neighborId, current);
                gScore.set(neighborId, tentativeG);
                const neighbor = nodeMap.get(neighborId);
                if (neighbor === undefined) continue;
                const f = tentativeG + heuristic(neighbor, endNode);
                openHeap.push(neighborId, f);
            }
        }
    }

    return null;
};
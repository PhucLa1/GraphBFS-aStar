class BestFS {
    constructor() {
        this.adjacencyList = {};
        this.vertexWeights = {}; // Add vertex weights
    }

    addVertex(vertex, weight = 0) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
            this.vertexWeights[vertex] = weight;
        }
    }

    addEdge(vertex1, vertex2) {
        this.adjacencyList[vertex1].push(vertex2);
    }

    bestFS(start, end) {
        const cameFrom = {};
        const visited = new Set();
        const queue = [`${start}-${this.vertexWeights[start]}`];
        while (queue.length > 0) {
            queue.sort(function (a, b) {
                let numA = parseInt(a.replace(/[^0-9]/g, ''), 10);
                let numB = parseInt(b.replace(/[^0-9]/g, ''), 10);
                return numA - numB;
            })
            const current = queue.shift();
            if (!visited.has(current)) {
                const copyCurrent = current.split('-')[0]
                const neighbors = this.adjacencyList[copyCurrent];
                //console.log(neighbors)
                for (const neighbor of neighbors) {
                    if(!visited.has(neighbor)){
                        cameFrom[neighbor] = copyCurrent;
                        visited.add(neighbor);
                        queue.push(`${neighbor}-${this.vertexWeights[neighbor]}`)
                    }
                }
                addNewRow(current,neighbors.join(', '),queue.join(', '))
                if (copyCurrent === end) {
                    return this.reconstructPath(cameFrom, copyCurrent);
                }
            }
        }
        return 'Khong tim thay';
    }

    reconstructPath(cameFrom, current) {
        const path = [current];
        while (cameFrom[current]) {
            current = cameFrom[current];
            path.unshift(current);
        }
        return `The path: ${path.join(' -> ')}`;
    }
}
function addNewRow(expan, adjance, L) {
    const tableBody = document.querySelector('#Output tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <th>${expan}</th>
    <td>${adjance}</td>
    <td>${L}</td>
  `;
    tableBody.appendChild(newRow);
}

// const graphA = new BestFS();
// graphA.addVertex('A', 20);
// graphA.addVertex('B', 0);
// graphA.addVertex('C', 15);
// graphA.addVertex('D', 6);
// graphA.addVertex('E', 7);
// graphA.addVertex('F', 10);
// graphA.addVertex('I', 8);
// graphA.addVertex('K', 12);
// graphA.addVertex('H', 3);
// graphA.addVertex('G', 5);



// graphA.addEdge('A', 'C');
// graphA.addEdge('A', 'D');
// graphA.addEdge('A', 'E');
// graphA.addEdge('C', 'F');
// graphA.addEdge('D', 'F');
// graphA.addEdge('D', 'I');
// graphA.addEdge('E', 'K');
// graphA.addEdge('E', 'G');
// graphA.addEdge('F', 'B');
// graphA.addEdge('I', 'B');
// graphA.addEdge('I', 'G');
// graphA.addEdge('G', 'B');
// graphA.addEdge('G', 'H');
// graphA.addEdge('H', 'B');
// const result = graphA.bestFS('A', 'B');
// console.log(result);
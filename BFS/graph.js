class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
    }
    removeVertex(vertex) {
        if (this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
        }
        for (var key in this.adjacencyList) {
            if (this.adjacencyList.hasOwnProperty(key)) {
                console.log("Key:", key);
                console.log("Value:", this.adjacencyList[key]);
                // Tại đây bạn có thể thực hiện các thao tác khác với mảng, ví dụ:
                let indexToRemove = this.adjacencyList[key].indexOf(vertex); // Tìm vị trí của giá trị cần xóa trong mảng

                if (indexToRemove !== -1) {
                    this.adjacencyList[key].splice(indexToRemove, 1); // Xóa phần tử tại vị trí đã tìm được
                    //console.log("Đã xóa phần tử", valueToRemove);
                }
            }
        }
    }

    addEdge(vertex1, vertex2) {
        this.adjacencyList[vertex1].push(vertex2);
    }
    removeEdge(vertex1, vertex2) {
        this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(v => v !== vertex2);
    }

    bfs(start, end) {
        const visited = {};
        const queue = [[start]];
        const normalQueue = [start];

        if (start === end) {
            return 'Điểm đầu và điểm cuối trùng nhau';
        }

        while (queue.length > 0) {
            const path = queue.shift();
            const removedElement = normalQueue.shift();
            const node = path[path.length - 1];
            let edge = node;


            if (!visited[node]) {
                const neighbors = this.adjacencyList[node];
                console.log(neighbors)
                var adjacent = neighbors;
                for (const neighbor of neighbors) {
                    const newPath = [...path, neighbor];

                    if (neighbor === end) {
                        normalQueue.push(neighbor)
                        visited[node] = true;
                        var visit = Object.keys(visited).join(', '); // Chuyển các key thành chuỗi                       
                        addNewRow(edge, visit, adjacent, normalQueue)
                        return `The path from ${start} to ${end}: ${newPath.join(' -> ')}`;
                    } else {
                        //console.log(newPath)
                        normalQueue.push(neighbor)
                        console.log(normalQueue)
                        queue.push(newPath);
                    }
                }
                visited[node] = true;
                var visit = Object.keys(visited).join(', '); // Chuyển các key thành chuỗi
            }
            let queues = queue.map(item => item.join(', ')).join(', ');
            //console.log(`${edge} ${path} ${adjacent} ${visit}`)
            //console.log(queues)
            addNewRow(edge, visit, adjacent, normalQueue)
        }

        return 'Không tìm thấy đường đi';
    }
}

function addNewRow(edge, visit, adjacent, queues) {
    const tableBody = document.querySelector('#Output tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <th>${edge}</th>
    <td>${visit}</td>
    <td>${adjacent}</td>
    <td>${queues}</td>
  `;
    tableBody.appendChild(newRow);
}
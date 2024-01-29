class GraphA {
    constructor() {
        this.adjacencyList = {};
        this.vertexWeights = {}; // Add vertex weights
        this.edgeWeights = {};   // Add edge weights
    }

    addVertex(vertex, weight = 0) {
        if (!this.adjacencyList[vertex]) {
            this.adjacencyList[vertex] = [];
            this.vertexWeights[vertex] = weight;
        }
    }

    addEdge(vertex1, vertex2, weight = 0) {
        this.adjacencyList[vertex1].push(vertex2);
        this.edgeWeights[`${vertex1}-${vertex2}`] = weight;
    }
    removeVertex(vertex) {
        if (this.adjacencyList[vertex]) {
            // Remove the vertex from the adjacency list
            delete this.adjacencyList[vertex];

            // Remove the vertex weight
            delete this.vertexWeights[vertex];

            // Remove all edges that connect to the vertex
            for (let v in this.adjacencyList) {
                this.adjacencyList[v] = this.adjacencyList[v].filter(vtx => vtx !== vertex);
            }

            // Remove edge weights associated with the vertex
            for (let edge in this.edgeWeights) {
                if (edge.includes(vertex)) {
                    delete this.edgeWeights[edge];
                }
            }
        }
    }

    removeEdge(vertex1, vertex2) {
        if (this.adjacencyList[vertex1] && this.adjacencyList[vertex2]) {
            // Remove the edge from the adjacency list
            this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(vtx => vtx !== vertex2);

            // Remove the edge weight
            delete this.edgeWeights[`${vertex1}-${vertex2}`];
        }
    }

    aStar(start, end) {
        const cameFrom = {};
        const mapGF = {[`${start}-${this.vertexWeights[start]}`]:1}  //Tạo map để lưu giữ những đỉnh đã đi qua
        const gfScore = { [`${start}-${this.vertexWeights[start]}`]: 0 }; // Tạo gfScore đẻ lưu giữ key là đỉnh L chờ được duyệt và value là giá trị g của đỉnh đó
        while (Object.keys(gfScore).length > 0) {
            const currentGF = Object.keys(gfScore).sort((a, b) => {
                let numA = parseInt(a.replace(/[^0-9]/g, ''), 10);
                let numB = parseInt(b.replace(/[^0-9]/g, ''), 10);
                return numA - numB;
            })[0];
            const current = currentGF[0]
            const valueOfCurrent = gfScore[currentGF]
            delete gfScore[currentGF];          
            const neighbors = this.adjacencyList[current];
            let adjancent='',k='',h='',g='',f='';
            for (const neighbor of neighbors) {
                const tentativeGScore = valueOfCurrent + this.edgeWeights[`${current}-${neighbor}`]+this.vertexWeights[`${neighbor}`];
                if(!mapGF[`${neighbor}-${tentativeGScore}`]){
                    mapGF[`${neighbor}-${tentativeGScore}`] = 1
                    gfScore[`${neighbor}-${tentativeGScore}`] = valueOfCurrent + this.edgeWeights[`${current}-${neighbor}`]
                    cameFrom[neighbor] = current;
                }
                adjancent += `${neighbor}<br>`
                k += `${this.edgeWeights[`${current}-${neighbor}`]}<br>`
                h += `${this.vertexWeights[`${neighbor}`]}<br>`
                g += `${gfScore[`${neighbor}-${tentativeGScore}`]}<br>`
                f += `${tentativeGScore}<br>`
                //console.log(current,neighbor,this.edgeWeights[`${current}-${neighbor}`],this.vertexWeights[`${neighbor}`],gfScore[`${neighbor}-${tentativeGScore}`],tentativeGScore)
            }
            
            if (current === end) {
                return this.reconstructPath(cameFrom, current);
            }
            let listL = Object.keys(gfScore).sort((a, b) => {
                // Trích xuất số từ chuỗi và chuyển đổi thành số để so sánh
                let numA = parseInt(a.replace(/[^0-9]/g, ''), 10);
                let numB = parseInt(b.replace(/[^0-9]/g, ''), 10);
        
                return numA - numB;
            }).join(', ')
            addNewRow(current,adjancent,k,h,g,f,listL)
            console.log(current,adjancent,k,h,g,f,listL)
            
        }
        return 'Không tìm thấy đường đi';
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

function addNewRow(node, adjancent, k, h,g,f,listL) {
    const tableBody = document.querySelector('#Output tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <th>${node}</th>
    <td>${adjancent}</td>
    <td>${k}</td>
    <td>${h}</td>
    <td>${g}</td>
    <td>${f}</td>
    <td>${listL}</td>
  `;
    tableBody.appendChild(newRow);
}

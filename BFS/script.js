const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
let rowCount = 1;
let vertices = [];
let edges = [];
let vertexName = [];
const graph = new Graph();

function isPairDuplicate(edges, pair) {
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        if ((edge[0] == pair[0] && edge[1] == pair[1]) || (edge[0] == pair[1] && edge[1] == pair[0])) {
            return true; // Trùng lặp
        }
    }
    return false; // Không trùng lặp
}

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    vertices.forEach((vertex, index) => {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black'; // Màu chữ bên ngoài hình tròn
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(vertexName[index], vertex.x + 15, vertex.y - 15); // Vẽ số bên ngoài hình tròn
    });

    ctx.strokeStyle = 'yellow';
    edges.forEach(edge => {
        const start = vertices.find(function(element) {
            return element.name === edge[0];
        });
        const end = vertices.find(function(element) {
            return element.name === edge[1];
        });

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        drawArrowhead(ctx, start.x, start.y, end.x, end.y); // Thêm mũi tên chỉ hướng của cạnh
    });
}

function drawArrowhead(ctx, fromX, fromY, toX, toY) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    const headLength = 10;
    ctx.strokeStyle = 'yellow'

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
        toX - headLength * Math.cos(angle - Math.PI / 6),
        toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
        toX - headLength * Math.cos(angle + Math.PI / 6),
        toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.stroke(); // Vẽ mũi tên với màu trắng
}

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let pointExists = false;

    vertices.forEach((vertex, index) => {
        const distance = Math.sqrt((mouseX - vertex.x) ** 2 + (mouseY - vertex.y) ** 2);
        if (distance <= 10) {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    edges = edges.filter(subArray => !subArray.includes(vertex['name']));
                    vertices.splice(index, 1);
                    graph.removeVertex(vertex['name'])
                    vertexName = vertexName.filter(verte => verte != vertex['name'])
                    console.log(edges)
                    showTable()
                    drawGraph()
                }
            });
            pointExists = true;
        }
    });

    if (!pointExists) {
        addVertex(event);
    }
}

function addVertex(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    //Enter the name verticles
    let name = prompt("Enter your name:");
    if(handleErrorVertex(name) == true){
        vertexName.push(name.toString())
        console.log(vertexName)
        vertices.push({ x: mouseX, y: mouseY, name: name.toString() });
        graph.addVertex(name.toString());
        //console.log(vertices.length - 1)
        drawGraph();
    }
}

function newRow() {
    let first = document.querySelector('#first').value
    let last = document.querySelector('#last').value
    const newPair = [first, last];
    if (handleError(first, last, 0) == true) {
        first = first.toString();
        last = last.toString();
        edges.push([first, last]);
        graph.addEdge(first, last);
        showTable();
        drawGraph()
    }
    document.querySelector('#first').value = '';
    document.querySelector('#last').value = ''
}
function showTable(){
    const tableBody = document.querySelector('#Input tbody');
    tableBody.innerHTML = '';
    edges.forEach(function(edge, index) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
        <th>${index+1}</th>
        <td>${edge[0]}</td>
        <td>${edge[1]}</td>
        <td><i onclick="deleteEdge('${edge[0].toString()}','${edge[1].toString()}')" class="fa-solid fa-trash"></i></td>
      `;
      tableBody.appendChild(newRow);
      });
}

function handleError(first, last, status) { //0: thêm, 1:tìm
    let dataReturn = false;
    const newPair = [first, last];
    if (status == 0) {
        if (isPairDuplicate(edges, newPair)) {
            Swal.fire({
                title: "Fails!",
                text: "The pair has exist",
                icon: "error"
            });
            return false;
        }
    }
    if (first == '' || last == '') {
        Swal.fire({
            title: "Fails!",
            text: "The input required",
            icon: "error"
        });
        return false;
    }
    else if (!vertexName.includes(first)) {
        Swal.fire({
            title: "Fails!",
            text: "The first point not exist",
            icon: "error"
        });
        return false;
    }
    else if (!vertexName.includes(last)) {
        Swal.fire({
            title: "Fails!",
            text: "The last point not exist",
            icon: "error"
        });
        return false;
    }
    else if (first == last) {
        Swal.fire({
            title: "Fails!",
            text: "Last and first not be the same",
            icon: "error"
        });
        return false;
    } else {
        return true;
    }
}
function handleErrorVertex(name){
    if(name == null) {
        Swal.fire({
            title: "Fails!",
            text: "Field name is required",
            icon: "error"
        });
        return false;
    }
    if(vertexName.includes(name.toString())) {
        Swal.fire({
            title: "Fails!",
            text: "The name has already existed",
            icon: "error"
        });
        return false;
    }
    return true;
}
function findBFS() {
    let start = document.querySelector('#start').value
    let end = document.querySelector('#end').value
    if (handleError(start, end, 1) == true) {
        document.querySelector('#Output tbody').innerHTML = '';
        start = start.toString();
        end = end.toString();
        document.getElementById('path').innerHTML = graph.bfs(start, end)
    }
}
function deleteEdge(first,last){
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            graph.removeEdge(first,last)
            edges = edges.filter(edge => !(edge[0] === first && edge[1] === last));
            showTable()
            drawGraph()
        }
    });

}
canvas.addEventListener('click', handleClick);
drawGraph();


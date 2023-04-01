const canvas = document.getElementById("board");
canvas.width = 500;
canvas.height = 500;

let numOfRows = 25;
let numOfCols = 25;
let nodeWidth  = canvas.width / numOfRows;
let nodeHeight = canvas.height / numOfCols;

//make new queue to be used for the algorithms
let queue = new Array();

const c = canvas.getContext('2d');

//function that draws a node according to me
let manualDraw = (node, color) => {
    c.fillStyle = color;
    c.fillRect(node.i*nodeWidth+1, node.j*nodeHeight+1, nodeWidth-1, nodeHeight-1);

    //draw outline of rectangle
    c.beginPath();
    c.rect(node.i*nodeWidth, node.j*nodeHeight, nodeWidth, nodeHeight);
    c.stroke();
}

//function that draws each node acording to state
let draw = node => {
    let color;
    switch (node.state){
        case 'u': color = "white"; break;
        case 'v': color = "grey"; break;
        case 'e': color = "green"; break;
        default: color = "black";
    }

    manualDraw(node, color);
}

//pressing lets you place walls
canvas.addEventListener("mousedown", (event) => {
    let rect = canvas.getBoundingClientRect();
    let x = event.x - rect.left;
    let y = event.y - rect.top;
    
    let i = Math.floor(x / nodeWidth);
    let j = Math.floor(y / nodeHeight);

    let option = document.getElementById("mouseOption").value;
    if (option == "1"){
        if (grid[i][j].state != 'w'){
            grid[i][j].state = 'w';
        }else{
            grid[i][j].state = 'u';
        }
        grid[i][j].previous = undefined;
        grid[i][j].distance = Infinity;
        draw(grid[i][j]);
    }
    else if (option == "2"){
        draw(start);
        s.i = i;
        s.j = j;
        start = grid[i][j];
        manualDraw(start, "cyan");
    }
    else if (option == "3"){
        draw(end);
        e.i = i;
        e.j = j;
        end = grid[i][j];
        manualDraw(end, "magenta");
    }
    
});

//function that draws the path from the start to the end
let getPathToNode = (node) => {
    if (node.state == 'e'){
        let t = 0;
        let temp = node;
        while (temp != undefined){
            t += temp.distance;
            manualDraw(temp, "blue")
            temp = temp.previous;
        }
        console.log("distance = " + t);
    }
    manualDraw(start, "cyan");
    manualDraw(end, "magenta");
}

//function that takes the first element out of the queue
let getFromFIFOQ = () => {
    let temp = queue[0];
    queue.splice(0, 1);
    return temp;
}

let getFromLIFOQ = () => {
    let temp = queue[queue.length-1];
    queue.splice(queue.length-1, 1);
    return temp;
}

let getLowestDistNodeFromQ = () => {
    let min = queue[0];
    let p = 0;
    for (let i = 1; i < queue.length; ++i){
        if (queue[i].distance < min.distance){
            min = queue[i];
            p = i;
        }
    }
    queue.splice(p, 1);
    return min;
}

let getLowestFofXFromQ = () => {
    let min = queue[0];
    let p = 0;
    for (let i = 1; i < queue.length; ++i){
        if (queue[i].F < min.F){
            min = queue[i];
            p = i;
        }
    }
    queue.splice(p, 1);
    return min;
}

//setting start and finish coordinates
let s = {i: 0, j: 0};
let e = {i: numOfRows-1, j: numOfCols-1};

//function that makes random walls
let randWalls = () => {
    for (let i = 0; i < numOfRows; ++i){
        for (let j = 0; j < numOfCols; ++j){
            grid[i][j].state = 'u';
            //make random walls but make sure they are neither the start or the end
            if (Math.random() < 0.25){
                if ((i == e.i && j == e.j) || (i == s.i && j == s.j)){
                    grid[i][j].state = 'u';
                }
                else{
                    grid[i][j].state = 'w';
                }
            }
            draw(grid[i][j]);
        }
    }
    manualDraw(end, "magenta");
    manualDraw(start, "cyan");
}

let eraseWalls = () => {
    for (let i = 0; i < numOfRows; ++i){
        for (let j = 0; j < numOfCols; ++j){
            if (grid[i][j].state == 'w'){
                grid[i][j].state = 'u';
            }
            draw(grid[i][j]);
        }
    }
    manualDraw(end, "magenta");
    manualDraw(start, "cyan");
}

let reset = () => {
    //reset queue
    queue = new Array();

    //reset nodes
    for (let i = 0; i < numOfRows; ++i){
        for (let j = 0; j < numOfCols; ++j){
            if (grid[i][j].state != 'w'){
                grid[i][j].state = 'u';
                grid[i][j].distance = Infinity;
                grid[i][j].previous = undefined;
                grid[i][j].neighbours = [];
                grid[i][j].edgeWeights = [];
                grid[i][j].startTime = undefined;
                grid[i][j].finishTime = undefined;
            }
            draw(grid[i][j]);
        }
    }
    manualDraw(end, "magenta");
    manualDraw(start, "cyan");
}

//make the array of nodes
let grid = new Array();
for (let i = 0; i < numOfRows; ++i){
    grid[i] = new Array();
    for (let j = 0; j < numOfCols; ++j){
        grid[i][j] = new Node(i, j);
        draw(grid[i][j]);
    }
}

//define start and end verticies
let start = grid[s.i][s.j];
let end = grid[e.i][e.j];
manualDraw(end, "magenta");
manualDraw(start, "cyan");

//BFS----------------------------------------------
function BFS_Exec(){
    start.state = 'v';
    start.distance = 0;
    queue.push(start);

    BFS_algo();
}

function BFS_algo(){
    let id = requestAnimationFrame(BFS_algo);

    let vertex = getFromFIFOQ();
    vertex.state = 'e';
    draw(vertex);

    for (let i = 0; i < vertex.neighbours.length; ++i){
        if (vertex.neighbours[i].state == 'u'){
            vertex.neighbours[i].distance = vertex.distance + 1;
            vertex.neighbours[i].previous = vertex;
            vertex.neighbours[i].state = 'v';
            draw(vertex.neighbours[i]);
            queue.push(vertex.neighbours[i]);
        }
    }

    if (vertex == end || queue.length == 0){
        cancelAnimationFrame(id);
        getPathToNode(end);
    }
}
//-------------------------------------------------

//DFS----------------------------------------------
let time;
let index;
function DFS_Exec(){
    time = 0;
    index = 0;
    start.startTime = time++;
    queue.push(start);

    DFS_algo();
}

function DFS_algo(){
    let id = requestAnimationFrame(DFS_algo);

    let vertex = queue[index];
    vertex.state = 'v';
    draw(vertex);

    if (queue.length == 0){
        cancelAnimationFrame(id);
        console.log(grid);
    }

    let noNeighbours = true;
    for (let i = 0; i < vertex.neighbours.length; ++i){
        if (vertex.neighbours[i].state == 'u'){
            vertex.neighbours[i].state = 'v';
            vertex.neighbours[i].startTime = time++;
            vertex.neighbours[i].previous = vertex;
            queue.push(vertex.neighbours[i]);
            noNeighbours = false;
            break;
        }
    }

    if (noNeighbours){
        let explored = getFromLIFOQ();
        explored.state = 'e';
        explored.finishTime = time++;
        draw(explored);
        --index;
    }
    else{
        ++index;
    }
}
//-------------------------------------------------

//Dijkstra-----------------------------------------
function Dijkstra_Exec(){
    start.distance = 0;
    queue = grid.flat();

    Dijkstra_algo();
}

let diagonalDist = 1.4;
//diagonal edges have weight = 1.4, straight one have weight = 1
function Dijkstra_algo(){
    let id = requestAnimationFrame(Dijkstra_algo);

    let vertex = getLowestDistNodeFromQ();
    vertex.state = 'e';
    draw(vertex);

    if (vertex == end || queue.length == 0){
        cancelAnimationFrame(id);
        getPathToNode(end);
    }

    for (let i = 0; i < vertex.neighbours.length; ++i){
        if (vertex.distance + vertex.edgeWeights[i] < vertex.neighbours[i].distance){
            if (!queue.includes(vertex.neighbours[i])){
                continue;
            }
            vertex.neighbours[i].previous = vertex;
            vertex.neighbours[i].distance = vertex.distance + vertex.edgeWeights[i];
            vertex.neighbours[i].state = 'v';
            draw(vertex.neighbours[i]);
        }
    }
}
//-------------------------------------------------

//A* ----------------------------------------------
let closedSet;
function AStar_Exec(){
    closedSet = new Array();
    queue = new Array();
    start.distance = 0;
    start.F = start.distance + heuristic(start);
    queue.push(start);

    AStar_algo();
}

function AStar_algo(){
    let id = requestAnimationFrame(AStar_algo);

    let vertex = getLowestFofXFromQ();
    closedSet.push(vertex);
    vertex.state = 'e';
    draw(vertex);

    for (let i = 0; i < vertex.neighbours.length; ++i){
        if (closedSet.includes(vertex.neighbours[i])){
            continue;
        }

        let g = vertex.distance + vertex.edgeWeights[i];
        if (g < vertex.neighbours[i].distance){
            vertex.neighbours[i].distance = g;
            vertex.neighbours[i].previous = vertex;
            vertex.neighbours[i].F = g + heuristic(vertex.neighbours[i]);
            vertex.neighbours[i].state = 'v';
            draw(vertex.neighbours[i]);
            if (notInQ(vertex.neighbours[i])){
                queue.push(vertex.neighbours[i]);
            }
        }
    }

    if (vertex == end || queue.length == 0){
        cancelAnimationFrame(id);
        getPathToNode(end);
    }
}

function heuristic(node){
    let dx = Math.abs(end.i - node.i);
    let dy = Math.abs(end.j - node.j);
    return dx + dy;
}

function notInQ(node){
    for (let i = 0; i < queue.length; ++i){
        if (node == queue[i]){
            return false;
        }
    }
    return true;
}
//-------------------------------------------------

function main(){
    //set the neighbours of each node.
    for (let i = 0; i < numOfRows; ++i){
        for (let j = 0; j < numOfCols; ++j){
            if (grid[i][j].state == 'w'){
                continue;
            }

            grid[i][j].setNeighbours(grid);
        }
    }

    let algo = document.getElementById("algo").value;
    switch (algo){
        case "1": BFS_Exec(); break;
        case "2": DFS_Exec(); break;
        case "3": Dijkstra_Exec(); break;
        case "4": AStar_Exec(); break;
        default: console.log("error!");
    }
}
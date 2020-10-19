//global variables
let cols, rows;
let grid;

let openSet = [];
let closedSet = [];

let start;
let end;

let w, h;
let path = [];

let loopit = false;
let initit = false;
let clickable = true;

//p5 setup
function setup(){
    createCanvas(800, 800);
    document.getElementById("solve").disabled = true;
    //frameRate(10);
    //initAstar();
}

//p5 draw
function draw(){
    if(initit){
        clickable = true;
        rows = document.getElementById('size').value;
        cols = document.getElementById('size').value;
        initAstar();
        initit = false;
        document.getElementById("solve").disabled = false;
        //loopit = true;
    }
    if(loopit){
        clickable = false;
        document.getElementById("solve").disabled = true;
        loopAstar();
    }
}
//initialize a* alg.
function initAstar(){
    openSet = [];
    closedSet = [];
    grid = new Array(cols);
    
    w = width / cols;
    h = height / rows;

    //2D arr
    for(let i = 0; i < cols; i++){
        grid[i] = new Array(rows);
    }
    console.log(grid);

    //fill 2D arr w Cell objs
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j] = new Cell(i, j);
        }
    }

    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j].show(255);
        }
    }
    //add neighbors
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j].addNeighbors(grid);
        }
    }

    //init start & end nodes;
    start = grid[0][0];
    end = grid[cols-1][rows-1];
    start.wall = false;
    end.wall   = false;
    end.end = true;
    start.start = true;
    end.show(0);
    start.show(0);

    //start -> open set;
    openSet.push(start);
}

//loop section
function loopAstar(){
    let current;
    if(openSet.length > 0){
        //find lowest f score
        let lowestF = 0;
        for(let i = 0; i < openSet.length; i++){
            if(openSet[i].f < openSet[lowestF].f){
                lowestF = i;
            }
        }

        current = openSet[lowestF];

        //end
        if(current === end){
            console.log("Done!");
            document.getElementById("solve").disabled = true;
            loopit = false;
        }

        //push current to closedset
        removeFromArray(openSet, current);
        closedSet.push(current);

        //check every current neighbor;
        let neighbors = current.neighbors;

        for(let i = 0; i < neighbors.length; i++){
            let neighbor = neighbors[i];
            
            if(!closedSet.includes(neighbor) && !neighbor.wall){
                let tempG = current.g + 1;

                if(openSet.includes(neighbor)){
                    if(tempG < neighbor.g){
                        neighbor.g = tempG;
                    }
                }
                else{
                    neighbor.g = tempG;
                    openSet.push(neighbor);
                }
                //educated guess f(n) = g(n) + h(n)
                neighbor.h = distance(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.prev = current;

            }

        }

    }
    else{
        console.log("no solution");
        document.getElementById("solve").disabled = true;
    }


    background(0);

    //show all nodes
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j].show(255);
        }
    }

    //color sets cls -> red, ops -> green;
    for(let i = 0; i < closedSet.length; i++){
        closedSet[i].show(color(255, 0, 0));
    }

    for(let i = 0; i < openSet.length; i++){
        openSet[i].show(color(0, 255, 0));
    }

    path = [];
    let temp = current;
    path.push(temp)
    while(temp.prev){
        path.push(temp.prev);
        temp = temp.prev;
    }

    for(let i = 0; i < path.length; i++){
        path[i].show(color(0, 0, 255));
    }
}

//remove from arr function
function removeFromArray(arr, item){
    for(let i = arr.length - 1; i>=0; i--){
        if(arr[i] == item){
            arr.splice(i, 1);
        }
    }
}

//calc dist for ranking items in openset
function distance(a, b){
    let d = dist(a.i, a.j, b.i, b.j);
    //let d = abs(a.i-b.i) + abs(a.j-b.j)
    return d;
}

function mousePressed(){
    if(mouseX >= 0 && mouseY >= 0 && mouseX < width && mouseY < height && clickable){
        let i = ceil(mouseX / w);
        let j = ceil(mouseY / h);
        console.log(i, j)
        grid[i-1][j-1].pressed();
        grid[i-1][j-1].show(255);
    }
}

function startloop(){
    loopit = true;
}

//old restart func
function restart(){
    setup();
}

function Cell(i, j){
    //overall score f(n) = g(n) + h(n);
    this.f = 0;
    //cost from a to b
    this.g = 0;
    //cost from a to endCell
    this.h = 0;

    this.start = false;
    this.end = false;

    this.i = i;
    this.j = j;
    this.wall = false;

    //spawning walls
    /*if(random(1) < 0.4){
        this.wall = true;
    }*/
    this.neighbors = [];
    this.prev = undefined;
    this.show = function(col){
        fill(color(col));
        if(this.wall){
            fill(0);
        }
        if(this.end){
            fill(color(255,223,0));
        }  
        if(this.start){
            fill(color(255,0 ,255));
        }
        stroke(0);
        rect(this.i * w, this.j * h, w - 1, h - 1);
    }

    

    //add neighbors
    this.addNeighbors = function(grid){
        let i = this.i;
        let j = this.j;

        if(i < cols-1)
        {
            this.neighbors.push(grid[i + 1][j])
        };
        if(i > 0){
            this.neighbors.push(grid[i - 1][j])
        };
        if(j < rows-1){
            this.neighbors.push(grid[i][j + 1])
        };
        if(j > 0){
            this.neighbors.push(grid[i][j - 1])
        };
    }


    this.pressed = function(){
        this.wall = !this.wall;
    }
}

function getVal(){
    initit = true;
    loopit = false;
}

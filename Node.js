class Node{
    constructor(i, j){
        this.i = i;
        this.j = j;
        this.previous = undefined;
        this.distance = Infinity;
        this.startTime = undefined;
        this.finishTime = undefined;
        this.F = Infinity;
        this.neighbours = [];
        this.edgeWeights = [];
        this.state = 'u';
    }

    setNeighbours(grid){
        for (let i = -1; i < 2; ++i){
            for (let j = -1; j < 2; ++j){
                //check that its not itself
                if (i == 0 && j == 0){
                    continue;
                }

                //check that its in the grid
                if ((this.i + i > -1) && (this.i + i < grid.length) && (this.j + j > -1) && (this.j + j < grid[0].length)){
                    if (grid[this.i + i][this.j + j].state != 'w'){
                        this.neighbours.push(grid[this.i + i][this.j + j]);
                        if (i == 0 || j == 0){
                            this.edgeWeights.push(1);
                        }
                        else{
                            this.edgeWeights.push(1.4);
                        }
                    }
                }
            }
        }
    }
}
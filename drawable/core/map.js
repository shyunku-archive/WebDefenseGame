class Tile{
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.disabled = false;

        this.turret = null;
        this.isHovered = false;
    }

    setDisable = () => {
        this.disabled = true;
    }

    installTower(newTurret){
        this.turret = newTurret;
        this.turret.setPos(this.x, this.y);

        this.turretAttackThread = setInterval(() => {
            this.turret.attack();
        }, 10);
    }

    draw(c){
        this.isHovered = new Boundary(this.x - this.size/2, this.y - this.size/2, this.size, this.size).isInside(mousePos);
        if(this.disabled){
            c.fillStyle = "#AAA";
            c.fillRect(
                this.x - this.size/2,
                this.y - this.size/2,
                this.size, 
                this.size
            );
        }else{
            if(this.isHovered){
                c.fillStyle = "#AAF";
                c.fillRect(
                    this.x - this.size/2,
                    this.y - this.size/2,
                    this.size, 
                    this.size
                );
            }
        }

        c.strokeStyle = "black";
        c.strokeRect(
            this.x - this.size/2,
            this.y - this.size/2,
            this.size, 
            this.size
        );

        if(this.turret !== null){
            this.turret.draw(c, this.x, this.y, this.size, this.size);
        }
    }
}

class TileMap{
    constructor(){
        this.padding = 10;
        this.tilePadding = 0;
        this.tileSize = 50;
        this.mapSize = 15;

        this.tileMap = new Array(this.mapSize);
        for(let i=0; i<this.mapSize; i++){
            this.tileMap[i] = new Array(this.mapSize);
            for(let j=0; j<this.mapSize; j++){
                this.tileMap[i][j] = new Tile(
                    this.padding + j * (this.tilePadding + this.tileSize) + this.tileSize/2,
                    this.padding + i * (this.tilePadding + this.tileSize) + this.tileSize/2,
                    this.tileSize
                );
            }
        }

        for(let i=0;i<this.mapSize;i++){
            for(let j=0;j<this.mapSize;j++){
                if(j%2 === 0 || (i === 0 && j % 4 === 3) || (i === this.mapSize - 1 && j % 4 === 1)){
                    this.tileMap[i][j].setDisable();
                }
            }
        }
    }

    draw = (c) => {
        for(let i=0; i<this.mapSize; i++){
            for(let j=0; j<this.mapSize; j++){
                this.tileMap[i][j].draw(c);
            }
        }
    }

    installOnHovered = (tower) => {
        for(let i=0; i<this.mapSize; i++){
            for(let j=0; j<this.mapSize; j++){
                if(!this.tileMap[i][j].disabled && this.tileMap[i][j].isHovered){
                    this.tileMap[i][j].installTower(tower);
                }
            }
        }
    }

    tileCoord = (x, y) => {
        let newI = Math.floor((y - this.padding - this.tileSize/2) / (this.tilePadding + this.tileSize));
        let newJ = Math.floor((x - this.padding - this.tileSize/2) / (this.tilePadding + this.tileSize));

        if(newI < 0) newI = 0;
        if(newJ < 0) newJ = 0;
        if(newI > this.mapSize - 1) newI = this.mapSize - 1;
        if(newJ > this.mapSize - 1) newJ = this.mapSize - 1;

        return {
            i: newI,
            j: newJ
        };
    }

    moveDirection = (x, y, i, j) => {
        let tile = this.tileMap[i][j];

        if(i === 0){
            if(j % 4 === 0) return {x: 0, y: 1};
        }

        if(y < tile.y){
            if(j % 4 >= 2) return {x: 1, y: 0};
        }

        if(i !== 0 && i !== this.mapSize - 1 && j % 4 === 0) return {x: 0, y: 1};

        if(i === this.mapSize - 1){
            if(j % 4 <= 1) return {x: 1, y: 0};
            if(j % 4 === 2) return {x: 0, y: -1};
        }

        if(i !== this.mapSize - 1 && j % 4 === 2) return {x: 0, y: -1};


        return {x: 0, y: 0};
    }
}
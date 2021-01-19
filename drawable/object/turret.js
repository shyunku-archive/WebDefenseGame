class Tower{
    constructor(){
        this.representiveColor = 'white';
        this.attackPower = 0;
        this.attackSpeed = 1;
        this.range = 300;

        this.attackPowerGrowth = 1;
        this.attackSpeedGrowth = 0.01;

        this.level = 1;
        this.size = new TileMap().tileSize * 0.8;

        this.lastAttack = 0;

        this.x = 0;
        this.y = 0;
    }

    setPos(x, y){
        this.x = x;
        this.y = y;
    }

    // x, y, w, h is boundary of tile
    draw = (c, x, y, w, h) => {
        c.fillStyle = this.representiveColor;
        c.fillRect(x - this.size/2, y - this.size/2, this.size, this.size);
    }
}

class TurretArrangeHelper{
    constructor(){
        this.turretSize = new Tower().size;
    }

    draw(c){
        if(holdingItem === "" || holdingItem === undefined) return;
        
        c.fillStyle = holdingItem;

        c.fillRect(
            mousePos.x - this.turretSize/2,
            mousePos.y - this.turretSize/2,
            this.turretSize,
            this.turretSize
        );

        c.fillStyle = "#33333333";
        c.beginPath();
        c.arc(mousePos.x, mousePos.y, holdingTurret.range, 0, 2 * Math.PI);
        c.fill();
    }
}


class RedTower extends Tower{
    constructor(){
        super();
        this.representiveColor = 'red';
        this.attackPower = 50;
        this.attackSpeed = 1;
        this.range = 280;

        this.gold = 25;
    }

    attack(){
        let elapsedAfterAttack = current() - this.lastAttack;
        if(elapsedAfterAttack < (1000/this.attackSpeed)) return;

        for(let enemyId in enemyMap){
            let enemy = enemyMap[enemyId];
            let distance = distance_(enemy.x, enemy.y, this.x, this.y);

            if(distance <= this.range){
                let newBullet = new Bullet(this.x, this.y, enemy, this.representiveColor, this.attackPower);
                bulletMap[newBullet.id] = newBullet;
                this.lastAttack = current();
                break;
            }
        }
    }
}

class OrangeTower extends Tower{
    constructor(){
        super();
        this.representiveColor = 'orange';
        this.attackPower = 35;
        this.attackSpeed = 0.9;
        this.range = 220;

        this.gold = 40;
    }

    attack(){
        let elapsedAfterAttack = current() - this.lastAttack;
        if(elapsedAfterAttack < (1000/this.attackSpeed)) return;

        for(let enemyId in enemyMap){
            let enemy = enemyMap[enemyId];
            let distance = distance_(enemy.x, enemy.y, this.x, this.y);

            if(distance <= this.range){
                let newBullet = new ExplodeBullet(this.x, this.y, enemy, this.representiveColor, this.attackPower);
                bulletMap[newBullet.id] = newBullet;
                this.lastAttack = current();
                break;
            }
        }
    }
}

class YellowTower extends Tower{
    constructor(){
        super();
        this.representiveColor = 'yellow';
        this.attackPower = 22;
        this.attackSpeed = 2;
        this.range = 250;

        this.gold = 45;
    }

    attack(){
        let elapsedAfterAttack = current() - this.lastAttack;
        if(elapsedAfterAttack < (1000/this.attackSpeed)) return;

        for(let enemyId in enemyMap){
            let enemy = enemyMap[enemyId];
            let distance = distance_(enemy.x, enemy.y, this.x, this.y);

            if(distance <= this.range){
                let newLaser = new Laser(this.x, this.y, enemy, this.representiveColor, this.attackPower);
                laserMap[newLaser.id] = newLaser;
                this.lastAttack = current();
                break;
            }
        }
    }
}
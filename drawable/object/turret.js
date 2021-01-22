class Tower{
    constructor(){
        this.representiveColor = 'white';
        this.attackPower = 0;
        this.attackSpeed = 1;
        this.range = 300;

        this.attackPowerGrowth = 1;
        this.attackSpeedGrowth = 0.01;

        this.attackPowerBuff = 0;

        this.level = 1;
        this.size = new TileMap().tileSize * 0.7;

        this.lastAttack = 0;
        this.exp = new FlexibleValue(0, 0.999);
        this.maxExp = 100;
        this.dmgCounter = new FlexibleValue(0, 0.999);

        this.id = getRandomId();

        this.x = 0;
        this.y = 0;

        setInterval(() => {
            while(this.exp.real() > this.maxExp){
                this.level++;
                this.exp.add(-this.maxExp);

                this.maxExp = parseInt(100 * Math.pow(1.3, this.level));
                this.attackPower += this.attackPowerGrowth;
                this.attackSpeed += this.attackSpeedGrowth;
            }
        }, 10);
    }

    setPos(x, y){
        this.x = x;
        this.y = y;
    }

    // x, y, w, h is boundary of tile
    draw = (c, x, y, w, h) => {
        c.fillStyle = this.representiveColor;
        c.fillRect(x - this.size/2, y - this.size/2, this.size, this.size);

        let rectY = this.size * 0.1;
        c.fillStyle = 'black';
        c.fillRect(x - this.size/2, y + this.size/2 - rectY, this.size, rectY);
        c.fillStyle = '#4F4';
        c.fillRect(x - this.size/2, y + this.size/2 - rectY, this.size * (this.exp.get() / this.maxExp), rectY);

        c.fillStyle = this.representiveColor === 'yellow' ? 'black' : 'white';
        c.textAlign = 'center';
        c.fillText(this.level, x, y + rectY);
        c.textAlign = 'left';
    }

    getExp(exp){
        this.exp.add(exp);
    }

    addDmgCount(dmg){
        this.dmgCounter.add(dmg);
    }

    getAttackPowerBuffFactor(){
        return 1 + this.attackPowerBuff;
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
        this.range = 200;

        this.attackPowerGrowth = 4;
        this.attackSpeedGrowth = 0.03;

        this.gold = 25;
    }

    attack(){
        let elapsedAfterAttack = current() - this.lastAttack;
        if(elapsedAfterAttack < (1000/this.attackSpeed)) return;

        for(let enemyId in enemyMap){
            let enemy = enemyMap[enemyId];
            let distance = distance_(enemy.x, enemy.y, this.x, this.y);

            if(distance <= this.range){
                let newBullet = new Bullet(this, enemy, this.representiveColor, this.attackPower);
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
        this.attackSpeed = 1.0;
        this.range = 720;

        this.attackPowerGrowth = 3;
        this.attackSpeedGrowth = 0.03;

        this.gold = 40;

        this.lastAttackTarget = "";
        this.savedAttackSpeed = this.attackSpeed;
    }

    getCurrentMinimumAttackSpeed(){
        return this.attackSpeed;
    }

    attack(){
        let elapsedAfterAttack = current() - this.lastAttack;
        if(elapsedAfterAttack < (1000/this.attackSpeed)) return;
        if(this.attackSpeed > 1000){
            this.attackPowerBuff = this.attackSpeed / 1000;
        }else{
            this.attackPowerBuff = 0;
        }

        for(let enemyId in enemyMap){
            let enemy = enemyMap[enemyId];
            let distance = distance_(enemy.x, enemy.y, this.x, this.y);

            if(distance <= this.range){
                let newBullet = new Bullet(
                    this, enemy, this.representiveColor, this.attackPower * this.getAttackPowerBuffFactor()
                );
                bulletMap[newBullet.id] = newBullet;

                this.lastAttack = current();

                if(this.lastAttackTarget !== enemy.id){
                    this.attackSpeed = this.savedAttackSpeed;
                    this.lastAttackTarget = enemy.id;
                }else{
                    this.attackSpeed += 0.3;
                    if(this.attackSpeed > 15) this.attackSpeed = 15;
                }
                return;
            }
        }

        this.attackSpeed = this.savedAttackSpeed;
        this.lastAttackTarget = "";
    }
}

class YellowTower extends Tower{
    constructor(){
        super();
        this.representiveColor = 'yellow';
        this.attackPower = 22;
        this.attackSpeed = 1;
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
                let newLaser = new Laser(this, enemy, this.representiveColor, this.attackPower);
                laserMap[newLaser.id] = newLaser;
                this.lastAttack = current();
                break;
            }
        }
    }
}
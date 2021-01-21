class Bullet{
    constructor(source, target, color,  damage){
        this.x = source.x;
        this.y = source.y;
        this.size = 5;
        this.id = getRandomId();

        this.destX = target.x;
        this.destY = target.y;

        this.speed = 2;
        this.damage = damage;

        this.color = color;

        this.moveThread = setInterval(() => {
            this.destX = target.x;
            this.destY = target.y;

            if(target.died){
                this.willDestroy();
                return;
            }

            if(distance_(this.x, this.y, this.destX, this.destY) < this.speed){
                pushDamageEffect(target.x, target.y, this.damage);
                source.addDmgCount(this.damage);

                // destroy
                if(target.getDamage(this.damage)){
                    target.willDestroy();
                    gold.add(target.gold);
                    source.getExp(target.exp);
                    console.log(source.id);
                    delete enemyMap[target.id];
                }
                this.willDestroy();
                return;
            }
            this.angle = Math.atan2(this.destY - this.y, this.destX - this.x);
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
        });
    }

    draw(c){
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x - this.size/2, this.y - this.size/2 , this.size, 0, 2 * Math.PI);
        c.fill();
    }

    willDestroy(){
        clearInterval(this.moveThread);
        delete bulletMap[this.id];
    }
}

class ExplodeBullet{
    constructor(source, target, color, damage){
        this.x = source.x;
        this.y = source.y;
        this.size = 8;
        this.id = getRandomId();

        this.destX = target.x;
        this.destY = target.y;

        this.speed = 2;
        this.damage = damage;

        this.color = color;

        this.moveThread = setInterval(() => {
            this.destX = target.x;
            this.destY = target.y;

            if(target.died){
                this.willDestroy();
                return;
            }

            if(distance_(this.x, this.y, this.destX, this.destY) < this.speed){
                pushDamageEffect(target.x, target.y, this.damage);
                source.addDmgCount(this.damage);

                // destroy
                if(target.getDamage(this.damage)){
                    target.willDestroy();
                    gold.add(target.gold);
                    source.getExp(target.exp);
                    delete enemyMap[target.id];
                }
                this.willDestroy();
            }
            this.angle = Math.atan2(this.destY - this.y, this.destX - this.x);
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
        });
    }

    draw(c){
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x - this.size/2, this.y - this.size/2 , this.size, 0, 2 * Math.PI);
        c.fill();
    }

    willDestroy(){
        clearInterval(this.moveThread);
        delete bulletMap[this.id];
    }
}

class Laser{
    constructor(source, target, color, damage){
        this.x = source.x;
        this.y = source.y;
        this.size = 8;
        this.id = getRandomId();

        this.destX = target.x;
        this.destY = target.y;

        this.damage = damage;

        this.color = color;
        this.width = 10;

        this.startTime = current();
        this.liveTime = 500;

        for(let enemyId in enemyMap){
            let enemy = enemyMap[enemyId];
            let distByEnemy = distanceLineWithTwoPointsAndOneDot(
                enemy.x, enemy.y,
                this.x, this.y,
                target.x, target.y
            );

            if(positiveBound(distByEnemy - this.width/2) < enemy.size){
                pushDamageEffect(enemy.x, enemy.y, this.damage);
                source.addDmgCount(this.damage);

                if(enemy.getDamage(this.damage)){
                    enemy.willDestroy();
                    gold.add(enemy.gold);
                    source.getExp(target.exp);
                    delete enemyMap[enemyId];
                }
            }
        }
    }

    draw(c){
        let elapsed = current() - this.startTime;
        let rate = 1 - (elapsed / this.liveTime);

        if(elapsed > this.liveTime){
            this.willDestroy();
        }

        c.fillStyle = `rgba(255, 255, 0, ${rate})`;
        let deg = Math.atan2(this.destY - this.y, this.destX - this.x);

        c.translate(this.x, this.y);
        c.rotate(deg);
        c.fillRect(0, -this.width/2, 500000, this.width);
        c.rotate(-deg);
        c.translate(-this.x, -this.y);
    }

    willDestroy(){
        delete laserMap[this.id];
    }
}
class Enemy{
    constructor(level){
        this.maxHp = 200 + 100 * level;
        this.hp = new FlexibleValue(this.maxHp);
        this.armor = 0;
        this.moveSpeed = 50;

        this.initialized = false;
        this.commandable = true;

        this.gold = 10 + 1 * level;
        this.exp = 50 + 0.5 * level;

        this.x = -9999;
        this.y = -9999;
        this.size = 15;

        this.id = new Date().getTime() + "#" + parseInt(Math.random() * 10000);
        this.genTime = new Date().getTime();
        this.moveFunc = null;

        this.died = false;
    }

    init = (x, y, moveFunc) => {
        this.x = x;
        this.y = y;

        this.moveFunc = moveFunc;
        this.initialized = true;

        if(this.moveThread !== null) clearInterval(this.moveThread);
        this.moveThread = setInterval(() => {
            let nextPos = this.moveFunc(this.x, this.y, this.moveSpeed, this.commandable);
            this.x = nextPos.x;
            this.y = nextPos.y;
        });
    }

    draw = (c) => {
        c.fillStyle = "green";
        c.beginPath();
        c.arc(this.x, this.y, this.size, this.size, 0, 2 * Math.PI);
        c.fill();

        c.fillStyle = "black";
        c.fillRect(this.x - 20, this.y - 25, 40, 6);

        c.fillStyle = "red";
        c.fillRect(this.x - 20, this.y - 25, 40 * (this.hp.get()/this.maxHp), 6);

        c.fillStyle = "white";
        c.textAlign = 'center';
        setFont(c, 10, false);
        c.fillText(this.hp.get(true), this.x, this.y + this.size * 0.2);
    }

    willDestroy(){
        this.died = true;
    }

    getDamage(dmg){
        this.hp.add(-dmg);
        if(this.hp.real() <= 0) return true;
        return false;
    }
}

class Boss extends Enemy{
    constructor(level){
        super(level);

        this.maxHp = 1000 + 800 * level + 200 * Math.pow(1.2, level);
        this.hp.set(this.maxHp);
    }
}
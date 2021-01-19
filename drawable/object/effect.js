class DamageEffect{
    constructor(x, y, dmg){
        this.x = x;
        this.y = y;
        this.dmg = dmg;

        this.id = getRandomId();

        this.liveTime = 500;
        this.startTime = current();
    }

    draw(c){
        let elapsed = current() - this.startTime;
        let rate = 1 - (elapsed / this.liveTime);

        if(elapsed > this.liveTime){
            this.willDestroy();
            return;
        }

        c.textAlign = "center";
        c.fillStyle = `rgba(0, 0, 0, ${rate})`;
        c.fillText(this.dmg+"", this.x, this.y - 15);
    }

    willDestroy(){
        delete damageEffectMap[this.id];
    }
}
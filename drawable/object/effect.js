class DamageEffect{
    constructor(x, y, dmg){
        this.x = x;
        this.y = y;
        this.dmg = dmg;

        this.id = getRandomId();

        this.liveTime = 500;
        this.startTime = current();
    }

    draw(c, ref){
        let elapsed = current() - this.startTime;
        let rate = 1 - (elapsed / this.liveTime);

        if(elapsed > this.liveTime){
            this.willDestroy();
            return;
        }

        let gradient = c.createLinearGradient(this.x - 20, this.y - 35, this.x - 20, this.y);
        
        gradient.addColorStop("0", `rgba(80, 250, 255, ${rate})`);
        gradient.addColorStop("1.0", `rgba(20, 20, 20, ${rate})`);

        c.fillStyle = gradient;
        c.strokeStyle = `rgba(0, 0, 0, ${rate})`;
        c.textAlign = "center";
        // c.f = `rgba(0, 0, 0, ${rate})`;
        setEBFont(c, 25);
        c.fillText(parseInt(this.dmg)+"", this.x, this.y - 15);
        c.strokeText(parseInt(this.dmg)+"", this.x, this.y - 15);
        c.textAlign = "left";
    }

    willDestroy(){
        delete damageEffectMap[this.id];
    }
}
class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class Boundary{
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    isInside(p){
        return p.x >= this.x && p.x < (this.x + this.w) && 
            p.y >= this.y && p.y < (this.y + this.h);
    }
}

class FlexibleValue{
    constructor(value, CPS = 0.99){
        this.value = this.destValue = value;
        this.CPS = CPS;
    }

    set = (value) => {
        this.destValue = value;

        if(this.flexThread !== null){
            clearInterval(this.flexThread);
        }

        this.flexThread = setInterval(() => {
            this.value = (this.destValue - this.value) * getEaseFactorByTime(this.CPS) + this.value;

            if(Math.abs(this.value - this.destValue) < 0.5){
                this.value = this.destValue;
                clearInterval(this.flexThread);
            }
        });
    }

    add = (value) => {
        this.set(this.destValue + value);
    }

    real(){
        return this.destValue;
    }

    get(isInt = false){
        return isInt ? parseInt(this.value) : this.value;
    }
}

function getEaseFactorByTime(CPS){
    let retVal = 1 - Math.pow(1 - CPS, renderPeriod / 1000);
    return retVal > 1 ? 1 : retVal;
}

function getRandomId(){
    return new Date().getTime() + "#" + parseInt(Math.random()*10000000);
}

function distance_(x1, y1, x2, y2){
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function current(){
    return new Date().getTime();
}

function radToDeg(rad){
    return rad * Math.PI / 180
}

function distanceLineWithTwoPointsAndOneDot(xa, ya, x1, y1, x2, y2){
    return Math.abs((x2 - x1) * (y1 - ya) - (x1 - xa) * (y2 - y1)) / distance_(x1, y1, x2, y2);
}

function positiveBound(val){
    return val > 0 ? val : 0;
}

function setFont(c, size, bold=false){
    c.font = `${parseInt(size)}px ${bold ? "RubikBold" : "Rubik"}`;
}

function setEBFont(c, size){
    c.font = `${parseInt(size)}px RubikEB`;
}
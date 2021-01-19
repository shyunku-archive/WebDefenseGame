let canvas = null;
let map = null;

const gold = new FlexibleValue(120, 0.995);

const turretArrangeHelper = new TurretArrangeHelper();

let enemyMap = {};

// Layers
let bulletMap = {};
let laserMap = {};

let damageEffectMap = {};

let waveNum = 1;
let nextWaveTime = 0;

let holdingItem = "";
let holdingTurret = null;

$(() => {
    canvas = new Canvas('game');
    map = new TileMap();

    canvas.render(c => {
        c.font = "15px Verdana";
        map.draw(c);

        for(let enemyId in enemyMap){
            let enemy = enemyMap[enemyId];
            enemy.draw(c);
        }

        for(let bulletId in bulletMap){
            let bullet = bulletMap[bulletId];
            bullet.draw(c);
        }

        for(let laserId in laserMap){
            let laser = laserMap[laserId];
            laser.draw(c);
        }

        for(let effectId in damageEffectMap){
            damageEffectMap[effectId].draw(c);
        }

        turretArrangeHelper.draw(c);
    });

    wave();

    setInterval(() => {
        $('#gold').html(`${gold.get(true)} Gold`);
    });

    setInterval(() => {
        // gold.add(10);
    }, 5000);

    $('.turret-item').mousedown(function(e){
        holdingItem = $(this).attr('value');

        switch(holdingItem){
            case 'red': holdingTurret = new RedTower(); break;
            case 'orange': holdingTurret = new OrangeTower(); break;
            case 'yellow': holdingTurret = new YellowTower(); break;
        }
    });

    $(window).mouseup(function(e){
        holdingItem = "";
        holdingTurret = null;
    });

    $('#game').mouseup(function(e){
        if(holdingTurret){
            if(holdingTurret.gold > gold.real()){
                return;
            }
            gold.add(-holdingTurret.gold);
            map.installOnHovered(holdingTurret);
        }else{
            console.log("turret not found");
        }
    });
});

function wave(){
    let nextWaveTimeGap = 1000 * 25;
    nextWaveTime = new Date().getTime() + nextWaveTimeGap;

    makeEnemyProcess(15);
    setTimeout(wave, nextWaveTimeGap);
}

function makeEnemyProcess(iterate){
    if(iterate === 0) return;

    createEnemy();

    setTimeout(() => {makeEnemyProcess(iterate - 1);}, 600);
}

function createEnemy(){
    let enemy = new Enemy();
    let startTile = map.tileMap[0][0];

    enemy.init(startTile.x, startTile.y, (x, y, speed, commandable) => {
        let tileCoordinate = map.tileCoord(x, y);
        let moveDirection = map.moveDirection(x, y, tileCoordinate.i, tileCoordinate.j);

        x += moveDirection.x * speed * renderPeriod / 1000;
        y += moveDirection.y * speed * renderPeriod / 1000;

        return {x: x, y: y};
    });
    enemyMap[enemy.id] = enemy;
}

function deleteEnemy(id){
    delete enemyMap[id];
}

function positiveBound(val){
    return val > 0 ? val : 0;
}

function pushDamageEffect(x, y, damage){
    let effect = new DamageEffect(x, y, damage);
    damageEffectMap[effect.id] = effect;
}
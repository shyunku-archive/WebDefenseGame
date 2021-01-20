let canvas = null;
let map = null;

const gold = new FlexibleValue(120, 0.995);

const turretArrangeHelper = new TurretArrangeHelper();

let enemyMap = {};

// Layers
let bulletMap = {};
let laserMap = {};

let damageEffectMap = {};

// wave
let waveNum = 0;
let nextWaveTime = 0;
let nextWaveTimeGap = 1000 * 30;

let holdingItem = "";
let holdingTurret = null;

let selectedObject = null;

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

    const objectDetail = $('#object_detail');

    for(let child of objectDetail.children()){
        $(child).hide();
    }

    wave();

    setInterval(() => {
        $('#gold').html(`${gold.get(true)} Gold`);
        $('#wave_num').html(`Wave ${waveNum}`);
        $('#remain_time').html(`${parseInt((nextWaveTime - current())/1000)} sec`);
        $('#remain_percent').css({width: `${100 * (nextWaveTime - current())/nextWaveTimeGap}%`});
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

    let detailDisplayThread = null;

    $('#game').mouseup(function(e){
        if(holdingTurret){
            if(holdingTurret.gold > gold.real()){
                return;
            }

            if(map.installOnHovered(holdingTurret)){
                gold.add(-holdingTurret.gold);
            }
        }else{
            if(holdingItem.length > 0){
                console.log("turret not found");
            }else{
                let selectedTurretInfo = map.getTurretInfo();
                if(selectedTurretInfo.turret){
                    selectedObject = selectedTurretInfo.turret;

                    if(detailDisplayThread !== null){
                        clearInterval(detailDisplayThread);
                    }
                    
                    detailDisplayThread = setInterval(() => {
                        $('#object_detail .name').html(`${selectedObject.representiveColor} Tower`);
                        $('#object_detail .object-image').css({background: `${selectedObject.representiveColor}`});
                        $('#tower_level').html(selectedObject.level);
                        $('#att_power').html(selectedObject.attackPower);
                        $('#att_speed').html(selectedObject.attackSpeed);
                        $('#att_range').html(selectedObject.range);

                        $('#exp_state').html(`${selectedObject.exp.get(true)}/${selectedObject.maxExp}`);
                        $('#damage_amount').html(selectedObject.dmgCounter.get(true));
                    });

                    for(let child of objectDetail.children()){
                        $(child).show();
                    }
                }else{
                    selectedObject = null;
                    for(let child of objectDetail.children()){
                        $(child).hide();
                    }

                    if(detailDisplayThread !== null){
                        clearInterval(detailDisplayThread);
                    }
                }
            }
        }
    });
});

function wave(){
    waveNum++;
    nextWaveTime = new Date().getTime() + nextWaveTimeGap;

    makeEnemyProcess(12, waveNum);
    setTimeout(wave, nextWaveTimeGap);
}

function makeEnemyProcess(iterate, level){
    if(iterate === 0) return;

    createEnemy(level);

    setTimeout(() => {makeEnemyProcess(iterate - 1, level);}, 600);
}

function createEnemy(level){
    let enemy = new Enemy(level);
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

function pushDamageEffect(x, y, damage){
    let effect = new DamageEffect(x, y, damage);
    damageEffectMap[effect.id] = effect;
}
class Robot {
    constructor(name, hp, power) {
        this.name = name;
        this.hp = hp;
        this.power = power;
        this.usedUlt = false;
    }
}

const robotUI = [
    {
        name: document.getElementsByClassName('robot-name')[0],
        health: document.getElementsByClassName('robot-health')[0],
        power: document.getElementsByClassName('robot-attack-power')[0],
        img: document.getElementsByClassName('robot-img')[0]
    },
    {
        name: document.getElementsByClassName('robot-name')[1],
        health: document.getElementsByClassName('robot-health')[1],
        power: document.getElementsByClassName('robot-attack-power')[1],
        img: document.getElementsByClassName('robot-img')[1]
    }
];


var started = false;
var timeout = 0;
var timer = null;
var fightCd = 3;

var robot1 = null;
var robot2 = null;


var lastHit = document.getElementsByClassName('last-attack')[0];
var button = document.getElementsByClassName('fight-start')[0];

function createRobot(name) {
    const power = Math.floor(Math.random() * 16) + 5;
    return new Robot(name, 100, power)
}

function updateRobotUI(index, robot) {
    robotUI[index].name.innerHTML = robot.name;
    robotUI[index].health.innerHTML = robot.hp;
    robotUI[index].power.innerHTML = robot.power;
    robotUI[index].name.style.color = index === 0 ? 'blue' : 'red';
    robotUI[index].health.style.color = 'green';
    robotUI[index].power.style.color = 'red';
}

function roll(chance) {
    var random = Math.floor(Math.random() * 100)+1;
    if(random <= chance) {
        return true;
    }
    return false;
}

function randomizer(a, b) {
    var random = Math.floor(Math.random() * b) + a;
    return random;
}



function fight() {
    if(!started) {
        started = true

        robot1 = createRobot('Blue');
        robot2 = createRobot('Red');

        robot1.usedUlt = false;
        robot2.usedUlt = false;
        
        updateRobotUI(0, robot1);
        updateRobotUI(1, robot2);

    } else {
        randStart = Math.floor(Math.random() * 2) + 1;
        if (randomizer(1, 2) === 1) {
            robotAttack(robot1, robot2, 0, 1);
        } else {
            robotAttack(robot2, robot1, 1, 0);
        }
        if (robot1.hp <= 0) {
            gameEnd(1, 0);
        } else if(robot2.hp <= 0) {
            gameEnd(0, 1);
        }
    }
}

function gameEnd(win, lose) {
    started = false;
    button.disabled = true;
    button.innerHTML = "0";

    const winColor = win === 0 ? 'blue' : 'red';
    const winName = win === 0 ? robot1.name : robot2.name;

    robotUI[lose].health.innerHTML = 0;
    lastHit.innerHTML = `<span style='color: ${winColor}'>${winName}</span> <span style='color: green'>VICTORY!</span>`;
    timer = setInterval(chill, 1000);
}


function chill() {
    if(timeout < fightCd) {
    timeout++;
    button.innerHTML = timeout;
    } else{
        timeout = 0;
        clearInterval(timer);
        button.innerHTML = "FIGHT!";
        button.disabled = false;
    }
}

function robotAttack(attacker, defender, attackerIndex, defenderIndex) {
    const attackerColor = attackerIndex === 0 ? 'blue' : 'red';
    const defenderColor = defenderIndex === 0 ? 'blue' : 'red';

    const attackerImg = $('.robot-img').eq(attackerIndex);
    const defenderHealthElem = document.getElementsByClassName('robot-health')[defenderIndex];
    const attackerHealthElem = document.getElementsByClassName('robot-health')[attackerIndex];

    // Ульта
    if (roll(10) && !attacker.usedUlt) {
        attacker.usedUlt = true;

        const damage = attacker.power * 3;
        defender.hp -= damage;

        // Если это робот 2 (Red), он еще и хилится
        if (attackerIndex === 1) {
            attacker.hp += 30;
            if (attacker.hp > 100) attacker.hp = 100;
        }

        lastHit.innerHTML = `<span style='color: ${attackerColor};'>${attacker.name}</span> <span style='color: #1D0F0F;'>УЛЬТАНУЛ</span> нанеся <span style='color: ${defenderColor};'>${defender.name}</span> <span style='color: rgb(174, 17, 236);'>${damage}</span> урона!` + 
            (attackerIndex === 1 ? ` И исцелил себя на <span style='color: #778D45;'>30 хп</span>!` : '');

        defenderHealthElem.innerHTML = defender.hp;
        attackerHealthElem.innerHTML = attacker.hp;
        $('.text').effect('highlight', { color: '#fff' }, 500);
        $('.robot-img').eq(defenderIndex).effect('shake', { times: 3, distance: 5 }, 300);
        return;
    }

    // Промах
    if (roll(20)) {
        lastHit.innerHTML = `<span style='color: ${attackerColor};'>${attacker.name}</span> ПРОМАХНУЛСЯ при ударе <span style='color: ${defenderColor};'>${defender.name}</span>`;
        return;
    }

    // Крит
    if (roll(35)) {
        const damage = attacker.power * 2;
        defender.hp -= damage;
        defenderHealthElem.innerHTML = defender.hp;
        lastHit.innerHTML = `<span style='color: ${attackerColor};'>${attacker.name}</span> кританул по <span style='color: ${defenderColor};'>${defender.name}</span> на <span style='color: rgb(174, 17, 236);'>${damage}</span> урона!`;
        attackerImg.effect('shake', { times: 3, distance: 5 }, 300);
        return;
    }

    // Обычный удар
    const damage = attacker.power;
    defender.hp -= damage;
    defenderHealthElem.innerHTML = defender.hp;
    lastHit.innerHTML = `<span style='color: ${attackerColor};'>${attacker.name}</span> ударил <span style='color: ${defenderColor};'>${defender.name}</span> на <span style='color: #2A3759;'>${damage}</span> урона!`;
    $('.robot-img').eq(defenderIndex).effect('shake', { times: 3, distance: 5 }, 300);
}
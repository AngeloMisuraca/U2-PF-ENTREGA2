const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const musicaCiudad = new Audio('./audio/citySound.mp3');
musicaCiudad.loop = true;
musicaCiudad.volume = 0.4;

const musicaBatalla = new Audio('./audio/battleSound.mp3');
musicaBatalla.loop = true;
musicaBatalla.volume = 0.4;

const sfx = {
    click: new Audio('./audio/clickSound.mp3'),
    rayo: new Audio('./audio/thunderSound.mp3'),
    golpe: new Audio('./audio/hitSound.mp3')
};

let audioIniciado = false;
canvas.width = 1024;
canvas.height = 595;

const collisionMap = [];
for (let i = 0; i < collisions.length; i += 70) {
    collisionMap.push(collisions.slice(i, 70 + i));
}

const battleZoneMap = [];
for (let i = 0; i < battle.length; i += 70) {
    battleZoneMap.push(battle.slice(i, 70 + i));
}

const limites = [];
const desplazamiento = {
    x: -640,
    y: -500
}

collisionMap.forEach((row, i) => {
    row.forEach((simbolo, j) => {
        if (simbolo === 1025) {
            limites.push(new Limite({
                posicion: {
                    x: j * Limite.width + desplazamiento.x,
                    y: i * Limite.height + desplazamiento.y,
                }
            }))
        }
    })
})

const battleZones = [];

battleZoneMap.forEach((row, i) => {
    row.forEach((simbolo, j) => {
        if (simbolo === 1025) {
            battleZones.push(new Limite({
                posicion: {
                    x: j * Limite.width + desplazamiento.x,
                    y: i * Limite.height + desplazamiento.y,
                }
            }))
        }
    })
})

const image = new Image();
image.src = './img/pokemon style game map.png'

const foregroundImage = new Image();
foregroundImage.src = './img/foreground.png'

const playerImgUp = new Image();
playerImgUp.src = './img/MaximoUp.png'

const playerImgDown = new Image();
playerImgDown.src = './img/MaximoDown.png'

const playerImgLeft = new Image();
playerImgLeft.src = './img/MaximoLeft.png'

const playerImgRigth = new Image();
playerImgRigth.src = './img/MaximoRigth.png'


const jugador = new Sprite({
    posicion: {
        x: canvas.width / 2 - 256 / 4,
        y: canvas.height / 2 - 56 / 2,
    },
    image: playerImgDown,
    frames: {
        max: 4
    },
    sprites: {
        arriba: playerImgUp,
        abajo: playerImgDown,
        izquierda: playerImgLeft,
        derecha: playerImgRigth,
    }
})

const fondo = new Sprite({
    posicion: {
        x: desplazamiento.x,
        y: desplazamiento.y
    },
    image: image
});

const foreground = new Sprite({
    posicion: {
        x: desplazamiento.x,
        y: desplazamiento.y
    },
    image: foregroundImage
});

const keys = {
    ArrowUp: {
        presionada: false
    },
    ArrowLeft: {
        presionada: false
    },
    ArrowDown: {
        presionada: false
    },
    ArrowRight: {
        presionada: false
    }
}
let battleAnimationID;

let ultimaKey = "";

const simboloMovible = [fondo, ...limites, foreground, ...battleZones]

function colisionRectangular({ rectangulo1, rectangulo2 }) {
    return (
        rectangulo1.posicion.x + rectangulo1.width >= rectangulo2.posicion.x && rectangulo1.posicion.x <= rectangulo2.posicion.x + rectangulo2.width && rectangulo1.posicion.y <= rectangulo2.posicion.y + rectangulo2.height && rectangulo1.posicion.y + rectangulo1.height >= rectangulo2.posicion.y
    )
}

const battleActivo = {
    initiated: false
}
let battleCooldown = false;


function animate() {
    const animationID = window.requestAnimationFrame(animate);
    fondo.draw();
    limites.forEach(limite => {
        limite.draw()
    })
    battleZones.forEach((battleZone) => {
        battleZone.draw()
    })
    jugador.draw();
    foreground.draw()

    let moving = true;
    jugador.animate = false;

    if (battleActivo.initiated) return

    if (keys.ArrowUp.presionada || keys.ArrowDown.presionada || keys.ArrowLeft.presionada || keys.ArrowRight.presionada) {
        for (let i = 0; i < battleZones.length; i++) {
            const battlezone = battleZones[i];

            if (colisionRectangular({
                rectangulo1: jugador,
                rectangulo2: battlezone
            }) && Math.random() < 0.001
            ) {
                window.cancelAnimationFrame(animationID)

                musicaCiudad.pause();
                musicaBatalla.currentTime = 10;
                musicaBatalla.play();

                battleActivo.initiated = true

                pikachu.health = 100;
                charmander.health = 100;
                document.querySelector('#HP_jugador .hp-fill').style.width = '100%';
                document.querySelector('#HP_rival .hp-fill').style.width = '100%';

                gsap.set(pikachu, { opacity: 1 });
                gsap.set(charmander, { opacity: 1 });
                gsap.set(pikachu.posicion, { x: 380, y: 490 });
                gsap.set(charmander.posicion, { x: 788, y: 140 });

                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.5,
                    onComplete() {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.5,
                            onComplete() {
                                document.querySelector('.battle-ui').style.display = 'block';
                                document.querySelector('.footer').style.display = 'grid';
                                document.querySelector('#dialogoBox').style.display = 'none';

                                animateBattle();

                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.5
                                })
                            }
                        })
                    }
                })
                break;
            }
        }
    }

    if (keys.ArrowUp.presionada && ultimaKey === "ArrowUp") {
        jugador.animate = true
        jugador.image = jugador.sprites.arriba
        for (let i = 0; i < limites.length; i++) {
            const limite = limites[i];
            if (colisionRectangular({ rectangulo1: jugador, rectangulo2: { ...limite, posicion: { x: limite.posicion.x, y: limite.posicion.y + 3 } } })) {
                moving = false; break;
            }
        }
        if (moving) simboloMovible.forEach(Movibles => { Movibles.posicion.y += 3 })
    }
    else if (keys.ArrowDown.presionada && ultimaKey == "ArrowDown") {
        jugador.animate = true
        jugador.image = jugador.sprites.abajo
        for (let i = 0; i < limites.length; i++) {
            const limite = limites[i];
            if (colisionRectangular({ rectangulo1: jugador, rectangulo2: { ...limite, posicion: { x: limite.posicion.x, y: limite.posicion.y - 3 } } })) {
                moving = false; break;
            }
        }
        if (moving) simboloMovible.forEach(Movibles => { Movibles.posicion.y -= 3 })
    }
    else if (keys.ArrowLeft.presionada && ultimaKey == "ArrowLeft") {
        jugador.animate = true
        jugador.image = jugador.sprites.izquierda
        for (let i = 0; i < limites.length; i++) {
            const limite = limites[i];
            if (colisionRectangular({ rectangulo1: jugador, rectangulo2: { ...limite, posicion: { x: limite.posicion.x + 3, y: limite.posicion.y } } })) {
                moving = false; break;
            }
        }
        if (moving) simboloMovible.forEach(Movibles => { Movibles.posicion.x += 3 })
    }
    else if (keys.ArrowRight.presionada && ultimaKey == "ArrowRight") {
        jugador.animate = true
        jugador.image = jugador.sprites.derecha
        for (let i = 0; i < limites.length; i++) {
            const limite = limites[i];
            if (colisionRectangular({ rectangulo1: jugador, rectangulo2: { ...limite, posicion: { x: limite.posicion.x - 3, y: limite.posicion.y } } })) {
                moving = false; break;
            }
        }
        if (moving) simboloMovible.forEach(Movibles => { Movibles.posicion.x -= 3 })
    }
}

animate();

const battleBackgoundImage = new Image();
battleBackgoundImage.src = './img/battleBackground.png';
const battleBackground = new Sprite({
    posicion: {
        x: 0,
        y: 0,
    },
    image: battleBackgoundImage,
    scale: 0.8
});

const charmanderImage = new Image();
charmanderImage.src = './img/charmander.png';


const charmander = new Sprite({
    posicion: {
        x: 788,
        y: 140,
    },
    image: charmanderImage,
    frames: {
        max: 5,
    },
    animate: true,
    isEnemy: true,
    name: 'Charmander',
    scale: 2.5

});

const pikachuImage = new Image();
pikachuImage.src = './img/pikachu.png';


const pikachu = new Sprite({
    posicion: {
        x: 380,
        y: 490,
    },
    image: pikachuImage,
    frames: {
        max: 4,
    },
    animate: true,
    name: 'Pikachu',
    scale: -0.5

});

const renderSprites = [];

function animateBattle() {
    battleAnimationID = window.requestAnimationFrame(animateBattle); 
    battleBackground.draw();
    charmander.draw();
    pikachu.draw();

    renderSprites.forEach((Sprite) => {
        Sprite.draw();
    });
}

document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {

        if (!battleActivo.initiated) return;

        const attackKey = e.currentTarget.innerHTML.trim();
        const selectedattack = tackles[attackKey];

        if (selectedattack) {
            pikachu.attack({
                attack: selectedattack,
                recipient: charmander,
                renderSprites,

            });
        }

        if (charmander.health <= 0) {
            charmander.faint();
        }

        if (pikachu.health <= 0) {
            pikachu.faint();
        }
    });
});

document.querySelector('#dialogoBox').addEventListener('click', (event) => {
    event.currentTarget.style.display = 'none';
})

function finalizarCombate() {

    window.cancelAnimationFrame(battleAnimationID);

    musicaBatalla.pause();
    musicaCiudad.play();

    document.querySelector('.battle-ui').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    document.querySelector('#dialogoBox').style.display = 'none';

    battleActivo.initiated = false;

    animate();
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.ArrowUp.presionada = true;
            ultimaKey = "ArrowUp"
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.presionada = true;
            ultimaKey = "ArrowLeft"
            break;
        case 'ArrowDown':
            keys.ArrowDown.presionada = true;
            ultimaKey = "ArrowDown"
            break;
        case 'ArrowRight':
            keys.ArrowRight.presionada = true;
            ultimaKey = "ArrowRight"
            break;
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            keys.ArrowUp.presionada = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.presionada = false;
            break;
        case 'ArrowDown':
            keys.ArrowDown.presionada = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.presionada = false;
            break;
    }
})

document.querySelector('.battle-ui').style.display = 'none';
document.querySelector('.footer').style.display = 'none';
document.querySelector('#dialogoBox').style.display = 'none';

window.addEventListener('keydown', (e) => {
    if (!audioIniciado &&
        (e.key === 'ArrowUp' || e.key === 'ArrowDown' ||
            e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        musicaCiudad.play();
        audioIniciado = true;
    }
});

document.querySelectorAll('.footer button').forEach(button => {
    button.addEventListener('click', () => {
        sfx.click.currentTime = 0;
        sfx.click.play();
    });
});
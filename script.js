const canvas = document.querySelector('canvas');

const contexto = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionMap = [];
for (let i = 0; i < collisions.length; i += 70) {
    collisionMap.push(collisions.slice(i, 70 + i));
}
const desplazamiento = {
    x: -600,
    y: -500
} 

class Limite {
    static width = 48
    static height = 48

    constructor({ posicion }) {
        this.posicion = posicion;
        this.width = 48;
        this.height = 48;
    }

    draw() {
        contexto.fillStyle = 'red'
        contexto.fillRect(this.posicion.x, this.posicion.y, this.width, this.height)
    }
}
const limites = [];

// for (let i = 0; i < collisionMap.length; i++) {
//     const row = collisionMap[i];
//     for (let j = 0; j < row.length; j++) {
//         const simbolo = row[j];
//         if (simbolo === 1025) {
//             limites.push(new limite({
//                 posicion: {
//                     x: i * limite.width + desplazamiento.x,
//                     y: i * limite.height + desplazamiento.y,
//                 }
//             }));
//         }
//     }
// }

collisionMap.forEach((row, i) => {
    row.forEach((simbolo, j) => {
        if (simbolo === 1025) {
            limites.push(new Limite({
                posicion: {
                    x: j * Limite.width,
                    y: i * Limite.height,
                }
            }))
        }
    })
})

const image = new Image();
image.src = './img/pokemon style game map.png'

const playerImg = new Image();
playerImg.src = './img/MaximoDown.png'

class Sprite {
    constructor({ posicion, velocidad, image }) {
        this.posicion = posicion;
        this.image = image;
        // this.velocidad = velocidad
    }

    draw() {
        if (!this.image.complete) return;
        contexto.drawImage(this.image, this.posicion.x, this.posicion.y);
    }
}

const fondo = new Sprite({
    posicion: {
        x: -600,
        y: -500
    },
    image: image
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

let ultimaKey = "";

function animate() {
    window.requestAnimationFrame(animate);
    // contexto.clearRect(0, 0, canvas.width, canvas.height);
    fondo.draw();


    limites.forEach(limite => {
        limite.draw();
    })

    contexto.drawImage(
        playerImg,
        0,
        0,
        playerImg.width / 4,
        playerImg.height,
        canvas.width / 2 - playerImg.width / 3,
        canvas.height / 2 - playerImg.height / 2,
        playerImg.width / 4,
        playerImg.height
    );

    if (keys.ArrowUp.presionada && ultimaKey == "ArrowUp") {
        fondo.posicion.y = fondo.posicion.y + 3
    }
    else if (keys.ArrowDown.presionada && ultimaKey == "ArrowDown") {
        fondo.posicion.y = fondo.posicion.y - 3
    }
    else if (keys.ArrowLeft.presionada && ultimaKey == "ArrowLeft") {
        fondo.posicion.x = fondo.posicion.x + 3
    }
    else if (keys.ArrowRight.presionada && ultimaKey == "ArrowRight") {
        fondo.posicion.x = fondo.posicion.x - 3
    }
}

animate();



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

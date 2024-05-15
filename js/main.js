const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;

        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
    }

    draw(context) {
        context.beginPath();

        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);

        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);

        if ((this.posX + this.radius) > window_width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx;
        }

        if ((this.posY - this.radius) < 0 || (this.posY + this.radius) > window_height) {
            this.dy = -this.dy;
        }

        this.posX += this.dx;
        this.posY += this.dy;
    }
}

function getDistance(posX1, posY1, posX2, posY2) {
    let result = Math.sqrt(Math.pow((posX2 - posX1), 2) + Math.pow((posY2 - posY1), 2));
    return result;
}

let miCirculos = [];

for (let i = 0; i < 10; i++) {
    let randomRadius = Math.floor(Math.random() * 100 + 30);
    let randomX = Math.random() * (window_width - 2 * randomRadius) + randomRadius;
    let randomY = Math.random() * (window_height - 2 * randomRadius) + randomRadius;

    // Comprobamos si el nuevo círculo se superpone con los círculos existentes
    let overlapping = false;
    for (let j = 0; j < miCirculos.length; j++) {
        let distance = getDistance(randomX, randomY, miCirculos[j].posX, miCirculos[j].posY);
        if (distance < randomRadius + miCirculos[j].radius) {
            overlapping = true;
            break;
        }
    }

    // Si el nuevo círculo no se superpone con ningún otro, lo agregamos
    if (!overlapping) {
        let miCirculo = new Circle(randomX, randomY, randomRadius, "blue", (i + 1).toString(), 3);
        miCirculos.push(miCirculo);
    }
}

miCirculos.forEach(circulo => circulo.draw(ctx));

let updateCircles = function () {
    requestAnimationFrame(updateCircles);
    ctx.clearRect(0, 0, window_width, window_height);
    miCirculos.forEach(circulo => circulo.update(ctx));

    for (let i = 0; i < miCirculos.length; i++) {
        for (let j = i + 1; j < miCirculos.length; j++) {
            if (getDistance(miCirculos[i].posX, miCirculos[i].posY, miCirculos[j].posX, miCirculos[j].posY) < (miCirculos[i].radius + miCirculos[j].radius)) {
                // Cambia el color de los círculos a un color aleatorio cuando colisionan
                miCirculos[i].color = getRandomColor();
                miCirculos[j].color = getRandomColor();
                // Realiza el rebote entre los círculos cuando colisionan
                let tempDx = miCirculos[i].dx;
                let tempDy = miCirculos[i].dy;
                miCirculos[i].dx = miCirculos[j].dx;
                miCirculos[i].dy = miCirculos[j].dy;
                miCirculos[j].dx = tempDx;
                miCirculos[j].dy = tempDy;
            }
        }
    }

    miCirculos.forEach(circulo => circulo.draw(ctx));
};

updateCircles();

// Función para obtener un color aleatorio en formato hexadecimal
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

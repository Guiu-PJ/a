// Variables y constantes globales
const options = ["Cosa 1", "Cosa 2", "Cosa 3", "Cosa 4", "Cosa 5", "Cosa 6", "Cosa 7", "Cosa 8", "Cosa 9"];
let startAngle = 0;
const arc = Math.PI / (options.length / 2);
let spinTimeout = null;

let spinAngleStart = 0;  // Ángulo de inicio del giro
let spinTime = 0;        // Tiempo de giro actual
let spinTimeTotal = 0;   // Tiempo total de giro

let ctx; // Contexto de dibujo para el canvas

// Colores RGB
let red = 0;
let green = 0;
let blue = 0;

// Evento para iniciar la ruleta al hacer clic en el botón
document.getElementById("spin").addEventListener("click", spin);

// Funciones para manejo de color y dibujo
function byte2Hex(n) {
    const nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
}

function RGB2Color(r, g, b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
    const phase = 0;
    const center = 128;
    const width = 127;
    const frequency = Math.PI * 2 / maxitem;

    red = Math.sin(frequency * item + 2 + phase) * width + center;
    green = Math.sin(frequency * item + 0 + phase) * width + center;
    blue = Math.sin(frequency * item + 4 + phase) * width + center;

    return RGB2Color(red, green, blue);
}

function drawRouletteWheel() {
    const canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        const outsideRadius = 200;
        const textRadius = 160;
        const insideRadius = 125;

        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 500, 500);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.font = 'bold 14px Helvetica, Arial';

        for (let i = 0; i < options.length; i++) {
            const angle = startAngle + i * arc;
            ctx.fillStyle = getColor(i, options.length);

            // Dibuja cada sección de la ruleta
            ctx.beginPath();
            ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
            ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            // Configuración de texto
            ctx.save();
            ctx.fillStyle = "black";
            ctx.translate(
                250 + Math.cos(angle + arc / 2) * textRadius,
                250 + Math.sin(angle + arc / 2) * textRadius
            );
            ctx.rotate(angle + arc / 2 + Math.PI / 2);

            // Divide texto en líneas si es largo
            const text = options[i];
            const maxWidth = 50;
            const words = text.split(" ");
            let line = "";
            const lines = [];

            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + " ";
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && n > 0) {
                    lines.push(line);
                    line = words[n] + " ";
                } else {
                    line = testLine;
                }
            }
            lines.push(line);

            // Dibuja texto centrado en varias líneas
            for (let j = 0; j < lines.length; j++) {
                ctx.fillText(lines[j], -ctx.measureText(lines[j]).width / 2, j * 15);
            }

            ctx.restore();
        }

        // Dibuja la flecha
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250, 250 - (outsideRadius - 13));
        ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.fill();
    }
}

function spin() {
    spinAngleStart = Math.random() * 10 + 15;  // Define el ángulo inicial de giro
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 8 * 1000;  // Tiempo total de giro
    rotateWheel();
}

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = arc * 180 / Math.PI;
    const index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 30px Helvetica, Arial';
    const text = options[index];
    ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
    ctx.restore();
}

function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

drawRouletteWheel();

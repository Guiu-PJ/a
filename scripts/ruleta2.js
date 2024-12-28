// Variables y constantes globales
const options = [
    ["Reparteix 5 tragos", "Reparteix 5 tragos"],
    ["Reparteix 10 tragos", "Reparteix 10 tragos"],
    ["Reparteix un xupito", "Reparteix un xupito"],
    ["Beu 5 tragos", "Beu 5 tragos"],
    ["Beu 10 tragos", "Beu 10 tragos"],
    ["Beu un xupito", "Beu un xupito"],
    ["Mai casa", "Tots els que mai han ficat casa xupito o 3 tragos"],
    ["Xupito doble", "Beveu un xupito encreuant el braç amb la persona de la teva dreta"],

];

const arc = Math.PI / (options.length / 2);
let spinTimeout = null;

let spinAngleStart = 0;  // Ángulo de inicio del giro
let spinTime = 0;        // Tiempo de giro actual
let spinTimeTotal = 0;   // Tiempo total de giro

let startAngle = 0;     // Ángulo inicial de la ruleta
let ctx;                // Contexto de dibujo para el canvas

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

            // Texto a mostrar en las casillas (posici�n 0 del sub-array)
            const text = options[i][0];
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

    // Guardamos el contexto y dibujamos el mensaje en el centro
    ctx.save();
    ctx.font = 'bold 20px Helvetica, Arial';

    // Obtenemos el texto de la posici�n 1 del sub-array
    const text = options[index][1];

    // Configuraci�n del fondo detr�s del mensaje
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    const padding = 10;
    const maxTextWidth = canvas.width * 0.6; // M�ximo ancho de texto basado en el tama�o del canvas

    // Dividir el texto en l�neas en funci�n del ancho m�ximo permitido
    const words = text.split(" ");
    let line = "";
    const lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxTextWidth && line.length > 0) {
            lines.push(line);
            line = words[n] + " ";
        } else {
            line = testLine;
        }
    }
    lines.push(line); // A�adir la �ltima l�nea

    // Calcular la altura total del texto y dibujar el fondo en el centro
    const lineHeight = 24;
    const textHeight = lines.length * lineHeight;
    ctx.fillRect(250 - maxTextWidth / 2 - padding, 250 - textHeight / 2 - padding, maxTextWidth + padding * 2, textHeight + padding * 2);

    // Dibujar cada l�nea de texto centrada
    ctx.fillStyle = "black";
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 250 - ctx.measureText(lines[i]).width / 2, 250 - textHeight / 2 + i * lineHeight + 10);
    }

    ctx.restore();
}

function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

drawRouletteWheel();

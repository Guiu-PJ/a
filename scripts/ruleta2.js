// Variables y constantes globales
const options = [
    "Quan ha sigut l’últim cop que has realitzat l’acte sexual?",
    "Quants cops creus t’has enamorat (de veritat) en la teva vida?",
    "A quantes persones (+-) has conegut i se t’ha passat pel cap: “Buah, a aquest/a me la tiraria”.",
    "Has dubtat mai de la teva orientació sexual?",
    "Has follat + de 10 cops en l’últim mes?",
    "Has fet mai un beso negro?",
    "T’han fet mai un beso negro?",
    "Has fet algun cop un 69?",
    "Erets més enamoradís quan erets petit/a o ara?",
    "Has utilitzat mai joguines sexuals?",
    "Creus en la media naranja?",
    "Quants cops t’han rechassat?",
    "Matar, casar i follar amb 3 persones de la sala.",
    "Fes una suposició amorosa, sexoafectiva… de qualsevol persona de la sala. L’altra beu si és veritat.",
    "Fa menys de 24h que has follat?",
    "Fa menys de 12h que has follat?",
    "Prefereixes follar o fer l’amor?",
    "Quina ha sigut la teva pitjor experiència sexual?",
    "Quina ha sigut la teva pitjor experiència amorosa?",
    "Quin és el moment que més vergonya has passat relacionada amb temes amorosos, sexoafectius…",
    "Què és el pitjor que t’ha dit o fet alguna persona de les que estaves pillat?",
    "T’ha atret sexualment alguna persona que tingués més de 3 anys més que tu?",
    "T’ha atret sexualment alguna persona que tingués més de 3 anys menys que tu?",
    "Quina és la teva fantasia sexual que encara NO has pogut complir?",
    "Quina és la teva fantasia sexual que has pogut complir?",
    "Quina és la part del cos que t’atreu més d’una persona?",
    "Quina és la part del cos menys convencional que t’atreu d’una persona?",
    "Tens algun secret sexual, amorós, sexoafectiu…? És moment de compartir-lo.",
    "Què és el més estrany que t’agradaria provar (sexualment parlant)?",
    "Què és algo que no has fet mai i que t’agradaria provar (sexualment parlant)?",
    "Com va ser la teva primera experiència sexual?",
    "Com va ser el teu primer lio?"
];

let count = 0;
const containerAnswers = document.getElementById('divRuleta2');
document.addEventListener("DOMContentLoaded", async function () {
    showDiv();
    showAnswers(0);
    
});

function showAnswers(count) {

    const questionDiv = document.createElement('div');
    questionDiv.textContent = `Pregunta ${count + 1}:\n ${options[count]}`;
    questionDiv.classList.add("bigTitle");
    containerAnswers.appendChild(questionDiv);

}


function showDiv() {
    containerAnswers.style.display = 'block';
    containerAnswers.innerHTML = '';

    // Crear contenedor fijo para los botones
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container'); // Aplica el estilo definido en CSS

    const preAnswerButton = document.createElement('button');
    preAnswerButton.textContent = "Anterior";
    preAnswerButton.addEventListener('click', () => {
        preAnswers();
    });
    buttonContainer.appendChild(preAnswerButton);

    const nextAnswerButton = document.createElement('button');
    nextAnswerButton.textContent = "Siguiente";
    nextAnswerButton.addEventListener('click', () => {
        nextAnswers();
    });
    buttonContainer.appendChild(nextAnswerButton);

    // Añadir pregunta primero
    containerAnswers.appendChild(buttonContainer); // Agregar el contenedor de botones fijo
}


function nextAnswers() {
    showDiv();
    console.log(count);
    if (count < options.length - 1) count += 1;
    showAnswers(count);
}
function preAnswers() {
    showDiv();
    if (count > 0) count -= 1;
    showAnswers(count);
}





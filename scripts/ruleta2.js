// Variables y constantes globales
const options = [
    "Reparteix 5 tragos",
    "Reparteix 10 tragos",
    "Reparteix un xupito",
    "Beu 5 tragos",
    "Beu 10 tragos",
    "Beu un xupito",
    "Tots els que mai han ficat casa xupito o 3 tragos",
    "Beveu un xupito encreuant el braç amb la persona de la teva dreta"];

let count = 0;
const containerAnswers = document.getElementById('divRuleta2');
document.addEventListener("DOMContentLoaded", async function () {
    showDiv();
    showAnswers(0);
    
});

function showAnswers(count) {

    const questionDiv = document.createElement('div');
    questionDiv.textContent = `Pregunta: ${options[count]}`;
    questionDiv.classList.add("miniTitle");
    containerAnswers.appendChild(questionDiv);

}


function showDiv() {
    containerAnswers.style.display = 'block';
    containerAnswers.innerHTML = '';

    const preAnswerButton = document.createElement('button');
    preAnswerButton.textContent = "Anterior";
    preAnswerButton.addEventListener('click', () => {
        preAnswers();
    });
    containerAnswers.appendChild(preAnswerButton);

    const nextAnswerButton = document.createElement('button');
    nextAnswerButton.textContent = "Siguiente";
    nextAnswerButton.addEventListener('click', () => {
        nextAnswers();
    });
    containerAnswers.appendChild(nextAnswerButton);

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





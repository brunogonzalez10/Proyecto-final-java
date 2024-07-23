document.addEventListener("DOMContentLoaded", () => {
    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const nextButton = document.getElementById('next-btn');

    let currentQuestionIndex = 0;
    let questions = [];

    // Función para cargar las preguntas desde el archivo JSON
    async function loadQuestions() {
        try {
            const response = await fetch('data/questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            questions = await response.json();
            showQuestion(questions[currentQuestionIndex]);
        } catch (error) {
            console.error('Error al cargar las preguntas:', error);
            if (typeof toastr !== 'undefined') {
                toastr.error('No se pudieron cargar las preguntas. Inténtalo de nuevo más tarde.');
            } else {
                console.error("toastr no está definido");
            }
        }
    }

    // Función para mostrar una pregunta
    function showQuestion(question) {
        questionElement.textContent = question.text;
        answersElement.innerHTML = '';

        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.classList.add('answer-btn');
            button.addEventListener('click', () => selectAnswer(answer));
            answersElement.appendChild(button);
        });
    }

    // Función para seleccionar una respuesta
    function selectAnswer(answer) {
        if (typeof toastr !== 'undefined') {
            if (answer.correct) {
                toastr.success('¡Correcto!');
            } else {
                toastr.error('Incorrecto. La respuesta correcta es: ' + getCorrectAnswer());
            }
        } else {
            console.error("toastr no está definido");
        }
        nextButton.style.display = 'block';
    }

    // Función para obtener la respuesta correcta
    function getCorrectAnswer() {
        return questions[currentQuestionIndex].answers.find(answer => answer.correct).text;
    }

    // Función para mostrar la siguiente pregunta
    function showNextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(questions[currentQuestionIndex]);
        } else {
            questionElement.textContent = '¡Has completado la trivia!';
            answersElement.innerHTML = '';
            nextButton.style.display = 'none';
        }
    }

    nextButton.addEventListener('click', () => {
        nextButton.style.display = 'none';
        showNextQuestion();
    });

    // Cargar las preguntas cuando se carga la página
    loadQuestions();
});

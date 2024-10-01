let currentQuestionIndex = 0;
let score = 0;
let recognitionActive = false;

const questionElement = document.getElementById('question');
const choiceA = document.getElementById('choice-a');
const choiceB = document.getElementById('choice-b');
const choiceC = document.getElementById('choice-c');
const choiceD = document.getElementById('choice-d');
const feedbackElement = document.getElementById('feedback');
const startQuizButton = document.getElementById('start-quiz');
const micButton = document.getElementById('mic-button');
const userInputDisplay = document.getElementById('user-input-display');

startQuizButton.addEventListener('click', startQuiz);
micButton.addEventListener('click', toggleMicrophone);

function startQuiz() {
    startQuizButton.style.display = 'none';
    micButton.style.display = 'inline-block';
    score = 0;
    currentQuestionIndex = 0;
    loadQuestion();
    provideInstructions();
}

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    choiceA.textContent = `A: ${currentQuestion.choices.a}`;
    choiceB.textContent = `B: ${currentQuestion.choices.b}`;
    choiceC.textContent = `C: ${currentQuestion.choices.c}`;
    choiceD.textContent = `D: ${currentQuestion.choices.d}`;
    feedbackElement.textContent = '';
}

function checkAnswer(transcript) {
    const normalizedAnswer = normalizeInput(transcript);
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;

    userInputDisplay.innerHTML += `<p>You said: "${transcript}"</p>`;

    if (normalizedAnswer === correctAnswer) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.classList.add('correct');
        score++;
    } else {
        feedbackElement.textContent = "Wrong!";
        feedbackElement.classList.add('wrong');
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        setTimeout(() => {
            loadQuestion();
        }, 1500);
    } else {
        setTimeout(() => {
            displayFinalScore();
        }, 1500);
    }
}

function displayFinalScore() {
    questionElement.textContent = "Quiz Finished!";
    choiceA.textContent = "";
    choiceB.textContent = "";
    choiceC.textContent = "";
    choiceD.textContent = "";
    feedbackElement.textContent = `Your final score is: ${score} out of ${questions.length}`;
    feedbackElement.style.color = "blue";
    recognitionActive = false; // Stop recognition
}

function normalizeInput(transcript) {
    const input = transcript.trim().toLowerCase();
    const synonyms = {
        'option a': 'a',
        'option b': 'b',
        'option c': 'c',
        'option d': 'd',
        'alpha': 'a',
        'bravo': 'b',
        'charlie': 'c',
        'delta': 'd',
        'hey': 'a',
        'bee': 'b',
        'sea': 'c',
        'see': 'c',
        'dee': 'd'
    };

    return synonyms[input] || null;
}

let recognition;

function toggleMicrophone() {
    if (recognitionActive) {
        recognition.stop();
        micButton.textContent = 'Start Mic';
        recognitionActive = false;
    } else {
        startVoiceRecognition();
        micButton.textContent = 'Stop Mic';
        recognitionActive = true;
    }
}

function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech Recognition not supported in this browser. Please use Google Chrome.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.start();

    recognition.onstart = () => {
        console.log("Voice recognition started. You can speak now.");
    };

    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript.trim().toLowerCase();
        const confidence = result[0].confidence;

        console.log(`Recognized: "${transcript}" with confidence ${confidence}`);

        if (confidence > 0.6) {
            checkAnswer(transcript);
        } else {
            feedbackElement.textContent = "I couldn't understand you clearly. Please try again.";
            feedbackElement.classList.add('unrecognized');
        }
    };

    recognition.onerror = (event) => {
        console.error("Recognition error:", event.error);
        alert("Error occurred in recognition: " + event.error);
    };
}

function provideInstructions() {
    const instructionText = "Welcome to the quiz! Please respond with A, B, C, or D.";
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(instructionText);
    synth.speak(utterThis);
}


const questions = [
    {
        question: "1. What is the capital of France?",
        choices: {
            a: "Berlin",
            b: "Madrid",
            c: "Paris",
            d: "Lisbon"
        },
        correctAnswer: "c"
    },
    {
        question: "2. Which planet is known as the Red Planet?",
        choices: {
            a: "Earth",
            b: "Mars",
            c: "Jupiter",
            d: "Saturn"
        },
        correctAnswer: "b"
    },
    {
        question: "3. What is the largest mammal?",
        choices: {
            a: "Elephant",
            b: "Giraffe",
            c: "Blue Whale",
            d: "Shark"
        },
        correctAnswer: "c"
    },
    {
        question: "4. Who wrote 'Romeo and Juliet'?",
        choices: {
            a: "Charles Dickens",
            b: "J.K. Rowling",
            c: "William Shakespeare",
            d: "Mark Twain"
        },
        correctAnswer: "c"
    },
    {
        question: "5. What is the hardest natural substance on Earth?",
        choices: {
            a: "Gold",
            b: "Iron",
            c: "Diamond",
            d: "Platinum"
        },
        correctAnswer: "c"
    },
    {
        question: "6. How many continents are there?",
        choices: {
            a: "5",
            b: "6",
            c: "7",
            d: "8"
        },
        correctAnswer: "c"
    },
    {
        question: "7. What is the square root of 64?",
        choices: {
            a: "6",
            b: "7",
            c: "8",
            d: "9"
        },
        correctAnswer: "c"
    },
    {
        question: "8. Who was the first President of the United States?",
        choices: {
            a: "George Washington",
            b: "Abraham Lincoln",
            c: "Thomas Jefferson",
            d: "John Adams"
        },
        correctAnswer: "a"
    },
    {
        question: "9. What is the chemical symbol for water?",
        choices: {
            a: "O2",
            b: "H2O",
            c: "CO2",
            d: "NaCl"
        },
        correctAnswer: "b"
    },
    {
        question: "10. How many legs does a spider have?",
        choices: {
            a: "6",
            b: "8",
            c: "10",
            d: "12"
        },
        correctAnswer: "b"
    }
];

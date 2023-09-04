const quizData = [
  {
      question: "Which language runs in a web browser?",
      a: "California",
      b: "C",
      c: "Python",
      d: "JavaScript",
      correct: "d",
      selectedAnswer: null, // Initialize selected answer as null
  },
  {
      question: "What does CSS stand for?",
      a: "Central Style Sheets",
      b: "Cascading Style Sheets",
      c: "Cascading Simple Sheets",
      d: "Cars SUVs Sailboats",
      correct: "b",
      selectedAnswer: null,
  },
  {
      question: "What does HTML stand for?",
      a: "Hypertext Markup Language",
      b: "Hypertext Markdown Language",
      c: "Hyperloop Machine Language",
      d: "Helicopters Terminals Motorboats Lamborginis",
      correct: "a",
      selectedAnswer: null,
  },
  {
      question: "What year was JavaScript launched?",
      a: "1996",
      b: "1995",
      c: "1994",
      d: "none of the above",
      correct: "b",
      selectedAnswer: null,
  },
];

const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submit');
const resultContainer = document.getElementById('result');
const flagTab = document.querySelector('.flag-tab');
const questionTabs = document.querySelectorAll('.question-tab');

let currentQuestion = 0;
let score = 0;
const flaggedQuestions = [];

flagTab.addEventListener('click', () => {
  const currentTab = questionTabs[currentQuestion];

  if (!flaggedQuestions.includes(currentQuestion)) {
      flaggedQuestions.push(currentQuestion);
      currentTab.classList.add('flagged');
  } else {
      const indexToRemove = flaggedQuestions.indexOf(currentQuestion);
      flaggedQuestions.splice(indexToRemove, 1);
      currentTab.classList.remove('flagged');
  }

  if (flaggedQuestions.includes(currentQuestion)) {
      currentTab.classList.add('flagged');
  } else {
      currentTab.classList.remove('flagged');
  }
});

function showQuestion() {
  const question = quizData[currentQuestion];
  const questionElement = document.getElementById('question');
  const answerElements = document.querySelectorAll('.answer');

  questionElement.textContent = question.question;

  const answers = Object.entries(question);
  for (let i = 0; i < answerElements.length; i++) {
    const answerElement = answerElements[i];
    const [letter, answerText] = answers[i];
    if (letter === 'question' || letter === 'correct') continue;
    answerElement.value = letter;

    // Updated the following line to set the checked property correctly
    answerElement.checked = letter === question.selectedAnswer;

    document.getElementById(letter + '_text').textContent = answerText;

    answerElement.addEventListener('change', () => {
      question.selectedAnswer = answerElement.value;
    });
  }
  updateQuestionTab();
  submitButton.style.display = currentQuestion === quizData.length - 1 ? 'block' : 'none';
}

function updateQuestionTab() {
  const questionTabs = document.querySelectorAll('.question-tab');
  questionTabs.forEach((tab, index) => {
      tab.classList.remove('active', 'flagged');
      if (index === currentQuestion) {
          tab.classList.add('active');
      }
      if (flaggedQuestions.includes(index)) {
          tab.classList.add('flagged');
      }
  });
}

function setupQuestionTabs() {
  const questionTabs = document.querySelectorAll('.question-tab');
  questionTabs.forEach(tab => {
    const questionIndex = parseInt(tab.getAttribute('data-question'));
    if (!isNaN(questionIndex)) { // Change this condition
      tab.addEventListener('click', () => {
        currentQuestion = questionIndex;
        showQuestion();
        updateQuestionTab();
      });
    } else if (tab.getAttribute('data-question') === 'flag') {
      tab.addEventListener('click', () => {
        if (!flaggedQuestions.includes(currentQuestion)) {
          flaggedQuestions.push(currentQuestion);
          tab.classList.add('flagged');
        }
      });
    }
  });
}


function checkQuizFinished() {
  if (currentQuestion === quizData.length) {
      showResults();
  }
}

function showNextQuestion() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
    const answer = selectedAnswer.value;
    const correctAnswer = quizData[currentQuestion].correct;
    if (answer === correctAnswer) {
      score++;
    }
    quizData[currentQuestion].selectedAnswer = answer; // Store the selected answer
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      showQuestion();
    } else {
      showResults();
    }
  }
}


function updateSelectedAnswer() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
      quizData[currentQuestion].selectedAnswer = selectedAnswer.value;
  }
}

submitButton.addEventListener('click', () => {
  updateSelectedAnswer();
  showResults();
});

function showResults() {
  quizContainer.style.display = 'none';
  submitButton.style.display = 'none';

  const percentage = (score / quizData.length) * 100;
  let resultText = `You answered ${score}/${quizData.length} questions correctly. `;

  if (percentage >= 70) {
      resultText += 'Congratulations, you passed!';
  } else {
      resultText += 'Sorry, you failed.';
  }

  resultContainer.textContent = resultText;
  resultContainer.style.display = 'block';
}

function setupQuiz() {
  showQuestion();
  setupQuestionTabs();
  // submitButton.addEventListener('click', showNextQuestion); // Remove this line
}

setupQuiz();

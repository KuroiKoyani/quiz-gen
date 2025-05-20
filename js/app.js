const questionNumber = document.querySelector(".question-number");
const questionText = document.querySelector(".question-text");
const optionContainer = document.querySelector(".option-container");
const answersIndicatorContainer = document.querySelector(".answers-indicator");
const homeBox = document.querySelector(".home-box");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");
const questionLimit = quiz.length;

let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableOptions = [];
let correctAnswers = 0;
let attempt = 0;
let answerStatusMap = {}; // NEW

function setAvailableQuestions() {
  const totalQuestions = quiz.length;
  for (let i = 0; i < totalQuestions; i++) {
    availableQuestions.push(quiz[i]);
  }
}

function getNewQuestion() {
  questionNumber.innerHTML =
    "Question " + (questionCounter + 1) + " of " + questionLimit;
  const questionIndex = availableQuestions[0];
  currentQuestion = questionIndex;
  questionText.innerHTML = currentQuestion.question;
  const index1 = availableQuestions.indexOf(questionIndex);
  availableQuestions.shift();
  if (currentQuestion.hasOwnProperty("img")) {
    const img = document.createElement("img");
    img.src = currentQuestion.img;
    questionText.appendChild(img);
  }
  const optionsLength = currentQuestion.options.length;
  for (let i = 0; i < optionsLength; i++) {
    availableOptions.push(i);
  }
  optionContainer.innerHTML = "";
  let animationDelay = 0.2;
  for (let i = 0; i < optionsLength; i++) {
    const optionIndex =
      availableOptions[Math.floor(Math.random() * availableOptions.length)];
    const index2 = availableOptions.indexOf(optionIndex);
    availableOptions.splice(index2, 1);
    const option = document.createElement("div");
    option.innerHTML = currentQuestion.options[optionIndex];
    option.id = option.innerHTML;
    option.style.animationDelay = animationDelay + "s";
    animationDelay = animationDelay + 0.15;
    option.className = "option";
    option.setAttribute("onclick", "getResult(this)");
    optionContainer.appendChild(option);
  }
  questionCounter++;
}

function loadQuestionByIndex(index) {
  currentQuestion = quiz[index];
  questionCounter = index + 1;
  questionText.innerHTML = currentQuestion.question;

  if (currentQuestion.hasOwnProperty("img")) {
    const img = document.createElement("img");
    img.src = currentQuestion.img;
    questionText.appendChild(img);
  }

  availableOptions = [];
  optionContainer.innerHTML = "";
  let animationDelay = 0.2;

  for (let i = 0; i < currentQuestion.options.length; i++) {
    availableOptions.push(i);
  }

  for (let i = 0; i < currentQuestion.options.length; i++) {
    const optionIndex =
      availableOptions[Math.floor(Math.random() * availableOptions.length)];
    const index2 = availableOptions.indexOf(optionIndex);
    availableOptions.splice(index2, 1);

    const option = document.createElement("div");
    option.innerHTML = currentQuestion.options[optionIndex];
    option.id = option.innerHTML;
    option.style.animationDelay = animationDelay + "s";
    animationDelay += 0.15;
    option.className = "option";
    option.setAttribute("onclick", "getResult(this)");
    optionContainer.appendChild(option);
  }

  questionNumber.innerHTML =
    "Question " + questionCounter + " of " + questionLimit;
}

function getResult(element) {
  const quizIndex = quiz.indexOf(element);
  element.classList.remove("wrong", "correct");

  if (element.innerHTML === currentQuestion.correct_answer) {
    element.classList.add("correct");
    updateAnswerIndicator("correct");
    correctAnswers++;
    answerStatusMap[questionCounter - 1] = "correct"; // TRACK STATUS
  } else {
    element.classList.add("wrong");
    updateAnswerIndicator("wrong");
    answerStatusMap[questionCounter - 1] = "wrong"; // TRACK STATUS
    const optionLength = optionContainer.children.length;
    for (let i = 0; i < optionLength; i++) {
      if (
        optionContainer.children[i].innerHTML === currentQuestion.correct_answer
      ) {
        optionContainer.children[i].classList.add("correct");
      }
    }
  }
  attempt++;
  unclickableOptions();
  saveQuizState();
}

function unclickableOptions() {
  const optionLength = optionContainer.children.length;
  for (let i = 0; i < optionLength; i++) {
    optionContainer.children[i].classList.add("already-answered");
  }
}

function next() {
  if (questionCounter === questionLimit) {
    quizOver();
  } else {
    getNewQuestion();
  }
}

function answersIndicator() {
  answersIndicatorContainer.innerHTML = "";
  const totalQuestion = questionLimit;
  for (let i = 0; i < totalQuestion; i++) {
    const indicator = document.createElement("div");
    indicator.innerHTML = i + 1;
    indicator.setAttribute("data-question-index", i);
    indicator.classList.add("answer-indicator");
    indicator.onclick = function () {
      loadQuestionByIndex(i);
    };
    questionCounter;

    answersIndicatorContainer.appendChild(indicator);
  }
}

function updateAnswerIndicator(markType) {
  answersIndicatorContainer.children[questionCounter - 1].classList.remove(
    "correct",
    "wrong",
  );
  answersIndicatorContainer.children[questionCounter - 1].classList.add(
    markType,
  );
}

function quizOver() {
  quizBox.classList.add("hide");
  resultBox.classList.remove("hide");
  quizResult();
  localStorage.removeItem("quizState");
}

function quizResult() {
  resultBox.querySelector(".total-question").innerHTML = questionLimit;
  resultBox.querySelector(".total-correct").innerHTML = correctAnswers;
  resultBox.querySelector(".total-attempt").innerHTML = attempt;
  resultBox.querySelector(".total-wrong").innerHTML = attempt - correctAnswers;
  const percentage = (correctAnswers / questionLimit) * 100;
  resultBox.querySelector(".percentage").innerHTML =
    percentage.toFixed(2) + "%";
  resultBox.querySelector(".total-score").innerHTML =
    correctAnswers + " / " + questionLimit;
}

function resetQuiz() {
  questionCounter = 0;
  correctAnswers = 0;
  attempt = 0;
  availableQuestions = [];
  answerStatusMap = {};
}

function tryAgain() {
  resultBox.classList.add("hide");
  quizBox.classList.remove("hide");
  resetQuiz();
  startQuiz();
}

function goToHome() {
  resultBox.classList.add("hide");
  homeBox.classList.remove("hide");
  resetQuiz();
}

function startQuiz() {
  homeBox.classList.add("hide");
  quizBox.classList.remove("hide");
  setAvailableQuestions();
  getNewQuestion();
  answersIndicator();
}

function saveQuizState() {
  const state = {
    // questionCounter,
    // correctAnswers,
    // attempt,
    // availableQuestionsIndexes: availableQuestions.map((q) => quiz.indexOf(q)),
    // currentQuestionIndex: quiz.indexOf(currentQuestion),
    answerStatusMap,
  };
  localStorage.setItem("quizState", JSON.stringify(state));
}

function loadSavedQuestion(question) {
  currentQuestion = question;
  questionText.innerHTML = currentQuestion.question;

  if (currentQuestion.hasOwnProperty("img")) {
    const img = document.createElement("img");
    img.src = currentQuestion.img;
    questionText.appendChild(img);
  }

  availableOptions = [];
  optionContainer.innerHTML = "";
  let animationDelay = 0.2;

  for (let i = 0; i < currentQuestion.options.length; i++) {
    availableOptions.push(i);
  }

  for (let i = 0; i < currentQuestion.options.length; i++) {
    const optionIndex =
      availableOptions[Math.floor(Math.random() * availableOptions.length)];
    const index2 = availableOptions.indexOf(optionIndex);
    availableOptions.splice(index2, 1);

    const option = document.createElement("div");
    option.innerHTML = currentQuestion.options[optionIndex];
    option.id = option.innerHTML;
    option.style.animationDelay = animationDelay + "s";
    animationDelay += 0.15;
    option.className = "option";
    option.setAttribute("onclick", "getResult(this)");
    optionContainer.appendChild(option);
  }

  questionNumber.innerHTML =
    "Question " + (questionCounter + 1) + " of " + questionLimit;
}

function updateAnswerIndicatorsFromState(index, markType) {
  answersIndicatorContainer.children[index].classList.add(markType);
}

window.onload = function () {
  const savedState = JSON.parse(localStorage.getItem("quizState"));
  if (savedState) {
    //   questionCounter = savedState.questionCounter || 0;
    //   correctAnswers = savedState.correctAnswers || 0;
    //   attempt = savedState.attempt || 0;
    startQuiz();
    answerStatusMap = savedState.answerStatusMap || {};

    for (const key in answerStatusMap) {
      const value = answerStatusMap[key];
      updateAnswerIndicatorsFromState(key, value);
    }
  }
  //   availableQuestions = savedState.availableQuestionsIndexes.map(
  //     (index) => quiz[index],
  //   );
  //   currentQuestion = quiz[savedState.currentQuestionIndex];
  //   homeBox.classList.add("hide");
  //   quizBox.classList.remove("hide");
  //   loadSavedQuestion(currentQuestion);
  //   answersIndicator();
  // } else {
  //   homeBox.querySelector(".total-question").innerHTML = "" + questionLimit;
  // }
};

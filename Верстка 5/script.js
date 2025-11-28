const questions = [
  { text: "А голос у него был не такой, как у почтальона Печкина...", correct: 1, answers: ["Пол деревни, за раз","Полдеревни, зараз","Пол-деревни, за раз"], comment: "Правильно! Раздельно существительное будет писаться ..." },
  { text: "А эти слова как пишутся?", correct: 2, answers: ["Капуччино и эспрессо","Каппуччино и экспресо","Капучино и эспрессо"], comment: "Конечно! Единственно верное написание — капучино и эспрессо." },
  { text: "Как нужно писать?", correct: 2, answers: ["Черезчур","Черес-чур","Чересчур"], comment: "Да! Правильное написание — «чересчур»." },
  { text: "Где допущена ошибка?", correct: 2, answers: ["Аккордеон","Белиберда","Эпелепсия"], comment: "Верно! Правильно: «эпилепсия»." }
];

let current = 0;
let correctCount = 0;
let locked = false;

const qBlock = document.getElementById("question-block");
const ansBlock = document.getElementById("answers-block");
const status = document.getElementById("status");
const result = document.getElementById("result");

// массив индексов вопросов
const questionOrder = Array.from(questions.keys());
shuffleArray(questionOrder);

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function loadQuestion() {
  if (current >= questionOrder.length) {
    status.innerText = "Вопросы закончились";
    result.innerText = `Правильных: ${correctCount} из ${questions.length}`;
    return;
  }

  locked = false;

  const qIndex = questionOrder[current];
  const q = questions[qIndex];
  qBlock.innerHTML = q.text;

  // перемешиваем индексы ответов
  const answerOrder = Array.from(q.answers.keys()); // текущ
  shuffleArray(answerOrder);

  ansBlock.innerHTML = ""; // очищ
  answerOrder.forEach(i => {
    const div = document.createElement("div");
    div.className = "answer";
    div.innerText = q.answers[i];

    div.addEventListener("click", () => selectAnswer(div, i, q.correct));

    ansBlock.appendChild(div);
  });
}

function selectAnswer(el, index, correct) {
  if (locked) return;
  locked = true;

  el.classList.add("clicked");

  const all = [...document.querySelectorAll(".answer")];

  if (index === correct) {
    correctCount++;
    el.innerHTML += "<br><small>" + questions[questionOrder[current]].comment + "</small>";
    qBlock.innerHTML += `<span class="marker">✔️</span>`;
  } else {
    qBlock.innerHTML += `<span class="marker">❌</span>`;
  }

  all.forEach((a, idx) => {
    setTimeout(() => a.classList.add("move-down"), idx * 1000);
  });

  // загружаем сл
  setTimeout(() => {
    current++;
    loadQuestion();
  }, 1700);
}

loadQuestion();

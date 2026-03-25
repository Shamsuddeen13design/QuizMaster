// ─── Question Bank ─────────────────────────────────────────────────────────────
// Each question: { category, stem, options: [A,B,C,D], answer: index (0-3) }
// Add more objects here to expand the quiz.
const QUESTIONS = [
  {
    category: "Science",
    stem: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    answer: 2
  },
  {
    category: "Technology",
    stem: "Which company developed the JavaScript programming language in 1995?",
    options: ["Microsoft", "Netscape", "Sun Microsystems", "Apple"],
    answer: 1
  },
  {
    category: "History",
    stem: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    answer: 2
  },
  {
    category: "Geography",
    stem: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    answer: 3
  },
  {
    category: "Science",
    stem: "How many bones are in the adult human body?",
    options: ["196", "206", "216", "226"],
    answer: 1
  },
  {
    category: "Technology",
    stem: "What does 'HTTP' stand for?",
    options: [
      "HyperText Transfer Protocol",
      "HyperText Transmission Program",
      "High-Speed Text Transfer Process",
      "HyperText Typing Protocol"
    ],
    answer: 0
  },
  {
    category: "Pop Culture",
    stem: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Saturn", "Mars"],
    answer: 3
  },
  {
    category: "Mathematics",
    stem: "What is the value of π (pi) rounded to two decimal places?",
    options: ["3.12", "3.14", "3.16", "3.18"],
    answer: 1
  },
  {
    category: "History",
    stem: "Who was the first person to walk on the Moon?",
    options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "John Glenn"],
    answer: 2
  },
  {
    category: "Technology",
    stem: "Which data structure operates on a Last-In, First-Out (LIFO) principle?",
    options: ["Queue", "Linked List", "Stack", "Tree"],
    answer: 2
  }
];
 
const KEYS = ["A", "B", "C", "D"];
 
// ─── State ─────────────────────────────────────────────────────────────────────
let currentIndex = 0;
let score        = 0;
let answered     = false;
 
// ─── Screen helpers ────────────────────────────────────────────────────────────
function show(id) {
  ["screen-start","screen-quiz","screen-result"].forEach(s => {
    document.getElementById(s).style.display = s === id ? "block" : "none";
  });
}
 
// ─── Start ─────────────────────────────────────────────────────────────────────
function startQuiz() {
  currentIndex = 0;
  score        = 0;
  answered     = false;
  show("screen-quiz");
  renderQuestion();
}
 
// ─── Render current question ───────────────────────────────────────────────────
function renderQuestion() {
  const q   = QUESTIONS[currentIndex];
  const num = currentIndex + 1;
  const total = QUESTIONS.length;
 
  // progress
  document.getElementById("progress-fill").style.width = ((num - 1) / total * 100) + "%";
  document.getElementById("progress-label").textContent = `${num} / ${total}`;
  document.getElementById("live-score").textContent = `Score: ${score}`;
 
  // meta
  document.getElementById("q-number").textContent   = `Q${num}`;
  document.getElementById("q-category").textContent = q.category;
  document.getElementById("q-stem").textContent     = q.stem;
 
  // options
  const container = document.getElementById("options");
  container.innerHTML = "";
  q.options.forEach((text, i) => {
    // validate: skip if option text is not a string
    if (typeof text !== "string") return;
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `<span class="option-key">${KEYS[i]}</span><span class="option-text">${escHtml(text)}</span>`;
    btn.addEventListener("click", () => selectAnswer(i));
    container.appendChild(btn);
  });
 
  // reset feedback
  const fb = document.getElementById("feedback");
  fb.className = "feedback";
  document.getElementById("btn-next").className = "btn-next";
 
  answered = false;
 
  // re-trigger card animation
  const card = document.getElementById("q-card");
  card.style.animation = "none";
  void card.offsetWidth;
  card.style.animation = "";
}
 
// ─── Answer selection ──────────────────────────────────────────────────────────
function selectAnswer(chosen) {
  // guard: prevent double-answer (covers weird rapid clicks)
  if (answered) return;
  if (typeof chosen !== "number" || chosen < 0 || chosen >= KEYS.length) return;
 
  answered = true;
  const q       = QUESTIONS[currentIndex];
  const correct = q.answer;
  const isRight = chosen === correct;
 
  if (isRight) score++;
 
  // style options
  const btns = document.querySelectorAll(".option-btn");
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct)       btn.classList.add("correct");
    else if (i === chosen)   btn.classList.add("wrong");
    else                     btn.classList.add("dimmed");
  });
 
  // feedback banner
  const fb   = document.getElementById("feedback");
  const icon = document.getElementById("feedback-icon");
  const txt  = document.getElementById("feedback-text");
 
  if (isRight) {
    fb.className = "feedback show correct-fb";
    icon.textContent = "✓";
    txt.textContent  = "Correct! Well done.";
  } else {
    fb.className = "feedback show wrong-fb";
    icon.textContent = "✗";
    txt.textContent  = `Incorrect. The right answer was "${escHtml(q.options[correct])}".`;
  }
 
  // show next / finish button
  const btnNext = document.getElementById("btn-next");
  const isLast  = currentIndex === QUESTIONS.length - 1;
  btnNext.textContent = isLast ? "SEE RESULTS →" : "NEXT QUESTION →";
  btnNext.className   = "btn-next show";
}
 
// ─── Advance ───────────────────────────────────────────────────────────────────
function nextQuestion() {
  if (!answered) return; // safety: can't advance before answering
  currentIndex++;
  if (currentIndex >= QUESTIONS.length) {
    showResults();
  } else {
    renderQuestion();
  }
}
 
// ─── Results screen ────────────────────────────────────────────────────────────
function showResults() {
  show("screen-result");
 
  const total = QUESTIONS.length;
  const pct   = Math.round(score / total * 100);
  const wrong = total - score;
 
  document.getElementById("result-correct").textContent = score;
  document.getElementById("result-wrong").textContent   = wrong;
  document.getElementById("result-total").textContent   = total;
  document.getElementById("score-pct").textContent      = pct + "%";
 
  // grade message
  let title, sub;
  if      (pct === 100)      { title = "PERFECT SCORE!";   sub  = "You aced every single question. Extraordinary!"; }
  else if (pct >= 80)        { title = "EXCELLENT!";        sub  = "You really know your stuff. Almost flawless!"; }
  else if (pct >= 60)        { title = "GOOD JOB!";         sub  = "Solid performance. A little more study and you'll nail it!"; }
  else if (pct >= 40)        { title = "KEEP PRACTISING";   sub  = "Not bad, but there's room to grow. Try again!"; }
  else                       { title = "BETTER LUCK NEXT TIME"; sub = "Don't give up — every expert was once a beginner!"; }
 
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-sub").textContent   = sub;
 
  // animated ring
  const circumference = 490;
  const offset = circumference - (pct / 100) * circumference;
  const ring = document.getElementById("ring-fill");
  ring.style.strokeDashoffset = circumference; // reset
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ring.style.strokeDashoffset = offset;
      ring.style.stroke = pct >= 60 ? "var(--correct)" : pct >= 40 ? "var(--accent)" : "var(--wrong)";
    });
  });
 
  // final progress bar
  document.getElementById("progress-fill").style.width = "100%";
  document.getElementById("progress-label").textContent = `${total} / ${total}`;
  document.getElementById("live-score").textContent = `Score: ${score}`;
}
 
// ─── Restart ───────────────────────────────────────────────────────────────────
function restartQuiz() {
  show("screen-start");
}
 
// ─── Utility: escape HTML to prevent XSS in option text ───────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}
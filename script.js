// script.js
let riddles = [];
let currentIndex = 0;
let history = [];
let score = 0;
let cumul = [0]

function cleanText(text) {
    return text
      .toLowerCase()
      .normalize("NFD")                  // separate accents
      .replace(/[\u0300-\u036f]/g, "")  // remove accents
      .replace(/[^a-z0-9]/g, " ")       // remove punctuation incl. hyphen, replace with space
      .replace(/\s+/g, " ")             // collapse multiple spaces
      .trim();
  }

async function loadRiddles() {
  const res = await fetch('./riddles.json');
  riddles = await res.json();
  showRiddle();
}

function showRiddle() {
  const riddle = riddles[currentIndex];
  const container = document.getElementById('riddle-container');
  container.textContent = riddle.riddle;
  document.getElementById('feedback').textContent = '';
  document.getElementById('movie-poster').style.display = "none";
  document.getElementById('anecd-box').style.display = 'none';
}

function checkAnswer() {
    const userInput = cleanText(document.getElementById('answer-input').value)
    const acceptedAnswers = Array.isArray(riddles[currentIndex].answer)
      ? riddles[currentIndex].answer
      : [riddles[currentIndex].answer];
  
    const isCorrect = acceptedAnswers.some(answer => cleanText(answer) === userInput);
    const feedback = document.getElementById('feedback');
    const imageBox = document.getElementById('movie-poster');
    const anecdoteBox = document.getElementById('anecd-box');
    const anecdoteText = document.getElementById('anecdote');
  
    if (isCorrect) {
        score += 1;
        feedback.textContent = "✅ Bonne réponse !";
        imageBox.src = riddles[currentIndex].image;
        imageBox.style.display = "block";
        anecdoteText.textContent = riddles[currentIndex].anecdote || "";
        anecdoteBox.style.display = "block";
    } else {
        document.getElementById('feedback').textContent = "❌ Mauvaise réponse.";
    }
  
    // Clear input
    document.getElementById('answer-input').value = '';
}

function showFinalScore() {
    const modal = document.getElementById('final-score-modal');
    const scoreText = document.getElementById('score-text');
    
    scoreText.textContent = `Ton score est de ${score} / ${riddles.length}`;
    modal.style.display = 'flex';
}

document.getElementById('submit-btn').addEventListener('click', checkAnswer);

function nextRiddle() {
    history.push(currentIndex);
    cumul.push(currentIndex);
  
    if (cumul.length < riddles.length) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * riddles.length);
      } while (cumul.includes(nextIndex));
  
      currentIndex = nextIndex;
      showRiddle();
    } else {
      showFinalScore();
    }
}

function previousRiddle () {
    if (history.length > 0) {
        currentIndex = history.pop();
        showRiddle();
    } else {
        alert("Aucun rébus précédent !");
    }
}

function goToPage() {
    window.location.href = "quiz.html";
}

document.getElementById('next-btn').addEventListener('click', nextRiddle);
document.getElementById('prev-btn').addEventListener('click', previousRiddle);

document.getElementById('restart-btn').addEventListener('click', () => {
    currentIndex = 0;
    score = 0;
    cumul = [0];
    history = [];
    document.getElementById('final-score-modal').style.display = 'none';
    showRiddle();
});

loadRiddles();

// rebus-quiz/script.js

// 📦 DOM References
const el = {
    answerInput: document.getElementById('answer-input'),
    submitBtn: document.getElementById('submit-btn'),
    feedback: document.getElementById('feedback'),
    poster: document.getElementById('movie-poster'),
    anecdoteBox: document.getElementById('anecd-box'),
    anecdoteText: document.getElementById('anecdote'),
    movieTitle: document.getElementById('movie-specific'),
    revealBox: document.getElementById('reveal-res'),
    riddleContainer: document.getElementById('riddle-container'),
    finalModal: document.getElementById('final-score-modal'),
    scoreText: document.getElementById('score-text'),
    languageSelect: document.getElementById('language-switcher'),
    nextBtn: document.getElementById('next-btn'),
    prevBtn: document.getElementById('prev-btn'),
    restartBtn: document.getElementById('restart-btn')
  };
  
  // 🧠 Game State
  let riddles = [];
  let currentIndex = 0;
  let history = [];
  let score = 0;
  let usedIndices = [];
  let language = document.documentElement.lang || 'en';
  
  // 🔠 Text cleaner
  function cleanText(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  
  // 📜 Load Riddles
  async function loadRiddles() {
    try {
      const res = await fetch('./riddles.json');
      const allRiddles = await res.json();
      riddles = allRiddles.sort(() => Math.random() - 0.5).slice(0, 20);
      currentIndex = 0;
      usedIndices = [currentIndex];
      if (el.riddleContainer) showRiddle();
    } catch (error) {
      console.error("Failed to load riddles:", error);
    }
  }
  
  // 🧩 Display Riddle
  function showRiddle() {
    el.answerInput.style.display = 'flex';
    el.submitBtn.style.display = 'flex';
    el.riddleContainer.style.display = 'flex';
    if (!el.riddleContainer || !riddles[currentIndex]) return;
    const r = riddles[currentIndex];
    el.riddleContainer.textContent = r[language]?.riddle || '';
    if (el.feedback) el.feedback.textContent = '';
    if (el.poster) el.poster.style.display = 'none';
    if (el.anecdoteBox) el.anecdoteBox.style.display = 'none';
    if (el.movieTitle) el.movieTitle.style.display = 'none';
    if (el.revealBox) el.revealBox.style.display = 'none';
  }
  
  // ✅ Check Answer
  function checkAnswer() {
    if (!riddles[currentIndex]) return;
    const input = cleanText(el.answerInput?.value || "");
    const r = riddles[currentIndex];
    const validAnswers = Array.isArray(r.answer) ? r.answer : [r.answer];
    const isCorrect = validAnswers.some(a => cleanText(a) === input);
  
    if (!el.feedback) return;
  
    if (isCorrect) {
      el.answerInput.style.display = 'none';
      el.submitBtn.style.display = 'none';
      el.riddleContainer.style.display = 'none';
      score++;
      el.feedback.textContent = language === 'fr' ? '✅ Bonne réponse !' : '✅ Good answer!';
      if (el.movieTitle) {
        el.movieTitle.textContent = r.answer[0];
        el.movieTitle.style.display = 'block';
      }
      if (el.poster) {
        el.poster.src = r.image;
        el.poster.style.display = 'block';
      }
      if (el.anecdoteText) el.anecdoteText.textContent = r[language]?.anecdote || '';
      if (el.anecdoteBox) el.anecdoteBox.style.display = 'block';
      if (el.revealBox) el.revealBox.style.display = 'none';
    } else {
      el.feedback.textContent = language === 'fr' ? '❌ Mauvaise réponse !' : '❌ Wrong answer!';
      if (el.revealBox) el.revealBox.style.display = 'flex';
      if (el.movieTitle) el.movieTitle.style.display = 'none';
      if (el.poster) el.poster.style.display = 'none';
      if (el.anecdoteBox) el.anecdoteBox.style.display = 'none';
    }
  
    if (el.answerInput) el.answerInput.value = '';
  }
  
  // 👀 Reveal Answer
  function revealAnswer() {
    el.answerInput.style.display = 'none';
    el.submitBtn.style.display = 'none';
    el.riddleContainer.style.display = 'none';
    if (!riddles[currentIndex]) return;
    const r = riddles[currentIndex];
    if (el.movieTitle) {
      el.movieTitle.textContent = r.answer[0];
      el.movieTitle.style.display = 'block';
    }
    if (el.poster) {
      el.poster.src = r.image;
      el.poster.style.display = 'block';
    }
    if (el.anecdoteText) el.anecdoteText.textContent = r[language]?.anecdote || '';
    if (el.anecdoteBox) el.anecdoteBox.style.display = 'block';
    if (el.revealBox) el.revealBox.style.display = 'none';
    if (el.feedback) el.feedback.textContent = '';
  }
  
  // 🧭 Navigate
  function nextRiddle() {
    history.push(currentIndex);
    if (usedIndices.length < riddles.length) {
      let next;
      do {
        next = Math.floor(Math.random() * riddles.length);
      } while (usedIndices.includes(next));
      usedIndices.push(next);
      currentIndex = next;
      showRiddle();
    } else {
      showFinalScore();
    }
  }
  
  function previousRiddle() {
    if (history.length > 0) {
      currentIndex = history.pop();
      showRiddle();
    } else {
      alert(language === 'fr' ? 'Aucun rébus précédent !' : 'No previous riddle!');
    }
  }
  
  // 🏁 Final Score
  function showFinalScore() {
    if (!el.scoreText || !el.finalModal) return;
    el.scoreText.textContent = `${language === 'fr' ? 'Ton score est de' : 'Your score is'} ${score} / ${riddles.length}`;
    el.finalModal.style.display = 'flex';
  }
  
  // 🔁 Restart
  function restartQuiz() {
    currentIndex = 0;
    score = 0;
    usedIndices = [0];
    history = [];
    if (el.finalModal) el.finalModal.style.display = 'none';
    showRiddle();
  }
  
  // 🌍 Language Change
  function updateLanguage() {
    language = el.languageSelect?.value || 'en';
    showRiddle();
  }
  
  // 🌐 Redirect Page
  function goToPage() {
    const selectedLang = el.languageSelect?.value;
    if (selectedLang === 'fr') {
      window.location.href = 'quiz_fr.html';
    } else {
      window.location.href = 'quiz_en.html';
    }
  }
  
  // 📌 Safe Event Listeners
  if (el.submitBtn) el.submitBtn.addEventListener('click', checkAnswer);
  if (el.answerInput) el.answerInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkAnswer(); });
  if (el.revealBox?.querySelector('button')) el.revealBox.querySelector('button').addEventListener('click', revealAnswer);
  if (el.nextBtn) el.nextBtn.addEventListener('click', nextRiddle);
  if (el.prevBtn) el.prevBtn.addEventListener('click', previousRiddle);
  if (el.restartBtn) el.restartBtn.addEventListener('click', restartQuiz);
  if (el.languageSelect) el.languageSelect.addEventListener('change', updateLanguage);
  
  // 🚀 Init
  if (el.riddleContainer) loadRiddles();  
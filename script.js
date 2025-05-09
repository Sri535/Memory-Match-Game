let selectedDifficulty = 2;
let selectedCategory = 'fruits';
let timerInterval;
let time = 0;
let flips = 0;
let firstCard = null;
let lockBoard = false;

const emojiSets = {
  fruits: ['🍎','🍌','🍇','🍓','🍒','🍉','🥝','🍍','🍑','🥥','🍈','🍋','🍊','🍐','🥭','🥕','🌽','🍅','🍆','🥑'],
  food: ['🍔','🍕','🍟','🥪','🥗','🍝','🍛','🍣','🥘','🍲','🍿','🍩','🍪','🎂','🍫','🍯','🍤','🥞','🍞','🧀'],
  astrology: ['🌞','🌝','🌜','🌛','🌚','🌟','⭐','✨','🌠','🌌','🔮','♈','♉','♊','♋','♌','♍','♎','♏','♐'],
  hands: ['\u270b','\ud83d\udc4b','\ud83d\udc46','\ud83d\udc47','\ud83d\udc48','\ud83d\udc49','\ud83d\udc4c','\ud83d\udc4f','\ud83e\udd1d','\ud83d\udc4d','\ud83d\udc4e','\ud83d\udd90','\ud83d\udd95','\ud83d\udc50','\ud83e\udd1e','\ud83e\udd1f','\ud83d\udc45','\ud83d\udc4a','\ud83d\udcaa','\ud83d\udc76'],
  smileys: ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','😘','😗','😙','😚','🙂','🤗','🤩'],
  mixed: ['😀','🍕','🌞','🍎','😂','🍩','🌟','🍌','😉','🍟','🔮','🍇','😍','🍫','♈','🍒','🤗','🍿','♊','🍍']
};

function playMusic() {
  const music = document.getElementById('background-music');
  music.volume = 0.2; // softer background music
  music.play();
}
function toggleMusic() {
  const music = document.getElementById('background-music');
  const muteButton = document.getElementById('mute-button');

  if (music.muted) {
    music.muted = false;
    muteButton.textContent = '🔈'; // Change to speaker icon
  } else {
    music.muted = true;
    muteButton.textContent = '🔇'; // Change to muted speaker icon
  }
}


function selectDifficulty(size) {
  selectedDifficulty = size;
  document.getElementById('difficulty-screen').classList.remove('active');
  document.getElementById('category-screen').classList.add('active');
}

function selectCategory(category) {
  selectedCategory = category;
  document.getElementById('category-screen').classList.remove('active');
  document.getElementById('game-container').classList.add('active');
  startGame();
}

function startGame() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  board.className = 'board ' + (selectedDifficulty === 2 ? 'easy' : selectedDifficulty === 4 ? 'normal' : 'hard');
  time = 0;
  flips = 0;
  document.getElementById('timer').innerText = time;
  document.getElementById('flips').innerText = flips;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    document.getElementById('timer').innerText = time;
  }, 1000);

  const emojis = [...emojiSets[selectedCategory]];
  let needed = (selectedDifficulty * selectedDifficulty) / 2;
  const selectedEmojis = emojis.sort(() => 0.5 - Math.random()).slice(0, needed);
  const gameEmojis = [...selectedEmojis, ...selectedEmojis].sort(() => 0.5 - Math.random());

  gameEmojis.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<span class="hidden-emoji">${emoji}</span>`;
    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
  });

  document.getElementById('background-music').play();
  updateHighScore();
}
function launchConfetti() {
  const duration = 1* 1000; // 1 seconds
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };
  document.getElementById('win-popper').play();
  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    }));
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    }));
  }, 250);
}

function showWinPopup() {
  const popup = document.getElementById('win-popup');
  popup.classList.remove('hidden');
}
function restartGame() {
  location.reload(); // Simply reload page to restart everything
}


function flipCard(card) {
  if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

  card.classList.add('flipped');
  document.getElementById('flip-sound').play();
  flips++;
  document.getElementById('flips').innerText = flips;

  if (!firstCard) {
    firstCard = card;
    return;
  }

  if (firstCard.querySelector('.hidden-emoji').innerText === card.querySelector('.hidden-emoji').innerText) {
    firstCard.classList.add('matched');
    card.classList.add('matched');
    document.getElementById('match-sound').play();
    checkVictory();
    firstCard = null;
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      card.classList.remove('flipped');
      firstCard = null;
      lockBoard = false;
    }, 1000);
  }
}

function checkVictory() {
  if (document.querySelectorAll('.card:not(.matched)').length === 0) {
    clearInterval(timerInterval);
    const highscore = JSON.parse(localStorage.getItem('highscore')) || Infinity;
    if (time < highscore) {
      localStorage.setItem('highscore', JSON.stringify(time));
    }
    alert('Congratulations! You matched all cards!');
   
    updateHighScore();
    launchConfetti(); // 🎉 Launch confetti when game is completed!
    showWinPopup(); // 🏆 Show the winning popup
  }
}

function updateHighScore() {
  const highscore = JSON.parse(localStorage.getItem('highscore')) || 0;
  document.getElementById('highscore').innerText = highscore;
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      console.log('Service Worker Registered!', registration);
    })
    .catch(function(error) {
      console.log('Service Worker Registration Failed:', error);
    });
}


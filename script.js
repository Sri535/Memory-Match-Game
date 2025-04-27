// Emoji Sets
const emojiSets = {
  fruits: ['🍎','🍌','🍇','🍓','🍒','🍉','🥝','🍍','🍑','🥥','🍈','🍋','🍊','🍐','🥭'],
  food: ['🍔','🍟','🍕','🌮','🌯','🍜','🍣','🍰','🍩','🍪','🍿','🥗','🥖','🍞','🧀'],
  astrology: ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🌟','🔯','✨','🌙'],
  hands: ['👍','👎','👋','🤚','🖐','✋','🖖','👌','🤌','🤏','✌','🤞','🤟','🤘','🤙'],
  smileys: ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😍','😘']
};

let selectedEmojis = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let timer = 0;
let interval;
let flips = 0;
let gridSize = 4; // default normal

// Audio
const bgMusic = document.getElementById('background-music');
const matchSound = document.getElementById('match-sound');
const flipSound = document.getElementById('flip-sound');

// Theme
const themeToggle = document.getElementById('theme-toggle');
themeToggle.onclick = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
};

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

// Music
document.getElementById('music-toggle').onclick = () => {
  if (bgMusic.paused) {
    bgMusic.play();
    document.getElementById('music-toggle').innerText = "🔇 Pause Music";
  } else {
    bgMusic.pause();
    document.getElementById('music-toggle').innerText = "🎵 Play Music";
  }
};

function selectDifficulty(size) {
  gridSize = size;
  document.getElementById('difficulty-screen').style.display = 'none';
  document.getElementById('category-screen').style.display = 'block';
}

function gridClassName(size) {
  if (size === 2) return 'easy';
  if (size === 4) return 'normal';
  if (size === 6) return 'hard';
}



function selectCategory(category) {
  document.getElementById('category-screen').style.display = 'none';
  document.getElementById('game-board').style.display = 'grid';
  document.querySelector('.stats').style.display = 'block';

  if (category === 'mixed') {
    selectedEmojis = Object.values(emojiSets).flat();
  } else {
    selectedEmojis = emojiSets[category];
  }
  buildBoard();
  startTimer();
}


function buildBoard() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  board.className = `board ${gridClassName(gridSize)}`;

  let emojis = [...selectedEmojis];
  emojis = shuffleArray(emojis).slice(0, (gridSize * gridSize) / 2);
  emojis = [...emojis, ...emojis];
  emojis = shuffleArray(emojis);

  emojis.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.innerHTML = `<span class="hidden-emoji">${emoji}</span>`;
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}


function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flipped');
  this.querySelector('span').classList.remove('hidden-emoji');
  flipSound.play();

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  flips++;
  document.getElementById('flips').innerText = flips;

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchSound.play();
    resetBoard();
   if (document.querySelectorAll('.matched').length === (gridSize * gridSize)) {
  gameOver();
}

  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.querySelector('span').classList.add('hidden-emoji');
      secondCard.querySelector('span').classList.add('hidden-emoji');
      resetBoard();
    }, 1000);
  }
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function shuffleArray(array) {
  return array.sort(() => 0.5 - Math.random());
}

function startTimer() {
  timer = 0;
  flips = 0;
  document.getElementById('timer').innerText = timer;
  document.getElementById('flips').innerText = flips;
  interval = setInterval(() => {
    timer++;
    document.getElementById('timer').innerText = timer;
  }, 1000);
}



function gameOver() {
  clearInterval(interval);
  document.getElementById('game-board').style.display = 'none';
  document.getElementById('game-over').classList.remove('hidden');
  document.getElementById('final-time').innerText = timer;
  document.getElementById('final-flips').innerText = flips;

  let bestTime = localStorage.getItem('bestTime');
  if (!bestTime || timer < bestTime) {
    localStorage.setItem('bestTime', timer);
    bestTime = timer;
  }
  document.getElementById('best-time').innerText = bestTime;
}

function restartGame() {
  location.reload();
}

// Load Best Time on Start
document.getElementById('best-time').innerText = localStorage.getItem('bestTime') || '--';

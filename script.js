let gridSize = 4;
let selectedCategory = '';
let selectedEmojis = [];
let flippedCards = [];
let timer = 0;
let timerInterval;
let flips = 0;
let highScore = localStorage.getItem('highScore') || 0;

const emojiSets = {
  fruits: ['🍎','🍌','🍇','🍓','🍒','🍉','🥝','🍍','🍈','🍊','🍋','🥭','🍏','🍐','🍑','🫐','🍅','🫒','🥥','🥑'],
  food: ['🍔','🍟','🌭','🍕','🥗','🍩','🍪','🍰','🍱','🍘','🍚','🥮','🍤','🍡','🥠','🍲','🥗','🌮','🥪','🥨'],
  astrology: ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','⛎','🛐','⚛️','🕉️','✡️,'☸️','☯️','🔯'],
  hands: ['👍','👎','👏','🤝','🙏','👋','🤟','👌','✋','🤚','🖐️','🖖','✌️','🤌','🤏','✍️','🤜','🤛','👐','👊'],
  smileys: ['😊','😂','😍','😎','😢','😡','😴','🤓','🤣','😇','🥰','😜','🤪','🤔','🤐','🤫','😶','🤤','🤢','🥵'],
};

document.getElementById('highscore').textContent = highScore;

function selectDifficulty(size) {
  gridSize = size;
  showScreen('category-screen');
}

function selectCategory(category) {
  selectedCategory = category;
  showScreen('game-container');
  startGame();
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

function startGame() {
  if (selectedCategory === 'mixed') {
    selectedEmojis = Object.values(emojiSets).flat();
  } else {
    selectedEmojis = emojiSets[selectedCategory];
  }
  buildBoard();
  startTimer();
  playMusic();
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

  flippedCards = [];
  flips = 0;
  document.getElementById('flips').textContent = flips;
}

function gridClassName(size) {
  if (size === 2) return 'easy';
  if (size === 4) return 'normal';
  if (size === 6) return 'hard';
}

function flipCard() {
  if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
  if (flippedCards.length === 2) return;

  this.classList.add('flipped');
  document.getElementById('flip-sound').play();
  flippedCards.push(this);
  flips++;
  document.getElementById('flips').textContent = flips;

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.emoji === card2.dataset.emoji) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    flippedCards = [];
    document.getElementById('match-sound').play();
    if (document.querySelectorAll('.matched').length === (gridSize * gridSize)) {
      gameOver();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
    }, 800);
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById('timer').textContent = timer;
  }, 1000);
}

function gameOver() {
  clearInterval(timerInterval);
  const finalScore = flips + timer;
  if (highScore === 0 || finalScore < highScore) {
    localStorage.setItem('highScore', finalScore);
    document.getElementById('highscore').textContent = finalScore;
    alert(`🎉 New High Score! Flips: ${flips}, Time: ${timer}s`);
  } else {
    alert(`🎉 You finished! Flips: ${flips}, Time: ${timer}s`);
  }
}

function shuffleArray(array) {
  return array.sort(() => 0.5 - Math.random());
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

function playMusic() {
  const music = document.getElementById('background-music');
  music.volume = 0.3;
  music.play();
}

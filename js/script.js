const alucard = document.getElementById('alucard'); 
const caveira = document.querySelector('.caveira');
const background = document.querySelector('.background');
const scoreDisplay = document.getElementById('score');
const lifeDisplay = document.getElementById('lives');
const body = document.body;

let gameRunning = true;
let score = 0;
let lives = 3;
let canCollide = true;
let collisionTimeout;
let paused = false;
let loop;

const fadeLayer = document.getElementById('fadeLayer');
const gameOverText = document.querySelector('.game-over-text');
const restartMessage = document.getElementById('restartMessage');
const exitMessage = document.getElementById('exitMessage');
const exitLink = document.getElementById('exitLink');
const pauseText = document.querySelector('.pause-text');

const jump = (event) => {
    if (event && event.keyCode === 38 && gameRunning) {
        alucard.classList.add('jump');

        setTimeout(() => {
            alucard.classList.remove('jump');
        }, 500);
    }
};

const checkCollision = () => {
    const alucardRect = alucard.getBoundingClientRect();
    const caveiraRect = caveira.getBoundingClientRect();

    const collision = (
        alucardRect.right > caveiraRect.left &&
        alucardRect.left < caveiraRect.right &&
        alucardRect.bottom > caveiraRect.top &&
        alucardRect.top < caveiraRect.bottom &&
        canCollide
    );

    if (collision) {
        updateLives();
        canCollide = false; 
        setTimeout(() => {
            canCollide = true; 
        }, 1000); 
    }

    return collision;
};

const updateScore = () => {
    score++;
    scoreDisplay.textContent = score;
};

const updateLives = () => {
    if (lives > 0 && canCollide) {
        lives--;
        lifeDisplay.textContent = lives;
        changeAlucardImage(); 
    }

    if (lives === 0) {
        endGame();
    }
};

const changeAlucardImage = () => {
    alucard.style.filter = 'brightness(150%) saturate(100%) hue-rotate(0deg) sepia(0) hue-rotate(330deg) contrast(100%) drop-shadow(0px 0px 5px red)';

    
    setTimeout(() => {
        alucard.style.filter = 'none'; 
    }, 500);
};

const hideGameElements = () => {
    alucard.style.display = 'none';
    caveira.style.display = 'none';
    background.style.display = 'none';
    body.style.backgroundColor = 'black';
};

const showGameOver = () => {
    fadeLayer.style.opacity = '0'; 
    fadeLayer.style.pointerEvents = 'none'; 

    let opacity = 0; 

    const fadeInInterval = setInterval(() => {
        if (opacity < 1) {
            opacity += 0.1; 
            fadeLayer.style.opacity = opacity;
        } else {
            clearInterval(fadeInInterval); 
            fadeLayer.style.pointerEvents = 'auto'; 
            showRestartMessage(); 
        }
    }, 100); 

    gameOverText.style.opacity = '0'; 
    gameOverText.style.display = 'block'; 

    let textOpacity = 0; 
    const textFadeInInterval = setInterval(() => {
        if (textOpacity < 1) {
            textOpacity += 0.1; 
            gameOverText.style.opacity = textOpacity;
        } else {
            clearInterval(textFadeInInterval); 
        }
    }, 100);
};

const showRestartMessage = () => {
    setTimeout(() => {
        restartMessage.style.opacity = '1'; 
        showExitMessage();
    }, 1000); 
};

const showExitMessage = () => {
    setTimeout(() => {
        exitMessage.style.opacity = '1'; 
    }, 1000); 
};

exitLink.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = "paginainicial.html"; 
});

const endGame = () => {
    gameRunning = false;
    clearInterval(loop);
    showGameOver();
};

const restartGame = () => {
    window.location.reload(); 
};

const gameLoop = () => {
    if (!gameRunning || paused) return;

    if (checkCollision()) {
        updateLives();
    } else {
        updateScore();
    }
};

loop = setInterval(gameLoop, 10);

document.addEventListener('keydown', jump);
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' && !gameRunning) {
        restartGame(); 
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'p') {
        togglePause();
    }
});

document.body.focus();

const togglePause = () => {
    paused = !paused;

    if (paused) {
        clearInterval(loop);
        alucard.style.filter = 'none';
        caveira.style.display = 'none';
        background.style.display = 'none';
        body.style.backgroundColor = 'black';
        pauseText.style.display = 'block'; 
    } else {
        loop = setInterval(gameLoop, 10);
        alucard.style.filter = '';
        caveira.style.display = 'block';
        background.style.display = 'block';
        body.style.backgroundColor = '';
        pauseText.style.display = 'none'; 
    }
};
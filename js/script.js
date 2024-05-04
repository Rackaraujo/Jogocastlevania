document.addEventListener("DOMContentLoaded", function() {
    const alucard = document.getElementById('alucard'); 
    const caveira = document.querySelector('.caveira');
    const background = document.querySelector('.background');
    const scoreDisplay = document.getElementById('score');
    const lifeDisplay = document.getElementById('lives');
    const body = document.body;

    let gameRunning = false;
    let score = 0;
    let lives = 3;
    let canCollide = true;
    let collisionTimeout;
    let paused = false;
    let loop;
    let allowAudioButtonClicked = false;

    const fadeLayer = document.getElementById('fadeLayer');
    const gameOverText = document.querySelector('.game-over-text');
    const restartMessage = document.getElementById('restartMessage');
    const exitMessage = document.getElementById('exitMessage');
    const exitLink = document.getElementById('exitLink');
    const pauseText = document.querySelector('.pause-text');

    const blackScreen = document.createElement('div');
    blackScreen.id = 'blackScreen';
    document.body.appendChild(blackScreen);

    const allowAudioButton = document.createElement("button");
    allowAudioButton.textContent = "Permitir Áudio";
    allowAudioButton.addEventListener("click", function() {
        startAudio();
        allowAudioButton.style.display = "none";
        startGame();
    });
    document.body.appendChild(allowAudioButton);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            allowAudioButton.click(); 
        }
    });
    

    setTimeout(function() {
        blackScreen.style.display = "none";
        allowAudioButton.style.display = "none";
        startGame();
    }, 5000);

    setTimeout(function() {
        allowAudioButtonClicked = true;
    }, 3000);



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
        alucard.classList.add('blink');
        alucard.style.filter = 'brightness(150%) saturate(100%) hue-rotate(0deg) sepia(0) hue-rotate(330deg) contrast(100%) drop-shadow(0px 0px 5px red)';

        setTimeout(() => {
            alucard.classList.remove('blink');
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
        if (!gameRunning || paused || !allowAudioButtonClicked) return;
    
        if (checkCollision()) {
            updateLives();
        } else {
            updateScore();
        }
    };

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

    const startGame = () => {
        gameRunning = true;
        loop = setInterval(gameLoop, 10);
    };

    const startAudio = () => {
        if (typeof window.Audio === "function") {
            const audio = new Audio("songs/Castlevania - Alucard's Theme (320).mp3");
            audio.loop = true;
            audio.play().then(function() {
                console.log("Áudio iniciado em loop.");
            }).catch(function(error) {
                console.error("Erro ao reproduzir áudio:", error);
            });
        } else {
            console.error("Seu navegador não suporta a reprodução de áudio.");
        }
    };
});


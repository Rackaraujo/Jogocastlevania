document.addEventListener("DOMContentLoaded", function() {
    const alucard = document.getElementById('alucard'); 
    const caveira = document.querySelector('.caveira');
    const background = document.querySelector('.background');
    const scoreDisplay = document.getElementById('score');
    const body = document.body;

    let gameRunning = false;
    let score = 0;
    let lives = 3;
    let canCollide = true;
    let paused = false;
    let loop;
    let audioVolume = 0.1; 

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
    allowAudioButton.textContent = "Pressione Enter para iniciar";
    allowAudioButton.addEventListener("click", function() {
        allowAudioButton.style.display = 'none';
        startCountdown();
    });
    document.body.appendChild(allowAudioButton);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            allowAudioButton.click(); 
        }
    });

    const startCountdown = () => {
        let countdown = 3;
        const countdownInterval = setInterval(() => {
            if (countdown > 1) {
                countdownText.textContent = countdown;
                countdown--;
            } else if (countdown === 1) {
                countdownText.textContent = countdown;
                setTimeout(() => {
                    countdownText.textContent = '';
                    clearInterval(countdownInterval);
                    startGame();
                }, 1000);
                countdown--;
            }
        }, 1000);
    };

    const countdownText = document.createElement('div');
    countdownText.id = 'countdownText';
    countdownText.style.position = 'absolute';
    countdownText.style.top = '50%';
    countdownText.style.left = '50%';
    countdownText.style.transform = 'translate(-50%, -50%)';
    countdownText.style.fontSize = '3em';
    countdownText.style.color = 'white';
    document.body.appendChild(countdownText);

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
    
            const lifeImage = document.getElementById(`life${lives + 1}`);
            lifeImage.src = "img/life3.png"; 
    
            if (lives === 0) {
                endGame();
            } else {
                
                lifeImage.classList.add('blink');
                setTimeout(() => {
                    lifeImage.classList.remove('blink');
                }, 500);
    
                changeAlucardImage(); 
            }
    
            canCollide = false; 
            setTimeout(() => {
                canCollide = true; 
            }, 1000);
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
        fadeOutAudio(); 
        setTimeout(() => { 
            window.location.href = "paginainicial.html";
        }, 2000); 
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

    document.addEventListener('keydown', jump);

    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' && !gameRunning) {
            fadeOutAudio(); 
            setTimeout(() => {
                restartGame();
            }, 2000); 
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
        fadeInAudio();
    
        
        for (let i = 1; i <= 3; i++) {
            const lifeImage = document.getElementById(`life${i}`);
            lifeImage.src = "img/life1.png";
        }
    };

    const fadeInAudio = () => {
        const fadeInterval = setInterval(() => {
            if (audioVolume < 1) {
                audioVolume += 0.05;
                audio.volume = audioVolume;
            } else {
                clearInterval(fadeInterval);
            }
        }, 200); 
    };

    const audio = new Audio("songs/Castlevania - Alucard's Theme (320).mp3");
    audio.loop = true;
    let audioFadeOutInterval;

    const startAudio = () => {
        if (typeof window.Audio === "function") {
            audio.play().then(function() {
                console.log("Áudio iniciado em loop.");
                audioFadeOutInterval && clearInterval(audioFadeOutInterval); 
            }).catch(function(error) {
                console.error("Erro ao reproduzir áudio:", error);
            });
        } else {
            console.error("Seu navegador não suporta a reprodução de áudio.");
        }
    };

    const fadeOutAudio = () => {
        const fadeInterval = setInterval(() => {
            if (audioVolume > 0) {
                audioVolume -= 0.05; 
                audio.volume = audioVolume;
            } else {
                clearInterval(fadeInterval);
                audio.pause();
            }
        }, 100); 
    };

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            startAudio(); 
        }
    });

    window.addEventListener('beforeunload', () => {
        fadeOutAudio(); 
    });
});

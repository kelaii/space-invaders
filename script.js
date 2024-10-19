document.getElementById('startGame').addEventListener('click', function() {
    document.getElementById('welcome').style.display = 'none'; // Nasconde la pagina di benvenuto
    document.getElementById('gameSection').style.display = 'block'; // Mostra il gioco
    startSpaceInvaders(); // Avvia il gioco
});

// Aggiungi eventi per i controlli touch
document.getElementById('leftButton').addEventListener('touchstart', function() {
    player.movingLeft = true;
});
document.getElementById('leftButton').addEventListener('touchend', function() {
    player.movingLeft = false;
});
document.getElementById('rightButton').addEventListener('touchstart', function() {
    player.movingRight = true;
});
document.getElementById('rightButton').addEventListener('touchend', function() {
    player.movingRight = false;
});

// Variabili di gioco
let player;
let aliens = [];
let bullets = [];
let alienBullets = [];
let score = 0;
let lives = 3;
const alienRows = 3;
const alienCols = 8;
let gameInterval;

// Funzione per avviare il gioco
function startSpaceInvaders() {
    const canvas = document.getElementById('spaceInvadersGame');
    const ctx = canvas.getContext('2d');

    player = {
        x: canvas.width / 2 - 25,
        y: canvas.height - 30,
        width: 50,
        height: 20,
        speed: 5,
        movingLeft: false,
        movingRight: false
    };

    createAliens(); // Crea gli alieni
    gameInterval = setInterval(() => update(ctx), 1000 / 60); // Aggiorna il gioco a 60 fps

    // Sparare continuamente, ma meno frequentemente
    setInterval(fireBullet, 500); // Spara ogni 500 ms

    // Avvia la funzione per sparare gli alieni
    setInterval(alienShooting, 2000); // Ogni 2000 ms, alcuni alieni sparano
}

// Genera gli alieni
function createAliens() {
    aliens = [];
    for (let row = 0; row < alienRows; row++) {
        for (let col = 0; col < alienCols; col++) {
            aliens.push({
                x: 50 + col * 45,
                y: 30 + row * 30,
                width: 40,
                height: 20,
                alive: true
            });
        }
    }
}

// Funzione per aggiornare il gioco
function update(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Pulisce il canvas
    movePlayer();
    moveBullets();
    moveAlienBullets();
    checkCollisions();
    drawPlayer(ctx);
    drawAliens(ctx);
    drawBullets(ctx);
    drawAlienBullets(ctx);
}

// Funzione per disegnare la navicella del giocatore
function drawPlayer(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Funzione per disegnare gli alieni
function drawAliens(ctx) {
    ctx.fillStyle = "green";
    aliens.forEach(alien => {
        if (alien.alive) {
            ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
        }
    });
}

// Funzione per disegnare i proiettili
function drawBullets(ctx) {
    ctx.fillStyle = "yellow";
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Funzione per disegnare i proiettili degli alieni
function drawAlienBullets(ctx) {
    ctx.fillStyle = "red";
    alienBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Funzione per muovere il giocatore
function movePlayer() {
    if (player.movingLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (player.movingRight && player.x + player.width < 400) {
        player.x += player.speed; // Limita il movimento al canvas
    }
}

// Funzione per sparare
function fireBullet() {
    if (bullets.length < 5) { // Limita a 5 proiettili sullo schermo
        bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y,
            width: 5,
            height: 10,
            speed: 7
        });
    }
}

// Funzione per muovere i proiettili
function moveBullets() {
    bullets.forEach(bullet => {
        bullet.y -= bullet.speed;
    });
    bullets = bullets.filter(bullet => bullet.y > 0); // Rimuove i proiettili che escono dallo schermo
}

// Funzione per muovere i proiettili degli alieni
function moveAlienBullets() {
    alienBullets.forEach(bullet => {
        bullet.y += bullet.speed; // I proiettili degli alieni si muovono verso il basso
    });
    alienBullets = alienBullets.filter(bullet => bullet.y < 400); // Rimuove i proiettili che escono dallo schermo
}

// Funzione per controllare collisioni tra proiettili e alieni
function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        aliens.forEach(alien => {
            if (alien.alive && bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.height + bullet.y > alien.y) {
                alien.alive = false; // Uccide l'alieno
                bullets.splice(bulletIndex, 1); // Rimuove il proiettile
                score += 100; // Aggiunge 100 punti per ogni alieno colpito
                document.getElementById('score').innerText = "Punteggio: " + score; // Aggiorna il punteggio
            }
        });
    });

    // Controlla collisioni tra proiettili alieni e giocatore
    alienBullets.forEach((bullet, bulletIndex) => {
        if (bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.height + bullet.y > player.y) {
            lives -= 1; // Perde una vita
            alienBullets.splice(bulletIndex, 1); // Rimuove il proiettile
            updateLivesDisplay();
            if (lives <= 0) {
                endGame();
            }
        }
    });
}

// Funzione per aggiornare il display delle vite
function updateLivesDisplay() {
    document.getElementById('lives').innerText = "❤️".repeat(lives);
}

// Funzione per terminare il gioco
function endGame() {
    clearInterval(gameInterval); // Ferma il gioco
    alert("Game Over! Punteggio finale: " + score);
    document.getElementById('gameSection').style.display = 'none'; // Nasconde il canvas
    document.getElementById('welcome').style.display = 'block'; // Torna alla pagina iniziale
}

// Funzione per far sparare agli alieni
function alienShooting() {
    const randomAlien = Math.floor(Math.random() * aliens.length); // Scegli un alieno casuale
    const alien = aliens[randomAlien];
    if (alien.alive && Math.random() < 0.2) { // 20% di probabilità di sparare
        alienBullets.push({
            x: alien.x + alien.width / 2 - 2.5,
            y: alien.y + alien.height,
            width: 5,
            height: 10,
            speed: 2 // Velocità dei proiettili alieni
        });
    }
}

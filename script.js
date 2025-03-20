// Función para mostrar un mensaje de bienvenida al cargar la página
window.onload = function() {
    alert("¡Bienvenidos a mi Blog Personal! Espero que disfruten de las publicaciones.");
}

// Función para navegar entre las secciones del blog de forma suave
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Obtiene el contexto del lienzo (canvas)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configuración inicial
const grid = 20;
let score = 0;
let snake = [{ x: 160, y: 160 }];
let food = { x: 200, y: 200 };
let dx = grid;
let dy = 0;
let changingDirection = false;
let gameInterval;
let gameStarted = false; // Variable para saber si el juego ha comenzado

// Función principal de juego
function game() {
    if (gameOver()) {
        alert("¡Game Over! Tu puntaje es: " + score);
        stopGame();
        return;
    }
    changingDirection = false;
    gameInterval = setTimeout(function () {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        game();
    }, 100);
}

// Dibuja la comida
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, grid, grid);
}

// Dibuja la serpiente
function drawSnake() {
    ctx.fillStyle = "green";
    snake.forEach(function (part) {
        ctx.fillRect(part.x, part.y, grid, grid);
    });
}

// Mueve la serpiente
function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); // Añade la cabeza de la serpiente al principio
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        spawnFood();
    } else {
        snake.pop(); // Elimina la cola de la serpiente
    }
}

// Dibuja el lienzo
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Genera nueva comida en una posición aleatoria
function spawnFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
        y: Math.floor(Math.random() * (canvas.height / grid)) * grid
    };
}

// Detecta si el juego terminó
function gameOver() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// Cambia la dirección de la serpiente
document.addEventListener("keydown", function (e) {
    if (changingDirection) return;
    changingDirection = true;
    if (e.key === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -grid;
    } else if (e.key === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = grid;
    } else if (e.key === "ArrowLeft" && dx === 0) {
        dx = -grid;
        dy = 0;
    } else if (e.key === "ArrowRight" && dx === 0) {
        dx = grid;
        dy = 0;
    }
});

// Función para iniciar el juego
function startGame() {
    if (gameStarted) return; // Si el juego ya ha comenzado, no hacer nada
    gameStarted = true;
    score = 0;
    snake = [{ x: 160, y: 160 }];
    food = { x: 200, y: 200 };
    dx = grid;
    dy = 0;
    game(); // Inicia el juego
    document.getElementById("startButton").disabled = true;
    document.getElementById("stopButton").disabled = false;
}

// Función para detener el juego
function stopGame() {
    clearTimeout(gameInterval); // Detiene el intervalo del juego
    gameStarted = false;
    document.getElementById("startButton").disabled = false;
    document.getElementById("stopButton").disabled = true;
}

// Asignamos los eventos a los botones
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("stopButton").addEventListener("click", stopGame);

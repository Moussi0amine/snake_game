// 🎨 1. Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // Used to draw shapes on canvas

const box = 20; // Size of one square (20*20 pixels)
let snake = [{ x:9 * box, y: 10 * box }]; // Snake starts with 1 square
let direction; // Current movement direction
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
};

let score = 0;

// 🎮 2. Controls
document.addEventListener("keydown", setDirection);

function setDirection(event) {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowUp" && direction !== "Down") direction = "UP";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN"; 
}

function draw() {
    // 🟦 1. Clear the canvas (black background)
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);

    // 🐍 2. Draw the snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "lime" : "green"; // Head = lighter
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}
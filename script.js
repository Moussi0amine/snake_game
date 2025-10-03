
const box = 20; // Size of one square (20x20 pixels)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // Used to draw shapes on canvas
let snake, direction, food, score, game, speed;

function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  score = 0;
  speed = 100;
  document.getElementById("score").innerText = "Score: 0";
  spawnFood();
  hideGameOver();
  if (game) clearInterval(game);
  game = setInterval(draw, speed);
}

function spawnFood() {
  let valid = false;
  while (!valid) {
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    };
    valid = !snake.some(part => part.x === food.x && part.y === food.y);
  }
}

function showGameOver() {
  document.getElementById("gameOverOverlay").style.display = "flex";
  document.getElementById("finalScore").innerText = "Final Score: " + score;
}
function hideGameOver() {
  document.getElementById("gameOverOverlay").style.display = "none";
}

document.getElementById("restartBtn").onclick = initGame;

initGame();


// 🎮 2. Controls
document.addEventListener("keydown", setDirection);

function setDirection(event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function draw() {
  // 🟦 1. Clear the canvas (black background)
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🐍 2. Draw the snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green"; // Head = lighter
    ctx.fillRect(snake[i].x, snake[i].y, box, box);

    ctx.strokeStyle = "#111"; // Border inside each block
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // 🍎 3. Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // 🕹 4. Move snake
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // 🍽 5. Check if snake eats food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    // Increase speed every 5 points (max 40ms)
    if (score % 5 === 0 && speed > 40) {
      speed -= 10;
      clearInterval(game);
      game = setInterval(draw, speed);
    }
    spawnFood();
  } else {
    snake.pop(); // Remove last part (so it moves forward)
  }

  // 🐍 6. Add new head
  let newHead = { x: snakeX, y: snakeY };

  // ☠️ 7. Game Over conditions
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    showGameOver();
    return;
  }

  snake.unshift(newHead); // Add new head in front
}

// 💥 Collision check (head with body)
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

// ⏱ Run the game every 100ms

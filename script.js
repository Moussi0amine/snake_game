
const box = 20; // Size of one square (20x20 pixels)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // Used to draw shapes on canvas
let snake, direction, food, score, game, speed, isReversed, canReverse, justReversed;

function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  isReversed = false;
  canReverse = true;
  justReversed = false;
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
  if (!canReverse) return;
  if (event.key === "ArrowLeft") {
    if (direction === "RIGHT") {
      isReversed = !isReversed;
      snake.reverse();
      direction = "LEFT";
      canReverse = false;
      justReversed = true;
    } else if (direction !== "RIGHT") {
      direction = "LEFT";
      canReverse = false;
    }
  } else if (event.key === "ArrowRight") {
    if (direction === "LEFT") {
      isReversed = !isReversed;
      snake.reverse();
      direction = "RIGHT";
      canReverse = false;
      justReversed = true;
    } else if (direction !== "LEFT") {
      direction = "RIGHT";
      canReverse = false;
    }
  } else if (event.key === "ArrowUp") {
    if (direction === "DOWN") {
      isReversed = !isReversed;
      snake.reverse();
      direction = "UP";
      canReverse = false;
      justReversed = true;
    } else if (direction !== "DOWN") {
      direction = "UP";
      canReverse = false;
    }
  } else if (event.key === "ArrowDown") {
    if (direction === "UP") {
      isReversed = !isReversed;
      snake.reverse();
      direction = "DOWN";
      canReverse = false;
      justReversed = true;
    } else if (direction !== "UP") {
      direction = "DOWN";
      canReverse = false;
    }
  }
}

function draw() {
  // 🟦 1. Clear the canvas (black background)
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  canReverse = true;

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
  let headIndex = isReversed ? snake.length - 1 : 0;
  let snakeX = snake[headIndex].x;
  let snakeY = snake[headIndex].y;

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
    if (isReversed) {
      snake.shift(); // Remove first part (tail)
    } else {
      snake.pop(); // Remove last part (tail)
    }
  }

  // 🐍 6. Add new head
  let newHead = { x: snakeX, y: snakeY };

  // ☠️ 7. Game Over conditions
  let hitWall = (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height
  );
  let hitBody = collision(newHead, snake);
  if (hitWall || (hitBody && !justReversed)) {
    clearInterval(game);
    showGameOver();
    return;
  }

  if (isReversed) {
    snake.push(newHead); // Add new head at end
  } else {
    snake.unshift(newHead); // Add new head at front
  }
  justReversed = false;
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

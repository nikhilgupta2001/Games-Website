let canvas, ctx;
let playerLeft, playerRight, ball;
const GAME_SPEED = 75;
let lastRenderTime = 0;
const BALL_SPEED = 3;
let direction = { x: BALL_SPEED, y: BALL_SPEED };
let keyMap = [];
let ScoreLeft = 0,
  ScoreRight = 0;
const HIT_SOUND = new Audio("../soundFX/HtiV2.wav");
HIT_SOUND.volume = 0.5;

const WIN_SOUND = new Audio('../soundFX/Powerup2.wav');
WIN_SOUND.volume = 0.5;

function init() {
  canvas = document.getElementById("gameBoard");
  ctx = canvas.getContext("2d");

  let Time = 4;

  ctx.font = "50px Arial Gray";
  ctx.fillText(`${Time}`, canvas.width / 2 - 12, canvas.height / 2 - 25);

  let intevalCountDown = setInterval(function () {
    Time--;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(`${Time}`, canvas.width / 2 - 12, canvas.height / 2 - 25);
  }, 1000);

  playerLeft = new Rectangle(10, 50, 10, 30, "white", 0);
  playerLeft.draw();

  ball = new Circle(150, 65, 2, "white", "white", 0);
  ball.draw();

  playerRight = new Rectangle(280, 50, 10, 30, "white", 0);
  playerRight.draw();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  setTimeout(function () {
    clearInterval(intevalCountDown);
    gameLoop();
  }, 4000);
}

function gameLoop(currentTime) {
  window.requestAnimationFrame(gameLoop);
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  if (secondsSinceLastRender < 1 / GAME_SPEED) return;

  lastRenderTime = currentTime;

  update();
}

function update() {
  move();

  ctx.clearRect(0, 0, 300, 150);

  playerLeft.draw();
  playerRight.draw();

  ball.x += direction.x;
  ball.y += direction.y;

  if (
    RectCircleColliding(ball, playerRight) ||
    RectCircleColliding(ball, playerLeft)
  ) {
    HIT_SOUND.pause();
    HIT_SOUND.currentTime = 0;
    HIT_SOUND.play();
    if (keyMap["s"]) {
      if (direction.y > 0 && direction.y <= 4) {
        direction.y++;
        if (direction.x > 0) {
          direction.x--;
        } else {
          direction.x++;
        }
      } else if (direction.y < 0 && direction.y >= -4) {
        direction.y--;
        if (direction.x > 0) {
          direction.x--;
        } else {
          direction.x++;
        }
      }
    } else if (keyMap["w"]) {
      if (direction.y > 0 && direction.y <= 4) {
        direction.y--;
        if (direction.x > 0) {
          direction.x++;
        } else {
          direction.x--;
        }
      } else if (direction.y < 0 && direction.y >= -4) {
        direction.y++;
        if (direction.x > 0) {
          direction.x++;
        } else {
          direction.x--;
        }
      }
    }

    if (direction.y > 4) {
      direction.y--;
    } else if (direction.y < -4) {
      direction.y++;
    }

    if (direction.x == 1) {
      direction.x++;
    } else if (direction.x == -1) {
      direction.x--;
    }

    direction.x = direction.x * -1;

    ball.x += direction.x * 2;
    ball.y += direction.y * 2;
  } else if (ball.y + ball.r < 0 || ball.y + ball.r > canvas.height) {
    HIT_SOUND.pause();
    HIT_SOUND.currentTime = 0;
    HIT_SOUND.play();

    direction.y = direction.y * -1;

    ball.x += direction.x * 2;
    ball.y += direction.y * 2;
  }

  if (ball.x + ball.r < 0 || ball.x + ball.r > canvas.width) {
    if (ball.x + ball.r < 0) {
      ScoreRight++;
    } else {
      ScoreLeft++;
    }

    WIN_SOUND.pause();
    WIN_SOUND.currentTime = 0;
    WIN_SOUND.play();

    direction = { x: BALL_SPEED, y: BALL_SPEED}

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    playerLeft.y = canvas.height / 2 - playerLeft.height / 2;
    playerRight.y = canvas.height / 2 - playerRight.height / 2;
  }

  drawUtil();
  checkForWin();

  ball.draw();
  //console.log(RectCircleColliding(ball, playerRight));
}

function checkForWin() {
  if (ScoreLeft >= 10) {
    if (
      confirm(
        "Left player won!. Press ok to restart and cancle to go to the main page"
      )
    ) {
      ScoreLeft = 0;
      ScoreRight = 0;
      location.reload();
    }
  } else if (ScoreRight >= 10) {
    if (
      confirm(
        "Right player won!. Press ok to restart and cancle to go to the main page"
      )
    ) {
      ScoreLeft = 0;
      ScoreRight = 0;
      location.reload();
    }
  }
}

function drawUtil() {
  ctx.restore();

  ctx.setLineDash([5, 3]);
  ctx.strokeStyle = "white"; /*dashes are 5px and spaces are 3px*/
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.height, canvas.width / 2);
  ctx.stroke();

  ctx.restore();

  ctx.font = "15px Arial White";
  ctx.fillText(ScoreLeft, canvas.width / 4, 15);
  ctx.fillText(ScoreRight, (canvas.width / 4) * 3, 15);
}

function move() {
  // S 83, W 87, arrowDown 40,  arrowUp 38
  if (keyMap["s"]) {
    playerLeft.y += 3;
    if (playerLeft.y + playerLeft.height > canvas.height) {
      playerLeft.y -= 3;
    }
  }
  if (keyMap["w"]) {
    playerLeft.y -= 3;
    if (playerLeft.y < 0) {
      playerLeft.y += 3;
    }
  }
  if (keyMap["ArrowUp"]) {
    playerRight.y -= 3;
    if (playerRight.y < 0) {
      playerRight.y += 3;
    }
  }
  if (keyMap["ArrowDown"]) {
    playerRight.y += 3;
    if (playerRight.y + playerRight.height > canvas.height) {
      playerRight.y -= 3;
    }
  }
}

document.addEventListener("keydown", (event) => {
  keyMap[event.key] = true;
});
document.addEventListener("keyup", (event) => {
  delete keyMap[event.key];
});

function RectCircleColliding(circle, rect) {
  var distX = Math.abs(circle.x - rect.x - rect.width / 2);
  var distY = Math.abs(circle.y - rect.y - rect.height / 2);

  if (distX > rect.width / 2 + circle.r) {
    return false;
  }
  if (distY > rect.height / 2 + circle.r) {
    return false;
  }

  if (distX <= rect.width / 2) {
    return true;
  }
  if (distY <= rect.height / 2) {
    return true;
  }

  var dx = distX - rect.width / 2;
  var dy = distY - rect.height / 2;
  return dx * dx + dy * dy <= circle.r * circle.r;
}

document.addEventListener("DOMContentLoaded", init);

class Rectangle {
  constructor(
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    fillColor = "",
    strokeColor = "black",
    strokeWidth = 2
  ) {
    this.x = Number(x);
    this.y = Number(y);
    this.width = Number(width);
    this.height = Number(height);
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
  }

  get area() {
    return this.width * this.height;
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height;
  }

  draw() {
    // destructuring
    const { x, y, width, height, fillColor, strokeColor, strokeWidth } = this;

    //ctx.save();
    ctx.setLineDash([1, 0]);
    ctx.fillStyle = fillColor;
    ctx.lineWidth = strokeWidth;

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.rect(x, y, width, height);

    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}

class Circle {
  constructor(
    x = 0,
    y = 0,
    radius = 0,
    fillColor = "",
    strokeColor = "",
    strokeWidth = 2
  ) {
    this.x = Number(x);
    this.y = Number(y);
    this.r = radius;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
  }

  get area() {
    return Math.floor(this.r * this.r * Math.PI);
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.r;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.radius;
  }

  get radius() {
    return this.r;
  }

  draw() {
    // destructuring
    const { x, y, radius, fillColor, strokeColor, strokeWidth } = this;

    ctx.save();

    ctx.fillStyle = fillColor;
    ctx.lineWidth = strokeWidth;

    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
  move({ xNew, yNew }) {
    const { x, y, radius, fillColor, strokeColor, strokeWidth } = this;

    this.fillColor = "black";
    this.strokeColor = "black";

    ctx.save();

    ctx.fillStyle = fillColor;
    ctx.lineWidth = strokeWidth;

    ctx.beginPath();
    ctx.strokeStyle = strokeColor;
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}

const board_border = "black";
const board_background = "white";
const snake_col = "lightblue";
const snake_border = "darkblue";

let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];

let changing_direction = false;

let dx = 10;
let dy = 0;

const snakeboard = document.getElementById("snakeboard");
const snakeboard_ctr = snakeboard.getContext("2d");
main();

document.addEventListener("keydown", change_direction);

function main() {
  if (has_game_ended()) return;

  changing_direction = false;
  setTimeout(function onTick() {
    clear_board();
    move_snake();
    drawSnake();

    main();
  }, 100);
}

//draw a border around the canvas
function clear_board() {
  //select the colour to fill the drawing
  snakeboard_ctr.fillStyle = board_background;
  //select the colour for the border of the canvas
  snakeboard_ctr.strokestyle = board_border;
  //draw a 'filled' rectangle to cover the entire canvas
  snakeboard_ctr.fillRect(0, 0, snakeboard.width, snakeboard.height);
  //draw a 'border' around the entire canvas
  snakeboard_ctr.strokeRect(9, 0, snakeboard.width, snakeboard.height);
}

//draw the snake on the canvas
function drawSnake() {
  snake.forEach(drawSnakePart);
}

//draw one snake part
function drawSnakePart(snakePart) {
  //set the colour of the snake part
  snakeboard_ctr.fillStylem = snake_col;
  //set the border colour of the snake part
  snakeboard_ctr.strokestyle = snake_border;
  snakeboard_ctr.fillReact(snakePart.x, snakePart.y, 10, 10);
  //draw a border around the snake part
  snakeboard_ctr.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function has_game_ended() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeboard.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - 10;
  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function random_food(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function gen_food() {
  //generate a random number the food x-coordinate
  food_x = random_food(0, snakeboard.width - 10);
  //generate a random number for the food y-coordinate
  food_y = random_food(0, snakeboard.height - 10);
  //if the new food location is where the snake currently is generate a new food location
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) gen_food();
  });
}

function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  //prevent the snake from reversing

  if (changing_direction) return;
  changing_direction = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function move_snake() {
  //create the new snake's head
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  //add new head to beginnging of snake body
  snake.unshift(head);
  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  if (has_eaten_food) {
    //increase food
    score += 10;
    //display score on screen
    document.getElementById("score").innerHTML = score;
    //generate new food location
    gen_food();
  } else {
    //remove the last part of snake body
    snake.pop();
  }
}

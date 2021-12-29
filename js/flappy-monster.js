//scenarios
let INITIAL = 1;
let GAME_PLAYING = 2;
let GAME_OVER = 3;

function FlappyMonster(canvas) {
  let game = this;

  //global attr
  game.canvas = canvas;
  game.context = game.canvas.getContext("2d");

  //game starts state
  game.currentState = INITIAL;

  //game speed
  game.velocity = 5;

  //bind events
  game.bindEvents();

  //create game objects
  game.createObjects();
}

FlappyMonster.prototype.start = function () {
  let game = this;

  //start the game
  window.requestAnimationFrame(function () {
    game.runGameLoop();
  });
};
FlappyMonster.prototype.runGameLoop = function () {
  let game = this;

  //game state
  switch (game.currentState) {
    case INITIAL:
      game.drawInitialScreen();
      break;
    case GAME_PLAYING:
      game.drawGamePlayingScreen();
      break;
    case GAME_OVER:
      game.drawGameOverScreen();
      break;
  }
  window.requestAnimationFrame(function () {
    game.runGameLoop();
  });
};
FlappyMonster.prototype.drawInitialScreen = function () {
  let game = this;

  //draw

  //bg
  game.context.fillStyle = "black";
  game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);

  //text
  game.context.fillStyle = "white";
  game.context.font = "36px Arial";
  game.context.textAlign = "center";
  game.context.fillText(
    "Click to start the game",
    game.canvas.width / 2,
    game.canvas.height / 2
  );
};
FlappyMonster.prototype.drawGamePlayingScreen = function () {
  let game = this;

  //clear canvas
  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);

  //bg
  game.animateBackground();

  //scoreboard
  game.gameScore.draw();

  //draw walls
  game.drawWalls();
  //   console.log(game.wallFactory.walls);

  //draw monster
  game.monster.draw();

  //collisions
  game.checkCollisions();
};

FlappyMonster.prototype.checkCollisions = function () {
  let game = this;

  let walls = game.wallFactory.walls;
  for (let i = 0; i < walls.length; i++) {
    if (game.isCollided(game.monster, walls[i])) {
      game.currentState = GAME_OVER;
    }
  }
};
FlappyMonster.prototype.isCollided = function (monster, wall) {
  let game = this;
  let isCollided = true;

  //monster coords
  let monsterTop = game.monster.y;
  let monsterBottom = game.monster.y + game.monster.h;
  let monsterRight = game.monster.x + game.monster.w;
  let monsterLeft = game.monster.x;

  //wall coords
  //lower wall top
  let wallTop = wall.y + wall.h + wall.gap;
  let wallBottom = wall.y + wall.h; //upper wall bottom
  let wallRight = wall.x + wall.w;
  let wallLeft = wall.x;

  if (
    (monsterBottom < wallTop && monsterTop > wallBottom) ||
    monsterLeft > wallRight ||
    monsterRight < wallLeft
  ) {
    isCollided = false;
  }

  return isCollided;
};

FlappyMonster.prototype.drawGameOverScreen = function () {
  let game = this;
  //bg
  game.context.fillStyle = "black";
  game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);

  //score
  game.context.fillStyle = "white";
  game.context.font = "45px Arial";
  game.context.textAlign = "center";
  game.context.fillText(
    `Score : ${game.gameScore.score}`,
    game.canvas.width / 2,
    game.canvas.height / 2 - 100
  );

  //text
  game.context.fillStyle = "white";
  game.context.font = "36px Arial";
  game.context.textAlign = "center";
  game.context.fillText(
    "Game Over :( Press R to restart!",
    game.canvas.width / 2,
    game.canvas.height / 2
  );
};

FlappyMonster.prototype.bindEvents = function () {
  let game = this;
  //mouse listeners
  game.canvas.addEventListener("click", function (event) {
    switch (game.currentState) {
      case INITIAL:
        game.wallFactory.generateWalls();
        //score
        game.gameScore = new GameScore(game.canvas);
        game.gameScore.x = game.canvas.width - 100;
        game.gameScore.y = 80;
        game.currentState = GAME_PLAYING;
        break;
      case GAME_PLAYING:
        game.monster.vy = -1 * game.velocity;
        break;
    }
  });
  window.addEventListener("keydown", function (event) {
    switch (game.currentState) {
      case GAME_OVER:
        if (event.code === "KeyR") {
          game.reset();
          game.currentState = GAME_PLAYING;
        }
        break;
    }
  });
};

FlappyMonster.prototype.createObjects = function () {
  let game = this;

  //game bg
  game.background = new GameBackground("images/back.png", game.canvas);
  game.background2 = new GameBackground("images/back.png", game.canvas);
  game.background2.x = game.canvas.width;

  //walls
  game.wallFactory = new WallFactory(game.canvas);

  //monster
  game.monster = new Monster("images/monster.png", game.canvas);
};

FlappyMonster.prototype.animateBackground = function () {
  let game = this;
  game.background.draw();
  game.background2.draw();

  //bg1
  if (Math.abs(game.background.x) > game.canvas.width) {
    game.background.x = game.canvas.width - game.velocity;
  }
  game.background.x -= game.velocity;

  //bg2 for empty space
  if (Math.abs(game.background2.x) > game.canvas.width) {
    game.background2.x = game.canvas.width - game.velocity;
  }
  game.background2.x -= game.velocity;
};

FlappyMonster.prototype.removeExtraWalls = function () {
  let game = this;

  //draw logic

  let walls = game.wallFactory.walls;
  for (let i = 0; i < walls.length; i++) {
    if (walls[i].x + walls[i].w < 0) walls.shift();
  }
};
FlappyMonster.prototype.drawWalls = function () {
  let game = this;

  //draw logic

  let walls = game.wallFactory.walls;
  for (let i = 0; i < walls.length; i++) {
    walls[i].draw();
    walls[i].x = walls[i].x - game.velocity;
  }
  game.removeExtraWalls();
};

FlappyMonster.prototype.reset = function () {
  let game = this;

  //reset states
  game.gameScore.start = new Date();
  game.gameScore.score = 0;
  game.wallFactory.walls = [];
  game.monster.x = 115;
  game.monster.y = 115;
};

function GameScore(canvas) {
  let gameScore = this;
  //global attr
  gameScore.canvas = canvas;
  gameScore.context = gameScore.canvas.getContext("2d");

  //specs (time)
  gameScore.start = new Date();
  gameScore.score = 0;
  gameScore.x = 0;
  gameScore.y = 0;
}
GameScore.prototype.draw = function () {
  let gameScore = this;
  //draw

  let draw = new Date();
  gameScore.score = parseFloat((draw - gameScore.start) / 1000).toFixed(1);

  gameScore.context.font = "45px Verdana";
  gameScore.context.fillText(gameScore.score, gameScore.x, gameScore.y);
};

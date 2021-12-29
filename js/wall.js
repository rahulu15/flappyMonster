function Wall(canvas) {
  let wall = this;
  wall.canvas = canvas;
  wall.context = wall.canvas.getContext("2d");

  //specs
  wall.x = canvas.width;
  wall.y = 0;
  wall.w = 100;
  wall.h = 0;
  wall.gap = 0;
  wall.color = getRandomColor();
}

Wall.prototype.draw = function () {
  let wall = this;

  //color
  wall.context.fillStyle = wall.color;
  //draw upper
  wall.context.fillRect(wall.x, wall.y, wall.w, wall.h);

  //draw lower
  wall.context.fillRect(wall.x, wall.h + wall.gap, wall.w, wall.canvas.height);
};

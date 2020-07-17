const canvas_w = 512;
const canvas_h = 512;

const wall = []
let brick;

function setup() {
  createCanvas(canvas_w, canvas_h);
  rectMode(CENTER);

  brick = new Brick(width / 2, height / 2, 40, 15);
}


function draw() {
  background(200);
  brick.draw();
}

class Brick {
  constructor(x, y, w, h) {
    this.p = createVector(x, y);
    this.w = w;
    this.h = h;
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);
    stroke(10, 200);
    strokeWeight(3);
    fill(130, 30, 30);
    rect(0, 0, this.w, this.h);
    pop();
  }
}

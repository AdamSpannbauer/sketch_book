const canvas_w = 512;
const canvas_h = 512;

let board_model;
let stickman_model;

let board;
let stickman;

function preload() {
  board_model = loadModel('assets/shitty_skateboard.obj', true);
  stickman_model = loadModel('assets/shitty_stickman.obj', true);
}

function setup() {
  createCanvas(canvas_w, canvas_h, WEBGL);
  angleMode(DEGREES);

  board = new Board(createVector(0, height / 5));
  stickman = new StickMan(createVector(0, -35));
}

function draw() {
  background(80, 80, 200);
  
  pointLight(100, 255, 255, 0, -height / 4, 0);
  pointLight(255, 100, 255, 0, height / 4, 0);
  pointLight(255, 255, 100, width / 4, 0, 0);
  pointLight(100, 100, 255, 0, -width / 4, 0);
  
  scale(1.2)
  rotateY(10 + frameCount);

  stickman.draw();

  board.draw();
  board.az += 3;
}


class Board {
  constructor(pos) {
    this.pos = pos;

    this.ay = 90;
    this.ax = 185;
    this.az = 20;
  }

  draw() {
    push();

    translate(this.pos.x, this.pos.y, this.pos.z);
	  rotateY(this.ay);
	  rotateX(this.ax);
	  rotateZ(this.az);

	 	ambientMaterial(200);
    noStroke();

    model(board_model);

	  pop();
  }
}


class StickMan {
  constructor(pos) {
    this.pos = pos;

    this.ay = 270;
    this.ax = 185;
    this.az = 0;
  }

  draw() {
    push();

	  translate(this.pos.x, this.pos.y, this.pos.z);
	  rotateY(this.ay);
	  rotateX(this.ax);
	  rotateZ(this.az);

	  ambientMaterial(200);
	  noStroke();

	  model(stickman_model);

	  pop();
  }
}

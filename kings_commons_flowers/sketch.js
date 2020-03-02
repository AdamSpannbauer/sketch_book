const canvas_w = 512;
const canvas_h = 512;

let a = 0;
const da = 0.2;

function setup() {
  createCanvas(canvas_w, canvas_h);
  angleMode(DEGREES);
}


function draw() {
  background(56, 112, 191);
  translate(width / 2, height / 2);
  lines();
  push();
  rotate(a);
  flower();
  pop();
  spiral();

  a += da;
}


function lines() {
  randomSeed(42);
  const n_pts = 10;
  const n_lines = 40;

  push();
  noFill();
  stroke(230);
  strokeWeight(10);

  for (let j = 0; j < n_lines; j++) {
  	push();

  	const angle = map(j, 0, n_lines, 0, 360);
  	rotate(angle);

  	beginShape();
	  curveVertex(0, 0);
	  const max_y = height / 2 + random(0, 50);
	  for (let i = 0; i < n_pts; i++) {
	    const x = random(-20, 20);
	    const y = map(i, 0, n_pts, 0, max_y);
	    curveVertex(x, y);
	  }
	  endShape();
	  pop();
  }
  pop();
}


function petal() {
  const pts = [
    createVector(-10, 10),
    createVector(-30, 50),
    createVector(-40, 100),
    createVector(0, 250),
    createVector(40, 100),
    createVector(30, 50),
    createVector(10, 10),
  ];

  push();
  fill([131, 111, 76]);
  stroke([126, 106, 71]);
  strokeWeight(3);

  beginShape();
  for (const pt of pts) {
  	curveVertex(pt.x, pt.y);
  }
  endShape(CLOSE);

  pop();
}

function spiral() {
  const rs = [50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 4, 3, 2, 1];
  const n = 10;
  push();
  noFill();
  stroke([195, 182, 162]);
  strokeWeight(3);
  beginShape();
  for (const r of rs) {
  	for (let i = 0; i < n; i++) {
  		const angle = map(i, 0, n, 0, 360);
  		const x = cos(angle) * r;
  		const y = sin(angle) * r;

  		curveVertex(x, y);
  	}
  }
  endShape();
  pop();
}

function flower() {
  const n = 5;
  for (let i = 0; i < n; i++) {
    push();
    const angle = map(i, 0, n, 0, 360);
    rotate(angle);
    petal();

    rotate(180);
    petal();

    pop();
  }
}

const canvas_w = 512;
const canvas_h = 512;

const wavy_lines = [];

const colors = [
  '#D69D47',
  '#D0BE51',
  '#C9C0CA',
  '#394F3E',
  '#9F5F2F',
  '#486A88',
  '#D4BD38',
  '#9EA993',
];

function setup() {
  createCanvas(canvas_w, canvas_h);

  const n_lines = 60;
  const buffer = 0;
  const w = (width * 2) / n_lines;

  for (let i = 0; i < n_lines; i++) {
  	const x1 = buffer + w * i - 100;
  	const x2 = buffer + w * (i + 1) - 100;
  	const wavy_line = new WavyLine(x1, -100, x2, height + 100, color(random(colors)));
  	wavy_lines.push(wavy_line);
  }
}

let a = 0;
const da = 0.001;
function draw() {
  background(40);

  push();
  translate(width / 2, height / 2);
  rotate(a);
  a += da;
  translate(-width / 2, -height / 2);
  for (const wavy_line of wavy_lines) {
  	wavy_line.draw();
  	wavy_line.update();
  }
  pop();

  noStroke();
  fill(40);
  rect(0, 0, width, 30);
  rect(0, height - 30, width, 30);
  rect(0, 0, 30, height);
  rect(width - 30, 0, 30, height);
}


class WavyLine {
  constructor(x1, y1, x2, y2, f) {
    this.p1 = createVector(x1, y1);
    this.p2 = createVector(x2, y2);
    this.fill = f;
    this.fill.levels[0] += random(-20, 20);
    this.fill.levels[1] += random(-20, 20);
    this.fill.levels[2] += random(-20, 20);
    this.t = 0;

    this.pts = [];
    this.og_pts = [];
    this.n_pts = 10;
    this.gen_points();
  }

  gen_points() {
    const w = this.p2.x - this.p1.x;
    const h = this.p2.y - this.p1.y;

    const step_x = w / this.n_pts;
    const step_y = h / this.n_pts;

    // Start in top left and gen pts clockwise

    // Top edge
    this.pts.push(this.p1);
    this.pts.push(this.p1);
    for (let { x } = this.p1; x < this.p2.x; x += step_x) {
    	const pt = createVector(x, this.p1.y);
    	this.pts.push(pt);
    }

    // Right edge
    this.pts.push(createVector(this.p2.x, this.p1.y));
    this.pts.push(createVector(this.p2.x, this.p1.y));
    for (let { y } = this.p1; y < this.p2.y; y += step_y) {
    	const pt = createVector(this.p2.x, y);
    	this.pts.push(pt);
    }

    // Bottom edge
    this.pts.push(this.p2);
    this.pts.push(this.p2);
    for (let { x } = this.p2; x > this.p1.x; x -= step_x) {
    	const pt = createVector(x, this.p2.y);
    	this.pts.push(pt);
    }

    // Left edge
    this.pts.push(createVector(this.p1.x, this.p2.y));
    this.pts.push(createVector(this.p1.x, this.p2.y));
    for (let { y } = this.p2; y > this.p1.y; y -= step_y) {
    	const pt = createVector(this.p1.x, y);
    	this.pts.push(pt);
    }

    for (const pt of this.pts) {
    	this.og_pts.push(pt.copy());
    }
  }

  update() {
  	for (let i = 0; i < this.pts.length; i++) {
  		const d = dist(this.og_pts[i].x, this.og_pts[i].y, width / 2, height / 2);
  		const scl = map(d, 0, 200, 0.1, 0, true);

  		const n = map(noise(d, this.t), 0, 1, -1, 1) * scl;

  		const w = this.p2.x - this.p1.x;
  		this.pts[i].x += n;
  		this.pts[i].x = constrain(this.pts[i].x, this.og_pts[i].x - w * 0.4, this.og_pts[i].x + w * 0.4);
  	}

  	this.t += 0.001;
  }

  draw() {
  	push();
  	fill(this.fill);
  	strokeWeight(1);
  	stroke(this.fill);
  	beginShape();
  	for (const pt of this.pts) {
  		curveVertex(pt.x, pt.y);
  	}
  	endShape(CLOSE);
  	pop();
  }
}

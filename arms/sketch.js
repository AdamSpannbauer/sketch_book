const canvas_w = 512;
const canvas_h = 512;

let ball;

const arms = [];
const n_arms = 20;

const seg_len = 20;
const n_seg = 8;

const border = seg_len * n_seg;

const n_steps = 300;


function setup() {
  createCanvas(canvas_w, canvas_h);
  angleMode(DEGREES);

  ball = new Ball();

  let p = createVector();
  for (let i = 0; i < n_arms; i++) {
  	p.x = map(i, 0, n_arms, 0, width);
  	const arm = new Arm(p, n_seg, seg_len, 0, 180);
  	arms.push(arm);
  }

  p = createVector(0, height);
  for (let i = 0; i < n_arms; i++) {
  	p.x = map(i, 0, n_arms, 0, width);

  	const arm = new Arm(p, n_seg, seg_len, 180, 360);
  	arms.push(arm);
  }

  p = createVector(0, 0);
  for (let i = 0; i < n_arms; i++) {
  	p.y = map(i, 0, n_arms, 0, height);

  	const arm = new Arm(p, n_seg, seg_len, -90, 90);
  	arms.push(arm);
  }

  p = createVector(width, 0);
  for (let i = 0; i < n_arms; i++) {
  	p.y = map(i, 0, n_arms, 0, height);

  	const arm = new Arm(p, n_seg, seg_len, 90, 270);
  	arms.push(arm);
  }
}


function draw() {
  background(30);

  for (const arm of arms) {
  	arm.update();
  	arm.draw();
  }

  ball.update();
  ball.draw();
}

class Ball {
  constructor() {
    this.x_off = createVector(0, 0);
    this.y_off = createVector(100, 0);

    this.d_off = 0.02
    
    this.d_x_off_x = this.d_off;
    this.d_y_off_x = this.d_off;
    this.d_x_off_y = 0;
    this.d_y_off_y = 0;

    this.steps = n_steps;

    this.min_x_off_x = this.x_off.x
    this.min_x_off_y = this.x_off.y
    this.min_y_off_x = this.y_off.x
    this.min_y_off_y = this.y_off.y

    this.max_x_off_x = this.x_off.x + this.d_off * this.steps
    this.max_x_off_y = this.x_off.y + this.d_off * this.steps
    this.max_y_off_x = this.y_off.x + this.d_off * this.steps
    this.max_y_off_y = this.y_off.y + this.d_off * this.steps

    this.p = createVector();
    this.r = 10;
    this.fill = 255;

    this.update();
  }

  update() {
  	this.x_off.x += this.d_x_off_x;
    this.y_off.x += this.d_y_off_x;
    this.x_off.y += this.d_x_off_y;
    this.y_off.y += this.d_y_off_y;

  	if (this.x_off.x >= this.max_x_off_x && this.d_x_off_y == 0) {
  		this.d_x_off_x = 0;
	    this.d_y_off_x = 0;
	    this.d_x_off_y = this.d_off;
	    this.d_y_off_y = this.d_off;
  	} else if (this.x_off.y >= this.max_x_off_y && this.d_x_off_x == 0) {
  		this.d_x_off_x = -this.d_off;
	    this.d_y_off_x = -this.d_off;
	    this.d_x_off_y = 0;
	    this.d_y_off_y = 0;
  	} else if (this.x_off.x <= this.min_x_off_x && this.d_x_off_y == 0) {
  		this.d_x_off_x = 0;
	    this.d_y_off_x = 0;
	    this.d_x_off_y = -this.d_off;
	    this.d_y_off_y = -this.d_off;
  	} else if (this.x_off.y <= this.min_x_off_y && this.d_x_off_x == 0) {
  		this.d_x_off_x = this.d_off;
	    this.d_y_off_x = this.d_off;
	    this.d_x_off_y = 0;
	    this.d_y_off_y = 0;

	    this.fill = 100
  	}

    this.p.set(map(noise(this.x_off.x, this.x_off.y), 0, 1, border, width - border),
			         map(noise(this.y_off.x, this.y_off.y), 0, 1, border, height - border));
  }

  draw() {
  	push();
  	noStroke();
  	fill(this.fill);
    ellipse(this.p.x, this.p.y, this.r * 2, this.r * 2);
    pop();
  }
}

class Arm {
  constructor(p, n_seg, seg_len, min_a, max_a) {
    this.p = p;
    this.n_seg = n_seg || 1;
    this.seg_len = seg_len || 50;

    this.min_a = min_a;
    this.max_a = max_a;

    this.segs = [];
    this.stroke = random(0, 100);

    let p1 = p.copy();
    for (let i = 0; i < this.n_seg; i++) {
      const seg = new ArmSeg(p1, this.seg_len, this.min_a, this.max_a);
      seg.strokeWeight = map(i, 0, this.n_seg, 10, 1);
      seg.stroke = this.stroke;

      this.segs.push(seg);
      p1 = seg.point_2();
    }
  }

  update() {
  	if (this.n_seg == 1) {
  		this.segs[0].update();
  	} else {
      for (let i = 1; i < this.n_seg; i++) {
	      this.segs[i - 1].update();
	      this.segs[i].p1 = this.segs[i - 1].point_2();
	    }
  	}
  }

  draw() {
  	for (const seg of this.segs) {
	  	seg.draw();
	  }
  }
}

class ArmSeg {
  constructor(p, seg_len, min_a, max_a) {
    this.p1 = p;
    this.seg_len = seg_len || 50;

    this.strokeWeight = 10;
    this.stroke = [100];

    this.min_a = min_a;
    this.max_a = max_a;

    this.a_off = createVector(random(5000), random(5000));
    this.d_a_off = 0.005;
    
    this.angle = 0;
    this.set_angle();

    this.steps = n_steps;

    this.d_a_off_x = this.d_a_off
    this.d_a_off_y = 0;
    this.min_a_off_x = this.a_off.x
    this.min_a_off_y = this.a_off.y
    this.max_a_off_x = this.a_off.x + this.d_a_off * this.steps
    this.max_a_off_y = this.a_off.y + this.d_a_off * this.steps
  }

  point_2() {
  	const dx = this.seg_len * cos(this.angle);
  	const dy = this.seg_len * sin(this.angle);

  	return createVector(this.p1.x + dx, this.p1.y + dy);
  }

  set_angle() {
  	this.angle = map(noise(this.a_off.x, this.a_off.y), 0.2, 0.8, this.min_a, this.max_a);
  }

  update() {
	  this.a_off.x += this.d_a_off_x;
	  this.a_off.y += this.d_a_off_y;

  	if (this.a_off.x >= this.max_a_off_x && this.d_a_off_y == 0) {
  		this.d_a_off_x = 0;
	    this.d_a_off_y = this.d_a_off;
  	} else if (this.a_off.y >= this.max_a_off_y && this.d_a_off_x == 0) {
  		this.d_a_off_x = -this.d_a_off;
	    this.d_a_off_y = 0;
  	} else if (this.a_off.x <= this.min_a_off_x && this.d_a_off_y == 0) {
  		this.d_a_off_x = 0;
	    this.d_a_off_y = -this.d_a_off;
  	} else if (this.a_off.y <= this.min_a_off_y && this.d_a_off_x == 0) {
  		this.d_a_off_x = this.d_a_off;
	    this.d_a_off_y = 0;
  	}

    this.set_angle();

    this.t += this.d_t;
  }

  draw() {
  	push();

  	stroke(this.stroke);
  	strokeWeight(this.strokeWeight);

  	const p2 = this.point_2();
  	line(this.p1.x, this.p1.y, p2.x, p2.y);

  	pop();
  }
}

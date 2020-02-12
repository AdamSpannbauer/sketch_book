const canvas_w = 512;
const canvas_h = 512;

const r = [209, 0, 0];
const o = [255, 102, 34];
const y = [255, 218, 33];
const g = [51, 255, 0];
const b = [17, 51, 204];
const i = [34, 0, 102];
const v = [51, 0, 68];
const roygbiv = [r, o, y, g, b, i, v];

let squeegee;

function setup() {
  createCanvas(canvas_w, canvas_h);
  angleMode(DEGREES);
  squeegee = new Squeegee(300, roygbiv, true);
}


function draw() {
  clear();
  background(130);
  squeegee.draw();
}


class Squeegee {
  constructor(l, cs, fe) {
  	this.x = width / 2;
  	this.y = height / 2;
  	this.angle = 0;

  	this.hist = [];
  	this.max_hist = 40;

  	this.delta_x = 0.0;
  	this.delta_y = 0.0;
  	this.delta_angle = 0.0;

    this.l = l || 70;
    this.cs = cs || roygbiv;

    this.seg_l = this.l / cs.length;
    this.seg_h = 70;

    this.change_every = 50;
    this.time_since_change = this.change_every;
    this.t = 0;

    this.fe = fe || true;
    if (this.fe) {
    	this.hist.push(this.figure_eight());
    } else {
    	this.hist.push(createVector(this.x, this.y, this.angle));
    }
  }

  draw() {
  	for (let j = 0; j < this.hist.length; j++) {
  		push();
  		const p = this.hist[j];
	  	// const alpha = map(j, 0, this.hist.length, 200, 255);
	  	const alpha = 255;

	  	translate(p.x, p.y);
	  	rotate(p.z);
	  	translate(-this.l / 2, -this.seg_h / 2);

	  	let x = 0;
	  	let y = 0;

	  	for (let i = 0; i < this.cs.length; i++) {
	  		noStroke();
	  		const [ri, gi, bi] = this.cs[i];
	  		fill(ri, gi, bi, alpha);

	  		// rect(x, y, this.seg_l * 1.3, this.seg_h, 10);
	  		ellipse(x, y, this.seg_h);

	  		fill(50 * (i % 2));
	  		ellipse(x, y, 10);

	  		x += this.seg_l;
	  		y += 0;
	  	}
	  	pop();
  	}

  	let new_loc;
  	if (this.fe) {
  		new_loc = this.figure_eight();
  	} else {
  		new_loc = this.rand_move();
  	}

  	this.hist.push(new_loc);
  	if (this.hist.length > this.max_hist) {
  		this.hist.splice(0, 1);
  	}
  }

  rand_move() {
  	if (this.time_since_change >= this.change_every) {
  		const change = random(-1, 1);
  		const rand = random();

  		if (rand <= 1 / 3) {
  			this.delta_x = change;
  		} else if (rand <= 2 / 3) {
  			this.delta_y = change;
  		} else {
  			this.delta_angle = change;
  		}

  		this.time_since_change = 0;
  	}

  	this.x += this.delta_x;
  	this.y += this.delta_y;
  	this.angle += this.delta_angle;

  	if (this.x >= width | this.x <= 0) {
  		this.delta_x *= -1;
  	}

  	if (this.y >= height | this.y <= 0) {
  		this.delta_y *= -1;
  	}

  	this.time_since_change++;

  	return (createVector(this.x, this.y, this.angle));
  }

  figure_eight() {
  	this.x = (cos(this.t) * width / 2) / 2 + width / 2;
  	this.y = (cos(this.t) * sin(this.t) * height) / 2 + height / 2;
  	this.angle = cos(this.t) * 360;

  	this.t += 0.75;

  	if (this.t >= 360) {
  		this.t -= 360;
  	}

  	return (createVector(this.x, this.y, this.angle));
  }
}

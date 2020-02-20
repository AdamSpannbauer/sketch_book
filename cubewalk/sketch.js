const canvas_w = 600;
const canvas_h = 600;

let cube;

let cube_w_div_d = -4;
const cube_w_div_min = 4;
const cube_w_div_max = 16;
let cube_w_div = cube_w_div_max;

let start_p;

function setup() {
  createCanvas(canvas_w, canvas_h, WEBGL);
  angleMode(DEGREES);
  rectMode(CENTER);

  const cube_w = width / cube_w_div;
  start_p = createVector(-cube_w, height / 2);
  cube = new Cube(start_p, cube_w);
}


function draw() {
  // background(30, 170, 45);
  background(0);

  cube.flip();
  cube.draw();

  rotate(90);
  cube.draw();

  rotate(90);
  cube.draw();

  rotate(90);
  cube.draw();

  if (cube.footprints.length == 0 & cube.t > cube.max_t & cube.offscreen()) {
  	cube_w_div += cube_w_div_d;
  	if (cube_w_div >= cube_w_div_max | cube_w_div <= cube_w_div_min) {
  		cube_w_div_d *= -1;
  	}

	  const cube_w = width / cube_w_div;
	  start_p = createVector(-cube_w, height / 2);
	  cube = new Cube(start_p, cube_w);
  }
}


function rand_sign() {
  const r = random(-1, 1);
  return abs(r) / r;
}


class Cube {
  constructor(p, w) {
    this.p = p;
    this.w = w;

    this.d_angle = 90 / 20;

    this.t = 0;
    this.max_t = 500;

    this.ax = 0;
    this.ay = 0;
    this.az = 0;

    this.d_ax = 0;
    this.d_ay = 0;
    this.d_az = 0;

    this.flipping_x = false;
    this.flipping_y = false;

    this.flip_start_p = this.p.copy();
    this.flip_end_p = this.p.copy();

    this.footprints = [];
    this.max_footprints = 100;

    // this.fill = [100, 50, 200, 100];
    this.fill = [100, 80, 151, 200];
    this.stroke = [0, 0, 0, 200];

    // this.fp_fill = [100, 100, 100, 30];
    this.fp_fill = [100, 80, 151, 10];
  }

  draw() {
  	for (const fp of this.footprints) {
    	push();
    	translate(fp.x - width / 2,
    		        fp.y - height / 2,
		     			  fp.z - this.w);

    	fill(this.fp_fill);
    	noStroke();
    	rect(0, 0, this.w * 0.7, this.w * 0.7);
    	pop();
    }

    push();
    fill(this.fill);
    stroke(this.stroke);

    translate(this.p.x - width / 2,
	  					this.p.y - height / 2,
		     			this.p.z);

    rotateX(this.ax);
    rotateY(this.ay);
    rotateZ(this.az);

    box(this.w);
    pop();
  }

  flipping() {
  	return this.flipping_x | this.flipping_y;
  }

  offscreen() {
  	return (this.p.x + this.w < 0 | this.p.x - this.w > width
  		    | this.p.y + this.w < 0 | this.p.y - this.w > height);
  }

  flip_x() {
  	this.ay += this.d_ay;
  	this.p.x = map(abs(this.ay), 0, 90, this.flip_start_p.x, this.flip_end_p.x);

  	if (abs(this.ay) >= 90) {
  		this.ay = 0;
  		this.d_ay = 0;
  		this.flipping_x = false;

  		if (!this.offscreen()) {
  			this.footprints.push(this.p.copy());
  		}

  		if (this.footprints.length > this.max_footprints) {
  			this.footprints.splice(0, 1);
  		}
  	}
  }

  flip_y() {
  	this.ax -= this.d_ax;
  	this.p.y = map(abs(this.ax), 0, 90, this.flip_start_p.y, this.flip_end_p.y);

  	if (abs(this.ax) >= 90) {
  		this.ax = 0;
  		this.d_ax = 0;
  		this.flipping_y = false;

  		if (!this.offscreen()) {
  			this.footprints.push(this.p.copy());
  		}

  		if (this.footprints.length > this.max_footprints) {
  			this.footprints.splice(0, 1);
  		}
  	}
  }

  flip() {
  	// this is bad...
	  if (this.flipping()) {
	  	this._flip();
	  } else if (this.t > this.max_t) {
	  	this._flip(createVector(1, 0, 0));
	  	this.footprints.splice(0, 2);
	  } else if (this.p.x < this.w) {
	  	this._flip(createVector(1, 0, 0));
	  } else if (this.p.x > width - this.w) {
	  	this._flip(createVector(-1, 0, 0));
	  } else if (this.p.y < this.w) {
	  	this._flip(createVector(0, 1, 0));
	  } else if (this.p.y > height - this.w) {
	  	this._flip(createVector(0, -1, 0));
	  } else if (random() > 0.5) {
	  	this._flip(createVector(0, rand_sign(), 0));
	  } else {
	  	this._flip(createVector(rand_sign(), 0, 0));
	  }

	  this.t++;
  }

  _flip(dir) {
  	if (this.flipping_x) {
  		this.flip_x();
  	} else if (this.flipping_y) {
  		this.flip_y();
  	} else {
  		let flip_vec;
  		if (abs(dir.x) > 0) {
	  		const flip_dir = abs(dir.x) / dir.x;
	  		flip_vec = createVector(flip_dir, 0, 0);

	  		this.flipping_x = true;

	  		this.d_ay = flip_dir * this.d_angle;
	  	} else if (abs(dir.y) > 0) {
	  		const flip_dir = abs(dir.y) / dir.y;
	  		flip_vec = createVector(0, flip_dir, 0);

	  		this.flipping_y = true;

	  		this.d_ax = flip_dir * this.d_angle;
	  	}

	  	flip_vec.mult(this.w);
  		this.flip_start_p = this.p.copy();
    	this.flip_end_p = this.p.copy();
    	this.flip_end_p.add(flip_vec);
  	}
  }
}

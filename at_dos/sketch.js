const canvas_w = 512;
const canvas_h = 512;

let shrink_arc;
let stroke_start = 5;

let r = 250;

function setup() {
  createCanvas(canvas_w, canvas_h);
  // background(90);
  background(236, 173, 97);

  shrink_arc = new ShrinkArc(r, 20, stroke_start);
}


function draw() {
  translate(width / 2, height / 2);

  shrink_arc.update();
  shrink_arc.draw();

  if (shrink_arc.is_done) {
  	r -= 50;
  	if (r <= 0) {
  		noLoop();
  	}

  	stroke_start -= 1.5;

  	if (stroke_start < 0.1) {
  		stroke_start = 0.1;
  	}

  	shrink_arc = new ShrinkArc(r, random(250), stroke_start);
  }
}


class ShrinkArc {
  constructor(r, s, sw) {
    this.stroke = color(s);
    this.stroke.setAlpha(80);

    this.strokeWeight = sw;

    this.start_off = 0.01;
    this.stop_off = 0.01;

    this.start_p = random(100);
    this.stop_p = random(100);

    this.start = 0;
    this.stop = 0;

    this.r = r;
    this.dr = -0.3;

    this.is_done = false;
  }

  update() {
    if (this.r > 0) {
      this.r += this.dr;
      this.start_p += this.start_off;
	  	this.stop_p += this.stop_off;

	  	this.start = map(noise(this.start_p), 0, 1, 0, TWO_PI * 2);
  		this.stop = map(noise(this.stop_p), 0, 1, 0, TWO_PI * 2);

  		if (this.start > this.stop) {
  			[this.start, this.stop] = [this.stop, this.start];
  		}

  		if (this.strokeWeight >= 0.1) {
  			this.strokeWeight -= 0.01;

  			if (this.strokeWeight < 0.1) {
  				this.strokeWeight = 0.1;
  			}
  		}
	  } else {
	  	this.is_done = true;
	  }
  }

  draw() {
    push();
    stroke(this.stroke);
    strokeWeight(this.strokeWeight);
    noFill();

    arc(0, 0, this.r * 2, this.r * 2, this.start, this.stop);
    pop();
  }
}

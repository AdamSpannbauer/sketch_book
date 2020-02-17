// const tonks_path = 'assets/tonks_beer.png';
const tonks_path = 'assets/beer.png';
// const tonks_path = 'assets/tre.jpg';
// const tonks_path = 'assets/mush_claw.jpg';
let img;
const vpad = 50;
const hpad = 150;

const background_color = [0, 0, 0, 0];

let circles = [];
const max_circles = 1000;
const gen_n = 10;

let t = 0;
let falling = false;

function preload() {
  img = loadImage(tonks_path);
}


function setup() {
  createCanvas(img.width + hpad * 2, img.height + vpad * 2);
  img.loadPixels();
}


function draw() {
  clear();
  background(20);

  if (circles.length < max_circles & t > 50) {
  	for (let i = 0; i < gen_n; i++) {
  		c = new Circle(background_color, circles, img, t);
  		if (c.growing) {
  			circles.push(c);
  		}
  	}
  }

  let total_growing = 0;
  let total_onscreen = 0;
  for (let i = 0; i < circles.length; i++) {
  	const c = circles[i];

  	if (t > 50) {
  		c.falling = falling;
  	}

  	c.grow(circles);
  	c.draw();

  	total_growing += c.growing;
  	total_onscreen += !c.offscreen;
  }

  if (total_growing == 0 & circles.length > 0 & !falling) {
  	t = 0;
  	falling = true;
  }

  if (total_onscreen == 0 & circles.length > 0 & t > 50) {
  	t = 0;
  	falling = false;
    circles = [];
  }

  t++;
}


function euclid_dist(x, y) {
  let total = 0;
  for (let i = 0; i < x.length; i++) {
    total += (x[i] - y[i]) ** 2;
  }

  return sqrt(total);
}


function get_color(x, y, img) {
  const index = (int(x) + int(y) * img.width) * 4;
  const r = img.pixels[index];
  const g = img.pixels[index + 1];
  const b = img.pixels[index + 2];
  const a = img.pixels[index + 3];
  const c = [r, g, b, a];

  return c;
}


class Circle {
  constructor(bc, circles, img, t) {
  	this.bc = bc;
    this.x = null;
    this.y = null;
    this.c = null;

    this.vx = random(-3, 3);
    this.vy = 0;
    this.ay = random(0.1, 0.4);
    this.falling = false;
    this.max_bounces = 5;
    this.bounces = 0;
    this.bounced = false;
    this.offscreen = false;

    this.t = t;
    this.max_t = 100000;

    this.r = 1;
    this.dr = 0.5;
    this.max_r = 100;

    this.growing = true;

    this.reset(circles, img);
  }

  reset(circles, img) {
  	let good_pos = false;
  	let tries = 0;
  	const max_tries = 20;

  	while (!good_pos) {
	  	this.x = random(hpad, width - hpad);
	  	this.y = random(vpad, height - vpad);
	  	this.c = get_color(this.x - hpad, this.y - vpad, img);

	  	const is_background = euclid_dist(this.c, background_color) < 30;
	  	good_pos = !this.is_overlapping(circles) & !is_background;

	  	if (this.t >= this.max_t) {
	  		this.c = 100;
	  		this.max_r = 300;
	  	}

	  	if (tries >= max_tries) {
	  		this.growing = false;
	  		break;
	  	}
	  	tries++;
  	}
  }

  is_overlapping(circles) {
  	let overlapping = false;
    for (const c of circles) {
  		const d = dist(c.x, c.y, this.x, this.y);
      const max_dist = c.r + this.r;

      if (d == 0) {
        continue;
      } else if (d < max_dist) {
        overlapping = true;
        break;
      }
    }

  	return overlapping;
  }

  grow(circles) {
  	if (this.growing) {
  		this.growing = !this.is_overlapping(circles) & this.max_r > this.r;
  		if (this.growing) {
  			this.r += this.dr;
  		}
  	}

  	if (this.falling) {
  		this.fall();
  	}
  }

  draw() {
    push();
    fill(this.c);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
    pop();
  }

  fall() {
  	this.vy += this.ay;

    this.x += this.vx;
  	this.y += this.vy;

  	if (!this.bounced) {
  		if (this.x > width | this.x < 0) {
  			this.vx *= -1;
  		}

  		if (this.y > height | this.y < 0) {
  			this.vy *= -0.8;
  			this.bounces += 1;
  		}
  	} else if (this.x - 1.1 * this.r > width | this.x + 1.1 * this.r < 0
  		    | this.y - 1.1 * this.r > height | this.y + 1.1 * this.r < 0) {
  			this.offscreen = true;
  	}

  	this.bounced = this.bounces >= this.max_bounces;

  }
}

const canvas_w = 512;
const canvas_h = 512;

const pokeballs = [];
const n_balls = 200;

function setup() {
  createCanvas(canvas_w, canvas_h);

  for (i = 0; i < n_balls; i++) {
  	pokeball = new Pokeball(random(30, 50));
		pokeballs.push(pokeball)
  }
  
}

function draw() {
  background(70);

  for (pokeball of pokeballs) {
  	pokeball.update();
  	pokeball.draw();
  }
}


class Pokeball {
  constructor(r) {
  	this.r = r;

    this.x = null;
    this.y = null;

    this.xp = random(100);
    this.yp = random(100);

    this.x_off = random(0.001, 0.01);
    this.y_off = random(0.001, 0.01);

    this.a = random(TWO_PI);
    this.da = random(-0.1, 0.1);
  }

  update() {
    this.a += this.da;

    this.xp += this.x_off;
    this.yp += this.y_off;

    this.x = noise(this.xp) * width * 2 - width / 2;
  	this.y = noise(this.yp) * height * 2 - height / 2;

  	this.r += random(-1, 1);
  }

  draw() {
    push();
    translate(this.x, this.y);
	  rotate(this.a);

	  strokeWeight(3);

	  fill(200, 0, 0);
	  arc(0, 0, this.r * 2, this.r * 2, 0, PI);

	  fill(255);
	  arc(0, 0, this.r * 2, this.r * 2, PI, 0);

	  line(-this.r, 0, this.r, 0);

	  fill(0);
	  ellipse(0, 0, this.r / 4, this.r / 4);

	  fill(255);
	  ellipse(0, 0, this.r / 6, this.r / 6);
    pop();
  }
}

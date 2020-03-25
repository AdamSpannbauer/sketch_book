const canvas_w = 512;
const canvas_h = 512;

let dos_outline_im;

const dos_colors = [
  [238, 202, 142],
  [201, 116, 46],
  [121, 117, 115],
];

const clear_colors = [[200, 200, 200]];

let colors = dos_colors;

const balls = [];
const add_balls = 1;

let fps_p;

function preload() {
  dos_outline_im = loadImage('assets/dos_trace.png');
}


function setup() {
  createCanvas(canvas_w, canvas_h);
  fps_p = createP();
  background(200);
  imageMode(CENTER);
  rectMode(CENTER);
}

let t = 0;
function draw() {
  fps_p.html(frameRate().toFixed(2));

  if (frameCount % 600 == 0 & colors.length != 1) {
  	colors = clear_colors;
  } else if (frameCount % 200 == 0 && colors.length == 1) {
  	colors = dos_colors;
  }

  if (frameCount % 30 == 0) {
  	for (let i = 0; i < add_balls; i++) {
	  	const ball = new Ball();
	  	balls.push(ball);
	  }
  }

  for (let i = balls.length - 1; i >= 0; i--) {
  	const ball = balls[i];
  	ball.update();
  	ball.draw();

  	if (ball.exploded) {
  		balls.splice(i, 1);
  	}
  }

  image(
  	dos_outline_im,
   	width / 2 + 10,
  	height / 2, 
  	200,
  	dos_outline_im.height / dos_outline_im.width * 200,
  );

  t++
}


class Ball {
  constructor() {
  	const r = random(100);
  	const angle = random(TWO_PI);
  	const x = cos(angle) * r + width / 2;
  	const y = sin(angle) * r + height / 2;

    this.p = createVector(x, y);
    this.c = random(colors);

    this.max_r = random(5, 20);
	  this.grow_time = map(this.max_r, 5, 20, 20, 50);

    this.r = 0;
	  this.age = 0;


    this.exploded = false;
  }

  update() {
  	if (this.age < this.grow_time) {
  		this.r = map(this.age, 0, this.grow_time, 0, this.max_r);
  		this.age++;
  	}
  }

  explode() {
  	const n_particles = 50;

  	push();

  	noStroke();
  	const c = [...this.c];
  	c.push(255);

  	translate(this.p.x, this.p.y);
  	const max_blast_r = this.r * 8;

  	for (let i = 0; i < n_particles; i++) {
  		const blast_r = random(max_blast_r);
  		const r = map(blast_r, 0, max_blast_r, this.r * 0.5, 1);

  		const angle = random(TWO_PI);
  		const x = cos(angle) * blast_r;
  		const y = sin(angle) * blast_r;

  		const alpha = map(blast_r, 0, max_blast_r, 255, 200);
  		c[3] = alpha;

  		push();
  		fill(c);
  		translate(x, y);
  		rotate(angle);
  		ellipse(0, 0, r * random(2, 7), r * 2);
  		pop();

  		if (blast_r < max_blast_r * 0.3) {
  			push();
  			stroke(c);
  			strokeWeight(r * 1.1);
  			line(0, 0, x, y);
  			pop();
  		}
  	}
  	pop();

  	this.exploded = true;
  }

  draw_grow() {
    push();
    fill(this.c);
    noStroke();
    ellipse(this.p.x, this.p.y, this.r * 2, this.r * 2);
    pop();
  }

  draw() {
  	if (this.age < this.grow_time) {
  		this.draw_grow();
  	} else if (!this.exploded) {
  		this.explode();
  	}
  }
}

const canvas_w = 512;
const canvas_h = 512;

let cp;
const ball_groups = [];

const suit_path = 'suit.png';
let suit;
const suit_w = 150;
let suit_h;

let g = 0;

let fps_p;

function preload() {
  suit = loadImage(suit_path);
}

function setup() {
  createCanvas(canvas_w, canvas_h);
  fps_p = createP();
  imageMode(CENTER);

  cp = createVector(
    width / 2,
    height / 2,
  );

  const ball_group = new BallGroup(cp, TWO_PI * 5 / 8, TWO_PI * 7 / 8, [50, 100], 200);
  ball_groups.push(ball_group);

  background(200);
}


function draw() {
  fps_p.html(frameRate().toFixed(1));

  if (frameCount > 2) {
	  for (let i = ball_groups.length - 1; i >= 0; i--) {
	  	const ball_group = ball_groups[i];

	  	ball_group.update();
	  	ball_group.draw();

	  	if (ball_group.done) {
	  		ball_groups.splice(i, 1);
	  	}
	  }
  }

  if (frameCount % 400 == 0) {
  	let c;
  	if (frameCount % 800 == 0) {
  		c = [50, 100];
  	} else if (g == 0) {
  		c = [230, 100, 210, 100];
  		g++;
  	} else if (g == 1) {
  		c = [110, 120, 255, 100];
  		g++;
  	} else if (g == 2) {
  		c = [110, 255, 110, 100];
  		g++;
  	} else {
  		c = [random(100, 255), random(100, 255), random(100, 255), 100];
  	}

  	const ball_group = new BallGroup(cp, TWO_PI * 5 / 8, TWO_PI * 7 / 8, c, 200);
  	ball_groups.push(ball_group);
  }

  suit_h = suit.height * suit_w / suit.width;
  image(suit, width / 2, height / 2 + suit_h / 2 + 10, suit_w, suit_h);
}


class NoiseLoop {
  constructor(r, len) {
    this.r = r;
    this.len = len;
    this.a = 0;

    // assumes 60 fps and that noise is being called every frame
    this.da = TWO_PI / (60 * this.len);

    this.cx = random(100);
    this.cy = random(100);
  }

  noise() {
    const x = cos(this.a) * this.r + this.cx;
    const y = sin(this.a) * this.r + this.cy;
    const val = noise(x, y);

    this.a += this.da;

    if (this.a >= TWO_PI) {
      this.a -= TWO_PI;
    }

    return val;
  }
}

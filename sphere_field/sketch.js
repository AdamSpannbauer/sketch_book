const canvas_w = 512;
const canvas_h = 512;

let nballs = 50;
let balls = [];

let warpspeed = false;
let gen_new = true;
let recolor = false;

let t = 0;
const t_sep = 3;


function setup() {
  createCanvas(canvas_w, canvas_h, WEBGL);
  angleMode(DEGREES);

  balls.push(new Ball());
}


function keyTyped() {
  if (key == ' ') {
    warpspeed = !warpspeed;
  } else if (key == 'n') {
    gen_new = !gen_new;
  } else if (key == 'c') {
    recolor = !recolor;
  }
}


function draw() {
  if (!warpspeed) {
    background(30);
  }

  if (balls.length < nballs && t > t_sep && gen_new) {
  	t = 0;

    const ball = new Ball();
    if (recolor) {
      ball.fill = 30;
      ball.min_r = 3;
      ball.max_r = 100;
    }
    balls.push(ball);
  }

  balls = balls.sort((a, b) => ((a.p.z < b.p.z) ? 1 : -1));

  for (let i = balls.length - 1; i >= 0; i--) {
  	const ball = balls[i];

  	ball.update();
    ball.draw();

    if (ball.offscreen()) {
      if (gen_new) {
        balls[i] = new Ball();
        if (recolor) {
          balls[i].fill = 30;
          balls[i].min_r = 3;
          balls[i].max_r = 100;
        }
      } else {
        balls.splice(i, 1);
      }
    }
  }

  t++;
}

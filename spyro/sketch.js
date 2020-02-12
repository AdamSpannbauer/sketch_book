const w = 640;
const h = 480;

const cx = w / 2;
const cy = h / 2;

let delta_r = 0.5;
const max_r = h / 5;
const min_r = h / 10;
let radius = min_r;

const angle = 0;
const spyros = [];
const history = [];
const max_history = 500;


function setup() {
  createCanvas(w, h);
  angleMode(DEGREES);

  s1 = new Spyro(cx, cy, radius, 60, 3);
  s2 = new Spyro(s1.x, s1.y, s1.r, 20, 5);
  // s3 = new Spyro(s2.x, s2.y, s2.r, 10, 3)

  spyros.push(s1);
  spyros.push(s2);
  // spyros.push(s3)
}


function draw() {
  clear();
  background(150);

  if (history.length > max_history) {
    history.splice(0, 1);
  }

  for (const xy of history) {
    r = random(30, 50);
    g = random(130, 150);
    b = random(60, 80);
    stroke(r, g, b);
    fill(r, g, b);
    ellipse(xy.x, xy.y, 15);
  }

  fill(200, 75);
  stroke(170, 30, 70);
  strokeWeight(5);
  ellipse(cx, cy, radius * 2);
  for (let i = 0; i < spyros.length; i++) {
    s = spyros[i];
    if (i > 0) {
      prev_s = spyros[i - 1];
      s.px = prev_s.x;
      s.py = prev_s.y;
      s.pr = prev_s.r;
    } else if (i == 0) {
      s.pr = radius;
      s.r += delta_r * -0.5;
    }
    s.draw();

    if (i == spyros.length - 1) {
      const xy = createVector(s.x, s.y);
      history.push(xy);
    }
  }

  radius += delta_r;
  if (radius >= max_r | radius <= min_r) {
    delta_r *= -1;
  }
}


class Spyro {
  constructor(parent_x, parent_y, parent_radius, radius, angle_speed) {
    this.px = parent_x;
    this.py = parent_y;
    this.pr = parent_radius;
    this.r = radius;
    this.a = 0;
    this.da = angle_speed;

    this.x = 0;
    this.y = 0;

    this.update();
  }

  update() {
    const dx = (this.pr + this.r) * cos(this.a);
    const dy = (this.pr + this.r) * sin(this.a);

    this.x = this.px + dx;
    this.y = this.py + dy;
    this.a += this.da;
  }

  draw() {
    this.update();
    ellipse(this.x, this.y, this.r * 2);
  }
}

const CANVAS_W = 512;
const CANVAS_H = 512;
let FPS_P;

const FLOW_FIELD = [];
const SCL = 0.001;
// const SCL = 0.05;
const SPEED = 2;

const particles = [];
const n_particles = 1000;

let c;

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  FPS_P = createP();
  background(70);

  for (let y = 0; y < height; y++) {
    FLOW_FIELD.push([]);
    for (let x = 0; x < width; x++) {
      const dir = noise(x * SCL, y * SCL) * TWO_PI * 2;
      FLOW_FIELD[y].push(dir);
    }
  }

  for (let i = 0; i < n_particles; i++) {
    const particle = new Particle();
    particles.push(particle);
  }

  const x_buff = width * 0.9
  const y_buff = height * 0.95
  const cp = createVector(random(x_buff, width - x_buff), random(y_buff, height - y_buff));
  const sp = createVector(random(x_buff, width - x_buff), random(y_buff, height - y_buff));
  
  const a = 200;

  c = new Circle(cp, [30, 230, 80, 30], a);
  s = new Square(sp, [230, 30, 80, 30], a);
}


function draw() {
  if (frameCount % 10 == 0) {
    FPS_P.html(frameRate().toFixed(0));
  }

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    particle.update();

    if (particle.is_offscreen()) {
      particles[i] = new Particle();
    } else {
      particle.draw();
      c.draw(particle.p);
      s.draw(particle.p);
    }
  }
}


class Particle {
  constructor() {
    this.p = createVector(random(width), random(height));
    this.r = 1;
    this.fill = [255, 50];
  }

  update() {
    const x = round(this.p.x);
    const y = round(this.p.y);

    let angle;
    let dx;
    let dy;

    try {
      angle = FLOW_FIELD[y][x];
      dx = cos(angle) * SPEED;
      dy = sin(angle) * SPEED;
    } catch (e) {
      dx = 1000;
      dy = 1000;
    }

    this.p.set(x + dx, y + dy);
  }

  is_offscreen() {
    return (this.p.x + this.r < 0
            || this.p.x - this.r > width
            || this.p.y + this.r < 0
            || this.p.y - this.r > height);
  }

  draw() {
    push();
    noStroke();
    fill(this.fill);
    ellipse(this.p.x, this.p.y, this.r * 2, this.r * 2);
    pop();
  }
}


class Shape {
  constructor(p, f) {
    this.p = p;
    this.fill = f;
  }

  is_inside(pt) {
    // pass
  }

  draw(pt) {
    if (!this.is_inside(pt)) {
      return;
    }

    push();
    stroke(this.fill);
    strokeWeight(2);
    point(pt.x, pt.y);
    pop();
  }
}


class Circle extends Shape {
  constructor(p, f, r) {
    super(p, f);
    this.r = r;
  }

  is_inside(pt) {
    return this.r > dist(this.p.x, this.p.y, pt.x, pt.y);
  }
}


class Square extends Shape {
  constructor(p, f, a) {
    super(p, f);
    this.a = a;

    this.x1 = p.x - a;
    this.x2 = p.x + a;
    this.y1 = p.y - a;
    this.y2 = p.y + a;
  }

  is_inside(pt) {
    return (pt.x > this.x1
            && pt.x < this.x2
            && pt.y > this.y1
            && pt.y < this.y2);
  }
}

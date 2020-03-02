const w = 550;
const h = 550;

const yellow = [230, 192, 95];
const light_blue = [81, 134, 129];
const dark_blue = [18, 67, 60];

let y_angle = 0;
const d_y_angle = 0.5;

const dna_step = 40;
const dna_angle_step = 5;

const bars = [];
const bar_width = 140;
const bell_radius = 15;
let bar_midpoint;

const lines = [];
const n_lines = 8;

let inconsolata;
function preload() {
  inconsolata = loadFont('assets/inconsolata.otf');
}

function setup() {
  createCanvas(w, h, WEBGL);
  angleMode(DEGREES);

  textFont(inconsolata);

  const start_y = -h / 2 + dna_step * 2;
  const end_y = -start_y;
  const start_x = bar_width / 2;
  const end_x = start_x + bar_width;
  bar_midpoint = start_x + (end_x - start_x) / 2;

  for (let y = start_y; y <= end_y; y += dna_step) {
    const bar = new BarBell(-bar_width / 2, y, 0,
							  bar_width / 2, y, 0,
							  bell_radius);
    bars.push(bar);
  }

  for (let i = 0; i < n_lines; i++) {
    sine_line = new SineLine(180, -5, 70);
    lines.push(sine_line);
  }
}


function draw() {
  background(yellow);

  push();
  translate(bar_midpoint, 0, 0);
  rotateY(y_angle);
  for (let i = 0; i < bars.length; i++) {
    rotateY(dna_angle_step * i);
    bars[i].draw();
  }
  y_angle += d_y_angle;
  pop();

  push();
  translate(-bar_midpoint, 0, 0);
  rotateY(-y_angle);
  for (let i = 0; i < lines.length; i++) {
    rotateY(10 * i);
    lines[i].draw();
  }
  pop();
}


class SineLine {
  constructor(y, dy, n_step) {
    this.y = y;
    this.ys = [];
    this.xs = [];
    this.zs = [];

    this.amplitude = 30;
    this.text_chance = 0.05;

    this.text_locs = [];
    this.texts = [];

    for (let i = 0; i < n_step; i++) {
      const x = sin(y) * this.amplitude + i;
      const z = cos(y) * this.amplitude + i;

      this.ys.push(y);
      this.xs.push(x);
      this.zs.push(z);

      if (this.text_chance >= random()) {
        let text01 = '1';
        if (random() >= 0.5) {
          text01 = '0';
        }
        this.text_locs.push(createVector(x, y, z));
        this.texts.push(text01);
      } else {
        this.text_locs.push(null);
        this.texts.push(null);
      }

      y += dy;
    }
  }

  draw() {
    for (let i = 0; i < this.ys.length; i++) {
      push();
      if (random() >= 0.8) {
        fill(dark_blue);
        stroke(dark_blue);
      } else {
        fill(light_blue);
        stroke(light_blue);
      }
      translate(this.xs[i], this.ys[i], this.zs[i]);
      strokeWeight(3);
      sphere(5);
      pop();

      if (this.texts[i] != null) {
        const p = this.text_locs[i];
        push();
        textSize(i);
        fill(dark_blue);
        text(this.texts[i], p.x, p.y);
        pop();
      }
    }
  }
}


class BarBell {
  constructor(x1, y1, z1, x2, y2, z2, radius) {
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;

    this.radius = radius;

    this.main_color = dark_blue;
    this.accent_color = light_blue;
  }

  draw() {
    push();
    strokeWeight(10);
    stroke(this.accent_color);
    line(this.x1, this.y1, this.z1,
			 this.x2, this.y2, this.z2);
    pop();

    push();
    strokeWeight(2);
    stroke(this.main_color);
    line(this.x1, this.y1, this.z1,
			 this.x2, this.y2, this.z2);
    pop();

    push();
    translate(this.x1, this.y1, this.z1);
    stroke(this.main_color);
    fill(this.main_color);
    sphere(this.radius);
    pop();

    push();
    translate(this.x2, this.y2, this.z2);
    stroke(this.main_color);
    fill(this.main_color);
    sphere(this.radius);
    pop();
  }
}

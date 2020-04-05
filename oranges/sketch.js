const canvas_w = 512;
const canvas_h = 512;

const oranges = [];
const orange_r = 512 / 56;

let fps_p;


function orange_p(i) {
  return i * orange_r * 2 + orange_r * 2;
}


function setup() {
  createCanvas(canvas_w, canvas_h);
  fps_p = createP();

  for (let y = 0; orange_p(y) < height - orange_r * 2; y++) {
    oranges.push([]);
    for (let x = 0; orange_p(x) < width - orange_r * 4; x++) {
      const p = createVector(
        orange_p(x),
        orange_p(y),
      );

      if (y % 2 == 0) {
        p.x += orange_r;
      }

      const orange = new Orange(p, orange_r);

      oranges[y].push(orange);
    }
  }
}


function draw() {
  background(250);
  fps_p.html(frameRate().toFixed(0));

  for (let y = 0; y < oranges.length; y++) {
    const row = oranges[y];
    for (let x = 0; x < row.length; x++) {
      const orange = row[x];

      orange.update();
      orange.draw();
    }
  }
}


class Orange {
  constructor(p, r) {
    this.p = p;
    this.r = r;
    this.a = this.set_angle();

    this.a_seed = random(100);
    this.a_cum = 0;
    this.a_delta = TWO_PI / (30 * 30);
    this.a_r = 0.8;

    const colors = [
      [200, 120, 30],
      [20, 20, 40],
      [200, 120, 30, 100],
      [20, 20, 40, 100],
      [170, 90, 0],
      [0, 0, 20],
      [200, 120, 30, 50],
      [20, 20, 40, 50],
    ];

    const d = dist(p.x, p.y, width / 2, height / 2);
    let n_colors = floor(map(d, 0, width * 0.7, 2, colors.length + 1));

    if (n_colors > colors.length) {
      n_colors = colors.length;
    }

    if (random() > 0.975) {
      n_colors = floor(random(2, colors.length + 1));
    }

    this.colors = [];
    for (let i = 0; i < n_colors; i++) {
      this.colors.push(colors[i]);
    }

    this.update();
  }

  set_angle() {
    this.a_seed += this.a_delta;
    this.a_cum += this.a_delta;

    if (this.a_cum >= TWO_PI) {
      background(0)
    }

    const a_val_x = cos(this.a_seed) * this.a_r;
    const a_val_y = sin(this.a_seed) * this.a_r;
    const a_val = noise(a_val_x, a_val_y);

    return a_val * TWO_PI * 2;
  }

  update() {
    this.a = this.set_angle();
  }

  draw() {
    push();

    translate(this.p.x, this.p.y);
    rotate(this.a);
    noStroke();

    const scl = TWO_PI / this.colors.length;
    for (let i = 0; i < this.colors.length; i++) {
      const start = i * scl;
      const stop = (i + 1) * scl;

      fill(this.colors[i]);
      arc(0, 0, this.r * 2, this.r * 2, start, stop * 1.001);
    }

    pop();
  }
}

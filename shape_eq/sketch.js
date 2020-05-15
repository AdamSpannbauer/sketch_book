const canvas_w = 512;
const canvas_h = 512;

const polys = [];
const n_rows = 8;
const n_cols = 8;

const r = canvas_w / n_cols * 0.90 / 2;
const step_x = canvas_w / n_cols *0.05;
const step_y = canvas_w / n_rows * 0.05;

let fft;

function preload() {
  // tulpas_song = loadSound('../tulpas_viz/tulpas_arc_1_0/2ulupas.mp3');
  tulpas_song = loadSound('https://raw.githubusercontent.com/AdamSpannbauer/cartel_site_test/master/music/video-1588445896.wav')
}


function setup() {
  createCanvas(canvas_w, canvas_h);

  fft = new p5.FFT(0.8, n_rows * n_cols);
  userStartAudio();
  // tulpas_song.jump(20);
  tulpas_song.loop();

  for (let i = 0; i < n_rows; i++) {
    for (let j = 0; j < n_cols; j++) {
      const x = step_x + r + (2 * step_x + 2 * r) * j;
      const y = step_y + r + (2 * step_y + 2 * r) * i;

      const n_sides = max([i, j]) + 1;
      const poly = new PolygonGroup(x, y, r, n_sides, 4);
      polys.push(poly);
    }
  }
}


function draw() {
  background(40);

  const spectrum = fft.analyze();

  for (let i = 0; i < polys.length; i++) {
    const poly = polys[i];
    poly.update(spectrum[i]);
    poly.draw();
  }
}


class Polygon {
  constructor(x, y, r, n) {
    this.p = createVector(x, y);
    this.n_sides = n;
    this.pts = this.gen_points(r, n);
    this.fill = random(150, 200);
  }

  gen_points(r, n) {
    if (n == 1) {
      return [createVector(0, 0)];
    }

    const pts = [];
    const da = TWO_PI / n;
    for (let a = 0; a <= TWO_PI; a += da) {
      // Start at top
      const adj_a = a - PI / 2;

      const x = cos(adj_a) * r;
      const y = sin(adj_a) * r;

      const pt = createVector(x, y);
      pts.push(pt);
    }

    return pts;
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);
    strokeWeight(3);
    stroke(this.fill);
    noFill();
    beginShape();
    for (const pt of this.pts) {
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);
    pop();
  }
}


class PolygonGroup {
  constructor(x, y, r, n, n_polys) {
    this.p = createVector(x, y);
    this.r = r;
    this.n = n;
    this.n_polys = n_polys;
    this.polys = [];

    this.a_seeds = [];
    this.a_off = 0.001;

    for (let i = 0; i < n_polys; i++) {
      const poly = new Polygon(x, y, r, n);
      this.polys.push(poly);
      this.a_seeds.push(random(100));
    }
  }

  update(x) {
    const max_r = map(x, 0, 255, 1, 10);
    for (let i = 0; i < this.polys.length; i++) {
      const a = noise(this.a_seeds[i]) * TWO_PI * 2;
      this.a_seeds[i] += this.a_off;

      const poly = this.polys[i];

      const dx = cos(a) * random(max_r);
      const dy = cos(a) * random(max_r);
      poly.p.set(this.p.x + dx, this.p.y + dy);
    }
  }

  draw() {
    for (const poly of this.polys) {
      poly.draw();
    }
  }
}

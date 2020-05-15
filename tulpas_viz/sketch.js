const canvas_w = 512;
const canvas_h = 512;

let tulpas_song;
let amp;
let fft;
let vol;

const rings = [];
const n_rings = 30;
let SCL = 0;

function preload() {
  tulpas_song = loadSound('tulpas_arc_1_0/cyber_junkies_flock_together.mp3');
}


function setup() {
  createCanvas(canvas_w, canvas_h);
  userStartAudio();

  tulpas_song.jump(30);
  tulpas_song.loop();

  amp = new p5.Amplitude();

  let parent;
  for (let i = 0; i < n_rings; i++) {
    if (i == 0) {
      parent = null;
    } else {
      parent = rings[i - 1];
    }

    const n_vertices = n_rings - i + 3;
    const ring = new Ring(width / 2, height / 2, (i + 10) * 10, parent, n_vertices);

    if (random() > 0.8) {
      ring.fill = [30, 100, 30]
    }
    rings.push(ring);
  }
}


function draw() {
  background(0);
  vol = amp.getLevel();

  SCL = map(sin((frameCount - 50) * 0.005), -1, 1, 1, 30);

  for (let i = rings.length - 1; i >= 0; i--) {
    rings[i].draw();
  }

  for (const ring of rings) {
    ring.update();
  }
}


class Ring {
  constructor(x, y, d, parent, n) {
    this.p = createVector(x, y);

    this.d = d;
    this.r = d / 2;
    this.parent = parent;

    this.a_seed = random(100);
    this.a_off = 0.001;
    this.a = noise(this.a_seed);

    this.fill = [random(100, 240), random(100, 240), random(100, 240)];

    this.pts = this.gen_points(this.r, n);
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

  update() {
    this.fill = this.fill.map((c) => constrain(c + map(noise(this.a_seed), 0, 1, -1, 1), 30, 255));

    if (this.parent == null) {
      return;
    }

    this.a_seed += this.a_off;
    this.a = noise(this.a_seed) * TWO_PI * 2;

    const p_dd = map(vol, 0, 1, 0, abs(this.r - this.parent.r) * SCL);
    const p_dx = cos(this.a) * p_dd;
    const p_dy = sin(this.a) * p_dd;

    this.p.set(this.parent.p.x + p_dx, this.parent.p.y + p_dy);
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);

    strokeWeight(2);
    fill(this.fill);

    beginShape();
    for (const pt of this.pts) {
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);

    // ellipse(this.p.x, this.p.y, this.d, this.d);
    pop();
  }
}

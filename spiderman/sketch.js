const canvas_w = 512;
const canvas_h = 512;

let torso_im;
const im_w = 190;
let im_h;

let text_im;
const text_w = 130;
let text_h;

const legs = [];
const n_legs = 15;

function preload() {
  torso_im = loadImage('torsoboy.png');
  text_im = loadImage('text.png');
}


function setup() {
  createCanvas(canvas_w, canvas_h);
  imageMode(CENTER);
  im_h = torso_im.height * im_w / torso_im.width;
  text_h = text_im.height * text_w / text_im.width;

  const x_start = width / 2 - 15;
  const x_stop = width / 2 + 40;
  const x_step = (x_stop - x_start) / n_legs;

  const y = height / 2 + 70;
  for (let i = 0; i < n_legs; i++) {
    const x = x_start + i * x_step;
    leg = new Leg(x, y, 10);
    legs.push(leg);
  }
}


function draw() {
  background(240);

  image(torso_im, width / 2, height / 2 - 75, im_w, im_h);
  image(text_im, width / 2 + 150, height / 2 - 100, text_w, text_h);

  for (const leg of legs) {
    leg.draw();
    leg.update();
  }
  const x_start = width / 2 - 20;
  const x_stop = width / 2 + 45;
  const y = height / 2 + 70 - 3;
  strokeWeight(7);
  line(x_start, y, x_stop, y);
}


class Leg {
  constructor(x, y, n_seg) {
    this.p = createVector(x, y);
    this.n_seg = n_seg;

    this.max_len = 30;
    this.min_len = 5;
    this.max_w = 10;
    this.min_w = 2;

    this.f = random(0, 50);

    this.segs = [];
    for (let i = 0; i < n_seg; i++) {
      let p;
      if (i == 0) {
        p = this.p;
      } else {
        p = this.segs[i - 1].p2;
      }

      const len = map(i, 0, n_seg, this.max_len, this.min_len);
      const w = map(i, 0, n_seg, this.max_w, this.min_w);

      const seg = new LegSeg(p, len, w);
      this.segs.push(seg);
    }
  }

  update() {
    for (const seg of this.segs) {
      seg.update();
    }
  }

  draw() {
    for (const seg of this.segs) {
      push();
      stroke(this.f);
      seg.draw();
      pop();
    }
  }
}


class LegSeg {
  constructor(p, len, w) {
    this.p1 = p;
    this.p2 = createVector();
    this.len = len;
    this.w = w;

    this.a = null;
    this.noise = new NoiseLoop(1, 20)

    this.update();
  }

  update() {
    const noise_v = this.noise.v
    this.noise.update()
    this.a = map(noise_v, 0, 1, -PI / 2, PI + PI / 2);

    const dx = cos(this.a) * this.len;
    const dy = sin(this.a) * this.len;

    this.p2.set(this.p1.x + dx, this.p1.y + dy);
  }

  draw() {
    push();
    strokeWeight(this.w);
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    pop();
  }
}

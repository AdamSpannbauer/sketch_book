const canvas_w = 512;
const canvas_h = 512;

const chords = [];
const n_chords = 30;

function setup() {
  createCanvas(canvas_w, canvas_h);
  for (let i = 0; i < n_chords; i++) {
    const chord = new RandChord(width / 2, height / 2, 200);
    chord.c = map(i, 0, n_chords, 0, 255);
    if (i == 0) {
      chord.c = [56, 91, 245];
    } else if (i == 1) {
      chord.c = [255, 28, 142];
    }
    chords.push(chord);
  }
}


function draw() {
  background(255);

  for (const chord of chords) {
    chord.update();
    chord.draw();
  }
}


class RandChord {
  constructor(x, y, r) {
    this.x = x;
    this.y = x;
    this.r = r;

    this.c = 0;

    this.a1_noise_pos = random(100);
    this.a2_noise_pos = random(100);
    this.sw_noise_pos = random(100);

    this.off = 0.001;

    this.a1 = 0;
    this.a2 = PI;
    this.sw = 3;
    this.update();
  }

  map_angle(a) {
    return (map(a, 0, 1, 0, TWO_PI * 2));
  }

  update() {
    this.a1 = this.map_angle(noise(this.a1_noise_pos));
    this.a2 = this.map_angle(noise(this.a2_noise_pos));

    this.sw = map(noise(this.sw_noise_pos), 0, 1, 0.1, 5);

    this.a1_noise_pos += this.off;
    this.a2_noise_pos += this.off;
    this.sw_noise_pos += this.off;
  }

  draw() {
    const x1 = cos(this.a1) * this.r;
    const y1 = sin(this.a1) * this.r;
    const x2 = cos(this.a2) * this.r;
    const y2 = sin(this.a2) * this.r;

    push();
    strokeWeight(this.sw);
    stroke(this.c);
    translate(this.x, this.y);
    line(x1, y1, x2, y2);
    pop();
  }
}

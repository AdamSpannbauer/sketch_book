const canvas_w = 512;
const canvas_h = 512;

const r = canvas_w / 4 / 2;

const eights = [];

function setup() {
  createCanvas(canvas_w, canvas_h);

  const buff = 0;
  for (let y = buff; y <= height - buff; y += 2 * r) {
    for (let x = buff; x <= width - buff; x += 2 * r) {
      const eight = new Eight(x, y, r);
      eights.push(eight);
    }
  }
}


function draw() {
  background(255);
  noFill();
  stroke(0);
  strokeWeight(10);

  for (const eight of eights) {
    eight.draw();
    eight.update();
  }
}


class Eight {
  constructor(x, y, r) {
    this.p = createVector(x, y);
    this.r = r;
    this.ss = [
      new S(x, y, r),
      new S(x, y, r, true),
    ];
  }

  update() {
    for (const s of this.ss) {
      s.update();
    }
  }

  draw() {
    for (const s of this.ss) {
      s.draw();
    }
  }
}


class S {
  constructor(x, y, r, flip) {
    this.p = createVector(x, y);
    this.r = r;
    this.flip = flip || false;

    this.a = 0;

    this.da = TWO_PI / 700;
    if (this.flip) {
      this.da *= -1;
    }

    this.pause = 0;
    this.elapsed = 0;
    this.paused = false;
  }

  update() {
    // pause when circles align
    if (abs(this.a % (PI / 2)) < 0.005 && !this.paused) {
      this.paused = true;
    }

    if (this.paused && this.elapsed <= this.pause) {
      this.elapsed++;
    } else {
      this.paused = false;
      this.elapsed = 0;

      this.a += this.da;

      if (abs(this.a) >= TWO_PI) {
        if (this.a > 0) {
          this.a -= TWO_PI;
        } else {
          this.a += TWO_PI;
        }
      }
    }
  }

  draw() {
    push();

    const { x, y } = this.p;
    const a1 = PI / 2;
    const a2 = -PI / 2;

    let y1 = -this.r;
    let y2 = this.r;

    if (this.flip) {
      [y1, y2] = [y2, y1];
    }

    translate(x, y);
    rotate(this.a);

    arc(0, y1, this.r * 2, this.r * 2, a1, a2);
    arc(0, y2, this.r * 2, this.r * 2, a2, a1);
    pop();
  }
}

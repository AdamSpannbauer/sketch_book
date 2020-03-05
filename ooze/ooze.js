class Ooze {
  constructor(x, y, scale) {
    this.x = x;
    this.y = y;
    this.scale = scale;

    this.pts = [
      createVector(-1, 1),
      createVector(-1, 1),
      createVector(-1 / 2, 2),
      createVector(-1, 3),
      createVector(-1 / 2, 4),
      createVector(1 / 2, 4),
      createVector(1, 3),
      createVector(1 / 2, 2),
      createVector(1, 1),
      createVector(1, 1),
    ];
    this.noise();
    this.oozing = true;
    this.parent = false;

    this.fill = [255, 20];
  }

  noise() {
    for (const pt of this.pts) {
      pt.add(createVector(random(-0.5, 0.3), 0));
    }
  }

  too_small() {
    let left = -Infinity
    let right = Infinity
    for (const pt of this.pts) {
      if (pt.x < 0 && pt.x > left) {
        left = pt.x
      } else if (pt.x > 0 && pt.x < right) {
        right = pt.x
      }
    }

    return (abs(left) + right) < random(0.05, 0.05)
  }


  too_tall() {
    const tt = (pt) => (pt.y * this.scale) > height * 2;
    return this.pts.some(tt);
  }

  update() {
    if (!this.oozing) {
      return;
    }

    if (this.too_small() || this.too_tall()) {
      this.oozing = false;
      return;
    }

    for (const pt of this.pts) {
      // pt.x *= 0.995;
      pt.x *= 0.99;
      if (abs(pt.y) == 1) { continue; }
      // pt.y *= 1.01;
      pt.y *= 1.025;
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    fill(this.fill);
    noStroke();
    beginShape();
    for (const pt of this.pts) {
      const p = pt.copy();
      p.mult(this.scale);
      curveVertex(p.x, p.y);
    }
    endShape();
    pop();
  }
}

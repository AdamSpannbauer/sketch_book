class Ball {
  constructor(r, f) {
    this.r = r;
    this.fill = f;

    this.off = 0.0005;
    this.x_seed = random(100);
    this.y_seed = random(100);
    this.x_scl = width;
    this.y_scl = height;

    this.p = createVector();
    this.update();
  }

  update() {
    this.x_seed += this.off;
    this.y_seed += this.off;

    this.p.x = map(noise(this.x_seed), 0, 1, width / 2 - this.x_scl, width / 2 + this.x_scl)
    this.p.y = map(noise(this.y_seed), 0, 1, height / 2 - this.y_scl, height / 2 + this.y_scl)
  }

  draw() {
    push();

    translate(this.p.x, this.p.y);

    fill(this.fill);
    noStroke();

    ellipse(0, 0, this.r * 2, this.r * 2);

    pop();
  }
}

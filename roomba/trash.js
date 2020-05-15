class Trash {
  constructor(x, y, max_w) {
    this.im = random(trash_ims);

    this.p = createVector(x, y);
    this.a = random(TWO_PI);
    this.w = 1;
    this.h = im_h(this.im, this.w);

    this.max_w = max_w || random(5, 15);
    this.max_t = 30;
    this.t = 1;
    this.dt = random(0.05, 0.5);
    this.update();
  }

  update() {
    if (this.t >= this.max_t) {
      return;
    }

    this.w = map(this.t, 0, this.max_t, 0, this.max_w);
    this.h = im_h(this.im, this.w);
    this.t += this.dt;
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);
    rotate(this.a);
    image(this.im, 0, 0, this.w, this.h);
    pop();
  }
}

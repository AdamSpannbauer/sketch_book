class NoiseLoop {
  constructor(r, len) {
    this.r = r;
    this.len = len;
    this.a = 0;

    // assumes 60 fps and that this.update() is being once per frame
    this.da = TWO_PI / (60 * this.len);

    this.cx = random(100);
    this.cy = random(100);

    this.loop_i = 0;
    this.i;

    this.v = 0;
    this.set_v();
  }

  set_v() {
    const x = cos(this.a) * this.r + this.cx;
    const y = sin(this.a) * this.r + this.cy;
    this.v = noise(x, y);
  }

  update() {
    this.a += this.da;
    this.i++;

    if (this.a >= TWO_PI) {
      this.loop_i++;
      this.a -= TWO_PI;
      print('loop restart')
      background(0)
    }

    this.set_v();
  }
}

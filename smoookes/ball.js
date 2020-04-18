class Ball {
  constructor(cp, min_a, max_a, f, path_d) {
    this.fill = f || color(random(colors));
    this.stroke = this.fill.levels.map((x) => x + 10);

    this.cp = cp;
    this.path_dr = random(0.4, 0.7);
    this.path_r = 0;
    this.path_d = path_d || random(width * 0.1, width * 0.2);
    this.max_path_r = this.path_r + this.path_d;
    this.draw_r = 1;

    this.noise_loop_a = new NoiseLoop(2, 10);
    this.a_off = 0.005;
    this.a = null;
    this.max_a = max_a || random(TWO_PI);
    this.min_a = min_a || this.max_a - TWO_PI / 5;

    this.hist = [];
    this.max_hist = 50;

    this.p = createVector();
    this.update();

    this.done = false;
  }

  update() {
  	if (this.path_r >= this.max_path_r) {
  		this.done = true;
  		return;
  	}

  	this.a = this.noise_loop_a.noise() * (this.max_a - this.min_a) + this.min_a;
  	this.p.x = cos(this.a) * this.path_r;
  	this.p.y = sin(this.a) * this.path_r;

    this.hist.push(this.p.copy());
    if (this.hist.length > this.max_hist) {
      this.hist.splice(0, 1);
    }

  	this.path_r += this.path_dr;
  }

  draw() {
    if (this.done) {
      return;
    }

  	push();
  	translate(this.cp.x, this.cp.y);
  	fill(this.fill);
    noStroke();

    for (const p of this.hist) {
      ellipse(p.x, p.y, this.draw_r * 2, this.draw_r * 2);
    }
  	pop();
  }
}

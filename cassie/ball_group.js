class BallGroup {
  constructor(cp, min_a, max_a, f, path_d) {
    this.cp = cp;
    this.fill = color(f);
    this.min_a = min_a;
    this.max_a = max_a;
    this.path_d = path_d || random(width * 0.1, width * 0.2);

    this.n = random(20, 40);

    this.balls = [];
    for (let i = 0; i < this.n; i++) {
      const d = this.path_d + random(this.path_d * 0.7, this.path_d * 1.2)
      const c = color(
        this.fill.levels.map((x) => x + random(-20, 20))
      );
      c.setAlpha(this.fill._getAlpha())

      const ball = new Ball(cp, min_a, max_a, c, d);
      this.balls.push(ball);
    }

    this.done = false;
  }

  update() {
    if (this.done) {
      return
    }

    let n_to_finish = 0
    for (const ball of this.balls) {
      ball.update();
      n_to_finish += !ball.done
    }

    if (n_to_finish == 0) {
      this.done = true
    }
  }

  draw() {
    if (this.done) {
      return
    }

    for (const ball of this.balls) {
      ball.draw();
    }
  }
}

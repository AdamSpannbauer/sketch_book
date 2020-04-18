class Circle {
  constructor(r, n, p) {
    this.r = r || random(width / 20, width / 3);
    this.n = n || random(3, 15);
    this.p = p || createVector(width / 2, height / 2);

    this.pts = this.gen_points(this.r, this.n);
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


  draw() {
    push();
    translate(this.p.x, this.p.y);

    beginShape();
    for (const pt of this.pts) {
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);

    pop();
  }
}

class Leader extends Ball {
  constructor(r, f) {
    super(r, f);
    this.off = 0.01;

    this.p.set(-10, -10);
  }

  update() {
    this.p.x += 0.5
    this.p.y += 0.5
  }
}

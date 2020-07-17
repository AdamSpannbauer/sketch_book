class Follower extends Ball {
  constructor(r, f) {
    const fill_color = color(f);
    const [cr, cg, cb, ca] = fill_color.levels;

    const d = 10;
    const noisy_fill = [
      cr + random(-d, d),
      cg + random(-d, d),
      cb + random(-d, d),
      ca,
    ];

    super(r, noisy_fill);

    this.x_scl = width;
    this.y_scl = height;

    this.vision = 50;
    this.has_leader = false;
    this.leader = null;
  }

  look_for_leader(leaders) {
    for (const leader of leaders) {
      const d = dist(leader.p.x, leader.p.y, this.p.x, this.p.y);
      const thresh = leader.r + this.r + this.vision;

      if (d <= thresh) {
        this.has_leader = true;
        this.leader = leader;
      }
    }
  }

  update() {
    if (!this.has_leader) {
      super.update();
    } else {
      const d = dist(this.leader.p.x, this.leader.p.y, this.p.x, this.p.y);
      const thresh = this.leader.r + this.r + this.vision;

      let dx = this.leader.p.x - this.p.x;
      let dy = this.leader.p.y - this.p.y;
      if (d > thresh) {
        dx = map(dx, -width, width, -5, 5);
        dy = map(dy, -height, height, -5, 5);
      } else {
        dx = constrain(dx, -0.1, 0.1);
        dy = constrain(dy, -0.1, 0.1);
      }

      this.p.x += dx;
      this.p.y += dy;
    }
  }
}

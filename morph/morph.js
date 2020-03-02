class Morph {
  constructor() {
    this.pts_a = null;
    this.pts_b = null;

    this.morphed_end_pts = [];
    this.morphed_pts = [];

    this.steps = 30;
    this.step = 0;

    this.morphing = false;
  }

  find_closest() {
    const n_pts_a = new Set(this.pts_a).size
    const n_pts_b = new Set(this.pts_b).size

    let outer_pts;
    let inner_pts;

    if (n_pts_a < n_pts_b) {
      outer_pts = this.pts_b
      inner_pts = this.pts_a
    } else {
      outer_pts = this.pts_a
      inner_pts = this.pts_b
    }

    this.morphed_end_pts = Array(this.pts_a.length).fill(this.pts_b[0]);

    for (let i = 0; i < outer_pts.length; i++) {
      const pt1 = outer_pts[i];

      let min_dist = Infinity;
      for (const pt2 of inner_pts) {
        const d = dist(pt1.x, pt1.y, pt2.x, pt2.y);

        if (d < min_dist) {
          min_dist = d;
          if (n_pts_a < n_pts_b) {
            this.morphed_end_pts[i] = pt1;
          } else {
            this.morphed_end_pts[i] = pt2;
          }
        }
      }
    }
  }

  morph() {
    const n_pts = this.pts_a.length;
    this.morphed_pts = Array(n_pts).fill(createVector());

    for (let i = 0; i < n_pts; i++) {
      const pt_a = this.pts_a[i];
      const pt_a_end = this.morphed_end_pts[i];

      const morphed_x = round(map(this.step, 0, this.steps, pt_a.x, pt_a_end.x), 5);
      const morphed_y = round(map(this.step, 0, this.steps, pt_a.y, pt_a_end.y), 5);

      this.morphed_pts[i] = createVector(morphed_x, morphed_y);
    }

    this.step++;

    if (this.step > this.steps) {
      this.morphing = false;
      this.step = 0;
    } else {
      this.morphing = true;
    }
  }
}

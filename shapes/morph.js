function reverse_map(obj) {
  const reversed = {};
  Object.keys(obj).forEach((key) => {
    reversed[obj[key]] = reversed[obj[key]] || [];
    reversed[obj[key]].push(key);
  });

  return reversed;
}


class Morph {
  constructor(pts_a, pts_b) {
    // Two sets of pts to morph between
    this.pts_a = pts_a;
    this.pts_b = pts_b;

    const n_pts_a = new Set(this.pts_a).size;
    const n_pts_b = new Set(this.pts_b).size;
    this.a_is_smaller = n_pts_a < n_pts_b;

    if (this.a_is_smaller) {
      throw "A must have more pts than B";
    }

    // Storage for end goal locations of morph
    this.morphed_end_pts = [];

    // Pt locations at current time in transition
    this.morphed_pts = this.pts_a.slice();

    // For animating morph between
    // How many steps/frames to change
    this.steps = 30;
    this.step = 0;

    // Is morph still going or complete?
    this.morphing = true;

    this.pt_map = {};
    this.find_closest();
  }

  find_closest() {
    this.morphed_end_pts = [];

    // Going to loop through both sets of points to calulate pairwise distances
    // Making the larger of the 2 groups the outer loop
    let outer_pts;
    let inner_pts;

    if (this.a_is_smaller) {
      [outer_pts, inner_pts] = [this.pts_b, this.pts_a];
    } else {
      [outer_pts, inner_pts] = [this.pts_a, this.pts_b];
    }

    for (let i = 0; i < outer_pts.length; i++) {
      const pt1 = outer_pts[i];
      let min_d = Infinity;
      for (let j = 0; j < inner_pts.length; j++) {
        const pt2 = inner_pts[j];
        const d = dist(pt1.x, pt1.y, pt2.x, pt2.y);

        if (d < min_d) {
          min_d = d;
          this.pt_map[i] = j;
        }
      }
    }




    if (this.a_is_smaller) {
      //TODO: DOESN'T WORK...
      const pt_map = reverse_map(this.pt_map);
      const pts_a_og = this.pts_a.slice()
      this.pts_a = [];
      for (let i = 0; i < pts_a_og.length; i++) {
        const pt_b_ids = pt_map[i]
        for (let pt_b_i of pt_b_ids) {
          const pt_b = this.pts_b[pt_b_i];
          
          this.pts_a.push(pts_a_og[i]);
          this.morphed_end_pts.push(pt_b);
        }
      }
    } else {
      for (let i = 0; i < this.pts_a.length; i++) {
        const pt_b_i = this.pt_map[i];
        const pt_b = this.pts_b[pt_b_i];
        this.morphed_end_pts.push(pt_b);
      }
    }


    // // Find closest point in b for every pt in a
    // for (let i = 0; i < outer_pts.length; i++) {
    //   const pt1 = outer_pts[i];
    //   let min_dist = Infinity;
    //   let cand_pt;
    //   for (const pt2 of inner_pts) {
    //     const d = dist(pt1.x, pt1.y, pt2.x, pt2.y);

    //     if (d < min_dist) {
    //       min_dist = d;

    //       if (a_is_smaller) {
    //         cand_pt = pt1;
    //       } else {
    //         cand_pt = pt2;
    //       }

    //       this.morphed_end_pts[i] = cand_pt;
    //     }
    //   }
    // }
  }

  morph() {
    if (!this.morphing) {
      return;
    }

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

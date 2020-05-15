function simplify_angle(angle) {
  angle %= TWO_PI;
  if (angle < 0) angle += TWO_PI;
  return angle;
}


class Roomba {
  constructor() {
    this.im = roomba_im;

    this.p = createVector();
    this.closest_p = createVector();
    this.v = createVector();

    this.w = 100;
    this.h = im_h(this.im, this.w);

    this.angle = 0;
    this.goal_angle;
    this.max_angle_change = PI / 50;

    this.update([]);

    this.got_one = false;
  }

  update(trash) {
    this.move();

    let min_d = Infinity;
    this.got_one = false;
    for (let i = trash.length - 1; i > -1; i--) {
      const piece = trash[i];
      const d = dist(piece.p.x, piece.p.y, this.p.x, this.p.y);
      if (d <= this.h / 2 * 0.9) {
        trash.splice(i, 1);
        this.got_one = true;
      } else if (d < min_d) {
        min_d = d;
        this.closest_p = piece.p.copy();
      }
    }
  }

  move() {
    this.v = p5.Vector.sub(this.closest_p, this.p);
    this.v.limit(1);

    const old_p = this.p.copy();
    const new_p = this.p.copy();
    new_p.add(this.v);

    this.goal_angle = createVector(new_p.x - old_p.x, new_p.y - old_p.y).heading();

    this.goal_angle = simplify_angle(this.goal_angle);
    this.angle = simplify_angle(this.angle);

    const abs_diff = abs(this.angle - this.goal_angle);
    const abs_da = constrain(abs_diff, 0, this.max_angle_change);
    let da = abs_da;
    if (this.angle < this.goal_angle && abs_diff >= PI) {
      da = -abs_da;
    } else if (this.angle >= this.goal_angle && abs_diff < PI) {
      da = -abs_da;
    }

    this.angle += da;
    if (abs(this.goal_angle - this.angle) < PI / 10) {
      this.p.set(new_p.x, new_p.y);
    }
  }

  draw() {
    push();
    translate(this.p.x, this.p.y);
    rotate(this.angle);
    noStroke();

    const w = this.w * 0.95;
    const h = this.h * 0.95;

    ellipse(0, 0, w, h);
    image(this.im, 0, 0, this.w, this.h);
    pop();
  }
}

const canvas_w = 512;
const canvas_h = 512;

const tris = [];
const max_tris = 200;
const home_switch = 500;
let home_count = 0;
let go_home = false;

const bg_def = [60, 140, 210];
const bg_gh = [60, 210, 140];
let bg = bg_def;

function setup() {
  createCanvas(canvas_w, canvas_h);

  const l = 80;
  const h = l * sqrt(3) / 2;
  const x = width / 2;
  const y = height / 2 - h / 2;

  const p1 = createVector(x - l / 2, y + h);
  const p2 = createVector(x + l / 2, y + h);
  const p3 = createVector(x, y);

  const tri = new GrowTriangle(p1, p2, p3);
  tris.push(tri);
}


function draw() {
  clear();

  if (go_home) {
    bg = [
      map(home_count, 0, home_switch, bg_gh[0], bg_def[0]),
      map(home_count, 0, home_switch, bg_gh[1], bg_def[1]),
      map(home_count, 0, home_switch, bg_gh[2], bg_def[2]),
    ];
  } else {
    bg = [
      map(home_count, 0, home_switch, bg_def[0], bg_gh[0]),
      map(home_count, 0, home_switch, bg_def[1], bg_gh[1]),
      map(home_count, 0, home_switch, bg_def[2], bg_gh[2]),
    ];
  }

  background(bg);

  for (const tri of tris) {
    tri.go_home = go_home;
    tri.draw();

    if (!tri.growing & !tri.parent) {
      const [p1, p2, p3] = tri.create_child();
      const child = new GrowTriangle(p1, p2, p3);
      tris.push(child);

      if (tris.length > max_tris) {
        tris.splice(0, 1);
      }
    }
  }

  if (home_count >= home_switch) {
    home_count = 0;
    go_home = !go_home;
  }

  home_count++;
}


class GrowTriangle {
  constructor(p1, p2, p3, n_steps) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;

    this.l = sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    this.h = this.l * sqrt(3) / 2;

    this.midpoint = this.find_midpoint(p1, p2);
    this.full_dx = p3.x - this.midpoint.x;
    this.full_dy = p3.y - this.midpoint.y;

    this.n_steps = n_steps || 50;

    this.growing = true;
    this.parent = false;

    this.fill = [255, 255, 255, 255];
    this.stroke = [0, 0, 0, 255];
    this.age = 0;
    this.max_age = 200;
    this.go_home = false;
  }

  find_midpoint(p1, p2) {
    const dx = (p2.x - p1.x) / 2;
    const dy = (p2.y - p1.y) / 2;
    const mp = createVector(p1.x + dx, p1.y + dy);

    return (mp);
  }

  draw() {
    push();
    this.fill[3] = map(this.age, 0, this.max_age, 255, 0);
    this.stroke[3] = map(this.age, 0, this.max_age, 255, 0);
    fill(this.fill);
    stroke(this.stroke);

    if (this.growing) {
      const dx = map(this.age, 0, this.n_steps, 0, this.full_dx);
      const dy = map(this.age, 0, this.n_steps, 0, this.full_dy);
      let p3 = createVector(this.midpoint.x + dx, this.midpoint.y + dy);

      if (this.age >= this.n_steps) {
        this.growing = false;
        p3 = this.p3;
      }

      triangle(this.p1.x, this.p1.y,
				     this.p2.x, this.p2.y,
				     p3.x, p3.y);
    } else {
      triangle(this.p1.x, this.p1.y,
				     this.p2.x, this.p2.y,
				     this.p3.x, this.p3.y);
    }

    this.age++;
    pop();
  }

  create_child() {
    this.parent = true;
    let child;

    if (this.go_home) {
      const target = createVector(width / 2, height / 2);
      child = this.create_guided_child(target);
    } else {
      child = this.create_rand_child();
    }

    return (child);
  }

  create_rand_child() {
    let ps = shuffle([this.p1, this.p2, this.p3]);
    const [p1, p2, p3] = this.reflect(ps);

    const max_tries = 3;
    let tries = 0;
    while (tries < max_tries & (p3.x > width | p3.x < 0 | p3.y > height | p3.y < 0)) {
      ps = shuffle([this.p1, this.p2, this.p3])
        [p1, p2, p3] = this.reflect(ps);
      tries++;
    }

    return ([p1, p2, p3]);
  }

  reflect(ps) {
    // reflect p3 across p1 <-> p2
    const [p1, p2, p3] = ps;

    const dx = p1.x - p3.x;
    const dy = p1.y - p3.y;
    const p4 = createVector(p2.x + dx, p2.y + dy);

    return ([p1, p2, p4]);
  }

  dist_sum(target, ps) {
    let total = 0;
    for (const p of ps) {
      total += sqrt((target.x - p.x) ** 2 + (target.y - p.y) ** 2);
    }

    return (total);
  }

  create_guided_child(target) {
    const ps = [this.p1, this.p2, this.p3];
    const curr_dist = this.dist_sum(target, ps);

    let child = this.reflect(ps);
    if (curr_dist > this.dist_sum(target, child)) {
      return (child);
    }

    child = this.reflect([this.p2, this.p3, this.p1]);
    if (curr_dist > this.dist_sum(target, child)) {
      return (child);
    }

    child = this.reflect([this.p3, this.p1, this.p2]);
    if (curr_dist > this.dist_sum(target, child)) {
      return (child);
    }

    return (ps);
  }
}

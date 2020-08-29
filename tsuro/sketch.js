const canvas_w = 512;
const canvas_h = 512;

const tiles = [];

const w = canvas_w / 8;

let t = 0;
const t_thresh = 120;
let even_odd = false;
let rotating = false;


function sign(x) {
  return abs(x) / x;
}


function round_to(x, n) {
  const quo = x / n;
  if (x > 0) return Math.ceil(quo) * n;
  if (x < 0) return Math.floor(quo) * n;
  return 0;
}


function my_round(num, dec) {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}


function setup() {
  createCanvas(canvas_w, canvas_h);

  for (let y = 0; y <= height; y += w) {
    for (let x = 0; x <= width; x += w) {
      const row = round(y / w);
      const col = round(x / w);
      tile = new Tile(x + w / 2, y + w / 2, w, row, col);
      tiles.push(tile);
    }
  }
}


function draw() {
  background(color('#02182B'));
  stroke(color('#0197F6'));
  strokeWeight(4);

  if (t > t_thresh && !rotating) {
    even_odd = !even_odd;
  }

  for (const tile of tiles) {
    tile.update();
    tile.draw();

    if (t > t_thresh && !rotating && ((tile.row + tile.col) % 2 == even_odd)) {
      if (even_odd) {
        tile.goal_a = tile.a - PI / 2;
      } else {
        tile.goal_a = tile.a + PI / 2;
      }
      tile.rotating = true;
    }
  }

  rotating = false;
  for (const tile of tiles) {
    rotating = rotating || tile.rotating;
  }

  if (!rotating) {
    t++;
  } else {
    t = 0;
  }
}


class Tile {
  constructor(x, y, w, row, col) {
    this.x = x;
    this.y = y;
    this.w = w;

    this.a = 0;
    this.goal_a = 0;
    this.da = 0.01;
    this.rotating = false;

    this.row = row;
    this.col = col;

    this.exits = this.gen_exits();
    this.paths = this.gen_paths();
  }

  gen_exits() {
    // top
    const p1 = createVector(-this.w / 4, -this.w / 2);
    const p2 = createVector(this.w / 4, -this.w / 2);

    // right
    const p3 = createVector(this.w / 2, -this.w / 4);
    const p4 = createVector(this.w / 2, this.w / 4);

    // bottom
    const p5 = createVector(this.w / 4, this.w / 2);
    const p6 = createVector(-this.w / 4, this.w / 2);

    // left
    const p7 = createVector(-this.w / 2, this.w / 4);
    const p8 = createVector(-this.w / 2, -this.w / 4);

    return ([p1, p2, p3, p4, p5, p6, p7, p8]);
  }

  gen_inner_pt(p) {
    const p_in = createVector();
    if (abs(p.x) == this.w / 2) {
      p_in.x = random(0.3, 0.5) * p.x;
      p_in.y = p.y;
    } else if (abs(p.y) == this.w / 2) {
      p_in.x = p.x;
      p_in.y = random(0.3, 0.5) * p.y;
    }

    return (p_in);
  }

  gen_path(p1, p2) {
    const path = [];
    const p1_in = this.gen_inner_pt(p1);
    const p2_in = this.gen_inner_pt(p2);

    path.push(p1.copy());
    path.push(p1.copy());
    path.push(p1_in.copy());
    path.push(p2_in.copy());
    path.push(p2.copy());
    path.push(p2.copy());

    return (path);
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return (a);
  }

  gen_pairs(a) {
    const a_copy = [...a];
    this.shuffle(a_copy);

    const pairs = [];
    while (a_copy.length > 0) {
      pairs.push(a_copy.splice(0, 2));
    }

    return (pairs);
  }

  gen_paths() {
    const pairs = this.gen_pairs(this.exits);
    const paths = [];

    for (const pair of pairs) {
      const path = this.gen_path(pair[0], pair[1]);
      paths.push(path);
    }

    return (paths);
  }

  draw_path(path) {
    beginShape();
    for (const p of path) {
      curveVertex(p.x, p.y);
    }
    endShape();
  }

  update() {
    if (this.a != this.goal_a) {
      const d = sign(this.goal_a - this.a);
      const da = this.da * d;
      this.a += da;
      this.rotating = true;

      if ((d < 0 && this.a < this.goal_a) || (d > 0 && this.a > this.goal_a)) {
        this.a = this.goal_a;
        this.rotating = false;
      }
    } else {
      this.rotating = false;
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.a);

    noFill();
    for (const path of this.paths) {
      this.draw_path(path);
    }
    pop();
  }
}

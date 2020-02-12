const w = 640;
const h = 480;

const radius = 30;
const step = radius * 2;

const arcs = [];


function setup() {
  createCanvas(w, h);
  angleMode(DEGREES);

  let i = 0;
  for (let x = 0; x <= w + step; x += step) {
    let j = 0;
    for (let y = 0; y <= h + step; y += step) {
      const a = new TesselArc(x, y, radius, 0, 270, j, i);
      arcs.push(a);
      j++;
    }
    i++;
  }
}

function draw() {
  clear();
  background(200);
  noFill();
  strokeWeight(15);
  stroke(30, 80, 30);

  const x = frameCount % 360;
  for (const a of arcs) {
    const is_group_a = (a.row % 2 == 0 & a.col % 2 == 1
                          | a.row % 2 == 1 & a.col % 2 == 0);
    const is_group_b = !is_group_a;

    if (is_group_a) {
      fill(0);
    } else if (is_group_b) {
      fill(255);
    }

    if (x <= 90 & is_group_a) {
      a.angle += 1;
    } else if (x > 90 & x <= 180 & is_group_b) {
      a.angle -= 1;
    }

    a.draw();
  }
}


class TesselArc {
  constructor(x, y, radius, start_angle, stop_angle, row, col) {
    this.x = x;
    this.y = y;
    this.r = radius;
    this.a1 = start_angle;
    this.a2 = stop_angle;
    this.row = row;
    this.col = col;

    this.angle = 0;
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    arc(0, 0, this.r * 2, this.r * 2, 0, 270);
    pop();
  }
}
